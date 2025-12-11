import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:5',message:'GET /api/admin/bots/statistics: Entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.log('[BOT_STATISTICS_GET] Entry');
    const session = await auth();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:8',message:'GET /api/admin/bots/statistics: Auth check',data:{hasSession:!!session,userRole:(session?.user as any)?.role,userId:(session?.user as any)?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log('[BOT_STATISTICS_GET] Session:', { 
      hasSession: !!session, 
      userRole: (session?.user as any)?.role,
      userId: (session?.user as any)?.id 
    });

    if (!session || (session.user as any)?.role !== 'admin') {
      console.log('[BOT_STATISTICS_GET] Unauthorized - returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[BOT_STATISTICS_GET] Starting database queries');
    // Calculate bot statistics from Supabase
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:31',message:'GET /api/admin/bots/statistics: Before totalBots count',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    const totalBots = await db.user.count({
      where: { isBot: true },
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:34',message:'GET /api/admin/bots/statistics: totalBots count result',data:{totalBots},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    console.log('[BOT_STATISTICS_GET] Total bots:', totalBots);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:36',message:'GET /api/admin/bots/statistics: Before activeBots count',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    const activeBots = await db.user.count({
      where: {
        isBot: true,
        botConfiguration: {
          isActive: true,
        },
      },
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:44',message:'GET /api/admin/bots/statistics: activeBots count result',data:{activeBots},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    console.log('[BOT_STATISTICS_GET] Active bots:', activeBots);

    // Get bots with schedule enabled using raw SQL since Prisma client might not recognize scheduleEnabled
    let botsWithSchedule = 0;
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:45',message:'GET /api/admin/bots/statistics: Before raw SQL query',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      const result = await db.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int as count
        FROM app_users u
        INNER JOIN bot_configurations bc ON bc."userId" = u.id
        WHERE u."isBot" = true AND bc."scheduleEnabled" = true
      `;
      // #region agent log
      let countValue = 0;
      if (result && Array.isArray(result) && result.length > 0 && result[0]) {
        const rawCount = result[0].count;
        countValue = typeof rawCount === 'bigint' ? Number(rawCount) : (typeof rawCount === 'number' ? rawCount : 0);
      }
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:52',message:'GET /api/admin/bots/statistics: Raw SQL query result',data:{resultLength:result?.length,countValue,hasFirstResult:!!result?.[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      botsWithSchedule = countValue;
      console.log('[BOT_STATISTICS_GET] Scheduled bots (raw SQL):', botsWithSchedule);
      console.log('[BOT_STATISTICS_GET] Scheduled bots (raw SQL):', botsWithSchedule);
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:57',message:'GET /api/admin/bots/statistics: Raw SQL query error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      console.error('[BOT_STATISTICS] Error counting scheduled bots:', error);
      // Fallback: try with Prisma (might fail if client is outdated)
      try {
        botsWithSchedule = await db.user.count({
          where: {
            isBot: true,
            botConfiguration: {
              scheduleEnabled: true,
            },
          },
        });
      } catch (prismaError: any) {
        console.error('[BOT_STATISTICS] Prisma fallback also failed:', prismaError);
        // Final fallback: count all active bots as scheduled
        botsWithSchedule = activeBots;
      }
    }

    // Get recent activity count (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:107',message:'GET /api/admin/bots/statistics: Before recentActivityCount',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    let recentActivityCount = 0;
    try {
      recentActivityCount = await db.botActivityExecution.count({
        where: {
          executedAt: {
            gte: oneDayAgo,
          },
        },
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:115',message:'GET /api/admin/bots/statistics: recentActivityCount result',data:{recentActivityCount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:118',message:'GET /api/admin/bots/statistics: recentActivityCount error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      console.error('[BOT_STATISTICS] Error counting recent activities:', error);
    }
    console.log('[BOT_STATISTICS_GET] Recent activity count:', recentActivityCount);

    // Get total bot activities
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:125',message:'GET /api/admin/bots/statistics: Before totalActivities count',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    let totalActivities = 0;
    try {
      totalActivities = await db.botActivityExecution.count();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:130',message:'GET /api/admin/bots/statistics: totalActivities count result',data:{totalActivities},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:133',message:'GET /api/admin/bots/statistics: totalActivities error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      console.error('[BOT_STATISTICS] Error counting total activities:', error);
    }

    // Get bots with recent activity
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:138',message:'GET /api/admin/bots/statistics: Before botsWithRecentActivity count',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    let botsWithRecentActivity = 0;
    try {
      botsWithRecentActivity = await db.user.count({
        where: {
          isBot: true,
          botConfiguration: {
            lastActivityAt: {
              gte: oneDayAgo,
            },
          },
        },
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:150',message:'GET /api/admin/bots/statistics: botsWithRecentActivity count result',data:{botsWithRecentActivity},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:153',message:'GET /api/admin/bots/statistics: botsWithRecentActivity error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      console.error('[BOT_STATISTICS] Error counting bots with recent activity:', error);
    }

    const statistics = {
      success: true,
      statistics: {
        totalBots,
        activeBots,
        inactiveBots: totalBots - activeBots,
        scheduledBots: botsWithSchedule, // Frontend expects 'scheduledBots'
        botsWithSchedule,
        botsWithoutSchedule: totalBots - botsWithSchedule,
        todayActivities: recentActivityCount, // Frontend expects 'todayActivities'
        recentActivityCount,
        totalActivities,
        botsWithRecentActivity,
        botsWithoutRecentActivity: totalBots - botsWithRecentActivity,
      },
    };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'statistics/route.ts:136',message:'GET /api/admin/bots/statistics: Before return',data:{totalBots,activeBots,scheduledBots:botsWithSchedule,todayActivities:recentActivityCount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    console.log('[BOT_STATISTICS_GET] Returning statistics:', {
      totalBots,
      activeBots,
      scheduledBots: botsWithSchedule,
      todayActivities: recentActivityCount,
    });

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('[BOT_STATISTICS_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bot statistics' },
      { status: 500 }
    );
  }
}

