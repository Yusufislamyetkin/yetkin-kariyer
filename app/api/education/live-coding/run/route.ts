import { NextResponse } from "next/server";

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
};

const MAX_CODE_LENGTH = 100_000;
const REQUEST_TIMEOUT_MS = 25_000;

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let pistonResponse: Response;

    try {
      pistonResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
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
    } catch (error) {
      const isAbortError = (error as Error)?.name === "AbortError";
      return NextResponse.json(
        { error: isAbortError ? "Kod çalıştırma zaman aşımına uğradı." : "Kod çalıştırma servisine ulaşılamadı." },
        { status: 504 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    const payload = (await pistonResponse.json()) as PistonRunResponse;

    if (!pistonResponse.ok) {
      const message = payload?.message || payload?.run?.stderr || "Kod çalıştırma başarısız oldu.";
      return NextResponse.json({ error: message }, { status: pistonResponse.status });
    }

    return NextResponse.json({
      language,
      version: payload.version,
      run: payload.run,
      compile: payload.compile,
    });
  } catch (error) {
    console.error("Live coding run error:", error);
    return NextResponse.json(
      { error: "Kod çalıştırılırken beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}


