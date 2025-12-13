import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get bot configuration from Supabase
    const botConfig = await db.botConfiguration.findUnique({
      where: { userId: params.id },
    });

    const botCharacter = await db.botCharacter.findUnique({
      where: { userId: params.id },
      select: {
        id: true,
        name: true,
        persona: true,
        systemPrompt: true,
        traits: true,
        expertise: true,
      },
    });

    if (!botConfig) {
      return NextResponse.json(
        { error: 'Bot configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      botConfiguration: botConfig,
      botCharacter: botCharacter || null,
    });
  } catch (error: any) {
    console.error('[BOT_CONFIG_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bot configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if bot exists
    const user = await db.user.findUnique({
      where: {
        id: params.id,
        isBot: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    // Get current bot config to check if isActive changed
    const currentConfig = await db.botConfiguration.findUnique({
      where: { userId: params.id },
    });
    const wasActive = currentConfig?.isActive ?? true;

    // Update bot configuration - only isActive is allowed
    const updateData: any = {};
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const botConfig = await db.botConfiguration.upsert({
      where: { userId: params.id },
      update: updateData,
      create: {
        userId: params.id,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    // Update bot character if provided
    if (body.botCharacter) {
      await db.botCharacter.upsert({
        where: { userId: params.id },
        update: {
          name: body.botCharacter.name,
          persona: body.botCharacter.persona,
          systemPrompt: body.botCharacter.systemPrompt,
          expertise: body.botCharacter.expertise,
          traits: body.botCharacter.traits,
        },
        create: {
          userId: params.id,
          name: body.botCharacter.name || '',
          persona: body.botCharacter.persona || '',
          systemPrompt: body.botCharacter.systemPrompt || '',
          expertise: body.botCharacter.expertise || [],
          traits: body.botCharacter.traits || [],
        },
      });
    }

    // If isActive status changed, notify .NET Core to update Hangfire jobs
    if (body.isActive !== undefined && body.isActive !== wasActive) {
      const dotnetApiUrl = process.env.DOTNET_API_URL;
      const dotnetApiKey = process.env.DOTNET_API_KEY || '';
      
      if (dotnetApiUrl) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          await fetch(
            `${dotnetApiUrl}/api/bots/${params.id}/activities/schedule/webhook`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': dotnetApiKey ? `Bearer ${dotnetApiKey}` : '',
              },
              body: JSON.stringify({
                isActive: body.isActive,
                // Empty scheduler config - only updating bot status
                enabledActivities: [],
                activityIntervals: {},
                activityHours: [],
              }),
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);
        } catch (error: any) {
          // Log but don't fail the request if webhook fails
          console.error(`[BOT_CONFIG_PUT] Failed to notify .NET Core about bot status change for ${params.id}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bot configuration updated',
      botConfiguration: botConfig,
    });
  } catch (error: any) {
    console.error('[BOT_CONFIG_PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bot configuration' },
      { status: 500 }
    );
  }
}

