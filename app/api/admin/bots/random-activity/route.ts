import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  joinCommunities,
  likePosts,
  commentOnPosts,
  createPost,
  createLinkedInPost,
  completeLessons,
  completeTests,
  completeLiveCoding,
} from "@/lib/bot/bot-activity-service";
import {
  analyzePostForComment,
  generatePostContent,
  generateLinkedInPost,
  answerTestQuestions,
} from "@/lib/bot/ai-service";
import { simulateBotLogin } from "@/lib/bot/bot-session";
import { BotActivityType } from "@prisma/client";
import { logBotActivity } from "@/lib/bot/bot-activity-logger";

/**
 * Complete bug fix challenges (similar to live coding)
 */
async function completeBugFix(userId: string, count: number = 1) {
  try {
    // Get available bug fix challenges (quizzes with type LIVE_CODING)
    const quizzes = await db.quiz.findMany({
      where: {
        type: "LIVE_CODING",
      },
      select: {
        id: true,
        title: true,
      },
      take: 20,
    });

    if (quizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.BUG_FIX,
        success: false,
        errorMessage: "No bug fix challenges found",
      });
      return { success: false, completed: 0 };
    }

    // Get already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completed = await db.liveCodingAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizzes.map((q: { id: string; title: string }) => q.id) },
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        quizId: true,
      },
    });

    const completedQuizIds = new Set(completed.map((c: { quizId: string }) => c.quizId));
    const availableQuizzes = quizzes.filter((q: { id: string; title: string }) => !completedQuizIds.has(q.id));

    if (availableQuizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.BUG_FIX,
        success: true,
        details: { message: "All available bug fix challenges already completed today" },
      });
      return { success: true, completed: 0 };
    }

    // Shuffle and take random
    const shuffled = availableQuizzes.sort(() => Math.random() - 0.5);
    const toComplete = shuffled.slice(0, Math.min(count, shuffled.length));

    const attempts = [];
    for (const quiz of toComplete) {
      try {
        const attempt = await db.liveCodingAttempt.create({
          data: {
            userId,
            quizId: quiz.id,
            code: JSON.stringify({ tasks: [], metadata: { completed: true, type: "bugfix" } }),
            metrics: {
              caseCompleted: true,
              caseCompletedAt: new Date().toISOString(),
              completedTaskIds: [],
              totalDurationSeconds: Math.floor(Math.random() * 1800) + 600,
            },
            completedAt: new Date(),
          },
        });

        attempts.push(attempt);
      } catch (error: any) {
        console.error(`[BOT_BUGFIX] Error completing challenge ${quiz.id}:`, error);
      }
    }

    if (attempts.length > 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.BUG_FIX,
        targetId: attempts[0]?.quizId,
        details: { completedCount: attempts.length },
        success: true,
      });
    }

    return { success: true, completed: attempts.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.BUG_FIX,
      success: false,
      errorMessage: error.message || "Failed to complete bug fix",
    });
    return { success: false, completed: 0, error: error.message };
  }
}

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
    const { count } = body;

    if (!count || typeof count !== "number" || count <= 0) {
      return NextResponse.json(
        { error: "count must be a positive number" },
        { status: 400 }
      );
    }

    // Get all active bots
    const allBots = await db.user.findMany({
      where: {
        isBot: true,
        botConfiguration: {
          isActive: true,
        },
      },
      include: {
        botCharacter: true,
        botConfiguration: true,
      },
    });

    if (allBots.length === 0) {
      return NextResponse.json(
        { error: "Aktif bot bulunamadı" },
        { status: 400 }
      );
    }

    // Randomly select bots
    const shuffledBots = shuffleArray(allBots);
    const selectedBots = shuffledBots.slice(0, Math.min(count, allBots.length));

    // Activity types
    const activityTypes = [
      "POST",
      "COMMENT",
      "LIKE",
      "TEST",
      "LIVE_CODING",
      "BUG_FIX",
      "LESSON",
      "CHAT",
    ];

    const results: Array<{
      botId: string;
      botName: string;
      activityType: string;
      success: boolean;
      error?: string;
      details?: any;
    }> = [];

    // Process each bot
    for (const bot of selectedBots as Array<{ id: string; name: string | null; email: string | null; botCharacter: any; botConfiguration: any }>) {
      if (!bot.botCharacter || !bot.botConfiguration) {
        results.push({
          botId: bot.id,
          botName: bot.name || bot.email || "Unknown",
          activityType: "N/A",
          success: false,
          error: "Bot character or configuration not found",
        });
        continue;
      }

      // Randomly select an activity type
      const randomActivityType =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];

      const character = bot.botCharacter;
      const config = bot.botConfiguration;

      try {
        let result: any;

        // Execute activity based on type
        switch (randomActivityType) {
          case "POST": {
            // For POST, use LinkedIn post with random topic and type
            const topics = character.expertise && character.expertise.length > 0
              ? character.expertise
              : [
                  "yazılım geliştirme",
                  "teknoloji trendleri",
                  "programlama ipuçları",
                  "kariyer tavsiyeleri",
                  "best practices",
                  "yazılım mimarisi",
                  "kod kalitesi",
                  "teknoloji liderliği",
                ];
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            const randomPostType = (Math.floor(Math.random() * 10) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

            result = await createLinkedInPost(
              bot.id,
              (topic: string, postType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) =>
                generateLinkedInPost(character, topic, postType),
              randomTopic,
              randomPostType,
              character.expertise || []
            );
            break;
          }

          case "COMMENT":
            result = await commentOnPosts(
              bot.id,
              1,
              (postId) => analyzePostForComment(postId, character)
            );
            break;

          case "LIKE":
            result = await likePosts(bot.id, 1);
            break;

          case "TEST":
            result = await completeTests(
              bot.id,
              1,
              (quizId) => answerTestQuestions(quizId, character)
            );
            break;

          case "LIVE_CODING":
            result = await completeLiveCoding(bot.id, 1);
            break;

          case "BUG_FIX":
            result = await completeBugFix(bot.id, 1);
            break;

          case "LESSON":
            result = await completeLessons(bot.id, 1);
            break;

          case "CHAT":
            result = await joinCommunities(bot.id, 1);
            break;

          default:
            result = { success: false, error: `Unknown activity type: ${randomActivityType}` };
        }

        // Update last activity time and simulate login
        await db.botConfiguration.update({
          where: { userId: bot.id },
          data: { lastActivityAt: new Date() },
        });

        await simulateBotLogin(bot.id);

        results.push({
          botId: bot.id,
          botName: bot.name || bot.email || "Unknown",
          activityType: randomActivityType,
          success: result.success !== false,
          error: result.error,
          details: result,
        });
      } catch (error: any) {
        console.error(`[RANDOM_ACTIVITY] Error for bot ${bot.id}:`, error);
        results.push({
          botId: bot.id,
          botName: bot.name || bot.email || "Unknown",
          activityType: randomActivityType,
          success: false,
          error: error.message || "Aktivite çalıştırılırken hata oluştu",
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successful} bot başarıyla aktivite gerçekleştirdi${failed > 0 ? `, ${failed} başarısız` : ""}`,
      total: selectedBots.length,
      successful,
      failed,
      results,
    });
  } catch (error: any) {
    console.error("[RANDOM_ACTIVITY]", error);
    return NextResponse.json(
      { error: error.message || "Rastgele aktivite sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

