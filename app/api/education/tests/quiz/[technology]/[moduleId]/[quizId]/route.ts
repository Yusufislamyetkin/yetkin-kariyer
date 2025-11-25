export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  checkBadgesForAttempt,
  type BadgeCheckResult,
} from "@/app/api/badges/check/badge-service";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";
import { normalizeTechnologyName, compareTechnologyNames } from "@/lib/utils/technology-normalize";

export async function POST(
  request: Request,
  { params }: { params: { technology: string; moduleId: string; quizId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers, duration } = body;

    const decodedTechnology = decodeURIComponent(params.technology).replace(/-/g, ' ');
    const decodedModule = decodeURIComponent(params.moduleId);
    const normalizedDecodedTechnology = normalizeTechnologyName(decodedTechnology);

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.quizId,
      },
      select: {
        id: true,
        type: true,
        topic: true,
        courseId: true,
        content: true,
        level: true,
        questions: true,
        course: {
          select: {
            topicContent: true,
            expertise: true,
            topic: true,
          },
        },
      },
    });

    if (!quiz || quiz.type !== "TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    // Quiz'in bu teknoloji ve modüle ait olduğunu doğrula
    // Course'a bağlı ise
    if (quiz.courseId && quiz.course) {
      if (!quiz.course.expertise || !compareTechnologyNames(quiz.course.expertise, normalizedDecodedTechnology)) {
        return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
      }
      if (quiz.course.topic !== decodedModule) {
        return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
      }
    } else {
      // CourseId null ise, topic ve content.modules kontrolü yap
      if (!quiz.topic || !compareTechnologyNames(quiz.topic, normalizedDecodedTechnology)) {
        return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
      }
      
      // Content'ten modül kontrolü yap
      const quizContent = quiz.content as any;
      if (quizContent && Array.isArray(quizContent.modules)) {
        const moduleExists = quizContent.modules.some((m: any) => m.id === decodedModule);
        if (!moduleExists) {
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }
      }
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
        quizId: params.quizId,
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
        quizId: params.quizId,
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
      const priorCount = await db.testAttempt.count({ where: { userId, quizId: params.quizId } });
      const event = await recordEvent({
        userId,
        type: "test_solved",
        payload: { quizId: params.quizId, firstAttempt: priorCount <= 1 },
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
    } catch (error) {
      console.error("Badge check failed:", error);
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

