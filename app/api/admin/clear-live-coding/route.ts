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

    // Delete ALL live coding quizzes (type = "LIVE_CODING")
    const result = await db.quiz.deleteMany({
      where: {
        type: "LIVE_CODING",
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} canlı kodlama case'i başarıyla silindi.`,
    });
  } catch (error: any) {
    console.error("Error clearing live coding:", error);
    return NextResponse.json(
      { error: error.message || "Canlı kodlama case'leri temizlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

