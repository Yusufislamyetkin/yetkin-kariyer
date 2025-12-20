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

    // Get base URL dynamically from request (works in all environments)
    const getBaseUrl = () => {
      // Vercel ortamında VERCEL_URL kullan
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      // Request'ten URL'i al
      try {
        const url = new URL(request.url);
        return `${url.protocol}//${url.host}`;
      } catch {
        // Fallback: environment variable veya localhost
        return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      }
    };

    const baseUrl = getBaseUrl();

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
          const response = await fetch(`${baseUrl}/api/admin/bots/execute`, {
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

          if (!response.ok) {
            // Try to parse error response
            let errorText = '';
            let errorData: any = {};
            try {
              errorText = await response.text();
              if (errorText) {
                try {
                  errorData = JSON.parse(errorText);
                } catch {
                  errorData = { error: errorText };
                }
              }
            } catch {
              errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
            }

            botResults.push({
              activityType,
              success: false,
              error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
            });
            continue;
          }

          // Parse successful response
          let data: any;
          try {
            const responseText = await response.text();
            if (!responseText) {
              throw new Error('Empty response');
            }
            data = JSON.parse(responseText);
          } catch (parseError: any) {
            botResults.push({
              activityType,
              success: false,
              error: `Failed to parse response: ${parseError.message}`,
            });
            continue;
          }

          if (data.success) {
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
            error: error.message || 'Network error: Failed to execute activity',
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

