import { z } from "zod";
import { createChatCompletion } from "./client";

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 arası index
  explanation?: string;
}

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().optional(),
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
  const systemPrompt = `Sen bir yazılım geliştirme test soruları üreticisisin. Verilen test başlığı, açıklama, teknoloji ve modül bilgilerine göre 10 adet çoktan seçmeli test sorusu üretmelisin.

Kurallar:
- Her soru için 4 şık (A, B, C, D) olmalı
- Doğru cevap 0-3 arası bir index olmalı (0=A, 1=B, 2=C, 3=D)
- Sorular test başlığı ve açıklamasına uygun olmalı
- Sorular teknoloji ve modül konusuna odaklanmalı
- Her soru için kısa bir açıklama (explanation) ekle
- Sorular Türkçe olmalı
- Sorular teknik ve pratik olmalı
- Şıklar gerçekçi ve mantıklı olmalı (sadece bir tanesi doğru olmalı)

Çıktı formatı: YALNIZCA JSON array döndür (wrapper object kullanma). Tam olarak 10 soru içeren bir array. İlk karakter [ olmalı, son karakter ] olmalı.`;

  const userPrompt = `Test Başlığı: ${testTitle}
${testDescription ? `Test Açıklaması: ${testDescription}` : ""}
Teknoloji: ${technology}
Modül: ${moduleTitle}

Bu bilgilere göre 10 adet çoktan seçmeli test sorusu üret. Her soru için:
- id: "q-1", "q-2", ... formatında
- question: Soru metni
- options: 4 şık içeren array (örnek: ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"])
- correctAnswer: 0-3 arası doğru şık index'i
- explanation: Sorunun açıklaması (opsiyonel)

ÖNEMLİ: YALNIZCA JSON array döndür. Wrapper object ({ questions: [...] }) kullanma. Direkt array olarak başla: [ ile başla, ] ile bitir. Başka hiçbir metin, açıklama veya wrapper object ekleme.`;

  try {
    const result = await createChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      schema: QuestionsArraySchema,
      temperature: 0.7,
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

