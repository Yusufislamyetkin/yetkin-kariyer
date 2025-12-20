import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { guestPurchaseSchema } from "@/lib/validations";
import { createSubscription } from "@/lib/services/subscription-service";
import { sendAccountCredentialsEmail } from "@/lib/email";
import { SubscriptionPlanType } from "@prisma/client";

// Generate a random password
function generateRandomPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = guestPurchaseSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    let user;
    let isNewUser = false;
    let generatedPassword = "";

    if (existingUser) {
      // User exists, use existing user
      user = existingUser;
    } else {
      // Create new user
      isNewUser = true;
      generatedPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      user = await db.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: "candidate",
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }

    // Create subscription
    const subscription = await createSubscription(
      user.id,
      validatedData.planType as SubscriptionPlanType,
      validatedData.durationMonths || 12
    );

    // Send email with credentials (only for new users)
    if (isNewUser && generatedPassword) {
      try {
        await sendAccountCredentialsEmail(
          user.email,
          user.name,
          generatedPassword,
          validatedData.planType
        );
      } catch (emailError) {
        console.error("[GUEST_PURCHASE] Email send error:", emailError);
        // Don't fail the purchase if email fails, but log it
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isNewUser,
      },
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  } catch (error: any) {
    console.error("[GUEST_PURCHASE] Error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Satın alma işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
