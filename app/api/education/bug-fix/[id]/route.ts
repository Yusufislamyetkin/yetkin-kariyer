import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";
import { ensureAIEnabled, isAIEnabled } from "@/lib/ai/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json(
        { error: "Geçersiz bug fix ID'si" },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "BUG_FIX",
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
        { error: `Bug fix bulunamadı (ID: ${params.id})` },
        { status: 404 }
      );
    }

    // Questions field'ının varlığını kontrol et
    if (!quiz.questions) {
      console.error(`[BUG_FIX] Quiz ${params.id} has no questions field`);
      return NextResponse.json(
        { error: "Bug fix içeriği eksik veya bozuk" },
        { status: 500 }
      );
    }

    // Questions'un geçerli bir yapıda olduğunu kontrol et
    try {
      const questionsData = quiz.questions as any;
      // Tasks array veya object olup olmadığını kontrol et
      const hasTasks = Array.isArray(questionsData) || 
                      (typeof questionsData === "object" && questionsData !== null && 
                       (Array.isArray(questionsData.tasks) || Array.isArray(questionsData)));
      
      if (!hasTasks) {
        console.error(`[BUG_FIX] Quiz ${params.id} has invalid questions structure:`, questionsData);
        return NextResponse.json(
          { error: "Bug fix görevleri bulunamadı veya geçersiz format" },
          { status: 500 }
        );
      }
    } catch (validationError) {
      console.error(`[BUG_FIX] Error validating quiz ${params.id} questions:`, validationError);
      return NextResponse.json(
        { 
          error: "Bug fix verisi işlenirken bir hata oluştu",
          details: process.env.NODE_ENV === "development" 
            ? (validationError instanceof Error ? validationError.message : String(validationError))
            : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("[BUG_FIX] Error fetching bug fix:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { 
        error: "Bug fix yüklenirken bir hata oluştu",
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
    const { fixedCode, metrics, duration, tasks } = body;

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "BUG_FIX",
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Bug fix bulunamadı" }, { status: 404 });
    }

    const userId = session.user.id as string;

    // Parse tasks from quiz questions
    const questionsData = quiz.questions as any;
    const quizTasks = Array.isArray(questionsData)
      ? questionsData
      : questionsData?.tasks || [];

    // Perform AI evaluation for each task if AI is enabled
    let aiEvaluationResults: any = null;
    let overallCorrect = false;

    if (isAIEnabled() && tasks && Array.isArray(tasks) && tasks.length > 0) {
      try {
        const openai = await ensureAIEnabled();
        const evaluations = await Promise.all(
          tasks.map(async (task: any, index: number) => {
            const quizTask = quizTasks[index];
            if (!quizTask) return null;

            const buggyCode = quizTask.buggyCode?.[task.language] || quizTask.buggyCode || "";
            const expectedOutput = quizTask.expectedOutput || "";
            const expectedFix = quizTask.expectedFix || "";
            const acceptanceCriteria = quizTask.acceptanceCriteria || [];

            const prompt = `Sen bir bug fix değerlendirme uzmanısın. Öğrencinin hatalı kodu düzeltip düzeltmediğini analiz et.

GÖREV: ${quizTask.title || quizTask.description || "Bug Fix Görevi"}
${quizTask.description ? `Açıklama: ${quizTask.description}` : ""}
${expectedFix ? `Beklenen Düzeltme: ${expectedFix}` : ""}

HATALI KOD:
\`\`\`${task.language}
${buggyCode}
\`\`\`

ÖĞRENCİNİN DÜZELTTİĞİ KOD:
\`\`\`${task.language}
${task.code}
\`\`\`

BEKLENEN ÇIKTI: ${expectedOutput}
${acceptanceCriteria.length > 0 ? `Kabul Kriterleri:\n${acceptanceCriteria.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")}` : ""}

Değerlendirme:
1. Öğrenci hatayı doğru şekilde düzeltmiş mi? (isCorrect: true/false)
2. Çıktı beklenen çıktı ile eşleşiyor mu?
3. Acceptance criteria'lar karşılanmış mı?

JSON formatında yanıt ver:
{
  "isCorrect": boolean,
  "feedback": "string (Türkçe, kısa geri bildirim)",
  "score": number (0-100)
}`;

            const completion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: "Sen bir bug fix değerlendirme uzmanısın. Her zaman JSON formatında yanıt ver.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.3,
              max_tokens: 500,
              response_format: { type: "json_object" },
            });

            const responseContent = completion.choices[0]?.message?.content;
            if (responseContent) {
              try {
                return JSON.parse(responseContent);
              } catch {
                return { isCorrect: false, feedback: "Değerlendirme yapılamadı", score: 0 };
              }
            }
            return { isCorrect: false, feedback: "AI yanıtı alınamadı", score: 0 };
          })
        );

        const validEvaluations = evaluations.filter((e) => e !== null);
        overallCorrect = validEvaluations.every((e: any) => e.isCorrect);
        const averageScore = validEvaluations.length > 0
          ? validEvaluations.reduce((sum: number, e: any) => sum + (e.score || 0), 0) / validEvaluations.length
          : 0;

        aiEvaluationResults = {
          evaluations: validEvaluations,
          overallCorrect,
          averageScore: Math.round(averageScore),
          totalTasks: validEvaluations.length,
          correctTasks: validEvaluations.filter((e: any) => e.isCorrect).length,
        };
      } catch (aiError) {
        console.error("[BUG_FIX] AI evaluation error:", aiError);
        // Continue without AI evaluation
      }
    }

    // BugFixAttempt oluştur
    const bugFixAttempt = await db.bugFixAttempt.create({
      data: {
        userId,
        quizId: params.id,
        fixedCode: fixedCode || null,
        metrics: metrics || {
          bugsFixed: 0,
          timeTaken: duration ? parseInt(duration) : null,
          codeQuality: aiEvaluationResults?.averageScore || 0,
        },
        aiEvaluation: aiEvaluationResults,
      },
    });

    // Emit gamification event
    try {
      const event = await recordEvent({
        userId,
        type: "bug_fix_completed",
        payload: { quizId: params.id },
      });
      await applyRules({ userId, type: "bug_fix_completed", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn("Gamification bug_fix_completed failed:", e);
    }

    return NextResponse.json({
      bugFixAttempt,
      aiEvaluation: aiEvaluationResults,
      isCorrect: overallCorrect,
    });
  } catch (error) {
    console.error("[BUG_FIX] Error submitting bug fix:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { 
        error: "Bug fix gönderilirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

