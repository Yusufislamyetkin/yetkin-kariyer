import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createCharacterSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  persona: z.string().min(1),
  systemPrompt: z.string().min(1),
  traits: z.any().optional(),
  expertise: z.array(z.string()).optional(),
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

    // Check if user exists and is a bot
    const user = await db.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    if (!user.isBot) {
      return NextResponse.json(
        { error: "Bu kullanıcı bot değil" },
        { status: 400 }
      );
    }

    // Update or create bot character
    const botCharacter = await db.botCharacter.upsert({
      where: { userId: data.userId },
      update: {
        name: data.name,
        persona: data.persona,
        systemPrompt: data.systemPrompt,
        traits: data.traits || {},
        expertise: data.expertise || [],
      },
      create: {
        userId: data.userId,
        name: data.name,
        persona: data.persona,
        systemPrompt: data.systemPrompt,
        traits: data.traits || {},
        expertise: data.expertise || [],
      },
    });

    return NextResponse.json({
      success: true,
      botCharacter,
    });
  } catch (error: any) {
    console.error("[BOT_CREATE_CHARACTER]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Bot karakteri oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
