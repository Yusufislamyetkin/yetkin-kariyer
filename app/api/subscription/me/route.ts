import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/services/subscription-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const subscription = await getUserSubscription(userId);

    return NextResponse.json({
      subscription: subscription,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_ME] Error:", error);
    return NextResponse.json(
      { error: "Abonelik bilgileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
