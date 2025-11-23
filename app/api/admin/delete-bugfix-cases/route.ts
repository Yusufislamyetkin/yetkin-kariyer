import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bugfixCases from "@/data/bugfix-cases.json";

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
    for (const languageData of bugfixCases.languages) {
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

    return NextResponse.json({
      success: true,
      deleted,
      errors: errors.length > 0 ? errors : undefined,
      message: `${deleted} adet bugfix case'i başarıyla silindi.${errors.length > 0 ? ` ${errors.length} hata oluştu.` : ""}`,
    });
  } catch (error: any) {
    console.error("Error deleting bugfix cases:", error);
    return NextResponse.json(
      { error: error.message || "Bugfix case'leri silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

