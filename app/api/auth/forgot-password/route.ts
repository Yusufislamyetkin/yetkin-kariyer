import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 requests per 15 minutes per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: "Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Security: Always return the same message whether user exists or not
    // This prevents email enumeration attacks
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json(
        {
          message:
            "Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama linki e-posta adresinize gönderilmiştir.",
        },
        { status: 200 }
      );
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Don't expose email service errors to user
      // Still return success to prevent information leakage
    }

    return NextResponse.json(
      {
        message:
          "Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama linki e-posta adresinize gönderilmiştir.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Geçersiz e-posta adresi" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}

