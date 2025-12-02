import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/profile/[userId]/badges - Kullanıcının rozetleri (public)
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Get all badges from database
    const allBadges = await db.badge.findMany({
      orderBy: [
        { rarity: "asc" },
        { points: "desc" },
      ],
    });

    // Get user's earned badges
    const userBadges = await db.userBadge.findMany({
      where: { userId: params.userId },
      include: {
        badge: true,
      },
      orderBy: [
        { isDisplayed: "desc" },
        { earnedAt: "desc" },
      ],
    });

    // Create a map of earned badges for quick lookup
    const earnedBadgesMap = new Map(
      userBadges.map((ub: { badge: any; earnedAt: Date; isDisplayed: boolean }) => [
        ub.badge.id,
        {
          earnedAt: ub.earnedAt,
          isDisplayed: ub.isDisplayed,
        },
      ])
    );

    // Combine all badges with earned status
    const badgesWithStatus = allBadges.map((badge: any) => {
      const earnedInfo = earnedBadgesMap.get(badge.id) as { earnedAt: Date; isDisplayed: boolean } | undefined;
      return {
        ...badge,
        earnedAt: earnedInfo?.earnedAt || null,
        isDisplayed: earnedInfo?.isDisplayed || false,
      };
    });

    // Get displayed badges (max 3)
    const displayedBadges = userBadges
      .filter((ub: { isDisplayed: boolean }) => ub.isDisplayed)
      .slice(0, 3)
      .map((ub: { badge: any }) => ub.badge);

    return NextResponse.json({
      badges: badgesWithStatus,
      displayedBadges,
      totalCount: allBadges.length,
      earnedCount: userBadges.length,
    });
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return NextResponse.json(
      { error: "Rozetler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

