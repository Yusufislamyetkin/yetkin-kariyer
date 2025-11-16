import { db } from "@/lib/db";

interface WeeklyBadgeCheckParams {
  userId: string;
}

interface WeeklyBadgeCheckResult {
  eligible: boolean;
  daysCompleted: number;
  totalDays: number;
  weekStart: Date;
  weekEnd: Date;
}

export async function checkWeeklyBadgeEligibility({
  userId,
}: WeeklyBadgeCheckParams): Promise<WeeklyBadgeCheckResult> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Calculate Monday of current week
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  // Calculate Sunday of current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Get all quiz attempts this week
  const weekQuizAttempts = await db.quizAttempt.findMany({
    where: {
      userId,
      completedAt: {
        gte: monday,
        lte: sunday,
      },
    },
    select: {
      completedAt: true,
    },
  });

  // Get all topic completions this week
  const weekTopicCompletions = await db.lessonCompletion.findMany({
    where: {
      userId,
      completedAt: {
        gte: monday,
        lte: sunday,
      },
    },
    select: {
      completedAt: true,
    },
  });

  // Get unique days with activity (login + test or topic)
  const activeDays = new Set<string>();
  
  weekQuizAttempts.forEach((attempt) => {
    const date = new Date(attempt.completedAt);
    date.setHours(0, 0, 0, 0);
    activeDays.add(date.toISOString().split('T')[0]);
  });
  
  weekTopicCompletions.forEach((completion) => {
    if (completion.completedAt) {
      const date = new Date(completion.completedAt);
      date.setHours(0, 0, 0, 0);
      activeDays.add(date.toISOString().split('T')[0]);
    }
  });

  const daysCompleted = activeDays.size;
  const totalDays = Math.min(7, Math.floor((now.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  // Eligible if all 7 days are completed
  const eligible = daysCompleted >= 7;

  return {
    eligible,
    daysCompleted,
    totalDays,
    weekStart: monday,
    weekEnd: sunday,
  };
}

export async function awardWeeklyBadge(userId: string): Promise<boolean> {
  try {
    // Check if weekly badge exists
    const weeklyBadge = await db.badge.findFirst({
      where: {
        category: "special",
        name: {
          contains: "Haftalık",
        },
      },
    });

    if (!weeklyBadge) {
      // Create weekly badge if it doesn't exist
      const newBadge = await db.badge.create({
        data: {
          name: "Haftalık Champion",
          description: "Bir hafta boyunca her gün giriş yapıp test çözen veya konu tamamlayan kullanıcı",
          icon: "🔥",
          color: "#FF6B35",
          category: "special",
          criteria: {
            type: "weekly_completion",
            value: 7,
          },
          rarity: "epic",
          points: 100,
        },
      });

      // Check if user already has this badge this week
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);

      const existingBadge = await db.userBadge.findFirst({
        where: {
          userId,
          badgeId: newBadge.id,
          earnedAt: {
            gte: monday,
          },
        },
      });

      if (!existingBadge) {
        await db.userBadge.create({
          data: {
            userId,
            badgeId: newBadge.id,
            isDisplayed: true,
          },
        });
        return true;
      }
      return false;
    } else {
      // Check if user already has this badge this week
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);

      const existingBadge = await db.userBadge.findFirst({
        where: {
          userId,
          badgeId: weeklyBadge.id,
          earnedAt: {
            gte: monday,
          },
        },
      });

      if (!existingBadge) {
        await db.userBadge.create({
          data: {
            userId,
            badgeId: weeklyBadge.id,
            isDisplayed: true,
          },
        });
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error("Error awarding weekly badge:", error);
    return false;
  }
}

