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

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentHour = new Date().getHours();
    const results: any[] = [];

    // Get all active bots
    const bots = await db.user.findMany({
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

    if (bots.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Aktif bot bulunamadı",
        processed: 0,
        results: [],
      });
    }

    // Process each bot
    for (const bot of bots) {
      if (!bot.botConfiguration || !bot.botCharacter) {
        continue;
      }

      const config = bot.botConfiguration;
      const character = bot.botCharacter;

      // Check if bot should be active at this hour (optional check - can be skipped for manual run)
      // For manual runs, we can skip the hour check or make it optional
      const body = await request.json().catch(() => ({}));
      const skipHourCheck = body.skipHourCheck === true;

      if (!skipHourCheck && config.activityHours.length > 0 && !config.activityHours.includes(currentHour)) {
        results.push({
          userId: bot.id,
          name: bot.name,
          skipped: true,
          reason: "Not in active hours",
        });
        continue;
      }

      const botResult: any = {
        userId: bot.id,
        name: bot.name,
        activities: [],
      };

      try {
        // Calculate daily limits (check what's been done today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check today's activities
        const todayPosts = await db.post.count({
          where: {
            userId: bot.id,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        const todayComments = await db.postComment.count({
          where: {
            userId: bot.id,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        const todayLikes = await db.postLike.count({
          where: {
            userId: bot.id,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        // Check weekly activities
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
        weekStart.setHours(0, 0, 0, 0);

        const weekTests = await db.testAttempt.count({
          where: {
            userId: bot.id,
            completedAt: {
              gte: weekStart,
            },
          },
        });

        const weekLiveCoding = await db.liveCodingAttempt.count({
          where: {
            userId: bot.id,
            completedAt: {
              gte: weekStart,
            },
          },
        });

        const weekLessons = await db.lessonCompletion.count({
          where: {
            userId: bot.id,
            completedAt: {
              gte: weekStart,
            },
          },
        });

        // Join communities (if needed)
        if (Math.random() < 0.3) {
          // 30% chance to join communities
          const result = await joinCommunities(bot.id, 1);
          if (result.success) {
            botResult.activities.push({ type: "joinCommunities", ...result });
          }
        }

        // Create posts (if under limit)
        if (todayPosts < config.minPostsPerDay) {
          const needed = config.maxPostsPerDay - todayPosts;
          if (needed > 0 && Math.random() < 0.5) {
            // 50% chance to create a post
            const result = await createPost(bot.id, () =>
              generatePostContent(character)
            );
            if (result.success) {
              botResult.activities.push({ type: "createPost", ...result });
            }
          }
        }

        // Like posts (if under limit)
        if (todayLikes < config.minLikesPerDay) {
          const needed = Math.min(
            config.maxLikesPerDay - todayLikes,
            Math.floor((config.maxLikesPerDay - config.minLikesPerDay) * Math.random()) + 1
          );
          if (needed > 0) {
            const result = await likePosts(bot.id, needed);
            if (result.success) {
              botResult.activities.push({ type: "likePosts", ...result });
            }
          }
        }

        // Comment on posts (if under limit)
        if (todayComments < config.minCommentsPerDay) {
          const needed = Math.min(
            config.maxCommentsPerDay - todayComments,
            Math.floor((config.maxCommentsPerDay - config.minCommentsPerDay) * Math.random()) + 1
          );
          if (needed > 0) {
            const result = await commentOnPosts(bot.id, needed, (postId) =>
              analyzePostForComment(postId, character)
            );
            if (result.success) {
              botResult.activities.push({ type: "commentOnPosts", ...result });
            }
          }
        }

        // Complete lessons (if under weekly limit)
        if (weekLessons < config.minLessonsPerWeek) {
          const needed = Math.min(
            config.maxLessonsPerWeek - weekLessons,
            Math.floor((config.maxLessonsPerWeek - config.minLessonsPerWeek) * Math.random()) + 1
          );
          if (needed > 0) {
            const result = await completeLessons(bot.id, needed);
            if (result.success) {
              botResult.activities.push({ type: "completeLessons", ...result });
            }
          }
        }

        // Complete tests (if under weekly limit)
        if (weekTests < config.minTestsPerWeek) {
          const needed = Math.min(
            config.maxTestsPerWeek - weekTests,
            Math.floor((config.maxTestsPerWeek - config.minTestsPerWeek) * Math.random()) + 1
          );
          if (needed > 0) {
            const result = await completeTests(bot.id, needed, (quizId) =>
              answerTestQuestions(quizId, character)
            );
            if (result.success) {
              botResult.activities.push({ type: "completeTests", ...result });
            }
          }
        }

        // Complete live coding (if under weekly limit)
        if (weekLiveCoding < config.minLiveCodingPerWeek) {
          const needed = Math.min(
            config.maxLiveCodingPerWeek - weekLiveCoding,
            Math.floor((config.maxLiveCodingPerWeek - config.minLiveCodingPerWeek) * Math.random()) + 1
          );
          if (needed > 0) {
            const result = await completeLiveCoding(bot.id, needed);
            if (result.success) {
              botResult.activities.push({ type: "completeLiveCoding", ...result });
            }
          }
        }

        // Update last activity time and simulate login
        await db.botConfiguration.update({
          where: { userId: bot.id },
          data: { lastActivityAt: new Date() },
        });

        // Simulate bot login (update activity timestamps)
        await simulateBotLogin(bot.id);

        botResult.success = true;
        botResult.totalActivities = botResult.activities.length;
      } catch (error: any) {
        console.error(`[BOT_RUN] Error processing bot ${bot.id}:`, error);
        botResult.success = false;
        botResult.error = error.message;
      }

      results.push(botResult);
    }

    const successful = results.filter((r) => r.success && !r.skipped).length;
    const failed = results.filter((r) => !r.success && !r.skipped).length;
    const skipped = results.filter((r) => r.skipped).length;

    return NextResponse.json({
      success: true,
      message: `${results.length} bot işlendi`,
      processed: results.length,
      successful,
      failed,
      skipped,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[BOT_RUN] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Bot çalıştırma başarısız oldu",
      },
      { status: 500 }
    );
  }
}

