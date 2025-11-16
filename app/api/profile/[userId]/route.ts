import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const [
      badgeCount,
      recentBadges,
      quizAttempts,
      testAttempts,
      liveCodingAttempts,
      bugFixAttempts,
      hackatonAttempts,
    ] = await Promise.all([
      db.userBadge.count({ where: { userId } }),
      db.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
        take: 3,
      }),
      db.quizAttempt.findMany({
        where: { userId },
        select: {
          score: true,
          quiz: {
            select: {
              course: {
                select: { expertise: true },
              },
            },
          },
        },
      }),
      db.testAttempt.findMany({
        where: { userId },
        select: {
          metrics: true,
          quiz: {
            select: {
              course: {
                select: { expertise: true },
              },
            },
          },
        },
      }),
      db.liveCodingAttempt.findMany({
        where: { userId },
        select: {
          metrics: true,
          quiz: {
            select: {
              course: {
                select: { expertise: true },
              },
            },
          },
        },
      }),
      db.bugFixAttempt.findMany({
        where: { userId },
        select: {
          metrics: true,
          quiz: {
            select: {
              course: {
                select: { expertise: true },
              },
            },
          },
        },
      }),
      db.hackatonAttempt.findMany({
        where: { userId },
        select: {
          metrics: true,
          quiz: {
            select: {
              course: {
                select: { expertise: true },
              },
            },
          },
        },
      }),
    ]);

    const expertiseSet = new Set<string>();
    const safeAddExpertise = (expertise?: string | null) => {
      if (expertise) {
        expertiseSet.add(expertise);
      }
    };

    quizAttempts.forEach((attempt) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    testAttempts.forEach((attempt) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    liveCodingAttempts.forEach((attempt) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    bugFixAttempts.forEach((attempt) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    hackatonAttempts.forEach((attempt) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );

    const average = (values: number[]) =>
      values.length === 0
        ? 0
        : values.reduce((sum, val) => sum + val, 0) / values.length;

    const parseMetricScore = (metrics: any, key: string) => {
      if (!metrics) return 0;
      const value = metrics[key];
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    const quizScores = quizAttempts.map((attempt) => attempt.score);
    const testScores = testAttempts.map((attempt) =>
      parseMetricScore(attempt.metrics as any, "score")
    );
    const liveCodingScores = liveCodingAttempts.map((attempt) =>
      parseMetricScore(attempt.metrics as any, "codeQuality")
    );
    const bugFixScores = bugFixAttempts.map((attempt) =>
      parseMetricScore(attempt.metrics as any, "codeQuality")
    );
    const hackatonScores = hackatonAttempts.map((attempt) =>
      parseMetricScore(attempt.metrics as any, "projectScore")
    );

    const recentAchievements = recentBadges
      .filter((badge) => badge.badge)
      .map((badge) => ({
        id: badge.badge.id,
        name: badge.badge.name,
        icon: badge.badge.icon,
        color: badge.badge.color,
        rarity: badge.badge.rarity,
        earnedAt: badge.earnedAt,
      }));

    return NextResponse.json({
      user,
      stats: {
        badgeCount,
        quizAttempts: quizAttempts.length,
        testAttempts: testAttempts.length,
        liveCodingAttempts: liveCodingAttempts.length,
        bugFixAttempts: bugFixAttempts.length,
        hackatonAttempts: hackatonAttempts.length,
        averageScores: {
          quiz: Math.round(average(quizScores)),
          test: Math.round(average(testScores)),
          liveCoding: Math.round(average(liveCodingScores)),
          bugFix: Math.round(average(bugFixScores)),
          hackaton: Math.round(average(hackatonScores)),
        },
      },
      expertises: Array.from(expertiseSet),
      recentAchievements,
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Profil verileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

