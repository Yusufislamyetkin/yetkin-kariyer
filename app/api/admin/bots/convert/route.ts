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
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = convertToBotSchema.parse(body);

    const results = [];

    for (const userId of data.userIds) {
      try {
        // Check if user exists
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, isBot: true, name: true },
        });

        if (!user) {
          results.push({
            userId,
            success: false,
            error: "Kullanıcı bulunamadı",
          });
          continue;
        }

        if (user.isBot) {
          results.push({
            userId,
            success: false,
            error: "Bu kullanıcı zaten bir bot",
          });
          continue;
        }

        // Mark user as bot
        await db.user.update({
          where: { id: userId },
          data: { isBot: true },
        });

        // Generate character if auto-generate is enabled
        if (data.autoGenerateCharacter) {
          try {
            const character = await generateBotCharacter(userId);
            await createOrUpdateBotCharacter(userId, character);
          } catch (charError: any) {
            console.error(`[BOT_CONVERT] Character generation failed for ${userId}:`, charError);
            // Continue even if character generation fails
          }
        }

        // Create default bot configuration
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

        results.push({
          userId,
          success: true,
          userName: user.name,
        });
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
    console.error("[BOT_CONVERT]", error);
    return NextResponse.json(
      { error: error.message || "Bot'a dönüştürme işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

