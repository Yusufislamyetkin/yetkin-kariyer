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

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        botCharacter: true,
        botConfiguration: true,
      },
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

    return NextResponse.json({
      botCharacter: user.botCharacter,
      botConfiguration: user.botConfiguration,
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

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        botCharacter: true,
        botConfiguration: true,
      },
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

    // Update bot character if provided
    if (body.character) {
      await db.botCharacter.update({
        where: { userId },
        data: {
          name: body.character.name,
          persona: body.character.persona,
          systemPrompt: body.character.systemPrompt,
          traits: body.character.traits,
          expertise: body.character.expertise,
        },
      });
    }

    // Update bot configuration if provided
    if (body.configuration) {
      await db.botConfiguration.update({
        where: { userId },
        data: {
          isActive: body.configuration.isActive,
          minPostsPerDay: body.configuration.minPostsPerDay,
          maxPostsPerDay: body.configuration.maxPostsPerDay,
          minCommentsPerDay: body.configuration.minCommentsPerDay,
          maxCommentsPerDay: body.configuration.maxCommentsPerDay,
          minLikesPerDay: body.configuration.minLikesPerDay,
          maxLikesPerDay: body.configuration.maxLikesPerDay,
          minTestsPerWeek: body.configuration.minTestsPerWeek,
          maxTestsPerWeek: body.configuration.maxTestsPerWeek,
          minLiveCodingPerWeek: body.configuration.minLiveCodingPerWeek,
          maxLiveCodingPerWeek: body.configuration.maxLiveCodingPerWeek,
          minBugFixPerWeek: body.configuration.minBugFixPerWeek,
          maxBugFixPerWeek: body.configuration.maxBugFixPerWeek,
          minLessonsPerWeek: body.configuration.minLessonsPerWeek,
          maxLessonsPerWeek: body.configuration.maxLessonsPerWeek,
          minChatMessagesPerDay: body.configuration.minChatMessagesPerDay,
          maxChatMessagesPerDay: body.configuration.maxChatMessagesPerDay,
          activityHours: body.configuration.activityHours,
        },
      });
    }

    // Fetch updated data
    const updated = await db.user.findUnique({
      where: { id: userId },
      include: {
        botCharacter: true,
        botConfiguration: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bot yapılandırması güncellendi",
      botCharacter: updated?.botCharacter,
      botConfiguration: updated?.botConfiguration,
    });
  } catch (error: any) {
    console.error("[BOT_CONFIG_PUT]", error);
    return NextResponse.json(
      { error: error.message || "Bot yapılandırması güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

