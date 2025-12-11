import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = params.userId;

    // Get bot configuration from Supabase
    const botConfig = await db.botConfiguration.findUnique({
      where: { userId },
    });

    const botCharacter = await db.botCharacter.findUnique({
      where: { userId },
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
        { error: "Bot yapılandırması bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      botConfiguration: botConfig,
      botCharacter: botCharacter || null,
    });
  } catch (error: any) {
    console.error("[BOT_CONFIG_GET]", error);
    return NextResponse.json(
      { error: error.message || "Bot yapılandırması alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = params.userId;
    const body = await request.json();

    // Check if user exists and is a bot
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    if (!user.isBot) {
      return NextResponse.json(
        { error: "Bu kullanıcı bot değil" },
        { status: 400 }
      );
    }

    // Map request body to update data
    const configData = body.configuration || body;
    const updateData: any = {};

    if (configData.isActive !== undefined) updateData.isActive = configData.isActive;
    if (configData.minPostsPerDay !== undefined) updateData.minPostsPerDay = configData.minPostsPerDay;
    if (configData.maxPostsPerDay !== undefined) updateData.maxPostsPerDay = configData.maxPostsPerDay;
    if (configData.minCommentsPerDay !== undefined) updateData.minCommentsPerDay = configData.minCommentsPerDay;
    if (configData.maxCommentsPerDay !== undefined) updateData.maxCommentsPerDay = configData.maxCommentsPerDay;
    if (configData.minLikesPerDay !== undefined) updateData.minLikesPerDay = configData.minLikesPerDay;
    if (configData.maxLikesPerDay !== undefined) updateData.maxLikesPerDay = configData.maxLikesPerDay;
    if (configData.minTestsPerWeek !== undefined) updateData.minTestsPerWeek = configData.minTestsPerWeek;
    if (configData.maxTestsPerWeek !== undefined) updateData.maxTestsPerWeek = configData.maxTestsPerWeek;
    if (configData.minLiveCodingPerWeek !== undefined) updateData.minLiveCodingPerWeek = configData.minLiveCodingPerWeek;
    if (configData.maxLiveCodingPerWeek !== undefined) updateData.maxLiveCodingPerWeek = configData.maxLiveCodingPerWeek;
    if (configData.minBugFixPerWeek !== undefined) updateData.minBugFixPerWeek = configData.minBugFixPerWeek;
    if (configData.maxBugFixPerWeek !== undefined) updateData.maxBugFixPerWeek = configData.maxBugFixPerWeek;
    if (configData.minLessonsPerWeek !== undefined) updateData.minLessonsPerWeek = configData.minLessonsPerWeek;
    if (configData.maxLessonsPerWeek !== undefined) updateData.maxLessonsPerWeek = configData.maxLessonsPerWeek;
    if (configData.minChatMessagesPerDay !== undefined) updateData.minChatMessagesPerDay = configData.minChatMessagesPerDay;
    if (configData.maxChatMessagesPerDay !== undefined) updateData.maxChatMessagesPerDay = configData.maxChatMessagesPerDay;
    if (configData.activityHours) updateData.activityHours = configData.activityHours;
    if (configData.enabledActivities) updateData.enabledActivities = configData.enabledActivities;
    if (configData.scheduleEnabled !== undefined) updateData.scheduleEnabled = configData.scheduleEnabled;
    if (configData.activityIntervals) updateData.activityIntervals = configData.activityIntervals;

    // Update bot configuration in Supabase
    const botConfig = await db.botConfiguration.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        isActive: configData.isActive !== undefined ? configData.isActive : true,
        minPostsPerDay: configData.minPostsPerDay ?? 1,
        maxPostsPerDay: configData.maxPostsPerDay ?? 3,
        minCommentsPerDay: configData.minCommentsPerDay ?? 0,
        maxCommentsPerDay: configData.maxCommentsPerDay ?? 5,
        minLikesPerDay: configData.minLikesPerDay ?? 0,
        maxLikesPerDay: configData.maxLikesPerDay ?? 10,
        activityHours: configData.activityHours || [9, 12, 18, 21],
        enabledActivities: configData.enabledActivities || [],
        scheduleEnabled: configData.scheduleEnabled ?? false,
        activityIntervals: configData.activityIntervals || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bot yapılandırması güncellendi",
      botConfiguration: botConfig,
    });
  } catch (error: any) {
    console.error("[BOT_CONFIG_PUT]", error);
    return NextResponse.json(
      { error: error.message || "Bot yapılandırması güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

