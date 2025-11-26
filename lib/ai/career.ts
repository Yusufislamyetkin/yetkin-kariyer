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

interface QuestionnaireData {
  specialization?: string;
  careerGoal?: string;
  timeline?: string;
  skillLevel?: string;
  technologies?: string[];
  workPreference?: string;
  industryInterests?: string[];
}

const buildCareerPlanPrompt = ({
  cvData,
  quizScores,
  interviewScores,
  avgQuizScore,
  avgInterviewScore,
  questionnaire,
}: {
  cvData: any;
  quizScores: { course: string; score: number }[];
  interviewScores: number[];
  avgQuizScore: number;
  avgInterviewScore: number;
  questionnaire?: QuestionnaireData | null;
}) => {
  // Check for uncertainty indicators
  const hasUncertainty = questionnaire && (
    questionnaire.specialization === "Henüz karar vermedim" ||
    questionnaire.careerGoal === "Henüz karar vermedim" ||
    questionnaire.timeline === "Henüz belirlemedim" ||
    !questionnaire.technologies || questionnaire.technologies.length === 0 ||
    !questionnaire.industryInterests || questionnaire.industryInterests.length === 0
  );

  const isBeginner = questionnaire?.skillLevel === "Başlangıç" || 
    (avgQuizScore < 50 && quizScores.length === 0) ||
    (cvData.skills && (cvData.skills as string[]).length === 0);

  let questionnaireSection = "";
  let guidanceInstructions = "";

  if (questionnaire) {
    const uncertaintyNotes: string[] = [];
    
    if (questionnaire.specialization === "Henüz karar vermedim") {
      uncertaintyNotes.push("Kullanıcı hangi alanda uzmanlaşmak istediğine henüz karar vermemiş.");
    }
    if (questionnaire.careerGoal === "Henüz karar vermedim") {
      uncertaintyNotes.push("Kullanıcı kariyer hedefini henüz belirlememiş.");
    }
    if (questionnaire.timeline === "Henüz belirlemedim") {
      uncertaintyNotes.push("Kullanıcı zaman çizelgesini henüz belirlememiş.");
    }
    if (!questionnaire.technologies || questionnaire.technologies.length === 0) {
      uncertaintyNotes.push("Kullanıcı teknoloji tercihi belirtmemiş.");
    }
    if (!questionnaire.industryInterests || questionnaire.industryInterests.length === 0) {
      uncertaintyNotes.push("Kullanıcı sektör tercihi belirtmemiş.");
    }

    questionnaireSection = `
Kullanıcı Tercihleri (Anket Sonuçları):
- Uzmanlaşmak İstediği Alan: ${questionnaire.specialization || "Belirtilmemiş"}
- Kariyer Hedefi: ${questionnaire.careerGoal || "Belirtilmemiş"}
- Hedef Zaman Çizelgesi: ${questionnaire.timeline || "Belirtilmemiş"}
- Mevcut Seviye: ${questionnaire.skillLevel || "Belirtilmemiş"}
- Tercih Edilen Teknolojiler: ${questionnaire.technologies?.join(", ") || "Belirtilmemiş"}
- Çalışma Tercihi: ${questionnaire.workPreference || "Belirtilmemiş"}
- İlgi Duyduğu Sektörler: ${questionnaire.industryInterests?.join(", ") || "Belirtilmemiş"}
${uncertaintyNotes.length > 0 ? `\nÖNEMLİ NOTLAR:\n${uncertaintyNotes.map(note => `- ${note}`).join("\n")}` : ""}
`;

    if (hasUncertainty) {
      guidanceInstructions = `
ÖNEMLİ: Kullanıcı henüz bazı kararlarını vermemiş. Bu durumda:
1. Genel ve kapsayıcı bir kariyer planı oluştur
2. Farklı alanları, teknolojileri ve kariyer yollarını keşfetmesine yardımcı ol
3. Her aşamada seçenekleri açıkla ve öneriler sun
4. Planı esnek ve uyarlanabilir yap
5. Kullanıcıya farklı yolları denemesi için rehberlik et
`;
    }

    if (isBeginner) {
      guidanceInstructions += `
ÖNEMLİ: Kullanıcı başlangıç seviyesinde. Bu durumda:
1. Temel kavramları ve adım adım öğrenme yolunu vurgula
2. Her aşamayı detaylı açıkla
3. Pratik projeler ve örnekler öner
4. Motivasyonu artıracak küçük başarılar planla
5. Öğrenme kaynaklarını ve toplulukları öner
6. Hata yapmanın normal olduğunu ve öğrenme sürecinin bir parçası olduğunu belirt
`;
    }
  }

  return `
Kullanıcının CV bilgileri, test sonuçları ve mülakat performansına göre kişiselleştirilmiş bir kariyer planı oluştur.

CV Bilgileri:
- İsim: ${(cvData?.personalInfo as any)?.name || "Bilinmiyor"}
- Deneyim: ${JSON.stringify(cvData.experience ?? [])}
- Eğitim: ${JSON.stringify(cvData.education ?? [])}
- Beceriler: ${(cvData.skills ?? []).join(", ") || "Henüz belirtilmemiş"}

Test Performansı:
- Ortalama Test Skoru: ${Math.round(avgQuizScore)}%
- Test Detayları: ${JSON.stringify(quizScores)}
${quizScores.length === 0 ? "- Kullanıcı henüz test çözmemiş" : ""}

Mülakat Performansı:
- Ortalama Mülakat Skoru: ${Math.round(avgInterviewScore)}%
- Mülakat Detayları: ${JSON.stringify(interviewScores)}
${interviewScores.length === 0 ? "- Kullanıcı henüz mülakat yapmamış" : ""}
${questionnaireSection}
${guidanceInstructions}
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
  "timeline": "${questionnaire?.timeline && questionnaire.timeline !== "Henüz belirlemedim" ? questionnaire.timeline : "6-12 ay"}",
  "summary": "Kariyer planı özeti - Kullanıcının durumunu, hedeflerini ve yol haritasını açıkça özetle"
}

ÖZET (summary) alanı özellikle önemli:
- Kullanıcının mevcut durumunu değerlendir
- Belirsizlik varsa, farklı seçenekleri keşfetmesine yardımcı ol
- Başlangıç seviyesindeyse, cesaretlendirici ve yol gösterici ol
- Somut adımlar ve öneriler sun
- Planın esnekliğini ve uyarlanabilirliğini vurgula

Sadece JSON döndür, başka açıklama yapma.
`;
}

export async function generateCareerPlan(userId: string, questionnaire?: QuestionnaireData | null): Promise<any> {
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

    const quizScores = quizAttempts
      .filter((attempt: { quiz: { course: { title: string } | null } | null }) => 
        attempt.quiz?.course?.title != null
      )
      .map((attempt: { quiz: { course: { title: string } }; score: number }) => ({
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
            "Sen deneyimli ve empatik bir kariyer danışmanısın. Özellikle yeni başlayanlar ve henüz karar vermemiş kişiler için yol gösterici, cesaretlendirici ve pratik kariyer planları oluşturuyorsun. Belirsizlik durumlarında genel ama değerli planlar hazırlıyorsun. Her seviyeden kullanıcıya uygun, adım adım ilerleyen, esnek ve uyarlanabilir planlar sunuyorsun.",
        },
        {
          role: "user",
          content: buildCareerPlanPrompt({
            cvData,
            quizScores,
            interviewScores,
            avgQuizScore,
            avgInterviewScore,
            questionnaire,
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
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    console.error("Error generating career plan:", {
      message: errorMessage,
      details: errorDetails,
      userId,
      hasQuestionnaire: !!questionnaire,
    });

    // Provide more helpful error messages based on error type
    let userFriendlySummary = "Kariyer planı oluşturulurken bir sorun oluştu.";
    
    if (errorMessage.includes("AI servisi devre dışı") || errorMessage.includes("AI servisi")) {
      userFriendlySummary = "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin veya sistem yöneticisiyle iletişime geçin.";
    } else if (errorMessage.includes("zaman aşımı") || errorMessage.includes("timeout")) {
      userFriendlySummary = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
    } else if (errorMessage.includes("doğrulanamadı") || errorMessage.includes("validation")) {
      userFriendlySummary = "AI yanıtı beklenen formatta değil. Lütfen tekrar deneyin.";
    } else if (errorMessage.includes("API")) {
      userFriendlySummary = "AI servisi ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.";
    }

    return {
      goals: ["Kariyer gelişiminize devam edin", "Planı daha sonra yeniden oluşturmayı deneyin"],
      roadmap: [],
      recommendedCourses: [],
      skillsToDevelop: [],
      timeline: questionnaire?.timeline && questionnaire.timeline !== "Henüz belirlemedim" 
        ? questionnaire.timeline 
        : "6-12 ay",
      summary: userFriendlySummary,
    };
  }
}

