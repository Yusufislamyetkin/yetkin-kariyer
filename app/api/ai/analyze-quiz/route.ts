import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyzeQuizResults } from "@/lib/ai/analysis";
import { AIAnalysis } from "@/types";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quizAttemptId, force = false } = body;
    const forceRegenerate = Boolean(force);

    const attempt = await db.quizAttempt.findUnique({
      where: { id: quizAttemptId },
      include: {
        quiz: {
          include: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!attempt || attempt.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { error: "Quiz attempt bulunamadı" },
        { status: 404 }
      );
    }

    if (attempt.aiAnalysis) {
      const existingAnalysis = attempt.aiAnalysis as unknown as AIAnalysis;
      const needsUpgrade =
        !existingAnalysis ||
        typeof existingAnalysis.summary !== "string" ||
        existingAnalysis.summary.trim().length < 20 ||
        !Array.isArray(existingAnalysis.focusAreas) ||
        !Array.isArray(existingAnalysis.nextSteps);

      if (!forceRegenerate && !needsUpgrade) {
        return NextResponse.json({ analysis: existingAnalysis });
      }
    }

    const questions = attempt.quiz.questions as any[];
    const answers = attempt.answers as number[];

    const analysis = await analyzeQuizResults({
      quizTitle: attempt.quiz.title,
      courseTitle: attempt.quiz.course?.title,
      quizTopic: attempt.quiz.topic,
      quizLevel: attempt.quiz.level,
      questions,
      answers,
      score: attempt.score,
      durationSeconds: attempt.duration ?? null,
    });

    await db.quizAttempt.update({
      where: { id: quizAttemptId },
      data: {
        aiAnalysis: analysis as any,
      },
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error analyzing quiz:", error);
    return NextResponse.json(
      { error: "Analiz yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

