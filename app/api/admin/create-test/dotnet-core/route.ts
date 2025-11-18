import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Check admin authorization
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[CREATE_TEST_API] Starting .NET Core test creation...");

    const expertise = ".NET Core";
    
    // Find the related course to get modules
    const relatedCourse = await db.course.findFirst({
      where: { expertise },
      select: { content: true },
    });

    // Extract modules from related course
    let modules: any[] = [];
    if (relatedCourse?.content) {
      const content = relatedCourse.content as any;
      if (Array.isArray(content?.modules)) {
        modules = content.modules;
      }
    }
    
    // Find or create test course
    let course = await db.course.findFirst({
      where: { expertise },
    });

    if (!course) {
      course = await db.course.create({
        data: {
          title: ".NET Core Test Kategorisi",
          description: ".NET Core teknolojisi için test kategorisi",
          expertise,
          difficulty: "intermediate",
          content: { modules },
        },
      });
    } else {
      // Update course with modules if not already set
      const currentContent = (course.content as any) || {};
      if (!Array.isArray(currentContent.modules) || currentContent.modules.length === 0) {
        course = await db.course.update({
          where: { id: course.id },
          data: {
            content: { ...currentContent, modules },
          },
        });
      }
    }

    // Create a placeholder test
    const quizId = `test-dotnet-core-${Date.now()}`;
    const quiz = await db.quiz.upsert({
      where: { id: quizId },
      update: {
        title: ".NET Core Test",
        description: ".NET Core teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        questions: [],
        passingScore: 60,
        courseId: course.id,
      },
      create: {
        id: quizId,
        courseId: course.id,
        title: ".NET Core Test",
        description: ".NET Core teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        questions: [],
        passingScore: 60,
      },
    });

    return NextResponse.json({
      success: true,
      message: `.NET Core test kategorisi başarıyla oluşturuldu. Test içeriği daha sonra eklenecek.`,
      stats: {
        testsCreated: 1,
      },
    });
  } catch (error: any) {
    console.error("[CREATE_TEST_API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Test oluşturulurken beklenmeyen bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

