import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  getMaxLiveCodingTaskCount,
  getSupportedLiveCodingLanguages,
  normalizeLiveCodingPayload,
} from "@/lib/education/liveCoding";
import type { LiveCodingLanguage } from "@/types/live-coding";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json(
        { error: "Geçersiz canlı kodlama ID'si" },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "LIVE_CODING",
      },
      include: {
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

    if (!quiz) {
      return NextResponse.json(
        { error: `Canlı kodlama bulunamadı (ID: ${params.id})` },
        { status: 404 }
      );
    }

    // Questions field'ının varlığını kontrol et
    if (!quiz.questions) {
      console.error(`[LIVE_CODING] Quiz ${params.id} has no questions field`);
      return NextResponse.json(
        { error: "Canlı kodlama içeriği eksik veya bozuk" },
        { status: 500 }
      );
    }

    // Normalizasyon işlemini try-catch ile koru
    let liveCodingConfig;
    try {
      liveCodingConfig = normalizeLiveCodingPayload(quiz.questions);
      
      // Normalize edilmiş tasks'in boş olmadığını kontrol et
      if (!liveCodingConfig.tasks || liveCodingConfig.tasks.length === 0) {
        console.error(`[LIVE_CODING] Quiz ${params.id} normalized to empty tasks`);
        return NextResponse.json(
          { error: "Canlı kodlama görevleri bulunamadı" },
          { status: 500 }
        );
      }
    } catch (normalizeError) {
      console.error(`[LIVE_CODING] Error normalizing quiz ${params.id}:`, normalizeError);
      return NextResponse.json(
        { 
          error: "Canlı kodlama verisi işlenirken bir hata oluştu",
          details: process.env.NODE_ENV === "development" 
            ? (normalizeError instanceof Error ? normalizeError.message : String(normalizeError))
            : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      quiz: {
        ...quiz,
        liveCoding: {
          ...liveCodingConfig,
          supportedLanguages: getSupportedLiveCodingLanguages(),
          maxTaskCount: getMaxLiveCodingTaskCount(),
        },
      },
    });
  } catch (error) {
    console.error("[LIVE_CODING] Error fetching live coding:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { 
        error: "Canlı kodlama yüklenirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tasks, metadata, metrics, startedAt, completedAt } = body;

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "LIVE_CODING",
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Canlı kodlama bulunamadı" }, { status: 404 });
    }

    const userId = session.user.id as string;

    const supportedLanguageList = getSupportedLiveCodingLanguages();
    const supportedLanguages = new Set(supportedLanguageList);
    const tasksArray = Array.isArray(tasks) ? tasks : [];

    const normalizedTasks = tasksArray
      .map((task) => {
        const taskId = typeof task?.taskId === "string" ? task.taskId : typeof task?.id === "string" ? task.id : null;
        const rawLanguage = typeof task?.language === "string" ? task.language.toLowerCase() : null;
        const language =
          rawLanguage && supportedLanguages.has(rawLanguage as LiveCodingLanguage)
            ? (rawLanguage as LiveCodingLanguage)
            : supportedLanguageList[0];
        const codeValue = typeof task?.code === "string" ? task.code : "";
        const timeLimitSeconds =
          typeof task?.timeLimitSeconds === "number" ? Math.max(0, task.timeLimitSeconds) : null;
        const durationSeconds =
          typeof task?.durationSeconds === "number" ? Math.max(0, task.durationSeconds) : null;
        const timeRemainingSeconds =
          typeof task?.timeRemainingSeconds === "number" ? Math.max(0, task.timeRemainingSeconds) : null;

        if (!taskId) {
          return null;
        }

        return {
          taskId,
          language,
          code: codeValue,
          timeLimitSeconds,
          durationSeconds,
          timeRemainingSeconds,
        };
      })
      .filter((task): task is NonNullable<typeof task> => Boolean(task));

    const totalDurationSeconds = normalizedTasks.reduce(
      (total, task) => total + (task.durationSeconds ?? 0),
      0
    );
    const completedTaskCount = normalizedTasks.filter((task) => task.code.trim().length > 0).length;

    const normalizedMetadata = {
      ...(typeof metadata === "object" && metadata !== null ? metadata : {}),
      startedAt: typeof startedAt === "string" ? startedAt : null,
      completedAt: typeof completedAt === "string" ? completedAt : null,
    };

    const defaultMetrics = {
      totalDurationSeconds,
      completedTaskCount,
      totalTaskCount: normalizedTasks.length,
      tasks: normalizedTasks.map((task) => ({
        taskId: task.taskId,
        language: task.language,
        durationSeconds: task.durationSeconds,
        timeRemainingSeconds: task.timeRemainingSeconds,
      })),
    };

    const storedMetrics =
      metrics && typeof metrics === "object"
        ? { ...defaultMetrics, ...metrics }
        : defaultMetrics;

    const storedCode = normalizedTasks.length
      ? JSON.stringify({ tasks: normalizedTasks, metadata: normalizedMetadata })
      : null;

    // LiveCodingAttempt oluştur
    const liveCodingAttempt = await db.liveCodingAttempt.create({
      data: {
        userId,
        quizId: params.id,
        code: storedCode,
        metrics: storedMetrics,
      },
    });

    // AI analysis'i background'da yap
    if (process.env.OPENAI_API_KEY && process.env.NEXTAUTH_URL) {
      fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveCodingAttemptId: liveCodingAttempt.id }),
      }).catch(() => {});
    }

    return NextResponse.json({ liveCodingAttempt });
  } catch (error) {
    console.error("[LIVE_CODING] Error submitting live coding:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { 
        error: "Canlı kodlama gönderilirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

