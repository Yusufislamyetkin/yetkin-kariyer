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
  { params }: { params: { technology: string; module: string; testId: string } }
) {
  try {
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
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        level: true,
        type: true,
        passingScore: true,
        questions: true,
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
    });

    // Eğer quiz bulunamadıysa, technology + moduleId + testId kombinasyonu ile quiz ID'sini oluştur ve tekrar ara
    if (!quiz) {
      const normalizedTech = normalizeTechnologyName(technologyName);
      const technologySlug = normalizedTech.replace(/\s+/g, '-');
      const constructedQuizId = `test-${technologySlug}-${decodedModule}-${testId}`;
      
      console.log(`[QUESTIONS_API_OLD] Quiz not found with ID "${testId}", trying constructed ID: "${constructedQuizId}"`);
      
      quiz = await db.quiz.findUnique({
        where: {
          id: constructedQuizId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          topic: true,
          level: true,
          type: true,
          passingScore: true,
          questions: true,
          courseId: true,
          content: true,
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
      });

      // Eğer hala bulunamadıysa, JSON dosyasından test bilgilerini al ve quiz oluştur
      if (!quiz) {
        console.log(`[QUESTIONS_API_OLD] Quiz not found in DB, creating from JSON file...`);
        
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
          console.error(`[QUESTIONS_API_OLD] Technology not found in TEST_MODULE_FILE_MAP`);
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }

        // JSON dosyasını oku
        const jsonPath = join(process.cwd(), "data", "test-modules", fileName);
        let testContent: any;
        try {
          const jsonContent = readFileSync(jsonPath, "utf-8");
          testContent = JSON.parse(jsonContent);
        } catch (fileError: any) {
          console.error(`[QUESTIONS_API_OLD] Error reading JSON file:`, fileError);
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

        const testItem = moduleItem.relatedTests.find((t: any) => t.id === testId);
        if (!testItem) {
          return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
        }

        // Quiz ID'sini oluştur
        const finalQuizId = constructedQuizId;

        // AI ile sorular üret
        let generatedQuestions: any[] = [];
        if (isAIEnabled()) {
          try {
            console.log(`[QUESTIONS_API_OLD] Generating questions for new quiz: ${testItem.title}`);
            generatedQuestions = await generateTestQuestions(
              testItem.title,
              testItem.description || null,
              actualTechName,
              moduleItem.title
            );
          } catch (aiError: any) {
            console.error("[QUESTIONS_API_OLD] Error generating questions with AI:", aiError);
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
          testId = finalQuizId;
          console.log(`[QUESTIONS_API_OLD] Successfully created quiz with ${generatedQuestions.length} questions`);
        } catch (createError: any) {
          console.error("[QUESTIONS_API_OLD] Error creating quiz:", createError);
          return NextResponse.json({ error: "Test oluşturulurken bir hata oluştu" }, { status: 500 });
        }
      } else {
        // Quiz bulundu, testId'yi güncelle
        testId = constructedQuizId;
      }
    }

    if (!quiz || String(quiz.type || "").toUpperCase() !== "TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    // Teknoloji ve modül kontrolü
    // Eğer courseId null ise, topic ve content.modules kontrolü yap
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
          console.log(`[QUESTIONS_API_OLD] Generating questions for quiz: ${quiz.title}`);
          const generatedQuestions = await generateTestQuestions(
            quiz.title,
            quiz.description || null,
            actualTechnology,
            moduleTitle
          );

          // DB'ye kaydet
          await db.quiz.update({
            where: { id: quiz.id },
            data: {
              questions: generatedQuestions as any,
              updatedAt: new Date(),
            },
          });

          questions = generatedQuestions;
          console.log(`[QUESTIONS_API_OLD] Successfully generated and saved ${generatedQuestions.length} questions`);
        } catch (aiError: any) {
          console.error("[QUESTIONS_API_OLD] Error generating questions with AI:", aiError);
          // AI hatası durumunda boş array döndür
          questions = [];
        }
      } else {
        console.warn("[QUESTIONS_API_OLD] AI is disabled, cannot generate questions");
        questions = [];
      }
    }

    return NextResponse.json({ 
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        topic: quiz.topic,
        level: quiz.level,
        passingScore: quiz.passingScore,
        questions: questions || [],
        course: quiz.course,
      }
    });
  } catch (error) {
    console.error("Error fetching test questions:", error);
    return NextResponse.json(
      { error: "Test soruları yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

