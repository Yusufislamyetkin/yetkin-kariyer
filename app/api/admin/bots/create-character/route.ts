import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateBotCharacter, createOrUpdateBotCharacter } from "@/lib/ai/bot-character-generator";
import { z } from "zod";

const createCharacterSchema = z.object({
  userId: z.string(),
  autoGenerate: z.boolean().optional().default(true),
  // Optional manual character data
  character: z.object({
    name: z.string().optional(),
    persona: z.string().optional(),
    systemPrompt: z.string().optional(),
    traits: z.any().optional(),
    expertise: z.array(z.string()).optional(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createCharacterSchema.parse(body);

    // If autoGenerate is true, generate character using AI
    if (data.autoGenerate) {
      const character = await generateBotCharacter(data.userId);
      await createOrUpdateBotCharacter(data.userId, character);

      return NextResponse.json({
        success: true,
        character,
        message: "Bot karakteri başarıyla oluşturuldu",
      });
    }

    // Manual character creation
    if (!data.character) {
      return NextResponse.json(
        { error: "Manuel karakter oluşturma için character verisi gereklidir" },
        { status: 400 }
      );
    }

    const { character } = data;

    if (!character.name || !character.persona || !character.systemPrompt) {
      return NextResponse.json(
        { error: "Manuel karakter için name, persona ve systemPrompt gereklidir" },
        { status: 400 }
      );
    }

    await createOrUpdateBotCharacter(data.userId, {
      name: character.name,
      persona: character.persona,
      systemPrompt: character.systemPrompt,
      traits: character.traits || {
        personality: character.persona,
        communicationStyle: "friendly",
        interests: character.expertise || [],
        expertise: character.expertise || [],
        technicalLevel: "intermediate",
        socialBehavior: "active",
      },
      expertise: character.expertise || [],
    });

    return NextResponse.json({
      success: true,
      message: "Bot karakteri başarıyla oluşturuldu",
    });
  } catch (error: any) {
    console.error("[BOT_CHARACTER_CREATE]", error);
    return NextResponse.json(
      { error: error.message || "Bot karakteri oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

