export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for test generation

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTestQuestions } from "@/lib/ai/test-generator";

/**
 * Questions alanının boş veya geçersiz olup olmadığını kontrol eder
 */
function isQuestionsEmptyOrInvalid(questions: any): boolean {
  if (!questions) return true;
  if (typeof questions !== "object") return true;
  
  // Array kontrolü
  if (Array.isArray(questions)) {
    if (questions.length === 0) return true;
    
    // İlk sorunun yapısını kontrol et
    const firstQuestion = questions[0];
    if (
      !firstQuestion ||
      typeof firstQuestion !== "object" ||
      !firstQuestion.question ||
      !Array.isArray(firstQuestion.options) ||
      firstQuestion.options.length !== 4 ||
      typeof firstQuestion.correctAnswer !== "number"
    ) {
      return true;
    }
  } else {
    // Object ise ama questions array'i yoksa
    if (!questions.questions || !Array.isArray(questions.questions) || questions.questions.length === 0) {
      return true;
    }
  }
  
  return false;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Query parameter'dan parent test ID'sini al (opsiyonel)
    const { searchParams } = new URL(request.url);
    const parentTestId = searchParams.get("parentTestId");

    let quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        level: true,
        type: true,
        questions: true,
        passingScore: true,
        content: true,
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

    // Test bulunamadıysa ve parent test ID'si varsa, parent test'ten metadata al ve test oluştur
    if (!quiz && parentTestId) {
      try {
        console.log(`Test bulunamadı (${params.id}), parent test'ten metadata alınıyor: ${parentTestId}`);
        
        const parentTest = await db.quiz.findUnique({
          where: { 
            id: parentTestId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            topic: true,
            level: true,
            passingScore: true,
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
            content: true,
          },
        });

        if (parentTest && parentTest.type === "TEST") {
          // Parent test'in content'inden module test item'ını bul
          const parentContent = parentTest.content as any;
          let testMetadata: { title: string; description?: string } | null = null;

          // Module content'inde test item'ı ara
          if (parentContent?.modules && Array.isArray(parentContent.modules)) {
            for (const moduleItem of parentContent.modules) {
              if (moduleItem.relatedTests && Array.isArray(moduleItem.relatedTests)) {
                const testItem = moduleItem.relatedTests.find((t: any) => t.id === params.id || t.href?.includes(params.id));
                if (testItem) {
                  testMetadata = {
                    title: testItem.title || params.id,
                    description: testItem.description || parentTest.description || null,
                  };
                  break;
                }
              }
            }
          }

          // Test metadata'sı bulunduysa test kaydı oluştur
          if (testMetadata) {
            console.log(`Test metadata bulundu, test kaydı oluşturuluyor: ${params.id}`);
            
            // Test kaydını oluştur (sorular boş olacak, sonra AI ile oluşturulacak)
            quiz = await db.quiz.create({
              data: {
                id: params.id,
                title: testMetadata.title,
                description: testMetadata.description || `Test başlığı: ${testMetadata.title}`,
                topic: parentTest.topic || null,
                level: parentTest.level || "intermediate",
                type: "TEST",
                questions: [], // Boş array - Prisma Json tipinde array'i kabul eder
                passingScore: parentTest.passingScore || 60,
                courseId: parentTest.courseId || null,
                content: null,
              },
              select: {
                id: true,
                title: true,
                description: true,
                topic: true,
                level: true,
                questions: true,
                passingScore: true,
                content: true,
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

            console.log(`Test kaydı başarıyla oluşturuldu: ${params.id}`);
          }
        }
      } catch (createError) {
        console.error("Test kaydı oluşturma hatası:", createError);
        // Hata durumunda devam et, belki test başka bir yerde var
      }
    }

    // Hala test bulunamadıysa veya tip TEST değilse 404 döndür
    if (!quiz || quiz.type !== "TEST") {
      return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
    }

    // Update öncesi content'i sakla (fallback olarak)
    const originalContent = quiz.content as any;

    // Questions kontrolü - eğer boş veya geçersizse OpenAI ile oluştur
    let questions = quiz.questions;
    let questionsGenerated = false;
    let generationError: string | null = null;

    if (isQuestionsEmptyOrInvalid(questions)) {
      try {
        console.log(`Test içeriği boş, OpenAI ile soru oluşturuluyor: ${quiz.id}`);
        
        const generatedQuestions = await generateTestQuestions({
          technology: quiz.course?.expertise || quiz.topic || "",
          module: quiz.course?.topic || quiz.title || "",
          level: quiz.level || "intermediate",
          questionCount: 3,
        });

        // Oluşturulan soruları DB formatına dönüştür
        const dbQuestions = generatedQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        }));

        // DB'ye kaydet - content'i koruyarak
        try {
          await db.quiz.update({
            where: { id: params.id },
            data: {
              questions: dbQuestions as any,
              content: quiz.content || originalContent, // Content'i koru
              updatedAt: new Date(),
            },
          });

          // Update sonrası quiz'i tekrar fetch et - güncel content'i almak için
          const updatedQuiz = await db.quiz.findUnique({
            where: { id: params.id },
            select: {
              id: true,
              title: true,
              description: true,
              topic: true,
              level: true,
              questions: true,
              passingScore: true,
              content: true,
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

          // Güncel quiz objesini kullan
          if (updatedQuiz) {
            quiz = updatedQuiz;
          }

          questions = dbQuestions;
          questionsGenerated = true;
          console.log(`Test soruları başarıyla oluşturuldu ve kaydedildi: ${quiz.id}`);
        } catch (dbError) {
          console.error("DB güncelleme hatası:", dbError);
          generationError = "Sorular oluşturuldu ancak veritabanına kaydedilemedi.";
          // Yine de oluşturulan soruları döndür
          questions = dbQuestions;
          questionsGenerated = true;
        }
      } catch (error) {
        console.error("Test soruları oluşturma hatası:", error);
        
        // Hata mesajını belirle
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes("ai servisi") || errorMessage.includes("unavailable")) {
            generationError = "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
          } else if (errorMessage.includes("zaman aşımı") || errorMessage.includes("timeout") || errorMessage.includes("aborted") || errorMessage.includes("abort")) {
            generationError = "Soru oluşturma işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.";
          } else if (errorMessage.includes("format hatası") || errorMessage.includes("validation")) {
            generationError = "Oluşturulan sorular beklenen formatta değil. Lütfen tekrar deneyin.";
          } else {
            generationError = `Test soruları oluşturulurken bir hata oluştu: ${error.message}`;
          }
        } else {
          const errorObj = error as any;
          if (errorObj?.name === "AbortError" || errorObj?.message?.includes("aborted") || errorObj?.message?.includes("abort")) {
            generationError = "Soru oluşturma işlemi iptal edildi veya zaman aşımına uğradı. Lütfen tekrar deneyin.";
          } else {
            generationError = "Test soruları oluşturulurken beklenmeyen bir hata oluştu.";
          }
        }
        
        // Fallback: Mevcut questions'ı kullan (boş olsa bile)
        questions = questions || [];
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
        questions: questions,
        questionsGenerated: questionsGenerated,
        generationError: generationError || undefined,
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

