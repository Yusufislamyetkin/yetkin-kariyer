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

    // Get bot from Supabase
    const user = await db.user.findUnique({
      where: {
        id: params.id,
        isBot: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        botConfiguration: {
          select: {
            isActive: true,
            scheduleEnabled: true,
            enabledActivities: true,
            lastActivityAt: true,
            minPostsPerDay: true,
            maxPostsPerDay: true,
            minCommentsPerDay: true,
            maxCommentsPerDay: true,
            minLikesPerDay: true,
            maxLikesPerDay: true,
            activityHours: true,
          },
        },
        botCharacter: {
          select: {
            id: true,
            name: true,
            persona: true,
            systemPrompt: true,
            traits: true,
            expertise: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    // Format bot data
    const bot = {
      id: user.id,
      userName: user.name || user.email.split('@')[0],
      email: user.email,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      isActive: user.botConfiguration?.isActive || false,
      scheduleEnabled: user.botConfiguration?.scheduleEnabled || false,
      enabledActivities: user.botConfiguration?.enabledActivities || [],
      lastActivityAt: user.botConfiguration?.lastActivityAt 
        ? user.botConfiguration.lastActivityAt.toISOString() 
        : null,
      botConfiguration: user.botConfiguration,
      botCharacter: user.botCharacter,
    };

    return NextResponse.json({ success: true, bot });
  } catch (error: any) {
    console.error('[BOT_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bot' },
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

    // Update bot configuration in Supabase
    const updateData: any = {};
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.minPostsPerDay !== undefined) updateData.minPostsPerDay = body.minPostsPerDay;
    if (body.maxPostsPerDay !== undefined) updateData.maxPostsPerDay = body.maxPostsPerDay;
    if (body.minCommentsPerDay !== undefined) updateData.minCommentsPerDay = body.minCommentsPerDay;
    if (body.maxCommentsPerDay !== undefined) updateData.maxCommentsPerDay = body.maxCommentsPerDay;
    if (body.minLikesPerDay !== undefined) updateData.minLikesPerDay = body.minLikesPerDay;
    if (body.maxLikesPerDay !== undefined) updateData.maxLikesPerDay = body.maxLikesPerDay;
    if (body.activityHours) updateData.activityHours = body.activityHours;
    if (body.enabledActivities) updateData.enabledActivities = body.enabledActivities;
    if (body.scheduleEnabled !== undefined) updateData.scheduleEnabled = body.scheduleEnabled;
    if (body.activityIntervals) updateData.activityIntervals = body.activityIntervals;

    const botConfig = await db.botConfiguration.upsert({
      where: { userId: params.id },
      update: updateData,
      create: {
        userId: params.id,
        isActive: body.isActive !== undefined ? body.isActive : true,
        minPostsPerDay: body.minPostsPerDay ?? 1,
        maxPostsPerDay: body.maxPostsPerDay ?? 3,
        minCommentsPerDay: body.minCommentsPerDay ?? 0,
        maxCommentsPerDay: body.maxCommentsPerDay ?? 5,
        minLikesPerDay: body.minLikesPerDay ?? 0,
        maxLikesPerDay: body.maxLikesPerDay ?? 10,
        activityHours: body.activityHours || [9, 12, 18, 21],
        enabledActivities: body.enabledActivities || [],
        scheduleEnabled: body.scheduleEnabled ?? false,
        activityIntervals: body.activityIntervals || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bot configuration updated',
      botConfiguration: botConfig,
    });
  } catch (error: any) {
    console.error('[BOT_PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bot' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Delete bot from Supabase (cascade will delete related records)
    await db.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Bot deleted successfully',
    });
  } catch (error: any) {
    console.error('[BOT_DELETE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete bot' },
      { status: 500 }
    );
  }
}
