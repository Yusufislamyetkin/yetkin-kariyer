import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { LeaderboardPeriod } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = "daily" | "monthly";

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
  const now = new Date();
  const periodDate =
    period === "daily"
      ? now.toISOString().split("T")[0]
      : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

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

  return { periodDate, startDate, endDate };
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

    leaderboardData.sort((a, b) => {
      if (b.compositeScore !== a.compositeScore) {
        return b.compositeScore - a.compositeScore;
      }
      return b.metrics.topicCompletion - a.metrics.topicCompletion;
    });

    const leaderboard = leaderboardData.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    const leaderboardUserIds = leaderboard.map((entry) => entry.userId);

    const displayedBadgesRaw =
      leaderboardUserIds.length > 0
        ? await db.userBadge.findMany({
            where: {
              userId: { in: leaderboardUserIds },
              isDisplayed: true,
            },
            include: {
              badge: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  color: true,
                  rarity: true,
                },
              },
            },
            orderBy: [
              { earnedAt: "desc" },
            ],
          })
        : [];

    const displayedBadgeMap = displayedBadgesRaw.reduce(
      (
        acc: Map<string, Array<{ id: string; name: string; icon: string; color: string; rarity: string }>>,
        current: { userId: string; badge: { id: string; name: string; icon: string; color: string; rarity: string } | null }
      ) => {
        const list = acc.get(current.userId) ?? [];
        if (list.length < 3 && current.badge) {
          list.push(current.badge);
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
      const userIndex = leaderboardData.findIndex(
        (entry) => entry.userId === rankTargetUserId
      );
      if (userIndex >= 0) {
        userRank = {
          ...leaderboardData[userIndex],
          rank: userIndex + 1,
          displayedBadges:
            displayedBadgeMap.get(rankTargetUserId)?.slice(0, 3) ?? [],
        };
      }
    }

    const leaderboardPeriod: LeaderboardPeriod =
      period === "daily" ? "daily" : "monthly";

    const upsertPayload = leaderboardData.slice(0, 100);

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
            points: Math.round(entry.compositeScore),
            rank:
              leaderboardWithBadges.findIndex(
                (e) => e.userId === entry.userId
              ) + 1,
          },
          create: {
            userId: entry.userId,
            period: leaderboardPeriod,
            periodDate,
            quizCount: entry.attempts.quiz,
            averageScore: entry.metrics.test,
            totalScore: Math.round(entry.metrics.test * entry.attempts.test),
            highestScore: entry.highestScores.test,
            points: Math.round(entry.compositeScore),
            rank:
              leaderboardWithBadges.findIndex(
                (e) => e.userId === entry.userId
              ) + 1,
          },
        })
      )
    );

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
              points: Math.round(entry.compositeScore),
              rank:
                leaderboardWithBadges.findIndex(
                  (e) => e.userId === entry.userId
                ) + 1,
            },
            create: {
              userId: entry.userId,
              period: leaderboardPeriod,
              periodDate,
              quizCount: entry.attempts.quiz,
              averageScore: entry.metrics.test,
              totalScore: Math.round(entry.metrics.test * entry.attempts.test),
              highestScore: entry.highestScores.test,
              points: Math.round(entry.compositeScore),
              rank:
                leaderboardWithBadges.findIndex(
                  (e) => e.userId === entry.userId
                ) + 1,
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
