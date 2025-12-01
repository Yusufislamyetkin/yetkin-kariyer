import { db } from "@/lib/db";
import { BOT_CONFIG } from "./config";

enum BotActivityType {
  POST = "POST",
  COMMENT = "COMMENT",
  LIKE = "LIKE",
  TEST = "TEST",
  LIVE_CODING = "LIVE_CODING",
  BUG_FIX = "BUG_FIX",
  LESSON = "LESSON",
  CHAT = "CHAT",
}

interface ScheduledActivity {
  userId: string;
  activityType: BotActivityType;
  priority: number;
  scheduledFor: Date;
}

/**
 * Gets active bots that should perform activities
 */
export async function getActiveBotsForScheduling() {
  const now = new Date();
  const currentHour = now.getHours();

  // Get active bots
  const bots = await db.user.findMany({
    where: {
      isBot: true,
      botConfiguration: {
        isActive: true,
      },
    },
    include: {
      botConfiguration: true,
      botCharacter: true,
      botActivities: {
        where: {
          executedAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        select: {
          activityType: true,
          executedAt: true,
        },
      },
    },
  });

  return bots.filter((bot: any) => {
    if (!bot.botConfiguration) return false;

    // Check if bot should be active at this hour
    const activityHours = bot.botConfiguration.activityHours || BOT_CONFIG.DEFAULT_ACTIVITY_HOURS;
    return activityHours.includes(currentHour);
  });
}

/**
 * Calculates which activities a bot should perform
 */
export async function calculateBotActivities(
  bot: any,
  activitiesLast24h: Array<{ activityType: BotActivityType; executedAt: Date }>
) {
  const config = bot.botConfiguration || {};
  const scheduled: ScheduledActivity[] = [];

  if (!config.isActive) return scheduled;

  const now = new Date();
  const last24h = activitiesLast24h || [];

  // Count activities by type in last 24 hours
  const activityCounts = {
    POST: last24h.filter((a) => a.activityType === "POST").length,
    COMMENT: last24h.filter((a) => a.activityType === "COMMENT").length,
    LIKE: last24h.filter((a) => a.activityType === "LIKE").length,
    TEST: last24h.filter((a) => a.activityType === "TEST").length,
    LIVE_CODING: last24h.filter((a) => a.activityType === "LIVE_CODING").length,
    BUG_FIX: last24h.filter((a) => a.activityType === "BUG_FIX").length,
    LESSON: last24h.filter((a) => a.activityType === "LESSON").length,
    CHAT: last24h.filter((a) => a.activityType === "CHAT").length,
  };

  // Determine if bot should create a post
  const minPosts = config.minPostsPerDay || BOT_CONFIG.DEFAULT_MIN_POSTS_PER_DAY;
  const maxPosts = config.maxPostsPerDay || BOT_CONFIG.DEFAULT_MAX_POSTS_PER_DAY;
  const avgPostsPerDay = (minPosts + maxPosts) / 2;
  const postsNeeded = Math.max(0, avgPostsPerDay - activityCounts.POST);

  // Random chance to create post (based on remaining posts needed)
  if (postsNeeded > 0 && Math.random() < postsNeeded / avgPostsPerDay) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.POST,
      priority: 10,
      scheduledFor: now,
    });
  }

  // Comments - check if we need more
  const minComments = config.minCommentsPerDay || BOT_CONFIG.DEFAULT_MIN_COMMENTS_PER_DAY;
  const maxComments = config.maxCommentsPerDay || BOT_CONFIG.DEFAULT_MAX_COMMENTS_PER_DAY;
  const avgCommentsPerDay = (minComments + maxComments) / 2;
  const commentsNeeded = Math.max(0, avgCommentsPerDay - activityCounts.COMMENT);

  if (commentsNeeded > 0 && Math.random() < commentsNeeded / Math.max(1, avgCommentsPerDay)) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.COMMENT,
      priority: 7,
      scheduledFor: new Date(now.getTime() + Math.random() * 60 * 60 * 1000), // Within next hour
    });
  }

  // Likes - simpler probability
  const minLikes = config.minLikesPerDay || BOT_CONFIG.DEFAULT_MIN_LIKES_PER_DAY;
  const maxLikes = config.maxLikesPerDay || BOT_CONFIG.DEFAULT_MAX_LIKES_PER_DAY;
  const likesNeeded = Math.max(0, (minLikes + maxLikes) / 2 - activityCounts.LIKE);

  if (likesNeeded > 0 && Math.random() < 0.3) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.LIKE,
      priority: 5,
      scheduledFor: new Date(now.getTime() + Math.random() * 30 * 60 * 1000), // Within next 30 min
    });
  }

  // Weekly activities - check if we need to perform any this week
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week

  const weeklyActivities = await db.botActivity.findMany({
    where: {
      userId: bot.id,
      executedAt: {
        gte: weekStart,
      },
      activityType: {
        in: ["TEST", "LIVE_CODING", "BUG_FIX", "LESSON"],
      },
    },
  });

  const weeklyCounts = {
    TEST: weeklyActivities.filter((a: any) => a.activityType === BotActivityType.TEST).length,
    LIVE_CODING: weeklyActivities.filter((a: any) => a.activityType === BotActivityType.LIVE_CODING).length,
    BUG_FIX: weeklyActivities.filter((a: any) => a.activityType === BotActivityType.BUG_FIX).length,
    LESSON: weeklyActivities.filter((a: any) => a.activityType === BotActivityType.LESSON).length,
  };

  // Test activity
  const minTests = config.minTestsPerWeek || BOT_CONFIG.DEFAULT_MIN_TESTS_PER_WEEK;
  const maxTests = config.maxTestsPerWeek || BOT_CONFIG.DEFAULT_MAX_TESTS_PER_WEEK;
  if (weeklyCounts.TEST < maxTests && Math.random() < 0.2) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.TEST,
      priority: 8,
      scheduledFor: new Date(now.getTime() + Math.random() * 4 * 60 * 60 * 1000), // Within next 4 hours
    });
  }

  // Live coding
  const minLiveCoding = config.minLiveCodingPerWeek || BOT_CONFIG.DEFAULT_MIN_LIVE_CODING_PER_WEEK;
  const maxLiveCoding = config.maxLiveCodingPerWeek || BOT_CONFIG.DEFAULT_MAX_LIVE_CODING_PER_WEEK;
  if (weeklyCounts.LIVE_CODING < maxLiveCoding && Math.random() < 0.15) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.LIVE_CODING,
      priority: 8,
      scheduledFor: new Date(now.getTime() + Math.random() * 4 * 60 * 60 * 1000),
    });
  }

  // Bug fix
  const minBugFix = config.minBugFixPerWeek || BOT_CONFIG.DEFAULT_MIN_BUG_FIX_PER_WEEK;
  const maxBugFix = config.maxBugFixPerWeek || BOT_CONFIG.DEFAULT_MAX_BUG_FIX_PER_WEEK;
  if (weeklyCounts.BUG_FIX < maxBugFix && Math.random() < 0.15) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.BUG_FIX,
      priority: 8,
      scheduledFor: new Date(now.getTime() + Math.random() * 4 * 60 * 60 * 1000),
    });
  }

  // Lesson
  const minLessons = config.minLessonsPerWeek || BOT_CONFIG.DEFAULT_MIN_LESSONS_PER_WEEK;
  const maxLessons = config.maxLessonsPerWeek || BOT_CONFIG.DEFAULT_MAX_LESSONS_PER_WEEK;
  if (weeklyCounts.LESSON < maxLessons && Math.random() < 0.25) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.LESSON,
      priority: 7,
      scheduledFor: new Date(now.getTime() + Math.random() * 4 * 60 * 60 * 1000),
    });
  }

  // Chat messages
  const minChat = config.minChatMessagesPerDay || BOT_CONFIG.DEFAULT_MIN_CHAT_MESSAGES_PER_DAY;
  const maxChat = config.maxChatMessagesPerDay || BOT_CONFIG.DEFAULT_MAX_CHAT_MESSAGES_PER_DAY;
  const chatNeeded = Math.max(0, (minChat + maxChat) / 2 - activityCounts.CHAT);
  if (chatNeeded > 0 && Math.random() < 0.2) {
    scheduled.push({
      userId: bot.id,
      activityType: BotActivityType.CHAT,
      priority: 6,
      scheduledFor: new Date(now.getTime() + Math.random() * 2 * 60 * 60 * 1000),
    });
  }

  // Sort by priority and scheduled time
  return scheduled
    .filter((s) => s.scheduledFor <= now || Math.random() < 0.3) // Execute some future activities early
    .sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.scheduledFor.getTime() - b.scheduledFor.getTime();
    })
    .slice(0, BOT_CONFIG.MAX_ACTIVITIES_PER_RUN);
}

