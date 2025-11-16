import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, BookOpen, Loader2 } from "lucide-react";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";
import { Card, CardContent } from "@/app/components/ui/Card";
import { LessonChat } from "../../_components/LessonChat";

function ensureString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => ensureString(item))
    .filter((item): item is string => typeof item === "string");
}

function normalizeLessonTopic(topic: Record<string, any>, slug: string) {
  return {
    label: ensureString(topic.label) ?? "Ders",
    href: slug,
    description: ensureString(topic.description),
    keyTakeaways: ensureStringArray(topic.keyTakeaways),
  };
}

async function findLessonBySlug(slug: string) {
  const lessonId = `lesson-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
  const topicId = `topic-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;

  const lessonRecord = await db.course.findFirst({
    where: {
      OR: [{ id: lessonId }, { id: topicId }],
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
          const enhancedLesson = {
            ...lesson,
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

export default async function LessonChatPage({
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

  const { course, module, lesson } = result;

  const moduleId = typeof module.id === "string" ? (module.id as string) : undefined;
  const backHref = moduleId
    ? `/education/courses/${course.id}?module=${encodeURIComponent(moduleId)}`
    : `/education/courses/${course.id}`;

  const moduleTitle = typeof module.title === "string" ? (module.title as string) : "Modül";

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 md:px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
            Geri
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full inline-flex">
              <BookOpen className="h-3 w-3" />
              {course.title} / {moduleTitle}
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent truncate mt-2">
              {lesson.label}
            </h1>
            {lesson.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate mt-1">
                {lesson.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <LessonChat
          lessonSlug={lessonHref}
          lessonTitle={lesson.label}
          lessonDescription={lesson.description}
        />
      </div>
    </div>
  );
}

