import { db } from "@/lib/db";
import { createChatCompletion } from "@/lib/ai/client";

interface ActivityResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

interface ActivityOptions {
  targetId?: string;
  groupId?: string;
}

/**
 * Creates a chat message activity for a bot in community channels
 */
export async function createChatActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Get bot character
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        character: true,
      },
    });

    if (!bot || !bot.character) {
      return {
        success: false,
        error: "Bot character not found",
      };
    }

    // Find a community group to chat in
    let groupId = options.groupId || options.targetId;

    if (!groupId) {
      // Get bot's group memberships
      const memberships = await db.chatGroupMembership.findMany({
        where: {
          userId,
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        take: 10,
      });

      if (memberships.length === 0) {
        // Find public community groups
        const publicGroups = await db.chatGroup.findMany({
          where: {
            visibility: "public",
          },
          take: 5,
          select: {
            id: true,
            name: true,
            description: true,
          },
        });

        if (publicGroups.length === 0) {
          return {
            success: false,
            error: "No community groups found",
          };
        }

        const selectedGroup = publicGroups[Math.floor(Math.random() * publicGroups.length)];
        groupId = selectedGroup.id;

        // Join the group
        await db.chatGroupMembership.create({
          data: {
            groupId: selectedGroup.id,
            userId,
            role: "member",
          },
        });
      } else {
        const selectedMembership = memberships[Math.floor(Math.random() * memberships.length)];
        groupId = selectedMembership.group.id;
      }
    }

    // Get recent messages in the group for context
    const recentMessages = await db.chatMessage.findMany({
      where: {
        groupId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Generate chat message using AI
    const prompt = `You are ${bot.character.name}, a developer in a Turkish developer community chat.

${bot.character.systemPrompt}

The community is discussing in a group. Write a short, relevant chat message in Turkish that:
- Is conversational and natural
- Responds to recent messages if relevant, or starts a new topic
- Is between 20-100 words
- Uses natural Turkish chat language
- May include 1-2 emojis if appropriate
- Adds value to the discussion

Recent messages in the group:
${recentMessages.slice(0, 5).reverse().map((m: any) => `- ${m.user?.name || "Someone"}: ${m.content}`).join("\n") || "No recent messages"}

Generate only the chat message text, nothing else.`;

    const result = await createChatCompletion({
      messages: [
        {
          role: "system",
          content: bot.character.systemPrompt,
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
        error: "Failed to generate chat message",
      };
    }

    const messageContent = result.content.trim();

    // Create chat message
    const message = await db.chatMessage.create({
      data: {
        groupId,
        userId,
        type: "text",
        content: messageContent,
      },
    });

    return {
      success: true,
      activityId: message.id,
    };
  } catch (error: any) {
    console.error(`[BOT_CHAT_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create chat message",
    };
  }
}

