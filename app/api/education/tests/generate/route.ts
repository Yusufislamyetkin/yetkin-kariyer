import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateTestQuestions } from "@/lib/ai/test-generator";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { technology, module, level = "intermediate", questionCount = 10 } = body;

    if (!technology || !module) {
      return NextResponse.json(
        { error: "Teknoloji ve modül bilgisi gereklidir" },
        { status: 400 }
      );
    }

    // Önce bu teknoloji ve modül için Course var mı kontrol et
    let course = await db.course.findFirst({
      where: {
        expertise: technology,
        topic: module,
      },
    });

    // Course yoksa oluştur
    if (!course) {
      course = await db.course.create({
        data: {
          title: `${technology} - ${module}`,
          expertise: technology,
          topic: module,
          difficulty: level,
          content: {},
        },
      });
    }

    // AI ile soruları oluştur
    const questions = await generateTestQuestions({
      technology,
      module,
      level,
      questionCount,
      questionType: "mixed",
    });

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Test soruları oluşturulamadı" },
        { status: 500 }
      );
    }

    // Quiz oluştur
    const quiz = await db.quiz.create({
      data: {
        courseId: course.id,
        title: `${module} Testi`,
        description: `${technology} - ${module} konusunda ${questions.length} soruluk test`,
        topic: module,
        type: "TEST",
        level,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
        passingScore: 60,
        content: {
          overview: {
            description: `${technology} - ${module} konusunda kapsamlı test`,
            estimatedDurationMinutes: Math.ceil(questions.length * 1.5), // Her soru için 1.5 dakika
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      test: {
        id: quiz.id,
        title: quiz.title,
        questionCount: questions.length,
      },
    });
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Test oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

