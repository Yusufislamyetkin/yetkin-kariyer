import { z } from "zod";

import { createChatCompletion, isAIEnabled } from "./client";
import { AIAnalysis } from "@/types";

const focusAreaSchema = z.object({
  topic: z.string(),
  accuracy: z.coerce.number().min(0).max(100),
  impact: z.enum(["critical", "major", "moderate", "minor"]).default("moderate"),
  description: z.string(),
  actions: z.array(z.string()).default([]),
});

const quizAnalysisSchema = z.object({
  summary: z.string().min(20),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  focusAreas: z.array(focusAreaSchema).default([]),
  nextSteps: z.array(z.string()).default([]),
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().min(1),
  detailedReport: z.string().optional(),
});

const buildQuizAnalysisPrompt = (context: {
  quizTitle: string;
  courseTitle?: string | null;
  quizTopic?: string | null;
  quizLevel?: string | null;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  durationSeconds?: number | null;
  topicBreakdown: Array<{
    topic: string;
    total: number;
    correct: number;
    wrong: number;
    accuracy: number;
  }>;
  wrongTopicList: string;
  correctTopicList: string;
  hardestTopicsText: string;
  standoutTopicsText: string;
  averageTimePerQuestionSeconds?: number | null;
  wrongQuestionDetails: string;
}) => {
  const {
    quizTitle,
    courseTitle,
    quizTopic,
    quizLevel,
    score,
    accuracy,
    totalQuestions,
    averageTimePerQuestionSeconds,
    correctCount,
    wrongCount,
    durationSeconds,
    topicBreakdown,
    wrongTopicList,
    correctTopicList,
    hardestTopicsText,
    standoutTopicsText,
    wrongQuestionDetails,
  } = context;

  const formattedTopicBreakdown = topicBreakdown
    .map(
      (item) =>
        `- ${item.topic}: ${item.total} soru (${item.correct} doğru, ${item.wrong} yanlış, doğruluk %${item.accuracy})`
    )
    .join("\n");

  return `
Bir quiz analizi yap ve JSON formatında sonuç döndür.

Quiz: ${quizTitle}
Kurs: ${courseTitle ?? "Bilinmiyor"}
Ana konu: ${quizTopic ?? "Belirtilmedi"}
Seviye: ${quizLevel ?? "Belirtilmedi"}
Süre: ${
    durationSeconds ? `${Math.floor(durationSeconds / 60)} dk ${durationSeconds % 60} sn` : "Bilgi yok"
  }
Skor: ${score}%
Genel doğruluk: %${accuracy}
Soru başına ortalama süre: ${
    averageTimePerQuestionSeconds !== null && averageTimePerQuestionSeconds !== undefined
      ? `${Math.floor(averageTimePerQuestionSeconds / 60)} dk ${String(
          averageTimePerQuestionSeconds % 60
        ).padStart(2, "0")} sn`
      : "Hesaplanamadı"
  }

Soru istatistikleri:
- Doğru cevaplanan sorular: ${correctCount}/${totalQuestions}
- Yanlış cevaplanan sorular: ${wrongCount}/${totalQuestions}
- Konu dağılımı:
${formattedTopicBreakdown || "- Veri yok"}

Doğru cevaplanan konular: ${correctTopicList || "Yok"}
Yanlış cevaplanan konular: ${wrongTopicList || "Yok"}
Öne çıkan güçlü konular: ${standoutTopicsText}
En çok zorlanılan konular: ${hardestTopicsText}

Detaylı yanlış soru listesi:
${wrongQuestionDetails || "Kritik yanlış soru bulunamadı."}

Aşağıdaki JSON formatında yanıt ver:
{
  "summary": "Kullanıcının test performansını 3-4 cümlede anlatan rapor",
  "strengths": ["güçlü yön 1", "güçlü yön 2"],
  "weaknesses": ["zayıf yön 1", "zayıf yön 2"],
  "recommendations": ["öneri 1", "öneri 2"],
  "focusAreas": [
    {
      "topic": "Zorlanılan konu adı",
      "accuracy": 58,
      "impact": "critical | major | moderate | minor",
      "description": "Neden zorlanıldı, hangi soru tipleri problemli",
      "actions": ["Uygulanabilir aksiyon 1", "Uygulanabilir aksiyon 2"]
    }
  ],
  "nextSteps": [
    "1-2 haftalık somut gelişim adımları",
    "Önceliklendirilmiş çalışma planı"
  ],
  "score": ${score},
  "feedback": "Genel geri bildirim metni",
  "detailedReport": "Motivasyonu da gözeten uzun paragraflık değerlendirme"
}

Sadece JSON döndür, başka açıklama yapma.
`;
};

export interface AnalyzeQuizInput {
  quizTitle: string;
  courseTitle?: string | null;
  quizTopic?: string | null;
  quizLevel?: string | null;
  questions: any[];
  answers: number[];
  score: number;
  durationSeconds?: number | null;
}

export async function analyzeQuizResults({
  quizTitle,
  courseTitle,
  quizTopic,
  quizLevel,
  questions,
  answers,
  score,
  durationSeconds,
}: AnalyzeQuizInput): Promise<AIAnalysis> {
  try {
    if (!isAIEnabled()) {
      throw new Error("AI servisi devre dışı");
    }

    const correctAnswers: number[] = [];
    const wrongAnswers: number[] = [];

    questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers.push(index);
      } else {
        wrongAnswers.push(index);
      }
    });

    const wrongTopics = wrongAnswers
      .map((idx) => questions[idx].topic || "Genel")
      .join(", ");
    const correctTopics = correctAnswers
      .map((idx) => questions[idx].topic || "Genel")
      .join(", ");

    const topicMap = new Map<
      string,
      { total: number; correct: number; wrong: number }
    >();

    questions.forEach((question: any, index: number) => {
      const key = question.topic || "Genel";
      if (!topicMap.has(key)) {
        topicMap.set(key, { total: 0, correct: 0, wrong: 0 });
      }
      const entry = topicMap.get(key)!;
      entry.total += 1;
      if (answers[index] === question.correctAnswer) {
        entry.correct += 1;
      } else {
        entry.wrong += 1;
      }
    });

    const topicBreakdown = Array.from(topicMap.entries()).map(([topic, data]) => ({
      topic,
      total: data.total,
      correct: data.correct,
      wrong: data.wrong,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    const accuracy =
      questions.length > 0 ? Math.round((correctAnswers.length / questions.length) * 100) : 0;

    const averageTimePerQuestionSeconds =
      durationSeconds && questions.length > 0
        ? Math.round(durationSeconds / questions.length)
        : null;

    const hardestTopics = topicBreakdown
      .filter((item) => item.wrong > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    const standoutTopics = topicBreakdown
      .filter((item) => item.correct > 0 && item.accuracy >= 75)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3);

    const hardestTopicsText = hardestTopics.length
      ? hardestTopics
          .map(
            (item) =>
              `${item.topic} (doğruluk %${item.accuracy}, ${item.wrong} yanlış / ${item.total} soru)`
          )
          .join("; ")
      : "Belirgin bir zayıf konu yok";

    const standoutTopicsText = standoutTopics.length
      ? standoutTopics
          .map(
            (item) =>
              `${item.topic} (doğruluk %${item.accuracy}, ${item.correct} doğru / ${item.total} soru)`
          )
          .join("; ")
      : "Öne çıkan güçlü konu bulunmuyor";

    const wrongQuestionDetails = wrongAnswers
      .slice(0, 8)
      .map((idx) => {
        const question = questions[idx];
        const userAnswerIndex = answers[idx];
        const correctOption =
          question?.options?.[question?.correctAnswer] ?? "Bilgi yok";
        const userOption =
          typeof userAnswerIndex === "number" && question?.options?.[userAnswerIndex] !== undefined
            ? question.options[userAnswerIndex]
            : "Boş bırakıldı";
        const trimmedQuestion =
          question?.question?.length > 220
            ? `${question.question.slice(0, 220)}...`
            : question.question;
        return `Soru ${idx + 1} | Konu: ${question.topic ?? "Genel"} | Zorluk: ${
          question.difficulty ?? "Belirtilmedi"
        } | Soru: ${trimmedQuestion} | Doğru cevap: ${correctOption} | Verdiğin cevap: ${userOption}`;
      })
      .join("\n");

    const { parsed } = await createChatCompletion({
      schema: quizAnalysisSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen bir eğitim analiz uzmanısın. Kullanıcıların test sonuçlarını analiz edip yapıcı geri bildirim veriyorsun.",
        },
        {
          role: "user",
          content: buildQuizAnalysisPrompt({
            quizTitle,
            courseTitle,
            quizTopic,
            quizLevel,
            score,
            accuracy,
            totalQuestions: questions.length,
            correctCount: correctAnswers.length,
            wrongCount: wrongAnswers.length,
            durationSeconds,
            topicBreakdown,
            correctTopicList: correctTopics,
            wrongTopicList: wrongTopics,
            hardestTopicsText,
            standoutTopicsText,
            averageTimePerQuestionSeconds,
            wrongQuestionDetails,
          }),
        },
      ],
    });

    if (!parsed) {
      throw new Error("AI yanıtı doğrulanamadı");
    }

    return parsed as AIAnalysis;
  } catch (error) {
    console.error("Error analyzing quiz results:", error);
    // Fallback analysis
    return {
      summary: "Quiz analizi şu anda hazır değil, ancak genel performans değerlendirmesi aşağıdadır.",
      strengths: ["Testi tamamladınız"],
      weaknesses: ["Analiz yapılamadı"],
      recommendations: ["Daha fazla pratik yapın"],
      focusAreas: [],
      nextSteps: [],
      score,
      feedback: "AI analizi şu anda mevcut değil.",
      detailedReport:
        "Sistemden kaynaklanan bir hata nedeniyle kişiselleştirilmiş analiz üretilemedi. Lütfen kısa bir süre sonra tekrar deneyin.",
    };
  }
}

