import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const quizAttemptId = params.id;

    // Get quiz attempt to find completion time
    const quizAttempt = await db.quizAttempt.findUnique({
      where: { id: quizAttemptId },
      select: {
        id: true,
        userId: true,
        completedAt: true,
      },
    });

    if (!quizAttempt || quizAttempt.userId !== userId) {
      return NextResponse.json(
        { error: "Test denemesi bulunamadı" },
        { status: 404 }
      );
    }

    // If quiz attempt doesn't have completedAt, it's not completed yet
    if (!quizAttempt.completedAt) {
      return NextResponse.json({
        newlyEarnedBadges: [],
        totalEarned: 0,
      });
    }

    // Find badges earned after quiz completion
    // We check badges created within 10 seconds after quiz completion to account for timing
    const completionTime = new Date(quizAttempt.completedAt);
    const checkStartTime = new Date(completionTime.getTime() - 5000); // 5 seconds before completion
    const checkEndTime = new Date(completionTime.getTime() + 10000); // 10 seconds after completion

    console.log("[BadgeCheckAPI] Checking badges for quizAttempt:", {
      quizAttemptId,
      userId,
      completionTime: completionTime.toISOString(),
      checkStartTime: checkStartTime.toISOString(),
      checkEndTime: checkEndTime.toISOString(),
    });

    // Get user badges created around the quiz completion time
    const userBadges = await db.userBadge.findMany({
      where: {
        userId,
        createdAt: {
          gte: checkStartTime,
          lte: checkEndTime,
        },
      },
      include: {
        badge: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("[BadgeCheckAPI] Found user badges:", {
      count: userBadges.length,
      badges: userBadges.map((ub: any) => ({
        badgeId: ub.badgeId,
        badgeName: ub.badge.name,
        createdAt: ub.createdAt.toISOString(),
      })),
    });

    // Format badges for response
    const newlyEarnedBadges = userBadges.map((userBadge: any) => ({
      id: userBadge.badge.id,
      name: userBadge.badge.name,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon,
      color: userBadge.badge.color,
      category: userBadge.badge.category,
      rarity: userBadge.badge.rarity,
      tier: userBadge.badge.tier,
      points: userBadge.badge.points,
    }));

    return NextResponse.json({
      newlyEarnedBadges,
      totalEarned: newlyEarnedBadges.length,
    });
  } catch (error) {
    console.error("[BadgeCheckAPI] Error checking badges:", error);
    return NextResponse.json(
      { error: "Rozet kontrolü sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

