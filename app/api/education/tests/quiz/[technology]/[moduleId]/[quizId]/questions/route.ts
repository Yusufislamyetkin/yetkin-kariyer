import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeTechnologyName, compareTechnologyNames, routeToTechnology } from "@/lib/utils/technology-normalize";
import { generateTestQuestions } from "@/lib/ai/test-question-generator";
import { isAIEnabled } from "@/lib/ai/client";
import { readFileSync } from "fs";
import { join } from "path";
import { TEST_MODULE_FILE_MAP } from "@/lib/admin/test-module-files";
import { EducationType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { technology: string; moduleId: string; quizId: string } }
) {
  try {
    // Route parametresi "tests-net-core" formatında geliyor, önce decode edip sonra routeToTechnology ile teknoloji adını çıkar
    const decodedRoute = decodeURIComponent(params.technology);
    const technologyName = routeToTechnology(decodedRoute); // "tests-net-core" -> "net core"
    const normalizedDecodedTechnology = normalizeTechnologyName(technologyName); // "net core" -> "net core"
    const decodedModule = decodeURIComponent(params.moduleId);
    let quizId = params.quizId;

    // Önce direkt quizId ile quiz'i bul
    let quiz = await db.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        passingScore: true,
        questions: true,
        type: true,
        topic: true,
        courseId: true,
        content: true,
        course: {
          select: {
            expertise: true,
            topic: true,
            topicContent: true,
          },
        },
      },
    });

    // Eğer quiz bulunamadıysa, technology + moduleId + quizId kombinasyonu ile quiz ID'sini oluştur ve tekrar ara
    // DB'de quiz ID formatı: test-{technology}-{moduleId}-{testId}
    // create-test API'de normalizeTechnologyName kullanılıyor, bu yüzden burada da aynı formatı kullanmalıyız
    if (!quiz) {
      // Technology adını normalize et (create-test API ile aynı format)
      const normalizedTech = normalizeTechnologyName(technologyName); // "net core" -> "net core"
      const technologySlug = normalizedTech.replace(/\s+/g, '-'); // "net core" -> "net-core"
      const constructedQuizId = `test-${technologySlug}-${decodedModule}-${quizId}`;
      
      console.log(`[QUESTIONS_API] Quiz not found with ID "${quizId}", trying constructed ID: "${constructedQuizId}"`);
      
      quiz = await db.quiz.findUnique({
        where: {
          id: constructedQuizId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          passingScore: true,
          questions: true,
          type: true,
          topic: true,
          courseId: true,
          content: true,
          course: {
            select: {
              expertise: true,
              topic: true,
              topicContent: true,
            },
          },
        },
      });

      // Eğer hala bulunamadıysa, JSON dosyasından test bilgilerini al ve quiz oluştur
      if (!quiz) {
        console.log(`[QUESTIONS_API] Quiz not found in DB, creating from JSON file...`);
        
        // JSON dosyasından test bilgilerini al
        let fileName: string | undefined;
        let actualTechName: string | undefined;
        
        for (const [techName, file] of Object.entries(TEST_MODULE_FILE_MAP)) {
          const normalizedTechName = normalizeTechnologyName(techName);
          if (compareTechnologyNames(normalizedTechName, normalizedDecodedTechnology)) {
            fileName = file;
            actualTechName = techName;
            break;
          }
        }

        if (!fileName || !actualTechName) {
          console.error(`[QUESTIONS_API] Technology not found in TEST_MODULE_FILE_MAP`);
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }

        // JSON dosyasını oku
        const jsonPath = join(process.cwd(), "data", "test-modules", fileName);
        let testContent: any;
        try {
          const jsonContent = readFileSync(jsonPath, "utf-8");
          testContent = JSON.parse(jsonContent);
        } catch (fileError: any) {
          console.error(`[QUESTIONS_API] Error reading JSON file:`, fileError);
          return NextResponse.json({ error: "Test modül dosyası okunamadı" }, { status: 500 });
        }

        // Modülü bul
        if (!testContent.modules || !Array.isArray(testContent.modules)) {
          return NextResponse.json({ error: "Modül bulunamadı" }, { status: 404 });
        }

        const moduleItem = testContent.modules.find((m: any) => m.id === decodedModule);
        if (!moduleItem) {
          return NextResponse.json({ error: "Modül bulunamadı" }, { status: 404 });
        }

        // Test item'ı bul
        if (!moduleItem.relatedTests || !Array.isArray(moduleItem.relatedTests)) {
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }

        const testItem = moduleItem.relatedTests.find((t: any) => t.id === quizId);
        if (!testItem) {
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }

        // Quiz ID'sini oluştur
        const normalizedTech = normalizeTechnologyName(actualTechName);
        const technologySlug = normalizedTech.replace(/\s+/g, '-');
        const finalQuizId = `test-${technologySlug}-${decodedModule}-${quizId}`;

        // AI ile sorular üret
        let generatedQuestions: any[] = [];
        if (isAIEnabled()) {
          try {
            console.log(`[QUESTIONS_API] Generating questions for new quiz: ${testItem.title}`);
            generatedQuestions = await generateTestQuestions(
              testItem.title,
              testItem.description || null,
              actualTechName,
              moduleItem.title
            );
          } catch (aiError: any) {
            console.error("[QUESTIONS_API] Error generating questions with AI:", aiError);
            // AI hatası durumunda boş array ile devam et
          }
        }

        // Quiz'i DB'ye kaydet
        const content = {
          modules: [{
            id: moduleItem.id,
            title: moduleItem.title,
            summary: moduleItem.summary,
          }],
          overview: {
            estimatedDurationMinutes: moduleItem.durationMinutes || null,
          },
        };

        try {
          const newQuiz = await db.quiz.create({
            data: {
              id: finalQuizId,
              type: EducationType.TEST,
              title: testItem.title,
              description: testItem.description || null,
              topic: actualTechName,
              level: "intermediate",
              questions: generatedQuestions as any,
              content: content as any,
              passingScore: 70,
              courseId: null,
            },
          });

          quiz = newQuiz;
          quizId = finalQuizId;
          console.log(`[QUESTIONS_API] Successfully created quiz with ${generatedQuestions.length} questions`);
        } catch (createError: any) {
          console.error("[QUESTIONS_API] Error creating quiz:", createError);
          return NextResponse.json({ error: "Test oluşturulurken bir hata oluştu" }, { status: 500 });
        }
      } else {
        // Quiz bulundu, quizId'yi güncelle
        quizId = constructedQuizId;
      }
    }

    // Type kontrolü - TEST olmalı
    const typeStr = String(quiz.type || "").toUpperCase();
    if (typeStr !== "TEST") {
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
      const quizContent = (quiz as any).content;
      if (quizContent && Array.isArray(quizContent.modules)) {
        const moduleExists = quizContent.modules.some((m: any) => m.id === decodedModule);
        if (!moduleExists) {
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }
      }
    }

    // Questions kontrolü - eğer boşsa veya yoksa OpenAI ile üret
    let questions = quiz.questions as any;
    const hasValidQuestions = Array.isArray(questions) && questions.length > 0;

    if (!hasValidQuestions) {
      // Modül bilgilerini al (content'ten)
      let moduleTitle = decodedModule;
      const quizContent = (quiz as any).content;
      if (quizContent && Array.isArray(quizContent.modules)) {
        const moduleItem = quizContent.modules.find((m: any) => m.id === decodedModule);
        if (moduleItem && moduleItem.title) {
          moduleTitle = moduleItem.title;
        }
      }

      // Teknoloji adını al
      const actualTechnology = quiz.topic || quiz.course?.expertise || technologyName;

      // OpenAI ile sorular üret
      if (isAIEnabled()) {
        try {
          console.log(`[QUESTIONS_API] Generating questions for quiz: ${quiz.title}`);
          const generatedQuestions = await generateTestQuestions(
            quiz.title,
            quiz.description || null,
            actualTechnology,
            moduleTitle
          );

          // DB'ye kaydet (quiz.id kullan, çünkü quizId değişken olabilir)
          await db.quiz.update({
            where: { id: quiz.id },
            data: {
              questions: generatedQuestions as any,
              updatedAt: new Date(),
            },
          });

          questions = generatedQuestions;
          console.log(`[QUESTIONS_API] Successfully generated and saved ${generatedQuestions.length} questions`);
        } catch (aiError: any) {
          console.error("[QUESTIONS_API] Error generating questions with AI:", aiError);
          // AI hatası durumunda boş array döndür, kullanıcıya hata mesajı gösterilebilir
          questions = [];
        }
      } else {
        console.warn("[QUESTIONS_API] AI is disabled, cannot generate questions");
        questions = [];
      }
    }

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        questions: questions || [],
        passingScore: quiz.passingScore,
        course: quiz.course,
      },
    });
  } catch (error) {
    console.error("Error fetching test questions:", error);
    return NextResponse.json(
      { error: "Test soruları yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

