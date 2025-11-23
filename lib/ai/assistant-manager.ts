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
      const modelToUse = getAssistantModel();
      await client.beta.assistants.update(AI_ASSISTANT_ID, {
        instructions: systemPrompt,
        model: modelToUse,
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
      const modelToUse = getAssistantModel();
      await client.beta.assistants.update(cachedAssistantId, {
        instructions: systemPrompt,
        model: modelToUse,
      });
      return cachedAssistantId;
    } catch (error) {
      console.warn("Cache'deki assistant bulunamadı, yeni oluşturuluyor:", error);
      cachedAssistantId = null;
    }
  }

  // Yeni assistant oluştur - model fallback ile
  const modelToUse = getAssistantModel();
  try {
    const assistant = await client.beta.assistants.create({
      name: "Yetkin Hub Öğretmen AI",
      instructions: systemPrompt,
      model: modelToUse,
      temperature: 0.7,
    });

    cachedAssistantId = assistant.id;
    console.log("Yeni assistant oluşturuldu:", assistant.id, "Model:", modelToUse);
    return assistant.id;
  } catch (error: any) {
    console.error("Assistant oluşturma hatası:", error);
    
    // Model hatası ise fallback dene
    if (error?.code === "model_not_found" || error?.error?.code === "model_not_found") {
      console.warn("Model bulunamadı, fallback model deneniyor:", modelToUse);
      
      // Fallback modelleri dene
      const fallbackModels = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"];
      
      for (const fallbackModel of fallbackModels) {
        try {
          console.log("Fallback model deneniyor:", fallbackModel);
          const assistant = await client.beta.assistants.create({
            name: "Yetkin Hub Öğretmen AI",
            instructions: systemPrompt,
            model: fallbackModel,
            temperature: 0.7,
          });
          
          cachedAssistantId = assistant.id;
          console.log("Assistant fallback model ile oluşturuldu:", assistant.id, "Model:", fallbackModel);
          return assistant.id;
        } catch (fallbackError) {
          console.warn("Fallback model başarısız:", fallbackModel, fallbackError);
          continue;
        }
      }
    }
    
    throw new Error(`Assistant oluşturulamadı: ${error?.message || String(error)}`);
  }
}

/**
 * Model seçimi için fallback mekanizması
 * Assistant API için geçerli modelleri dener
 */
export function getAssistantModel(): string {
  const requestedModel = AI_ASSISTANT_MODEL;

  // Assistant API için geçerli modeller (öncelik sırasına göre)
  const availableModels = [
    "gpt-4o-mini",        // GPT-4o Mini (en güvenilir ve hızlı)
    "gpt-4o",             // GPT-4o (en güncel)
    "gpt-4-turbo",        // GPT-4 Turbo
  ];

  // İstenen model listede varsa kullan
  if (availableModels.includes(requestedModel)) {
    return requestedModel;
  }

  // Fallback: GPT-4o Mini (Assistant API için geçerli ve güvenilir)
  return "gpt-4o-mini";
}

