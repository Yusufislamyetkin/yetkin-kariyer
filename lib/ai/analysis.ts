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
  summary: z.string().min(10),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  focusAreas: z.array(focusAreaSchema).default([]),
  nextSteps: z.array(z.string()).default([]),
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().default(""),
  detailedReport: z.string().default(""),
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

  const hasWrongAnswers = wrongCount > 0;
  const wrongAnswersSection = hasWrongAnswers
    ? `\n\nYANLIŞ CEVAPLARIN DETAYLI ANALİZİ:\n${wrongQuestionDetails}\n\nBu yanlış cevapları analiz et ve şunları belirle:
- Hangi konularda/kavramlarda tutarlı olarak hata yapıldı?
- Yanlış cevapların ortak özellikleri nelerdir?
- Kullanıcının hangi bilgi boşlukları var?
- Her yanlış cevap için neden yanlış olduğunu açıkla`
    : "";

  return `
Bir quiz analizi yap ve kapsamlı, detaylı bir JSON formatında sonuç döndür. Kullanıcıya yanlış yaptığı sorular hakkında spesifik geri bildirim ve çalışma önerileri sun.

QUIZ BİLGİLERİ:
- Quiz: ${quizTitle}${courseTitle ? `\n- Kurs: ${courseTitle}` : ""}${quizTopic ? `\n- Konu: ${quizTopic}` : ""}${quizLevel ? `\n- Seviye: ${quizLevel}` : ""}
- Skor: ${score}%
- Genel doğruluk: %${accuracy}
- Toplam soru: ${totalQuestions}
- Doğru: ${correctCount}
- Yanlış: ${wrongCount}${durationSeconds ? `\n- Süre: ${Math.round(durationSeconds / 60)} dakika` : ""}${averageTimePerQuestionSeconds ? `\n- Soru başına ortalama süre: ${averageTimePerQuestionSeconds} saniye` : ""}

KONU BAZLI PERFORMANS:
${formattedTopicBreakdown || "Konu bazlı veri bulunamadı"}

${hardestTopicsText !== "Belirgin bir zayıf konu yok" ? `EN ÇOK ZORLANILAN KONULAR:\n${hardestTopicsText}\n` : ""}
${standoutTopicsText !== "Öne çıkan güçlü konu bulunmuyor" ? `EN GÜÇLÜ KONULAR:\n${standoutTopicsText}\n` : ""}${wrongAnswersSection}

Aşağıdaki JSON formatında kapsamlı bir analiz döndür. TÜM alanları doldur:

{
  "summary": "Performansın detaylı özeti (3-5 cümle). Skor, genel performans, güçlü ve zayıf yönlerin özeti, ve genel değerlendirme içermeli.",
  "strengths": ["Kullanıcının güçlü olduğu alanlar (en az 2-3 madde). Hangi konularda başarılı oldu, hangi soruları doğru yaptı, hangi becerileri iyi kullandı."],
  "weaknesses": ["Kullanıcının zayıf olduğu alanlar (en az 2-3 madde). Hangi konularda zorlandı, hangi kavramları anlamadı, hangi hataları yaptı. Yanlış cevaplara dayalı spesifik bilgi boşlukları belirt."],
  "recommendations": ["Yanlış cevaplara dayalı spesifik çalışma önerileri (en az 3-5 madde). Hangi konuları tekrar etmeli, hangi kaynaklara bakmalı, nasıl pratik yapmalı. Her öneri yanlış yapılan sorularla ilişkili olmalı."],
  "focusAreas": [
    {
      "topic": "En çok zorlanılan konu adı",
      "accuracy": 0-100 arası doğruluk yüzdesi,
      "impact": "critical" | "major" | "moderate" | "minor",
      "description": "Bu konuda neden zorlandığının açıklaması ve neden önemli olduğu",
      "actions": ["Bu konu için spesifik çalışma adımları (en az 2-3 madde)"]
    }
  ],
  "nextSteps": ["Kullanıcının sonraki adımları için aksiyon planı (en az 3-4 madde). Hangi konuları önce çalışmalı, nasıl ilerlemeli, hangi kaynakları kullanmalı."],
  "score": ${score},
  "feedback": "Yanlış cevaplar hakkında detaylı geri bildirim. Kullanıcının yanlış yaptığı soruları analiz et, neden yanlış olduğunu açıkla, doğru cevabın neden doğru olduğunu belirt. En az 4-5 cümle.",
  "detailedReport": "Kapsamlı performans raporu. Tüm yanlış cevapların analizi, konu bazlı değerlendirme, iyileştirme önerileri, ve gelecek için strateji. En az 6-8 cümle."
}

ÖNEMLİ TALİMATLAR:
1. TÜM alanları doldur - hiçbir alanı boş bırakma
2. Yanlış cevapları detaylı analiz et ve spesifik geri bildirim ver
3. Her öneri ve öneri, yanlış yapılan sorulara dayalı olmalı
4. FocusAreas içinde en az 1-3 konu olmalı (yanlış cevap verilen konulara öncelik ver)
5. Öneriler ve nextSteps pratik ve uygulanabilir olmalı
6. Feedback ve detailedReport kısa değil, detaylı ve açıklayıcı olmalı

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

    // Group wrong answers by topic for better analysis
    const wrongAnswersByTopic = new Map<string, number[]>();
    wrongAnswers.forEach((idx) => {
      const topic = questions[idx]?.topic || "Genel";
      if (!wrongAnswersByTopic.has(topic)) {
        wrongAnswersByTopic.set(topic, []);
      }
      wrongAnswersByTopic.get(topic)!.push(idx);
    });

    // Build detailed wrong answer information (include all wrong answers)
    const wrongQuestionDetails = Array.from(wrongAnswersByTopic.entries())
      .map(([topic, indices]) => {
        const topicQuestions = indices.map((idx) => {
          const question = questions[idx];
          const userAnswerIndex = answers[idx];
          const correctOption =
            question?.options?.[question?.correctAnswer] ?? "Bilgi yok";
          const userOption =
            typeof userAnswerIndex === "number" && question?.options?.[userAnswerIndex] !== undefined
              ? question.options[userAnswerIndex]
              : "Boş bırakıldı";
          const trimmedQuestion =
            question?.question?.length > 200
              ? `${question.question.slice(0, 200)}...`
              : question.question;
          return {
            questionNumber: idx + 1,
            question: trimmedQuestion,
            correctAnswer: correctOption,
            userAnswer: userOption,
            difficulty: question.difficulty ?? "Belirtilmedi",
          };
        });

        return `\n=== ${topic} (${indices.length} yanlış soru) ===\n${topicQuestions
          .map(
            (q) =>
              `Soru ${q.questionNumber}: ${q.question}\n  Doğru cevap: ${q.correctAnswer}\n  Verdiğin cevap: ${q.userAnswer}\n  Zorluk: ${q.difficulty}`
          )
          .join("\n\n")}`;
      })
      .join("\n\n");

    const { parsed } = await createChatCompletion({
      schema: quizAnalysisSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen bir eğitim analiz uzmanısın. Kullanıcıların test sonuçlarını detaylı analiz edip yapıcı, spesifik ve uygulanabilir geri bildirim veriyorsun. Yanlış cevapları analiz ederek kullanıcının bilgi boşluklarını belirliyor, hangi konularda çalışması gerektiğini spesifik olarak öneriyorsun. Her öneri yanlış yapılan sorulara dayalı olmalı ve kullanıcıya net bir çalışma yolu göstermelidir.",
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

