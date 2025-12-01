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

    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { message: "Geçersiz istek formatı. Lütfen tekrar deneyin." },
        { status: 400 }
      );
    }

    // Validate email
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0]?.message || "Geçersiz e-posta adresi" },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user by email
    let user;
    try {
      user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (dbError) {
      console.error("Database error while finding user:", dbError);
      return NextResponse.json(
        { message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
        { status: 500 }
      );
    }

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
    try {
      await db.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        },
      });
    } catch (dbError) {
      console.error("Database error while updating user:", dbError);
      return NextResponse.json(
        { message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
        { status: 500 }
      );
    }

    // Send password reset email
    let emailSent = false;
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      emailSent = true;
      console.log(`Password reset email sent successfully to: ${user.email}`);
    } catch (emailError: any) {
      console.error("Failed to send password reset email:", {
        error: emailError?.message,
        stack: emailError?.stack,
        email: user.email,
        errorType: emailError?.constructor?.name,
      });
      
      // Log specific error types for debugging
      if (emailError?.message?.includes("RESEND_API_KEY")) {
        console.error("CRITICAL: RESEND_API_KEY is not configured in environment variables!");
      }
      if (emailError?.message?.includes("domain")) {
        console.error("CRITICAL: Email domain not verified in Resend!");
      }
      
      // Don't expose email service errors to user (security best practice)
      // Still return success to prevent information leakage
      // But log the error for admin review
      emailSent = false;
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
    console.error("Error stack:", error?.stack);
    console.error("Error message:", error?.message);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Geçersiz e-posta adresi" },
        { status: 400 }
      );
    }

    // Return generic error message
    return NextResponse.json(
      { message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}

