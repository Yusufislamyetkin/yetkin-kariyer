import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import liveCodingCases from "@/data/live-coding-cases.json";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let deleted = 0;
    const errors: Array<{ id: string; error: string }> = [];

    // Collect all case IDs from JSON
    const caseIds: string[] = [];
    for (const languageData of liveCodingCases.languages) {
      for (const caseItem of languageData.cases) {
        caseIds.push(`quiz-${caseItem.id}`);
      }
    }

    // Delete each quiz
    for (const quizId of caseIds) {
      try {
        await db.quiz.delete({
          where: { id: quizId },
        });
        deleted++;
      } catch (error: any) {
        // If quiz doesn't exist, that's okay - just skip it
        if (error.code !== "P2025") {
          errors.push({
            id: quizId,
            error: error.message || "Bilinmeyen hata",
          });
        }
      }
    }

    // Also delete courses created for languages (optional - you might want to keep them)
    // Uncomment if you want to delete courses too:
    /*
    for (const languageData of liveCodingCases.languages) {
      const courseId = `course-${languageData.id}-live-coding`;
      try {
        await db.course.delete({
          where: { id: courseId },
        });
      } catch (error: any) {
        // Course might not exist or have dependencies
        if (error.code !== "P2025") {
          console.error(`Error deleting course ${courseId}:`, error);
        }
      }
    }
    */

    return NextResponse.json({
      success: true,
      deleted,
      errors: errors.length > 0 ? errors : undefined,
      message: `${deleted} adet canlı kodlama case'i başarıyla silindi.${errors.length > 0 ? ` ${errors.length} hata oluştu.` : ""}`,
    });
  } catch (error: any) {
    console.error("Error deleting live coding cases:", error);
    return NextResponse.json(
      { error: error.message || "Case'ler silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

