import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type LessonSlugParams = {
  slug?: string[];
};

const MINI_TEST_SEGMENT = "mini-test";

function buildLessonSlug(segments: string[] | undefined): string | null {
  if (!segments || segments.length === 0) {
    return null;
  }

  const sanitized = segments
    .map((segment) => decodeURIComponent(segment).trim())
    .filter((segment) => segment.length > 0);

  if (sanitized.length === 0) {
    return null;
  }

  return `/education/lessons/${sanitized.join("/")}`;
}

function resolveLessonSlug(params: LessonSlugParams): string | null {
  const segments = params.slug;

  if (!segments || segments.length < 2) {
    return null;
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment !== MINI_TEST_SEGMENT) {
    return null;
  }

  const lessonSegments = segments.slice(0, -1);
  return buildLessonSlug(lessonSegments);
}

type NormalizedQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
};

function normalizeQuestions(rawQuestions: unknown[]): NormalizedQuestion[] {
  const normalized: NormalizedQuestion[] = [];

  rawQuestions.forEach((rawQuestion, index) => {
    if (!rawQuestion || typeof rawQuestion !== "object") {
      return;
    }

    const questionRecord = rawQuestion as Record<string, unknown>;
    const id =
      typeof questionRecord.id === "string"
        ? questionRecord.id
        : `q-${index + 1}`;
    const questionText =
      typeof questionRecord.question === "string" ? questionRecord.question : "";
    const options = Array.isArray(questionRecord.options)
      ? questionRecord.options.map((option) =>
          typeof option === "string" ? option : String(option)
        )
      : [];
    const correctAnswer =
      typeof questionRecord.correctAnswer === "number"
        ? questionRecord.correctAnswer
        : typeof questionRecord.answer === "number"
          ? questionRecord.answer
          : undefined;
    const explanation =
      typeof questionRecord.explanation === "string"
        ? questionRecord.explanation
        : undefined;

    if (!questionText || options.length === 0) {
      return;
    }

    normalized.push({
      id,
      question: questionText,
      options,
      correctAnswer,
      explanation,
    });
  });

  return normalized;
}

export async function GET(
  request: Request,
  { params }: { params: LessonSlugParams }
) {
  const lessonSlug = resolveLessonSlug(params);

  if (!lessonSlug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const quiz = await db.quiz.findFirst({
      where: {
        type: "MINI_TEST",
        lessonSlug,
      },
      select: {
        id: true,
        title: true,
        description: true,
        passingScore: true,
        lessonSlug: true,
        questions: true,
        courseId: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Mini test bulunamadı." },
        { status: 404 }
      );
    }

    const questions = normalizeQuestions(
      Array.isArray(quiz.questions) ? (quiz.questions as unknown[]) : []
    );
    const sanitizedQuestions = questions.map(({ correctAnswer, explanation, ...rest }) => rest);

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    let progress: {
      attemptCount: number;
      lastAttempt: {
        score: number;
        correctCount: number;
        totalQuestions: number;
        createdAt: Date;
        passed: boolean;
      } | null;
      completion: {
        score: number | null;
        passed: boolean;
        completedAt: Date | null;
      } | null;
    } | null = null;

    if (userId) {
      const [attemptCount, lastAttempt, completion] = await Promise.all([
        db.lessonMiniTestAttempt.count({
          where: {
            userId,
            lessonSlug,
            quizId: quiz.id,
          },
        }),
        db.lessonMiniTestAttempt.findFirst({
          where: {
            userId,
            lessonSlug,
            quizId: quiz.id,
          },
          orderBy: { createdAt: "desc" },
        }),
        db.lessonCompletion.findUnique({
          where: {
            userId_lessonSlug: {
              userId,
              lessonSlug,
            },
          },
        }),
      ]);

      progress = {
        attemptCount,
        lastAttempt: lastAttempt
          ? {
              score: lastAttempt.score,
              correctCount: lastAttempt.correctCount,
              totalQuestions: lastAttempt.totalQuestions,
              createdAt: lastAttempt.createdAt,
              passed: lastAttempt.score >= quiz.passingScore,
            }
          : null,
        completion: completion
          ? {
              score: completion.miniTestScore,
              passed: completion.miniTestPassed,
              completedAt: completion.completedAt,
            }
          : null,
      };
    }

    return NextResponse.json({
      miniTest: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        lessonSlug: quiz.lessonSlug,
        course: quiz.course,
        questionCount: sanitizedQuestions.length,
        questions: sanitizedQuestions,
      },
      progress,
    });
  } catch (error) {
    console.error("Error fetching lesson mini test:", error);
    return NextResponse.json(
      { error: "Mini test yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: LessonSlugParams }
) {
  const lessonSlug = resolveLessonSlug(params);

  if (!lessonSlug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const submittedAnswers = Array.isArray(body.answers) ? body.answers : [];

    const quiz = await db.quiz.findFirst({
      where: {
        type: "MINI_TEST",
        lessonSlug,
      },
      select: {
        id: true,
        title: true,
        passingScore: true,
        lessonSlug: true,
        questions: true,
        courseId: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Mini test bulunamadı." },
        { status: 404 }
      );
    }

    const normalizedQuestions = normalizeQuestions(
      Array.isArray(quiz.questions) ? (quiz.questions as unknown[]) : []
    );

    if (normalizedQuestions.length === 0) {
      return NextResponse.json(
        { error: "Mini test soruları henüz hazırlanmadı." },
        { status: 422 }
      );
    }

    if (submittedAnswers.length !== normalizedQuestions.length) {
      return NextResponse.json(
        { error: "Tüm sorular için cevap seçmelisiniz." },
        { status: 422 }
      );
    }

    const userId = session.user.id as string;

    let correctCount = 0;

    const breakdown = normalizedQuestions.map((question, index) => {
      const selected = Number.isInteger(submittedAnswers[index])
        ? Number(submittedAnswers[index])
        : -1;
      const correctIndex =
        typeof question.correctAnswer === "number" ? question.correctAnswer : -1;
      const isCorrect = selected === correctIndex;

      if (isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: question.id,
        selectedIndex: selected,
        correctIndex,
        isCorrect,
      };
    });

    const totalQuestions = normalizedQuestions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    const answersPayload = {
      submitted: submittedAnswers,
      breakdown,
    };

    const [attempt, completion] = await db.$transaction(async (tx) => {
      const newAttempt = await tx.lessonMiniTestAttempt.create({
        data: {
          userId,
          quizId: quiz.id,
          lessonSlug,
          score,
          totalQuestions,
          correctCount,
          answers: answersPayload,
        },
      });

      const updatedCompletion = await tx.lessonCompletion.upsert({
        where: {
          userId_lessonSlug: {
            userId,
            lessonSlug,
          },
        },
        update: {
          miniTestAttemptId: newAttempt.id,
          miniTestScore: score,
          miniTestPassed: passed,
          completedAt: passed ? new Date() : null,
        },
        create: {
          userId,
          courseId: quiz.courseId,
          lessonSlug,
          miniTestAttemptId: newAttempt.id,
          miniTestScore: score,
          miniTestPassed: passed,
          completedAt: passed ? new Date() : null,
        },
      });

      return [newAttempt, updatedCompletion];
    });

    const questionFeedback = normalizedQuestions.map((question, index) => {
      const selected = Number.isInteger(submittedAnswers[index])
        ? Number(submittedAnswers[index])
        : -1;
      return {
        id: question.id,
        question: question.question,
        options: question.options,
        selectedIndex: selected,
        correctIndex:
          typeof question.correctAnswer === "number"
            ? question.correctAnswer
            : null,
        isCorrect: breakdown[index]?.isCorrect ?? false,
        explanation: question.explanation ?? null,
      };
    });

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        correctCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        passed,
        createdAt: attempt.createdAt,
      },
      completion: {
        passed: completion.miniTestPassed,
        completedAt: completion.completedAt,
        score: completion.miniTestScore,
      },
      feedback: questionFeedback,
      passingScore: quiz.passingScore,
    });
  } catch (error) {
    console.error("Error submitting lesson mini test:", error);
    return NextResponse.json(
      { error: "Mini test kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: LessonSlugParams }
) {
  const lessonSlug = resolveLessonSlug(params);

  if (!lessonSlug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const questions = Array.isArray(body.questions) ? body.questions : [];
    const lessonTitle = typeof body.lessonTitle === "string" ? body.lessonTitle : "Ders";

    if (questions.length < 3) {
      return NextResponse.json(
        { error: "Mini test için en az 3 soru gerekli." },
        { status: 422 }
      );
    }

    // Find lesson and course
    const lessonId = `lesson-${lessonSlug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
    const topicId = `topic-${lessonSlug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;

    let courseId: string | null = null;

    // Try to find lesson in courses
    const lessonRecord = await db.course.findFirst({
      where: {
        OR: [{ id: lessonId }, { id: topicId }],
      },
      select: {
        id: true,
      },
    });

    if (lessonRecord) {
      courseId = lessonRecord.id;
    } else {
      // Find course by searching in course content
      const courses = await db.course.findMany({
        select: {
          id: true,
          content: true,
        },
      });

      for (const course of courses) {
        if (!course.content || typeof course.content !== "object") continue;
        const content = course.content as any;
        const modules = Array.isArray(content.modules) ? content.modules : [];

        for (const moduleItem of modules) {
          if (!moduleItem || typeof moduleItem !== "object") continue;
          const relatedTopics = Array.isArray((moduleItem as any).relatedTopics)
            ? ((moduleItem as any).relatedTopics as Array<Record<string, any>>)
            : [];

          const lesson = relatedTopics.find((topic) => topic?.href === lessonSlug);
          if (lesson) {
            courseId = course.id;
            break;
          }
        }
        if (courseId) break;
      }
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Ders bulunamadı." },
        { status: 404 }
      );
    }

    // Normalize questions
    const normalizedQuestions = questions.map((q: any, index: number) => {
      const id = typeof q.id === "string" ? q.id : `q-${index + 1}`;
      const questionText =
        typeof q.text === "string"
          ? q.text
          : typeof q.question === "string"
            ? q.question
            : "";
      const options = Array.isArray(q.options)
        ? q.options.map((opt: any) => (typeof opt === "string" ? opt : String(opt)))
        : [];
      const correctAnswer =
        typeof q.correctIndex === "number"
          ? q.correctIndex
          : typeof q.correctAnswer === "number"
            ? q.correctAnswer
            : undefined;
      const explanation =
        typeof q.explanation === "string" ? q.explanation : undefined;

      return {
        id,
        question: questionText,
        options,
        correctAnswer,
        explanation,
      };
    }).filter((q: any) => q.question && q.options.length > 0);

    if (normalizedQuestions.length < 3) {
      return NextResponse.json(
        { error: "En az 3 geçerli soru gerekli." },
        { status: 422 }
      );
    }

    // Create or update mini test
    const quizTitle = `${lessonTitle} - Mini Test`;
    const quizDescription = `${lessonTitle} dersi için mini test`;

    const quiz = await db.quiz.upsert({
      where: {
        id: `minitest-${lessonSlug.replace(/[^a-zA-Z0-9]/g, "-")}`,
      },
      create: {
        id: `minitest-${lessonSlug.replace(/[^a-zA-Z0-9]/g, "-")}`,
        courseId,
        title: quizTitle,
        description: quizDescription,
        type: "MINI_TEST",
        lessonSlug,
        questions: normalizedQuestions as any,
        passingScore: 60,
      },
      update: {
        title: quizTitle,
        description: quizDescription,
        questions: normalizedQuestions as any,
      },
    });

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        questionCount: normalizedQuestions.length,
      },
    });
  } catch (error) {
    console.error("Error creating lesson mini test:", error);
    return NextResponse.json(
      { error: "Mini test oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}


