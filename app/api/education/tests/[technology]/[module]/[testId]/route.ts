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
import { normalizeTechnologyName, compareTechnologyNames, routeToTechnology } from "@/lib/utils/technology-normalize";

export async function POST(
  request: Request,
  { params }: { params: { technology: string; module: string; testId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers, duration } = body;

    // Route parametresi "tests-net-core" formatında olabilir, önce decode edip sonra routeToTechnology ile teknoloji adını çıkar
    const decodedRoute = decodeURIComponent(params.technology);
    const technologyName = decodedRoute.startsWith("tests-") 
      ? routeToTechnology(decodedRoute) // "tests-net-core" -> "net core"
      : decodedRoute; // Eğer "tests-" prefix'i yoksa direkt kullan
    const normalizedDecodedTechnology = normalizeTechnologyName(technologyName);
    const decodedModule = decodeURIComponent(params.module);
    let testId = params.testId;

    // Önce direkt testId ile quiz'i bul
    let quiz = await db.quiz.findUnique({
      where: { 
        id: testId,
      },
      include: {
        course: {
          select: {
            id: true,
            expertise: true,
            topic: true,
            topicContent: true,
          },
        },
      },
    });

    // Eğer quiz bulunamadıysa, technology + moduleId + testId kombinasyonu ile quiz ID'sini oluştur ve tekrar ara
    if (!quiz) {
      const normalizedTech = normalizeTechnologyName(technologyName);
      const technologySlug = normalizedTech.replace(/\s+/g, '-');
      const constructedQuizId = `test-${technologySlug}-${decodedModule}-${testId}`;
      
      console.log(`[TEST_SUBMIT_API] Quiz not found with ID "${testId}", trying constructed ID: "${constructedQuizId}"`);
      
      quiz = await db.quiz.findUnique({
        where: {
          id: constructedQuizId,
        },
        include: {
          course: {
            select: {
              id: true,
              expertise: true,
              topic: true,
              topicContent: true,
            },
          },
        },
      });

      if (quiz) {
        // Quiz bulundu, testId'yi güncelle
        testId = constructedQuizId;
        console.log(`[TEST_SUBMIT_API] Quiz found with constructed ID: "${constructedQuizId}"`);
      }
    }

    // Hala bulunamadıysa, course üzerinden ara (AI ile oluşturulan testler için)
    if (!quiz) {
      console.log(`[TEST_SUBMIT_API] Quiz not found with constructed ID, trying course lookup...`);
      
      // Technology ve module ile course'u bul
      const allCourses = await db.course.findMany({
        where: {
          topic: decodedModule,
        },
      });

      // Expertise ile eşleşen course'u bul
      for (const course of allCourses) {
        if (course.expertise && compareTechnologyNames(course.expertise, normalizedDecodedTechnology)) {
          // Course'a bağlı testleri bul
          const constructedQuizId = `test-${normalizeTechnologyName(technologyName).replace(/\s+/g, '-')}-${decodedModule}-${testId}`;
          
          const courseQuizzes = await db.quiz.findMany({
            where: {
              courseId: course.id,
              type: "TEST",
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              course: {
                select: {
                  id: true,
                  expertise: true,
                  topic: true,
                  topicContent: true,
                },
              },
            },
          });

          if (courseQuizzes.length > 0) {
            // Eğer testId ile eşleşen bir quiz varsa onu seç, yoksa en son oluşturulan test'i al
            quiz = courseQuizzes.find((q: typeof courseQuizzes[0]) => q.id === testId || q.id === constructedQuizId) || courseQuizzes[0];
            if (quiz) {
              testId = quiz.id;
              console.log(`[TEST_SUBMIT_API] Quiz found via course lookup: "${quiz.id}"`);
              break;
            }
          }
        }
      }
    }

    if (!quiz || quiz.type !== "TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    // Teknoloji ve modül kontrolü
    if (quiz.courseId) {
      // Course'a bağlı test
      if (!quiz.course?.expertise || !compareTechnologyNames(quiz.course.expertise, normalizedDecodedTechnology) || quiz.course?.topic !== decodedModule) {
        return NextResponse.json({ error: "Test bu modüle ait değil" }, { status: 404 });
      }
    } else {
      // CourseId null olan test - topic ve content.modules kontrolü
      if (!quiz.topic || !compareTechnologyNames(quiz.topic, normalizedDecodedTechnology)) {
        return NextResponse.json({ error: "Test bu teknolojiye ait değil" }, { status: 404 });
      }
      
      const content = quiz.content as any;
      if (content && Array.isArray(content.modules)) {
        const moduleExists = content.modules.some((module: any) => module.id === decodedModule);
        if (!moduleExists) {
          return NextResponse.json({ error: "Test bu modüle ait değil" }, { status: 404 });
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

    // Bulunan gerçek quiz ID'sini kullan
    const actualQuizId = quiz.id;

    // TestAttempt oluştur
    // QuizAttempt oluştur (analiz, hedef ve rozet kontrolü için ortak kayıt)
    const quizAttempt = await db.quizAttempt.create({
      data: {
        userId,
        quizId: actualQuizId,
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
        quizId: actualQuizId,
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
      const priorCount = await db.testAttempt.count({ where: { userId, quizId: actualQuizId } });
      const event = await recordEvent({
        userId,
        type: "test_solved",
        payload: { quizId: actualQuizId, firstAttempt: priorCount <= 1 },
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

