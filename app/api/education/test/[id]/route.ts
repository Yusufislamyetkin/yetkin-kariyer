export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  checkBadgesForAttempt,
  type BadgeCheckResult,
} from "@/app/api/badges/check/badge-service";
import { getMockEducationItemById } from "@/lib/mock/education";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        level: true,
        type: true,
        passingScore: true,
        content: true, // Test'in kendi modül yapısı
        courseId: true,
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

    // Test bulunamadıysa veya tip TEST değilse 404 döndür
    if (!quiz || quiz.type !== "TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    // Test'in kendi content'ini kullan
    const testContent = quiz.content as any;
    
    // Content'i normalize et - modules array'inin her zaman var olduğundan emin ol
    let normalizedContent: any;
    
    if (testContent && typeof testContent === 'object') {
      normalizedContent = {
        ...testContent,
        modules: Array.isArray(testContent.modules) ? testContent.modules : [],
        overview: testContent.overview || {
          description: quiz.description,
          estimatedDurationMinutes: null,
        },
      };
    } else {
      // Hiçbir content yoksa varsayılan yapı oluştur
      normalizedContent = {
        modules: [],
        overview: {
          description: quiz.description,
          estimatedDurationMinutes: null,
        },
      };
    }

    // Modules array'inin her zaman geçerli bir array olduğundan emin ol
    if (!Array.isArray(normalizedContent.modules)) {
      normalizedContent.modules = [];
    }

    return NextResponse.json({ 
      quiz: {
        ...quiz,
        content: normalizedContent,
      }
    });
  } catch (error) {
    console.error("Error fetching test:", error);

    const fallbackQuiz = getMockEducationItemById(params.id);
    if (fallbackQuiz && fallbackQuiz.type === "TEST") {
      return NextResponse.json({
        quiz: fallbackQuiz,
        fallback: true,
      });
    }
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
      where: { 
        id: params.id,
      },
      include: {
        course: {
          select: {
            topicContent: true,
          },
        },
      },
    });

    if (!quiz || quiz.type !== "TEST") {
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

    // TestAttempt oluştur
    // QuizAttempt oluştur (analiz, hedef ve rozet kontrolü için ortak kayıt)
    const quizAttempt = await db.quizAttempt.create({
      data: {
        userId,
        quizId: params.id,
        score,
        answers: answers as any,
        duration: duration ? parseInt(duration) : null,
        topic: quiz.course?.topicContent || null,
        level: quiz.level || null,
      },
    });

    const testAttempt = await db.testAttempt.create({
      data: {
        userId,
        quizId: params.id,
        metrics: {
          score,
          duration: duration ? parseInt(duration) : null,
          answers,
          correctCount,
          totalQuestions: questions.length,
          quizAttemptId: quizAttempt.id,
        },
      },
    });

    // Emit gamification event
    try {
      const priorCount = await db.testAttempt.count({ where: { userId, quizId: params.id } });
      const event = await recordEvent({
        userId,
        type: "test_solved",
        payload: { quizId: params.id, firstAttempt: priorCount <= 1 },
      });
      await applyRules({
        userId,
        type: "test_solved",
        payload: { sourceEventId: event.id, firstAttempt: priorCount <= 1 },
      });
    } catch (e) {
      console.warn("Gamification test_solved failed:", e);
    }

    // Yanlış soruları WrongQuestion tablosuna kaydet (mevcut yapıyla uyumlu)
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
      }
    }

    // AI analysis ve badge check'i background'da yap
    if (process.env.OPENAI_API_KEY && process.env.NEXTAUTH_URL) {
      fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAttemptId: quizAttempt.id }),
      }).catch(() => {});
    }

    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };
    let goalResults = {
      updated: false,
      updatedGoals: [],
      completedGoals: [],
    };

    try {
      badgeResults = await checkBadgesForAttempt({ userId, quizAttemptId: quizAttempt.id });
      console.log("[TestAPI] Badge check result:", {
        newlyEarnedCount: badgeResults.newlyEarnedBadges?.length || 0,
        totalEarned: badgeResults.totalEarned,
        badges: badgeResults.newlyEarnedBadges,
      });
    } catch (error) {
      console.error("[TestAPI] Badge check failed:", error);
    }

    return NextResponse.json({ testAttempt, quizAttempt, score, badgeResults, goalResults });
  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json(
      { error: "Test gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

