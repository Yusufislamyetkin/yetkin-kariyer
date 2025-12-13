import { z } from "zod";

import { createChatCompletion, isAIEnabled } from "./client";
import { db } from "@/lib/db";

const careerPlanSchema = z.object({
  goals: z.array(z.string()).default([]),
  roadmap: z
    .array(
      z.object({
        stage: z.string(), // "Aşama 1"
        title: z.string(), // "Frontend Temelleri"
        description: z.string().optional(), // Aşama açıklaması
        estimatedDuration: z.string().optional(), // "2-3 ay"
        priority: z.enum(["Yüksek", "Orta", "Düşük"]).optional(),
        learningObjectives: z.array(z.string()).optional(), // Öğrenme hedefleri
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string().optional(),
          estimatedTime: z.string().optional(),
          order: z.number(),
        })).default([]),
        practicalProjects: z.array(z.object({
          name: z.string(),
          description: z.string().optional(),
          difficulty: z.enum(["Başlangıç", "Orta", "İleri"]).optional(),
          estimatedTime: z.string().optional(),
        })).optional(),
        milestones: z.array(z.object({
          title: z.string(),
          criteria: z.array(z.string()),
        })).default([]),
        importantPoints: z.array(z.string()).optional(),
        developmentTopics: z.array(z.string()).optional(), // Geriye dönük uyumluluk için
        recommendedResources: z.array(z.object({
          title: z.string(),
          type: z.string().optional(),
          description: z.string().optional(),
          link: z.string().optional(),
        })).optional(),
      })
    )
    .default([]),
  recommendedCourses: z.array(z.string()).default([]),
  recommendedResources: z.array(z.object({
    title: z.string(),
    type: z.string().optional(),
    description: z.string().optional(),
    link: z.string().optional(),
  })).optional(),
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
}

const buildCareerPlanPrompt = ({
  cvData,
  quizScores,
  interviewScores,
  avgQuizScore,
  avgInterviewScore,
  questionnaire,
  availableResources,
}: {
  cvData: any;
  quizScores: { course: string; score: number }[];
  interviewScores: number[];
  avgQuizScore: number;
  avgInterviewScore: number;
  questionnaire?: QuestionnaireData | null;
  availableResources?: Array<{ id: string; title: string; category?: string; topic?: string; difficulty?: string }>;
}) => {
  // Check for uncertainty indicators
  const hasUncertainty = questionnaire && (
    questionnaire.specialization === "Henüz karar vermedim" ||
    questionnaire.careerGoal === "Henüz karar vermedim" ||
    questionnaire.timeline === "Henüz belirlemedim" ||
    !questionnaire.technologies || questionnaire.technologies.length === 0
  );

  const isBeginner = questionnaire?.skillLevel === "Başlangıç" || 
    (avgQuizScore < 50 && quizScores.length === 0) ||
    (cvData.skills && (cvData.skills as string[]).length === 0);

  let questionnaireSection = "";
  let guidanceInstructions = "";

  // Get primary technology for examples (use first selected or default based on specialization)
  let primaryTechnology = "";
  if (questionnaire?.technologies && questionnaire.technologies.length > 0) {
    primaryTechnology = questionnaire.technologies[0];
  } else if (questionnaire?.specialization) {
    // Default technology based on specialization
    const specializationDefaults: Record<string, string> = {
      "Frontend": "JavaScript",
      "Backend": "Node.js",
      "Full-stack": "JavaScript",
      "Mobile": "React Native",
      "DevOps": "Docker",
      "Data Science": "Python",
      "AI/ML": "Python",
      "Cybersecurity": "Python",
      "Game Development": "Unity",
    };
    primaryTechnology = specializationDefaults[questionnaire.specialization] || "JavaScript";
  } else {
    primaryTechnology = "JavaScript";
  }

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

    // Emphasize selected technologies prominently
    const technologiesSection = questionnaire.technologies && questionnaire.technologies.length > 0
      ? `\n\n⚠️ ÖNEMLİ - SEÇİLEN TEKNOLOJİLER:\nKullanıcı şu teknolojileri açıkça seçti: ${questionnaire.technologies.join(", ")}\n\nKURALLAR:\n- Planı SADECE bu seçilen teknolojilere göre oluştur.\n- Başka teknolojiler önerme (örneğin Angular seçildiyse React önerme).\n- Tüm örnekler, görevler ve projeler seçilen teknolojilere göre olmalı.\n- Eğer Angular seçildiyse, Angular bileşenleri, Angular CLI, TypeScript, RxJS gibi Angular ekosistemine odaklan.\n- Eğer React seçildiyse, React bileşenleri, React Hooks, JSX gibi React ekosistemine odaklan.\n\n`
      : "";

    questionnaireSection = `${technologiesSection}Tercihler: ${questionnaire.specialization || "?"} | ${questionnaire.careerGoal || "?"} | ${questionnaire.timeline || "?"} | ${questionnaire.skillLevel || "?"} | Teknolojiler: ${questionnaire.technologies?.join(", ") || "Yok"}. ${uncertaintyNotes.length > 0 ? `Notlar: ${uncertaintyNotes.join("; ")}` : ""}`;

    if (hasUncertainty) {
      guidanceInstructions = "Genel, esnek plan oluştur. Farklı alanları keşfetmesine yardımcı ol. ";
    }

    if (isBeginner) {
      guidanceInstructions += "Başlangıç seviyesi: Temel kavramları vurgula, adım adım ilerle, pratik projeler öner. ";
    }
  }

  const resourcesSection = availableResources && availableResources.length > 0
    ? `Platform Kaynakları: ${availableResources.slice(0, 20).map((r: any) => `${r.title} [${r.id}]`).join(", ")}. Bu kaynakları plana entegre et. Link için kurs ID kullan (örn: "${availableResources[0]?.id}" veya "/education/courses/${availableResources[0]?.id}") veya boş bırak.`
    : "";

  const cvSection = (cvData?.skills && (cvData.skills as string[]).length > 0) || cvData?.experience || cvData?.education
    ? `CV: ${(cvData.skills ?? []).join(", ") || "Yok"}. Deneyim: ${Array.isArray(cvData.experience) ? cvData.experience.length : 0} kayıt.`
    : "";

  const testSection = quizScores.length > 0 || avgQuizScore > 0
    ? `Testler: Ortalama ${Math.round(avgQuizScore)}% (${quizScores.length} test)`
    : "";

  const interviewSection = interviewScores.length > 0
    ? `Mülakat: Ortalama ${Math.round(avgInterviewScore)}%`
    : "";

  return `
Kişiselleştirilmiş kariyer planı oluştur. Detaylı, yapılandırılmış ve uygulanabilir olsun. JSON formatında döndür.

KULLANICI BİLGİLERİ:
${cvSection}${testSection ? ` ${testSection}` : ""}${interviewSection ? ` ${interviewSection}` : ""}
${questionnaireSection}
${resourcesSection}
${guidanceInstructions}

ROADMAP YAPISI (ÖNEMLİ):
Her aşama için şu yapıyı kullan:

1. **Aşama Bilgileri:**
   - stage: "Aşama 1", "Aşama 2" gibi
   - title: Aşamanın net başlığı (kullanıcının seçtiği teknolojiye göre, örn: "${primaryTechnology} Temelleri", "Backend API Geliştirme")
   - description: Bu aşamada ne öğreneceğini açıklayan 1-2 cümle
   - estimatedDuration: "2-3 ay", "1-2 hafta" gibi
   - priority: "Yüksek", "Orta", veya "Düşük"

2. **Öğrenme Hedefleri (learningObjectives):**
   - Her hedef açık ve ölçülebilir olsun
   - Kullanıcının seçtiği teknolojilere göre hedefler belirle (örn: "${primaryTechnology} ile ilgili hedefler")
   - 3-5 hedef ekle

3. **Görevler (tasks):** 
   - Her görev bir obje olmalı: {title, description, estimatedTime, order}
   - title: Görevin kısa adı (kullanıcının seçtiği teknolojiye göre, örn: "${primaryTechnology} temellerini öğrenme")
   - description: Ne yapılacağının açıklaması (opsiyonel ama önerilir)
   - estimatedTime: "1 hafta", "2 gün" gibi (opsiyonel)
   - order: Sıralama numarası (1, 2, 3...)
   - Aksiyona odaklı, net görevler yaz (kullanıcının seçtiği teknolojilere göre)
   - 4-6 görev ekle

4. **Pratik Projeler (practicalProjects):**
   - Her proje bir obje olmalı: {name, description, difficulty, estimatedTime}
   - name: Proje adı (örn: "Todo List Uygulaması")
   - description: Projenin ne yapacağının açıklaması (opsiyonel ama önerilir)
   - difficulty: "Başlangıç", "Orta", veya "İleri" (opsiyonel)
   - estimatedTime: Tahmini süre (opsiyonel)
   - Gerçek dünya projeleri öner (örn: "Weather API kullanan hava durumu uygulaması")
   - 2-3 proje ekle

5. **Milestone'lar (milestones):**
   - Her milestone bir obje olmalı: {title, criteria}
   - title: Milestone adı (kullanıcının seçtiği teknolojiye göre, örn: "${primaryTechnology} Temelleri Tamamlandı")
   - criteria: Ölçülebilir kriterler array'i (kullanıcının seçtiği teknolojilere göre)
   - 1-2 milestone ekle

6. **Önemli Notlar (importantPoints):**
   - Bu aşamaya özel püf noktaları, dikkat edilmesi gerekenler
   - 2-4 önemli nokta ekle

7. **Kaynak Önerileri (recommendedResources - aşamaya özel, opsiyonel):**
   - Bu aşama için önerilen platform kaynakları
   - Eğer resourcesSection'da kaynaklar varsa, uygun olanları buraya ekle

**Genel Kurallar:**
- 2-4 aşama oluştur (kullanıcının seviyesi ve zaman çizelgesine göre)
- İlk aşamalar temel konulara odaklanmalı
- Her aşama bir sonrakine mantıklı bir geçiş sağlamalı
- Görevler sıralı ve ilerlemeli olmalı
- Pratik projeler gerçek dünya örnekleri olmalı
- Milestone'lar ölçülebilir kriterler içermeli

JSON FORMATI (ÖRNEK - Kullanıcının seçtiği teknolojilere göre uyarla):
{
  "goals": ["hedef 1", "hedef 2", "hedef 3"],
  "roadmap": [
    {
      "stage": "Aşama 1",
      "title": "${primaryTechnology} Temelleri",
      "description": "Bu aşamada ${primaryTechnology} ile ilgili temel kavramları öğreneceksiniz",
      "estimatedDuration": "2-3 ay",
      "priority": "Yüksek",
      "learningObjectives": [
        "${primaryTechnology} ile ilgili öğrenme hedefleri (kullanıcının seçtiği teknolojiye göre)",
        "İlgili kavramları anlamak",
        "Temel uygulamaları yapabilmek"
      ],
      "tasks": [
        {
          "title": "${primaryTechnology} Temellerini Öğren",
          "description": "${primaryTechnology} ile ilgili temel kavramları öğrenin",
          "estimatedTime": "1 hafta",
          "order": 1
        },
        {
          "title": "${primaryTechnology} ile Pratik Yap",
          "description": "${primaryTechnology} kullanarak 3 örnek proje yapın",
          "estimatedTime": "2 hafta",
          "order": 2
        }
      ],
      "practicalProjects": [
        {
          "name": "Örnek Proje",
          "description": "${primaryTechnology} kullanarak tam fonksiyonel uygulama",
          "difficulty": "Başlangıç",
          "estimatedTime": "1 hafta"
        }
      ],
      "milestones": [
        {
          "title": "${primaryTechnology} Temelleri Tamamlandı",
          "criteria": [
            "5 farklı ${primaryTechnology} projesi tamamlandı",
            "Temel kavramlar anlaşıldı ve uygulandı"
          ]
        }
      ],
      "importantPoints": [
        "Seçilen teknolojilere odaklanmak çok önemli",
        "Her görevden sonra pratik yapmayı unutmayın"
      ],
      "recommendedResources": [
        {
          "title": "${primaryTechnology} Temelleri Kursu",
          "type": "Kurs",
          "description": "...",
          "link": "course-id veya boş"
        }
      ]
    }
  ],
  "recommendedCourses": ["Kurs 1", "Kurs 2"],
  "recommendedResources": [
    {
      "title": "...",
      "type": "Kurs",
      "description": "...",
      "link": "course-id veya boş string"
    }
  ],
  "skillsToDevelop": ["Seçilen teknolojiler buraya gelecek - kullanıcının seçtiği teknolojilere göre doldur"],
  "timeline": "${questionnaire?.timeline && questionnaire.timeline !== "Henüz belirlemedim" ? questionnaire.timeline : "6-12 ay"}",
  "summary": "Kısa ve öz bir özet (2-3 cümle). AI Öğretmen Selin olarak kullanıcıya doğrudan hitap et, motive edici ve yol gösterici ol. Kullanıcının seçtiği teknolojilere odaklandığını belirt."
}

Sadece JSON döndür. Tüm roadmap aşamaları için yukarıdaki yapıyı kullan.

⚠️ SON HATIRLATMA - TEKNOLOJİ SEÇİMİ:
${questionnaire?.technologies && questionnaire.technologies.length > 0
  ? `Kullanıcı şu teknolojileri seçti: ${questionnaire.technologies.join(", ")}\nPlanı SADECE bu teknolojilere göre oluştur. Başka teknolojiler önerme.\n`
  : `Kullanıcı spesifik teknoloji seçmedi, specialization'a göre uygun teknolojiler öner.\n`}
`;
}

export async function generateCareerPlan(userId: string, questionnaire?: QuestionnaireData | null): Promise<any> {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  try {
    // Get user's CV, quiz attempts, interview attempts, and courses in parallel
    const [cv, quizAttempts, interviewAttempts, availableCourses] = await Promise.all([
      // CV fetch (critical - throws on error)
      db.cV.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }).catch((dbError: any) => {
        const errorMsg = isDevelopment ? `CV verisi alınırken hata: ${dbError?.message || "Bilinmeyen hata"}` : "Kullanıcı verileri alınırken bir sorun oluştu.";
        console.error("[CAREER_PLAN] CV fetch error:", { error: dbError, userId });
        throw new Error(errorMsg);
      }),
      
      // Quiz attempts fetch (non-critical)
      db.quizAttempt.findMany({
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
      }).catch((dbError: any) => {
        console.warn("[CAREER_PLAN] Quiz attempts fetch error (non-critical):", { error: dbError?.message, userId });
        return []; // Continue with empty array if quiz fetch fails
      }),
      
      // Interview attempts fetch (non-critical)
      db.interviewAttempt.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 5,
      }).catch((dbError: any) => {
        console.warn("[CAREER_PLAN] Interview attempts fetch error (non-critical):", { error: dbError?.message, userId });
        return []; // Continue with empty array if interview fetch fails
      }),
      
      // Courses fetch (non-critical)
      db.course.findMany({
        select: {
          id: true,
          title: true,
          category: true,
          field: true,
          topic: true,
          difficulty: true,
          description: true,
        },
        take: 50, // Limit to avoid too much data
      }).catch((dbError: any) => {
        console.warn("[CAREER_PLAN] Courses fetch error (non-critical):", { error: dbError?.message });
        return []; // Continue with empty array if courses fetch fails
      }),
    ]);

    const availableResources = availableCourses.map((course: typeof availableCourses[0]) => ({
      id: course.id,
      title: course.title,
      category: course.category || course.field || undefined,
      topic: course.topic || undefined,
      difficulty: course.difficulty || undefined,
      description: course.description || undefined,
    }));

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
      const errorMsg = isDevelopment 
        ? "AI servisi devre dışı. OPENAI_API_KEY environment variable kontrol edin." 
        : "AI servisi şu anda kullanılamıyor.";
      console.error("[CAREER_PLAN] AI service disabled:", { userId, hasQuestionnaire: !!questionnaire });
      throw new Error(errorMsg);
    }

    let plan;
    try {
      const result = await createChatCompletion({
        schema: careerPlanSchema,
        timeoutMs: 50000, // 50 seconds timeout (less than route timeout of 60s)
        messages: [
        {
          role: "system",
          content:
            "Sen AI Öğretmen Selin'sin. Kişiselleştirilmiş, pratik kariyer planları oluştur. Yeni başlayanlar ve belirsizlik durumlarında yol gösterici ol. Platform kaynaklarını plana entegre et. JSON formatında yanıt ver.",
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
              availableResources,
            }),
          },
        ],
      });

      plan = result.parsed;
      
      if (!plan) {
        const errorMsg = isDevelopment 
          ? "AI yanıtı doğrulanamadı. API response formatı beklenen şema ile uyuşmuyor." 
          : "AI yanıtı işlenirken bir sorun oluştu.";
        console.error("[CAREER_PLAN] Invalid AI response:", { userId, hasQuestionnaire: !!questionnaire });
        throw new Error(errorMsg);
      }
    } catch (aiError: any) {
      const errorMsg = aiError?.message || "AI servisi ile iletişim kurulamadı.";
      console.error("[CAREER_PLAN] AI completion error:", {
        error: aiError,
        message: aiError?.message,
        stack: aiError?.stack,
        userId,
        hasQuestionnaire: !!questionnaire,
      });
      
      // Re-throw with more context if in development
      if (isDevelopment) {
        throw new Error(`AI işlemi hatası: ${errorMsg}. Stack: ${aiError?.stack || "Yok"}`);
      }
      throw new Error(errorMsg);
    }

    const normalizedPlan = {
      goals: plan.goals ?? [],
      roadmap: plan.roadmap ?? [],
      recommendedCourses: plan.recommendedCourses ?? [],
      recommendedResources: plan.recommendedResources ?? [],
      skillsToDevelop: plan.skillsToDevelop ?? [],
      timeline: plan.timeline ?? "",
      summary: plan.summary ?? "",
    };

    // Store recommendedResources in recommendedCourses Json field as a combined structure
    const coursesData = {
      courses: normalizedPlan.recommendedCourses,
      resources: normalizedPlan.recommendedResources || [],
    };

    // Save to database
    try {
      const existing = await db.careerPlan.findFirst({
        where: { userId },
      });

      if (existing) {
        await db.careerPlan.update({
          where: { id: existing.id },
          data: {
            goals: normalizedPlan.goals as any,
            roadmap: normalizedPlan.roadmap as any,
            recommendedCourses: coursesData as any,
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
            recommendedCourses: coursesData as any,
            skillsToDevelop: normalizedPlan.skillsToDevelop as any,
            timeline: normalizedPlan.timeline,
            summary: normalizedPlan.summary,
            aiGenerated: true,
          },
        });
      }
    } catch (dbError: any) {
      // Log database error but still return the plan to user
      console.error("[CAREER_PLAN] Database save error:", {
        error: dbError,
        message: dbError?.message,
        userId,
        hasQuestionnaire: !!questionnaire,
      });
      
      if (isDevelopment) {
        console.warn("[CAREER_PLAN] Plan generated but not saved to DB:", dbError?.message);
      }
      // Continue and return plan even if save fails
    }

    return normalizedPlan;
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === "development";
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    // Enhanced error logging with more context
    console.error("[CAREER_PLAN] Error generating career plan:", {
      message: errorMessage,
      details: errorDetails,
      userId,
      hasQuestionnaire: !!questionnaire,
      questionnaireSummary: questionnaire ? {
        specialization: questionnaire.specialization,
        careerGoal: questionnaire.careerGoal,
        skillLevel: questionnaire.skillLevel,
        hasTechnologies: !!questionnaire.technologies && questionnaire.technologies.length > 0,
      } : null,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });

    // Provide more helpful error messages based on error type
    let userFriendlySummary = "Kariyer planı oluşturulurken bir sorun oluştu.";
    
    if (errorMessage.includes("AI servisi devre dışı") || errorMessage.includes("AI servisi")) {
      userFriendlySummary = isDevelopment
        ? "AI servisi devre dışı. OPENAI_API_KEY environment variable'ını kontrol edin."
        : "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin veya sistem yöneticisiyle iletişime geçin.";
    } else if (errorMessage.includes("zaman aşımı") || errorMessage.includes("timeout")) {
      userFriendlySummary = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
    } else if (errorMessage.includes("doğrulanamadı") || errorMessage.includes("validation")) {
      userFriendlySummary = isDevelopment
        ? "AI yanıtı beklenen formatta değil. API response şemasını kontrol edin."
        : "AI yanıtı işlenirken bir sorun oluştu. Lütfen tekrar deneyin.";
    } else if (errorMessage.includes("API") || errorMessage.includes("iletişim")) {
      userFriendlySummary = isDevelopment
        ? `AI servisi ile iletişim hatası: ${errorMessage}`
        : "AI servisi ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.";
    } else if (errorMessage.includes("CV verisi")) {
      userFriendlySummary = isDevelopment
        ? errorMessage
        : "Kullanıcı verileri alınırken bir sorun oluştu. Lütfen tekrar deneyin.";
    } else if (isDevelopment) {
      // In development, show more details
      userFriendlySummary = `[DEV] ${errorMessage}`;
    }

    return {
      goals: ["Kariyer gelişiminize devam edin", "Planı daha sonra yeniden oluşturmayı deneyin"],
      roadmap: [],
      recommendedCourses: [],
      recommendedResources: [],
      skillsToDevelop: [],
      timeline: questionnaire?.timeline && questionnaire.timeline !== "Henüz belirlemedim" 
        ? questionnaire.timeline 
        : "6-12 ay",
      summary: userFriendlySummary,
    };
  }
}

