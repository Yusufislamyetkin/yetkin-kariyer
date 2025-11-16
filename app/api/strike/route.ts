import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

interface DayTaskStatus {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
  tasks: {
    login: boolean;
    testSolved: boolean;
    topicCompleted: boolean;
    liveCodingCompleted: boolean;
    bugFixCompleted: boolean;
  };
  allTasksCompleted: boolean;
  taskDetails?: {
    login?: { completedAt: string | null };
    testSolved?: { completedAt: string | null; count: number };
    topicCompleted?: { completedAt: string | null; count: number };
    liveCodingCompleted?: { completedAt: string | null; count: number };
    bugFixCompleted?: { completedAt: string | null; count: number };
  };
}

export async function GET() {
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

    let streak = userStreak;
    if (!streak) {
      streak = await db.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          totalDaysActive: 0,
        },
      });
    }

    // Calculate current week (Monday to Sunday)
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Get user registration date
    const registrationDate = new Date(user.createdAt);
    registrationDate.setHours(0, 0, 0, 0);
    
    // Determine the start date for checking (registration date or Monday, whichever is later)
    const checkStartDate = registrationDate > monday ? registrationDate : monday;

    // Build array of days from Monday to Sunday
    const weekDays: DayTaskStatus[] = [];
    const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      
      const dateStr = date.toISOString();
      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;
      const dayName = dayNames[date.getDay()];
      const dayNumber = date.getDate();
      
      // Check if this day is before registration
      const isBeforeRegistration = date < registrationDate;
      
      weekDays.push({
        date: dateStr,
        dayName,
        dayNumber,
        isToday,
        isFuture: isFuture || isBeforeRegistration,
        tasks: {
          login: false,
          testSolved: false,
          topicCompleted: false,
          liveCodingCompleted: false,
          bugFixCompleted: false,
        },
        allTasksCompleted: false,
        taskDetails: {
          login: { completedAt: null },
          testSolved: { completedAt: null, count: 0 },
          topicCompleted: { completedAt: null, count: 0 },
          liveCodingCompleted: { completedAt: null, count: 0 },
          bugFixCompleted: { completedAt: null, count: 0 },
        },
      });
    }

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
        orderBy: {
          completedAt: "desc",
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
        orderBy: {
          completedAt: "desc",
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
        orderBy: {
          completedAt: "desc",
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
        orderBy: {
          completedAt: "desc",
        },
      }),
      // Get lastActivityDate for login tracking
      db.userStreak.findUnique({
        where: { userId },
        select: { lastActivityDate: true },
      }),
    ]);

    // Process activities for each day
    weekDays.forEach((day) => {
      const dayStart = new Date(day.date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // Check login (lastActivityDate)
      if (weekUserStreakUpdates?.lastActivityDate) {
        const lastActivity = new Date(weekUserStreakUpdates.lastActivityDate);
        if (lastActivity >= dayStart && lastActivity <= dayEnd) {
          day.tasks.login = true;
          day.taskDetails!.login!.completedAt = lastActivity.toISOString();
        }
      }

      // Check test solved
      const dayQuizAttempts = weekQuizAttempts.filter((attempt) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dayEnd;
      });
      if (dayQuizAttempts.length > 0) {
        day.tasks.testSolved = true;
        day.taskDetails!.testSolved!.completedAt = dayQuizAttempts[0].completedAt.toISOString();
        day.taskDetails!.testSolved!.count = dayQuizAttempts.length;
      }

      // Check topic completed
      const dayTopicCompletions = weekTopicCompletions.filter((completion) => {
        if (!completion.completedAt) return false;
        const completionDate = new Date(completion.completedAt);
        return completionDate >= dayStart && completionDate <= dayEnd;
      });
      if (dayTopicCompletions.length > 0) {
        day.tasks.topicCompleted = true;
        day.taskDetails!.topicCompleted!.completedAt = dayTopicCompletions[0].completedAt!.toISOString();
        day.taskDetails!.topicCompleted!.count = dayTopicCompletions.length;
      }

      // Check live coding completed
      const dayLiveCodingAttempts = weekLiveCodingAttempts.filter((attempt) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dayEnd;
      });
      if (dayLiveCodingAttempts.length > 0) {
        day.tasks.liveCodingCompleted = true;
        day.taskDetails!.liveCodingCompleted!.completedAt = dayLiveCodingAttempts[0].completedAt.toISOString();
        day.taskDetails!.liveCodingCompleted!.count = dayLiveCodingAttempts.length;
      }

      // Check bug fix completed
      const dayBugFixAttempts = weekBugFixAttempts.filter((attempt) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dayEnd;
      });
      if (dayBugFixAttempts.length > 0) {
        day.tasks.bugFixCompleted = true;
        day.taskDetails!.bugFixCompleted!.completedAt = dayBugFixAttempts[0].completedAt.toISOString();
        day.taskDetails!.bugFixCompleted!.count = dayBugFixAttempts.length;
      }

      // Check if all tasks are completed (only for days that are not future and not before registration)
      if (!day.isFuture) {
        day.allTasksCompleted =
          day.tasks.login &&
          day.tasks.testSolved &&
          day.tasks.topicCompleted &&
          day.tasks.liveCodingCompleted &&
          day.tasks.bugFixCompleted;
      }
    });

    // Calculate today's completed tasks
    const todayDay = weekDays.find((d) => d.isToday);
    const todayCompleted = todayDay
      ? {
          login: todayDay.tasks.login,
          testSolved: todayDay.tasks.testSolved,
          topicCompleted: todayDay.tasks.topicCompleted,
          liveCodingCompleted: todayDay.tasks.liveCodingCompleted,
          bugFixCompleted: todayDay.tasks.bugFixCompleted,
        }
      : {
          login: false,
          testSolved: false,
          topicCompleted: false,
          liveCodingCompleted: false,
          bugFixCompleted: false,
        };

    // Update streak based on today's activity
    const hasRealActivityToday =
      todayCompleted.testSolved ||
      todayCompleted.topicCompleted ||
      todayCompleted.liveCodingCompleted ||
      todayCompleted.bugFixCompleted;

    if (hasRealActivityToday) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastActivityDate = streak.lastActivityDate
        ? new Date(streak.lastActivityDate)
        : null;
      const lastActivityDay = lastActivityDate
        ? new Date(lastActivityDate.setHours(0, 0, 0, 0))
        : null;

      let newStreak = streak.currentStreak;
      let newTotalDays = streak.totalDaysActive;
      let shouldUpdate = false;

      if (!lastActivityDay || lastActivityDay.getTime() < today.getTime()) {
        if (!lastActivityDay || lastActivityDay.getTime() === yesterday.getTime()) {
          newStreak = streak.currentStreak + 1;
          shouldUpdate = true;
        } else if (lastActivityDay.getTime() < yesterday.getTime()) {
          newStreak = 1;
          shouldUpdate = true;
        }

        if (!lastActivityDay || lastActivityDay.getTime() < today.getTime()) {
          newTotalDays = streak.totalDaysActive + 1;
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        const newLongestStreak = Math.max(newStreak, streak.longestStreak);
        streak = await db.userStreak.update({
          where: { userId },
          data: {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            totalDaysActive: newTotalDays,
            lastActivityDate: today,
          },
        });
      } else if (!lastActivityDay || lastActivityDay.getTime() < today.getTime()) {
        streak = await db.userStreak.update({
          where: { userId },
          data: {
            lastActivityDate: today,
          },
        });
      }
    } else if (!streak.lastActivityDate || new Date(streak.lastActivityDate).setHours(0, 0, 0, 0) !== today.getTime()) {
      // Mark login for today
      streak = await db.userStreak.update({
        where: { userId },
        data: {
          lastActivityDate: today,
        },
      });
    }

    // Count days with all tasks completed
    const daysWithAllTasksCompleted = weekDays.filter(
      (day) => day.allTasksCompleted && !day.isFuture
    ).length;

    // Calculate weekly progress
    const weeklyProgress = {
      daysCompleted: daysWithAllTasksCompleted,
      totalDays: 7,
      registrationDate: registrationDate.toISOString(),
      weekStart: monday.toISOString(),
      weekEnd: sunday.toISOString(),
    };

    return NextResponse.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalDaysActive: streak.totalDaysActive,
      todayCompleted,
      weekDays,
      weeklyProgress,
    });
  } catch (error) {
    console.error("Error fetching strike data:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Strike verileri yüklenirken bir hata oluştu";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

