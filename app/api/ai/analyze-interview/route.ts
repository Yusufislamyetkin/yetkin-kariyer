import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyzeInterview } from "@/lib/ai/interview";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interviewAttemptId, force = false } = body as {
      interviewAttemptId: string;
      force?: boolean;
    };

    const attempt = await db.interviewAttempt.findUnique({
      where: { id: interviewAttemptId },
      include: {
        interview: {
          select: {
            title: true,
            questions: true,
          },
        },
      },
    });

    if (!attempt || attempt.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { error: "Interview attempt bulunamadı" },
        { status: 404 }
      );
    }

    if (!force && attempt.aiFeedback && attempt.aiScore !== null) {
      return NextResponse.json({
        analysis: {
          score: attempt.aiScore,
          feedback: attempt.aiFeedback,
          transcript: attempt.transcript,
          questionScores: attempt.questionScores as any,
          questionFeedback: attempt.questionFeedback as any,
          questionCorrectness: attempt.questionCorrectness as any,
        },
      });
    }

    // Soruları parse et
    let questions: Array<{ id: string; question?: string; prompt?: string; type?: string }> = [];
    let questionOrder: string[] = [];
    
    if (attempt.interview?.questions) {
      try {
        const parsedQuestions = typeof attempt.interview.questions === "string"
          ? JSON.parse(attempt.interview.questions)
          : attempt.interview.questions;
        
        if (Array.isArray(parsedQuestions)) {
          questions = parsedQuestions.map((q: any) => ({
            id: q.id || String(Math.random()),
            question: q.question,
            prompt: q.prompt,
            type: q.type,
          }));
          questionOrder = questions.map((q) => q.id);
        }
      } catch (error) {
        console.error("[analyze-interview] Sorular parse edilemedi:", error);
      }
    }

    // Transkriptten questionOrder'ı çıkar (eğer varsa)
    try {
      if (attempt.transcript) {
        const parsedTranscript = JSON.parse(attempt.transcript);
        if (parsedTranscript?.questionOrder && Array.isArray(parsedTranscript.questionOrder)) {
          questionOrder = parsedTranscript.questionOrder;
        }
      }
    } catch (error) {
      // ignore
    }

    const analysis = await analyzeInterview({
      videoUrl: attempt.videoUrl,
      interviewTitle: attempt.interview?.title,
      existingTranscript: attempt.transcript,
      questions: questions.length > 0 ? questions : undefined,
      questionOrder: questionOrder.length > 0 ? questionOrder : undefined,
    });

    await db.interviewAttempt.update({
      where: { id: interviewAttemptId },
      data: {
        transcript: analysis.transcript,
        aiScore: analysis.score,
        aiFeedback: analysis.feedback as any,
        questionScores: analysis.questionScores ? (analysis.questionScores as any) : null,
        questionFeedback: analysis.questionFeedback ? (analysis.questionFeedback as any) : null,
        questionCorrectness: analysis.questionCorrectness ? (analysis.questionCorrectness as any) : null,
      },
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error analyzing interview:", error);
    return NextResponse.json(
      { error: "Analiz yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

