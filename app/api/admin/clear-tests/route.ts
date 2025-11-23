import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete tests that were added via admin panel (type = "TEST" AND courseId = null)
    // Prisma enum kontrolü için önce tüm quiz'leri al, sonra JavaScript'te filtrele
    const allQuizzes = await db.quiz.findMany({
      select: {
        id: true,
        type: true,
        courseId: true,
      },
    });

    // JavaScript'te type TEST olan ve courseId null olan quiz'leri filtrele
    // Bu, admin panelinden eklenen test teknolojilerini kaldırır
    const testQuizIds = allQuizzes
      .filter((quiz: { type: string | null; courseId: string | null }) => {
        const typeStr = String(quiz.type || "").toUpperCase();
        const isTestType = typeStr === "TEST";
        const hasNoCourse = quiz.courseId === null || quiz.courseId === undefined;
        return isTestType && hasNoCourse;
      })
      .map((quiz: { id: string }) => quiz.id);

    // Filtrelenmiş test quiz'lerini sil
    const result = await db.quiz.deleteMany({
      where: {
        id: {
          in: testQuizIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} test başarıyla silindi.`,
    });
  } catch (error: any) {
    console.error("Error clearing tests:", error);
    return NextResponse.json(
      { error: error.message || "Testler temizlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}


