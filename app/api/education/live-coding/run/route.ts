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

const LANGUAGE_MAP: Record<
  LiveCodingLanguage,
  { language: string; version: string; fileName: string }
> = {
  python: { language: "python", version: "3.10.0", fileName: "main.py" },
  javascript: { language: "javascript", version: "18.15.0", fileName: "main.js" },
  java: { language: "java", version: "15.0.2", fileName: "Main.java" },
  csharp: { language: "csharp", version: "6.12.0", fileName: "Program.cs" },
  php: { language: "php", version: "8.2", fileName: "main.php" },
  typescript: { language: "typescript", version: "5.0", fileName: "main.ts" },
  go: { language: "go", version: "1.21", fileName: "main.go" },
  rust: { language: "rust", version: "1.70", fileName: "main.rs" },
  cpp: { language: "cpp", version: "10.2.0", fileName: "main.cpp" },
  kotlin: { language: "kotlin", version: "1.9", fileName: "Main.kt" },
  ruby: { language: "ruby", version: "3.2", fileName: "main.rb" },
};

const MAX_CODE_LENGTH = 100_000;
const REQUEST_TIMEOUT_MS = 25_000;

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

    // PHP, TypeScript, Go, Rust, Kotlin ve Ruby için fallback versiyonlar (eğer bir versiyon çalışmazsa diğerini dene)
    const getFallbackVersions = (lang: LiveCodingLanguage, defaultVersion: string): string[] => {
      if (lang === "php") {
        return ["8.2", "8.1", "8.0", "7.4"];
      }
      if (lang === "typescript") {
        return ["5.0", "4.9", "4.8", "4.7"];
      }
      if (lang === "go") {
        return ["1.21", "1.20", "1.19", "1.18"];
      }
      if (lang === "rust") {
        return ["1.70", "1.69", "1.68", "1.67"];
      }
      if (lang === "kotlin") {
        return ["1.9", "1.8", "1.7", "1.6"];
      }
      if (lang === "ruby") {
        return ["3.2", "3.1", "3.0", "2.7"];
      }
      return [defaultVersion];
    };
    const fallbackVersions = getFallbackVersions(language, config.version);
    let lastError: string | null = null;
    let pistonResponse: Response | null = null;
    let payload: PistonRunResponse | null = null;

    // Try each version until one works
    for (const version of fallbackVersions) {
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

        // Check if error is about unknown runtime
        const errorMessage = payload?.message || payload?.run?.stderr || "";
        if (errorMessage.includes("runtime") && errorMessage.includes("unknown")) {
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
      const translatedMessage = await translateErrorToTurkish(message);
      return NextResponse.json(
        { error: translatedMessage },
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


