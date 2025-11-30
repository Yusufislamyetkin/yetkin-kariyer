import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { HackathonTeamMemberStatus } from "@prisma/client";

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
      completedLessons,
      recentBadges,
      allUserBadges,
      quizAttempts,
      testAttempts,
      liveCodingAttempts,
      bugFixAttempts,
      hackatonAttempts,
      hackathonMemberships,
      hackathonSubmissions,
      monthlyFirstPlaces,
      freelancerEarnings,
    ] = await Promise.all([
      db.userBadge.count({ where: { userId } }),
      db.lessonCompletion.count({ where: { userId } }),
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
      db.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
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
      db.hackathonTeamMember.findMany({
        where: {
          userId,
          status: HackathonTeamMemberStatus.active,
        },
        select: {
          team: {
            select: {
              hackathonId: true,
            },
          },
        },
      }),
      db.hackathonSubmission.findMany({
        where: {
          OR: [
            { userId: userId },
            {
              team: {
                members: {
                  some: {
                    userId: userId,
                    status: "active",
                  },
                },
              },
            },
          ],
          status: {
            in: ["winner", "finalist"],
          },
        },
      }),
      db.leaderboardEntry.findMany({
        where: {
          userId: userId,
          period: "monthly",
          rank: 1,
        },
      }),
      db.freelancerBid.findMany({
        where: {
          userId: userId,
          status: "accepted",
        },
        select: {
          amount: true,
        },
      }),
    ]);

    const expertiseSet = new Set<string>();
    const safeAddExpertise = (expertise?: string | null) => {
      if (expertise) {
        expertiseSet.add(expertise);
      }
    };

    quizAttempts.forEach((attempt: { quiz?: { course?: { expertise?: string | null } | null } | null }) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    testAttempts.forEach((attempt: { quiz?: { course?: { expertise?: string | null } | null } | null }) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    liveCodingAttempts.forEach((attempt: { quiz?: { course?: { expertise?: string | null } | null } | null }) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    bugFixAttempts.forEach((attempt: { quiz?: { course?: { expertise?: string | null } | null } | null }) =>
      safeAddExpertise(attempt.quiz?.course?.expertise ?? null)
    );
    hackatonAttempts.forEach((attempt: { quiz?: { course?: { expertise?: string | null } | null } | null }) =>
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

    const quizScores = quizAttempts.map((attempt: { score: number }) => attempt.score);
    const testScores = testAttempts.map((attempt: { metrics?: unknown }) =>
      parseMetricScore(attempt.metrics as any, "score")
    );
    const liveCodingScores = liveCodingAttempts.map((attempt: { metrics?: unknown }) =>
      parseMetricScore(attempt.metrics as any, "codeQuality")
    );
    const bugFixScores = bugFixAttempts.map((attempt: { metrics?: unknown }) =>
      parseMetricScore(attempt.metrics as any, "codeQuality")
    );
    const hackatonScores = hackatonAttempts.map((attempt: { metrics?: unknown }) =>
      parseMetricScore(attempt.metrics as any, "projectScore")
    );

    const recentAchievements = recentBadges
      .filter((badge: { badge: any }) => badge.badge)
      .map((badge: { badge: { id: string; name: string; icon: string; color: string; rarity: string }; earnedAt: Date }) => ({
        id: badge.badge.id,
        name: badge.badge.name,
        icon: badge.badge.icon,
        color: badge.badge.color,
        rarity: badge.badge.rarity,
        earnedAt: badge.earnedAt,
      }));

    // Calculate total points from badges
    const totalPoints = allUserBadges.reduce(
      (sum: number, userBadge: { badge: { points?: number | null } }) => sum + (userBadge.badge.points || 0),
      0
    );

    // Calculate participated hackathons count
    const distinctHackathonIds = new Set(
      hackathonMemberships.map((membership: { team: { hackathonId: string } }) => membership.team.hackathonId)
    );
    const participatedHackathons = distinctHackathonIds.size;

    // Calculate total earnings
    const hackathonTotal = hackathonSubmissions.length * 1000; // Placeholder: 1000 TL per win
    const leaderboardTotal = monthlyFirstPlaces.length * 500; // Placeholder: 500 TL per #1
    const freelancerTotal = freelancerEarnings.reduce((sum: number, bid: { amount: number | null }) => sum + (bid.amount || 0), 0);
    const totalEarnings = hackathonTotal + leaderboardTotal + freelancerTotal;

    return NextResponse.json({
      user,
      stats: {
        badgeCount,
        completedLessons,
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
        totalPoints,
        participatedHackathons,
        totalEarnings,
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

