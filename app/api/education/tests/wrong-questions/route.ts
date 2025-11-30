import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Kullanıcının yanlış cevapladığı soruları kontrol et
    const wrongQuestionsCount = await db.wrongQuestion.count({
      where: {
        userId: userId,
      },
    });

    // Kullanıcının review edilmemiş yanlış soruları var mı kontrol et
    const unreviewedWrongQuestionsCount = await db.wrongQuestion.count({
      where: {
        userId: userId,
        status: "not_reviewed",
      },
    });

    return NextResponse.json({
      hasWrongQuestions: wrongQuestionsCount > 0,
      wrongQuestionsCount,
      unreviewedWrongQuestionsCount,
    });
  } catch (error) {
    console.error("Error checking wrong questions:", error);
    return NextResponse.json(
      { error: "Yanlış sorular kontrol edilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

