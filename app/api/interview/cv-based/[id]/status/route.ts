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
  const requestStartTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`[CV_INTERVIEW_STATUS] ========== STATUS KONTROLÜ BAŞLADI ==========`);
    console.log(`[CV_INTERVIEW_STATUS] Timestamp: ${timestamp}`);
    
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      console.error(`[CV_INTERVIEW_STATUS] ❌ Unauthorized - userId yok`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interviewId = params.id;
    console.log(`[CV_INTERVIEW_STATUS] [1/5] Request alındı - interviewId: ${interviewId}, userId: ${userId}`);

    if (!interviewId || typeof interviewId !== "string") {
      console.error(`[CV_INTERVIEW_STATUS] [1/5] ❌ Interview ID geçersiz`);
      return NextResponse.json(
        { error: "Interview ID gereklidir" },
        { status: 400 }
      );
    }

    // Interview'ı al
    console.log(`[CV_INTERVIEW_STATUS] [2/5] Interview veritabanından sorgulanıyor...`);
    const interview = await db.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      console.error(`[CV_INTERVIEW_STATUS] [2/5] ❌ Interview bulunamadı - interviewId: ${interviewId}`);
      return NextResponse.json(
        { error: "Interview bulunamadı" },
        { status: 404 }
      );
    }
    console.log(`[CV_INTERVIEW_STATUS] [2/5] ✅ Interview bulundu - title: ${interview.title}, type: ${interview.type}`);

    // Interview'ın kullanıcıya ait olduğunu kontrol et (CV üzerinden)
    console.log(`[CV_INTERVIEW_STATUS] [3/5] Yetki kontrolü yapılıyor...`);
    if (interview.cvId) {
      const cv = await db.cV.findUnique({
        where: { id: interview.cvId },
      });

      if (!cv || cv.userId !== userId) {
        console.error(`[CV_INTERVIEW_STATUS] [3/5] ❌ Yetki yok - cv.userId: ${cv?.userId}, request.userId: ${userId}`);
        return NextResponse.json(
          { error: "Bu interview'a erişim yetkiniz yok" },
          { status: 403 }
        );
      }
      console.log(`[CV_INTERVIEW_STATUS] [3/5] ✅ Yetki kontrolü başarılı`);
    }

    // Questions field'ından durumu kontrol et
    console.log(`[CV_INTERVIEW_STATUS] [4/5] Questions field analiz ediliyor...`);
    const questions = interview.questions as any;
    
    // Questions field yapısını detaylı logla
    console.log(`[CV_INTERVIEW_STATUS] [4/5] Questions field tipi: ${typeof questions}`);
    console.log(`[CV_INTERVIEW_STATUS] [4/5] Questions isArray: ${Array.isArray(questions)}`);
    console.log(`[CV_INTERVIEW_STATUS] [4/5] Questions değeri:`, {
      type: typeof questions,
      isArray: Array.isArray(questions),
      isNull: questions === null,
      isUndefined: questions === undefined,
      length: Array.isArray(questions) ? questions.length : undefined,
      keys: questions && typeof questions === "object" && !Array.isArray(questions) ? Object.keys(questions) : undefined,
      hasStage1: questions && typeof questions === "object" && !Array.isArray(questions) ? !!questions.stage1_introduction : false,
      hasStage2: questions && typeof questions === "object" && !Array.isArray(questions) ? !!questions.stage2_experience : false,
      hasStage3: questions && typeof questions === "object" && !Array.isArray(questions) ? !!questions.stage3_technical : false,
    });
    
    // Hata durumunu kontrol et (description'da hata mesajı varsa)
    const description = interview.description || "";
    const hasError = 
      description.toLowerCase().includes("hata oluştu") || 
      description.toLowerCase().includes("error") ||
      description.toLowerCase().includes("hatası") ||
      description.toLowerCase().includes("failed") ||
      description.toLowerCase().includes("başarısız");
    
    console.log(`[CV_INTERVIEW_STATUS] [4/5] Description: ${description.substring(0, 100)}...`);
    console.log(`[CV_INTERVIEW_STATUS] [4/5] HasError: ${hasError}`);
    
    // Hata mesajını çıkar (eğer varsa)
    let errorMessage: string | undefined = undefined;
    if (hasError) {
      // Description'dan hata mesajını parse et
      const errorMatch = description.match(/hata oluştu[^:]*:\s*(.+)/i) || 
                        description.match(/error[^:]*:\s*(.+)/i) ||
                        description.match(/hatası[^:]*:\s*(.+)/i);
      errorMessage = errorMatch ? errorMatch[1].trim() : description;
      console.log(`[CV_INTERVIEW_STATUS] [4/5] Error message extracted: ${errorMessage}`);
    }
    
    let status: "generating" | "completed" | "error" = hasError ? "error" : "generating";
    let stage: 0 | 1 | 2 | 3 = 0;
    let progress = 0;
    let questionCount = 0;

    console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage hesaplama başlatılıyor...`);
    
    if (!questions || (Array.isArray(questions) && questions.length === 0)) {
      // Boş array - henüz başlamadı
      console.log(`[CV_INTERVIEW_STATUS] [5/5] Durum: Boş/henüz başlamadı`);
      status = hasError ? "error" : "generating";
      stage = 0;
      progress = 0;
      questionCount = 0;
    } else if (typeof questions === "object" && !Array.isArray(questions)) {
      // Object formatında (aşamalı yapı)
      console.log(`[CV_INTERVIEW_STATUS] [5/5] Durum: Object formatında (aşamalı yapı)`);
      
      if (questions.stage1_introduction) {
        const stage1Count = Array.isArray(questions.stage1_introduction) ? questions.stage1_introduction.length : 0;
        console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 1 bulundu - ${stage1Count} soru`);
        stage = 1;
        progress = 33;
        questionCount += stage1Count;
      }
      if (questions.stage2_experience) {
        const stage2Count = Array.isArray(questions.stage2_experience) ? questions.stage2_experience.length : 0;
        console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 2 bulundu - ${stage2Count} soru`);
        stage = 2;
        progress = 66;
        questionCount += stage2Count;
      }
      if (questions.stage3_technical) {
        console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 3 bulundu`);
        stage = 3;
        progress = 100;
        // stage3_technical varsa completed olarak işaretle (array formatına dönüştürülmüş olabilir veya olmayabilir)
        status = hasError ? "error" : "completed";
        // stage3_technical içindeki soruları say
        if (questions.stage3_technical.testQuestions) {
          const testCount = Array.isArray(questions.stage3_technical.testQuestions) ? questions.stage3_technical.testQuestions.length : 0;
          console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 3 - testQuestions: ${testCount}`);
          questionCount += testCount;
        }
        if (questions.stage3_technical.liveCoding) {
          console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 3 - liveCoding: 1`);
          questionCount += 1;
        }
        if (questions.stage3_technical.bugFix) {
          console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 3 - bugFix: 1`);
          questionCount += 1;
        }
        if (questions.stage3_technical.realWorldScenarios) {
          const scenarioCount = Array.isArray(questions.stage3_technical.realWorldScenarios) ? questions.stage3_technical.realWorldScenarios.length : 0;
          console.log(`[CV_INTERVIEW_STATUS] [5/5] Stage 3 - realWorldScenarios: ${scenarioCount}`);
          questionCount += scenarioCount;
        }
      }
    } else if (Array.isArray(questions) && questions.length > 0) {
      // Array formatında (tamamlanmış)
      console.log(`[CV_INTERVIEW_STATUS] [5/5] Durum: Array formatında (tamamlanmış) - ${questions.length} soru`);
      status = hasError ? "error" : "completed";
      stage = 3;
      progress = 100;
      questionCount = questions.length;
    }

    const responseTime = Date.now() - requestStartTime;
    console.log(`[CV_INTERVIEW_STATUS] [5/5] ✅ Stage hesaplama tamamlandı - süre: ${responseTime}ms`);
    console.log(`[CV_INTERVIEW_STATUS] Final durum:`, {
      status,
      stage,
      progress,
      questionCount,
      error: errorMessage,
    });
    console.log(`[CV_INTERVIEW_STATUS] ========== STATUS KONTROLÜ TAMAMLANDI ==========`);

    return NextResponse.json({
      status,
      stage,
      progress,
      interviewId: interview.id,
      questionCount,
      error: errorMessage,
    });
  } catch (error: any) {
    const errorTime = Date.now() - requestStartTime;
    console.error(`[CV_INTERVIEW_STATUS] ========== HATA OLUŞTU ==========`);
    console.error(`[CV_INTERVIEW_STATUS] Timestamp: ${timestamp}`);
    console.error(`[CV_INTERVIEW_STATUS] Hata süresi: ${errorTime}ms`);
    console.error(`[CV_INTERVIEW_STATUS] Hata detayları:`, {
      message: error?.message || "Bilinmeyen hata",
      name: error?.name,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: `Status kontrolü sırasında bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

