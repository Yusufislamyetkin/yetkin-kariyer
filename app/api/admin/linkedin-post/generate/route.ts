import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateLinkedInPost } from "@/lib/bot/ai-service";
import { createLinkedInPost } from "@/lib/bot/bot-activity-service";
import { z } from "zod";

const generateLinkedInPostSchema = z.object({
  topic: z.string().min(1).max(200),
  postType: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
    z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10)
  ]),
  botId: z.string().optional(),
  saveAsPost: z.boolean().optional().default(false),
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
    const data = generateLinkedInPostSchema.parse(body);

    // Get bot character if botId is provided
    let botCharacter = null;
    if (data.botId) {
      const bot = await db.user.findUnique({
        where: { id: data.botId },
        include: {
          botCharacter: true,
        },
      });

      if (!bot || !bot.isBot || !bot.botCharacter) {
        return NextResponse.json(
          { error: "Bot not found or bot character not configured" },
          { status: 404 }
        );
      }

      botCharacter = {
        name: bot.botCharacter.name,
        persona: bot.botCharacter.persona,
        systemPrompt: bot.botCharacter.systemPrompt,
        expertise: bot.botCharacter.expertise || [],
      };
    } else {
      // Default bot character for manual generation
      botCharacter = {
        name: "Teknoloji Lideri",
        persona: "LinkedIn üzerinde geniş bir takipçi kitlesine sahip, hem teknik derinliği olan hem de hikaye anlatıcılığı güçlü bir Teknoloji Lideri ve İçerik Üreticisi",
        systemPrompt: "Sen, LinkedIn üzerinde geniş bir takipçi kitlesine sahip, hem teknik derinliği olan hem de hikaye anlatıcılığı (storytelling) güçlü bir Teknoloji Lideri ve İçerik Üreticisisin.",
        expertise: [],
      };
    }

    // Generate LinkedIn post
    const postContent = await generateLinkedInPost(
      botCharacter,
      data.topic,
      data.postType
    );

    // If saveAsPost is true, create the post in the database
    let postId = null;
    if (data.saveAsPost && data.botId) {
      const result = await createLinkedInPost(
        data.botId,
        (topic: string, postType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => generateLinkedInPost(botCharacter, topic, postType),
        data.topic,
        data.postType,
        botCharacter.expertise
      );

      if (result.success && result.postId) {
        postId = result.postId;
      }
    }

    return NextResponse.json({
      success: true,
      content: postContent,
      postId,
      botCharacter: {
        name: botCharacter.name,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_LINKEDIN_POST_GENERATE]", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "LinkedIn post oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

