import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  checkBadgesForAttempt,
  type BadgeCheckResult,
} from "@/app/api/badges/check/badge-service";
import {
  checkGoalsForToday,
  type GoalCheckResult,
} from "@/app/api/goals/check/goal-service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await db.quiz.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!quiz || quiz.type === "MINI_TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: "Test yüklenirken bir hata oluştu" },
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
    const { answers, duration } = body;

    const quiz = await db.quiz.findUnique({
      where: { id: params.id },
    });

    if (!quiz || quiz.type === "MINI_TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    const questions = quiz.questions as any[];
    let correctCount = 0;
    const wrongQuestions: Array<{
      questionId: string;
      questionText: string;
      correctAnswer: string;
      userAnswer: string;
    }> = [];

    questions.forEach((question: any, index: number) => {
      const userAnswerIndex = answers[index];
      const correctAnswerIndex = question.correctAnswer;
      
      if (userAnswerIndex === correctAnswerIndex) {
        correctCount++;
      } else {
        // Yanlış soru bulundu
        wrongQuestions.push({
          questionId: question.id || `q-${index}`,
          questionText: question.question,
          correctAnswer: question.options[correctAnswerIndex] || String(correctAnswerIndex),
          userAnswer: question.options[userAnswerIndex] || String(userAnswerIndex),
        });
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    const userId = session.user.id as string;

    const quizAttempt = await db.quizAttempt.create({
      data: {
        userId,
        quizId: params.id,
        score,
        answers: answers as any,
        duration: duration ? parseInt(duration) : null,
        topic: quiz.topic || null,
        level: quiz.level || null,
      },
    });

        // Yanlış soruları WrongQuestion tablosuna kaydet
        if (wrongQuestions.length > 0) {
          try {
            await db.wrongQuestion.createMany({
              data: wrongQuestions.map((wq) => ({
                userId,
                quizAttemptId: quizAttempt.id,
                questionId: wq.questionId,
                questionText: wq.questionText,
                correctAnswer: wq.correctAnswer,
                userAnswer: wq.userAnswer,
                status: "not_reviewed",
              })),
            });
          } catch (error) {
            console.error("Error saving wrong questions:", error);
            // Yanlış soru kaydetme hatası kritik değil, devam et
          }
        }

    // Trigger AI analysis in background (non-blocking)
    // Note: This will be handled by a background job or webhook in production
    if (process.env.OPENAI_API_KEY && process.env.NEXTAUTH_URL) {
      // Fire and forget - don't await
      fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAttemptId: quizAttempt.id }),
      }).catch(() => {
        // Silently fail - analysis can be triggered later
      });
    }

    // Check badges and goals synchronously so client can surface achievements
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };
    let goalResults: GoalCheckResult = {
      updated: false,
      updatedGoals: [],
      completedGoals: [],
    };

    try {
      badgeResults = await checkBadgesForAttempt({ userId, quizAttemptId: quizAttempt.id });
    } catch (error) {
      console.error("Badge check failed:", error);
    }

    try {
      goalResults = await checkGoalsForToday({ userId });
    } catch (error) {
      console.error("Goal check failed:", error);
    }

    return NextResponse.json({ quizAttempt, score, badgeResults, goalResults });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Test gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

