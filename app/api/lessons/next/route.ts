import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonSlug = searchParams.get("lessonSlug");

    if (!lessonSlug) {
      return NextResponse.json({ error: "lessonSlug is required" }, { status: 400 });
    }

    // Find the lesson and its module
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    let allTopics: Array<{ href: string; label: string }> = [];
    let currentIndex = -1;

    for (const course of courses) {
      const normalized = normalizeCourseContent(course.content, null, null);
      const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

      for (const courseModule of modules) {
        if (!courseModule || typeof courseModule !== "object") {
          continue;
        }

        const topics = Array.isArray((courseModule as any).relatedTopics)
          ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
          : [];

        // Get all topics from this module
        const moduleTopics = topics
          .filter((topic) => topic?.href)
          .map((topic) => ({
            href: topic.href || "",
            label: (topic.label as string) || "",
          }));

        // Find current lesson index
        const foundIndex = moduleTopics.findIndex((topic) => topic.href === lessonSlug);
        if (foundIndex !== -1) {
          allTopics = moduleTopics;
          currentIndex = foundIndex;
          break;
        }
      }

      if (currentIndex !== -1) break;
    }

    if (currentIndex === -1 || allTopics.length === 0) {
      return NextResponse.json({ nextLesson: null });
    }

    // Find the next lesson (the one after current in the array)
    const nextIndex = currentIndex + 1;
    const nextLesson = nextIndex < allTopics.length ? allTopics[nextIndex] : null;

    return NextResponse.json({ nextLesson });
  } catch (error) {
    console.error("Error finding next lesson:", error);
    return NextResponse.json(
      { error: "Failed to find next lesson" },
      { status: 500 }
    );
  }
}

