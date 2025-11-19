import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Get user and user streak
    const [user, userStreak] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
      db.userStreak.findUnique({
        where: { userId },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userStreak) {
      return NextResponse.json(
        { error: "Streak not found", eligible: false },
        { status: 404 }
      );
    }

    // Calculate current week (Monday to Sunday)
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Get user registration date
    const registrationDate = new Date(user.createdAt);
    registrationDate.setHours(0, 0, 0, 0);

    // Determine the start date for checking
    const checkStartDate = registrationDate > monday ? registrationDate : monday;

    // Fetch all activities for the week
    const [
      weekQuizAttempts,
      weekTopicCompletions,
      weekLiveCodingAttempts,
      weekBugFixAttempts,
      weekUserStreakUpdates,
    ] = await Promise.all([
      db.quizAttempt.findMany({
        where: {
          userId,
          completedAt: {
            gte: checkStartDate,
            lte: sunday,
          },
        },
        select: {
          completedAt: true,
        },
      }),
      db.lessonCompletion.findMany({
        where: {
          userId,
          completedAt: {
            gte: checkStartDate,
            lte: sunday,
          },
        },
        select: {
          completedAt: true,
        },
      }),
      db.liveCodingAttempt.findMany({
        where: {
          userId,
          completedAt: {
            gte: checkStartDate,
            lte: sunday,
          },
        },
        select: {
          completedAt: true,
        },
      }),
      db.bugFixAttempt.findMany({
        where: {
          userId,
          completedAt: {
            gte: checkStartDate,
            lte: sunday,
          },
        },
        select: {
          completedAt: true,
        },
      }),
      db.userStreak.findUnique({
        where: { userId },
        select: { lastActivityDate: true },
      }),
    ]);

    // Build array of days from start date to Sunday
    const daysToCheck: Array<{
      date: Date;
      tasks: {
        login: boolean;
        testSolved: boolean;
        topicCompleted: boolean;
        liveCodingCompleted: boolean;
        bugFixCompleted: boolean;
      };
    }> = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      // Skip days before registration
      if (date < registrationDate) {
        continue;
      }

      // Skip future days
      if (date > today) {
        continue;
      }

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      // Check login
      let hasLogin = false;
      if (weekUserStreakUpdates?.lastActivityDate) {
        const lastActivity = new Date(weekUserStreakUpdates.lastActivityDate);
        if (lastActivity >= dayStart && lastActivity <= dateEnd) {
          hasLogin = true;
        }
      }

      // Check test solved
      const dayQuizAttempts = weekQuizAttempts.filter((attempt: { completedAt: Date | string }) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dateEnd;
      });
      const hasTestSolved = dayQuizAttempts.length > 0;

      // Check topic completed
      const dayTopicCompletions = weekTopicCompletions.filter((completion: { completedAt: Date | string | null }) => {
        if (!completion.completedAt) return false;
        const completionDate = new Date(completion.completedAt);
        return completionDate >= dayStart && completionDate <= dateEnd;
      });
      const hasTopicCompleted = dayTopicCompletions.length > 0;

      // Check live coding completed
      const dayLiveCodingAttempts = weekLiveCodingAttempts.filter((attempt: { completedAt: Date | string }) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dateEnd;
      });
      const hasLiveCodingCompleted = dayLiveCodingAttempts.length > 0;

      // Check bug fix completed
      const dayBugFixAttempts = weekBugFixAttempts.filter((attempt: { completedAt: Date | string }) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dateEnd;
      });
      const hasBugFixCompleted = dayBugFixAttempts.length > 0;

      daysToCheck.push({
        date,
        tasks: {
          login: hasLogin,
          testSolved: hasTestSolved,
          topicCompleted: hasTopicCompleted,
          liveCodingCompleted: hasLiveCodingCompleted,
          bugFixCompleted: hasBugFixCompleted,
        },
      });
    }

    // Check if all days have all tasks completed
    const allDaysCompleted = daysToCheck.every((day) => {
      return (
        day.tasks.login &&
        day.tasks.testSolved &&
        day.tasks.topicCompleted &&
        day.tasks.liveCodingCompleted &&
        day.tasks.bugFixCompleted
      );
    });

    // Check if eligible for reward
    // Case 1: 7 consecutive days all tasks completed
    // Case 2: Mid-week registration - all tasks from registration to Sunday completed
    const isMidWeekRegistration = registrationDate > monday;
    const daysFromRegistration = daysToCheck.length;

    let eligible = false;
    if (isMidWeekRegistration) {
      // Mid-week registration: all tasks from registration to Sunday must be completed
      eligible = allDaysCompleted && daysFromRegistration > 0;
    } else {
      // Normal case: 7 consecutive days all tasks completed
      eligible = allDaysCompleted && daysToCheck.length === 7;
    }

    if (!eligible) {
      return NextResponse.json({
        eligible: false,
        message: "Ödül için tüm görevler tamamlanmalı",
        daysCompleted: daysToCheck.filter((day) => {
          return (
            day.tasks.login &&
            day.tasks.testSolved &&
            day.tasks.topicCompleted &&
            day.tasks.liveCodingCompleted &&
            day.tasks.bugFixCompleted
          );
        }).length,
        totalDays: daysToCheck.length,
      });
    }

    // Check if reward badge already exists
    const rewardBadgeName = isMidWeekRegistration
      ? "Haftalık Strike Ödülü (Hafta Ortası)"
      : "Haftalık Strike Ödülü";

    let rewardBadge = await db.badge.findFirst({
      where: {
        name: rewardBadgeName,
        category: "special",
      },
    });

    // Create badge if it doesn't exist
    if (!rewardBadge) {
      rewardBadge = await db.badge.create({
        data: {
          name: rewardBadgeName,
          description: isMidWeekRegistration
            ? "Hafta ortası kayıt olup tüm görevleri tamamlayan kullanıcı"
            : "7 gün peş peşe tüm görevleri tamamlayan kullanıcı",
          icon: "🔥",
          color: "#FF6B35",
          category: "special",
          criteria: {
            type: "weekly_strike_completion",
            value: isMidWeekRegistration ? daysFromRegistration : 7,
          },
          rarity: "epic",
          points: 150, // Reward points
        },
      });
    }

    // Check if user already has this badge for this week
    const weekStart = monday.toISOString().split("T")[0];
    const existingBadge = await db.userBadge.findFirst({
      where: {
        userId,
        badgeId: rewardBadge.id,
        earnedAt: {
          gte: monday,
        },
      },
    });

    if (existingBadge) {
      return NextResponse.json({
        eligible: true,
        alreadyAwarded: true,
        message: "Bu hafta zaten ödül kazandınız!",
        badge: {
          id: rewardBadge.id,
          name: rewardBadge.name,
          points: rewardBadge.points,
        },
      });
    }

    // Award the badge
    await db.userBadge.create({
      data: {
        userId,
        badgeId: rewardBadge.id,
        isDisplayed: true,
      },
    });

    return NextResponse.json({
      eligible: true,
      alreadyAwarded: false,
      message: "Tebrikler! Ödül kazandınız!",
      badge: {
        id: rewardBadge.id,
        name: rewardBadge.name,
        points: rewardBadge.points,
      },
      daysCompleted: daysToCheck.length,
    });
  } catch (error) {
    console.error("Error checking reward eligibility:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Ödül kontrolü sırasında bir hata oluştu";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

