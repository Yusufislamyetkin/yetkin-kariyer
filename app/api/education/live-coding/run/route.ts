import { NextResponse } from "next/server";
import { ensureAIEnabled, isAIEnabled } from "@/lib/ai/client";
import type { LiveCodingLanguage } from "@/types/live-coding";

interface RunRequestBody {
  language?: string;
  code?: string;
  stdin?: string;
}

interface PistonRunResponse {
  language: string;
  version: string;
  run?: {
    stdout?: string;
    stderr?: string;
    output?: string;
    code?: number | null;
    signal?: string | null;
    time?: number | null;
  };
  compile?: {
    stdout?: string;
    stderr?: string;
    output?: string;
    code?: number | null;
    signal?: string | null;
  };
  message?: string;
}

interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

interface RuntimesCache {
  data: Map<string, string[]>; // language -> versions[]
  timestamp: number;
}

// Cache for runtimes data (1 hour)
let runtimesCache: RuntimesCache | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const LANGUAGE_MAP: Record<
  LiveCodingLanguage,
  { language: string; version: string; fileName: string }
> = {
  python: { language: "python", version: "3.10.0", fileName: "main.py" },
  javascript: { language: "javascript", version: "18.15.0", fileName: "main.js" },
  java: { language: "java", version: "15.0.2", fileName: "Main.java" },
  csharp: { language: "csharp", version: "6.12.0", fileName: "Program.cs" },
  php: { language: "php", version: "8.2.3", fileName: "main.php" },
  typescript: { language: "typescript", version: "5.0.3", fileName: "main.ts" },
  go: { language: "go", version: "1.16.2", fileName: "main.go" },
  rust: { language: "rust", version: "1.68.2", fileName: "main.rs" },
  cpp: { language: "cpp", version: "10.2.0", fileName: "main.cpp" },
  kotlin: { language: "kotlin", version: "1.8.20", fileName: "Main.kt" },
  ruby: { language: "ruby", version: "3.0.1", fileName: "main.rb" },
};

const MAX_CODE_LENGTH = 100_000;
const REQUEST_TIMEOUT_MS = 25_000;
const FALLBACK_DELAY_MS = 250; // Minimum delay between fallback version attempts (must be > 200ms for Piston API rate limit)

/**
 * Fetches available runtimes from Piston API with caching
 */
async function getPistonRuntimes(): Promise<Map<string, string[]>> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (runtimesCache && (now - runtimesCache.timestamp) < CACHE_DURATION_MS) {
    return runtimesCache.data;
  }

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/runtimes", {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch runtimes from Piston API:", response.status);
      // Return empty map if fetch fails, will use fallback versions
      return new Map();
    }

    const runtimes = (await response.json()) as PistonRuntime[];
    
    // Group by language and collect all versions
    const languageVersions = new Map<string, string[]>();
    
    for (const runtime of runtimes) {
      const lang = runtime.language;
      if (!languageVersions.has(lang)) {
        languageVersions.set(lang, []);
      }
      languageVersions.get(lang)!.push(runtime.version);
    }

    // Sort versions in descending order (newest first)
    for (const [lang, versions] of languageVersions.entries()) {
      versions.sort((a, b) => {
        // Simple version comparison (works for most cases)
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = aParts[i] || 0;
          const bPart = bParts[i] || 0;
          if (bPart !== aPart) {
            return bPart - aPart;
          }
        }
        return 0;
      });
    }

    // Update cache
    runtimesCache = {
      data: languageVersions,
      timestamp: now,
    };

    return languageVersions;
  } catch (error) {
    console.error("Error fetching runtimes from Piston API:", error);
    // Return empty map if fetch fails, will use fallback versions
    return new Map();
  }
}

/**
 * Gets supported versions for a language from Piston API
 */
async function getSupportedVersions(language: string): Promise<string[]> {
  const runtimes = await getPistonRuntimes();
  return runtimes.get(language) || [];
}

/**
 * Helper function to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if an error message indicates a rate limit error
 */
function isRateLimitError(message: string): boolean {
  if (!message) return false;
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes("rate limit") ||
    lowerMessage.includes("200ms") ||
    lowerMessage.includes("too many requests") ||
    lowerMessage.includes("istekler 200ms") ||
    lowerMessage.includes("requests are limited")
  );
}

/**
 * Translates error messages from Piston API to Turkish using OpenAI
 */
async function translateErrorToTurkish(errorText: string): Promise<string> {
  if (!errorText || !errorText.trim()) {
    return errorText;
  }

  // If AI is not enabled, return original error
  if (!isAIEnabled()) {
    return errorText;
  }

  try {
    const openai = await ensureAIEnabled();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir programlama hata mesajı çevirmenisin. Verilen hata mesajını Türkçe'ye çevir. Sadece çeviriyi döndür, başka açıklama yapma. Hata kodlarını (örn: CS1002, SyntaxError) koru ama açıklamaları Türkçe yap.",
        },
        {
          role: "user",
          content: `Aşağıdaki programlama hata mesajını Türkçe'ye çevir:\n\n${errorText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const translated = completion.choices[0]?.message?.content?.trim();
    return translated || errorText;
  } catch (error) {
    console.error("Error translation failed:", error);
    // Return original error if translation fails
    return errorText;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RunRequestBody;
    const rawLanguage = typeof body.language === "string" ? body.language.toLowerCase() : "";
    const language = Object.prototype.hasOwnProperty.call(LANGUAGE_MAP, rawLanguage)
      ? (rawLanguage as LiveCodingLanguage)
      : null;

    if (!language) {
      return NextResponse.json(
        { error: "Desteklenmeyen dil." },
        { status: 400 }
      );
    }

    const code =
      typeof body.code === "string" && body.code.trim().length > 0
        ? body.code.slice(0, MAX_CODE_LENGTH)
        : "";

    if (!code) {
      return NextResponse.json(
        { error: "Çalıştırmak için kod girilmelidir." },
        { status: 400 }
      );
    }

    const stdin = typeof body.stdin === "string" ? body.stdin : undefined;
    const config = LANGUAGE_MAP[language];

    // Get supported versions from Piston API
    const supportedVersions = await getSupportedVersions(config.language);
    
    // If we have supported versions, use them; otherwise fall back to default
    let fallbackVersions: string[];
    if (supportedVersions.length > 0) {
      // Use supported versions from Piston API (already sorted newest first)
      fallbackVersions = supportedVersions;
    } else {
      // Fallback to hardcoded versions if API fails
      const getFallbackVersions = (lang: LiveCodingLanguage, defaultVersion: string): string[] => {
        if (lang === "php") {
          return ["8.2", "8.1", "8.0", "7.4"];
        }
        if (lang === "typescript") {
          return ["5.0", "4.9", "4.8", "4.7"];
        }
        if (lang === "go") {
          return ["1.16.2"]; // Updated to match Piston API
        }
        if (lang === "rust") {
          return ["1.68.2", "1.68", "1.67"]; // Updated to match Piston API
        }
        if (lang === "kotlin") {
          return ["1.8.20", "1.8", "1.7"]; // Updated to match Piston API
        }
        if (lang === "ruby") {
          return ["3.0.1", "3.0", "2.7"]; // Updated to match Piston API
        }
        return [defaultVersion];
      };
      fallbackVersions = getFallbackVersions(language, config.version);
    }
    let lastError: string | null = null;
    let pistonResponse: Response | null = null;
    let payload: PistonRunResponse | null = null;

    // Try each version until one works
    // Use index-based loop to add delay between attempts (except first one)
    for (let i = 0; i < fallbackVersions.length; i++) {
      const version = fallbackVersions[i];

      // Add delay before attempting next version (except for first attempt)
      // This prevents rate limiting: Piston API allows 1 request per 200ms
      if (i > 0) {
        await delay(FALLBACK_DELAY_MS);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        pistonResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: config.language,
            version: version,
            files: [
              {
                name: config.fileName,
                content: code,
              },
            ],
            stdin,
            compile_timeout: 10_000,
            run_timeout: 10_000,
            compile_memory_limit: -1,
            run_memory_limit: -1,
          }),
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        payload = (await pistonResponse.json()) as PistonRunResponse;

        // Check if this version works
        if (pistonResponse.ok) {
          // Success! Use this version
          break;
        }

        // Check for rate limit error
        const errorMessage = payload?.message || payload?.run?.stderr || "";
        if (isRateLimitError(errorMessage)) {
          // Rate limit detected - retry with exponential backoff
          const maxRetries = 3;
          let retryAttempt = 0;
          let retrySuccess = false;

          while (retryAttempt < maxRetries && !retrySuccess) {
            // Exponential backoff: 250ms, 500ms, 1000ms
            const retryDelay = FALLBACK_DELAY_MS * Math.pow(2, retryAttempt);
            await delay(retryDelay);

            try {
              const retryController = new AbortController();
              const retryTimeoutId = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT_MS);

              const retryResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  language: config.language,
                  version: version,
                  files: [
                    {
                      name: config.fileName,
                      content: code,
                    },
                  ],
                  stdin,
                  compile_timeout: 10_000,
                  run_timeout: 10_000,
                  compile_memory_limit: -1,
                  run_memory_limit: -1,
                }),
                cache: "no-store",
                signal: retryController.signal,
              });

              clearTimeout(retryTimeoutId);
              const retryPayload = (await retryResponse.json()) as PistonRunResponse;

              if (retryResponse.ok) {
                // Retry successful!
                pistonResponse = retryResponse;
                payload = retryPayload;
                retrySuccess = true;
                break;
              }

              // If still rate limited, try again
              const retryErrorMessage = retryPayload?.message || retryPayload?.run?.stderr || "";
              if (!isRateLimitError(retryErrorMessage)) {
                // Different error, break retry loop
                lastError = retryErrorMessage;
                break;
              }

              retryAttempt++;
            } catch (retryError) {
              // Retry failed, continue to next retry attempt
              retryAttempt++;
              if (retryAttempt >= maxRetries) {
                lastError = "Kod çalıştırma servisi şu anda yoğun. Lütfen birkaç saniye bekleyip tekrar deneyin.";
              }
            }
          }

          // If retry was successful, break from version loop
          if (retrySuccess) {
            break;
          }

          // If all retries failed, continue to next version
          if (retryAttempt >= maxRetries) {
            lastError = lastError || "Kod çalıştırma servisi şu anda yoğun. Lütfen birkaç saniye bekleyip tekrar deneyin.";
            continue;
          }
        }

        // Check if error is about unknown/unsupported runtime
        const lowerErrorMessage = errorMessage.toLowerCase();
        const isRuntimeError = 
          (lowerErrorMessage.includes("runtime") && (lowerErrorMessage.includes("unknown") || lowerErrorMessage.includes("not found") || lowerErrorMessage.includes("not available"))) ||
          lowerErrorMessage.includes("unsupported") ||
          lowerErrorMessage.includes("version not found") ||
          lowerErrorMessage.includes("language not found");
        
        if (isRuntimeError) {
          // This version doesn't exist, try next one
          lastError = errorMessage;
          continue;
        }

        // Other error, return it
        lastError = errorMessage;
        break;
      } catch (error) {
        clearTimeout(timeoutId);
        const isAbortError = (error as Error)?.name === "AbortError";
        if (isAbortError) {
          return NextResponse.json(
            { error: "Kod çalıştırma zaman aşımına uğradı." },
            { status: 504 }
          );
        }
        // Network error, return immediately
        return NextResponse.json(
          { error: "Kod çalıştırma servisine ulaşılamadı." },
          { status: 504 }
        );
      }
    }

    // If we tried all versions and none worked
    if (!pistonResponse || !pistonResponse.ok) {
      const message = lastError || payload?.message || payload?.run?.stderr || "Kod çalıştırma başarısız oldu.";
      
      // Check if it's a rate limit error and provide user-friendly message
      let finalMessage = message;
      if (isRateLimitError(message)) {
        finalMessage = "Kod çalıştırma servisi şu anda yoğun. Lütfen birkaç saniye bekleyip tekrar deneyin.";
      } else {
        // Check if all versions failed due to runtime errors
        const lowerMessage = message.toLowerCase();
        const isAllVersionsFailed = 
          (lowerMessage.includes("runtime") && (lowerMessage.includes("unknown") || lowerMessage.includes("not found"))) ||
          lowerMessage.includes("unsupported") ||
          lowerMessage.includes("version not found");
        
        if (isAllVersionsFailed) {
          finalMessage = "Bu programlama dili için desteklenen bir çalışma zamanı bulunamadı. Lütfen daha sonra tekrar deneyin veya farklı bir dil seçin.";
        } else {
          // Translate other errors to Turkish
          finalMessage = await translateErrorToTurkish(message);
        }
      }
      
      return NextResponse.json(
        { error: finalMessage },
        { 
          status: pistonResponse?.status || 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }

    // Translate error messages in response
    if (!payload) {
      return NextResponse.json(
        { error: "Kod çalıştırma yanıtı alınamadı." },
        { status: 500 }
      );
    }

    const translatedPayload = { ...payload };
    
    if (translatedPayload.compile?.stderr) {
      translatedPayload.compile.stderr = await translateErrorToTurkish(translatedPayload.compile.stderr);
    }
    
    if (translatedPayload.run?.stderr) {
      translatedPayload.run.stderr = await translateErrorToTurkish(translatedPayload.run.stderr);
    }

    return NextResponse.json(
      {
        language,
        version: translatedPayload.version,
        run: translatedPayload.run,
        compile: translatedPayload.compile,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  } catch (error) {
    console.error("Live coding run error:", error);
    return NextResponse.json(
      { error: "Kod çalıştırılırken beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}


