import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  joinCommunities,
  likePosts,
  commentOnPosts,
  createPost,
  completeLessons,
  completeTests,
  completeLiveCoding,
} from "@/lib/bot/bot-activity-service";
import { analyzePostForComment, generatePostContent, answerTestQuestions } from "@/lib/bot/ai-service";
import { simulateBotLogin } from "@/lib/bot/bot-session";
import { BotActivityType } from "@prisma/client";
import { logBotActivity } from "@/lib/bot/bot-activity-logger";

/**
 * Complete bug fix challenges (similar to live coding)
 */
async function completeBugFix(userId: string, count: number = 1) {
  try {
    // Get available bug fix challenges (quizzes with type BUG_FIX or similar)
    const quizzes = await db.quiz.findMany({
      where: {
        type: "LIVE_CODING", // Using LIVE_CODING type for now, can be extended
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

    // Use liveCodingAttempt table for bug fix tracking
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
              totalDurationSeconds: Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
            },
            completedAt: new Date(),
          },
        });

        attempts.push(attempt);
      } catch (error: any) {
        console.error(`[BOT_BUGFIX] Error completing challenge ${quiz.id}:`, error);
        // Continue with next
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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { activityType } = body;

    if (!activityType) {
      return NextResponse.json(
        { error: "activityType is required" },
        { status: 400 }
      );
    }

    // Validate activity type
    const validActivityTypes = [
      "POST",
      "COMMENT",
      "LIKE",
      "TEST",
      "LIVE_CODING",
      "BUG_FIX",
      "LESSON",
      "CHAT",
    ];

    if (!validActivityTypes.includes(activityType)) {
      return NextResponse.json(
        { error: `Invalid activityType. Must be one of: ${validActivityTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Get bot with character and configuration
    const bot = await db.user.findUnique({
      where: { id: params.id },
      include: {
        botCharacter: true,
        botConfiguration: true,
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
      );
    }

    if (!bot.isBot) {
      return NextResponse.json(
        { error: "User is not a bot" },
        { status: 400 }
      );
    }

    if (!bot.botCharacter || !bot.botConfiguration) {
      return NextResponse.json(
        { error: "Bot character or configuration not found" },
        { status: 400 }
      );
    }

    if (!bot.botConfiguration.isActive) {
      return NextResponse.json(
        { error: "Bot is not active" },
        { status: 400 }
      );
    }

    const character = bot.botCharacter;
    const config = bot.botConfiguration;

    let result: any;

    try {
      // Execute activity based on type
      switch (activityType) {
        case "POST":
          result = await createPost(
            bot.id,
            (newsSource) => generatePostContent(character, newsSource),
            character.expertise
          );
          break;

        case "COMMENT":
          result = await commentOnPosts(
            bot.id,
            1, // Single comment for manual execution
            (postId) => analyzePostForComment(postId, character)
          );
          break;

        case "LIKE":
          result = await likePosts(bot.id, 1); // Single like for manual execution
          break;

        case "TEST":
          result = await completeTests(
            bot.id,
            1, // Single test for manual execution
            (quizId) => answerTestQuestions(quizId, character)
          );
          break;

        case "LIVE_CODING":
          result = await completeLiveCoding(bot.id, 1); // Single challenge for manual execution
          break;

        case "BUG_FIX":
          result = await completeBugFix(bot.id, 1); // Single challenge for manual execution
          break;

        case "LESSON":
          result = await completeLessons(bot.id, 1); // Single lesson for manual execution
          break;

        case "CHAT":
          result = await joinCommunities(bot.id, 1); // Join 1 community for manual execution
          break;

        default:
          return NextResponse.json(
            { error: `Unsupported activity type: ${activityType}` },
            { status: 400 }
          );
      }

      // Update last activity time and simulate login
      await db.botConfiguration.update({
        where: { userId: bot.id },
        data: { lastActivityAt: new Date() },
      });

      // Simulate bot login (update activity timestamps)
      await simulateBotLogin(bot.id);

      return NextResponse.json({
        success: true,
        message: `Activity ${activityType} executed successfully`,
        activityType,
        botId: bot.id,
        botName: bot.name,
        result,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error(`[BOT_EXECUTE] Error executing activity ${activityType} for bot ${bot.id}:`, error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to execute activity",
          activityType,
          botId: bot.id,
          botName: bot.name,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[BOT_EXECUTE] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
