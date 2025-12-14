import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

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
    const { botIds, isActive } = body;

    if (!botIds || !Array.isArray(botIds) || botIds.length === 0) {
      return NextResponse.json(
        { error: 'botIds array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean value' },
        { status: 400 }
      );
    }

    // Verify all IDs are bots
    const bots = await db.user.findMany({
      where: {
        id: { in: botIds },
        isBot: true,
      },
      select: {
        id: true,
      },
    });

    if (bots.length !== botIds.length) {
      return NextResponse.json(
        { error: 'Some bot IDs are invalid or not bots' },
        { status: 400 }
      );
    }

    // Update bot configurations
    const updateResult = await db.botConfiguration.updateMany({
      where: {
        userId: { in: botIds },
      },
      data: {
        isActive,
      },
    });

    // Also create configurations for bots that don't have one yet
    const existingConfigs = await db.botConfiguration.findMany({
      where: {
        userId: { in: botIds },
      },
      select: {
        userId: true,
      },
    });

    const existingUserIds = new Set(existingConfigs.map((c: typeof existingConfigs[0]) => c.userId));
    const missingUserIds = botIds.filter(id => !existingUserIds.has(id));

    if (missingUserIds.length > 0) {
      await db.botConfiguration.createMany({
        data: missingUserIds.map(userId => ({
          userId,
          isActive,
        })),
      });
    }

    // Notify .NET Core about status changes for all bots
    const dotnetApiUrl = process.env.DOTNET_API_URL;
    const dotnetApiKey = process.env.DOTNET_API_KEY || '';
    
    const webhookResults: Array<{ botId: string; success: boolean; error?: string }> = [];

    if (dotnetApiUrl) {
      // Send webhooks in parallel with rate limiting
      const webhookPromises = botIds.map(async (botId: string) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          await fetch(
            `${dotnetApiUrl}/api/bots/${botId}/activities/schedule/webhook`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': dotnetApiKey ? `Bearer ${dotnetApiKey}` : '',
              },
              body: JSON.stringify({
                isActive,
                enabledActivities: [],
                activityIntervals: {},
                activityHours: [],
              }),
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);
          return { botId, success: true };
        } catch (error: any) {
          console.error(`[BULK_UPDATE] Failed to notify .NET Core for bot ${botId}:`, error);
          return { botId, success: false, error: error.message };
        }
      });

      const results = await Promise.all(webhookPromises);
      webhookResults.push(...results);
    }

    const totalUpdated = updateResult.count + missingUserIds.length;
    const successfulWebhooks = webhookResults.filter(r => r.success).length;
    const failedWebhooks = webhookResults.filter(r => !r.success);

    return NextResponse.json({
      success: true,
      message: `${totalUpdated} bot başarıyla ${isActive ? 'aktif' : 'pasif'} yapıldı`,
      updated: totalUpdated,
      webhooks: {
        successful: successfulWebhooks,
        failed: failedWebhooks.length,
        failures: failedWebhooks,
      },
    });
  } catch (error: any) {
    console.error('[BULK_UPDATE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bots' },
      { status: 500 }
    );
  }
}
