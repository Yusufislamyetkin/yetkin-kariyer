import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[CREATE_TEST_API] Starting Angular test creation...");

    const expertise = "Angular";
    
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
    
    let course = await db.course.findFirst({
      where: { expertise },
    });

    if (!course) {
      course = await db.course.create({
        data: {
          title: "Angular Test Kategorisi",
          description: "Angular teknolojisi için test kategorisi",
          expertise,
          difficulty: "intermediate",
          content: { modules },
        },
      });
    } else {
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

    const quizId = `test-angular-${Date.now()}`;
    await db.quiz.upsert({
      where: { id: quizId },
      update: {
        title: "Angular Test",
        description: "Angular teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        questions: [],
        passingScore: 60,
        courseId: course.id,
      },
      create: {
        id: quizId,
        courseId: course.id,
        title: "Angular Test",
        description: "Angular teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        questions: [],
        passingScore: 60,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Angular test kategorisi başarıyla oluşturuldu. Test içeriği daha sonra eklenecek.`,
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

