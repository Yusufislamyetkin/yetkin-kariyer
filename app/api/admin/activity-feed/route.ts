import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

type ActivityType =
  | "POST"
  | "LIKE"
  | "COMMENT"
  | "SAVE"
  | "TEST"
  | "LIVE_CODING"
  | "BUG_FIX"
  | "QUIZ"
  | "LESSON"
  | "BOT_ACTIVITY";

interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  userIsBot: boolean;
  timestamp: Date;
  details: {
    postId?: string;
    postContent?: string;
    commentId?: string;
    commentContent?: string;
    quizId?: string;
    quizTitle?: string;
    testScore?: number;
    lessonSlug?: string;
    activityType?: string;
    targetId?: string;
    [key: string]: any;
  };
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
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50");
    const activityType = searchParams.get("activityType")?.toUpperCase();

    const activities: ActivityItem[] = [];

    // Fetch Posts
    if (!activityType || activityType === "POST") {
      const posts = await db.post.findMany({
        where: cursor
          ? {
              createdAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      for (const post of posts) {
        activities.push({
          id: post.id,
          type: "POST",
          userId: post.userId,
          userName: post.user.name,
          userEmail: post.user.email,
          userImage: post.user.profileImage,
          userIsBot: post.user.isBot,
          timestamp: post.createdAt,
          details: {
            postId: post.id,
            postContent: post.content?.substring(0, 200) || "",
          },
        });
      }
    }

    // Fetch Likes
    if (!activityType || activityType === "LIKE") {
      const likes = await db.postLike.findMany({
        where: cursor
          ? {
              createdAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      for (const like of likes) {
        activities.push({
          id: like.id,
          type: "LIKE",
          userId: like.userId,
          userName: like.user.name,
          userEmail: like.user.email,
          userImage: like.user.profileImage,
          userIsBot: like.user.isBot,
          timestamp: like.createdAt,
          details: {
            postId: like.postId,
            postContent: like.post.content?.substring(0, 200) || "",
          },
        });
      }
    }

    // Fetch Comments
    if (!activityType || activityType === "COMMENT") {
      const comments = await db.postComment.findMany({
        where: cursor
          ? {
              createdAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      for (const comment of comments) {
        activities.push({
          id: comment.id,
          type: "COMMENT",
          userId: comment.userId,
          userName: comment.user.name,
          userEmail: comment.user.email,
          userImage: comment.user.profileImage,
          userIsBot: comment.user.isBot,
          timestamp: comment.createdAt,
          details: {
            postId: comment.postId,
            postContent: comment.post.content?.substring(0, 200) || "",
            commentId: comment.id,
            commentContent: comment.content,
          },
        });
      }
    }

    // Fetch Saves
    if (!activityType || activityType === "SAVE") {
      const saves = await db.postSave.findMany({
        where: cursor
          ? {
              createdAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      for (const save of saves) {
        activities.push({
          id: save.id,
          type: "SAVE",
          userId: save.userId,
          userName: save.user.name,
          userEmail: save.user.email,
          userImage: save.user.profileImage,
          userIsBot: save.user.isBot,
          timestamp: save.createdAt,
          details: {
            postId: save.postId,
            postContent: save.post.content?.substring(0, 200) || "",
          },
        });
      }
    }

    // Fetch Test Attempts
    if (!activityType || activityType === "TEST") {
      const testAttempts = await db.testAttempt.findMany({
        where: cursor
          ? {
              completedAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
        take: limit,
      });

      for (const attempt of testAttempts) {
        const metrics = attempt.metrics as any;
        activities.push({
          id: attempt.id,
          type: "TEST",
          userId: attempt.userId,
          userName: attempt.user.name,
          userEmail: attempt.user.email,
          userImage: attempt.user.profileImage,
          userIsBot: attempt.user.isBot,
          timestamp: attempt.completedAt,
          details: {
            quizId: attempt.quizId,
            quizTitle: attempt.quiz.title,
            testScore: metrics?.score || 0,
          },
        });
      }
    }

    // Fetch Live Coding Attempts
    if (!activityType || activityType === "LIVE_CODING") {
      const liveCodingAttempts = await db.liveCodingAttempt.findMany({
        where: cursor
          ? {
              completedAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
        take: limit,
      });

      for (const attempt of liveCodingAttempts) {
        const metrics = attempt.metrics as any;
        activities.push({
          id: attempt.id,
          type: "LIVE_CODING",
          userId: attempt.userId,
          userName: attempt.user.name,
          userEmail: attempt.user.email,
          userImage: attempt.user.profileImage,
          userIsBot: attempt.user.isBot,
          timestamp: attempt.completedAt,
          details: {
            quizId: attempt.quizId,
            quizTitle: attempt.quiz.title,
            testScore: metrics?.score || 0,
          },
        });
      }
    }

    // Fetch Bug Fix Attempts
    if (!activityType || activityType === "BUG_FIX") {
      const bugFixAttempts = await db.bugFixAttempt.findMany({
        where: cursor
          ? {
              completedAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
        take: limit,
      });

      for (const attempt of bugFixAttempts) {
        const metrics = attempt.metrics as any;
        activities.push({
          id: attempt.id,
          type: "BUG_FIX",
          userId: attempt.userId,
          userName: attempt.user.name,
          userEmail: attempt.user.email,
          userImage: attempt.user.profileImage,
          userIsBot: attempt.user.isBot,
          timestamp: attempt.completedAt,
          details: {
            quizId: attempt.quizId,
            quizTitle: attempt.quiz.title,
            testScore: metrics?.score || 0,
          },
        });
      }
    }

    // Fetch Quiz Attempts
    if (!activityType || activityType === "QUIZ") {
      const quizAttempts = await db.quizAttempt.findMany({
        where: cursor
          ? {
              completedAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
        take: limit,
      });

      for (const attempt of quizAttempts) {
        const metrics = attempt.metrics as any;
        activities.push({
          id: attempt.id,
          type: "QUIZ",
          userId: attempt.userId,
          userName: attempt.user.name,
          userEmail: attempt.user.email,
          userImage: attempt.user.profileImage,
          userIsBot: attempt.user.isBot,
          timestamp: attempt.completedAt,
          details: {
            quizId: attempt.quizId,
            quizTitle: attempt.quiz.title,
            testScore: metrics?.score || 0,
          },
        });
      }
    }

    // Fetch Lesson Completions
    if (!activityType || activityType === "LESSON") {
      const whereClause: any = {
        completedAt: {
          not: null,
        },
      };

      if (cursor) {
        whereClause.completedAt = {
          ...whereClause.completedAt,
          lt: new Date(cursor),
        };
      }

      const lessonCompletions = await db.lessonCompletion.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
        take: limit,
      });

      for (const completion of lessonCompletions) {
        if (completion.completedAt) {
          activities.push({
            id: completion.id,
            type: "LESSON",
            userId: completion.userId,
            userName: completion.user.name,
            userEmail: completion.user.email,
            userImage: completion.user.profileImage,
            userIsBot: completion.user.isBot,
            timestamp: completion.completedAt,
            details: {
              lessonSlug: completion.lessonSlug,
            },
          });
        }
      }
    }

    // Fetch Bot Activities
    if (!activityType || activityType === "BOT_ACTIVITY") {
      const botActivities = await db.botActivity.findMany({
        where: cursor
          ? {
              executedAt: {
                lt: new Date(cursor),
              },
            }
          : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isBot: true,
            },
          },
        },
        orderBy: {
          executedAt: "desc",
        },
        take: limit,
      });

      for (const activity of botActivities) {
        activities.push({
          id: activity.id,
          type: "BOT_ACTIVITY",
          userId: activity.userId,
          userName: activity.user.name,
          userEmail: activity.user.email,
          userImage: activity.user.profileImage,
          userIsBot: activity.user.isBot,
          timestamp: activity.executedAt,
          details: {
            activityType: activity.activityType,
            targetId: activity.targetId,
            success: activity.success,
            errorMessage: activity.errorMessage,
          },
        });
      }
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit to requested amount
    const limitedActivities = activities.slice(0, limit);
    const nextCursor =
      limitedActivities.length > 0
        ? limitedActivities[limitedActivities.length - 1].timestamp.toISOString()
        : null;

    return NextResponse.json({
      activities: limitedActivities,
      nextCursor,
      hasMore: limitedActivities.length === limit,
    });
  } catch (error: any) {
    console.error("[ADMIN_ACTIVITY_FEED]", error);
    return NextResponse.json(
      { error: error.message || "Etkileşimler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

