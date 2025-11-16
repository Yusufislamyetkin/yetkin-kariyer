import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "daily";
    const type = searchParams.get("type") || "attempt_count";
    const limit = parseInt(searchParams.get("limit") || "100");

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    // Calculate period date
    const now = new Date();
    let periodDate: string;

    if (period === "daily") {
      periodDate = now.toISOString().split("T")[0];
    } else {
      periodDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    const startDate =
      period === "daily"
        ? new Date(periodDate)
        : new Date(`${periodDate}-01`);

    const endDate = new Date(startDate);
    if (period === "daily") {
      endDate.setDate(endDate.getDate() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Get all test attempts in this period
    const testAttempts = await db.testAttempt.findMany({
      where: {
        completedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    // Group by user and calculate stats
    const userStats = new Map<
      string,
      {
        userId: string;
        user: any;
        attemptCount: number;
        totalScore: number;
        scores: number[];
        highestScore: number;
      }
    >();

    for (const attempt of testAttempts) {
      const metrics = attempt.metrics as any;
      const score = metrics?.score || 0;

      const stats = userStats.get(attempt.userId) || {
        userId: attempt.userId,
        user: attempt.user,
        attemptCount: 0,
        totalScore: 0,
        scores: [],
        highestScore: 0,
      };

      stats.attemptCount++;
      stats.totalScore += score;
      stats.scores.push(score);
      stats.highestScore = Math.max(stats.highestScore, score);

      userStats.set(attempt.userId, stats);
    }

    // Get badge points for each user
    const userIds = Array.from(userStats.keys());
    const userBadges = await db.userBadge.findMany({
      where: {
        userId: { in: userIds },
        earnedAt: {
          lte: endDate,
        },
      },
      include: {
        badge: {
          select: {
            points: true,
          },
        },
      },
    });

    const userPoints = new Map<string, number>();
    for (const ub of userBadges) {
      userPoints.set(
        ub.userId,
        (userPoints.get(ub.userId) || 0) + ub.badge.points
      );
    }

    // Create leaderboard entries
    const leaderboardData = Array.from(userStats.values()).map((stats) => {
      const averageScore =
        stats.attemptCount > 0 ? stats.totalScore / stats.attemptCount : 0;
      const points = userPoints.get(stats.userId) || 0;

      return {
        userId: stats.userId,
        user: stats.user,
        attemptCount: stats.attemptCount,
        averageScore: Math.round(averageScore * 100) / 100,
        totalScore: stats.totalScore,
        highestScore: stats.highestScore,
        points,
      };
    });

    // Sort by type
    if (type === "attempt_count") {
      leaderboardData.sort((a, b) => {
        if (b.attemptCount !== a.attemptCount) {
          return b.attemptCount - a.attemptCount;
        }
        return b.averageScore - a.averageScore;
      });
    } else {
      leaderboardData.sort((a, b) => {
        if (b.averageScore !== a.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return b.attemptCount - a.attemptCount;
      });
    }

    // Add ranks
    const leaderboard = leaderboardData.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Get user's rank if logged in
    let userRank: any = null;
    if (userId) {
      const userIndex = leaderboardData.findIndex((e) => e.userId === userId);
      if (userIndex !== -1) {
        userRank = {
          ...leaderboardData[userIndex],
          rank: userIndex + 1,
        };
      }
    }

    // Update or create leaderboard entries in database
    for (const entry of leaderboardData.slice(0, 100)) {
      await db.testLeaderboardEntry.upsert({
        where: {
          userId_period_periodDate: {
            userId: entry.userId,
            period: period as "daily" | "monthly",
            periodDate,
          },
        },
        update: {
          attemptCount: entry.attemptCount,
          averageScore: entry.averageScore,
          totalScore: entry.totalScore,
          highestScore: entry.highestScore,
          points: entry.points,
          rank: leaderboard.findIndex((e) => e.userId === entry.userId) + 1,
        },
        create: {
          userId: entry.userId,
          period: period as "daily" | "monthly",
          periodDate,
          attemptCount: entry.attemptCount,
          averageScore: entry.averageScore,
          totalScore: entry.totalScore,
          highestScore: entry.highestScore,
          points: entry.points,
          rank: leaderboard.findIndex((e) => e.userId === entry.userId) + 1,
        },
      });
    }

    return NextResponse.json({
      leaderboard,
      userRank,
      period,
      type,
      periodDate,
    });
  } catch (error) {
    console.error("Error fetching test leaderboard:", error);
    return NextResponse.json(
      { error: "Test liderlik tablosu yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

