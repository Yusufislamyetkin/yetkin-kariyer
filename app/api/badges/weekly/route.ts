import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkWeeklyBadgeEligibility, awardWeeklyBadge } from "../check/weekly-badge-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Check eligibility
    const eligibility = await checkWeeklyBadgeEligibility({ userId });

    // If eligible, award badge
    let badgeAwarded = false;
    if (eligibility.eligible) {
      badgeAwarded = await awardWeeklyBadge(userId);
    }

    return NextResponse.json({
      eligible: eligibility.eligible,
      daysCompleted: eligibility.daysCompleted,
      totalDays: eligibility.totalDays,
      weekStart: eligibility.weekStart.toISOString(),
      weekEnd: eligibility.weekEnd.toISOString(),
      badgeAwarded,
    });
  } catch (error) {
    console.error("Error checking weekly badge:", error);
    return NextResponse.json(
      { error: "Haftalık rozet kontrolü sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Check eligibility and award badge
    const eligibility = await checkWeeklyBadgeEligibility({ userId });
    
    if (!eligibility.eligible) {
      return NextResponse.json(
        { error: "Haftalık rozet için yeterli gün tamamlanmadı" },
        { status: 400 }
      );
    }

    const badgeAwarded = await awardWeeklyBadge(userId);

    return NextResponse.json({
      success: badgeAwarded,
      message: badgeAwarded ? "Haftalık rozet kazandınız!" : "Bu hafta zaten rozet kazandınız",
    });
  } catch (error) {
    console.error("Error awarding weekly badge:", error);
    return NextResponse.json(
      { error: "Haftalık rozet verilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

