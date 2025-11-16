import { z } from "zod";

import { createChatCompletion, isAIEnabled } from "./client";
import { db } from "@/lib/db";

const personalizedLessonsSchema = z.object({
  recommendedCourses: z.array(z.string()).default([]),
  learningPath: z.array(z.string()).default([]),
  message: z.string().default(""),
});

const buildLessonsPrompt = (weakTopics: string[]) => `
Kullanıcının zayıf olduğu konular: ${weakTopics.join(", ")}

Bu konulara göre öğrenme yolu oluştur ve önerilen kursları belirle.
JSON formatında yanıt ver:
{
  "recommendedCourses": ["kurs 1", "kurs 2"],
  "learningPath": ["adım 1", "adım 2"],
  "message": "Kişiselleştirilmiş mesaj"
}
`;

export async function generatePersonalizedLessons(userId: string): Promise<any> {
  try {
    // Get user's quiz and interview attempts
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
      take: 10,
    });

    const interviewAttempts = await db.interviewAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 5,
    });

    // Analyze weak areas
    const weakTopics: string[] = [];
    quizAttempts.forEach((attempt) => {
      if (attempt.score < 70 && attempt.aiAnalysis) {
        const analysis = attempt.aiAnalysis as any;
        if (analysis.weaknesses) {
          weakTopics.push(...analysis.weaknesses);
        }
      }
    });

    if (weakTopics.length === 0) {
      return {
        recommendedCourses: [],
        learningPath: [],
        message: "Tüm konularda iyi performans gösteriyorsunuz!",
      };
    }

    if (!isAIEnabled()) {
      throw new Error("AI servisi devre dışı");
    }

    const { parsed } = await createChatCompletion({
      schema: personalizedLessonsSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen bir eğitim danışmanısın. Kullanıcılara kişiselleştirilmiş öğrenme yolları öneriyorsun.",
        },
        {
          role: "user",
          content: buildLessonsPrompt(weakTopics),
        },
      ],
    });

    if (!parsed) {
      throw new Error("AI yanıtı doğrulanamadı");
    }

    return parsed;
  } catch (error) {
    console.error("Error generating personalized lessons:", error);
    return {
      recommendedCourses: [],
      learningPath: [],
      message: "Öneriler oluşturulamadı.",
    };
  }
}

