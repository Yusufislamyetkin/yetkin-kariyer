import { createChatCompletion } from "./client";
import { db } from "@/lib/db";
import { z } from "zod";

const CharacterTraitsSchema = z.object({
  personality: z.string(),
  communicationStyle: z.string(),
  interests: z.array(z.string()),
  expertise: z.array(z.string()),
  technicalLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  socialBehavior: z.string(),
});

const CharacterGenerationSchema = z.object({
  name: z.string(),
  persona: z.string(),
  systemPrompt: z.string(),
  traits: CharacterTraitsSchema,
  expertise: z.array(z.string()),
});

export type CharacterTraits = z.infer<typeof CharacterTraitsSchema>;
export type CharacterGeneration = z.infer<typeof CharacterGenerationSchema>;

/**
 * Generates a bot character based on user profile information
 */
export async function generateBotCharacter(userId: string): Promise<CharacterGeneration> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  // Get user's recent activities to understand their profile
  const [recentPosts, recentTestAttempts, recentLiveCoding] = await Promise.all([
    db.post.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { content: true },
    }),
    db.testAttempt.many({
      where: { userId },
      take: 5,
      orderBy: { completedAt: "desc" },
      select: { metrics: true },
    }),
    db.liveCodingAttempt.findMany({
      where: { userId },
      take: 5,
      orderBy: { completedAt: "desc" },
      select: { code: true, metrics: true },
    }),
  ]);

  const userContext = `
User Profile:
- Name: ${user.name || "Unknown"}
- Email: ${user.email}
- Role: ${user.role}
- Recent Posts: ${recentPosts.length > 0 ? recentPosts.map((p: any) => p.content).join(", ") : "None"}
- Test Attempts: ${recentTestAttempts.length}
- Live Coding Attempts: ${recentLiveCoding.length}
`;

  const prompt = `You are creating a realistic AI bot character for a developer learning platform. 

${userContext}

Generate a unique, believable character persona for this user. The character should:
1. Have a distinct personality (friendly developer, enthusiastic learner, helpful mentor, etc.)
2. Have specific technical interests and expertise areas
3. Have a communication style that feels authentic
4. Be appropriate for a Turkish developer community

Return a JSON object with:
- name: A creative character name (based on real name but can be modified)
- persona: A detailed 2-3 sentence description of the character's personality and background
- systemPrompt: A system prompt for OpenAI that defines how this character should behave in conversations
- traits: An object with personality, communicationStyle, interests (array), expertise (array), technicalLevel (beginner/intermediate/advanced/expert), socialBehavior
- expertise: Array of technical topics this character is interested in (e.g., ["React", "Node.js", "TypeScript"])

Make it authentic and varied - each character should feel unique.`;

  const result = await createChatCompletion<CharacterGeneration>({
    messages: [
      {
        role: "system",
        content: "You are an expert at creating believable AI character personas for developer communities. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    schema: CharacterGenerationSchema,
    temperature: 0.9, // Higher temperature for more creative characters
  });

  if (!result.parsed) {
    throw new Error("Failed to generate character - invalid response format");
  }

  return result.parsed;
}

/**
 * Creates or updates a bot character in the database
 */
export async function createOrUpdateBotCharacter(
  userId: string,
  character: CharacterGeneration
): Promise<void> {
  await db.botCharacter.upsert({
    where: { userId },
    create: {
      userId,
      name: character.name,
      persona: character.persona,
      systemPrompt: character.systemPrompt,
      traits: character.traits as any,
      expertise: character.expertise,
    },
    update: {
      name: character.name,
      persona: character.persona,
      systemPrompt: character.systemPrompt,
      traits: character.traits as any,
      expertise: character.expertise,
      updatedAt: new Date(),
    },
  });
}

/**
 * Gets the system prompt for a bot user
 */
export async function getBotSystemPrompt(userId: string): Promise<string | null> {
  const character = await db.botCharacter.findUnique({
    where: { userId },
    select: { systemPrompt: true },
  });

  return character?.systemPrompt || null;
}

