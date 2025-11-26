import { z } from "zod";
import { createChatCompletion } from "./client";

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 arası index
}

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().int().min(0).max(3),
});

// Hem direkt array hem de { questions: [...] } formatını kabul et
const QuestionsArraySchema = z.union([
  z.array(QuestionSchema).length(10),
  z.object({
    questions: z.array(QuestionSchema).length(10),
  }),
]);

/**
 * Test başlığına göre OpenAI ile 10 soruluk test üretir
 */
export async function generateTestQuestions(
  testTitle: string,
  testDescription: string | null,
  technology: string,
  moduleTitle: string
): Promise<TestQuestion[]> {
  const systemPrompt = `Yazılım test soruları üreticisi. Verilen bilgilere göre 10 çoktan seçmeli soru üret. Her soru: 4 şık, 0-3 index ile doğru cevap, Türkçe, teknik ve pratik.`;

  const userPrompt = `Başlık: ${testTitle}
${testDescription ? `Açıklama: ${testDescription}` : ""}
Teknoloji: ${technology}
Modül: ${moduleTitle}

10 soru üret. JSON array formatında: [{"id":"q-1","question":"...","options":["A","B","C","D"],"correctAnswer":0}]`;

  try {
    const result = await createChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      schema: QuestionsArraySchema,
      temperature: 0.5,
    });

    if (!result.parsed) {
      throw new Error("AI yanıtı parse edilemedi");
    }

    // Eğer { questions: [...] } formatındaysa, questions array'ini al
    if (typeof result.parsed === 'object' && result.parsed !== null && 'questions' in result.parsed) {
      return (result.parsed as { questions: TestQuestion[] }).questions;
    }

    // Direkt array ise direkt döndür
    return result.parsed as TestQuestion[];
  } catch (error) {
    console.error("[TEST_QUESTION_GENERATOR] Error generating questions:", error);
    throw new Error("Test soruları üretilirken bir hata oluştu");
  }
}

