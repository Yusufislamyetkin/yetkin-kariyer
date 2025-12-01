import { db } from "@/lib/db";
import { createChatCompletion } from "@/lib/ai/client";

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
 * Creates a comment activity for a bot on a post
 */
export async function createCommentActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Get bot character
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        botCharacter: true,
      },
    });

    if (!bot || !bot.botCharacter) {
      return {
        success: false,
        error: "Bot character not found",
      };
    }

    // Find a post to comment on
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
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          comments: {
            take: 3,
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (recentPosts.length === 0) {
        return {
          success: false,
          error: "No posts found to comment on",
        };
      }

      // Pick a random post
      const selectedPost = recentPosts[Math.floor(Math.random() * recentPosts.length)];
      postId = selectedPost.id;

      // Check if bot already commented on this post
      const existingComment = await db.postComment.findFirst({
        where: {
          postId: selectedPost.id,
          userId: userId,
        },
      });

      if (existingComment) {
        // Skip if already commented
        return {
          success: false,
          error: "Already commented on this post",
        };
      }
    }

    // Get the post
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        comments: {
          take: 5,
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // Generate comment using AI
    const prompt = `You are ${bot.botCharacter.name}, a developer in a Turkish developer community.

${bot.botCharacter.systemPrompt}

Write a thoughtful, relevant comment in Turkish for this post:

Post by ${post.user?.name || "Someone"}:
${post.content || "No content"}

Existing comments:
${post.comments.map((c: any) => `- ${c.user?.name || "Someone"}: ${c.content}`).join("\n") || "No comments yet"}

Generate a comment that:
- Is relevant to the post content
- Is natural and conversational in Turkish
- Adds value to the discussion
- Is between 20-150 words
- May include 1-2 emojis if appropriate

Generate only the comment text, nothing else.`;

    const result = await createChatCompletion({
      messages: [
        {
          role: "system",
          content: bot.botCharacter.systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    if (!result.content) {
      return {
        success: false,
        error: "Failed to generate comment",
      };
    }

    const commentContent = result.content.trim();

    // Create the comment
    const comment = await db.postComment.create({
      data: {
        postId: post.id,
        userId,
        content: commentContent,
      },
    });

    return {
      success: true,
      activityId: comment.id,
    };
  } catch (error: any) {
    console.error(`[BOT_COMMENT_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create comment",
    };
  }
}

