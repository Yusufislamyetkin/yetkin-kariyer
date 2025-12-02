import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { LeaderboardPeriod } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = "daily" | "weekly" | "monthly";

interface ScoreAccumulator {
  total: number;
  count: number;
  highest: number;
}

interface UserLeaderboardMetrics {
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  topicCourseIds: Set<string>;
  quizScore: ScoreAccumulator;
  testScore: ScoreAccumulator;
  liveCodingScore: ScoreAccumulator;
  bugFixScore: ScoreAccumulator;
  hackatonScore: ScoreAccumulator;
}

const PASSING_SCORE = 70;
const HUNDRED = 100;

const safeNumber = (value: unknown): number => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const accumulateScore = (acc: ScoreAccumulator, score: number) => {
  acc.total += score;
  acc.count += 1;
  acc.highest = Math.max(acc.highest, score);
};

const initAccumulator = (): ScoreAccumulator => ({
  total: 0,
  count: 0,
  highest: 0,
});

const calculateAverage = (acc: ScoreAccumulator): number => {
  if (acc.count === 0) {
    return 0;
  }
  return acc.total / acc.count;
};

const getPeriodBounds = (period: Period) => {
  // Use UTC for all date calculations to match database timestamps
  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
  
  let periodDate: string;
  let startDate: Date;
  let endDate: Date;

  if (period === "daily") {
    // Get today's date in UTC
    periodDate = nowUTC.toISOString().split("T")[0];
    startDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate(), 0, 0, 0, 0));
    endDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate() + 1, 0, 0, 0, 0));
  } else if (period === "weekly") {
    // Get Monday of current week in UTC
    const day = nowUTC.getUTCDay();
    const diff = nowUTC.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const mondayUTC = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), diff, 0, 0, 0, 0));
    startDate = mondayUTC;
    
    // Get Sunday of current week (end of week)
    endDate = new Date(Date.UTC(mondayUTC.getUTCFullYear(), mondayUTC.getUTCMonth(), mondayUTC.getUTCDate() + 7, 0, 0, 0, 0));
    
    // Format periodDate as YYYY-WW (year-week number)
    const year = startDate.getUTCFullYear();
    const weekNumber = getWeekNumber(startDate);
    periodDate = `${year}-W${String(weekNumber).padStart(2, "0")}`;
  } else {
    // monthly - use UTC
    periodDate = `${nowUTC.getUTCFullYear()}-${String(nowUTC.getUTCMonth() + 1).padStart(2, "0")}`;
    startDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), 1, 0, 0, 0, 0));
    endDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  }

  return { periodDate, startDate, endDate };
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") || "daily") as Period;
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const expertiseFilter = searchParams.get("expertise") ?? undefined;
  const explicitUserId = searchParams.get("userId") ?? undefined;

  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  const { periodDate, startDate, endDate } = getPeriodBounds(period);

  const baseResponse = {
    leaderboard: [] as Array<{
      userId: string;
      user: {
        id: string;
        name: string | null;
        email: string;
        profileImage: string | null;
      };
      metrics: {
        topicCompletion: number;
        test: number;
        liveCoding: number;
        bugFix: number;
        hackaton: number;
      };
      attempts: {
        quiz: number;
        test: number;
        liveCoding: number;
        bugFix: number;
        hackaton: number;
      };
      highestScores: {
        quiz: number;
        test: number;
        liveCoding: number;
        bugFix: number;
        hackaton: number;
      };
      compositeScore: number;
      points: number;
      rank: number;
      displayedBadges: Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        rarity: string;
      }>;
    }>,
    userRank: null as null | {
      userId: string;
      user: {
        id: string;
        name: string | null;
        email: string;
        profileImage: string | null;
      };
      metrics: {
        topicCompletion: number;
        test: number;
        liveCoding: number;
        bugFix: number;
        hackaton: number;
      };
      attempts: {
        quiz: number;
        test: number;
        liveCoding: number;
        bugFix: number;
        hackaton: number;
      };
      highestScores: {
        quiz: number;
        test: number;
        liveCoding: number;
        bugFix: number;
        hackaton: number;
      };
      compositeScore: number;
      points: number;
      rank: number;
      displayedBadges: Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        rarity: string;
      }>;
    },
    period,
    periodDate,
    expertise: expertiseFilter ?? null,
    totals: {
      courses: 0,
    },
  };

  try {

    const courseWhere = expertiseFilter
      ? { expertise: expertiseFilter }
      : {};

    const [courses, quizAttempts, testAttempts, liveCodingAttempts, bugFixAttempts, hackatonAttempts] =
      await Promise.all([
        db.course.findMany({
          where: courseWhere,
          select: { id: true, expertise: true },
        }),
        db.quizAttempt.findMany({
          where: {
            completedAt: {
              gte: startDate,
              lt: endDate,
            },
            ...(expertiseFilter
              ? {
                  quiz: {
                    course: {
                      expertise: expertiseFilter,
                    },
                  },
                }
              : {}),
          },
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        }),
        db.testAttempt.findMany({
          where: {
            completedAt: {
              gte: startDate,
              lt: endDate,
            },
            ...(expertiseFilter
              ? {
                  quiz: {
                    course: {
                      expertise: expertiseFilter,
                    },
                  },
                }
              : {}),
          },
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        }),
        db.liveCodingAttempt.findMany({
          where: {
            completedAt: {
              gte: startDate,
              lt: endDate,
            },
            ...(expertiseFilter
              ? {
                  quiz: {
                    course: {
                      expertise: expertiseFilter,
                    },
                  },
                }
              : {}),
          },
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        }),
        db.bugFixAttempt.findMany({
          where: {
            completedAt: {
              gte: startDate,
              lt: endDate,
            },
            ...(expertiseFilter
              ? {
                  quiz: {
                    course: {
                      expertise: expertiseFilter,
                    },
                  },
                }
              : {}),
          },
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        }),
        db.hackatonAttempt.findMany({
          where: {
            completedAt: {
              gte: startDate,
              lt: endDate,
            },
            ...(expertiseFilter
              ? {
                  quiz: {
                    course: {
                      expertise: expertiseFilter,
                    },
                  },
                }
              : {}),
          },
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        }),
      ]);

    const totalCoursesAvailable = courses.length || 1;

    const userMetrics = new Map<string, UserLeaderboardMetrics>();

    const ensureUser = (
      userIdKey: string,
      userData: UserLeaderboardMetrics["user"]
    ) => {
      if (!userMetrics.has(userIdKey)) {
        userMetrics.set(userIdKey, {
          userId: userIdKey,
          user: userData,
          topicCourseIds: new Set<string>(),
          quizScore: initAccumulator(),
          testScore: initAccumulator(),
          liveCodingScore: initAccumulator(),
          bugFixScore: initAccumulator(),
          hackatonScore: initAccumulator(),
        });
      }
      return userMetrics.get(userIdKey)!;
    };

    for (const attempt of quizAttempts) {
      const courseId = attempt.quiz?.course?.id;
      const stats = ensureUser(attempt.userId, attempt.user);
      if (typeof attempt.score === "number") {
        accumulateScore(stats.quizScore, attempt.score);
        if (courseId && attempt.score >= PASSING_SCORE) {
          stats.topicCourseIds.add(courseId);
        }
      }
    }

    for (const attempt of testAttempts) {
      const metrics = attempt.metrics as Record<string, unknown> | null;
      const score = safeNumber(metrics?.score);
      const stats = ensureUser(attempt.userId, attempt.user);
      if (score > 0) {
        accumulateScore(stats.testScore, Math.min(score, HUNDRED));
      }
      const courseId = attempt.quiz?.course?.id;
      if (courseId && score >= PASSING_SCORE) {
        stats.topicCourseIds.add(courseId);
      }
    }

    for (const attempt of liveCodingAttempts) {
      const metrics = attempt.metrics as Record<string, unknown> | null;
      const score = safeNumber(metrics?.codeQuality ?? metrics?.score);
      const stats = ensureUser(attempt.userId, attempt.user);
      if (score > 0) {
        accumulateScore(stats.liveCodingScore, Math.min(score, HUNDRED));
      }
      const courseId = attempt.quiz?.course?.id;
      if (courseId && score >= PASSING_SCORE) {
        stats.topicCourseIds.add(courseId);
      }
    }

    for (const attempt of bugFixAttempts) {
      const metrics = attempt.metrics as Record<string, unknown> | null;
      const score = safeNumber(metrics?.codeQuality ?? metrics?.score);
      const stats = ensureUser(attempt.userId, attempt.user);
      if (score > 0) {
        accumulateScore(stats.bugFixScore, Math.min(score, HUNDRED));
      }
      const courseId = attempt.quiz?.course?.id;
      if (courseId && score >= PASSING_SCORE) {
        stats.topicCourseIds.add(courseId);
      }
    }

    for (const attempt of hackatonAttempts) {
      const metrics = attempt.metrics as Record<string, unknown> | null;
      const score = safeNumber(metrics?.projectScore ?? metrics?.score);
      const stats = ensureUser(attempt.userId, attempt.user);
      if (score > 0) {
        accumulateScore(stats.hackatonScore, Math.min(score, HUNDRED));
      }
      const courseId = attempt.quiz?.course?.id;
      if (courseId && score >= PASSING_SCORE) {
        stats.topicCourseIds.add(courseId);
      }
    }

    // FIRST: Fetch earned points for the period (BADGE + STRIKE)
    // This ensures users with badge/strike points appear even if they have no attempts
    const earnedPoints = await db.userEarnedPoint.groupBy({
      by: ["userId"],
      where: {
        earnedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        points: true,
      },
    });

    // Calculate total points earned in the period for each user (BADGE + STRIKE)
    const userPointsMap = new Map<string, number>();
    const usersWithPoints = new Set<string>();
    for (const earned of earnedPoints) {
      const points = earned._sum.points || 0;
      if (points > 0) {
        userPointsMap.set(earned.userId, points);
        usersWithPoints.add(earned.userId);
      }
    }

    // Get all unique user IDs: those with attempts OR those with points
    const allUserIdsFromAttempts = Array.from(userMetrics.keys());
    const allUniqueUserIds = Array.from(
      new Set([...allUserIdsFromAttempts, ...Array.from(usersWithPoints)])
    );

    // Fetch user data for all users (those with attempts or points)
    const usersData =
      allUniqueUserIds.length > 0
        ? await db.user.findMany({
            where: {
              id: { in: allUniqueUserIds },
            },
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          })
        : [];

    const userDataMap = new Map(
      usersData.map((user: any) => [user.id, user])
    );

    // Ensure all users with points are in userMetrics (even if no attempts)
    for (const userId of usersWithPoints) {
      if (!userMetrics.has(userId)) {
        const userData = userDataMap.get(userId) as { id: string; name: string | null; email: string; profileImage: string | null; } | undefined;
        if (userData) {
          userMetrics.set(userId, {
            userId,
            user: userData,
            topicCourseIds: new Set<string>(),
            quizScore: initAccumulator(),
            testScore: initAccumulator(),
            liveCodingScore: initAccumulator(),
            bugFixScore: initAccumulator(),
            hackatonScore: initAccumulator(),
          });
        }
      }
    }

    const leaderboardData = Array.from(userMetrics.values()).map((metrics) => {
      const topicCompletion =
        Math.min(
          (metrics.topicCourseIds.size / totalCoursesAvailable) * 100,
          HUNDRED
        ) || 0;

      const quizAverage = Math.min(calculateAverage(metrics.quizScore), HUNDRED);
      const testAverage = Math.min(calculateAverage(metrics.testScore), HUNDRED);
      const liveCodingAverage = Math.min(
        calculateAverage(metrics.liveCodingScore),
        HUNDRED
      );
      const bugFixAverage = Math.min(
        calculateAverage(metrics.bugFixScore),
        HUNDRED
      );
      const hackatonAverage = Math.min(
        calculateAverage(metrics.hackatonScore),
        HUNDRED
      );

      const components = [
        topicCompletion,
        testAverage,
        liveCodingAverage,
        bugFixAverage,
        hackatonAverage,
      ];

      const compositeScore =
        components.reduce((sum, value) => sum + value, 0) / components.length;

      return {
        userId: metrics.userId,
        user: metrics.user,
        metrics: {
          topicCompletion: Math.round(topicCompletion * 100) / 100,
          test: Math.round(testAverage * 100) / 100,
          liveCoding: Math.round(liveCodingAverage * 100) / 100,
          bugFix: Math.round(bugFixAverage * 100) / 100,
          hackaton: Math.round(hackatonAverage * 100) / 100,
        },
        attempts: {
          quiz: metrics.quizScore.count,
          test: metrics.testScore.count,
          liveCoding: metrics.liveCodingScore.count,
          bugFix: metrics.bugFixScore.count,
          hackaton: metrics.hackatonScore.count,
        },
        highestScores: {
          quiz: metrics.quizScore.highest,
          test: metrics.testScore.highest,
          liveCoding: metrics.liveCodingScore.highest,
          bugFix: metrics.bugFixScore.highest,
          hackaton: metrics.hackatonScore.highest,
        },
        compositeScore: Math.round(compositeScore * 100) / 100,
      };
    });

    // Get all user IDs from leaderboardData to fetch their badges
    const allLeaderboardUserIds = leaderboardData.map((entry) => entry.userId);

    // Fetch all user badges for display purposes only (not for sorting)
    const allUserBadges =
      allLeaderboardUserIds.length > 0
        ? await db.userBadge.findMany({
            where: {
              userId: { in: allLeaderboardUserIds },
            },
            include: {
              badge: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  color: true,
                  rarity: true,
                  points: true,
                },
              },
            },
          })
        : [];

    // Add points to all leaderboard entries
    const leaderboardWithPoints = leaderboardData.map((entry) => ({
      ...entry,
      points: userPointsMap.get(entry.userId) || 0,
    }));

    // Filter: Include users with points > 0 OR users with at least one attempt
    // This ensures users with activity are shown even if they have 0 points in this period
    const leaderboardWithPointsFiltered = leaderboardWithPoints.filter(
      (entry) => {
        const hasPoints = entry.points > 0;
        const hasAttempts = 
          entry.attempts.quiz > 0 ||
          entry.attempts.test > 0 ||
          entry.attempts.liveCoding > 0 ||
          entry.attempts.bugFix > 0 ||
          entry.attempts.hackaton > 0;
        return hasPoints || hasAttempts;
      }
    );

    leaderboardWithPointsFiltered.sort((a, b) => {
      // First sort by points (descending) - users with 0 points will be at the end
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // If points are equal (including both 0), use compositeScore as tiebreaker
      // This ensures users with 0 points but higher activity appear first among 0-point users
      if (b.compositeScore !== a.compositeScore) {
        return b.compositeScore - a.compositeScore;
      }
      // Final tiebreaker: topicCompletion
      return b.metrics.topicCompletion - a.metrics.topicCompletion;
    });

    // Slice to limit and assign ranks
    const leaderboard = leaderboardWithPointsFiltered.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Get displayed badges (max 3 per user) for the top entries
    const leaderboardUserIds = leaderboard.map((entry) => entry.userId);
    const displayedBadgesRaw = allUserBadges.filter(
      (ub: typeof allUserBadges[0]) => ub.isDisplayed && ub.badge && leaderboardUserIds.includes(ub.userId)
    );

    const displayedBadgeMap = displayedBadgesRaw.reduce(
      (
        acc: Map<string, Array<{ id: string; name: string; icon: string; color: string; rarity: string }>>,
        current: { userId: string; badge: { id: string; name: string; icon: string; color: string; rarity: string } | null }
      ) => {
        const list = acc.get(current.userId) ?? [];
        if (list.length < 3 && current.badge) {
          list.push({
            id: current.badge.id,
            name: current.badge.name,
            icon: current.badge.icon,
            color: current.badge.color,
            rarity: current.badge.rarity,
          });
        }
        acc.set(current.userId, list);
        return acc;
      },
      new Map<string, Array<{ id: string; name: string; icon: string; color: string; rarity: string }>>()
    );

    const leaderboardWithBadges = leaderboard.map((entry) => ({
      ...entry,
      displayedBadges: displayedBadgeMap.get(entry.userId) || [],
    }));

    let userRank: (typeof leaderboardWithBadges)[number] | null = null;

    const rankTargetUserId = explicitUserId || userId;

    if (rankTargetUserId) {
      const userEntry = leaderboardWithBadges.find(
        (entry) => entry.userId === rankTargetUserId
      );
      if (userEntry) {
        userRank = userEntry;
      } else {
        // If user is not in top leaderboard, find their data and calculate points
        const userData = leaderboardData.find(
          (entry) => entry.userId === rankTargetUserId
        );
        if (userData) {
          // Get points from user_earned_points for this period if not already in map
          let userPoints = userPointsMap.get(rankTargetUserId);
          if (userPoints === undefined) {
            const userEarnedPoints = await db.userEarnedPoint.groupBy({
              by: ["userId"],
              where: {
                userId: rankTargetUserId,
                earnedAt: {
                  gte: startDate,
                  lt: endDate,
                },
              },
              _sum: {
                points: true,
              },
            });
            userPoints = userEarnedPoints[0]?._sum.points || 0;
          }
          userRank = {
            ...userData,
            points: userPoints ?? 0,
            rank: leaderboardWithBadges.length + 1, // Approximate rank if not in top list
            displayedBadges:
              displayedBadgeMap.get(rankTargetUserId)?.slice(0, 3) ?? [],
          };
        }
      }
    }

    const leaderboardPeriod: LeaderboardPeriod =
      (period === "daily" ? "daily" : period === "weekly" ? "weekly" : "monthly") as LeaderboardPeriod;

    const upsertPayload = leaderboardWithBadges.slice(0, 100);

    try {
      await Promise.all(
        upsertPayload.map((entry) =>
          db.leaderboardEntry.upsert({
            where: {
              userId_period_periodDate: {
                userId: entry.userId,
                period: leaderboardPeriod,
                periodDate,
              },
            },
            update: {
              quizCount: entry.attempts.quiz,
              averageScore: entry.metrics.test,
              totalScore: Math.round(entry.metrics.test * entry.attempts.test),
              highestScore: entry.highestScores.test,
              points: entry.points, // Use badge points instead of compositeScore
              rank: entry.rank,
            },
            create: {
              userId: entry.userId,
              period: leaderboardPeriod,
              periodDate,
              quizCount: entry.attempts.quiz,
              averageScore: entry.metrics.test,
              totalScore: Math.round(entry.metrics.test * entry.attempts.test),
              highestScore: entry.highestScores.test,
              points: entry.points, // Use badge points instead of compositeScore
              rank: entry.rank,
            },
          })
        )
      );
    } catch (persistError) {
      console.error("Error persisting leaderboard snapshot:", persistError);
    }

    return NextResponse.json({
      ...baseResponse,
      leaderboard: leaderboardWithBadges,
      userRank,
      totals: {
        courses: courses.length,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        ...baseResponse,
        error: error instanceof Error ? error.message : "Liderlik tablosu yüklenirken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}
