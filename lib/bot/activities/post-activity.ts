import { db } from "@/lib/db";
import { createChatCompletion } from "@/lib/ai/client";
import { getBotSystemPrompt } from "@/lib/ai/bot-character-generator";

interface ActivityResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

/**
 * Creates a post activity for a bot
 */
export async function createPostActivity(userId: string): Promise<ActivityResult> {
  try {
    // Get bot character and configuration
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        character: true,
        configuration: true,
      },
    });

    if (!bot || !bot.character) {
      return {
        success: false,
        error: "Bot character not found",
      };
    }

    // Get system prompt
    const systemPrompt = bot.character.systemPrompt;

    // Get recent posts to understand context
    const recentPosts = await db.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        content: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Determine post type (technical tip, achievement, question, etc.)
    const postTypes = ["technical_tip", "achievement", "question", "discussion", "learning_share"];
    const selectedType = postTypes[Math.floor(Math.random() * postTypes.length)];

    const prompt = `You are ${bot.character.name}, a developer in a Turkish developer community.

${systemPrompt}

Create a social media post in Turkish for this platform. The post should:
- Be authentic and feel like it's from a real developer
- Be relevant to recent community discussions
- Match the post type: ${selectedType}
- Be between 50-300 words
- Use natural, conversational Turkish
- Include emojis if appropriate (1-3 emojis max)
- Be engaging and encourage interaction

Recent posts in the community:
${recentPosts.slice(0, 5).map((p: any) => `- ${p.user?.name || "Someone"}: ${p.content?.substring(0, 100)}...`).join("\n")}

Generate only the post content, no explanations or meta text.`;

    const result = await createChatCompletion({
      messages: [
        {
          role: "system",
          content: systemPrompt,
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
        error: "Failed to generate post content",
      };
    }

    const postContent = result.content.trim();

    // Create the post
    const post = await db.post.create({
      data: {
        userId,
        content: postContent,
      },
    });

    return {
      success: true,
      activityId: post.id,
    };
  } catch (error: any) {
    console.error(`[BOT_POST_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create post",
    };
  }
}

