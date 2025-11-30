export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { auth } from "@/lib/auth";
import { AI_IS_ENABLED } from "@/lib/ai/config";
import { getOrCreateAssistant } from "@/lib/ai/assistant-manager";
import { sendMessageToAssistant } from "@/lib/ai/assistant-client";
import { getUserContext } from "@/lib/ai/user-context";
import { cache } from "@/lib/ai/cache";
import {
  buildTeacherSystemPrompt,
  buildContextMessage,
} from "@/lib/ai/teacher-prompt-builder";

const SmartTeacherRequestSchema = z.object({
  message: z.string().min(1),
  topic: z.string().optional(),
  currentQuestionId: z.string().optional(),
  currentQuestion: z.object({
    questionText: z.string(),
    correctAnswer: z.string(),
    userAnswer: z.string(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AI_IS_ENABLED) {
      return NextResponse.json(
        { error: "AI servisi şu anda mevcut değil" },
        { status: 503 }
      );
    }

    const json = await request.json().catch(() => ({}));
    const { message, topic, currentQuestionId, currentQuestion } = SmartTeacherRequestSchema.parse(json);

    const userId = session.user.id as string;

    // Kullanıcı bağlamını topla (cache'den alınır)
    const userContext = await getUserContext(userId);

    // System prompt oluştur ve cache'le
    // System prompt user context'e bağlı olduğu için hash ile cache'liyoruz
    const systemPromptHash = createHash('md5')
      .update(JSON.stringify({
        userId,
        totalTests: userContext.testPerformance.totalTests,
        averageScore: userContext.testPerformance.averageScore,
        weakTopics: userContext.testPerformance.weakTopics,
        wrongQuestionsCount: userContext.wrongQuestionsCount,
      }))
      .digest('hex');
    
    const systemPromptCacheKey = `system-prompt:${systemPromptHash}`;
    let systemPrompt = cache.get<string>(systemPromptCacheKey);
    
    if (!systemPrompt) {
      systemPrompt = buildTeacherSystemPrompt(userContext);
      // System prompt'u 5 dakika cache'le (user context değişmediği sürece aynı kalır)
      cache.set(systemPromptCacheKey, systemPrompt, 5 * 60 * 1000);
    }

    // Assistant'ı al veya oluştur
    const assistantId = await getOrCreateAssistant(systemPrompt);

    // Context mesajı oluştur (aktif soru varsa ekle)
    const contextInfo = buildContextMessage(
      userContext,
      currentQuestion || undefined
    );

    // Assistant'a mesaj gönder
    const response = await sendMessageToAssistant(
      userId,
      message,
      assistantId,
      contextInfo
    );

    return NextResponse.json({
      reply: response.content,
      threadId: response.threadId,
      context: {
        weakTopics: userContext.testPerformance.weakTopics,
        wrongQuestionsCount: userContext.wrongQuestionsCount,
        learningProgress: {
          completedLessons: userContext.learningHistory.completedLessons,
          averageScore: userContext.testPerformance.averageScore,
        },
      },
    });
  } catch (error) {
    console.error("Error in smart teacher:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz istek verisi", details: error.flatten() },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen hata";

    return NextResponse.json(
      { error: `AI öğretmen şu anda yanıt veremiyor: ${errorMessage}` },
      { status: 500 }
    );
  }
}

