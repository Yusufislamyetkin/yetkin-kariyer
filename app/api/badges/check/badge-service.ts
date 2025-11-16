import { db } from "@/lib/db";

export interface BadgeCheckResult {
  newlyEarnedBadges: any[];
  totalEarned: number;
}

interface BadgeCheckParams {
  userId: string;
  quizAttemptId: string;
}

export async function checkBadgesForAttempt({
  userId,
  quizAttemptId,
}: BadgeCheckParams): Promise<BadgeCheckResult> {
  const quizAttempt = await db.quizAttempt.findUnique({
    where: { id: quizAttemptId },
    include: { quiz: true },
  });

  if (!quizAttempt || quizAttempt.userId !== userId) {
    throw new Error("Test denemesi bulunamadı");
  }

  const allBadges = await db.badge.findMany();
  const userBadges = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));
  const newlyEarnedBadges: any[] = [];

  const userQuizAttempts = await db.quizAttempt.findMany({
    where: { userId },
  });

  const totalQuizCount = userQuizAttempts.length;
  const averageScore =
    totalQuizCount > 0
      ? userQuizAttempts.reduce((sum, qa) => sum + qa.score, 0) / totalQuizCount
      : 0;

  let userStreak = await db.userStreak.findUnique({
    where: { userId },
  });

  if (!userStreak) {
    userStreak = await db.userStreak.create({
      data: {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalDaysActive: 0,
      },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActivityDate = userStreak.lastActivityDate
    ? new Date(userStreak.lastActivityDate)
    : null;
  const lastActivityDay = lastActivityDate
    ? new Date(lastActivityDate.setHours(0, 0, 0, 0))
    : null;

  let newStreak = userStreak.currentStreak;
  if (!lastActivityDay || lastActivityDay.getTime() < today.getTime()) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastActivityDay || lastActivityDay.getTime() === yesterday.getTime()) {
      newStreak = userStreak.currentStreak + 1;
    } else if (lastActivityDay.getTime() < yesterday.getTime()) {
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(newStreak, userStreak.longestStreak);

  await db.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
      totalDaysActive: {
        increment: lastActivityDay?.getTime() !== today.getTime() ? 1 : 0,
      },
    },
  });

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) {
      continue;
    }

    const criteria = badge.criteria as any;
    let shouldEarn = false;

    switch (badge.category) {
      case "test_count":
        if (
          criteria.type === "total_quizzes" &&
          totalQuizCount >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "score":
        if (criteria.type === "average_score" && averageScore >= criteria.value) {
          shouldEarn = true;
        } else if (
          criteria.type === "single_score" &&
          quizAttempt.score >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "perfect_score" &&
          quizAttempt.score === 100
        ) {
          shouldEarn = true;
        }
        break;
      case "streak":
        if (
          criteria.type === "current_streak" &&
          newStreak >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "longest_streak" &&
          longestStreak >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "topic":
        if (criteria.type === "topic_complete" && quizAttempt.topic) {
          const topicQuizzes = await db.quiz.findMany({
            where: { topic: quizAttempt.topic },
          });

          const topicAttempts = await db.quizAttempt.findMany({
            where: {
              userId,
              quizId: { in: topicQuizzes.map((q) => q.id) },
            },
          });

          const allPerfect = topicQuizzes.every((tq) =>
            topicAttempts.some(
              (ta) => ta.quizId === tq.id && ta.score === 100
            )
          );

          if (allPerfect) {
            shouldEarn = true;
          }
        }
        break;
      case "special":
        if (criteria.type === "first_quiz" && totalQuizCount === 1) {
          shouldEarn = true;
        } else if (
          criteria.type === "fast_completion" &&
          quizAttempt.duration &&
          quizAttempt.duration <= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
    }

    if (shouldEarn) {
      await db.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      newlyEarnedBadges.push(badge);
      earnedBadgeIds.add(badge.id);
    }
  }

  return {
    newlyEarnedBadges,
    totalEarned: newlyEarnedBadges.length,
  };
}

