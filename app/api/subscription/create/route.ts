import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSubscription } from "@/lib/services/subscription-service";
import { SubscriptionPlanType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planType, durationMonths } = body;

    if (!planType || !["TEMEL", "PRO", "VIP"].includes(planType)) {
      return NextResponse.json(
        { error: "Geçersiz plan türü" },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;
    const subscription = await createSubscription(
      userId,
      planType as SubscriptionPlanType,
      durationMonths || 12
    );

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_CREATE] Error:", error);
    return NextResponse.json(
      { error: "Abonelik oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
