import { db } from "@/lib/db";

interface ActivityResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

interface ActivityOptions {
  targetId?: string;
  postId?: string;
}

/**
 * Creates a like activity for a bot on a post
 */
export async function createLikeActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    let postId = options.postId || options.targetId;

    if (!postId) {
      // Find a recent post from another user
      const recentPosts = await db.post.findMany({
        where: {
          userId: { not: userId },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        take: 50,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
        },
      });

      if (recentPosts.length === 0) {
        return {
          success: false,
          error: "No posts found to like",
        };
      }

      // Pick a random post
      const selectedPost = recentPosts[Math.floor(Math.random() * recentPosts.length)];
      postId = selectedPost.id;
    }

    // Check if already liked
    const existingLike = await db.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      return {
        success: false,
        error: "Already liked this post",
      };
    }

    // Create the like
    const like = await db.postLike.create({
      data: {
        postId,
        userId,
      },
    });

    return {
      success: true,
      activityId: like.id,
    };
  } catch (error: any) {
    console.error(`[BOT_LIKE_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create like",
    };
  }
}

