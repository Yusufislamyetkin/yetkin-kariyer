import OpenAI from "openai";
import { getAssistantClient, getOrCreateAssistant } from "./assistant-manager";
import { db } from "@/lib/db";

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantResponse {
  content: string;
  threadId: string;
  runId: string;
}

const MAX_POLL_ATTEMPTS = 60; // 60 saniye timeout
const POLL_INTERVAL = 1000; // 1 saniye

/**
 * Kullanıcı için thread oluştur veya mevcut thread'i getir
 */
export async function getOrCreateThread(userId: string): Promise<string> {
  // Veritabanından kontrol et
  let record = await db.assistantThread.findUnique({
    where: { userId },
  });

  if (record) {
    // Thread'in hala geçerli olduğunu kontrol et
    const client = getAssistantClient();
    try {
      await client.beta.threads.retrieve(record.threadId);
      return record.threadId;
    } catch (error) {
      console.warn("Thread bulunamadı, yeni oluşturuluyor:", error);
      // Thread geçersizse sil ve yeni oluştur
      await db.assistantThread.delete({
        where: { userId },
      });
    }
  }

  // Yeni thread oluştur
  const client = getAssistantClient();
  const thread = await client.beta.threads.create();

  // Veritabanına kaydet
  record = await db.assistantThread.create({
    data: {
      userId,
      threadId: thread.id,
    },
  });

  return thread.id;
}

/**
 * Thread'e mesaj ekle
 */
async function addMessageToThread(
  threadId: string,
  content: string
): Promise<void> {
  const client = getAssistantClient();
  await client.beta.threads.messages.create(threadId, {
    role: "user",
    content,
  });
}

/**
 * Run'ı başlat ve sonucu bekle
 */
async function runAssistant(
  threadId: string,
  assistantId: string
): Promise<AssistantResponse> {
  const client = getAssistantClient();

  // Run başlat
  const run = await client.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  // Run'ın tamamlanmasını bekle
  let runStatus = await client.beta.threads.runs.retrieve(threadId, run.id);
  let attempts = 0;

  while (
    runStatus.status === "queued" ||
    runStatus.status === "in_progress" ||
    runStatus.status === "requires_action"
  ) {
    if (attempts >= MAX_POLL_ATTEMPTS) {
      throw new Error("Assistant yanıt verme süresi aşıldı");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    runStatus = await client.beta.threads.runs.retrieve(threadId, run.id);
    attempts++;
  }

  if (runStatus.status === "failed") {
    const error = runStatus.last_error;
    throw new Error(
      `Assistant hatası: ${error?.message || "Bilinmeyen hata"}`
    );
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

  return {
    content,
    threadId,
    runId: run.id,
  };
}

/**
 * Assistant'a mesaj gönder ve yanıt al
 */
export async function sendMessageToAssistant(
  userId: string,
  message: string,
  assistantId: string,
  contextInfo?: string
): Promise<AssistantResponse> {
  // Thread'i al veya oluştur
  const threadId = await getOrCreateThread(userId);

  // Mesajı hazırla (context varsa ekle)
  const fullMessage = contextInfo
    ? `${contextInfo}\n\nKullanıcı sorusu: ${message}`
    : message;

  // Thread'e mesaj ekle
  await addMessageToThread(threadId, fullMessage);

  // Assistant'ı çalıştır ve yanıtı al
  return runAssistant(threadId, assistantId);
}

/**
 * Thread'deki son mesajları al
 */
export async function getThreadMessages(
  threadId: string,
  limit: number = 20
): Promise<AssistantMessage[]> {
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

