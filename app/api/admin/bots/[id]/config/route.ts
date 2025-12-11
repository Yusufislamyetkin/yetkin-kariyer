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

    // Update bot configuration in Supabase
    const updateData: any = {};
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.minPostsPerDay !== undefined) updateData.minPostsPerDay = body.minPostsPerDay;
    if (body.maxPostsPerDay !== undefined) updateData.maxPostsPerDay = body.maxPostsPerDay;
    if (body.minCommentsPerDay !== undefined) updateData.minCommentsPerDay = body.minCommentsPerDay;
    if (body.maxCommentsPerDay !== undefined) updateData.maxCommentsPerDay = body.maxCommentsPerDay;
    if (body.minLikesPerDay !== undefined) updateData.minLikesPerDay = body.minLikesPerDay;
    if (body.maxLikesPerDay !== undefined) updateData.maxLikesPerDay = body.maxLikesPerDay;
    if (body.minTestsPerWeek !== undefined) updateData.minTestsPerWeek = body.minTestsPerWeek;
    if (body.maxTestsPerWeek !== undefined) updateData.maxTestsPerWeek = body.maxTestsPerWeek;
    if (body.minLiveCodingPerWeek !== undefined) updateData.minLiveCodingPerWeek = body.minLiveCodingPerWeek;
    if (body.maxLiveCodingPerWeek !== undefined) updateData.maxLiveCodingPerWeek = body.maxLiveCodingPerWeek;
    if (body.minBugFixPerWeek !== undefined) updateData.minBugFixPerWeek = body.minBugFixPerWeek;
    if (body.maxBugFixPerWeek !== undefined) updateData.maxBugFixPerWeek = body.maxBugFixPerWeek;
    if (body.minLessonsPerWeek !== undefined) updateData.minLessonsPerWeek = body.minLessonsPerWeek;
    if (body.maxLessonsPerWeek !== undefined) updateData.maxLessonsPerWeek = body.maxLessonsPerWeek;
    if (body.minChatMessagesPerDay !== undefined) updateData.minChatMessagesPerDay = body.minChatMessagesPerDay;
    if (body.maxChatMessagesPerDay !== undefined) updateData.maxChatMessagesPerDay = body.maxChatMessagesPerDay;
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
    console.error('[BOT_CONFIG_PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bot configuration' },
      { status: 500 }
    );
  }
}

