import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

type ActivityType = "test" | "quiz" | "lesson" | "live-coding" | "bugfix" | "social";

interface BadgeCheckParams {
  activityType: ActivityType;
  activityId?: string; // Optional: quizAttemptId, lessonId, etc.
  completionTime: string; // ISO string
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await request.json();
    const { activityType, activityId, completionTime } = body as BadgeCheckParams;

    if (!activityType || !completionTime) {
      return NextResponse.json(
        { error: "activityType and completionTime are required" },
        { status: 400 }
      );
    }

    const completionDate = new Date(completionTime);
    if (isNaN(completionDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid completionTime format" },
        { status: 400 }
      );
    }

    // Check badges created within 15 seconds after activity completion
    // We use a wider window to account for async badge processing
    const checkStartTime = new Date(completionDate.getTime() - 5000); // 5 seconds before
    const checkEndTime = new Date(completionDate.getTime() + 15000); // 15 seconds after

    console.log("[GeneralBadgeCheckAPI] Checking badges:", {
      userId,
      activityType,
      activityId,
      completionTime: completionDate.toISOString(),
      checkStartTime: checkStartTime.toISOString(),
      checkEndTime: checkEndTime.toISOString(),
    });

    // Get user badges created around the activity completion time
    const userBadges = await db.userBadge.findMany({
      where: {
        userId,
        earnedAt: {
          gte: checkStartTime,
          lte: checkEndTime,
        },
      },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    console.log("[GeneralBadgeCheckAPI] Found user badges:", {
      count: userBadges.length,
      badges: userBadges.map((ub: any) => ({
        badgeId: ub.badgeId,
        badgeName: ub.badge.name,
        category: ub.badge.category,
        earnedAt: ub.earnedAt.toISOString(),
      })),
    });

    // Filter badges by activity type if needed
    // Some badges are activity-specific (e.g., test_count, lesson_count)
    // Others are general (e.g., streak, daily_activities)
    const relevantBadges = userBadges.filter((userBadge: any) => {
      const badge = userBadge.badge;
      const criteria = badge.criteria as any;

      // If badge has activity_type in criteria, check if it matches
      if (criteria?.activity_type) {
        const badgeActivityType = criteria.activity_type;
        const activityTypeMap: Record<ActivityType, string[]> = {
          test: ["test"],
          quiz: ["quiz", "test"],
          lesson: ["ders", "lesson"],
          "live-coding": ["canlı kod", "canlı kodlama", "live coding"],
          bugfix: ["bugfix", "hata düzeltme"],
          social: ["post", "mesaj", "beğeni", "yorum", "story", "arkadaş", "takipçi", "paylaşım"],
        };

        const allowedTypes = activityTypeMap[activityType] || [];
        return allowedTypes.some((type) =>
          badgeActivityType.toLowerCase().includes(type.toLowerCase())
        );
      }

      // If no activity_type specified, include all badges (streak, total_achievements, etc.)
      return true;
    });

    // Format badges for response
    const newlyEarnedBadges = relevantBadges.map((userBadge: any) => ({
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

    console.log("[GeneralBadgeCheckAPI] Returning badges:", {
      totalFound: userBadges.length,
      relevantCount: relevantBadges.length,
      returnedCount: newlyEarnedBadges.length,
    });

    return NextResponse.json({
      newlyEarnedBadges,
      totalEarned: newlyEarnedBadges.length,
    });
  } catch (error) {
    console.error("[GeneralBadgeCheckAPI] Error checking badges:", error);
    return NextResponse.json(
      { error: "Rozet kontrolü sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
