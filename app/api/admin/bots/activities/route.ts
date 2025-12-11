import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BotActivityType } from "@prisma/client";

// Map category to activity types
function getActivityTypesByCategory(category: string): BotActivityType[] {
  switch (category) {
    case "linkedin":
      return [BotActivityType.POST, BotActivityType.LIKE, BotActivityType.COMMENT];
    case "application":
      return [
        BotActivityType.HACKATHON_APPLICATION,
        BotActivityType.FREELANCER_BID,
        BotActivityType.JOB_APPLICATION,
      ];
    case "education":
      return [BotActivityType.TEST, BotActivityType.LIVE_CODING, BotActivityType.LESSON];
    case "other":
      return [
        BotActivityType.BUG_FIX,
        BotActivityType.CHAT,
        BotActivityType.FRIEND_REQUEST,
        BotActivityType.ACCEPT_FRIEND_REQUEST,
      ];
    default:
      return [];
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")?.trim();
    const activityType = searchParams.get("activityType")?.trim();
    const category = searchParams.get("category")?.trim();
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    // Category filter takes precedence over activityType filter
    if (category && category !== "all") {
      const activityTypes = getActivityTypesByCategory(category);
      if (activityTypes.length > 0) {
        where.activityType = { in: activityTypes };
      }
    } else if (activityType) {
      where.activityType = activityType as BotActivityType;
    }

    // Get total count
    const total = await db.botActivity.count({ where });

    // Get activities with user and bot character info
    const activities = await db.botActivity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            botCharacter: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        executedAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Format activities with additional info
    const formattedActivities = await Promise.all(
      activities.map(async (activity: typeof activities[0]) => {
        const botName = activity.user.botCharacter?.name || activity.user.name || "Bot";
        let targetTitle: string | null = null;

        // Try to get target title based on activity type
        try {
          if (activity.targetId) {
            switch (activity.activityType) {
              case BotActivityType.POST:
                const post = await db.post.findUnique({
                  where: { id: activity.targetId },
                  select: { content: true },
                });
                targetTitle = post?.content?.substring(0, 100) || "Post";
                break;
              case BotActivityType.COMMENT:
                const comment = await db.postComment.findUnique({
                  where: { id: activity.targetId },
                  select: { content: true },
                });
                targetTitle = comment?.content?.substring(0, 100) || "Yorum";
                break;
              case BotActivityType.TEST:
                const quiz = await db.quiz.findUnique({
                  where: { id: activity.targetId },
                  select: { title: true },
                });
                targetTitle = quiz?.title || "Test";
                break;
              case BotActivityType.LIVE_CODING:
                const liveCodingQuiz = await db.quiz.findUnique({
                  where: { id: activity.targetId },
                  select: { title: true },
                });
                targetTitle = liveCodingQuiz?.title || "Canlı Kodlama";
                break;
              case BotActivityType.LESSON:
                targetTitle = activity.targetId; // Lesson slug
                break;
              default:
                targetTitle = null;
            }
          }
        } catch (error) {
          // Ignore errors when fetching target info
          console.error(`[BOT_ACTIVITIES] Error fetching target for ${activity.id}:`, error);
        }

        return {
          id: activity.id,
          userId: activity.userId,
          botName,
          botEmail: activity.user.email,
          botProfileImage: activity.user.profileImage,
          activityType: activity.activityType,
          targetId: activity.targetId,
          targetTitle,
          success: activity.success,
          errorMessage: activity.errorMessage,
          executedAt: activity.executedAt.toISOString(),
          details: activity.details,
        };
      })
    );

    return NextResponse.json({
      activities: formattedActivities,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error: any) {
    console.error("[BOT_ACTIVITIES_GET]", error);
    return NextResponse.json(
      { error: error.message || "Bot aktiviteleri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

