import { db } from "@/lib/db";

export interface UserContext {
  userId: string;
  testPerformance: {
    totalTests: number;
    averageScore: number;
    recentScores: number[];
    weakTopics: Array<{ topic: string; count: number; avgScore: number }>;
  };
  wrongQuestions: Array<{
    questionText: string;
    correctAnswer: string;
    userAnswer: string;
    topic?: string;
    createdAt: Date;
  }>;
  learningHistory: {
    completedLessons: number;
    recentLessons: Array<{ title: string; completedAt: Date | null }>;
    miniTestScores: number[];
  };
  learningStyle: {
    preferredPace: "slow" | "medium" | "fast";
    needsRepetition: boolean;
    strugglesWith: string[];
  };
}

/**
 * Kullanıcının test performansını analiz et
 */
async function analyzeTestPerformance(userId: string) {
  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        include: {
          course: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
    take: 20,
  });

  const testAttempts = await db.testAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  const allAttempts = [
    ...quizAttempts.map((a) => ({
      score: a.score,
      topic: a.topic || a.quiz.course?.topicContent || "Genel",
      completedAt: a.completedAt,
    })),
    ...testAttempts.map((a) => {
      const metrics = a.metrics as any;
      return {
        score: metrics?.score || 0,
        topic: metrics?.topic || "Genel",
        completedAt: a.completedAt,
      };
    }),
  ];

  // Zayıf konuları tespit et
  const topicScores = new Map<
    string,
    { total: number; count: number; scores: number[] }
  >();

  allAttempts.forEach((attempt) => {
    const existing = topicScores.get(attempt.topic) || {
      total: 0,
      count: 0,
      scores: [],
    };
    existing.total += attempt.score;
    existing.count += 1;
    existing.scores.push(attempt.score);
    topicScores.set(attempt.topic, existing);
  });

  const weakTopics = Array.from(topicScores.entries())
    .map(([topic, data]) => ({
      topic,
      count: data.count,
      avgScore: Math.round(data.total / data.count),
    }))
    .filter((t) => t.avgScore < 70)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 5);

  const recentScores = allAttempts
    .slice(0, 10)
    .map((a) => a.score)
    .reverse();

  const averageScore =
    allAttempts.length > 0
      ? Math.round(
          allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length
        )
      : 0;

  return {
    totalTests: allAttempts.length,
    averageScore,
    recentScores,
    weakTopics,
  };
}

/**
 * Kullanıcının yanlış sorularını analiz et
 */
async function analyzeWrongQuestions(userId: string) {
  const wrongQuestions = await db.wrongQuestion.findMany({
    where: {
      userId,
      status: "not_reviewed",
    },
    include: {
      quizAttempt: {
        select: {
          topic: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return wrongQuestions.map((wq) => ({
    questionText: wq.questionText,
    correctAnswer: wq.correctAnswer,
    userAnswer: wq.userAnswer,
    topic: wq.quizAttempt?.topic || undefined,
    createdAt: wq.createdAt,
  }));
}

/**
 * Kullanıcının öğrenme geçmişini analiz et
 */
async function analyzeLearningHistory(userId: string) {
  const completions = await db.lessonCompletion.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  const miniTestAttempts = await db.lessonMiniTestAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    completedLessons: completions.length,
    recentLessons: completions.slice(0, 5).map((c) => ({
      title: c.course?.title || "Ders",
      completedAt: c.completedAt,
    })),
    miniTestScores: miniTestAttempts.map((a) => a.score),
  };
}

/**
 * Öğrenme stilini analiz et
 */
function analyzeLearningStyle(
  testPerformance: Awaited<ReturnType<typeof analyzeTestPerformance>>,
  learningHistory: Awaited<ReturnType<typeof analyzeLearningHistory>>
) {
  const recentScores = testPerformance.recentScores;
  const needsRepetition = recentScores.length > 0 && recentScores[0] < 60;

  // Hız analizi (son testlerin sürelerine göre - şimdilik varsayılan)
  const preferredPace: "slow" | "medium" | "fast" = "medium";

  const strugglesWith = testPerformance.weakTopics
    .slice(0, 3)
    .map((t) => t.topic);

  return {
    preferredPace,
    needsRepetition,
    strugglesWith,
  };
}

/**
 * Kullanıcı bağlamını topla ve analiz et
 */
export async function getUserContext(userId: string): Promise<UserContext> {
  const [testPerformance, wrongQuestions, learningHistory] = await Promise.all([
    analyzeTestPerformance(userId),
    analyzeWrongQuestions(userId),
    analyzeLearningHistory(userId),
  ]);

  const learningStyle = analyzeLearningStyle(testPerformance, learningHistory);

  return {
    userId,
    testPerformance,
    wrongQuestions,
    learningHistory,
    learningStyle,
  };
}

/**
 * Kullanıcı bağlamını öğretmen AI için formatla
 */
export function formatUserContextForPrompt(context: UserContext): string {
  const parts: string[] = [];

  parts.push("=== KULLANICI PROFİLİ ===");
  parts.push(`\nToplam Test Sayısı: ${context.testPerformance.totalTests}`);
  parts.push(
    `Ortalama Puan: ${context.testPerformance.averageScore}%`
  );

  if (context.testPerformance.weakTopics.length > 0) {
    parts.push("\nZayıf Konular:");
    context.testPerformance.weakTopics.forEach((topic) => {
      parts.push(
        `- ${topic.topic}: ${topic.count} test, ortalama ${topic.avgScore}%`
      );
    });
  }

  if (context.wrongQuestions.length > 0) {
    parts.push(`\nGözden Geçirilmemiş Yanlış Sorular: ${context.wrongQuestions.length} adet`);
    if (context.wrongQuestions.length <= 5) {
      parts.push("\nYanlış Sorular Özeti:");
      context.wrongQuestions.forEach((wq, idx) => {
        parts.push(
          `${idx + 1}. Soru: ${wq.questionText.substring(0, 100)}...`
        );
        parts.push(`   Doğru Cevap: ${wq.correctAnswer}`);
        parts.push(`   Kullanıcı Cevabı: ${wq.userAnswer}`);
      });
    }
  }

  parts.push(
    `\nTamamlanan Dersler: ${context.learningHistory.completedLessons}`
  );

  if (context.learningHistory.miniTestScores.length > 0) {
    const avgMiniTest =
      context.learningHistory.miniTestScores.reduce((a, b) => a + b, 0) /
      context.learningHistory.miniTestScores.length;
    parts.push(
      `Mini Test Ortalaması: ${Math.round(avgMiniTest)}%`
    );
  }

  parts.push("\nÖğrenme Stili:");
  parts.push(`- Tercih Edilen Hız: ${context.learningStyle.preferredPace}`);
  parts.push(
    `- Tekrar Gereksinimi: ${context.learningStyle.needsRepetition ? "Evet" : "Hayır"}`
  );
  if (context.learningStyle.strugglesWith.length > 0) {
    parts.push(
      `- Zorlandığı Konular: ${context.learningStyle.strugglesWith.join(", ")}`
    );
  }

  return parts.join("\n");
}

