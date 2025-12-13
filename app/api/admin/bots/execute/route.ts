import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createLinkedInPost,
  commentOnPosts,
  likePosts,
  completeTests,
  completeLiveCoding,
  completeLessons,
} from "@/lib/bot/bot-activity-service";
import {
  analyzePostForComment,
  generateLinkedInPost,
  answerTestQuestions,
} from "@/lib/bot/ai-service";
import { BotActivityType } from "@prisma/client";

export async function POST(request: Request) {
  let requestBody: any = undefined;
  try {
    // API key kontrolü (Hangfire'dan gelen istekler için)
    const apiKey = request.headers.get("x-api-key");
    const expectedApiKey = process.env.BOT_API_KEY;

    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    try {
      requestBody = await request.json();
    } catch (error: any) {
      console.error("[BOT_EXECUTE] Failed to parse request body:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { userId, activityType, targetId } = requestBody;

    if (!userId || !activityType) {
      return NextResponse.json(
        { error: "userId and activityType are required" },
        { status: 400 }
      );
    }

    // Bot'u kontrol et
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        botConfiguration: true,
        botCharacter: true,
      },
    });

    if (!bot || !bot.botConfiguration?.isActive) {
      return NextResponse.json(
        { error: "Bot not found or inactive" },
        { status: 404 }
      );
    }

    const botConfig = bot.botConfiguration;
    const character = bot.botCharacter;

    if (!character) {
      return NextResponse.json(
        { error: "Bot character not found" },
        { status: 404 }
      );
    }

    // Get global scheduler config
    const globalConfig = await db.globalBotSchedulerConfig.findFirst();
    
    if (!globalConfig || !globalConfig.scheduleEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: "Global scheduler is not enabled",
        },
        { status: 400 }
      );
    }

    // Check if activity is enabled globally
    if (
      !globalConfig.enabledActivities ||
      !globalConfig.enabledActivities.includes(activityType)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Activity type ${activityType} is not enabled in global scheduler`,
        },
        { status: 400 }
      );
    }

    // Check if bot is active at current hour (using UTC to match .NET Core behavior)
    // Activity hours are stored in UTC timezone (0-23)
    const currentUtcHour = new Date().getUTCHours();
    const activityHours = globalConfig.activityHours && globalConfig.activityHours.length > 0
      ? globalConfig.activityHours
      : [9, 12, 18, 21]; // Default hours

    if (!activityHours.includes(currentUtcHour)) {
      return NextResponse.json(
        {
          success: false,
          error: `Bot is not active at current UTC hour (${currentUtcHour}). Active hours: ${activityHours.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check rate limits based on activity type
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let rateLimitExceeded = false;
    let rateLimitMessage = "";

    switch (activityType as BotActivityType) {
      case BotActivityType.POST:
        const todayPosts = await db.post.count({
          where: {
            userId,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });
        if (todayPosts >= globalConfig.maxPostsPerDay) {
          rateLimitExceeded = true;
          rateLimitMessage = `Daily post limit reached (${todayPosts}/${globalConfig.maxPostsPerDay})`;
        }
        break;

      case BotActivityType.COMMENT:
        const todayComments = await db.postComment.count({
          where: {
            userId,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });
        if (todayComments >= globalConfig.maxCommentsPerDay) {
          rateLimitExceeded = true;
          rateLimitMessage = `Daily comment limit reached (${todayComments}/${globalConfig.maxCommentsPerDay})`;
        }
        break;

      case BotActivityType.LIKE:
        const todayLikes = await db.postLike.count({
          where: {
            userId,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });
        if (todayLikes >= globalConfig.maxLikesPerDay) {
          rateLimitExceeded = true;
          rateLimitMessage = `Daily like limit reached (${todayLikes}/${globalConfig.maxLikesPerDay})`;
        }
        break;

      case BotActivityType.TEST:
        const weekTests = await db.testAttempt.count({
          where: {
            userId,
            completedAt: {
              gte: weekStart,
            },
          },
        });
        if (weekTests >= globalConfig.maxTestsPerWeek) {
          rateLimitExceeded = true;
          rateLimitMessage = `Weekly test limit reached (${weekTests}/${globalConfig.maxTestsPerWeek})`;
        }
        break;

      case BotActivityType.LIVE_CODING:
        const weekLiveCoding = await db.liveCodingAttempt.count({
          where: {
            userId,
            completedAt: {
              gte: weekStart,
            },
          },
        });
        if (weekLiveCoding >= globalConfig.maxLiveCodingPerWeek) {
          rateLimitExceeded = true;
          rateLimitMessage = `Weekly live coding limit reached (${weekLiveCoding}/${globalConfig.maxLiveCodingPerWeek})`;
        }
        break;

      case BotActivityType.LESSON:
        const weekLessons = await db.lessonCompletion.count({
          where: {
            userId,
            completedAt: {
              gte: weekStart,
            },
          },
        });
        if (weekLessons >= globalConfig.maxLessonsPerWeek) {
          rateLimitExceeded = true;
          rateLimitMessage = `Weekly lesson limit reached (${weekLessons}/${globalConfig.maxLessonsPerWeek})`;
        }
        break;
    }

    if (rateLimitExceeded) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitMessage,
        },
        { status: 429 } // Too Many Requests
      );
    }

    let result: any;

    switch (activityType as BotActivityType) {
      case BotActivityType.POST:
        // LinkedIn post oluştur
        const topics =
          character.expertise && character.expertise.length > 0
            ? character.expertise
            : [
                "yazılım geliştirme",
                "teknoloji trendleri",
                "programlama ipuçları",
                "kariyer tavsiyeleri",
              ];

        const randomTopic =
          topics[Math.floor(Math.random() * topics.length)];
        const randomPostType = (Math.floor(Math.random() * 10) +
          1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

        result = await createLinkedInPost(
          userId,
          (topic: string, postType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) =>
            generateLinkedInPost(character, topic, postType),
          randomTopic,
          randomPostType,
          character.expertise
        );
        break;

      case BotActivityType.COMMENT:
        // Comment on posts
        result = await commentOnPosts(userId, 1, (postId) =>
          analyzePostForComment(postId, character)
        );
        break;

      case BotActivityType.LIKE:
        // Like posts
        result = await likePosts(userId, 1);
        break;

      case BotActivityType.TEST:
        // Complete tests
        result = await completeTests(userId, 1, (quizId) =>
          answerTestQuestions(quizId, character)
        );
        break;

      case BotActivityType.LIVE_CODING:
        // Complete live coding
        result = await completeLiveCoding(userId, 1);
        break;

      case BotActivityType.LESSON:
        // Complete lessons
        result = await completeLessons(userId, 1);
        break;

      case BotActivityType.HACKATHON_APPLICATION:
      case BotActivityType.FREELANCER_BID:
      case BotActivityType.JOB_APPLICATION:
      case BotActivityType.FRIEND_REQUEST:
      case BotActivityType.ACCEPT_FRIEND_REQUEST:
        // These activities require additional context (targetId) and are not yet implemented
        return NextResponse.json(
          {
            success: false,
            error: `Activity type ${activityType} requires additional parameters and is not yet implemented in execute endpoint. Please use the full bot run endpoint for these activities.`,
          },
          { status: 501 }
        );

      case BotActivityType.BUG_FIX:
        // Bug fix activity requires specific quiz/bug fix case selection
        return NextResponse.json(
          {
            success: false,
            error: `BUG_FIX activity type is not yet implemented in execute endpoint. Bug fix activities require specific case selection and are better handled through the full bot run endpoint.`,
          },
          { status: 501 }
        );

      case BotActivityType.CHAT:
        // Chat activity requires community/group context
        return NextResponse.json(
          {
            success: false,
            error: `CHAT activity type is not yet implemented in execute endpoint. Chat activities require community context and are better handled through the full bot run endpoint.`,
          },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { error: `Unsupported activity type: ${activityType}` },
          { status: 400 }
        );
    }

    // Update last activity time
    await db.botConfiguration.update({
      where: { userId },
      data: { lastActivityAt: new Date() },
    });

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Activity executed successfully"
        : result.error || "Activity execution failed",
      result,
    });
  } catch (error: any) {
    // Use already parsed requestBody for logging (don't try to parse again)
    const requestInfo = requestBody 
      ? { userId: requestBody.userId, activityType: requestBody.activityType }
      : {};

    console.error("[BOT_EXECUTE] Error:", {
      message: error.message,
      stack: error.stack,
      ...requestInfo,
      timestamp: new Date().toISOString(),
      errorType: error.constructor?.name || "Unknown",
    });
    
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
