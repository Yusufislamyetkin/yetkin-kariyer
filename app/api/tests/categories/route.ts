import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log("[API_TEST_CATEGORIES] Fetching test categories from database...");
    
    // Get all tests (TEST type only, exclude MINI_TEST) - bağımsız testler
    // Testler artık courseId'ye bağlı değil, kendi expertise bilgilerini kullanabilir
    const quizzes = await db.quiz.findMany({
      where: {
        type: "TEST", // Sadece TEST tipi, MINI_TEST hariç
      },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true, // Test'in kendi topic bilgisi
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

    // Group by expertise - test'in kendi topic'ini veya course'un expertise'sini kullan
    const categoriesMap = new Map<string, {
      expertise: string;
      testCount: number;
      description: string | null;
      topic: string | null;
      topicContent: string | null;
    }>();

    quizzes.forEach((quiz: {
      id: string;
      title: string;
      description: string | null;
      topic: string | null;
      course: {
        expertise: string | null;
        topic: string | null;
        topicContent: string | null;
        title: string | null;
      } | null;
    }) => {
      // Test'in kendi topic'ini kullan, yoksa course'un expertise'sini kullan
      // Gelecekte testler tamamen bağımsız olacak, şimdilik course'dan fallback alıyoruz
      const expertise = quiz.topic || quiz.course?.expertise || quiz.course?.topic;
      if (!expertise) return;

      if (!categoriesMap.has(expertise)) {
        categoriesMap.set(expertise, {
          expertise,
          testCount: 0,
          description: quiz.description || quiz.course?.title || null,
          topic: quiz.topic || quiz.course?.topic || null,
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

