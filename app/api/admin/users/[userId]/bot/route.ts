import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getCharacterProfileById } from "@/lib/bot/character-profiles";

export async function POST(
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
    const body = await request.json().catch(() => ({}));

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Check if already a bot (but allow reactivation if botCharacter exists)
    if (user.isBot) {
      // Check if botCharacter exists - if not, allow creation
      const existingBotCharacter = await db.botCharacter.findUnique({
        where: { userId },
      });
      
      if (existingBotCharacter) {
        return NextResponse.json(
          { error: "Bu kullanıcı zaten bot olarak atanmış" },
          { status: 400 }
        );
      }
      // If isBot is true but no botCharacter exists, continue to create one
    }

    // Check if character profile is selected
    let defaultPersona = body.persona;
    let defaultSystemPrompt = body.systemPrompt;
    let defaultExpertise = body.expertise || [];
    
    if (body.characterProfileId) {
      const profile = getCharacterProfileById(body.characterProfileId);
      if (profile) {
        defaultPersona = body.persona || profile.persona;
        defaultSystemPrompt = body.systemPrompt || profile.systemPrompt;
        defaultExpertise = body.expertise || profile.defaultExpertise;
      }
    }
    
    // Fallback defaults if no profile selected
    if (!defaultPersona) {
      defaultPersona = `${user.name || "Bot"} karakteri - Yardımsever ve aktif bir topluluk üyesi.`;
    }
    if (!defaultSystemPrompt) {
      defaultSystemPrompt = `Sen ${user.name || "bir bot"} karakterisin. Gerçekçi ve yardımsever bir şekilde davran. Topluluk içinde aktif ol ve diğer kullanıcılara yardımcı ol.`;
    }

    // Create bot character and configuration in transaction
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user to be a bot
      await tx.user.update({
        where: { id: userId },
        data: { isBot: true },
      });

      // Create or update bot character (upsert to handle existing records)
      const botCharacter = await tx.botCharacter.upsert({
        where: { userId },
        update: {
          name: body.characterName || user.name || "Bot",
          persona: defaultPersona,
          systemPrompt: defaultSystemPrompt,
          traits: body.traits || {},
          expertise: defaultExpertise,
        },
        create: {
          userId,
          name: body.characterName || user.name || "Bot",
          persona: defaultPersona,
          systemPrompt: defaultSystemPrompt,
          traits: body.traits || {},
          expertise: defaultExpertise,
        },
      });

      // Create or update bot configuration with defaults or provided values
      const botConfig = await tx.botConfiguration.upsert({
        where: { userId },
        update: {
          isActive: body.isActive !== undefined ? body.isActive : true,
          minPostsPerDay: body.minPostsPerDay ?? 1,
          maxPostsPerDay: body.maxPostsPerDay ?? 3,
          minCommentsPerDay: body.minCommentsPerDay ?? 0,
          maxCommentsPerDay: body.maxCommentsPerDay ?? 5,
          minLikesPerDay: body.minLikesPerDay ?? 0,
          maxLikesPerDay: body.maxLikesPerDay ?? 10,
          minTestsPerWeek: body.minTestsPerWeek ?? 0,
          maxTestsPerWeek: body.maxTestsPerWeek ?? 3,
          minLiveCodingPerWeek: body.minLiveCodingPerWeek ?? 0,
          maxLiveCodingPerWeek: body.maxLiveCodingPerWeek ?? 2,
          minBugFixPerWeek: body.minBugFixPerWeek ?? 0,
          maxBugFixPerWeek: body.maxBugFixPerWeek ?? 2,
          minLessonsPerWeek: body.minLessonsPerWeek ?? 0,
          maxLessonsPerWeek: body.maxLessonsPerWeek ?? 5,
          minChatMessagesPerDay: body.minChatMessagesPerDay ?? 0,
          maxChatMessagesPerDay: body.maxChatMessagesPerDay ?? 10,
          activityHours: body.activityHours || [9, 12, 18, 21],
        },
        create: {
          userId,
          isActive: body.isActive !== undefined ? body.isActive : true,
          minPostsPerDay: body.minPostsPerDay ?? 1,
          maxPostsPerDay: body.maxPostsPerDay ?? 3,
          minCommentsPerDay: body.minCommentsPerDay ?? 0,
          maxCommentsPerDay: body.maxCommentsPerDay ?? 5,
          minLikesPerDay: body.minLikesPerDay ?? 0,
          maxLikesPerDay: body.maxLikesPerDay ?? 10,
          minTestsPerWeek: body.minTestsPerWeek ?? 0,
          maxTestsPerWeek: body.maxTestsPerWeek ?? 3,
          minLiveCodingPerWeek: body.minLiveCodingPerWeek ?? 0,
          maxLiveCodingPerWeek: body.maxLiveCodingPerWeek ?? 2,
          minBugFixPerWeek: body.minBugFixPerWeek ?? 0,
          maxBugFixPerWeek: body.maxBugFixPerWeek ?? 2,
          minLessonsPerWeek: body.minLessonsPerWeek ?? 0,
          maxLessonsPerWeek: body.maxLessonsPerWeek ?? 5,
          minChatMessagesPerDay: body.minChatMessagesPerDay ?? 0,
          maxChatMessagesPerDay: body.maxChatMessagesPerDay ?? 10,
          activityHours: body.activityHours || [9, 12, 18, 21],
        },
      });

      return { botCharacter, botConfig };
    });

    return NextResponse.json({
      success: true,
      message: "Kullanıcı bot olarak atandı",
      botCharacter: result.botCharacter,
      botConfiguration: result.botConfig,
    });
  } catch (error: any) {
    console.error("[BOT_ASSIGN_POST]", error);
    return NextResponse.json(
      { error: error.message || "Bot atama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user exists and is a bot
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

    // Deactivate bot instead of deleting (soft delete)
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user
      await tx.user.update({
        where: { id: userId },
        data: { isBot: false },
      });

      // Deactivate configuration
      if (user.botConfiguration) {
        await tx.botConfiguration.update({
          where: { userId },
          data: { isActive: false },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Bot ataması kaldırıldı",
    });
  } catch (error: any) {
    console.error("[BOT_ASSIGN_DELETE]", error);
    return NextResponse.json(
      { error: error.message || "Bot ataması kaldırılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

