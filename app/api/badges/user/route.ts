import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/badges/user - Kullanıcının rozetlerini döner
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const userBadges = await db.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    // Displayed badges (max 3)
    const displayedBadges = userBadges
      .filter((ub) => ub.isDisplayed)
      .slice(0, 3)
      .map((ub) => ub.badge);

    return NextResponse.json({
      badges: userBadges.map((ub) => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
        isDisplayed: ub.isDisplayed,
      })),
      displayedBadges,
      totalCount: userBadges.length,
    });
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return NextResponse.json(
      { error: "Rozetler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

