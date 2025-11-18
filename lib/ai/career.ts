import { z } from "zod";

import { createChatCompletion, isAIEnabled } from "./client";
import { db } from "@/lib/db";

const careerPlanSchema = z.object({
  goals: z.array(z.string()).default([]),
  roadmap: z
    .array(
      z.object({
        stage: z.string(),
        title: z.string(),
        tasks: z.array(z.string()).default([]),
        milestones: z.array(z.string()).default([]),
      })
    )
    .default([]),
  recommendedCourses: z.array(z.string()).default([]),
  skillsToDevelop: z.array(z.string()).default([]),
  timeline: z.string().default(""),
  summary: z.string().default(""),
});

const buildCareerPlanPrompt = ({
  cvData,
  quizScores,
  interviewScores,
  avgQuizScore,
  avgInterviewScore,
}: {
  cvData: any;
  quizScores: { course: string; score: number }[];
  interviewScores: number[];
  avgQuizScore: number;
  avgInterviewScore: number;
}) => `
Kullanıcının CV bilgileri, test sonuçları ve mülakat performansına göre kişiselleştirilmiş bir kariyer planı oluştur.

CV Bilgileri:
- İsim: ${(cvData?.personalInfo as any)?.name || "Bilinmiyor"}
- Deneyim: ${JSON.stringify(cvData.experience ?? [])}
- Eğitim: ${JSON.stringify(cvData.education ?? [])}
- Beceriler: ${(cvData.skills ?? []).join(", ")}

Test Performansı:
- Ortalama Test Skoru: ${Math.round(avgQuizScore)}%
- Test Detayları: ${JSON.stringify(quizScores)}

Mülakat Performansı:
- Ortalama Mülakat Skoru: ${Math.round(avgInterviewScore)}%
- Mülakat Detayları: ${JSON.stringify(interviewScores)}

Aşağıdaki JSON formatında kariyer planı oluştur:
{
  "goals": ["hedef 1", "hedef 2", "hedef 3"],
  "roadmap": [
    {
      "stage": "1-3 ay",
      "title": "Aşama başlığı",
      "tasks": ["görev 1", "görev 2"],
      "milestones": ["kilometre taşı 1"]
    }
  ],
  "recommendedCourses": ["kurs 1", "kurs 2"],
  "skillsToDevelop": ["beceri 1", "beceri 2"],
  "timeline": "6-12 ay",
  "summary": "Kariyer planı özeti"
}

Sadece JSON döndür, başka açıklama yapma.
`;

export async function generateCareerPlan(userId: string): Promise<any> {
  try {
    // Get user's CV, quiz attempts, and interview attempts
    const cv = await db.cV.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

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

    // Build context
    const cvData = (cv?.data as any) || {};

    const quizScores = quizAttempts.map((attempt: { quiz: { course: { title: string } }; score: number }) => ({
      course: attempt.quiz.course.title,
      score: attempt.score,
    }));

    const interviewScores = interviewAttempts
      .filter((attempt: { aiScore: number | null }) => attempt.aiScore !== null)
      .map((attempt: { aiScore: number | null }) => attempt.aiScore as number);

    const avgQuizScore =
      quizScores.length > 0
        ? quizScores.reduce((sum: number, q: { score: number }) => sum + q.score, 0) / quizScores.length
        : 0;
    const avgInterviewScore =
      interviewScores.length > 0
        ? interviewScores.reduce((sum: number, s: number) => sum + s, 0) / interviewScores.length
        : 0;

    if (!isAIEnabled()) {
      throw new Error("AI servisi devre dışı");
    }

    const { parsed: plan } = await createChatCompletion({
      schema: careerPlanSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen bir kariyer danışmanısın. Kullanıcılara kişiselleştirilmiş kariyer planları oluşturuyorsun.",
        },
        {
          role: "user",
          content: buildCareerPlanPrompt({
            cvData,
            quizScores,
            interviewScores,
            avgQuizScore,
            avgInterviewScore,
          }),
        },
      ],
    });

    if (!plan) {
      throw new Error("AI yanıtı doğrulanamadı");
    }

    const normalizedPlan = {
      goals: plan.goals ?? [],
      roadmap: plan.roadmap ?? [],
      recommendedCourses: plan.recommendedCourses ?? [],
      skillsToDevelop: plan.skillsToDevelop ?? [],
      timeline: plan.timeline ?? "",
      summary: plan.summary ?? "",
    };

    // Save to database
    const existing = await db.careerPlan.findFirst({
      where: { userId },
    });

    if (existing) {
      await db.careerPlan.update({
        where: { id: existing.id },
        data: {
          goals: normalizedPlan.goals as any,
          roadmap: normalizedPlan.roadmap as any,
          recommendedCourses: normalizedPlan.recommendedCourses as any,
          skillsToDevelop: normalizedPlan.skillsToDevelop as any,
          timeline: normalizedPlan.timeline,
          summary: normalizedPlan.summary,
          aiGenerated: true,
        },
      });
    } else {
      await db.careerPlan.create({
        data: {
          userId,
          goals: normalizedPlan.goals as any,
          roadmap: normalizedPlan.roadmap as any,
          recommendedCourses: normalizedPlan.recommendedCourses as any,
          skillsToDevelop: normalizedPlan.skillsToDevelop as any,
          timeline: normalizedPlan.timeline,
          summary: normalizedPlan.summary,
          aiGenerated: true,
        },
      });
    }

    return normalizedPlan;
  } catch (error) {
    console.error("Error generating career plan:", error);
    return {
      goals: ["Kariyer gelişiminize devam edin"],
      roadmap: [],
      recommendedCourses: [],
      skillsToDevelop: [],
      timeline: "6-12 ay",
      summary: "Kariyer planı oluşturulamadı.",
    };
  }
}

