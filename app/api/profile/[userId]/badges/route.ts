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

    // Get displayed badges (max 3)
    const displayedBadges = userBadges
      .filter((ub: { isDisplayed: boolean }) => ub.isDisplayed)
      .slice(0, 3)
      .map((ub: { badge: any }) => ub.badge);

    return NextResponse.json({
      badges: userBadges.map((ub: { badge: any; earnedAt: Date; isDisplayed: boolean }) => ({
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

