import { db } from "@/lib/db";
import { BotActivityType } from "@prisma/client";

interface LogActivityParams {
  userId: string;
  activityType: BotActivityType;
  targetId?: string;
  details?: any;
  success: boolean;
  errorMessage?: string;
}

export async function logBotActivity({
  userId,
  activityType,
  targetId,
  details,
  success,
  errorMessage,
}: LogActivityParams) {
  try {
    await db.botActivity.create({
      data: {
        userId,
        activityType,
        targetId,
        details: details || {},
        success,
        errorMessage: success ? null : (errorMessage || "Unknown error"),
        executedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[BOT_ACTIVITY_LOGGER] Error logging activity:", error);
    // Don't throw - logging failures shouldn't break the bot system
  }
}

export async function getBotActivityStats(userId: string, days: number = 7) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await db.botActivity.groupBy({
      by: ["activityType", "success"],
      where: {
        userId,
        executedAt: {
          gte: since,
        },
      },
      _count: {
        id: true,
      },
    });

    return stats;
  } catch (error) {
    console.error("[BOT_ACTIVITY_LOGGER] Error getting stats:", error);
    return [];
  }
}

