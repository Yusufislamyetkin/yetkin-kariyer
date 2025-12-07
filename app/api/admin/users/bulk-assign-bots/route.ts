import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getCharacterProfileById } from "@/lib/bot/character-profiles";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Get character profile defaults if provided
    let defaultPersona: string | undefined;
    let defaultSystemPrompt: string | undefined;
    let defaultExpertise: string[] = [];
    
    if (body.characterProfileId) {
      const profile = getCharacterProfileById(body.characterProfileId);
      if (profile) {
        defaultPersona = profile.persona;
        defaultSystemPrompt = profile.systemPrompt;
        defaultExpertise = profile.defaultExpertise;
      }
    }
    
    // Fallback defaults
    if (!defaultPersona) {
      defaultPersona = "Yardımsever ve aktif bir topluluk üyesi.";
    }
    if (!defaultSystemPrompt) {
      defaultSystemPrompt = "Gerçekçi ve yardımsever bir şekilde davran. Topluluk içinde aktif ol ve diğer kullanıcılara yardımcı ol.";
    }

    const results: Array<{ userId: string; success: boolean; error?: string }> = [];

    // Process each user
    for (const userId of userIds) {
      try {
        // Check if user exists
        const user = await db.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          results.push({ userId, success: false, error: "Kullanıcı bulunamadı" });
          continue;
        }

        // Check if already a bot with character
        if (user.isBot) {
          const existingBotCharacter = await db.botCharacter.findUnique({
            where: { userId },
          });
          
          if (existingBotCharacter) {
            results.push({ userId, success: false, error: "Zaten bot olarak atanmış" });
            continue;
          }
        }

        // Create bot character and configuration in transaction
        await db.$transaction(async (tx: Prisma.TransactionClient) => {
          // Update user to be a bot
          await tx.user.update({
            where: { id: userId },
            data: { isBot: true },
          });

          // Create or update bot character
          await tx.botCharacter.upsert({
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

          // Create or update bot configuration with defaults
          await tx.botConfiguration.upsert({
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
        });

        results.push({ userId, success: true });
      } catch (error: any) {
        console.error(`[BULK_BOT_ASSIGN] Error for user ${userId}:`, error);
        results.push({ userId, success: false, error: error.message || "Bot atama hatası" });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successful} kullanıcı bot olarak atandı${failed > 0 ? `, ${failed} başarısız` : ""}`,
      results,
      successful,
      failed,
      total: userIds.length,
    });
  } catch (error: any) {
    console.error("[BULK_BOT_ASSIGN]", error);
    return NextResponse.json(
      { error: error.message || "Toplu bot atama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

