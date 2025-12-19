import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';
const BOT_API_KEY = process.env.BOT_API_KEY;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get global scheduler config to know which activities are enabled
    const globalConfig = await db.globalBotSchedulerConfig.findFirst();
    
    if (!globalConfig || !globalConfig.enabledActivities || globalConfig.enabledActivities.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No activities enabled in global scheduler config",
        },
        { status: 400 }
      );
    }

    // Get all active bots
    const activeBots = await db.user.findMany({
      where: {
        isBot: true,
        botConfiguration: {
          isActive: true,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (activeBots.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No active bots found",
        },
        { status: 404 }
      );
    }

    const results: Array<{
      botId: string;
      botName: string;
      activities: Array<{
        activityType: string;
        success: boolean;
        error?: string;
      }>;
    }> = [];

    // Trigger activities for each bot
    for (const bot of activeBots) {
      const botResults: Array<{
        activityType: string;
        success: boolean;
        error?: string;
      }> = [];

      // Trigger each enabled activity for this bot
      for (const activityType of globalConfig.enabledActivities) {
        try {
          // Call the execute endpoint directly (bypass scheduler checks)
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/bots/execute`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': BOT_API_KEY || '',
            },
            body: JSON.stringify({
              userId: bot.id,
              activityType: activityType,
              skipSchedulerCheck: true, // Bypass scheduler checks for manual trigger
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            botResults.push({
              activityType,
              success: true,
            });
          } else {
            botResults.push({
              activityType,
              success: false,
              error: data.error || 'Unknown error',
            });
          }
        } catch (error: any) {
          botResults.push({
            activityType,
            success: false,
            error: error.message || 'Failed to execute activity',
          });
        }
      }

      results.push({
        botId: bot.id,
        botName: bot.name || bot.email || 'Unknown',
        activities: botResults,
      });
    }

    const totalSuccess = results.reduce((sum, r) => sum + r.activities.filter(a => a.success).length, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.activities.filter(a => !a.success).length, 0);

    return NextResponse.json({
      success: true,
      message: `Triggered activities for ${activeBots.length} bots. ${totalSuccess} successful, ${totalFailed} failed.`,
      results,
      summary: {
        totalBots: activeBots.length,
        totalActivities: results.reduce((sum, r) => sum + r.activities.length, 0),
        successful: totalSuccess,
        failed: totalFailed,
      },
    });
  } catch (error: any) {
    console.error("[TRIGGER_NOW] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
