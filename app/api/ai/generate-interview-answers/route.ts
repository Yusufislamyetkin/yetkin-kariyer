import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInterviewAnswers } from "@/lib/ai/generate-interview-answers";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cvData, questions } = body;

    if (!cvData || !questions) {
      return NextResponse.json(
        { error: "CV data ve questions gereklidir" },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Questions bir array olmalıdır" },
        { status: 400 }
      );
    }

    // Otomatik cevapları oluştur
    const answers = await generateInterviewAnswers(cvData, questions);

    return NextResponse.json(answers);
  } catch (error: any) {
    console.error("[GENERATE_ANSWERS_API] Hata:", error);
    return NextResponse.json(
      { error: `Cevaplar oluşturulurken bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}
