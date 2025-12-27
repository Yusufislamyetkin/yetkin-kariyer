import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFileSync } from "fs";
import { join } from "path";
import { TEST_MODULE_FILE_MAP } from "@/lib/admin/test-module-files";
import { normalizeTechnologyName } from "@/lib/utils/technology-normalize";

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

    console.log("[CREATE_TEST_API] Starting .NET Core Senior test creation...");

    const expertise = ".NET Core Senior";
    
    // Read test modules from JSON file
    let testContent: any = null;
    try {
      const fileName = TEST_MODULE_FILE_MAP[expertise] || "dotnet-core-senior-test-modules.json";
      const jsonPath = join(process.cwd(), "data", "test-modules", fileName);
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
    let totalTests = 0;
    let isFirstTest = true; // İlk modülün ilk testi için teknoloji description'ını kullan

    // Her modül için relatedTests array'indeki her item bir test olacak
    for (const moduleItem of modules) {
      if (!moduleItem.relatedTests || !Array.isArray(moduleItem.relatedTests)) {
        console.warn(`[CREATE_TEST_API] Module ${moduleItem.id} has no relatedTests array, skipping...`);
        continue;
      }

      // Her modül için relatedTests array'indeki her item bir test
      for (const testItem of moduleItem.relatedTests) {
        totalTests++;
        
        // Test ID oluştur (normalizeTechnologyName kullanarak tutarlı format)
        const normalizedTech = normalizeTechnologyName(expertise); // ".NET Core Senior" -> "net core senior"
        const technologySlug = normalizedTech.replace(/\s+/g, '-'); // "net core senior" -> "net-core-senior"
        const testId = `test-${technologySlug}-${moduleItem.id}-${testItem.id}`;
        
        // Content objesi oluştur (sadece ilgili modülü içeren array)
        const content = {
          modules: [
            {
              id: moduleItem.id,
              title: moduleItem.title,
              summary: moduleItem.summary,
            },
          ],
          overview: {
            estimatedDurationMinutes: moduleItem.durationMinutes || null,
          },
        };

        // İlk modülün ilk testi için teknoloji description'ını kullan
        const testDescription = isFirstTest 
          ? (testContent.overview?.description || `${expertise} teknolojisi için kapsamlı test paketi`)
          : testItem.description;

        // Quiz oluştur (courseId null, type TEST, topic teknoloji adı)
        try {
          await db.quiz.create({
            data: {
              id: testId,
              type: "TEST",
              title: testItem.title,
              description: testDescription,
              topic: expertise,
              level: "expert", // Senior seviye için expert
              questions: [], // Boş array, soru içeriği sonra eklenecek
              content: content as any,
              passingScore: 70,
              courseId: null,
            },
          });
        } catch (quizError: any) {
          // Eğer test zaten varsa (duplicate key), skip et
          if (quizError.code === 'P2002') {
            console.log(`[CREATE_TEST_API] Test ${testId} already exists, skipping...`);
            continue;
          }
          console.error(`[CREATE_TEST_API] Error creating quiz for ${expertise} - ${testItem.title}:`, quizError);
          throw quizError;
        }

        isFirstTest = false; // İlk testten sonra false yap
      }
    }

    return NextResponse.json({
      success: true,
      message: `.NET Core Senior testleri başarıyla oluşturuldu. ${modules.length} modül, ${totalTests} test eklendi.`,
      stats: {
        testsCreated: totalTests,
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

