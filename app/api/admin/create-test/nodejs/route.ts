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

    console.log("[CREATE_TEST_API] Starting Node.js test creation...");

    const expertise = "Node.js";
    
    // Find the related course to get modules (for reference, testler artık bağımsız)
    const relatedCourse = await db.course.findFirst({
      where: { expertise },
      select: { content: true },
    });

    // Extract modules from related course for test content
    let modules: any[] = [];
    if (relatedCourse?.content) {
      const content = relatedCourse.content as any;
      if (Array.isArray(content?.modules)) {
        modules = content.modules.map((module: any) => ({
          ...module,
          relatedTests: module.relatedTopics ? module.relatedTopics.map((topic: any) => ({
            id: topic.href?.split('/').pop() || `test-${Date.now()}`,
            title: topic.label || topic.title || "Test",
            description: topic.description,
            href: topic.href,
          })) : [],
        }));
      }
    }

    // Test artık bağımsız - courseId opsiyonel, content field'ında modül yapısı var
    const quizId = `test-nodejs-${Date.now()}`;
    await db.quiz.upsert({
      where: { id: quizId },
      update: {
        title: "Node.js Test",
        description: "Node.js teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        topic: expertise,
        questions: [],
        content: {
          modules: modules,
          overview: {
            description: "Node.js teknolojisi için kapsamlı test paketi",
            estimatedDurationMinutes: null,
          },
        },
        passingScore: 60,
        courseId: null,
      },
      create: {
        id: quizId,
        courseId: null,
        title: "Node.js Test",
        description: "Node.js teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        topic: expertise,
        questions: [],
        content: {
          modules: modules,
          overview: {
            description: "Node.js teknolojisi için kapsamlı test paketi",
            estimatedDurationMinutes: null,
          },
        },
        passingScore: 60,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Node.js test kategorisi başarıyla oluşturuldu. Test içeriği daha sonra eklenecek.`,
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

