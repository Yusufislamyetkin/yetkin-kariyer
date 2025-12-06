import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserIdFromSession } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Status check için kısa timeout yeterli

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interviewId = params.id;

    if (!interviewId || typeof interviewId !== "string") {
      return NextResponse.json(
        { error: "Interview ID gereklidir" },
        { status: 400 }
      );
    }

    // Interview'ı al
    const interview = await db.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview bulunamadı" },
        { status: 404 }
      );
    }

    // Interview'ın kullanıcıya ait olduğunu kontrol et (CV üzerinden)
    if (interview.cvId) {
      const cv = await db.cV.findUnique({
        where: { id: interview.cvId },
      });

      if (!cv || cv.userId !== userId) {
        return NextResponse.json(
          { error: "Bu interview'a erişim yetkiniz yok" },
          { status: 403 }
        );
      }
    }

    // Questions field'ından durumu kontrol et
    const questions = interview.questions as any;
    
    // Hata durumunu kontrol et (description'da hata mesajı varsa)
    const description = interview.description || "";
    const hasError = 
      description.toLowerCase().includes("hata oluştu") || 
      description.toLowerCase().includes("error") ||
      description.toLowerCase().includes("hatası") ||
      description.toLowerCase().includes("failed") ||
      description.toLowerCase().includes("başarısız");
    
    // Hata mesajını çıkar (eğer varsa)
    let errorMessage: string | undefined = undefined;
    if (hasError) {
      // Description'dan hata mesajını parse et
      const errorMatch = description.match(/hata oluştu[^:]*:\s*(.+)/i) || 
                        description.match(/error[^:]*:\s*(.+)/i) ||
                        description.match(/hatası[^:]*:\s*(.+)/i);
      errorMessage = errorMatch ? errorMatch[1].trim() : description;
    }
    
    let status: "generating" | "completed" | "error" = hasError ? "error" : "generating";
    let stage: 0 | 1 | 2 | 3 = 0;
    let progress = 0;
    let questionCount = 0;

    if (!questions || (Array.isArray(questions) && questions.length === 0)) {
      // Boş array - henüz başlamadı
      status = hasError ? "error" : "generating";
      stage = 0;
      progress = 0;
      questionCount = 0;
    } else if (typeof questions === "object" && !Array.isArray(questions)) {
      // Object formatında (aşamalı yapı)
      if (questions.stage1_introduction) {
        stage = 1;
        progress = 33;
        questionCount += Array.isArray(questions.stage1_introduction) ? questions.stage1_introduction.length : 0;
      }
      if (questions.stage2_experience) {
        stage = 2;
        progress = 66;
        questionCount += Array.isArray(questions.stage2_experience) ? questions.stage2_experience.length : 0;
      }
      if (questions.stage3_technical) {
        stage = 3;
        progress = 100;
        // stage3_technical varsa completed olarak işaretle (array formatına dönüştürülmüş olabilir veya olmayabilir)
        status = hasError ? "error" : "completed";
        // stage3_technical içindeki soruları say
        if (questions.stage3_technical.testQuestions) {
          questionCount += Array.isArray(questions.stage3_technical.testQuestions) ? questions.stage3_technical.testQuestions.length : 0;
        }
        if (questions.stage3_technical.liveCoding) {
          questionCount += 1;
        }
        if (questions.stage3_technical.bugFix) {
          questionCount += 1;
        }
        if (questions.stage3_technical.realWorldScenarios) {
          questionCount += Array.isArray(questions.stage3_technical.realWorldScenarios) ? questions.stage3_technical.realWorldScenarios.length : 0;
        }
      }
    } else if (Array.isArray(questions) && questions.length > 0) {
      // Array formatında (tamamlanmış)
      status = hasError ? "error" : "completed";
      stage = 3;
      progress = 100;
      questionCount = questions.length;
    }

    return NextResponse.json({
      status,
      stage,
      progress,
      interviewId: interview.id,
      questionCount,
      error: errorMessage,
    });
  } catch (error: any) {
    console.error("[CV_INTERVIEW_STATUS] Hata:", error);
    return NextResponse.json(
      { error: `Status kontrolü sırasında bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

