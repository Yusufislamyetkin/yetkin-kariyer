import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUserSubscription } from "@/lib/services/subscription-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const subscription = await checkUserSubscription(userId);

    return NextResponse.json({
      hasActiveSubscription: subscription !== null && subscription.isActive,
      subscription: subscription,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_CHECK] Error:", error);
    return NextResponse.json(
      { error: "Abonelik kontrolü yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
