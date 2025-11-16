import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json(
        { error: "Geçersiz bug fix ID'si" },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "BUG_FIX",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            expertise: true,
            topic: true,
            topicContent: true,
            difficulty: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: `Bug fix bulunamadı (ID: ${params.id})` },
        { status: 404 }
      );
    }

    // Questions field'ının varlığını kontrol et
    if (!quiz.questions) {
      console.error(`[BUG_FIX] Quiz ${params.id} has no questions field`);
      return NextResponse.json(
        { error: "Bug fix içeriği eksik veya bozuk" },
        { status: 500 }
      );
    }

    // Questions'un geçerli bir yapıda olduğunu kontrol et
    try {
      const questionsData = quiz.questions as any;
      // Tasks array veya object olup olmadığını kontrol et
      const hasTasks = Array.isArray(questionsData) || 
                      (typeof questionsData === "object" && questionsData !== null && 
                       (Array.isArray(questionsData.tasks) || Array.isArray(questionsData)));
      
      if (!hasTasks) {
        console.error(`[BUG_FIX] Quiz ${params.id} has invalid questions structure:`, questionsData);
        return NextResponse.json(
          { error: "Bug fix görevleri bulunamadı veya geçersiz format" },
          { status: 500 }
        );
      }
    } catch (validationError) {
      console.error(`[BUG_FIX] Error validating quiz ${params.id} questions:`, validationError);
      return NextResponse.json(
        { 
          error: "Bug fix verisi işlenirken bir hata oluştu",
          details: process.env.NODE_ENV === "development" 
            ? (validationError instanceof Error ? validationError.message : String(validationError))
            : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("[BUG_FIX] Error fetching bug fix:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { 
        error: "Bug fix yüklenirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fixedCode, metrics, duration } = body;

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "BUG_FIX",
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Bug fix bulunamadı" }, { status: 404 });
    }

    const userId = session.user.id as string;

    // BugFixAttempt oluştur
    const bugFixAttempt = await db.bugFixAttempt.create({
      data: {
        userId,
        quizId: params.id,
        fixedCode: fixedCode || null,
        metrics: metrics || {
          bugsFixed: 0,
          timeTaken: duration ? parseInt(duration) : null,
          codeQuality: 0,
        },
      },
    });

    // AI analysis'i background'da yap
    if (process.env.OPENAI_API_KEY && process.env.NEXTAUTH_URL) {
      fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bugFixAttemptId: bugFixAttempt.id }),
      }).catch(() => {});
    }

    return NextResponse.json({ bugFixAttempt });
  } catch (error) {
    console.error("[BUG_FIX] Error submitting bug fix:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { 
        error: "Bug fix gönderilirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

