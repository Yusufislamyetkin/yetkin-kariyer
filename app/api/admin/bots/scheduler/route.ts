import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create global scheduler config
    let globalConfig = await db.globalBotSchedulerConfig.findFirst();
    
    if (!globalConfig) {
      // Create default global config
      globalConfig = await db.globalBotSchedulerConfig.create({
        data: {
          enabledActivities: [],
          activityIntervals: {},
          activityHours: [9, 12, 18, 21],
          scheduleEnabled: false,
          maxPostsPerDay: 3,
          maxCommentsPerDay: 5,
          maxLikesPerDay: 10,
          maxTestsPerWeek: 3,
          maxLiveCodingPerWeek: 2,
          maxLessonsPerWeek: 5,
        },
      });
    }

    // Format scheduled activities from global config
    const scheduledActivities: any[] = [];
    
    if (globalConfig.enabledActivities && globalConfig.enabledActivities.length > 0) {
      const activityHours = globalConfig.activityHours && globalConfig.activityHours.length > 0 
        ? globalConfig.activityHours 
        : [9, 12, 18, 21]; // Default

      // Get activity intervals from config
      const intervals = (globalConfig.activityIntervals as Record<string, number>) || {};
      
      for (const activityType of globalConfig.enabledActivities) {
        // Determine frequency from interval (daily if < 60 minutes, weekly otherwise)
        const interval = intervals[activityType] || 5;
        const frequency = interval < 60 ? 'daily' : 'weekly';
        
        scheduledActivities.push({
          activityType,
          botCount: 0, // Will be calculated from active bots count
          frequency,
          activityHours: activityHours,
          minCount: 1, // Default min
          maxCount: getMaxCountForActivityType(activityType, globalConfig),
        });
      }
    }

    return NextResponse.json({
      success: true,
      activities: scheduledActivities,
      activityHours: globalConfig.activityHours,
      rateLimits: {
        maxPostsPerDay: globalConfig.maxPostsPerDay,
        maxCommentsPerDay: globalConfig.maxCommentsPerDay,
        maxLikesPerDay: globalConfig.maxLikesPerDay,
        maxTestsPerWeek: globalConfig.maxTestsPerWeek,
        maxLiveCodingPerWeek: globalConfig.maxLiveCodingPerWeek,
        maxLessonsPerWeek: globalConfig.maxLessonsPerWeek,
      },
    });
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch scheduled activities';
    const errorDetails = process.env.NODE_ENV === 'development' ? error.stack : undefined;
    console.error('[SCHEDULER_GET] Error:', {
      message: errorMessage,
      stack: errorDetails,
      timestamp: new Date().toISOString(),
      errorType: error.constructor?.name || 'Unknown',
    });
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(errorDetails && { details: errorDetails })
      },
      { status: 500 }
    );
  }
}

// Helper function to get max count for activity type from global config
function getMaxCountForActivityType(activityType: string, config: any): number {
  switch (activityType) {
    case 'POST':
      return config.maxPostsPerDay || 3;
    case 'COMMENT':
      return config.maxCommentsPerDay || 5;
    case 'LIKE':
      return config.maxLikesPerDay || 10;
    case 'TEST':
      return config.maxTestsPerWeek || 3;
    case 'LIVE_CODING':
      return config.maxLiveCodingPerWeek || 2;
    case 'LESSON':
      return config.maxLessonsPerWeek || 5;
    default:
      return 3;
  }
}

export async function POST(request: Request) {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:85',message:'POST /api/admin/bots/scheduler: Entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:89',message:'POST /api/admin/bots/scheduler: Unauthorized',data:{hasSession:!!session,userRole:(session?.user as any)?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activities, activityHours: providedActivityHours, rateLimits } = body;
    
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { error: 'Activities array is required' },
        { status: 400 }
      );
    }

    // Build enabled activities and intervals from scheduled activities
    const enabledActivities: string[] = [];
    const activityIntervals: Record<string, number> = {};
    let activityHours = providedActivityHours || activities[0]?.activityHours || [9, 12, 18, 21];

    // Validate activity hours
    if (!Array.isArray(activityHours)) {
      return NextResponse.json(
        { error: 'activityHours must be an array' },
        { status: 400 }
      );
    }

    // Validate each hour is between 0 and 23
    const invalidHours = activityHours.filter((h: number) => typeof h !== 'number' || h < 0 || h > 23);
    if (invalidHours.length > 0) {
      return NextResponse.json(
        { error: `Activity hours must be between 0 and 23. Invalid values: ${invalidHours.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate hours are unique
    const uniqueHours = [...new Set(activityHours)];
    if (uniqueHours.length !== activityHours.length) {
      return NextResponse.json(
        { error: 'Activity hours must be unique. Duplicate values found.' },
        { status: 400 }
      );
    }

    // Sort and use unique hours
    activityHours = uniqueHours.sort((a: number, b: number) => a - b);

    for (const activity of activities) {
      enabledActivities.push(activity.activityType);
      // Default interval: 5 minutes for daily, 60 minutes for weekly
      activityIntervals[activity.activityType] = activity.frequency === 'daily' ? 5 : 60;
    }

    // Extract rate limits from activities or use provided rateLimits
    const maxPostsPerDay = rateLimits?.maxPostsPerDay || activities.find(a => a.activityType === 'POST')?.maxCount || 3;
    const maxCommentsPerDay = rateLimits?.maxCommentsPerDay || activities.find(a => a.activityType === 'COMMENT')?.maxCount || 5;
    const maxLikesPerDay = rateLimits?.maxLikesPerDay || activities.find(a => a.activityType === 'LIKE')?.maxCount || 10;
    const maxTestsPerWeek = rateLimits?.maxTestsPerWeek || activities.find(a => a.activityType === 'TEST')?.maxCount || 3;
    const maxLiveCodingPerWeek = rateLimits?.maxLiveCodingPerWeek || activities.find(a => a.activityType === 'LIVE_CODING')?.maxCount || 2;
    const maxLessonsPerWeek = rateLimits?.maxLessonsPerWeek || activities.find(a => a.activityType === 'LESSON')?.maxCount || 5;

    // Get or create global scheduler config
    let globalConfig = await db.globalBotSchedulerConfig.findFirst();
    
    if (!globalConfig) {
      globalConfig = await db.globalBotSchedulerConfig.create({
        data: {
          enabledActivities,
          activityIntervals,
          activityHours,
          scheduleEnabled: true,
          maxPostsPerDay,
          maxCommentsPerDay,
          maxLikesPerDay,
          maxTestsPerWeek,
          maxLiveCodingPerWeek,
          maxLessonsPerWeek,
          lastScheduledAt: new Date(),
        },
      });
    } else {
      globalConfig = await db.globalBotSchedulerConfig.update({
        where: { id: globalConfig.id },
        data: {
          enabledActivities,
          activityIntervals,
          activityHours,
          scheduleEnabled: true,
          maxPostsPerDay,
          maxCommentsPerDay,
          maxLikesPerDay,
          maxTestsPerWeek,
          maxLiveCodingPerWeek,
          maxLessonsPerWeek,
          lastScheduledAt: new Date(),
        },
      });
    }

    // Send single webhook to .NET Core to update all active bots
    const dotnetApiUrl = process.env.DOTNET_API_URL;
    const dotnetApiKey = process.env.DOTNET_API_KEY || '';
    
    let webhookSuccess = false;
    let webhookError: string | null = null;

    if (!dotnetApiUrl) {
      console.warn(`[SCHEDULER_POST] DOTNET_API_URL not configured, skipping webhook`);
      return NextResponse.json({
        success: true,
        message: 'Global scheduler config updated, but webhook was not sent (DOTNET_API_URL not configured)',
        warnings: {
          message: 'Webhook was not sent. Hangfire jobs may not be updated.',
          webhookFailures: [{ botId: 'all', error: 'DOTNET_API_URL environment variable is not configured' }],
        },
      });
    }

    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const webhookResponse = await fetch(
          `${dotnetApiUrl}/api/bots/activities/schedule/webhook/global`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': dotnetApiKey ? `Bearer ${dotnetApiKey}` : '',
            },
            body: JSON.stringify({
              enabledActivities,
              activityIntervals,
              activityHours,
              maxPostsPerDay,
              maxCommentsPerDay,
              maxLikesPerDay,
              maxTestsPerWeek,
              maxLiveCodingPerWeek,
              maxLessonsPerWeek,
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (webhookResponse.ok) {
          console.log(`[SCHEDULER_POST] Successfully sent global webhook to .NET Core${attempt > 0 ? ` (attempt ${attempt + 1})` : ''}`);
          webhookSuccess = true;
          break;
        } else {
          const errorText = await webhookResponse.text().catch(() => 'Unknown error');
          webhookError = `Webhook failed: ${webhookResponse.status} - ${errorText.substring(0, 100)}`;
          console.error(`[SCHEDULER_POST] Failed to send global webhook (attempt ${attempt + 1}/${maxRetries}): ${webhookResponse.status} - ${errorText}`);
          
          if (webhookResponse.status >= 400 && webhookResponse.status < 500) {
            break;
          }
        }
      } catch (webhookErr: any) {
        webhookError = `Webhook error: ${webhookErr.message || 'Unknown error'}`;
        console.error(`[SCHEDULER_POST] Error sending global webhook (attempt ${attempt + 1}/${maxRetries}):`, webhookErr);
        
        if (webhookErr.name === 'AbortError') {
          webhookError = 'Webhook timeout after 10 seconds';
          break;
        }
      }

      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Global scheduler config updated successfully',
      warnings: !webhookSuccess && webhookError ? {
        message: 'Webhook delivery failed. Hangfire jobs may not be updated.',
        webhookFailures: [{ botId: 'all', error: webhookError }],
      } : undefined,
    });
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:176',message:'POST /api/admin/bots/scheduler: Exception caught',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
    // #endregion
    const errorMessage = error.message || 'Failed to save scheduler settings';
    const errorDetails = process.env.NODE_ENV === 'development' ? error.stack : undefined;
    console.error('[SCHEDULER_POST] Error:', {
      message: errorMessage,
      stack: errorDetails,
      timestamp: new Date().toISOString(),
      errorType: error.constructor?.name || 'Unknown',
    });
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(errorDetails && { details: errorDetails })
      },
      { status: 500 }
    );
  }
}
