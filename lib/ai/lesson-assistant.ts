import OpenAI from "openai";
import { getAssistantClient, getOrCreateAssistant } from "./assistant-manager";
import { db } from "@/lib/db";

export interface LessonAssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LessonAssistantResponse {
  content: string;
  threadId: string;
  runId: string;
  roadmap?: string;
  progress?: { step: number; status: "pending" | "in_progress" | "completed" };
}

const MAX_POLL_ATTEMPTS = 60; // 60 saniye timeout
const POLL_INTERVAL = 1000; // 1 saniye
const MAX_RETRIES = 2; // Maksimum retry sayısı

/**
 * Ders için thread oluştur veya mevcut thread'i getir
 */
export async function getOrCreateLessonThread(
  userId: string,
  lessonSlug: string
): Promise<{ threadId: string; roadmap?: string; progress?: any }> {
  // Veritabanından kontrol et
  let record = await db.lessonThread.findUnique({
    where: {
      userId_lessonSlug: {
        userId,
        lessonSlug,
      },
    },
  });

  if (record) {
    // Thread'in hala geçerli olduğunu kontrol et
    try {
      const client = getAssistantClient();
      await client.beta.threads.retrieve(record.threadId);
      return {
        threadId: record.threadId,
        roadmap: record.roadmap || undefined,
        progress: record.progress as any,
      };
    } catch (error) {
      console.warn("Thread bulunamadı, yeni oluşturuluyor:", error);
      // Thread geçersizse sil ve yeni oluştur
      await db.lessonThread.delete({
        where: {
          userId_lessonSlug: {
            userId,
            lessonSlug,
          },
        },
      });
    }
  }

  // Yeni thread oluştur
  const client = getAssistantClient();
  let thread;
  try {
    thread = await client.beta.threads.create();
  } catch (error: any) {
    console.error("[LESSON-ASSISTANT] Thread oluşturma hatası:", {
      userId,
      lessonSlug,
      errorMessage: error?.message,
      errorCode: error?.code,
    });
    throw new Error(`Thread oluşturulamadı: ${error?.message || "Bilinmeyen hata"}`);
  }

  // Veritabanına kaydet
  try {
    record = await db.lessonThread.create({
      data: {
        userId,
        lessonSlug,
        threadId: thread.id,
      },
    });
  } catch (dbError: any) {
    console.error("[LESSON-ASSISTANT] Thread veritabanı kayıt hatası:", {
      userId,
      lessonSlug,
      threadId: thread.id,
      errorMessage: dbError?.message,
    });
    // Thread oluşturuldu ama veritabanına kaydedilemedi, devam et
  }

  return {
    threadId: thread.id,
    roadmap: record.roadmap || undefined,
    progress: record.progress as any,
  };
}

/**
 * Thread'e mesaj ekle
 */
async function addMessageToThread(
  threadId: string,
  content: string
): Promise<void> {
  const client = getAssistantClient();
  try {
    await client.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  } catch (error: any) {
    console.error("[LESSON-ASSISTANT] Mesaj ekleme hatası:", {
      threadId,
      errorMessage: error?.message,
      errorCode: error?.code,
    });
    throw new Error(`Mesaj thread'e eklenemedi: ${error?.message || "Bilinmeyen hata"}`);
  }
}

/**
 * Run'ı başlat ve sonucu bekle
 */
async function runLessonAssistant(
  threadId: string,
  assistantId: string
): Promise<LessonAssistantResponse> {
  const client = getAssistantClient();

  // Run başlat
  let run;
  try {
    run = await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  } catch (error: any) {
    console.error("[LESSON-ASSISTANT] Run oluşturma hatası:", {
      threadId,
      assistantId,
      errorMessage: error?.message,
      errorCode: error?.code,
    });
    throw new Error(`Run başlatılamadı: ${error?.message || "Bilinmeyen hata"}`);
  }

  // Run'ın tamamlanmasını bekle
  let runStatus;
  let attempts = 0;

  try {
    runStatus = await client.beta.threads.runs.retrieve(threadId, run.id);
  } catch (error: any) {
    console.error("[LESSON-ASSISTANT] Run durumu alınamadı:", {
      runId: run.id,
      threadId,
      errorMessage: error?.message,
    });
    throw new Error(`Run durumu alınamadı: ${error?.message || "Bilinmeyen hata"}`);
  }

  while (
    runStatus.status === "queued" ||
    runStatus.status === "in_progress" ||
    runStatus.status === "requires_action"
  ) {
    if (attempts >= MAX_POLL_ATTEMPTS) {
      console.error("[LESSON-ASSISTANT] Run timeout:", {
        runId: run.id,
        threadId,
        finalStatus: runStatus.status,
        attempts,
      });
      throw new Error("Assistant yanıt verme süresi aşıldı. Lütfen tekrar deneyin.");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    
    try {
      runStatus = await client.beta.threads.runs.retrieve(threadId, run.id);
    } catch (error: any) {
      console.error("[LESSON-ASSISTANT] Run durumu polling hatası:", {
        runId: run.id,
        threadId,
        attempt: attempts,
        errorMessage: error?.message,
      });
      throw new Error(`Run durumu kontrol edilemedi: ${error?.message || "Bilinmeyen hata"}`);
    }
    attempts++;
  }

  if (runStatus.status === "failed") {
    const error = runStatus.last_error;
    const errorMessage = error?.message || "Bilinmeyen hata";
    const errorCode = (error?.code as string) || "unknown";
    
    // Detaylı hata loglama
    console.error("[LESSON-ASSISTANT] Run failed:", {
      runId: run.id,
      threadId,
      assistantId,
      errorMessage,
      errorCode,
      fullError: error,
    });
    
    // Daha açıklayıcı hata mesajları
    let userFriendlyMessage = errorMessage;
    if (errorCode === "rate_limit_exceeded") {
      userFriendlyMessage = "Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.";
    } else if (errorCode === "invalid_request_error") {
      userFriendlyMessage = "Geçersiz istek. Lütfen daha sonra tekrar deneyin.";
    } else if (errorMessage.includes("model") || errorCode === "model_not_found") {
      userFriendlyMessage = "Model hatası. Sistem yöneticisine bildirin.";
    } else if (errorMessage.includes("timeout") || errorMessage.includes("time")) {
      userFriendlyMessage = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
    }
    
    throw new Error(`Assistant hatası: ${userFriendlyMessage}`);
  }

  if (runStatus.status !== "completed") {
    throw new Error(`Assistant beklenmeyen durum: ${runStatus.status}`);
  }

  // Mesajları al
  const messages = await client.beta.threads.messages.list(threadId, {
    limit: 1,
    order: "desc",
  });

  const assistantMessage = messages.data[0];
  if (
    !assistantMessage ||
    assistantMessage.role !== "assistant" ||
    !assistantMessage.content[0]
  ) {
    throw new Error("Assistant yanıtı alınamadı");
  }

  const content =
    assistantMessage.content[0].type === "text"
      ? assistantMessage.content[0].text.value
      : "";

  // Roadmap ve progress bilgilerini parse et
  let roadmap: string | undefined;
  let progress: { step: number; status: "pending" | "in_progress" | "completed" } | undefined;

  // [ROADMAP: ...] tag'ini parse et
  const roadmapMatch = content.match(/\[ROADMAP:\s*([^\]]+)\]/i);
  if (roadmapMatch) {
    roadmap = roadmapMatch[1].trim();
  }

  // [STEP_COMPLETE: ...] tag'ini parse et
  const stepCompleteMatch = content.match(/\[STEP_COMPLETE:\s*(\d+)\]/i);
  if (stepCompleteMatch) {
    const stepNumber = parseInt(stepCompleteMatch[1], 10);
    progress = {
      step: stepNumber,
      status: "completed",
    };
  }

  return {
    content,
    threadId,
    runId: run.id,
    roadmap,
    progress,
  };
}

/**
 * Ders assistant'ına mesaj gönder ve yanıt al
 */
export async function sendMessageToLessonAssistant(
  userId: string,
  lessonSlug: string,
  message: string,
  assistantId: string
): Promise<LessonAssistantResponse> {
  let lastError: Error | null = null;
  
  // Retry mekanizması
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Thread'i al veya oluştur
      const { threadId } = await getOrCreateLessonThread(userId, lessonSlug);

      // Thread'e mesaj ekle
      await addMessageToThread(threadId, message);

      // Assistant'ı çalıştır ve yanıtı al
      const response = await runLessonAssistant(threadId, assistantId);

    // Roadmap ve progress'i veritabanına kaydet
    if (response.roadmap || response.progress) {
      try {
        await db.lessonThread.update({
          where: {
            userId_lessonSlug: {
              userId,
              lessonSlug,
            },
          },
          data: {
            ...(response.roadmap && { roadmap: response.roadmap }),
            ...(response.progress && { progress: response.progress }),
          },
        });
      } catch (dbError) {
        console.warn("[LESSON-ASSISTANT] Veritabanı güncelleme hatası (kritik değil):", dbError);
        // Veritabanı hatası kritik değil, devam et
      }
    }

      return response;
    } catch (error: any) {
      lastError = error;
      
      // Retry yapılabilir hatalar
      const isRetryable = 
        error?.message?.includes("rate_limit") ||
        error?.message?.includes("timeout") ||
        error?.message?.includes("Sorry, something went wrong") ||
        error?.code === "rate_limit_exceeded";
      
      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = (attempt + 1) * 2000; // 2s, 4s
        console.warn(`[LESSON-ASSISTANT] Retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms:`, error?.message);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Retry yapılamaz veya max retry'a ulaşıldı
      // Detaylı hata loglama
      console.error("[LESSON-ASSISTANT] sendMessageToLessonAssistant hatası:", {
        userId,
        lessonSlug,
        assistantId,
        attempt: attempt + 1,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorStack: error?.stack,
      });
      
      // Hata mesajını daha kullanıcı dostu hale getir
      if (error?.message?.includes("Assistant hatası")) {
        // Zaten işlenmiş hata mesajı
        throw error;
      }
      
      // Beklenmeyen hatalar için genel mesaj
      throw new Error(`AI asistan hatası: ${error?.message || "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin."}`);
    }
  }
  
  // Tüm retry'lar başarısız oldu
  throw lastError || new Error("AI asistan yanıt veremedi. Lütfen tekrar deneyin.");
}

/**
 * Thread'deki son mesajları al
 */
export async function getLessonThreadMessages(
  threadId: string,
  limit: number = 50
): Promise<LessonAssistantMessage[]> {
  const client = getAssistantClient();
  const messages = await client.beta.threads.messages.list(threadId, {
    limit,
    order: "desc",
  });

  return messages.data
    .map((msg) => {
      const content =
        msg.content[0]?.type === "text" ? msg.content[0].text.value : "";
      return {
        role: msg.role as "user" | "assistant",
        content,
      };
    })
    .reverse(); // Eski → yeni sıralama
}

/**
 * Ders assistant'ı oluştur (system prompt ile)
 */
export async function createLessonAssistant(
  systemPrompt: string
): Promise<string> {
  return getOrCreateAssistant(systemPrompt);
}


