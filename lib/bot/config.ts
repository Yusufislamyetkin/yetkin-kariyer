/**
 * Bot system configuration
 */

export const BOT_CONFIG = {
  // Default activity frequencies
  DEFAULT_MIN_POSTS_PER_DAY: 1,
  DEFAULT_MAX_POSTS_PER_DAY: 3,
  DEFAULT_MIN_COMMENTS_PER_DAY: 0,
  DEFAULT_MAX_COMMENTS_PER_DAY: 5,
  DEFAULT_MIN_LIKES_PER_DAY: 0,
  DEFAULT_MAX_LIKES_PER_DAY: 10,

  // Weekly activities
  DEFAULT_MIN_TESTS_PER_WEEK: 0,
  DEFAULT_MAX_TESTS_PER_WEEK: 3,
  DEFAULT_MIN_LIVE_CODING_PER_WEEK: 0,
  DEFAULT_MAX_LIVE_CODING_PER_WEEK: 2,
  DEFAULT_MIN_BUG_FIX_PER_WEEK: 0,
  DEFAULT_MAX_BUG_FIX_PER_WEEK: 2,
  DEFAULT_MIN_LESSONS_PER_WEEK: 0,
  DEFAULT_MAX_LESSONS_PER_WEEK: 5,

  // Daily chat
  DEFAULT_MIN_CHAT_MESSAGES_PER_DAY: 0,
  DEFAULT_MAX_CHAT_MESSAGES_PER_DAY: 10,

  // Activity hours (when bots are most active)
  DEFAULT_ACTIVITY_HOURS: [9, 12, 18, 21],

  // Scheduler settings
  SCHEDULER_INTERVAL_MINUTES: 30, // Check every 30 minutes
  MAX_ACTIVITIES_PER_RUN: 10, // Maximum activities to execute per scheduler run

  // OpenAI settings
  OPENAI_MODEL: "gpt-4o-mini",
  OPENAI_TEMPERATURE: 0.8, // Creative but consistent

  // Rate limiting
  MIN_TIME_BETWEEN_POSTS_MINUTES: 120, // At least 2 hours between posts
  MIN_TIME_BETWEEN_COMMENTS_MINUTES: 30,
  MIN_TIME_BETWEEN_LIKES_MINUTES: 5,
} as const;

export type BotConfig = typeof BOT_CONFIG;

