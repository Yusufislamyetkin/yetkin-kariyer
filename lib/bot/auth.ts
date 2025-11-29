import { db } from "@/lib/db";
import { getBotSystemPrompt } from "@/lib/ai/bot-character-generator";

/**
 * Creates a session-like object for bot users
 * This allows bots to make authenticated API calls
 */
export async function createBotSession(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
      isBot: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBot: true,
    },
  });

  if (!user || !user.isBot) {
    throw new Error("User is not a bot");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isBot: user.isBot,
    },
  };
}

/**
 * Gets bot system prompt for OpenAI interactions
 */
export async function getBotSystemPromptForAuth(userId: string): Promise<string> {
  const prompt = await getBotSystemPrompt(userId);
  
  if (!prompt) {
    // Fallback to default prompt
    return "You are a helpful developer community member. Be friendly, constructive, and authentic in your interactions.";
  }

  return prompt;
}

