import { NextResponse } from "next/server";
import { getActiveBotsForScheduling, calculateBotActivities } from "@/lib/bot/scheduler";
import { executeBotActivity } from "@/lib/bot/activity-executor";
import { db } from "@/lib/db";

/**
 * Cron endpoint for bot activities
 * This should be called by Vercel Cron or similar scheduler
 */
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

    const activeBots = await getActiveBotsForScheduling();
    const executedActivities = [];

    for (const bot of activeBots) {
      try {
        // Calculate which activities this bot should perform
        const scheduledActivities = await calculateBotActivities(bot, bot.botActivities);

        for (const activity of scheduledActivities) {
          try {
            const result = await executeBotActivity(activity.userId, activity.activityType, {
              targetId: undefined, // Will be determined by activity executor
            });

            if (result.success) {
              executedActivities.push({
                botId: bot.id,
                activityType: activity.activityType,
                success: true,
              });
            }
          } catch (activityError: any) {
            console.error(`[BOT_CRON] Activity execution failed for bot ${bot.id}:`, activityError);
            executedActivities.push({
              botId: bot.id,
              activityType: activity.activityType,
              success: false,
              error: activityError.message,
            });
          }
        }
      } catch (botError: any) {
        console.error(`[BOT_CRON] Error processing bot ${bot.id}:`, botError);
      }
    }

    // Update last activity timestamp for active bots
    if (executedActivities.length > 0) {
      const botIds = [...new Set(executedActivities.map((a) => a.botId))];
      await db.botConfiguration.updateMany({
        where: {
          userId: { in: botIds },
        },
        data: {
          lastActivityAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      botsProcessed: activeBots.length,
      activitiesExecuted: executedActivities.length,
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

