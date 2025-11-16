import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SCORE_BUCKETS = [
  { min: 0, max: 49, label: "0-49" },
  { min: 50, max: 59, label: "50-59" },
  { min: 60, max: 69, label: "60-69" },
  { min: 70, max: 79, label: "70-79" },
  { min: 80, max: 89, label: "80-89" },
  { min: 90, max: 100, label: "90-100" },
];

const ACTIVITY_WINDOW_DAYS = 30;

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const asRecord = (
  value: unknown
): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const extractDuration = (
  rawMetrics: Record<string, unknown> | null,
  candidates: string[]
): number => {
  if (!rawMetrics) {
    return 0;
  }
  for (const key of candidates) {
    if (key in rawMetrics) {
      const num = toNumber(rawMetrics[key]);
      if (num > 0) {
        return num;
      }
    }
  }
  return 0;
};

const getDateKey = (value: Date | string | null | undefined): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

function initializeActivityTimeline() {
  const timeline: Record<
    string,
    {
      date: string;
      tests: number;
      liveCoding: number;
      bugFix: number;
      hackaton: number;
      total: number;
    }
  > = {};

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (ACTIVITY_WINDOW_DAYS - 1));

  for (let i = 0; i < ACTIVITY_WINDOW_DAYS; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = day.toISOString().slice(0, 10);
    timeline[key] = {
      date: key,
      tests: 0,
      liveCoding: 0,
      bugFix: 0,
      hackaton: 0,
      total: 0,
    };
  }

  return timeline;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const quizAttempts = await db.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        completedAt: "asc",
      },
    });

    const baseResponse = {
      summary: {
        totalAttempts: 0,
        passRate: 0,
        averageScore: 0,
        bestScore: 0,
        averageDurationSeconds: 0,
        totalDurationSeconds: 0,
      },
      passFail: {
        passed: 0,
        failed: 0,
        passRate: 0,
      },
      scoreTrend: [] as Array<{
        id: string;
        completedAt: Date;
        score: number;
        passingScore: number;
        passed: boolean;
        quizTitle: string;
      }>,
      topics: [] as Array<{
        topic: string;
        averageScore: number;
        passRate: number;
        attempts: number;
      }>,
      difficulties: [] as Array<{
        difficulty: string;
        label: string;
        averageScore: number;
        passRate: number;
        attempts: number;
      }>,
      timeOnTask: {
        averageDurationSeconds: 0,
        medianDurationSeconds: 0,
        totalDurationSeconds: 0,
      },
      scoreDistribution: {
        buckets: SCORE_BUCKETS.map((bucket) => ({ ...bucket, count: 0 })),
        min: 0,
        max: 0,
        average: 0,
      },
      overview: {
        totalLearningSeconds: 0,
        totalCompletions: 0,
        courseEngagementCount: 0,
        completionCounts: {
          tests: 0,
          liveCoding: 0,
          bugFix: 0,
          hackaton: 0,
          interviews: 0,
        },
        aiAverages: {
          quiz: null as number | null,
          interview: null as number | null,
        },
        lastActivityAt: null as string | null,
      },
      activity: {
        timeline: [] as Array<{
          date: string;
          tests: number;
          liveCoding: number;
          bugFix: number;
          hackaton: number;
          total: number;
        }>,
        totals: {
          last30Days: {
            total: 0,
            tests: 0,
            liveCoding: 0,
            bugFix: 0,
            hackaton: 0,
          },
        },
      },
      leaderboard: {
        dailyRankTrend: {
          test: [] as Array<{
            date: string;
            rank: number | null;
            points: number;
            attemptCount: number;
          }>,
          liveCoding: [] as Array<{
            date: string;
            rank: number | null;
            points: number;
            attemptCount: number;
          }>,
          bugFix: [] as Array<{
            date: string;
            rank: number | null;
            points: number;
            attemptCount: number;
          }>,
          hackaton: [] as Array<{
            date: string;
            rank: number | null;
            points: number;
            attemptCount: number;
          }>,
        },
        pointsVsAttempts: [] as Array<{
          type: "test" | "liveCoding" | "bugFix" | "hackaton";
          periodDate: string;
          points: number;
          attemptCount: number;
          rank: number | null;
        }>,
      },
      durationInsights: {
        tests: {
          averageDurationSeconds: 0,
          averageScore: 0,
          data: [] as Array<{
            id: string;
            quizTitle: string;
            durationSeconds: number;
            score: number;
            completedAt: Date;
          }>,
        },
        liveCoding: {
          averageDurationSeconds: 0,
          averageCompletionRate: 0,
          data: [] as Array<{
            id: string;
            quizTitle: string;
            durationSeconds: number;
            completionRate: number;
            completedAt: Date;
          }>,
        },
        bugFix: {
          averageDurationSeconds: 0,
          averageCodeQuality: 0,
          data: [] as Array<{
            id: string;
            quizTitle: string;
            durationSeconds: number;
            codeQuality: number | null;
            bugsFixed: number | null;
            completedAt: Date;
          }>,
        },
        hackaton: {
          averageDurationSeconds: 0,
          averageProjectScore: 0,
          data: [] as Array<{
            id: string;
            quizTitle: string;
            durationSeconds: number;
            projectScore: number | null;
            featuresCompleted: number | null;
            completedAt: Date;
          }>,
        },
      },
      badgeInsights: {
        totalBadges: 0,
        distribution: [] as Array<{
          rarity: string;
          count: number;
        }>,
        rarityProgress: [] as Array<{
          rarity: string;
          owned: number;
          total: number;
          completionRate: number;
        }>,
        recentBadges: [] as Array<{
          id: string;
          name: string;
          rarity: string;
          earnedAt: string;
          icon?: string | null;
          color?: string | null;
        }>,
      },
    };

    if (quizAttempts.length === 0) {
      return NextResponse.json(baseResponse);
    }

    const [
      liveCodingAttempts,
      bugFixAttempts,
      hackatonAttempts,
      testLeaderboardEntries,
      liveCodingLeaderboardEntries,
      bugFixLeaderboardEntries,
      hackatonLeaderboardEntries,
      userBadges,
      allBadges,
      interviewAttempts,
    ] = await Promise.all([
      db.liveCodingAttempt.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "asc",
        },
      }),
      db.bugFixAttempt.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "asc",
        },
      }),
      db.hackatonAttempt.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "asc",
        },
      }),
      db.testLeaderboardEntry.findMany({
        where: { userId, period: "daily" },
        orderBy: { periodDate: "asc" },
      }),
      db.liveCodingLeaderboardEntry.findMany({
        where: { userId, period: "daily" },
        orderBy: { periodDate: "asc" },
      }),
      db.bugFixLeaderboardEntry.findMany({
        where: { userId, period: "daily" },
        orderBy: { periodDate: "asc" },
      }),
      db.hackatonLeaderboardEntry.findMany({
        where: { userId, period: "daily" },
        orderBy: { periodDate: "asc" },
      }),
      db.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      }),
      db.badge.findMany({
        select: {
          id: true,
          rarity: true,
        },
      }),
      db.interviewAttempt.findMany({
        where: { userId },
        select: {
          id: true,
          aiScore: true,
          completedAt: true,
        },
        orderBy: {
          completedAt: "asc",
        },
      }),
    ]);

    const scores = quizAttempts.map((attempt) => attempt.score);
    const quizDurations = quizAttempts
      .map((attempt) => toNumber(attempt.duration))
      .filter((duration) => duration > 0);

    const totalAttempts = quizAttempts.length;
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round(totalScore / totalAttempts);
    const bestScore = Math.max(...scores);

    const totalDurationSeconds = quizDurations.reduce(
      (sum, duration) => sum + duration,
      0
    );
    const averageDurationSeconds =
      quizDurations.length > 0
        ? Math.round(totalDurationSeconds / quizDurations.length)
        : 0;
    const medianDurationSeconds = Math.round(calculateMedian(quizDurations));

    let passed = 0;
    let failed = 0;

    const topicMap: Record<
      string,
      { totalScore: number; attempts: number; passed: number; label: string }
    > = {};
    const difficultyMap: Record<
      string,
      { totalScore: number; attempts: number; passed: number; label: string }
    > = {};

    const bucketCounts = SCORE_BUCKETS.map((bucket) => ({
      ...bucket,
      count: 0,
    }));

    const sortedAttempts = [...quizAttempts].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    sortedAttempts.forEach((attempt) => {
      const { quiz } = attempt;
      const passingScore = quiz?.passingScore ?? 60;
      const didPass = attempt.score >= passingScore;

      if (didPass) {
        passed += 1;
      } else {
        failed += 1;
      }

      const topic = quiz?.topic ?? attempt.topic ?? "Genel";
      if (!topicMap[topic]) {
        topicMap[topic] = { totalScore: 0, attempts: 0, passed: 0, label: topic };
      }
      topicMap[topic].totalScore += attempt.score;
      topicMap[topic].attempts += 1;
      topicMap[topic].passed += didPass ? 1 : 0;

      const level = (quiz?.level ?? attempt.level ?? "unknown").toLowerCase();
      const normalizedLevel =
        level === "beginner" || level === "intermediate" || level === "advanced"
          ? level
          : "unknown";
      if (!difficultyMap[normalizedLevel]) {
        const levelLabels: Record<string, string> = {
          beginner: "Başlangıç",
          intermediate: "Orta",
          advanced: "İleri",
          unknown: "Belirtilmemiş",
        };
        difficultyMap[normalizedLevel] = {
          totalScore: 0,
          attempts: 0,
          passed: 0,
          label: levelLabels[normalizedLevel] ?? normalizedLevel,
        };
      }
      difficultyMap[normalizedLevel].totalScore += attempt.score;
      difficultyMap[normalizedLevel].attempts += 1;
      difficultyMap[normalizedLevel].passed += didPass ? 1 : 0;

      const attemptBucket = bucketCounts.find(
        (bucket) => attempt.score >= bucket.min && attempt.score <= bucket.max
      );
      if (attemptBucket) {
        attemptBucket.count += 1;
      }
    });

    const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0;

    const topics = Object.values(topicMap)
      .map((topic) => ({
        topic: topic.label,
        averageScore: Math.round(topic.totalScore / topic.attempts),
        passRate: Math.round((topic.passed / topic.attempts) * 100),
        attempts: topic.attempts,
      }))
      .sort((a, b) => b.passRate - a.passRate || b.averageScore - a.averageScore)
      .slice(0, 8);

    const difficulties = Object.entries(difficultyMap)
      .map(([key, value]) => ({
        difficulty: key,
        label: value.label,
        averageScore: Math.round(value.totalScore / value.attempts),
        passRate: Math.round((value.passed / value.attempts) * 100),
        attempts: value.attempts,
      }))
      .sort((a, b) => b.attempts - a.attempts);

    const scoreTrend = sortedAttempts
      .slice(-10)
      .map((attempt) => {
        const passingScore = attempt.quiz?.passingScore ?? 60;
        return {
          id: attempt.id,
          completedAt: attempt.completedAt,
          score: attempt.score,
          passingScore,
          passed: attempt.score >= passingScore,
          quizTitle: attempt.quiz?.title ?? "Quiz",
        };
      });

    const quizCourseIds = quizAttempts
      .map((attempt) => attempt.quiz?.courseId)
      .filter((id): id is string => Boolean(id));
    const courseEngagementCount = new Set(quizCourseIds).size;

    const liveDurations = liveCodingAttempts.map((attempt) =>
      extractDuration(asRecord(attempt.metrics), [
        "totalDurationSeconds",
        "durationSeconds",
        "duration",
        "timeTaken",
      ])
    );
    const bugFixDurations = bugFixAttempts.map((attempt) =>
      extractDuration(asRecord(attempt.metrics), [
        "timeTaken",
        "durationSeconds",
        "totalDurationSeconds",
      ])
    );
    const hackatonDurations = hackatonAttempts.map((attempt) =>
      extractDuration(asRecord(attempt.metrics), [
        "timeTaken",
        "totalDurationSeconds",
        "durationSeconds",
        "deliverySeconds",
      ])
    );

    const totalLearningSeconds =
      totalDurationSeconds +
      liveDurations.reduce((sum, value) => sum + value, 0) +
      bugFixDurations.reduce((sum, value) => sum + value, 0) +
      hackatonDurations.reduce((sum, value) => sum + value, 0);

    const activityTimeline = initializeActivityTimeline();

    const windowDates = Object.keys(activityTimeline);
    const windowStart = windowDates.length > 0 ? windowDates[0] : null;
    const windowEnd = windowDates.length > 0 ? windowDates[windowDates.length - 1] : null;

    const isWithinWindow = (dateKey: string | null) => {
      if (!dateKey || !windowStart || !windowEnd) return false;
      return dateKey >= windowStart && dateKey <= windowEnd;
    };

    quizAttempts.forEach((attempt) => {
      const key = getDateKey(attempt.completedAt);
      if (key && activityTimeline[key]) {
        activityTimeline[key].tests += 1;
        activityTimeline[key].total += 1;
      }
    });

    liveCodingAttempts.forEach((attempt) => {
      const key = getDateKey(attempt.completedAt);
      if (key && activityTimeline[key]) {
        activityTimeline[key].liveCoding += 1;
        activityTimeline[key].total += 1;
      }
    });

    bugFixAttempts.forEach((attempt) => {
      const key = getDateKey(attempt.completedAt);
      if (key && activityTimeline[key]) {
        activityTimeline[key].bugFix += 1;
        activityTimeline[key].total += 1;
      }
    });

    hackatonAttempts.forEach((attempt) => {
      const key = getDateKey(attempt.completedAt);
      if (key && activityTimeline[key]) {
        activityTimeline[key].hackaton += 1;
        activityTimeline[key].total += 1;
      }
    });

    const timelineArray = Object.values(activityTimeline);
    const totalsLast30 = timelineArray.reduce(
      (acc, day) => {
        acc.total += day.total;
        acc.tests += day.tests;
        acc.liveCoding += day.liveCoding;
        acc.bugFix += day.bugFix;
        acc.hackaton += day.hackaton;
        return acc;
      },
      {
        total: 0,
        tests: 0,
        liveCoding: 0,
        bugFix: 0,
        hackaton: 0,
      }
    );

    const extractLeaderboardSeries = (
      entries: typeof testLeaderboardEntries,
      type: "test" | "liveCoding" | "bugFix" | "hackaton"
    ) => {
      const trend = entries.map((entry) => ({
        date: entry.periodDate,
        rank: entry.rank ?? null,
        points: entry.points,
        attemptCount: entry.attemptCount,
      }));

      const correlation = entries.map((entry) => ({
        type,
        periodDate: entry.periodDate,
        points: entry.points,
        attemptCount: entry.attemptCount,
        rank: entry.rank ?? null,
      }));

      return { trend, correlation };
    };

    const leaderboardTest = extractLeaderboardSeries(testLeaderboardEntries, "test");
    const leaderboardLive = extractLeaderboardSeries(liveCodingLeaderboardEntries, "liveCoding");
    const leaderboardBug = extractLeaderboardSeries(bugFixLeaderboardEntries, "bugFix");
    const leaderboardHack = extractLeaderboardSeries(hackatonLeaderboardEntries, "hackaton");

    const quizAiScores = quizAttempts
      .map((attempt) => {
        const analysis = attempt.aiAnalysis as Record<string, unknown> | null;
        if (!analysis) return null;
        const aiScore = toNumber(analysis.score);
        return aiScore > 0 ? aiScore : null;
      })
      .filter((value): value is number => value !== null);

    const interviewAiScores = interviewAttempts
      .map((attempt) => (typeof attempt.aiScore === "number" ? attempt.aiScore : null))
      .filter((value): value is number => value !== null);

    const averageQuizAiScore =
      quizAiScores.length > 0
        ? Math.round(
            quizAiScores.reduce((sum, score) => sum + score, 0) / quizAiScores.length
          )
        : null;
    const averageInterviewAiScore =
      interviewAiScores.length > 0
        ? Math.round(
            interviewAiScores.reduce((sum, score) => sum + score, 0) / interviewAiScores.length
          )
        : null;

    const testsDurationData = quizAttempts
      .map((attempt) => ({
        id: attempt.id,
        quizTitle: attempt.quiz?.title ?? "Quiz",
        durationSeconds: toNumber(attempt.duration),
        score: attempt.score,
        completedAt: attempt.completedAt,
      }))
      .filter((item) => item.durationSeconds > 0);

    const liveCodingDurationData = liveCodingAttempts
      .map((attempt, index) => {
        const metrics = asRecord(attempt.metrics);
        const durationSeconds = liveDurations[index] ?? 0;
        const completed = toNumber(metrics?.completedTaskCount);
        const total = toNumber(metrics?.totalTaskCount);
        const completionRate =
          total > 0 ? Math.round((completed / total) * 100) : completed > 0 ? 100 : 0;
        return {
          id: attempt.id,
          quizTitle: attempt.quiz?.title ?? "Canlı Kodlama",
          durationSeconds,
          completionRate,
          completedAt: attempt.completedAt,
        };
      })
      .filter((item) => item.durationSeconds > 0);

    const bugFixDurationData = bugFixAttempts
      .map((attempt, index) => {
        const metrics = asRecord(attempt.metrics);
        return {
          id: attempt.id,
          quizTitle: attempt.quiz?.title ?? "Bug Fix",
          durationSeconds: bugFixDurations[index] ?? 0,
          codeQuality:
            metrics && typeof metrics.codeQuality === "number"
              ? Math.round(metrics.codeQuality)
              : null,
          bugsFixed:
            metrics && typeof metrics.bugsFixed === "number"
              ? Math.round(metrics.bugsFixed)
              : null,
          completedAt: attempt.completedAt,
        };
      })
      .filter((item) => item.durationSeconds > 0);

    const hackatonDurationData = hackatonAttempts
      .map((attempt, index) => {
        const metrics = asRecord(attempt.metrics);
        const projectScore =
          metrics && typeof metrics.projectScore === "number"
            ? Math.round(metrics.projectScore)
            : null;
        const featuresCompleted =
          metrics && typeof metrics.featuresCompleted === "number"
            ? Math.round(metrics.featuresCompleted)
            : null;
        return {
          id: attempt.id,
          quizTitle: attempt.quiz?.title ?? "Hackaton",
          durationSeconds: hackatonDurations[index] ?? 0,
          projectScore,
          featuresCompleted,
          completedAt: attempt.completedAt,
        };
      })
      .filter((item) => item.durationSeconds > 0);

    const averageDuration = (data: Array<{ durationSeconds: number }>) =>
      data.length > 0
        ? Math.round(
            data.reduce((sum, item) => sum + item.durationSeconds, 0) / data.length
          )
        : 0;

    const averageOf = (data: number[]) =>
      data.length > 0
        ? Math.round(data.reduce((sum, value) => sum + value, 0) / data.length)
        : 0;

    const badgeDistribution = userBadges.reduce<Record<string, number>>((acc, item) => {
      const rarity = item.badge?.rarity ?? "common";
      acc[rarity] = (acc[rarity] ?? 0) + 1;
      return acc;
    }, {});

    const totalBadges = userBadges.length;
    const allBadgesByRarity = allBadges.reduce<Record<string, number>>((acc, item) => {
      const rarity = item.rarity ?? "common";
      acc[rarity] = (acc[rarity] ?? 0) + 1;
      return acc;
    }, {});

    const rarityProgress = Object.entries(allBadgesByRarity).map(([rarity, total]) => {
      const owned = badgeDistribution[rarity] ?? 0;
      const completionRate =
        total > 0 ? Math.round((owned / total) * 100) : owned > 0 ? 100 : 0;
      return { rarity, owned, total, completionRate };
    });

    const lastAttempt = [
      ...quizAttempts,
      ...liveCodingAttempts,
      ...bugFixAttempts,
      ...hackatonAttempts,
      ...interviewAttempts,
    ]
      .map((attempt) => getDateKey((attempt as { completedAt?: Date | string }).completedAt ?? null))
      .filter((value): value is string => Boolean(value))
      .sort()
      .pop() ?? null;

    return NextResponse.json({
      summary: {
        totalAttempts,
        passRate,
        averageScore,
        bestScore,
        averageDurationSeconds,
        totalDurationSeconds,
      },
      passFail: {
        passed,
        failed,
        passRate,
      },
      scoreTrend,
      topics,
      difficulties,
      timeOnTask: {
        averageDurationSeconds,
        medianDurationSeconds,
        totalDurationSeconds,
      },
      scoreDistribution: {
        buckets: bucketCounts,
        min: Math.min(...scores),
        max: Math.max(...scores),
        average: averageScore,
      },
      overview: {
        totalLearningSeconds,
        totalCompletions:
          quizAttempts.length +
          liveCodingAttempts.length +
          bugFixAttempts.length +
          hackatonAttempts.length,
        courseEngagementCount,
        completionCounts: {
          tests: quizAttempts.length,
          liveCoding: liveCodingAttempts.length,
          bugFix: bugFixAttempts.length,
          hackaton: hackatonAttempts.length,
          interviews: interviewAttempts.length,
        },
        aiAverages: {
          quiz: averageQuizAiScore,
          interview: averageInterviewAiScore,
        },
        lastActivityAt: lastAttempt,
      },
      activity: {
        timeline: timelineArray,
        totals: {
          last30Days: totalsLast30,
        },
      },
      leaderboard: {
        dailyRankTrend: {
          test: leaderboardTest.trend,
          liveCoding: leaderboardLive.trend,
          bugFix: leaderboardBug.trend,
          hackaton: leaderboardHack.trend,
        },
        pointsVsAttempts: [
          ...leaderboardTest.correlation,
          ...leaderboardLive.correlation,
          ...leaderboardBug.correlation,
          ...leaderboardHack.correlation,
        ],
      },
      durationInsights: {
        tests: {
          averageDurationSeconds: averageDuration(testsDurationData),
          averageScore: averageOf(testsDurationData.map((item) => item.score)),
          data: testsDurationData,
        },
        liveCoding: {
          averageDurationSeconds: averageDuration(liveCodingDurationData),
          averageCompletionRate: averageOf(
            liveCodingDurationData.map((item) => item.completionRate)
          ),
          data: liveCodingDurationData,
        },
        bugFix: {
          averageDurationSeconds: averageDuration(bugFixDurationData),
          averageCodeQuality: averageOf(
            bugFixDurationData
              .map((item) => (item.codeQuality ?? null))
              .filter((value): value is number => value !== null)
          ),
          data: bugFixDurationData,
        },
        hackaton: {
          averageDurationSeconds: averageDuration(hackatonDurationData),
          averageProjectScore: averageOf(
            hackatonDurationData
              .map((item) => (item.projectScore ?? null))
              .filter((value): value is number => value !== null)
          ),
          data: hackatonDurationData,
        },
      },
      badgeInsights: {
        totalBadges,
        distribution: Object.entries(badgeDistribution).map(([rarity, count]) => ({
          rarity,
          count,
        })),
        rarityProgress,
        recentBadges: userBadges.slice(0, 5).map((item) => ({
          id: item.id,
          name: item.badge?.name ?? "Rozet",
          rarity: item.badge?.rarity ?? "common",
          earnedAt: item.earnedAt?.toISOString?.() ?? new Date(item.earnedAt).toISOString(),
          icon: item.badge?.icon ?? null,
          color: item.badge?.color ?? null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

