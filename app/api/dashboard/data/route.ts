import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { HackathonTeamMemberStatus } from "@prisma/client";
import { readFile } from "fs/promises";
import { join } from "path";
import { getCache, setCache, cacheKeys, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  _isNewlyCompleted?: boolean;
}

// Load badges from JSON
async function loadBadgesFromJson() {
  try {
    const filePath = join(process.cwd(), "public", "data", "badges.json");
    const fileContents = await readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);
    return jsonData.badges || [];
  } catch (error) {
    console.error("Error loading badges from JSON:", error);
    return [];
  }
}

// Get week number for weekly periodDate format
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// Get period bounds for leaderboard
function getPeriodBounds(period: "daily" | "weekly" | "monthly") {
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
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    // Get userId - handle Gmail OAuth users
    let userId: string | null = session?.user?.id as string | null;
    
    if (!userId && session?.user?.email) {
      try {
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        if (dbUser) {
          userId = dbUser.id;
        }
      } catch (error) {
        console.error("Error fetching user by email:", error);
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache first
    const cacheKey = cacheKeys.dashboardData(userId);
    const cachedData = await getCache<any>(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { searchParams } = new URL(request.url);
    const activityLimit = parseInt(searchParams.get("activityLimit") || "10");
    const activitySkip = parseInt(searchParams.get("activitySkip") || "0");
    const activityType = searchParams.get("activityType") || "global";

    // Step 1: Fetch user and user streak in parallel
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

    // Step 2: Fetch all common stats in parallel (consolidated queries)
    const [
      quizStats,
      interviewStats,
      testAttemptsCount,
      cvsCount,
      applicationsCount,
      completedTopicsCount,
      hackathonMemberships,
      postsCount,
      commentsCount,
      communityMessagesCount,
      userBadges,
      allDbBadges,
      earningsData,
      leaderboardRanks,
    ] = await Promise.all([
      // Quiz stats (used by multiple endpoints)
      db.quizAttempt.aggregate({
        where: { userId },
        _count: { _all: true },
        _avg: { score: true },
      }),
      // Interview stats (used by multiple endpoints)
      db.interviewAttempt.aggregate({
        where: { userId },
        _count: { _all: true },
        _avg: { aiScore: true },
      }),
      // Dashboard stats
      db.testAttempt.count({
        where: { userId },
      }),
      db.cV.count({
        where: { userId },
      }),
      db.jobApplication.count({
        where: { userId },
      }),
      db.lessonCompletion.count({
        where: { userId },
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
      db.post.count({
        where: { userId },
      }),
      db.postComment.count({
        where: { userId },
      }),
      db.chatMessage.count({
        where: {
          userId,
          group: {
            slug: { in: COMMUNITY_SLUGS },
          },
        },
      }),
      // Badges
      db.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      }),
      db.badge.findMany(),
      // Earnings
      Promise.all([
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
          include: {
            hackathon: {
              select: {
                id: true,
                title: true,
                prizesSummary: true,
              },
            },
            team: {
              include: {
                members: {
                  where: {
                    userId: userId,
                    status: "active",
                  },
                },
              },
            },
          },
        }),
        db.leaderboardEntry.findMany({
          where: {
            userId: userId,
            period: "monthly",
            rank: 1,
          },
          orderBy: {
            periodDate: "desc",
          },
        }),
        db.freelancerBid.findMany({
          where: {
            userId: userId,
            status: "accepted",
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
      ]),
      // Leaderboard ranks (daily, weekly, monthly)
      Promise.all([
        getPeriodBounds("daily"),
        getPeriodBounds("weekly"),
        getPeriodBounds("monthly"),
      ]).then((bounds) =>
        Promise.all(
          bounds.map(({ periodDate }, index) => {
            const period = index === 0 ? "daily" : index === 1 ? "weekly" : "monthly";
            return db.leaderboardEntry.findUnique({
              where: {
                userId_period_periodDate: {
                  userId,
                  period: period === "daily" ? "daily" : period === "weekly" ? "weekly" : "monthly",
                  periodDate,
                },
              },
              select: {
                rank: true,
                quizCount: true,
                averageScore: true,
                points: true,
                highestScore: true,
              },
            }).then((entry: { rank: number; quizCount: number | null; averageScore: number | null; points: number | null; highestScore: number | null } | null) => ({ period, entry }));
          })
        )
      ),
    ]);

    // Step 3: Process dashboard stats
    const averageQuizScore = quizStats._avg.score ? Math.round(quizStats._avg.score) : 0;
    const averageInterviewScore = interviewStats._avg.aiScore ? Math.round(interviewStats._avg.aiScore) : 0;
    const distinctHackathonIds = new Set(
      hackathonMemberships.map((membership: { team: { hackathonId: string } }) => membership.team.hackathonId)
    );
    const participatedHackathons = distinctHackathonIds.size;
    const socialInteractions = postsCount + commentsCount;

    const stats = {
      quizAttempts: quizStats._count._all,
      testAttempts: testAttemptsCount,
      interviewAttempts: interviewStats._count._all,
      cvs: cvsCount,
      applications: applicationsCount,
      averageQuizScore,
      averageInterviewScore,
      completedTopics: completedTopicsCount,
      participatedHackathons,
      socialInteractions,
      communityContributions: communityMessagesCount,
    };

    // Step 4: Process badges
    const badgesFromJson = await loadBadgesFromJson();
    const badgesMapByKey = new Map(badgesFromJson.map((b: any) => [b.key, b]).filter(([key]: [any, any]) => key != null));
    const badgesMapById = new Map(badgesFromJson.map((b: any) => [b.id, b]));
    const dbBadgesMapById = new Map(allDbBadges.map((b: any) => [b.id, b]));

    const enrichedBadges = userBadges
      .map((ub: any) => {
        let badge = ub.badge;
        
        if (!badge) {
          const dbBadge = dbBadgesMapById.get(ub.badgeId) as any;
          if (dbBadge) {
            badge = dbBadge;
            if (dbBadge.key && badgesMapByKey.has(dbBadge.key)) {
              const jsonBadge = badgesMapByKey.get(dbBadge.key);
              if (jsonBadge) {
                badge = { ...jsonBadge, ...dbBadge };
              }
            }
          } else {
            if (badgesMapById.has(ub.badgeId)) {
              badge = badgesMapById.get(ub.badgeId);
            }
          }
        } else {
          const badgeAny = badge as any;
          if (badgeAny.key && badgesMapByKey.has(badgeAny.key)) {
            const jsonBadge = badgesMapByKey.get(badgeAny.key);
            if (jsonBadge) {
              badge = { ...jsonBadge, ...badge };
            }
          }
        }

        if (!badge) {
          return null;
        }

        return {
          ...badge,
          id: badge.id || ub.badgeId,
          key: badge.key || badge.id,
          earnedAt: ub.earnedAt,
          isDisplayed: ub.isDisplayed,
        };
      })
      .filter((b: any) => b !== null);

    // Step 5: Process earnings
    const [hackathonSubmissions, monthlyFirstPlaces, freelancerEarnings] = earningsData;
    const hackathonTotal = hackathonSubmissions.length * 1000;
    const leaderboardTotal = monthlyFirstPlaces.length * 500;
    const freelancerTotal = freelancerEarnings.reduce((sum: number, bid: any) => sum + (bid.amount || 0), 0);
    const totalEarnings = hackathonTotal + leaderboardTotal + freelancerTotal;

    const earnings = {
      total: totalEarnings,
      breakdown: {
        hackathon: {
          total: hackathonTotal,
          count: hackathonSubmissions.length,
        },
        leaderboard: {
          total: leaderboardTotal,
          count: monthlyFirstPlaces.length,
        },
        freelancer: {
          total: freelancerTotal,
          count: freelancerEarnings.length,
        },
      },
    };

    // Step 6: Process leaderboard ranks
    const ranks: Record<string, any> = {
      daily: null,
      weekly: null,
      monthly: null,
    };
    leaderboardRanks.forEach(({ period, entry }) => {
      if (entry && entry.rank && entry.rank > 0) {
        ranks[period] = {
          rank: entry.rank,
          quizCount: entry.quizCount || 0,
          averageScore: entry.averageScore || 0,
          points: entry.points || 0,
          highestScore: entry.highestScore || 0,
        };
      } else {
        ranks[period] = null;
      }
    });

    // Step 7: Calculate strike data (simplified - full calculation would be too complex here)
    // We'll fetch minimal strike data, full calculation can be done separately if needed
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

    const registrationDate = new Date(user.createdAt);
    registrationDate.setHours(0, 0, 0, 0);
    const checkStartDate = registrationDate > monday ? registrationDate : monday;

    // Update lastActivityDate for today's login
    if (!streak.lastActivityDate || new Date(streak.lastActivityDate).setHours(0, 0, 0, 0) !== today.getTime()) {
      streak = await db.userStreak.update({
        where: { userId },
        data: {
          lastActivityDate: today,
        },
      });
    }

    // Fetch week activities for strike calculation
    const [
      weekQuizAttempts,
      weekTopicCompletions,
      weekPosts,
      weekComments,
      weekCommunityMessages,
      allStrikeEvents,
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
      db.gamificationEvent.findMany({
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
      }),
    ]);

    // Process strike data
    const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const weekDays: DayTaskStatus[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      
      const dateStr = date.toISOString();
      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;
      const isBeforeRegistration = date < registrationDate;
      const dayName = dayNames[date.getDay()];
      const dayNumber = date.getDate();
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // Check login
      let loginCompleted = false;
      let loginCompletedAt: string | null = null;
      if (streak?.lastActivityDate) {
        const lastActivity = new Date(streak.lastActivityDate);
        if (lastActivity >= dayStart && lastActivity <= dayEnd) {
          loginCompleted = true;
          loginCompletedAt = lastActivity.toISOString();
        }
      }

      // Check test solved
      const dayQuizAttempts = weekQuizAttempts.filter((attempt: { completedAt: Date | string }) => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= dayStart && attemptDate <= dayEnd;
      });
      const testSolved = dayQuizAttempts.length > 0;
      const testSolvedCompletedAt = dayQuizAttempts.length > 0 ? dayQuizAttempts[0].completedAt.toISOString() : null;

      // Check topic completed
      const dayTopicCompletions = weekTopicCompletions.filter((completion: { completedAt: Date | string | null }) => {
        if (!completion.completedAt) return false;
        const completionDate = new Date(completion.completedAt);
        return completionDate >= dayStart && completionDate <= dayEnd;
      });
      const topicCompleted = dayTopicCompletions.length > 0;
      const topicCompletedAt = dayTopicCompletions.length > 0 ? dayTopicCompletions[0].completedAt!.toISOString() : null;

      // Check social interaction
      const dayPosts = weekPosts.filter((post: { createdAt: Date | string }) => {
        const postDate = new Date(post.createdAt);
        return postDate >= dayStart && postDate <= dayEnd;
      });
      const dayComments = weekComments.filter((comment: { createdAt: Date | string }) => {
        const commentDate = new Date(comment.createdAt);
        return commentDate >= dayStart && commentDate <= dayEnd;
      });
      const socialInteraction = dayPosts.length > 0 || dayComments.length > 0;
      const socialInteractionCompletedAt = dayPosts.length > 0 
        ? dayPosts[0].createdAt.toISOString() 
        : dayComments.length > 0 
        ? dayComments[0].createdAt.toISOString() 
        : null;

      // Check community contribution
      const dayCommunityMessages = weekCommunityMessages.filter((message: { createdAt: Date | string }) => {
        const messageDate = new Date(message.createdAt);
        return messageDate >= dayStart && messageDate <= dayEnd;
      });
      const communityContribution = dayCommunityMessages.length > 0;
      const communityContributionCompletedAt = dayCommunityMessages.length > 0 
        ? dayCommunityMessages[0].createdAt.toISOString() 
        : null;

      const allTasksCompleted = !isFuture && !isBeforeRegistration &&
        loginCompleted &&
        testSolved &&
        topicCompleted &&
        socialInteraction &&
        communityContribution;

      weekDays.push({
        date: dateStr,
        dayName,
        dayNumber,
        isToday,
        isFuture: isFuture || isBeforeRegistration,
        tasks: {
          login: loginCompleted,
          testSolved,
          topicCompleted,
          socialInteraction,
          communityContribution,
        },
        allTasksCompleted,
        taskDetails: {
          login: { completedAt: loginCompletedAt },
          testSolved: { completedAt: testSolvedCompletedAt, count: dayQuizAttempts.length },
          topicCompleted: { completedAt: topicCompletedAt, count: dayTopicCompletions.length },
          socialInteraction: { completedAt: socialInteractionCompletedAt, count: dayPosts.length + dayComments.length },
          communityContribution: { completedAt: communityContributionCompletedAt, count: dayCommunityMessages.length },
        },
      });
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

    // Calculate strike combos
    const allStrikeDates = new Set<string>();
    allStrikeEvents.forEach((event: { occurredAt: Date }) => {
      const eventDate = new Date(event.occurredAt);
      eventDate.setHours(0, 0, 0, 0);
      const dateStr = eventDate.toISOString().split("T")[0];
      allStrikeDates.add(dateStr);
    });

    let longestStrikeCombo = 0;
    if (allStrikeDates.size > 0) {
      const sortedDates = Array.from(allStrikeDates).sort();
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
            currentSequence++;
          } else {
            maxSequence = Math.max(maxSequence, currentSequence);
            currentSequence = 1;
          }
        }
        
        previousDate = currentDate;
      }
      
      longestStrikeCombo = Math.max(maxSequence, currentSequence);
    }

    let currentStrikeCombo = 0;
    const todayAllCompleted = todayDay?.allTasksCompleted || false;
    
    if (todayAllCompleted) {
      currentStrikeCombo = 1;
      let checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 1);
      checkDate.setHours(0, 0, 0, 0);
      
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (allStrikeDates.has(dateStr)) {
          currentStrikeCombo++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const daysWithLogin = weekDays.filter(
      (day) => day.tasks.login && !day.isFuture
    ).length;

    const weeklyProgress = {
      daysCompleted: daysWithLogin,
      totalDays: 7,
      registrationDate: registrationDate.toISOString(),
      weekStart: monday.toISOString(),
      weekEnd: sunday.toISOString(),
    };

    const strike = {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalDaysActive: streak.totalDaysActive || 0,
      currentStrikeCombo,
      longestStrikeCombo,
      isNewlyCompleted: false, // Will be calculated if needed
      todayCompleted,
      weekDays,
      weeklyProgress,
    };

    // Step 8: Fetch activities (simplified - full implementation in activities API)
    // For now, we'll return empty array and let frontend fetch separately if needed
    // This can be optimized later
    const activities: any[] = [];

    const responseData = {
      stats,
      strike,
      badges: enrichedBadges,
      ranks,
      earnings,
      activities,
    };

    // Cache the response
    await setCache(cacheKey, responseData, CACHE_TTL.DASHBOARD_DATA);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[DASHBOARD_DATA_GET] Error:", error);
    return NextResponse.json(
      { error: "Dashboard verileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

