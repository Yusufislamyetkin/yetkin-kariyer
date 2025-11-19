import { NextResponse } from "next/server";
import { z } from "zod";
import { GoalFrequency, Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAIEnabled, createChatCompletion } from "@/lib/ai/client";
import { generatePersonalizedLessons } from "@/lib/ai/lessons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const recommendationItemSchema = z.object({
  title: z.string(),
  summary: z.string(),
  actionSteps: z.array(z.string()).default([]),
  timeframe: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  category: z.string().optional(),
  relatedGoalId: z.string().optional(),
  metric: z.string().optional(),
});

const mentorRecommendationsSchema = z.object({
  recommendations: z.array(recommendationItemSchema).default([]),
});

type MentorRecommendation = z.infer<typeof recommendationItemSchema>;

interface ResourceCatalogItem {
  id: string;
  title: string;
  href: string;
  type: string;
  summary?: string;
  tags?: string[];
}

interface DashboardPromptInput {
  performance: {
    quizCount: number;
    avgQuizScore: number;
    interviewCount: number;
    avgInterviewScore: number;
  };
  lessonsMessage: string;
  weakTopics: string[];
  learningPath: string[];
  recommendedCourses: ResourceCatalogItem[];
  lowScoreAttempts: Array<{
    quizId: string;
    quizTitle: string;
    score: number;
    topic?: string | null;
    type?: string | null;
    href: string;
  }>;
  activeGoals: Array<{
    id: string;
    label: string;
    target: string;
    dueDate: string | null;
  }>;
  careerSummary?: string;
  careerGoals?: string[];
  resourceCatalog: ResourceCatalogItem[];
}

const buildDashboardPrompt = (input: DashboardPromptInput) => {
  const payload = JSON.stringify(
    {
      performance: input.performance,
      activeGoals: input.activeGoals,
      learningSupport: {
        message: input.lessonsMessage,
        weakTopics: input.weakTopics,
        learningPath: input.learningPath,
      },
      lowScoreAttempts: input.lowScoreAttempts,
      careerPlan: {
        summary: input.careerSummary,
        goals: input.careerGoals,
      },
      resources: {
        primary: input.recommendedCourses,
        catalog: input.resourceCatalog,
      },
    },
    null,
    2
  );

  return `
Sen Yetkin Mentor'sun; adayın verilerini analiz edip öğretmen gibi rehberlik edersin.

Veri Özeti (JSON):
${payload}

Görev:
- 3 adet mentor önerisi üret (önem sırasına göre).
- Her öneri için \`title\`, \`summary\`, en fazla 3 \`actionSteps\`, \`timeframe\`, \`ctaLabel\`, \`ctaHref\`, isteğe bağlı \`category\`, \`relatedGoalId\`, \`metric\` alanlarını doldur.
- \`summary\` 25 kelimeyi geçmesin.
- \`actionSteps\` cümleleri ikinci tekil şahısla (“sen”) yaz.
- \`ctaHref\` değerleri sadece verilen resource listesinde yer alan linklerden seç.
- En az bir öneri zayıf konulardan birine odaklanmalı.
- En az bir öneri aktif hedeflerle bağlantılı olmalı (varsa ilgili goal id'sini \`relatedGoalId\` alanına koy).
- Ton motive edici ve direktif olsun; gereksiz süsleme yapma.
- Zaman ifadeleri (\`timeframe\`) net olmalı: “Bugün”, “Bu hafta”, “Bu ay” gibi.

Çıktı formatı:
{
  "recommendations": [
    {
      "title": "Kısa başlık",
      "summary": "Önerinin kısa özeti.",
      "actionSteps": ["1. adım", "2. adım"],
      "timeframe": "Bu hafta",
      "ctaLabel": "Kaynağa git",
      "ctaHref": "/education/courses?search=Node.js",
      "category": "Teknik Beceri",
      "relatedGoalId": "goal_123",
      "metric": "Hedef: %75 üzeri skor"
    }
  ]
}
`;
};

const mapGoalsToPrompt = (goals: Array<{ id: string; goalType: string; targetValue: number; date: Date }>) =>
  goals.map((goal) => ({
    id: goal.id,
    label: goal.goalType
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase()),
    target: `${goal.targetValue}`,
    dueDate: goal.date ? goal.date.toISOString().split("T")[0] : null,
  }));

const buildResourceCatalog = ({
  recommendedCourseNames,
  competitionItems,
}: {
  recommendedCourseNames: string[];
  competitionItems: Array<{
    id: string;
    title: string;
    type: string;
    level: string | null;
  }>;
}): ResourceCatalogItem[] => {
  const dedup = new Map<string, ResourceCatalogItem>();

  const baseResources: ResourceCatalogItem[] = [
    {
      id: "courses-home",
      title: "Kurs Kataloğu",
      href: "/education/courses",
      type: "course",
      summary: "Tüm Yetkin Hub kurslarına göz at.",
    },
    {
      id: "goals",
      title: "Günlük Hedefler",
      href: "/goals",
      type: "goal",
      summary: "Hedeflerini takip et ve güncelle.",
    },
    {
      id: "career-roadmap",
      title: "Kariyer Planım",
      href: "/career/roadmap",
      type: "plan",
      summary: "Uzun vadeli hedeflerini gözden geçir.",
    },
    {
      id: "competitions-hub",
      title: "Yarışmalar",
      href: "/competition",
      type: "competition",
      summary: "Skor tablolarına katıl.",
    },
  ];

  baseResources.forEach((resource) => dedup.set(resource.id, resource));

  recommendedCourseNames.forEach((name) => {
    const id = `course-${name.toLowerCase().replace(/\s+/g, "-")}`;
    if (!dedup.has(id)) {
      dedup.set(id, {
        id,
        title: name,
        href: `/education/courses?search=${encodeURIComponent(name)}`,
        type: "course",
      });
    }
  });

  competitionItems.forEach((item) => {
    const typeSlug =
      item.type === "HACKATON"
        ? "hackaton"
        : item.type === "BUG_FIX"
        ? "bug-fix"
        : item.type === "LIVE_CODING"
        ? "live-coding"
        : "test";

    const id = `${typeSlug}-${item.id}`;
    dedup.set(id, {
      id,
      title: item.title,
      href: `/education/${typeSlug}/${item.id}`,
      type: "competition",
      tags: [item.type, item.level ?? "Seviye bilinmiyor"],
    });
  });

  return Array.from(dedup.values());
};

const buildFallbackRecommendations = ({
  weakTopics,
  activeGoals,
  lowScoreAttempts,
  resourceCatalog,
}: {
  weakTopics: string[];
  activeGoals: DashboardPromptInput["activeGoals"];
  lowScoreAttempts: DashboardPromptInput["lowScoreAttempts"];
  resourceCatalog: ResourceCatalogItem[];
}): MentorRecommendation[] => {
  const recommendations: MentorRecommendation[] = [];

  if (weakTopics.length > 0) {
    const courseResource =
      resourceCatalog.find((resource) => resource.type === "course" && resource.id.startsWith("course-")) ??
      resourceCatalog.find((resource) => resource.id === "courses-home");

    recommendations.push({
      title: `${weakTopics[0]} Pekiştir`,
      summary: `${weakTopics[0]} konusunu bu hafta kurslardan çalış.`,
      actionSteps: [
        `Bugün ${weakTopics[0]} başlığını gözden geçir.`,
        "Notlarını çıkar ve eksiklerini listele.",
        "Hafta sonunda 1 uygulama görevi yap.",
      ],
      timeframe: "Bu hafta",
      ctaLabel: "İlgili kurslara git",
      ctaHref: courseResource?.href ?? "/education/courses",
      category: "Teknik Gelişim",
      metric: "Hedef: %75 üzeri skor",
    });
  }

  if (activeGoals.length > 0) {
    const goal = activeGoals[0];
    const goalResource = resourceCatalog.find((resource) => resource.id === "goals");
    recommendations.push({
      title: `${goal.label} Hedefini Tamamla`,
      summary: `${goal.label} hedefini zamanında bitir.`,
      actionSteps: [
        "Bugün hedef ilerlemeni kontrol et.",
        "Eksik kalan adımlar için zaman blokla.",
        "Tamamlayınca sonucu sisteme işle.",
      ],
      timeframe: "Bugün",
      ctaLabel: "Hedefleri yönet",
      ctaHref: goalResource?.href ?? "/goals",
      category: "Hedef Yönetimi",
      relatedGoalId: goal.id,
      metric: `Hedef: ${goal.target}`,
    });
  }

  const reattempt = lowScoreAttempts[0];
  if (reattempt) {
    recommendations.push({
      title: `${reattempt.quizTitle} Tekrarı`,
      summary: `${reattempt.score} puan aldığın denemeyi bugün tekrar çöz.`,
      actionSteps: [
        "Önce geçmiş hatalarını incele.",
        "Sorulara süre tutarak yeniden çalış.",
        "Sonuçları analiz edip not al.",
      ],
      timeframe: "Bugün",
      ctaLabel: "Pratiğe başla",
      ctaHref: reattempt.href,
      category: "Pratik",
      metric: "Hedef: %80 üzeri skor",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Çalışma Planı Oluştur",
      summary: "Bu hafta için 3 parça çalışma planı yaz.",
      actionSteps: [
        "Hedeflerini gözden geçir.",
        "Öncelikli konuları bloklara ayır.",
        "Planını takvimine ekle.",
      ],
      timeframe: "Bugün",
      ctaLabel: "Plan yapmaya başla",
      ctaHref: "/career/roadmap",
      category: "Planlama",
    });
  }

  return recommendations.slice(0, 3);
};

const FREQUENCIES: GoalFrequency[] = [GoalFrequency.daily, GoalFrequency.weekly, GoalFrequency.monthly];

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const getPeriodStart = (frequency: GoalFrequency, reference: Date) => {
  const base = startOfDay(reference);

  if (frequency === GoalFrequency.daily) {
    return base;
  }

  if (frequency === GoalFrequency.weekly) {
    const day = base.getDay(); // 0 Sunday ... 6 Saturday
    const diff = (day + 6) % 7; // convert to Monday-based offset
    base.setDate(base.getDate() - diff);
    return startOfDay(base);
  }

  if (frequency === GoalFrequency.monthly) {
    base.setDate(1);
    return startOfDay(base);
  }

  return base;
};

const getNextUpdateAt = (frequency: GoalFrequency, reference: Date) => {
  const periodStart = getPeriodStart(frequency, reference);

  if (frequency === GoalFrequency.daily) {
    return addDays(periodStart, 1);
  }

  if (frequency === GoalFrequency.weekly) {
    return addDays(periodStart, 7);
  }

  if (frequency === GoalFrequency.monthly) {
    const nextMonth = new Date(periodStart);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return startOfDay(nextMonth);
  }

  return addDays(periodStart, 1);
};

const getPeriodEnd = (frequency: GoalFrequency, reference: Date) => {
  const periodStart = getPeriodStart(frequency, reference);

  if (frequency === GoalFrequency.daily) {
    return periodStart;
  }

  if (frequency === GoalFrequency.weekly) {
    return startOfDay(addDays(periodStart, 6));
  }

  if (frequency === GoalFrequency.monthly) {
    const nextPeriodStart = getNextUpdateAt(frequency, reference);
    return startOfDay(addDays(nextPeriodStart, -1));
  }

  return periodStart;
};

const resolveFrequency = (timeframe?: string | null): GoalFrequency => {
  const normalized = (timeframe ?? "").toLowerCase();

  if (normalized.includes("bugün") || normalized.includes("today") || normalized.includes("gün")) {
    return GoalFrequency.daily;
  }

  if (normalized.includes("hafta") || normalized.includes("week")) {
    return GoalFrequency.weekly;
  }

  if (normalized.includes("ay") || normalized.includes("month")) {
    return GoalFrequency.monthly;
  }

  return GoalFrequency.weekly;
};

const groupRecommendationsByFrequency = (recommendations: MentorRecommendation[]) => {
  return recommendations.reduce<Record<GoalFrequency, MentorRecommendation[]>>(
    (acc, recommendation) => {
      const frequency = resolveFrequency(recommendation.timeframe);
      acc[frequency].push(recommendation);
      return acc;
    },
    {
      [GoalFrequency.daily]: [],
      [GoalFrequency.weekly]: [],
      [GoalFrequency.monthly]: [],
    }
  );
};

type DashboardGoalPlanRecordNullable = Awaited<ReturnType<typeof db.dashboardGoalPlan.findUnique>>;
type DashboardGoalPlanRecord = NonNullable<DashboardGoalPlanRecordNullable>;

const flattenPlans = (plans: DashboardGoalPlanRecord[]): MentorRecommendation[] => {
  const order = new Map<GoalFrequency, number>([
    [GoalFrequency.daily, 0],
    [GoalFrequency.weekly, 1],
    [GoalFrequency.monthly, 2],
  ]);

  const sortedPlans = [...plans].sort((a, b) => {
    const aOrder = order.get(a.frequency as GoalFrequency) ?? 0;
    const bOrder = order.get(b.frequency as GoalFrequency) ?? 0;
    return aOrder - bOrder;
  });

  return sortedPlans.flatMap((plan) =>
    Array.isArray(plan.goals) ? (plan.goals as MentorRecommendation[]) : []
  );
};

const determineSourceFromPlans = (plans: DashboardGoalPlanRecord[]): string => {
  if (plans.some((plan) => plan.source === "ai")) {
    return "ai";
  }

  if (plans.some((plan) => plan.source === "fallback-error")) {
    return "fallback-error";
  }

  if (plans.some((plan) => plan.source === "fallback")) {
    return "fallback";
  }

  return plans[0]?.source ?? "fallback";
};

const getValidCachedPlans = async (userId: string, reference: Date) => {
  const plans = await Promise.all(
    FREQUENCIES.map(async (frequency) => {
      const periodStart = getPeriodStart(frequency, reference);
      const plan = await db.dashboardGoalPlan.findUnique({
        where: {
          userId_frequency_periodStart: {
            userId,
            frequency,
            periodStart,
          },
        },
      });

      return plan;
    })
  );

  const hasAllPlans = plans.every(
    (plan) => plan !== null && plan.nextUpdateAt.getTime() > reference.getTime()
  );

  if (!hasAllPlans) {
    return null;
  }

  return plans.filter((plan): plan is DashboardGoalPlanRecord => plan !== null);
};

const persistRecommendations = async ({
  userId,
  source,
  recommendations,
  referenceDate,
}: {
  userId: string;
  source: string;
  recommendations: MentorRecommendation[];
  referenceDate: Date;
}) => {
  const grouped = groupRecommendationsByFrequency(recommendations);
  const generatedAt = new Date();

  await Promise.all(
    FREQUENCIES.map(async (frequency) => {
      const periodStart = getPeriodStart(frequency, referenceDate);
      const periodEnd = getPeriodEnd(frequency, referenceDate);
      const nextUpdateAt = getNextUpdateAt(frequency, referenceDate);
      const goals = grouped[frequency] as unknown as Prisma.JsonArray;

      await db.dashboardGoalPlan.upsert({
        where: {
          userId_frequency_periodStart: {
            userId,
            frequency,
            periodStart,
          },
        },
        update: {
          goals,
          source,
          generatedAt,
          periodEnd,
          nextUpdateAt,
        },
        create: {
          userId,
          frequency,
          periodStart,
          periodEnd,
          goals,
          source,
          generatedAt,
          nextUpdateAt,
        },
      });
    })
  );
};
export async function GET() {
  const now = new Date();
  let promptInput: DashboardPromptInput | null = null;
  let resourceCatalog: ResourceCatalogItem[] = [];
  let userId: string | null = null;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    userId = session.user.id as string;
    const currentUserId = userId;

    const cachedPlans = await getValidCachedPlans(currentUserId, now);
    if (cachedPlans) {
      return NextResponse.json({
        source: determineSourceFromPlans(cachedPlans),
        recommendations: flattenPlans(cachedPlans),
      });
    }

    const [quizStats, interviewStats, careerPlan] = await Promise.all([
      db.quizAttempt.aggregate({
        where: { userId: currentUserId },
        _avg: { score: true },
        _count: { _all: true },
      }),
      db.interviewAttempt.aggregate({
        where: { userId: currentUserId },
        _avg: { aiScore: true },
        _count: { _all: true },
      }),
      db.careerPlan.findFirst({
        where: { userId: currentUserId },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const [activeGoalsRaw, lowScoreAttemptsRaw, competitionItems] = await Promise.all([
      db.dailyGoal.findMany({
        where: { userId: currentUserId, completed: false },
        orderBy: { date: "asc" },
        take: 5,
      }),
      db.quizAttempt.findMany({
        where: { userId: currentUserId, score: { lt: 70 } },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
        take: 5,
      }),
      db.quiz.findMany({
        where: {
          type: {
            in: ["HACKATON", "BUG_FIX", "LIVE_CODING"],
          },
        },
        select: {
          id: true,
          title: true,
          type: true,
          level: true,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    const activeGoals = mapGoalsToPrompt(
      activeGoalsRaw.map((goal: { id: string; goalType: string; targetValue: number; date: Date }) => ({
        id: goal.id,
        goalType: goal.goalType,
        targetValue: goal.targetValue,
        date: goal.date,
      }))
    );

    const lowScoreAttempts = lowScoreAttemptsRaw.map((attempt: { quizId: string; score: number; topic?: string | null; quiz?: { title?: string | null; type?: string | null } | null }) => ({
      quizId: attempt.quizId,
      quizTitle: attempt.quiz?.title ?? "Test",
      score: attempt.score,
      topic: attempt.topic,
      type: attempt.quiz?.type ?? null,
      href:
        attempt.quiz?.type === "TEST" || !attempt.quiz?.type
          ? `/education/test/${attempt.quizId}`
          : attempt.quiz?.type === "HACKATON"
          ? `/education/hackaton/${attempt.quizId}`
          : attempt.quiz?.type === "BUG_FIX"
          ? `/education/bug-fix/${attempt.quizId}`
          : attempt.quiz?.type === "LIVE_CODING"
          ? `/education/live-coding/${attempt.quizId}`
          : `/education/test/${attempt.quizId}`,
    }));

    const lessons = await generatePersonalizedLessons(currentUserId);

    const recommendedCourseNames = (
      [
        ...(Array.isArray(lessons.recommendedCourses) ? lessons.recommendedCourses : []),
        ...(Array.isArray(lessons.learningPath) ? lessons.learningPath : []),
      ].filter((value): value is string => typeof value === "string") ?? []
    ).slice(0, 6);

    const weakTopicsSet = new Set<string>();
    recommendedCourseNames.forEach((name) => {
      if (name) {
        weakTopicsSet.add(name);
      }
    });

    lowScoreAttempts
      .map((attempt: { topic?: string | null }) => attempt.topic)
      .filter((topic: string | null | undefined): topic is string => !!topic)
      .forEach((topic: string) => weakTopicsSet.add(topic));

    const weakTopics = Array.from(weakTopicsSet).slice(0, 6);

    resourceCatalog = buildResourceCatalog({
      recommendedCourseNames,
      competitionItems,
    });

    promptInput = {
      performance: {
        quizCount: quizStats._count._all,
        avgQuizScore: Math.round(quizStats._avg.score ?? 0),
        interviewCount: interviewStats._count._all,
        avgInterviewScore: Math.round(interviewStats._avg.aiScore ?? 0),
      },
      lessonsMessage: lessons.message,
      weakTopics,
      learningPath: Array.isArray(lessons.learningPath) ? lessons.learningPath : [],
      recommendedCourses: resourceCatalog.filter((resource) => resource.type === "course"),
      lowScoreAttempts,
      activeGoals,
      careerSummary: (careerPlan?.summary as string | null) ?? undefined,
      careerGoals: Array.isArray(careerPlan?.goals)
        ? (careerPlan?.goals as string[]).slice(0, 5)
        : undefined,
      resourceCatalog,
    };

    if (!isAIEnabled()) {
      const fallback = buildFallbackRecommendations({
        weakTopics: promptInput.weakTopics,
        activeGoals: promptInput.activeGoals,
        lowScoreAttempts: promptInput.lowScoreAttempts,
        resourceCatalog,
      });

      try {
        await persistRecommendations({
          userId: currentUserId,
          source: "fallback",
          recommendations: fallback,
          referenceDate: now,
        });
      } catch (persistError) {
        console.error("Error caching fallback recommendations:", persistError);
      }

      return NextResponse.json({
        source: "fallback",
        recommendations: fallback,
      });
    }

    const { parsed } = await createChatCompletion({
      schema: mentorRecommendationsSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen Yetkin Mentor'sun, öğretmen gibi davranır, adayın verilerini analiz ederek öncelikli aksiyon planları oluşturursun.",
        },
        {
          role: "user",
          content: buildDashboardPrompt(promptInput),
        },
      ],
      temperature: 0.3,
    });

    const aiRecommendations = parsed?.recommendations ?? [];

    if (aiRecommendations.length === 0) {
      throw new Error("AI önerileri boş döndü");
    }

    const finalRecommendations: MentorRecommendation[] = aiRecommendations.slice(0, 3).map(
      (recommendation) => ({
        ...recommendation,
        actionSteps: recommendation.actionSteps ?? [],
      })
    );

    try {
      await persistRecommendations({
        userId: currentUserId,
        source: "ai",
        recommendations: finalRecommendations,
        referenceDate: now,
      });
    } catch (persistError) {
      console.error("Error caching AI recommendations:", persistError);
    }

    return NextResponse.json({
      source: "ai",
      recommendations: finalRecommendations,
    });
  } catch (error) {
    console.error("Error generating dashboard insights:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fallback = buildFallbackRecommendations({
      weakTopics: promptInput?.weakTopics ?? [],
      activeGoals: promptInput?.activeGoals ?? [],
      lowScoreAttempts: promptInput?.lowScoreAttempts ?? [],
      resourceCatalog:
        resourceCatalog.length > 0
          ? resourceCatalog
          : buildResourceCatalog({
              recommendedCourseNames: [],
              competitionItems: [],
            }),
    });

    if (userId) {
      try {
        await persistRecommendations({
          userId,
          source: "fallback-error",
          recommendations: fallback,
          referenceDate: now,
        });
      } catch (persistError) {
        console.error("Error caching fallback-error recommendations:", persistError);
      }
    }

    return NextResponse.json({
      source: "fallback-error",
      recommendations: fallback,
    });
  }
}


