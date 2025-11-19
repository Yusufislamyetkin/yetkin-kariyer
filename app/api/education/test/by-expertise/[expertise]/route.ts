import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { expertise: string } }
) {
  try {
    const decodedExpertise = decodeURIComponent(params.expertise);
    
    // Find the main test for this expertise
    // Main test: type = "TEST", topic = expertise, courseId = null (bağımsız test)
    const quiz = await db.quiz.findFirst({
      where: {
        type: "TEST",
        topic: decodedExpertise,
        courseId: null, // Bağımsız testler
      },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        level: true,
        questions: true,
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
      orderBy: {
        createdAt: "desc", // En yeni testi al
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: `${decodedExpertise} için test bulunamadı` },
        { status: 404 }
      );
    }

    // Test'in kendi content'ini kullan
    const testContent = quiz.content as any;

    // Content'i normalize et
    const normalizedContent = testContent || {
      modules: [],
      overview: {
        description: quiz.description,
        estimatedDurationMinutes: null,
      },
    };

    return NextResponse.json({
      quiz: {
        ...quiz,
        content: normalizedContent,
      },
    });
  } catch (error) {
    console.error("Error fetching test by expertise:", error);
    return NextResponse.json(
      { error: "Test yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

