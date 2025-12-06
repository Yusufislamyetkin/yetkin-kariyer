import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateDailyLoginStreak } from "@/lib/services/gamification/streaks";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET() {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update login streak - this function already handles duplicate calls for the same day
    const streakUpdate = await updateDailyLoginStreak(userId);

    return NextResponse.json({
      success: true,
      streak: streakUpdate,
    });
  } catch (error) {
    console.error("Error tracking login:", error);
    return NextResponse.json(
      { error: "Giriş takibi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

