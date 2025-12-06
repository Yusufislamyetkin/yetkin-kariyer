import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";

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
    socialInteraction: boolean;
    communityContribution: boolean;
  };
  allTasksCompleted: boolean;
  taskDetails?: {
    login?: { completedAt: string | null };
    testSolved?: { completedAt: string | null; count: number };
    topicCompleted?: { completedAt: string | null; count: number };
    socialInteraction?: { completedAt: string | null; count: number };
    communityContribution?: { completedAt: string | null; count: number };
  };
  _isNewlyCompleted?: boolean; // Internal flag to track if strike was just completed
}

export async function GET() {
  try {
    const session = await auth();
    
    // Get userId - handle Gmail OAuth users where session.user.id might not be set immediately
    let userId: string | null = session?.user?.id as string | null;
    
    if (!userId && session?.user?.email) {
      // For Gmail OAuth users, try to get userId from email as fallback
      try {
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        if (dbUser) {
          userId = dbUser.id;
        }
      } catch (error) {
        console.error("Error fetching user by email in strike API:", error);
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
          socialInteraction: false,
          communityContribution: false,
        },
        allTasksCompleted: false,
        taskDetails: {
          login: { completedAt: null },
          testSolved: { completedAt: null, count: 0 },
          topicCompleted: { completedAt: null, count: 0 },
          socialInteraction: { completedAt: null, count: 0 },
          communityContribution: { completedAt: null, count: 0 },
        },
      });
    }

    // Community group slugs for filtering
    const COMMUNITY_SLUGS = [
      "dotnet-core-community",
      "java-community",
      "mssql-community",
      "react-community",
      "angular-community",
      "nodejs-community",
      "ai-community",
      "flutter-community",
      "ethical-hacking-community",
      "nextjs-community",
      "docker-kubernetes-community",
      "owasp-community",
    ];

    // Update lastActivityDate for today's login BEFORE processing activities
    // This ensures login is marked as completed when the API is called
    if (!streak.lastActivityDate || new Date(streak.lastActivityDate).setHours(0, 0, 0, 0) !== today.getTime()) {
      streak = await db.userStreak.update({
        where: { userId },
        data: {
          lastActivityDate: today,
        },
      });
    }

    // Fetch all activities for the week
    const [
      weekQuizAttempts,
      weekTopicCompletions,
      weekPosts,
      weekComments,
      weekCommunityMessages,
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
      db.post.findMany({
        where: {
          userId,
          createdAt: {
            gte: checkStartDate,
            lte: sunday,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.postComment.findMany({
        where: {
          userId,
          createdAt: {
            gte: checkStartDate,
            lte: sunday,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.chatMessage.findMany({
        where: {
          userId,
          createdAt: {
            gte: checkStartDate,
            lte: sunday,
          },
          group: {
            slug: { in: COMMUNITY_SLUGS },
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Process activities for each day
    for (const day of weekDays) {
      const dayStart = new Date(day.date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // Check login (lastActivityDate) - use updated streak object
      if (streak?.lastActivityDate) {
        const lastActivity = new Date(streak.lastActivityDate);
        if (lastActivity >= dayStart && lastActivity <= dayEnd) {
          day.tasks.login = true;
          day.taskDetails!.login!.completedAt = lastActivity.toISOString();
        }
      }

      // Check test solved
      const dayQuizAttempts = weekQuizAttempts.filter((attempt: { completedAt: Date | string }) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dayEnd;
      });
      if (dayQuizAttempts.length > 0) {
        day.tasks.testSolved = true;
        day.taskDetails!.testSolved!.completedAt = dayQuizAttempts[0].completedAt.toISOString();
        day.taskDetails!.testSolved!.count = dayQuizAttempts.length;
      }

      // Check topic completed
      const dayTopicCompletions = weekTopicCompletions.filter((completion: { completedAt: Date | string | null }) => {
        if (!completion.completedAt) return false;
        const completionDate = new Date(completion.completedAt);
        return completionDate >= dayStart && completionDate <= dayEnd;
      });
      if (dayTopicCompletions.length > 0) {
        day.tasks.topicCompleted = true;
        day.taskDetails!.topicCompleted!.completedAt = dayTopicCompletions[0].completedAt!.toISOString();
        day.taskDetails!.topicCompleted!.count = dayTopicCompletions.length;
      }

      // Check social interaction (post or comment)
      const dayPosts = weekPosts.filter((post: { createdAt: Date | string }) => {
        const postDate = new Date(post.createdAt);
        return postDate >= dayStart && postDate <= dayEnd;
      });
      const dayComments = weekComments.filter((comment: { createdAt: Date | string }) => {
        const commentDate = new Date(comment.createdAt);
        return commentDate >= dayStart && commentDate <= dayEnd;
      });
      const daySocialInteractions = dayPosts.length + dayComments.length;
      if (daySocialInteractions > 0) {
        day.tasks.socialInteraction = true;
        const firstActivity = dayPosts[0] || dayComments[0];
        day.taskDetails!.socialInteraction!.completedAt = firstActivity.createdAt.toISOString();
        day.taskDetails!.socialInteraction!.count = daySocialInteractions;
      }

      // Check community contribution (message in community group)
      const dayCommunityMessages = weekCommunityMessages.filter((message: { createdAt: Date | string }) => {
        const messageDate = new Date(message.createdAt);
        return messageDate >= dayStart && messageDate <= dayEnd;
      });
      if (dayCommunityMessages.length > 0) {
        day.tasks.communityContribution = true;
        day.taskDetails!.communityContribution!.completedAt = dayCommunityMessages[0].createdAt.toISOString();
        day.taskDetails!.communityContribution!.count = dayCommunityMessages.length;
      }

      // Check if all tasks are completed (only for days that are not future and not before registration)
      if (!day.isFuture) {
        day.allTasksCompleted =
          day.tasks.login &&
          day.tasks.testSolved &&
          day.tasks.topicCompleted &&
          day.tasks.socialInteraction &&
          day.tasks.communityContribution;

        // Award 100 points for daily strike completion (only once per day)
        if (day.allTasksCompleted) {
          const dayDateStr = dayStart.toISOString().split("T")[0];
          const dedupKey = `daily_strike_${userId}_${dayDateStr}`;
          
          // Check if points were already awarded for this day
          const existingEvent = await db.gamificationEvent.findUnique({
            where: { dedupKey },
          });

          if (!existingEvent) {
            try {
              const event = await recordEvent({
                userId,
                type: "daily_strike_completed",
                payload: { date: dayDateStr },
                dedupKey,
                occurredAt: dayStart,
              });
              await applyRules({
                userId,
                type: "daily_strike_completed",
                payload: { sourceEventId: event.id, date: dayDateStr },
              });
              // Mark that this day's strike was newly completed
              if (day.isToday) {
                day._isNewlyCompleted = true;
              }
            } catch (e) {
              console.warn("Gamification daily_strike_completed failed:", e);
            }
          }
        }
      }
    }

    // Calculate today's completed tasks
    const todayDay = weekDays.find((d) => d.isToday);
    const todayCompleted = todayDay
      ? {
          login: todayDay.tasks.login,
          testSolved: todayDay.tasks.testSolved,
          topicCompleted: todayDay.tasks.topicCompleted,
          socialInteraction: todayDay.tasks.socialInteraction,
          communityContribution: todayDay.tasks.communityContribution,
        }
      : {
          login: false,
          testSolved: false,
          topicCompleted: false,
          socialInteraction: false,
          communityContribution: false,
        };

    // Update streak based on today's activity
    const hasRealActivityToday =
      todayCompleted.testSolved ||
      todayCompleted.topicCompleted ||
      todayCompleted.socialInteraction ||
      todayCompleted.communityContribution;

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
    }
    // Note: lastActivityDate is already updated at the beginning of the function
    // This section is only for updating streak when there's real activity today

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

    // Calculate current strike combo (consecutive days with all tasks completed)
    let currentStrikeCombo = 0;
    const todayAllCompleted = todayDay?.allTasksCompleted || false;
    
    if (todayAllCompleted) {
      // Get all daily_strike_completed events for this user, ordered by date descending
      const strikeEvents = await db.gamificationEvent.findMany({
        where: {
          userId,
          type: "daily_strike_completed",
        },
        select: {
          occurredAt: true,
          payload: true,
        },
        orderBy: {
          occurredAt: "desc",
        },
      });

      // Extract unique dates from events
      const strikeDates = new Set<string>();
      strikeEvents.forEach((event: { occurredAt: Date; payload: any }) => {
        const eventDate = new Date(event.occurredAt);
        const dateStr = eventDate.toISOString().split("T")[0];
        strikeDates.add(dateStr);
      });

      // Check if today is completed (might not be in events yet if just completed)
      const todayDateStr = today.toISOString().split("T")[0];
      if (todayAllCompleted) {
        strikeDates.add(todayDateStr);
      }

      // Calculate consecutive days from today backwards
      let checkDate = new Date(today);
      checkDate.setHours(0, 0, 0, 0);
      
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (strikeDates.has(dateStr)) {
          currentStrikeCombo++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate longest strike combo (all time)
    const allStrikeEvents = await db.gamificationEvent.findMany({
      where: {
        userId,
        type: "daily_strike_completed",
      },
      select: {
        occurredAt: true,
      },
      orderBy: {
        occurredAt: "asc",
      },
    });

    let longestStrikeCombo = 0;
    if (allStrikeEvents.length > 0) {
      // Extract unique dates and sort them
      const allStrikeDates = new Set<string>();
      allStrikeEvents.forEach((event: { occurredAt: Date }) => {
        const eventDate = new Date(event.occurredAt);
        const dateStr = eventDate.toISOString().split("T")[0];
        allStrikeDates.add(dateStr);
      });

      const sortedDates = Array.from(allStrikeDates).sort();
      
      // Find longest consecutive sequence
      let currentSequence = 0;
      let maxSequence = 0;
      let previousDate: Date | null = null;

      for (const dateStr of sortedDates) {
        const currentDate = new Date(dateStr + "T00:00:00.000Z");
        
        if (previousDate === null) {
          currentSequence = 1;
        } else {
          const daysDiff = Math.floor(
            (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysDiff === 1) {
            // Consecutive day
            currentSequence++;
          } else {
            // Break in sequence
            maxSequence = Math.max(maxSequence, currentSequence);
            currentSequence = 1;
          }
        }
        
        previousDate = currentDate;
      }
      
      longestStrikeCombo = Math.max(maxSequence, currentSequence);
    }

    // Calculate total login days using userStreak.totalDaysActive
    // This value is already maintained by updateDailyLoginStreak function
    // which increments it every time user logs in
    // This ensures we count ALL login days from the user's registration date, not just this week
    let totalLoginDays = streak.totalDaysActive || 0;

    // If today's login hasn't been counted yet (lastActivityDate is today but totalDaysActive might not be updated)
    // This is a safety check, but updateDailyLoginStreak should have already updated it
    if (streak.lastActivityDate) {
      const lastActivity = new Date(streak.lastActivityDate);
      const lastActivityDateStr = lastActivity.toISOString().split("T")[0];
      const todayDateStr = today.toISOString().split("T")[0];
      
      // If lastActivityDate is today but totalDaysActive seems low, add today
      // This handles edge cases where updateDailyLoginStreak wasn't called
      if (lastActivityDateStr === todayDateStr && totalLoginDays === 0) {
        totalLoginDays = 1;
      }
    }

    // Check if today's strike was newly completed
    // This means all tasks are completed today and the event was just created in this request
    const isNewlyCompleted = todayDay?._isNewlyCompleted === true;

    return NextResponse.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalDaysActive: totalLoginDays, // Changed to totalLoginDays
      currentStrikeCombo, // New field
      longestStrikeCombo, // New field
      isNewlyCompleted, // New field - true if strike was just completed in this request
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

