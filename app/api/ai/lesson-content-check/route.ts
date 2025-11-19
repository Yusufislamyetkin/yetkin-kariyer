import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";

function ensureString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeLessonTopic(topic: Record<string, any>, slug: string) {
  return {
    label: ensureString(topic.label) ?? "Ders",
    href: slug,
    description: ensureString(topic.description),
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
        expertise: true,
        topic: true,
        topicContent: true,
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
            course: {
              id: course.id,
              title: course.title,
              expertise: course.expertise,
              topic: course.topic,
              topicContent: course.topicContent,
            },
            lesson: normalizeLessonTopic(lesson as Record<string, any>, slug),
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
      expertise: true,
      topic: true,
      topicContent: true,
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
          course: {
            id: course.id,
            title: course.title,
            expertise: course.expertise,
            topic: course.topic,
            topicContent: course.topicContent,
          },
          lesson: normalizeLessonTopic(lesson as Record<string, any>, slug),
        };
      }
    }
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonSlug = searchParams.get("lessonSlug");

    if (!lessonSlug) {
      return NextResponse.json({ error: "lessonSlug parameter is required" }, { status: 400 });
    }

    // Find lesson and course info
    const lessonMatch = await findLessonBySlug(lessonSlug);
    if (!lessonMatch) {
      return NextResponse.json({
        tests: [],
        quizzes: [],
        bugfixes: [],
        livecodings: [],
      });
    }

    const { course } = lessonMatch;

    // Build where clause for quiz search
    const courseWhere: any = {};
    if (course.expertise) {
      courseWhere.expertise = course.expertise;
    }
    if (course.topic) {
      courseWhere.topic = course.topic;
    }
    if (course.topicContent) {
      courseWhere.topicContent = course.topicContent;
    }

    // Find all quizzes related to this course topic
    const whereClause: any = {
      type: {
        not: "MINI_TEST",
      },
    };

    if (Object.keys(courseWhere).length > 0) {
      whereClause.course = {
        ...courseWhere,
      };
    }

    const quizzes = await db.quiz.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        level: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by type
    const tests = quizzes
      .filter((q: { type?: string | null }) => q.type === "TEST")
      .map((q: { id: string; title: string; description: string | null; level: string | null }) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        level: q.level,
        url: `/education/test/${q.id}`,
      }));

    const quizItems = quizzes
      .filter((q: { type?: string | null }) => q.type === "TEST" || !q.type) // General quizzes
      .map((q: { id: string; title: string; description: string | null; level: string | null }) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        level: q.level,
        url: `/education/quiz/${q.id}`,
      }));

    const bugfixes = quizzes
      .filter((q: { type?: string | null }) => q.type === "BUG_FIX")
      .map((q: { id: string; title: string; description: string | null; level: string | null }) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        level: q.level,
        url: `/education/bug-fix/${q.id}`,
      }));

    const livecodings = quizzes
      .filter((q: { type?: string | null }) => q.type === "LIVE_CODING")
      .map((q: { id: string; title: string; description: string | null; level: string | null }) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        level: q.level,
        url: `/education/live-coding/${q.id}`,
      }));

    return NextResponse.json({
      tests,
      quizzes: quizItems,
      bugfixes,
      livecodings,
      course: {
        expertise: course.expertise,
        topic: course.topic,
        topicContent: course.topicContent,
      },
    });
  } catch (error) {
    console.error("Error checking lesson content:", error);
    return NextResponse.json(
      { error: "İçerik kontrolü sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

