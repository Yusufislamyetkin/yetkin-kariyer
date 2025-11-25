import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TestGenerationOptions {
  technology: string;
  module: string;
  level?: string;
  questionCount?: number;
  questionType?: "mcq" | "fill" | "open" | "mixed";
}

/**
 * AI ile test soruları oluştur
 */
export async function generateTestQuestions(
  options: TestGenerationOptions
): Promise<GeneratedQuestion[]> {
  const {
    technology,
    module,
    level = "intermediate",
    questionCount = 10,
    questionType = "mixed",
  } = options;

  try {
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }

    const topic = `${technology} - ${module}`;
    const prompt = `${topic} konusunda ${level} seviyesinde ${questionCount} adet ${questionType} tipinde çoktan seçmeli test sorusu üret. Her soru için 4 seçenek olsun ve doğru cevabın index'ini belirt. Sorular JSON formatında döndür. Format: [{"id": "q1", "question": "Soru metni", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Açıklama"}]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir yazılım test soruları oluşturma uzmanısın. Verilen konu ve seviyeye uygun, kaliteli test soruları üretiyorsun.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("AI'dan yanıt alınamadı");
    }

    const parsed = JSON.parse(responseContent);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : Array.isArray(parsed) ? parsed : [];

    // Soruları normalize et
    const normalizedQuestions: GeneratedQuestion[] = questions.map((q: any, index: number) => ({
      id: q.id || `q-${index + 1}`,
      question: q.question || q.questionText || "",
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
      explanation: q.explanation || q.answerGuide || undefined,
    }));

    return normalizedQuestions;
  } catch (error) {
    console.error("Error generating test questions:", error);
    throw new Error(`Test soruları oluşturulurken hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`);
  }
}
