import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createChatCompletion, isAIEnabled } from "@/lib/ai/client";
import { generatePersonalizedLessons } from "@/lib/ai/lessons";

const TutorMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const TutorRequestSchema = z.object({
  messages: z.array(TutorMessageSchema).optional(),
  topic: z.string().optional(),
});

const buildTutorSystemPrompt = (lessons: {
  recommendedCourses?: string[];
  learningPath?: string[];
  message?: string;
}, topic?: string) => {
  const recommendedCourses = lessons.recommendedCourses ?? [];
  const learningPath = lessons.learningPath ?? [];

  return `
Sen Yetkin Hub platformunda kişisel öğrenme mentorusun. Kullanıcının test performansı ve yanlış soruları üzerinden yönlendirme yaparsın.

Kurallar:
- Empatik, motive edici ve eyleme dönük cevaplar ver.
- Yanıtlarda en fazla üç somut öneri kullan.
- Kullanıcıyı tekrar test çözmeye, not çıkarmaya ve kaynaklara yönlendirmeye çalış.
- Gerekirse basit örnek sorular sun, ancak tam çözümleri vermek yerine kullanıcıyı düşünmeye teşvik et.

Kullanıcı hakkında bildiklerin:
- Öncelikli mesaj: ${lessons.message ?? "Henüz kişiselleştirilmiş mesaj oluşturulmadı."}
- Önerilen kurslar: ${recommendedCourses.length > 0 ? recommendedCourses.join(", ") : "Henüz öneri yok"}
- Öğrenme adımları: ${learningPath.length > 0 ? learningPath.join(" -> ") : "Henüz öğrenme adımı yok"}
- Odak konusu: ${topic ?? "Genel beceri gelişimi"}
`;
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAIEnabled()) {
      return NextResponse.json(
        { error: "AI servisi şu anda mevcut değil" },
        { status: 503 }
      );
    }

    const json = await request.json().catch(() => ({}));
    const { messages, topic } = TutorRequestSchema.parse(json);

    const lessons = await generatePersonalizedLessons(session.user.id as string);

    const conversation = [
      {
        role: "system" as const,
        content: buildTutorSystemPrompt(lessons, topic),
      },
      ...(messages ?? []),
    ];

    if (!messages || messages.length === 0) {
      conversation.push({
        role: "user",
        content:
          "Merhaba! Test performansım hakkında bana kısa bir değerlendirme ve nasıl çalışmam gerektiği konusunda öneriler sunar mısın?",
      });
    }

    const completion = await createChatCompletion({
      messages: conversation,
    });

    if (!completion.content) {
      throw new Error("AI yanıtı alınamadı");
    }

    return NextResponse.json({
      reply: completion.content,
      lessons,
    });
  } catch (error) {
    console.error("Error in AI tutor:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz istek verisi", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "AI mentoru şu anda yanıt veremiyor" },
      { status: 500 }
    );
  }
}


