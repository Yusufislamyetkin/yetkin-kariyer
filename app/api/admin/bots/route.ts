import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:7',message:'GET /api/admin/bots: Entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    const session = await auth();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:10',message:'GET /api/admin/bots: Auth check',data:{hasSession:!!session,userRole:(session?.user as any)?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!session || (session.user as any)?.role !== 'admin') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:12',message:'GET /api/admin/bots: Unauthorized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // Query bots directly from database
    console.log('[BOTS_GET] Starting bot query from Supabase', { page, limit, skip });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:22',message:'GET /api/admin/bots: Before count query',data:{page,limit,skip},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // First, get total count to verify database connection
    const totalBotCount = await db.user.count({
      where: { isBot: true },
    });
    console.log('[BOTS_GET] Total bots in database (count):', totalBotCount);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:25',message:'GET /api/admin/bots: Count query result',data:{totalBotCount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // First, check for users with isBot: true
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:27',message:'GET /api/admin/bots: Before FindMany query',data:{totalBotCount,page,limit,skip},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    
    let bots: Array<{
      id: string;
      email: string | null;
      name: string | null;
      botConfiguration: {
        isActive: boolean;
        lastActivityAt: Date | null;
      } | null;
    }>;
    try {
      bots = await db.user.findMany({
        where: {
          isBot: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          botConfiguration: {
            select: {
              isActive: true,
              lastActivityAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:50',message:'GET /api/admin/bots: FindMany query success',data:{count:bots.length,expectedCount:totalBotCount,firstBotId:bots[0]?.id,firstBotEmail:bots[0]?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
    } catch (findManyError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:52',message:'GET /api/admin/bots: FindMany query error',data:{error:findManyError.message,stack:findManyError.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      console.error('[BOTS_GET] FindMany error:', findManyError);
      throw findManyError;
    }
    
    console.log('[BOTS_GET] Raw query result:', {
      count: bots.length,
      expectedCount: totalBotCount,
      match: bots.length === totalBotCount
    });

    console.log('[BOTS_GET] Query completed (isBot: true)', { 
      totalBots: bots.length,
      botsWithConfig: bots.filter((b: typeof bots[0]) => b.botConfiguration).length,
      botsWithoutConfig: bots.filter((b: typeof bots[0]) => !b.botConfiguration).length,
      firstBotId: bots[0]?.id,
      firstBotEmail: bots[0]?.email,
      firstBotName: bots[0]?.name
    });

    // If no bots found with isBot: true, check for users with botCharacter or botConfiguration
    // These might be bots that weren't properly marked
    if (bots.length === 0) {
      console.log('[BOTS_GET] No bots with isBot: true found, checking for users with botCharacter or botConfiguration...');
      
        const potentialBots = await db.user.findMany({
        where: {
          OR: [
            { botCharacter: { isNot: null } },
            { botConfiguration: { isNot: null } },
          ],
        },
        select: {
          id: true,
          email: true,
          name: true,
          isBot: true,
          botConfiguration: {
            select: {
              isActive: true,
              lastActivityAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log('[BOTS_GET] Found potential bots (with botCharacter/botConfiguration)', { 
        count: potentialBots.length,
        botsWithIsBotTrue: potentialBots.filter((b: typeof potentialBots[0]) => b.isBot).length,
        botsWithIsBotFalse: potentialBots.filter((b: typeof potentialBots[0]) => !b.isBot).length
      });

      // If we found users with botCharacter/botConfiguration but isBot: false, fix them
      const botsToFix = potentialBots.filter((b: typeof potentialBots[0]) => !b.isBot);
      if (botsToFix.length > 0) {
        console.log('[BOTS_GET] Fixing bots: setting isBot: true for', botsToFix.length, 'users');
        await db.user.updateMany({
          where: {
            id: { in: botsToFix.map((b: typeof botsToFix[0]) => b.id) },
          },
          data: {
            isBot: true,
          },
        });
        console.log('[BOTS_GET] Fixed', botsToFix.length, 'bots');
      }

      // Now query again with isBot: true
      bots = await db.user.findMany({
        where: {
          isBot: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          botConfiguration: {
            select: {
              isActive: true,
              lastActivityAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      console.log('[BOTS_GET] Query completed after fix', { 
        totalBots: bots.length,
        botsWithConfig: bots.filter(b => b.botConfiguration).length,
        botsWithoutConfig: bots.filter(b => !b.botConfiguration).length
      });
    }

    // Get bot configurations with scheduler data using raw SQL
    const botIds = bots.map(b => b.id);
    const configsMap = new Map<string, {
      scheduleEnabled: boolean;
      enabledActivities: string[];
      activityHours: number[];
      activityIntervals: any;
    }>();

    if (botIds.length > 0) {
      // Use $queryRawUnsafe with parameterized query for array handling
      const placeholders = botIds.map((_, i) => `$${i + 1}`).join(', ');
      const configs = await db.$queryRawUnsafe(
        `SELECT 
          "userId",
          "scheduleEnabled",
          "enabledActivities",
          "activityHours",
          "activityIntervals"
        FROM bot_configurations
        WHERE "userId" IN (${placeholders})`,
        ...botIds
      ) as Array<{
        userId: string;
        scheduleEnabled: boolean;
        enabledActivities: string[] | null;
        activityHours: number[] | null;
        activityIntervals: any;
      }>;

      for (const config of configs) {
        configsMap.set(config.userId, {
          scheduleEnabled: config.scheduleEnabled || false,
          enabledActivities: config.enabledActivities || [],
          activityHours: config.activityHours || [],
          activityIntervals: config.activityIntervals || {},
        });
      }
    }

    // Map to the expected format
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:132',message:'GET /api/admin/bots: Before format',data:{botsCount:bots.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    const formattedBots = bots.map((bot) => {
      const config = configsMap.get(bot.id);
      return {
        id: bot.id,
        userName: bot.name || (bot.email ? bot.email.split('@')[0] : ''),
        email: bot.email,
        firstName: bot.name?.split(' ')[0] || '',
        lastName: bot.name?.split(' ').slice(1).join(' ') || '',
        isActive: bot.botConfiguration?.isActive || false,
        scheduleEnabled: config?.scheduleEnabled || false,
        enabledActivities: config?.enabledActivities || [],
        activityHours: config?.activityHours || [],
        activityIntervals: config?.activityIntervals || {},
        lastActivityAt: bot.botConfiguration?.lastActivityAt 
          ? bot.botConfiguration.lastActivityAt.toISOString() 
          : null,
      };
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:145',message:'GET /api/admin/bots: After format',data:{formattedBotsCount:formattedBots.length,firstFormattedBot:formattedBots[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion

    console.log('[BOTS_GET] Returning formatted bots', { 
      count: formattedBots.length,
      firstBot: formattedBots[0],
      sampleIds: formattedBots.slice(0, 5).map(b => b.id)
    });

    const totalPages = Math.ceil(totalBotCount / limit);

    const response = {
      success: true,
      bots: formattedBots,
      pagination: {
        page,
        limit,
        totalCount: totalBotCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    console.log('[BOTS_GET] Response object', {
      hasSuccess: !!response.success,
      hasBots: !!response.bots,
      botsCount: response.bots?.length,
      pagination: response.pagination,
      responseKeys: Object.keys(response)
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:160',message:'GET /api/admin/bots: Before return',data:{success:response.success,botsCount:response.bots?.length,hasBots:!!response.bots,pagination:response.pagination,responseKeys:Object.keys(response)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[BOTS_GET] Error:', error);
    console.error('[BOTS_GET] Error stack:', error.stack);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:175',message:'GET /api/admin/bots: Catch block error',data:{error:error.message,stack:error.stack,name:error.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H'})}).catch(()=>{});
    // #endregion
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch bots',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { count, bots } = body;

    // Helper function to create a bot in Supabase
    const createBotInSupabase = async (botData: {
      userName?: string;
      email: string;
      firstName?: string;
      lastName?: string;
      password: string;
      name?: string;
    }) => {
      const hashedPassword = await bcrypt.hash(botData.password, 10);
      const fullName = botData.name || `${botData.firstName || 'Bot'} ${botData.lastName || 'User'}`.trim();
      const email = botData.email;

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error(`User with email ${email} already exists`);
      }

      // Create bot user, character, and configuration in transaction
      const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name: fullName,
            isBot: true,
            role: 'candidate',
          },
        });

        // Create bot character
        const botCharacter = await tx.botCharacter.create({
          data: {
            userId: user.id,
            name: fullName,
            persona: `${fullName} karakteri - Yardımsever ve aktif bir topluluk üyesi.`,
            systemPrompt: `Sen ${fullName} karakterisin. Gerçekçi ve yardımsever bir şekilde davran. Topluluk içinde aktif ol ve diğer kullanıcılara yardımcı ol.`,
            traits: {},
            expertise: [],
          },
        });

        // Create bot configuration
        const botConfig = await tx.botConfiguration.create({
          data: {
            userId: user.id,
            isActive: true,
            minPostsPerDay: 1,
            maxPostsPerDay: 3,
            minCommentsPerDay: 0,
            maxCommentsPerDay: 5,
            minLikesPerDay: 0,
            maxLikesPerDay: 10,
            activityHours: [9, 12, 18, 21],
            enabledActivities: [],
            scheduleEnabled: false,
          },
        });

        return {
          id: user.id,
          userId: user.id,
          userName: fullName,
          email: user.email,
          firstName: botData.firstName || fullName.split(' ')[0] || '',
          lastName: botData.lastName || fullName.split(' ').slice(1).join(' ') || '',
        };
      });

      return result;
    };

    // If count is provided, create multiple bots
    if (count && typeof count === 'number' && count > 0) {
      const createdBots = [];
      const errors = [];

      console.log(`[BOTS_POST] Starting creation of ${count} bots in Supabase`);

      for (let i = 1; i <= count; i++) {
        try {
          const timestamp = Date.now();
          const botData = {
            userName: `bot_user_${timestamp}_${i}`,
            email: `bot_user_${timestamp}_${i}@example.com`,
            firstName: 'Bot',
            lastName: `User ${i}`,
            password: 'Bot@123456',
            name: `Bot User ${i}`,
          };

          if (i % 10 === 0 || i === 1) {
            console.log(`[BOTS_POST] Progress: ${i}/${count} bots`);
          }

          const result = await createBotInSupabase(botData);
          createdBots.push(result);
        } catch (error: any) {
          console.error(`[BOTS_POST] Error creating bot ${i}:`, error);
          errors.push({ botNumber: i, error: error.message || 'Failed to create bot' });
        }
      }

      console.log(`[BOTS_POST] Completed: ${createdBots.length}/${count} bots created, ${errors.length} errors`);

      return NextResponse.json({
        success: true,
        message: `Created ${createdBots.length} out of ${count} bots`,
        created: createdBots.length,
        total: count,
        bots: createdBots,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Single bot creation (array format)
    if (bots && Array.isArray(bots) && bots.length > 0) {
      const createdBots = [];
      const errors = [];

      for (const bot of bots) {
        try {
          const botData = {
            email: bot.email,
            firstName: bot.firstName,
            lastName: bot.lastName,
            password: bot.password || 'Bot@123456',
            name: bot.userName || `${bot.firstName || ''} ${bot.lastName || ''}`.trim() || bot.email.split('@')[0],
          };

          const result = await createBotInSupabase(botData);
          createdBots.push(result);
        } catch (error: any) {
          console.error('[BOTS_POST] Error creating bot:', error);
          errors.push({ bot, error: error.message || 'Failed to create bot' });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Created ${createdBots.length} out of ${bots.length} bots`,
        created: createdBots.length,
        total: bots.length,
        bots: createdBots,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Single bot creation (legacy format)
    const botData = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      password: body.password || 'Bot@123456',
      name: body.userName || `${body.firstName || ''} ${body.lastName || ''}`.trim() || body.email?.split('@')[0] || 'Bot User',
    };

    const result = await createBotInSupabase(botData);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('[BOTS_POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create bot' },
      { status: 500 }
    );
  }
}
