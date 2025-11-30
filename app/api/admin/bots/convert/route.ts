import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateBotCharacter, createOrUpdateBotCharacter } from "@/lib/ai/bot-character-generator";
import { z } from "zod";

const convertToBotSchema = z.object({
  userIds: z.array(z.string()),
  autoGenerateCharacter: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  try {
    console.log("[BOT_CONVERT] Request received");
    
    const session = await auth();
    console.log("[BOT_CONVERT] Session check:", session ? "exists" : "missing", session ? (session.user as any)?.role : "N/A");

    if (!session || (session.user as any)?.role !== "admin") {
      console.error("[BOT_CONVERT] Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
      console.log("[BOT_CONVERT] Request body received, userIds count:", body?.userIds?.length || 0);
    } catch (parseError: any) {
      console.error("[BOT_CONVERT] Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Geçersiz istek formatı" },
        { status: 400 }
      );
    }

    let data;
    try {
      data = convertToBotSchema.parse(body);
      console.log("[BOT_CONVERT] Validated data:", {
        userIdsCount: data.userIds.length,
        autoGenerateCharacter: data.autoGenerateCharacter,
      });
    } catch (validationError: any) {
      console.error("[BOT_CONVERT] Validation error:", validationError);
      return NextResponse.json(
        { error: `Geçersiz veri: ${validationError.message || "Bilinmeyen doğrulama hatası"}` },
        { status: 400 }
      );
    }

    if (!data.userIds || data.userIds.length === 0) {
      console.error("[BOT_CONVERT] No user IDs provided");
      return NextResponse.json(
        { error: "En az bir kullanıcı ID'si gerekli" },
        { status: 400 }
      );
    }

    const results = [];

    for (const userId of data.userIds) {
      try {
        console.log(`[BOT_CONVERT] Processing user ${userId}`);
        
        // Check if user exists
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, isBot: true, name: true },
        });

        if (!user) {
          console.warn(`[BOT_CONVERT] User ${userId} not found`);
          results.push({
            userId,
            success: false,
            error: "Kullanıcı bulunamadı",
          });
          continue;
        }

        if (user.isBot) {
          console.warn(`[BOT_CONVERT] User ${userId} (${user.name}) is already a bot`);
          results.push({
            userId,
            success: false,
            error: "Bu kullanıcı zaten bir bot",
          });
          continue;
        }

        console.log(`[BOT_CONVERT] Converting user ${userId} (${user.name}) to bot`);

        // Mark user as bot
        await db.user.update({
          where: { id: userId },
          data: { isBot: true },
        });
        console.log(`[BOT_CONVERT] User ${userId} marked as bot`);

        // Generate character if auto-generate is enabled
        if (data.autoGenerateCharacter) {
          try {
            console.log(`[BOT_CONVERT] Generating character for user ${userId}`);
            const character = await generateBotCharacter(userId);
            await createOrUpdateBotCharacter(userId, character);
            console.log(`[BOT_CONVERT] Character generated successfully for user ${userId}`);
          } catch (charError: any) {
            console.error(`[BOT_CONVERT] Character generation failed for ${userId}:`, charError);
            // Continue even if character generation fails
          }
        }

        // Create default bot configuration
        try {
          await db.botConfiguration.upsert({
            where: { userId },
            create: {
              userId,
              isActive: true,
              minPostsPerDay: 1,
              maxPostsPerDay: 3,
              minCommentsPerDay: 0,
              maxCommentsPerDay: 5,
              minLikesPerDay: 0,
              maxLikesPerDay: 10,
              minTestsPerWeek: 0,
              maxTestsPerWeek: 3,
              minLiveCodingPerWeek: 0,
              maxLiveCodingPerWeek: 2,
              minBugFixPerWeek: 0,
              maxBugFixPerWeek: 2,
              minLessonsPerWeek: 0,
              maxLessonsPerWeek: 5,
              minChatMessagesPerDay: 0,
              maxChatMessagesPerDay: 10,
            },
            update: {
              isActive: true,
            },
          });
          console.log(`[BOT_CONVERT] Bot configuration created/updated for user ${userId}`);
        } catch (configError: any) {
          console.error(`[BOT_CONVERT] Failed to create bot configuration for ${userId}:`, configError);
          // Continue even if configuration creation fails
        }

        results.push({
          userId,
          success: true,
          userName: user.name,
        });
        console.log(`[BOT_CONVERT] Successfully converted user ${userId} (${user.name}) to bot`);
      } catch (error: any) {
        console.error(`[BOT_CONVERT] Error converting user ${userId}:`, error);
        results.push({
          userId,
          success: false,
          error: error.message || "Bilinmeyen hata",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(`[BOT_CONVERT] Conversion completed. Success: ${successCount}, Failed: ${failCount}, Total: ${results.length}`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failCount,
      },
    });
  } catch (error: any) {
    console.error("[BOT_CONVERT] Unexpected error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Bot'a dönüştürme işlemi sırasında bir hata oluştu",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}

