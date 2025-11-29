import { db } from "@/lib/db";

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
import { createPostActivity } from "./activities/post-activity";
import { createCommentActivity } from "./activities/comment-activity";
import { createLikeActivity } from "./activities/like-activity";
import { createTestActivity } from "./activities/test-activity";
import { createLiveCodingActivity } from "./activities/live-coding-activity";
import { createBugFixActivity } from "./activities/bugfix-activity";
import { createLessonActivity } from "./activities/lesson-activity";
import { createChatActivity } from "./activities/chat-activity";

interface ActivityOptions {
  targetId?: string;
  [key: string]: any;
}

interface ActivityResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

/**
 * Executes a bot activity
 */
export async function executeBotActivity(
  userId: string,
  activityType: BotActivityType,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Log activity start
    let activityLog = null;

    try {
      let result: ActivityResult = { success: false };

      switch (activityType) {
        case "POST":
          result = await createPostActivity(userId);
          break;
        case "COMMENT":
          result = await createCommentActivity(userId, options);
          break;
        case "LIKE":
          result = await createLikeActivity(userId, options);
          break;
        case "TEST":
          result = await createTestActivity(userId, options);
          break;
        case "LIVE_CODING":
          result = await createLiveCodingActivity(userId, options);
          break;
        case "BUG_FIX":
          result = await createBugFixActivity(userId, options);
          break;
        case "LESSON":
          result = await createLessonActivity(userId, options);
          break;
        case "CHAT":
          result = await createChatActivity(userId, options);
          break;
        default:
          throw new Error(`Unknown activity type: ${activityType}`);
      }

      // Log activity
      activityLog = await db.botActivity.create({
        data: {
          userId,
          activityType,
          targetId: options.targetId || result.activityId,
          details: options,
          success: result.success,
          errorMessage: result.error || null,
        },
      });

      return result;
    } catch (error: any) {
      // Log failed activity
      try {
        await db.botActivity.create({
          data: {
            userId,
            activityType,
            targetId: options.targetId,
            details: options,
            success: false,
            errorMessage: error.message || "Unknown error",
          },
        });
      } catch (logError) {
        console.error("[BOT_ACTIVITY_EXECUTOR] Failed to log activity:", logError);
      }

      throw error;
    }
  } catch (error: any) {
    console.error(`[BOT_ACTIVITY_EXECUTOR] Error executing ${activityType} for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Activity execution failed",
    };
  }
}

