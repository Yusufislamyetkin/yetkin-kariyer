export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";
import { 
  getOrCreateLessonThread, 
  sendMessageToLessonAssistant, 
  createLessonAssistant,
  getLessonThreadMessages 
} from "@/lib/ai/lesson-assistant";
import { buildLessonSystemPrompt } from "@/lib/ai/lesson-prompt-builder";
import { parseLessonActions } from "@/lib/ai/lesson-action-parser";
import { isAIEnabled } from "@/lib/ai/client";
import { AI_IS_ENABLED } from "@/lib/ai/config";
import { 
  validateMiniTestAction, 
  generateAICorrectionMessage,
  getValidationErrorMessage 
} from "@/lib/ai/mini-test-validator";

const LessonAssistantRequestSchema = z.object({
  lessonSlug: z.string().min(1),
  message: z.string().min(1).max(2000),
});

function ensureString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => ensureString(item))
    .filter((item): item is string => typeof item === "string");
}

function normalizeLessonTopic(topic: Record<string, any>, slug: string) {
  const sections = Array.isArray(topic.sections)
    ? topic.sections
        .map((section: any, index: number) => {
          if (!section || typeof section !== "object") {
            return null;
          }
          const id = ensureString(section.id) ?? `section-${index + 1}`;
          const title = ensureString(section.title) ?? `Bölüm ${index + 1}`;
          const summary = ensureString(section.summary);
          const content = Array.isArray(section.content)
            ? section.content
                .map((block: any) => {
                  if (!block || typeof block !== "object") {
                    return null;
                  }
                  const type = ensureString(block.type) ?? "text";
                  if (type === "text" && ensureString(block.body)) {
                    return { type: "text", body: ensureString(block.body)! };
                  }
                  if (type === "code" && ensureString(block.code)) {
                    return {
                      type: "code",
                      code: ensureString(block.code)!,
                      language: ensureString(block.language),
                      explanation: ensureString(block.explanation),
                    };
                  }
                  if (type === "list" && Array.isArray(block.items)) {
                    const items = ensureStringArray(block.items);
                    if (items.length === 0) {
                      return null;
                    }
                    return {
                      type: "list",
                      items,
                      ordered: Boolean(block.ordered),
                      title: ensureString(block.title),
                    };
                  }
                  return null;
                })
                .filter(Boolean)
            : [];
          return {
            id,
            title,
            summary,
            content,
          };
        })
        .filter((section): section is NonNullable<typeof section> => section !== null)
    : [];

  return {
    label: ensureString(topic.label) ?? "Ders",
    href: slug,
    description: ensureString(topic.description),
    keyTakeaways: ensureStringArray(topic.keyTakeaways),
    sections,
  };
}

async function findLessonBySlug(slug: string) {
  const lessonId = `lesson-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
  const topicId = `topic-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;

  const lessonRecord = await db.course.findFirst({
    where: {
      OR: [{ id: lessonId }, { id: topicId }],
    },
    select: {
      id: true,
      title: true,
      description: true,
      estimatedDuration: true,
      content: true,
    },
  });

  if (lessonRecord) {
    const lessonContent = (lessonRecord.content as any) || {};
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        estimatedDuration: true,
        content: true,
      },
    });

    for (const course of courses) {
      const normalized = normalizeCourseContent(
        course.content,
        course.estimatedDuration,
        course.description
      );

      const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

      for (const courseModule of modules) {
        if (!courseModule || typeof courseModule !== "object") {
          continue;
        }

        const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
          ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
          : [];

        const lesson = relatedTopics.find((topic) => topic?.href === slug);
        if (lesson && typeof lesson === "object") {
          const enhancedLesson = {
            ...lesson,
            sections: lessonContent.sections || lesson.sections || [],
            keyTakeaways: lessonContent.keyTakeaways || lesson.keyTakeaways || [],
          };

          return {
            course,
            module: courseModule as Record<string, any>,
            lesson: normalizeLessonTopic(enhancedLesson as Record<string, any>, slug),
            overview: normalized.overview,
          };
        }
      }
    }
  }

  // Fallback: search in relatedTopics only
  const courses = await db.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      estimatedDuration: true,
      content: true,
    },
  });

  for (const course of courses) {
    const normalized = normalizeCourseContent(
      course.content,
      course.estimatedDuration,
      course.description
    );

    const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

    for (const courseModule of modules) {
      if (!courseModule || typeof courseModule !== "object") {
        continue;
      }

      const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
        ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
        : [];

      const lesson = relatedTopics.find((topic) => topic?.href === slug);
      if (lesson && typeof lesson === "object") {
        return {
          course,
          module: courseModule as Record<string, any>,
          lesson: normalizeLessonTopic(lesson as Record<string, any>, slug),
          overview: normalized.overview,
        };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // AI servis durumunu kontrol et - sadece OPENAI_API_KEY kontrolü
    const apiKeyValue = process.env.OPENAI_API_KEY;
    const hasApiKey = Boolean(apiKeyValue && apiKeyValue.trim().length > 0);
    const isLocal = process.env.NODE_ENV === "development" && !process.env.VERCEL;
    
    if (!hasApiKey || !AI_IS_ENABLED) {
      // Debug log - production'da da göster (Vercel loglarında görünsün)
      console.error("[LESSON-ASSISTANT] AI Servisi Devre Dışı:", {
        hasApiKey,
        apiKeyLength: apiKeyValue?.length || 0,
        apiKeyPrefix: apiKeyValue ? `${apiKeyValue.substring(0, 7)}...` : "N/A",
        aiIsEnabledFromConfig: AI_IS_ENABLED,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL ? "true" : "false",
        isLocal,
      });
      
      // Local development için daha detaylı hata mesajı
      let errorMessage: string;
      let hint: string;
      
      if (isLocal) {
        errorMessage = "OPENAI_API_KEY environment variable eksik veya boş.";
        hint = `Local development için .env dosyanıza şunu ekleyin:\n\nOPENAI_API_KEY=sk-your-api-key-here\n\nAPI key almak için: https://platform.openai.com/api-keys\n\nNot: .env dosyasını ekledikten sonra development server'ı yeniden başlatmanız gerekir (Ctrl+C ile durdurun ve 'npm run dev' ile tekrar başlatın).`;
      } else if (process.env.VERCEL) {
        errorMessage = "OPENAI_API_KEY environment variable eksik veya boş.";
        hint = "Vercel dashboard'unda Settings > Environment Variables bölümünden ekleyin ve deployment'ı yeniden başlatın.";
      } else {
        errorMessage = "OPENAI_API_KEY environment variable eksik veya boş.";
        hint = "Lütfen .env dosyanızı kontrol edin ve sunucuyu yeniden başlatın.";
      }
      
      return NextResponse.json(
        { 
          error: "AI servisi şu anda mevcut değil",
          details: errorMessage,
          hint,
          isLocal,
          setupInstructions: isLocal ? {
            step1: "Proje kök dizininde .env dosyası oluşturun (yoksa)",
            step2: "OPENAI_API_KEY=sk-your-api-key-here satırını ekleyin",
            step3: "API key almak için: https://platform.openai.com/api-keys",
            step4: "Development server'ı yeniden başlatın (npm run dev)"
          } : undefined
        },
        { status: 503 }
      );
    }

    const json = await request.json().catch(() => ({}));
    const { lessonSlug, message } = LessonAssistantRequestSchema.parse(json);

    const userId = session.user.id as string;

    console.log("[LESSON-ASSISTANT] İstek alındı:", {
      userId,
      lessonSlug,
      messageLength: message.length,
    });

    // Verify user exists in database
    let userExists;
    try {
      userExists = await db.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      
      // If user not found by ID, try to find by email (for Google OAuth users)
      if (!userExists && session.user.email) {
        console.warn("[LESSON-ASSISTANT] Kullanıcı ID ile bulunamadı, email ile kontrol ediliyor:", {
          userId,
          email: session.user.email,
        });
        
        const userByEmail = await db.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        
        if (userByEmail) {
          console.warn("[LESSON-ASSISTANT] Kullanıcı email ile bulundu ama session userId farklı:", {
            sessionUserId: userId,
            dbUserId: userByEmail.id,
            email: session.user.email,
          });
          // This indicates a session mismatch - user should re-login
          return NextResponse.json(
            { 
              error: "Oturum uyumsuzluğu tespit edildi. Lütfen çıkış yapıp tekrar giriş yapın.",
              details: "Google OAuth ile giriş yaptıysanız, lütfen tekrar giriş yapmayı deneyin."
            },
            { status: 401 }
          );
        }
      }
      
      if (!userExists) {
        console.error("[LESSON-ASSISTANT] Kullanıcı veritabanında bulunamadı:", { 
          userId,
          email: session.user.email,
        });
        return NextResponse.json(
          { 
            error: "Kullanıcı bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın.",
            details: "Google OAuth ile giriş yaptıysanız, lütfen tekrar giriş yapmayı deneyin."
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Kullanıcı kontrolü hatası:", error);
      return NextResponse.json(
        { error: "Kullanıcı doğrulama hatası" },
        { status: 500 }
      );
    }

    // Get user info for personalization
    let userInfo: { name?: string | null; firstName?: string | null } | null = null;
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
        },
      });
      
      if (user) {
        // Extract first name from full name if available
        const fullName = user.name || "";
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts.length > 0 ? nameParts[0] : null;
        
        userInfo = {
          name: user.name,
          firstName: firstName || null,
        };
      }
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Kullanıcı bilgisi alınamadı:", error);
      // Continue without user info, not critical
    }

    // Find lesson content
    let lessonMatch;
    try {
      lessonMatch = await findLessonBySlug(lessonSlug);
      if (!lessonMatch) {
        console.error("[LESSON-ASSISTANT] Ders bulunamadı:", { lessonSlug });
        return NextResponse.json(
          { error: "Ders bulunamadı", details: `Slug: ${lessonSlug}` },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Ders arama hatası:", error);
      return NextResponse.json(
        { 
          error: "Ders bilgisi alınamadı", 
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    const { lesson, course, module } = lessonMatch;
    const moduleTitle = typeof module.title === "string" ? module.title : "Modül";
    
    console.log("[LESSON-ASSISTANT] Ders bulundu:", {
      lessonTitle: lesson.label,
      courseTitle: course.title,
      moduleTitle,
    });

    // Check for existing content
    let availableContent: {
      tests: Array<{ id: string; title: string; description: string | null; url: string }>;
      quizzes: Array<{ id: string; title: string; description: string | null; url: string }>;
      bugfixes: Array<{ id: string; title: string; description: string | null; url: string }>;
      livecodings: Array<{ id: string; title: string; description: string | null; url: string }>;
    } | undefined;

    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const contentCheckResponse = await fetch(
        `${baseUrl}/api/ai/lesson-content-check?lessonSlug=${encodeURIComponent(lessonSlug)}`,
        {
          headers: {
            Cookie: request.headers.get("Cookie") || "",
          },
        }
      );

      if (contentCheckResponse.ok) {
        const contentData = await contentCheckResponse.json();
        availableContent = {
          tests: contentData.tests || [],
          quizzes: contentData.quizzes || [],
          bugfixes: contentData.bugfixes || [],
          livecodings: contentData.livecodings || [],
        };
      }
    } catch (error) {
      console.error("Error checking available content:", error);
      // Continue without available content
    }

    // Get or create lesson thread
    let threadData;
    try {
      threadData = await getOrCreateLessonThread(userId, lessonSlug);
      console.log("[LESSON-ASSISTANT] Thread hazır:", {
        threadId: threadData.threadId,
        hasRoadmap: !!threadData.roadmap,
      });
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Thread oluşturma hatası:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        lessonSlug,
      });
      
      // Daha açıklayıcı hata mesajları
      let errorMessage = "Thread oluşturulamadı";
      if (error instanceof Error) {
        if (error.message.includes("Kullanıcı bulunamadı")) {
          errorMessage = error.message;
        } else if (error.message.includes("Foreign key")) {
          errorMessage = "Kullanıcı doğrulama hatası. Lütfen oturum açın ve tekrar deneyin.";
        } else {
          errorMessage = error.message;
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
    
    // Get thread metadata
    let threadRecord;
    try {
      threadRecord = await db.lessonThread.findUnique({
        where: {
          userId_lessonSlug: {
            userId,
            lessonSlug,
          },
        },
        select: {
          roadmap: true,
          progress: true,
          difficultyLevel: true,
          performanceData: true,
        },
      });
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Thread metadata okuma hatası:", error);
      // Devam et, threadRecord null olacak
      threadRecord = null;
    }

    // Safely get roadmap and progress with null checks
    const roadmap = threadRecord?.roadmap || threadData?.roadmap || null;
    const progress = (threadRecord?.progress as any) || threadData?.progress || null;
    const difficultyLevel = threadRecord?.difficultyLevel || null;
    const performanceData = threadRecord?.performanceData || null;

    // Build system prompt
    let systemPrompt;
    try {
      systemPrompt = buildLessonSystemPrompt(
        lesson,
        course.title,
        moduleTitle,
        availableContent,
        roadmap,
        difficultyLevel,
        performanceData as any,
        userInfo
      );
      console.log("[LESSON-ASSISTANT] System prompt oluşturuldu, uzunluk:", systemPrompt.length);
    } catch (error) {
      console.error("[LESSON-ASSISTANT] System prompt oluşturma hatası:", error);
      return NextResponse.json(
        { 
          error: "System prompt oluşturulamadı", 
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    // Create or get assistant
    let assistantId;
    try {
      assistantId = await createLessonAssistant(systemPrompt);
      console.log("[LESSON-ASSISTANT] Assistant hazır:", { assistantId });
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Assistant oluşturma hatası:", error);
      return NextResponse.json(
        { 
          error: "Assistant oluşturulamadı", 
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    // Check if this is the first message (no previous messages in thread)
    const isFirstMessage = message.toLowerCase().includes("başla") || 
                           message.toLowerCase().includes("hazır") ||
                           message.toLowerCase().includes("merhaba");

    // Prepare message
    let userMessage = message;
    if (isFirstMessage && !threadData.roadmap) {
      userMessage = "Merhaba! Bu dersi öğrenmeye hazırım. Bana dersi anlatabilir misin?";
    }

    // Prepare context for AI (roadmap and progress)
    const context = {
      roadmap: roadmap || null,
      progress: progress || null,
    };

    // Send message to assistant
    let response;
    try {
      console.log("[LESSON-ASSISTANT] Mesaj gönderiliyor...", {
        hasRoadmap: !!context.roadmap,
        hasProgress: !!context.progress,
        currentStep: context.progress?.step,
        stepStatus: context.progress?.status,
        assistantId,
        messageLength: userMessage.length,
      });
      response = await sendMessageToLessonAssistant(
        userId,
        lessonSlug,
        userMessage,
        assistantId,
        context
      );
      console.log("[LESSON-ASSISTANT] Yanıt alındı, uzunluk:", response.content.length);
    } catch (error) {
      // Detaylı hata loglama
      const errorDetails = {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorName: error instanceof Error ? error.name : typeof error,
        assistantId,
        lessonSlug,
        userId,
      };
      
      console.error("[LESSON-ASSISTANT] Mesaj gönderme hatası:", errorDetails);
      
      // Daha açıklayıcı hata mesajları
      let userFriendlyError = "AI'ye mesaj gönderilemedi";
      let technicalDetails = error instanceof Error ? error.message : String(error);
      
      // Özel hata durumları için daha açıklayıcı mesajlar
      if (technicalDetails.includes("rate_limit") || technicalDetails.includes("rate limit")) {
        userFriendlyError = "Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.";
      } else if (technicalDetails.includes("timeout") || technicalDetails.includes("süresi aşıldı")) {
        userFriendlyError = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
      } else if (technicalDetails.includes("model_not_found") || technicalDetails.includes("model")) {
        userFriendlyError = "AI modeli bulunamadı. Lütfen sistem yöneticisine bildirin.";
      } else if (technicalDetails.includes("invalid_request") || technicalDetails.includes("Geçersiz")) {
        userFriendlyError = "Geçersiz istek. Lütfen sayfayı yenileyip tekrar deneyin.";
      } else if (technicalDetails.includes("authentication") || technicalDetails.includes("API key")) {
        userFriendlyError = "AI servisi yapılandırma hatası. Lütfen sistem yöneticisine bildirin.";
      }
      
      return NextResponse.json(
        { 
          error: userFriendlyError, 
          details: technicalDetails,
          debug: process.env.NODE_ENV === "development" ? {
            stack: error instanceof Error ? error.stack : undefined,
            fullError: errorDetails
          } : undefined
        },
        { status: 500 }
      );
    }

    // Parse actions from response
    let parsed;
    let needsCorrection = false;
    let correctionMessage = '';
    
    try {
      parsed = parseLessonActions(response.content);
      
      // Validate and filter actions - especially mini_test actions
      if (parsed.actions && parsed.actions.length > 0) {
        const validActions: any[] = [];
        const invalidMiniTestActions: any[] = [];
        const seenQuestionKeys = new Set<string>();
        
        // Helper function to generate a unique key for a question
        const getQuestionKey = (actionData: any): string => {
          const qData = actionData?.question || actionData;
          const text = (qData?.text || qData?.question || "").trim().toLowerCase();
          const options = (qData?.options || []).map((opt: any) => 
            (typeof opt === "string" ? opt : opt?.text || opt?.label || "").trim().toLowerCase()
          ).filter(Boolean).sort().join("|");
          return `${text}::${options}`;
        };
        
        for (const action of parsed.actions) {
          if (action.type === "mini_test") {
            // Use the new validator
            const validationResult = validateMiniTestAction(action.data);
            
            if (validationResult.isValid && validationResult.data) {
              // Normalize the action data with validated values
              const normalizedData = {
                question: {
                  text: validationResult.data.question,
                  options: validationResult.data.options,
                  type: "multiple_choice",
                  correctIndex: validationResult.data.correctIndex,
                },
              };
              
              // Check for duplicates based on question text and options
              const questionKey = getQuestionKey(normalizedData);
              if (seenQuestionKeys.has(questionKey)) {
                console.warn("[LESSON-ASSISTANT] Duplicate mini_test question detected and filtered:", {
                  question: validationResult.data.question.substring(0, 100),
                  questionKey,
                });
                continue; // Skip this duplicate question
              }
              
              // Mark this question as seen
              seenQuestionKeys.add(questionKey);
              
              action.data = normalizedData;
              validActions.push(action);
              
              // Log warnings if any
              if (validationResult.warnings.length > 0) {
                console.warn("[LESSON-ASSISTANT] Mini test validation warnings:", {
                  warnings: validationResult.warnings,
                  action: JSON.stringify(action).substring(0, 200),
                });
              }
            } else {
              // Invalid action - collect for correction
              invalidMiniTestActions.push({
                action,
                validationResult,
              });
              
              console.warn("[LESSON-ASSISTANT] Invalid mini_test action detected:", {
                errors: validationResult.errors,
                action: JSON.stringify(action).substring(0, 200),
              });
            }
          } else {
            // Non-mini_test actions are valid as-is
            validActions.push(action);
          }
        }
        
        // If we have invalid mini_test actions, prepare correction message
        // (Retry will be handled in response metadata for frontend handling)
        if (invalidMiniTestActions.length > 0) {
          needsCorrection = true;
          
          // Generate correction message from first invalid action (usually there's only one)
          const firstInvalid = invalidMiniTestActions[0];
          correctionMessage = generateAICorrectionMessage(firstInvalid.validationResult);
          
          console.warn("[LESSON-ASSISTANT] Invalid mini_test actions found:", {
            invalidCount: invalidMiniTestActions.length,
            correctionMessage: correctionMessage.substring(0, 200),
          });
        }
        
        // Update parsed actions with only valid ones
        if (validActions.length !== parsed.actions.length) {
          console.warn("[LESSON-ASSISTANT] Filtered out invalid actions:", {
            originalCount: parsed.actions.length,
            validCount: validActions.length,
            filteredCount: parsed.actions.length - validActions.length,
            invalidMiniTestCount: invalidMiniTestActions.length,
          });
          parsed.actions = validActions;
        }
      }
      
      console.log("[LESSON-ASSISTANT] Actions parse edildi:", {
        actionCount: parsed.actions?.length ?? 0,
        hasRoadmap: !!parsed.roadmap,
        hasProgress: !!parsed.progress,
        miniTestCount: parsed.actions?.filter((a: any) => a.type === "mini_test").length ?? 0,
      });
    } catch (error) {
      console.error("[LESSON-ASSISTANT] Action parse hatası:", error);
      // Parse hatası olsa bile devam et, sadece actions olmayacak
      parsed = {
        content: response.content,
        actions: [],
        roadmap: undefined,
        progress: undefined,
        isCompleted: false,
      };
    }
    
    // Additional content cleaning - remove any remaining malformed MINI_TEST patterns
    // This catches patterns that might have been missed by the parser
    if (parsed.content) {
      // Remove patterns like "= 10, A) ..., B) ..., C) ..., D) ..., 1]" that weren't properly parsed
      const malformedPattern = /=\s*[^,]+?,\s*[A-D]\)[^,]+?,\s*[A-D]\)[^,]+?,\s*[A-D]\)[^,]+?,\s*[A-D]\)[^,]+?,\s*[0-3]\s*\]/gi;
      const cleanedContent = parsed.content.replace(malformedPattern, '');
      if (cleanedContent !== parsed.content) {
        console.warn("[LESSON-ASSISTANT] Removed malformed MINI_TEST pattern from content");
        parsed.content = cleanedContent;
      }
    }

    // Update roadmap if provided
    if (parsed.roadmap) {
      try {
        await db.lessonThread.update({
          where: {
            userId_lessonSlug: {
              userId,
              lessonSlug,
            },
          },
          data: {
            roadmap: parsed.roadmap,
          },
        });
        console.log("[LESSON-ASSISTANT] Roadmap güncellendi");
      } catch (error) {
        console.error("[LESSON-ASSISTANT] Roadmap güncelleme hatası:", error);
        // Devam et, kritik değil
      }
    }

    // Update progress if provided
    if (parsed.progress) {
      try {
        await db.lessonThread.update({
          where: {
            userId_lessonSlug: {
              userId,
              lessonSlug,
            },
          },
          data: {
            progress: parsed.progress,
          },
        });
        console.log("[LESSON-ASSISTANT] Progress güncellendi");
      } catch (error) {
        console.error("[LESSON-ASSISTANT] Progress güncelleme hatası:", error);
        // Devam et, kritik değil
      }
    }

    // Check if lesson is completed and mark it
    if (parsed.isCompleted) {
      try {
        await db.lessonCompletion.upsert({
          where: {
            userId_lessonSlug: {
              userId,
              lessonSlug,
            },
          },
          update: {
            completedAt: new Date(),
          },
          create: {
            userId,
            courseId: course.id,
            lessonSlug,
            completedAt: new Date(),
            miniTestPassed: false,
          },
        });
      } catch (error) {
        console.error("Error marking lesson as completed:", error);
      }
    }

    // If images are requested, fetch them
    let imageUrls: string[] = [];
    if (parsed.images && parsed.images.length > 0) {
      for (const searchQuery of parsed.images) {
        try {
          const imageResponse = await fetch(
            `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/ai/image-search?query=${encodeURIComponent(searchQuery)}`,
            {
              headers: {
                Cookie: request.headers.get("Cookie") || "",
              },
            }
          );

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            if (imageData.images && Array.isArray(imageData.images)) {
              imageUrls.push(...imageData.images.map((img: any) => img.url || img).filter(Boolean));
            }
          }
        } catch (error) {
          console.error("Image search error:", error);
        }
      }
    }

    // Prepare response with validation info
    const responseData: any = {
      content: parsed.content,
      roadmap: parsed.roadmap || roadmap || undefined,
      progress: parsed.progress || (progress as any) || undefined,
      actions: parsed.actions,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      isCompleted: parsed.isCompleted || false,
      lesson: {
        title: lesson.label,
        description: lesson.description,
        slug: lessonSlug,
      },
    };

    // Add validation warnings if needed
    if (needsCorrection && correctionMessage) {
      responseData.validationWarning = {
        hasFormatErrors: true,
        correctionMessage: correctionMessage,
        message: "Mini test sorusu formatı hatalı. AI'ya düzeltme bildirimi gönderildi.",
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    // Detaylı hata loglama
    console.error("[LESSON-ASSISTANT] Hata Detayları:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
      fullError: error,
    });
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Geçersiz istek verisi", 
          details: error.flatten(),
          issues: error.issues 
        },
        { status: 400 }
      );
    }
    
    // Hata mesajını daha açıklayıcı yap
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Bilinmeyen hata";
    
    const isDevelopment = process.env.NODE_ENV === "development";
    
    return NextResponse.json(
      { 
        error: "AI asistan şu anda yanıt veremiyor",
        details: errorMessage,
        ...(isDevelopment && {
          stack: error instanceof Error ? error.stack : undefined,
          fullError: String(error)
        })
      },
      { status: 500 }
    );
  }
}

