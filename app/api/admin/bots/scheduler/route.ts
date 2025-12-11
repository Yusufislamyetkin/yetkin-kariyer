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

    // Use raw SQL to read bot configurations because Prisma client may not be synced
    const configs = await db.$queryRaw<Array<{
      userId: string;
      scheduleEnabled: boolean;
      enabledActivities: string[] | null;
      activityIntervals: any;
      activityHours: number[] | null;
      minPostsPerDay: number | null;
      maxPostsPerDay: number | null;
    }>>`
      SELECT 
        "userId",
        "scheduleEnabled",
        "enabledActivities",
        "activityIntervals",
        "activityHours",
        "minPostsPerDay",
        "maxPostsPerDay"
      FROM bot_configurations
      WHERE "scheduleEnabled" = true
        AND "enabledActivities" IS NOT NULL
    `;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:38',message:'GET /api/admin/bots/scheduler: Configs fetched',data:{configsCount:configs.length,firstConfig:configs[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Format scheduled activities from bot configurations
    const scheduledActivities: any[] = [];
    const activityMap = new Map<string, any>();

    for (const config of configs) {
      if (!config.enabledActivities || config.enabledActivities.length === 0) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:45',message:'GET /api/admin/bots/scheduler: Skipping config',data:{userId:config.userId,hasEnabledActivities:!!config.enabledActivities,enabledActivitiesLength:config.enabledActivities?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        continue;
      }

      const activityHours = config.activityHours && config.activityHours.length > 0 
        ? config.activityHours 
        : [9, 12, 18, 21]; // Default

      // Get activity intervals from config
      const intervals = (config.activityIntervals as Record<string, number>) || {};
      
      for (const activityType of config.enabledActivities) {
        const key = `${activityType}_${JSON.stringify(activityHours)}`;
        
        if (!activityMap.has(key)) {
          // Determine frequency from interval (daily if < 60 minutes, weekly otherwise)
          const interval = intervals[activityType] || 5;
          const frequency = interval < 60 ? 'daily' : 'weekly';
          
          activityMap.set(key, {
            activityType,
            botIds: [],
            frequency,
            activityHours: activityHours,
            minCount: config.minPostsPerDay || 1,
            maxCount: config.maxPostsPerDay || 3,
          });
        }
        activityMap.get(key).botIds.push(config.userId);
      }
    }

    // Convert map to array
    for (const [_, activity] of activityMap.entries()) {
      scheduledActivities.push({
        ...activity,
        botCount: activity.botIds.length,
      });
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:81',message:'GET /api/admin/bots/scheduler: Before return',data:{scheduledActivitiesCount:scheduledActivities.length,activities:scheduledActivities},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    return NextResponse.json({
      success: true,
      activities: scheduledActivities,
    });
  } catch (error: any) {
    console.error('[SCHEDULER_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch scheduled activities' },
      { status: 500 }
    );
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
    const { activities, botIds } = body;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:97',message:'POST /api/admin/bots/scheduler: Body parsed',data:{hasActivities:!!activities,activitiesLength:activities?.length,hasBotIds:!!botIds,botIdsLength:botIds?.length,firstActivity:activities?.[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { error: 'Activities array is required' },
        { status: 400 }
      );
    }

    if (!botIds || !Array.isArray(botIds) || botIds.length === 0) {
      return NextResponse.json(
        { error: 'Bot IDs array is required' },
        { status: 400 }
      );
    }

    // Apply scheduler settings to selected bots
    const results = [];
    const errors = [];

    // Build enabled activities and intervals from scheduled activities
    const enabledActivities: string[] = [];
    const activityIntervals: Record<string, number> = {};
    const activityHours = activities[0]?.activityHours || [9, 12, 18, 21];
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:120',message:'POST /api/admin/bots/scheduler: Before processing activities',data:{activityHours,activityHoursType:typeof activityHours,isArray:Array.isArray(activityHours)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    for (const activity of activities) {
      enabledActivities.push(activity.activityType);
      // Default interval: 5 minutes for daily, 60 minutes for weekly
      activityIntervals[activity.activityType] = activity.frequency === 'daily' ? 5 : 60;
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:127',message:'POST /api/admin/bots/scheduler: After processing activities',data:{enabledActivities,activityIntervals,activityHours},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    for (const botId of botIds) {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:128',message:'POST /api/admin/bots/scheduler: Processing bot',data:{botId,activityHours,activityHoursType:typeof activityHours,isArray:Array.isArray(activityHours)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        // Get or create bot configuration
        let config = await db.botConfiguration.findUnique({
          where: { userId: botId },
        });

        if (!config) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:135',message:'POST /api/admin/bots/scheduler: Creating config',data:{botId,activityHours},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          // Create new configuration using raw SQL to avoid Prisma client sync issues
          const configId = await db.$queryRaw<Array<{ id: string }>>`
            INSERT INTO bot_configurations (
              "userId", 
              "isActive", 
              "scheduleEnabled", 
              "enabledActivities", 
              "activityIntervals", 
              "activityHours",
              "createdAt",
              "updatedAt"
            )
            VALUES (
              ${botId}::TEXT,
              true,
              true,
              ${enabledActivities}::TEXT[],
              ${JSON.stringify(activityIntervals)}::JSONB,
              ${activityHours}::INTEGER[],
              NOW(),
              NOW()
            )
            RETURNING id
          `;
          config = { id: configId[0].id, userId: botId } as any;
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:147',message:'POST /api/admin/bots/scheduler: Config created',data:{botId,configId:config.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          results.push({ botId, success: true });
          continue;
        }

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:151',message:'POST /api/admin/bots/scheduler: Updating config',data:{botId,configId:config.id,activityHours},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        // Update existing configuration using raw SQL to avoid Prisma client sync issues
        await db.$executeRaw`
          UPDATE bot_configurations
          SET 
            "scheduleEnabled" = true,
            "enabledActivities" = ${enabledActivities}::TEXT[],
            "activityIntervals" = ${JSON.stringify(activityIntervals)}::JSONB,
            "activityHours" = ${activityHours}::INTEGER[],
            "isActive" = ${config.isActive !== false},
            "updatedAt" = NOW()
          WHERE "userId" = ${botId}
        `;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:163',message:'POST /api/admin/bots/scheduler: Config updated',data:{botId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion

        results.push({ botId, success: true });
      } catch (err: any) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:164',message:'POST /api/admin/bots/scheduler: Error updating bot',data:{botId,error:err.message,stack:err.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        console.error(`[SCHEDULER_POST] Error updating bot ${botId}:`, err);
        errors.push({ botId, error: err.message || 'Failed to update bot configuration' });
      }
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:170',message:'POST /api/admin/bots/scheduler: Before return',data:{resultsLength:results.length,errorsLength:errors.length,success:errors.length === 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({
      success: errors.length === 0,
      message: `Updated ${results.length} out of ${botIds.length} bots`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scheduler/route.ts:176',message:'POST /api/admin/bots/scheduler: Exception caught',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
    // #endregion
    console.error('[SCHEDULER_POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save scheduler settings' },
      { status: 500 }
    );
  }
}
