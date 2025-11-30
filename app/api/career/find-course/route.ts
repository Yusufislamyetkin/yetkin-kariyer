import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * API endpoint to find a course by title
 * GET /api/career/find-course?title=React
 * Returns: { courseId: "course-react", found: true, title: "React" } or { found: false }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title parameter is required" },
        { status: 400 }
      );
    }

    const searchTitle = title.trim();

    // Filter out placeholder texts
    const placeholderTexts = [
      "platform içi link",
      "platform içi link (varsa)",
      "link yoksa",
      "varsa",
      "link",
    ];

    const isPlaceholder = placeholderTexts.some(
      (placeholder) => searchTitle.toLowerCase().includes(placeholder.toLowerCase())
    );

    if (isPlaceholder) {
      return NextResponse.json({ found: false });
    }

    // Search for courses using case-insensitive contains
    // Try exact match first
    let course = await db.course.findFirst({
      where: {
        title: {
          equals: searchTitle,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    // If no exact match, try contains
    if (!course) {
      course = await db.course.findFirst({
        where: {
          title: {
            contains: searchTitle,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // If still no match, try partial matching by splitting the search title
    if (!course && searchTitle.split(" ").length > 1) {
      const words = searchTitle.split(" ").filter((w) => w.length > 2);
      for (const word of words) {
        const partialMatch = await db.course.findFirst({
          where: {
            title: {
              contains: word,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            title: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (partialMatch) {
          course = partialMatch;
          break;
        }
      }
    }

    if (course) {
      return NextResponse.json({
        found: true,
        courseId: course.id,
        title: course.title,
      });
    }

    return NextResponse.json({ found: false });
  } catch (error) {
    console.error("Error finding course:", error);
    return NextResponse.json(
      { error: "Kurs aranırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

