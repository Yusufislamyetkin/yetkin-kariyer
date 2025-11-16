import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Compass, Layers, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { LessonExperience } from "../_components/LessonExperience";

type LessonCalloutVariant = "tip" | "info" | "warning" | "success";

type LessonContentBlock =
  | { type: "text"; body: string }
  | { type: "code"; code: string; language?: string; explanation?: string }
  | { type: "list"; items: string[]; ordered?: boolean; title?: string }
  | { type: "callout"; variant?: LessonCalloutVariant; title?: string; body: string }
  | { type: "quote"; body: string; attribution?: string };

type LessonSection = {
  id: string;
  title: string;
  summary?: string;
  content: LessonContentBlock[];
};

type LessonCheckpoint = {
  id: string;
  question: string;
  options: string[];
  answer?: string;
  rationale?: string;
};

type LessonResource = {
  id: string;
  label: string;
  href?: string;
  type?: string;
  description?: string;
  estimatedMinutes?: number;
};

type LessonPractice = {
  id: string;
  title: string;
  description?: string;
  type?: string;
  estimatedMinutes?: number;
  difficulty?: string;
  instructions: string[];
};

type LessonDetail = {
  label: string;
  href: string;
  description?: string;
  estimatedDurationMinutes?: number;
  level?: string;
  keyTakeaways: string[];
  sections: LessonSection[];
  checkpoints: LessonCheckpoint[];
  resources: LessonResource[];
  practice: LessonPractice[];
};

type LessonMatch = {
  course: {
    id: string;
    title: string;
    description: string | null;
  };
  module: Record<string, any>;
  lesson: LessonDetail;
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
};

function formatMinutes(minutes?: number | null) {
  if (!minutes || minutes <= 0) {
    return null;
  }

  if (minutes < 60) {
    return `${minutes} dk`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return `${hours} saat`;
  }

  return `${hours} saat ${remainder} dk`;
}

function ensureString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function ensureNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }
  return value >= 0 ? value : undefined;
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => ensureString(item))
    .filter((item): item is string => typeof item === "string");
}

function parseContentBlock(block: any): LessonContentBlock | null {
  if (!block || typeof block !== "object") {
    return null;
  }

  const type = ensureString(block.type) ?? "text";

  if (type === "text" && ensureString(block.body)) {
    return { type: "text", body: ensureString(block.body)! };
  }

  if (type === "code" && ensureString(block.code)) {
    return {
      type: "code",
      code: ensureString(block.code)!,
      language: ensureString(block.language),
      explanation: ensureString(block.explanation),
    };
  }

  if (type === "list" && Array.isArray(block.items)) {
    const items = ensureStringArray(block.items);
    if (items.length === 0) {
      return null;
    }
    return {
      type: "list",
      items,
      ordered: Boolean(block.ordered),
      title: ensureString(block.title),
    };
  }

  if (type === "callout" && ensureString(block.body)) {
    const rawVariant = ensureString(block.variant);
    const allowedVariants: LessonCalloutVariant[] = ["tip", "info", "warning", "success"];
    const variant = rawVariant && allowedVariants.includes(rawVariant as LessonCalloutVariant)
      ? (rawVariant as LessonCalloutVariant)
      : undefined;
    return {
      type: "callout",
      body: ensureString(block.body)!,
      title: ensureString(block.title),
      variant,
    };
  }

  if (type === "quote" && ensureString(block.body)) {
    return {
      type: "quote",
      body: ensureString(block.body)!,
      attribution: ensureString(block.attribution),
    };
  }

  return null;
}

function normalizeLessonTopic(topic: Record<string, any>, slug: string): LessonDetail {
  const sections = Array.isArray(topic.sections)
    ? (topic.sections
        .map((section, index) => {
          if (!section || typeof section !== "object") {
            return null;
          }
          const id = ensureString(section.id) ?? `section-${index + 1}`;
          const title = ensureString(section.title) ?? `Bölüm ${index + 1}`;
          const summary = ensureString(section.summary);
          const content = Array.isArray(section.content)
            ? (section.content
                .map((block: any) => parseContentBlock(block))
                .filter(Boolean) as LessonContentBlock[])
            : [];
          return {
            id,
            title,
            summary,
            content,
          };
        })
        .filter(Boolean) as LessonSection[])
    : [];

  const checkpoints = Array.isArray(topic.checkpoints)
    ? (topic.checkpoints
        .map((checkpoint, index) => {
          if (!checkpoint || typeof checkpoint !== "object") {
            return null;
          }
          const id = ensureString(checkpoint.id) ?? `checkpoint-${index + 1}`;
          const question = ensureString(checkpoint.question);
          if (!question) {
            return null;
          }
          return {
            id,
            question,
            options: ensureStringArray(checkpoint.options),
            answer: ensureString(checkpoint.answer),
            rationale: ensureString(checkpoint.rationale),
          };
        })
        .filter(Boolean) as LessonCheckpoint[])
    : [];

  const resources = Array.isArray(topic.resources)
    ? (topic.resources
        .map((resource, index) => {
          if (!resource || typeof resource !== "object") {
            return null;
          }
          return {
            id: ensureString(resource.id) ?? `resource-${index + 1}`,
            label: ensureString(resource.label) ?? `Kaynak ${index + 1}`,
            href: ensureString(resource.href),
            type: ensureString(resource.type),
            description: ensureString(resource.description),
            estimatedMinutes: ensureNumber(resource.estimatedMinutes),
          };
        })
        .filter(Boolean) as LessonResource[])
    : [];

  const practice = Array.isArray(topic.practice)
    ? (topic.practice
        .map((task, index) => {
          if (!task || typeof task !== "object") {
            return null;
          }
          return {
            id: ensureString(task.id) ?? `practice-${index + 1}`,
            title: ensureString(task.title) ?? `Görev ${index + 1}`,
            description: ensureString(task.description),
            type: ensureString(task.type),
            estimatedMinutes: ensureNumber(task.estimatedMinutes),
            difficulty: ensureString(task.difficulty),
            instructions: ensureStringArray(task.instructions),
          };
        })
        .filter(Boolean) as LessonPractice[])
    : [];

  return {
    label: ensureString(topic.label) ?? "Ders",
    href: slug,
    description: ensureString(topic.description),
    estimatedDurationMinutes:
      ensureNumber(topic.estimatedDurationMinutes) ?? ensureNumber(topic.estimatedMinutes),
    level: ensureString(topic.level),
    keyTakeaways: ensureStringArray(topic.keyTakeaways),
    sections,
    checkpoints,
    resources,
    practice,
  };
}

async function findLessonBySlug(slug: string): Promise<LessonMatch | null> {
  // First, try to find lesson in courses table (individual lesson records)
  const lessonId = `lesson-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
  const topicId = `topic-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
  
  // Try to find as individual lesson record
  const lessonRecord = await db.course.findFirst({
    where: {
      OR: [
        { id: lessonId },
        { id: topicId },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      estimatedDuration: true,
      content: true,
    },
  });

  if (lessonRecord) {
    // Found as individual record, now find which module it belongs to
    const lessonContent = (lessonRecord.content as any) || {};
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        estimatedDuration: true,
        content: true,
      },
    });

    for (const course of courses) {
      const normalized = normalizeCourseContent(
        course.content,
        course.estimatedDuration,
        course.description
      );

      const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

      for (const courseModule of modules) {
        if (!courseModule || typeof courseModule !== "object") {
          continue;
        }

        const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
          ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
          : [];

        const lesson = relatedTopics.find((topic) => topic?.href === slug);
        if (lesson && typeof lesson === "object") {
          // Use content from individual record if it has more details
          const enhancedLesson = {
            ...lesson,
            sections: lessonContent.sections || lesson.sections || [],
            checkpoints: lessonContent.checkpoints || lesson.checkpoints || [],
            resources: lessonContent.resources || lesson.resources || [],
            practice: lessonContent.practice || lesson.practice || [],
            keyTakeaways: lessonContent.keyTakeaways || lesson.keyTakeaways || [],
          };

          return {
            course,
            module: courseModule as Record<string, any>,
            lesson: normalizeLessonTopic(enhancedLesson as Record<string, any>, slug),
            overview: normalized.overview,
          };
        }
      }
    }

    // If lesson record found but not in relatedTopics, create a lesson from the record
    const minimalLesson = {
      label: lessonRecord.title || lessonContent.label || 'Ders',
      href: slug,
      description: lessonRecord.description || lessonContent.description,
      estimatedDurationMinutes: lessonRecord.estimatedDuration || lessonContent.estimatedDurationMinutes,
      level: lessonContent.level,
      keyTakeaways: lessonContent.keyTakeaways || [],
      sections: lessonContent.sections || [],
      checkpoints: lessonContent.checkpoints || [],
      resources: lessonContent.resources || [],
      practice: lessonContent.practice || [],
    };

    // Try to find the course-dotnet-roadmap to get module info
    const roadmapCourse = await db.course.findUnique({
      where: { id: 'course-dotnet-roadmap' },
      select: {
        id: true,
        title: true,
        description: true,
        estimatedDuration: true,
        content: true,
      },
    });

    if (roadmapCourse) {
      const normalized = normalizeCourseContent(
        roadmapCourse.content,
        roadmapCourse.estimatedDuration,
        roadmapCourse.description
      );

      // Find first module that might contain this lesson (fallback)
      const modules = Array.isArray(normalized.modules) ? normalized.modules : [];
      const firstModule = modules.length > 0 ? modules[0] : null;

      return {
        course: roadmapCourse,
        module: firstModule as Record<string, any> || { id: 'unknown', title: 'Modül' },
        lesson: normalizeLessonTopic(minimalLesson as Record<string, any>, slug),
        overview: normalized.overview || { description: '', estimatedDurationMinutes: 0 },
      };
    }
  }

  // Fallback: search in relatedTopics only
  const courses = await db.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      estimatedDuration: true,
      content: true,
    },
  });

  for (const course of courses) {
    const normalized = normalizeCourseContent(
      course.content,
      course.estimatedDuration,
      course.description
    );

    const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

    for (const courseModule of modules) {
      if (!courseModule || typeof courseModule !== "object") {
        continue;
      }

      const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
        ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
        : [];

      const lesson = relatedTopics.find((topic) => topic?.href === slug);
      if (lesson && typeof lesson === "object") {
        return {
          course,
          module: courseModule as Record<string, any>,
          lesson: normalizeLessonTopic(lesson as Record<string, any>, slug),
          overview: normalized.overview,
        };
      }
    }
  }

  return null;
}

export default async function LessonPage({
  params,
}: {
  params: { lessonSlug: string[] };
}) {
  const slugSegments = Array.isArray(params.lessonSlug) ? params.lessonSlug : [];
  if (slugSegments.length === 0) {
    notFound();
  }

  const slugPath = slugSegments.join("/");
  const lessonHref = `/education/lessons/${slugPath}`;

  const result = await findLessonBySlug(lessonHref);

  if (!result) {
    notFound();
  }

  const { course, module, lesson, overview } = result;

  const moduleId = typeof module.id === "string" ? (module.id as string) : undefined;
  const backHref = moduleId
    ? `/education/courses/${course.id}?module=${encodeURIComponent(moduleId)}`
    : `/education/courses/${course.id}`;

  const moduleSummary =
    typeof module.summary === "string"
      ? module.summary
      : "Bu modül içerisindeki derse ait özet içerik yakında eklenecek.";
  const moduleObjectives = Array.isArray(module.objectives) ? module.objectives : [];
  const activities = Array.isArray(module.activities) ? module.activities : [];
  const lessonKeyTakeaways = Array.isArray(lesson.keyTakeaways) ? lesson.keyTakeaways : [];
  const lessonSections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const lessonCheckpoints = Array.isArray(lesson.checkpoints) ? lesson.checkpoints : [];
  const lessonResources = Array.isArray(lesson.resources) ? lesson.resources : [];
  const lessonPractice = Array.isArray(lesson.practice) ? lesson.practice : [];

  const lessonDuration = formatMinutes(lesson.estimatedDurationMinutes);
  const lessonLevel = lesson.level;

  const relatedTopics = Array.isArray(module.relatedTopics)
    ? module.relatedTopics.filter((topic: any) => topic?.href && topic.href !== lessonHref)
    : [];

  const moduleDuration = formatMinutes(
    typeof module.durationMinutes === "number" ? module.durationMinutes : undefined
  );

  const lessonInfoItems = [
    lessonLevel && { label: "Seviye", value: lessonLevel },
    lessonDuration && { label: "Tahmini ders süresi", value: lessonDuration },
    lessonSections.length > 0 && { label: "Bölüm sayısı", value: `${lessonSections.length} bölüm` },
    lessonCheckpoints.length > 0 && {
      label: "Kontrol noktası",
      value: `${lessonCheckpoints.length} adet`,
    },
    lessonPractice.length > 0 && {
      label: "Pratik görev",
      value: `${lessonPractice.length} adet`,
    },
    lessonResources.length > 0 && {
      label: "Kaynak",
      value: `${lessonResources.length} adet`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Modüle dön
      </Link>

      <Card variant="elevated" className="border-blue-100 bg-blue-50/60">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <Compass className="h-4 w-4" />
            {course.title}
            <span className="text-blue-400">/</span>
            {String(module.title ?? "Modül")}
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            {lesson.label}
          </CardTitle>
          <p className="text-sm text-blue-900">
            {lesson.description ??
              "Bu ders için detaylı açıklama kısa süre içinde paylaşıldığında burada yer alacak."}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Modül Özeti
            </p>
            <p className="mt-1 text-sm text-gray-700">{moduleSummary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-800">
            {lessonLevel && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {lessonLevel}
              </span>
            )}
            {lessonDuration && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold">
                <Clock className="h-4 w-4" />
                {lessonDuration}
              </span>
            )}
            {moduleDuration && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold">
                <Clock className="h-4 w-4" />
                {moduleDuration}
              </span>
            )}
            {formatMinutes(overview.estimatedDurationMinutes) && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold">
                <Layers className="h-4 w-4" />
                {formatMinutes(overview.estimatedDurationMinutes)} toplam süre
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <LessonExperience
        lessonSlug={lessonHref}
        lessonTitle={lesson.label}
        lessonDescription={lesson.description ?? null}
        lessonKeyTakeaways={lessonKeyTakeaways}
        lessonSections={lessonSections}
        lessonCheckpoints={lessonCheckpoints}
        lessonResources={lessonResources}
        lessonPractice={lessonPractice}
        lessonInfoItems={lessonInfoItems}
        moduleObjectives={moduleObjectives}
        moduleLessons={relatedTopics}
        moduleTitle={String(module.title ?? "Modül")}
        moduleSummary={moduleSummary}
        activities={activities}
        onBackHref={backHref}
      />
    </div>
  );
}


