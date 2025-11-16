import OpenAI from "openai";
import { AI_ASSISTANT_ID, AI_IS_ENABLED, AI_USER_AGENT, AI_ASSISTANT_MODEL } from "./config";

let assistantClient: OpenAI | null = null;
let cachedAssistantId: string | null = null;

export function getAssistantClient(): OpenAI {
  if (!AI_IS_ENABLED) {
    throw new Error("AI servisi devre dışı");
  }

  if (!assistantClient) {
    assistantClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        "User-Agent": AI_USER_AGENT,
      },
    });
  }

  return assistantClient;
}

/**
 * Mevcut assistant'ı getir veya yeni oluştur
 * Tek bir assistant tüm kullanıcılar için kullanılır
 */
export async function getOrCreateAssistant(systemPrompt: string): Promise<string> {
  const client = getAssistantClient();

  // Eğer environment variable'da assistant ID varsa, onu kullan
  if (AI_ASSISTANT_ID) {
    try {
      const existing = await client.beta.assistants.retrieve(AI_ASSISTANT_ID);
      // Assistant'ı güncelle (system prompt değişmiş olabilir)
      await client.beta.assistants.update(AI_ASSISTANT_ID, {
        instructions: systemPrompt,
        model: AI_ASSISTANT_MODEL,
      });
      cachedAssistantId = AI_ASSISTANT_ID;
      return AI_ASSISTANT_ID;
    } catch (error) {
      console.warn("Mevcut assistant bulunamadı, yeni oluşturuluyor:", error);
    }
  }

  // Cache'den kontrol et
  if (cachedAssistantId) {
    try {
      const existing = await client.beta.assistants.retrieve(cachedAssistantId);
      // System prompt güncelle
      await client.beta.assistants.update(cachedAssistantId, {
        instructions: systemPrompt,
        model: AI_ASSISTANT_MODEL,
      });
      return cachedAssistantId;
    } catch (error) {
      console.warn("Cache'deki assistant bulunamadı, yeni oluşturuluyor:", error);
      cachedAssistantId = null;
    }
  }

  // Yeni assistant oluştur
  try {
    const assistant = await client.beta.assistants.create({
      name: "Yetkin Hub Öğretmen AI",
      instructions: systemPrompt,
      model: AI_ASSISTANT_MODEL,
      temperature: 0.7,
    });

    cachedAssistantId = assistant.id;
    console.log("Yeni assistant oluşturuldu:", assistant.id);
    return assistant.id;
  } catch (error) {
    console.error("Assistant oluşturma hatası:", error);
    throw new Error("Assistant oluşturulamadı");
  }
}

/**
 * Model seçimi için fallback mekanizması
 * GPT-5 → GPT-4.1 → GPT-4o
 */
export function getAssistantModel(): string {
  const requestedModel = AI_ASSISTANT_MODEL;

  // Model listesi (öncelik sırasına göre)
  const availableModels = ["gpt-5", "gpt-4.1", "gpt-4o", "gpt-4-turbo", "gpt-4o-mini"];

  // İstenen model listede varsa kullan
  if (availableModels.includes(requestedModel)) {
    return requestedModel;
  }

  // Fallback: GPT-4o
  return "gpt-4o";
}

