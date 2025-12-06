import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";
import { technologyToRoute } from "@/lib/utils/technology-normalize";

export const dynamic = 'force-dynamic';

function ensureString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Parses quiz ID to extract technology, module, and testId
 * Handles formats like "test-{tech}-module-{num}-lesson-{num}" or just "{testId}"
 * Example: "test-net-core-module-06-lesson-04" -> { technology: "net-core", moduleName: "module-06", testId: "lesson-04" }
 */
function parseQuizId(quizId: string): { technology: string | null; moduleName: string | null; testId: string } {
  // Check if quiz ID follows format: test-{tech}-module-{num}-lesson-{num}
  if (quizId.startsWith("test-")) {
    // Remove "test-" prefix
    const withoutPrefix = quizId.substring(5);
    
    // Find "module-" in the string
    const moduleIndex = withoutPrefix.indexOf("module-");
    if (moduleIndex === -1) {
      // No module found, return as-is
      return { technology: null, moduleName: null, testId: quizId };
    }
    
    // Find "lesson-" after "module-"
    const afterModule = withoutPrefix.substring(moduleIndex);
    const lessonIndex = afterModule.indexOf("lesson-");
    if (lessonIndex === -1) {
      // No lesson found, return as-is
      return { technology: null, moduleName: null, testId: quizId };
    }
    
    // Extract technology (everything before "module-")
    const technology = withoutPrefix.substring(0, moduleIndex).replace(/-$/, ""); // Remove trailing dash if any
    
    // Extract module (from "module-" to before "lesson-")
    const modulePart = afterModule.substring(0, lessonIndex).replace(/-$/, ""); // Remove trailing dash
    const moduleName = modulePart; // e.g., "module-06"
    
    // Extract testId (from "lesson-" to the end)
    const testId = afterModule.substring(lessonIndex); // e.g., "lesson-04"
    
    return { technology, moduleName, testId };
  }
  // If format doesn't match, return testId as-is
  return { technology: null, moduleName: null, testId: quizId };
}

/**
 * Generates the correct URL for a test quiz
 */
function generateTestUrl(quizId: string): string {
  // Try to parse from quiz ID format: test-{tech}-module-{num}-lesson-{num}
  const parsed = parseQuizId(quizId);
  if (parsed.technology && parsed.moduleName && parsed.testId) {
    const technologyRoute = technologyToRoute(parsed.technology);
    const moduleSlug = encodeURIComponent(parsed.moduleName);
    const testIdSlug = encodeURIComponent(parsed.testId);
    return `/education/tests/${technologyRoute}/${moduleSlug}/${testIdSlug}`;
  }
  
  // Fallback to tests listing page when technology/module info is missing
  return `/education/tests`;
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
        url: generateTestUrl(q.id),
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

