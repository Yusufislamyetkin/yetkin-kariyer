import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[CREATE_TEST_API] Starting Java test creation...");

    const expertise = "Java";
    
    // Test artık bağımsız - courseId opsiyonel, content field'ında modül yapısı var
    const quizId = `test-java-${Date.now()}`;
    
    // Read test modules from JSON file
    let testContent: any = null;
    try {
      const jsonPath = join(process.cwd(), "data", "test-modules", "java-test-modules.json");
      const jsonContent = readFileSync(jsonPath, "utf-8");
      testContent = JSON.parse(jsonContent);
    } catch (error: any) {
      console.error("[CREATE_TEST_API] Error reading test modules JSON:", error);
      return NextResponse.json(
        {
          success: false,
          error: `Test modül JSON dosyası okunamadı: ${error.message}`,
        },
        { status: 500 }
      );
    }

    if (!testContent || !Array.isArray(testContent.modules)) {
      return NextResponse.json(
        {
          success: false,
          error: "Test modül JSON dosyası geçersiz veya modül bulunamadı",
        },
        { status: 500 }
      );
    }

    const modules = testContent.modules;
    await db.quiz.upsert({
      where: { id: quizId },
      update: {
        title: "Java Test",
        description: "Java teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        topic: expertise,
        questions: [],
        content: {
          modules: modules,
          overview: testContent.overview || {
            description: "Java teknolojisi için kapsamlı test paketi",
            estimatedDurationMinutes: null,
          },
          learningObjectives: testContent.learningObjectives || [],
        },
        passingScore: 60,
        courseId: null,
      },
      create: {
        id: quizId,
        courseId: null,
        title: "Java Test",
        description: "Java teknolojisi için test",
        type: "TEST",
        level: "intermediate",
        topic: expertise,
        questions: [],
        content: {
          modules: modules,
          overview: testContent.overview || {
            description: "Java teknolojisi için kapsamlı test paketi",
            estimatedDurationMinutes: null,
          },
          learningObjectives: testContent.learningObjectives || [],
        },
        passingScore: 60,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Java test kategorisi başarıyla oluşturuldu. ${modules.length} modül eklendi.`,
      stats: {
        testsCreated: 1,
        modulesCreated: modules.length,
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

