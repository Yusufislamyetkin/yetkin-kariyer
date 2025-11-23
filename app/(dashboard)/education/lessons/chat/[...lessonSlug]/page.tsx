import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";
import { LessonChatWrapper } from "./LessonChatWrapper";

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
    <div className="-m-4 lg:-m-6 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
      <LessonChatWrapper
        lessonSlug={lessonHref}
        lessonTitle={lesson.label}
        lessonDescription={lesson.description}
        backHref={backHref}
        courseTitle={course.title}
        moduleTitle={moduleTitle}
      />
    </div>
  );
}

