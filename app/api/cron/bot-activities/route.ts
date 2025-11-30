import { NextResponse } from "next/server";
import { executeBotActivity } from "@/lib/bot/activity-executor";
import { db } from "@/lib/db";

/**
 * Cron endpoint for bot activities (Test Mode)
 * Runs every minute and makes each active bot perform one random activity
 * This should be called by Vercel Cron or similar scheduler
 */
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

// All available activity types for random selection
const ACTIVITY_TYPES: BotActivityType[] = [
  BotActivityType.POST,
  BotActivityType.COMMENT,
  BotActivityType.LIKE,
  BotActivityType.TEST,
  BotActivityType.LIVE_CODING,
  BotActivityType.BUG_FIX,
  BotActivityType.LESSON,
  BotActivityType.CHAT,
];

export async function GET(request: Request) {
  try {
    // Simple auth check - you can add a secret header for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all active bots
    const activeBots = await db.user.findMany({
      where: {
        isBot: true,
        configuration: {
          isActive: true,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const executedActivities = [];

    // For each active bot, perform one random activity
    for (const bot of activeBots) {
      try {
        // Randomly select an activity type
        const randomActivityType =
          ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];

        console.log(
          `[BOT_CRON] Executing ${randomActivityType} for bot ${bot.id} (${bot.name})`
        );

        // Execute the activity
        const result = await executeBotActivity(bot.id, randomActivityType, {
          targetId: undefined, // Will be determined by activity executor
        });

        executedActivities.push({
          botId: bot.id,
          botName: bot.name,
          activityType: randomActivityType,
          success: result.success,
          activityId: result.activityId,
          error: result.error,
        });

        if (result.success) {
          console.log(
            `[BOT_CRON] Successfully executed ${randomActivityType} for bot ${bot.id}`
          );
        } else {
          console.error(
            `[BOT_CRON] Failed to execute ${randomActivityType} for bot ${bot.id}: ${result.error}`
          );
        }
      } catch (botError: any) {
        console.error(`[BOT_CRON] Error processing bot ${bot.id}:`, botError);
        executedActivities.push({
          botId: bot.id,
          botName: bot.name,
          activityType: null,
          success: false,
          error: botError.message || "Unknown error",
        });
      }
    }

    // Update last activity timestamp for active bots that had activities
    if (executedActivities.length > 0) {
      const successfulBotIds = executedActivities
        .filter((a) => a.success)
        .map((a) => a.botId);

      if (successfulBotIds.length > 0) {
        await db.botConfiguration.updateMany({
          where: {
            userId: { in: successfulBotIds },
          },
          data: {
            lastActivityAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      botsProcessed: activeBots.length,
      activitiesExecuted: executedActivities.length,
      successfulActivities: executedActivities.filter((a) => a.success).length,
      failedActivities: executedActivities.filter((a) => !a.success).length,
      activities: executedActivities,
    });
  } catch (error: any) {
    console.error("[BOT_CRON]", error);
    return NextResponse.json(
      { error: error.message || "Bot aktiviteleri işlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

