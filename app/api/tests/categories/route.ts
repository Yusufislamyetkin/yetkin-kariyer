import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log("[API_TEST_CATEGORIES] Fetching test categories from database...");
    
    // Get all tests grouped by course.expertise
    const quizzes = await db.quiz.findMany({
      where: {
        type: "TEST",
      },
      select: {
        id: true,
        course: {
          select: {
            expertise: true,
            topic: true,
            topicContent: true,
            title: true,
          },
        },
      },
    });

    console.log(`[API_TEST_CATEGORIES] Found ${quizzes.length} tests in database`);

    // Group by expertise
    const categoriesMap = new Map<string, {
      expertise: string;
      testCount: number;
      description: string | null;
      topic: string | null;
      topicContent: string | null;
    }>();

    quizzes.forEach((quiz: {
      id: string;
      course: {
        expertise: string | null;
        topic: string | null;
        topicContent: string | null;
        title: string | null;
      } | null;
    }) => {
      const expertise = quiz.course?.expertise;
      if (!expertise) return;

      if (!categoriesMap.has(expertise)) {
        categoriesMap.set(expertise, {
          expertise,
          testCount: 0,
          description: quiz.course?.title || null,
          topic: quiz.course?.topic || null,
          topicContent: quiz.course?.topicContent || null,
        });
      }

      const category = categoriesMap.get(expertise)!;
      category.testCount++;
    });

    const categories = Array.from(categoriesMap.values()).sort((a, b) => 
      a.expertise.localeCompare(b.expertise)
    );

    console.log(`[API_TEST_CATEGORIES] Returning ${categories.length} categories`);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[API_TEST_CATEGORIES] Error fetching test categories:", error);
    return NextResponse.json(
      { error: "Test kategorileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

