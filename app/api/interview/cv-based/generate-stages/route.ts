import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateStage1Questions, generateStage2Questions, generateStage3Questions, formatQuestionsForInterview, extractCVInfo } from "@/lib/ai/interview-generator";
import { getUserIdFromSession } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 dakika timeout (Vercel Pro plan için)

/**
 * Arka planda aşamalı olarak mülakat sorularını oluşturur
 */
async function generateInterviewStages(interviewId: string, cvId: string) {
  const startTime = Date.now();
  let currentStage = 0;
  
  try {
    console.log(`[CV_INTERVIEW_BG] Aşamalı mülakat oluşturma başladı: ${interviewId}, cvId: ${cvId}`);
    
    // Interview'ın var olduğunu kontrol et
    const initialInterview = await db.interview.findUnique({
      where: { id: interviewId },
    });
    
    if (!initialInterview) {
      throw new Error(`Interview bulunamadı: ${interviewId}`);
    }
    
    console.log(`[CV_INTERVIEW_BG] Interview kaydı doğrulandı: ${interviewId}`);

    // Aşama 1: Genel Tanışma
    currentStage = 1;
    console.log(`[CV_INTERVIEW_BG] Aşama 1 başlatılıyor... (interviewId: ${interviewId})`);
    
    let stage1;
    try {
      stage1 = await generateStage1Questions(cvId);
      console.log(`[CV_INTERVIEW_BG] Aşama 1 soruları oluşturuldu: ${stage1.stage1_introduction?.length || 0} soru`);
    } catch (stageError: any) {
      console.error(`[CV_INTERVIEW_BG] Aşama 1 hatası:`, stageError);
      const errorMessage = stageError?.message || "Bilinmeyen hata";
      const isTimeoutError = 
        errorMessage.includes("zaman aşımı") ||
        errorMessage.includes("aborted") ||
        errorMessage.includes("Request was aborted") ||
        stageError?.isTimeout === true;
      
      if (isTimeoutError) {
        throw new Error(
          `Aşama 1 (Genel Tanışma) soruları oluşturulurken zaman aşımı oluştu. Lütfen tekrar deneyin.`
        );
      }
      throw new Error(`Aşama 1 (Genel Tanışma) hatası: ${errorMessage}`);
    }
    
    // Interview kaydını güncelle - Aşama 1
    try {
      await db.interview.update({
        where: { id: interviewId },
        data: {
          questions: {
            stage1_introduction: stage1.stage1_introduction,
          } as any,
        },
      });
      console.log(`[CV_INTERVIEW_BG] Aşama 1 veritabanına kaydedildi`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] Aşama 1 veritabanı güncelleme hatası:`, updateError);
      throw new Error(`Aşama 1 veritabanı güncelleme hatası: ${updateError?.message || "Bilinmeyen hata"}`);
    }

    // Aşama 2: Deneyim
    currentStage = 2;
    console.log(`[CV_INTERVIEW_BG] Aşama 2 başlatılıyor... (interviewId: ${interviewId})`);
    
    let stage2;
    try {
      stage2 = await generateStage2Questions(cvId);
      console.log(`[CV_INTERVIEW_BG] Aşama 2 soruları oluşturuldu: ${stage2.stage2_experience?.length || 0} soru`);
    } catch (stageError: any) {
      console.error(`[CV_INTERVIEW_BG] Aşama 2 hatası:`, stageError);
      const errorMessage = stageError?.message || "Bilinmeyen hata";
      const isTimeoutError = 
        errorMessage.includes("zaman aşımı") ||
        errorMessage.includes("aborted") ||
        errorMessage.includes("Request was aborted") ||
        stageError?.isTimeout === true;
      
      if (isTimeoutError) {
        throw new Error(
          `Aşama 2 (Deneyim) soruları oluşturulurken zaman aşımı oluştu. Lütfen tekrar deneyin.`
        );
      }
      throw new Error(`Aşama 2 (Deneyim) hatası: ${errorMessage}`);
    }
    
    // Interview kaydını güncelle - Aşama 2
    try {
      const currentInterview = await db.interview.findUnique({
        where: { id: interviewId },
      });
      const currentQuestions = (currentInterview?.questions as any) || {};
      
      await db.interview.update({
        where: { id: interviewId },
        data: {
          questions: {
            ...currentQuestions,
            stage2_experience: stage2.stage2_experience,
          } as any,
        },
      });
      console.log(`[CV_INTERVIEW_BG] Aşama 2 veritabanına kaydedildi`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] Aşama 2 veritabanı güncelleme hatası:`, updateError);
      throw new Error(`Aşama 2 veritabanı güncelleme hatası: ${updateError?.message || "Bilinmeyen hata"}`);
    }

    // Aşama 3: Teknik
    currentStage = 3;
    console.log(`[CV_INTERVIEW_BG] Aşama 3 başlatılıyor... (interviewId: ${interviewId})`);
    
    let stage3;
    try {
      stage3 = await generateStage3Questions(cvId);
      const stage3Count = 
        (stage3.stage3_technical?.testQuestions?.length || 0) +
        (stage3.stage3_technical?.liveCoding ? 1 : 0) +
        (stage3.stage3_technical?.bugFix ? 1 : 0) +
        (stage3.stage3_technical?.realWorldScenarios?.length || 0);
      console.log(`[CV_INTERVIEW_BG] Aşama 3 soruları oluşturuldu: ${stage3Count} soru`);
    } catch (stageError: any) {
      const errorMessage = stageError?.message || "Bilinmeyen hata";
      const isTimeoutError = 
        errorMessage.includes("zaman aşımı") ||
        errorMessage.includes("aborted") ||
        errorMessage.includes("Request was aborted") ||
        stageError?.isTimeout === true;
      
      // Check if it's a validation error
      const isValidationError = 
        errorMessage.includes("JSON şeması") ||
        errorMessage.includes("beklenen JSON") ||
        stageError?.name === "AIResponseValidationError";
      
      // Log detailed error information
      console.error(`[CV_INTERVIEW_BG] Aşama 3 hatası:`, {
        message: errorMessage,
        name: stageError?.name,
        isTimeout: isTimeoutError,
        isValidationError: isValidationError,
        zodErrors: stageError?.zodErrors ? JSON.stringify(stageError.zodErrors, null, 2) : undefined,
        payloadPreview: stageError?.payload 
          ? (typeof stageError.payload === 'string' 
              ? stageError.payload.substring(0, 1000) 
              : JSON.stringify(stageError.payload).substring(0, 1000))
          : undefined,
        stack: stageError?.stack,
      });
      
      if (isTimeoutError) {
        throw new Error(
          `Aşama 3 (Teknik) soruları oluşturulurken zaman aşımı oluştu. Lütfen tekrar deneyin.`
        );
      }
      
      if (isValidationError) {
        // Provide more user-friendly error message for validation errors
        const validationDetails = stageError?.zodErrors 
          ? `\n\nDetaylar: ${JSON.stringify(stageError.zodErrors, null, 2)}`
          : "";
        throw new Error(
          `Aşama 3 (Teknik) hatası: AI yanıtı beklenen JSON şemasına uymuyor.${validationDetails}`
        );
      }
      
      throw new Error(`Aşama 3 (Teknik) hatası: ${errorMessage}`);
    }
    
    // Tüm soruları birleştir ve formatla
    const allQuestions = {
      stage1_introduction: stage1.stage1_introduction,
      stage2_experience: stage2.stage2_experience,
      stage3_technical: stage3.stage3_technical,
    };
    
    let formattedQuestions;
    try {
      formattedQuestions = formatQuestionsForInterview(allQuestions);
      console.log(`[CV_INTERVIEW_BG] Toplam ${formattedQuestions.length} soru formatlandı`);
    } catch (formatError: any) {
      console.error(`[CV_INTERVIEW_BG] Soru formatlama hatası:`, formatError);
      throw new Error(`Soru formatlama hatası: ${formatError?.message || "Bilinmeyen hata"}`);
    }
    
    // CV bilgilerini al (duration hesaplamak için)
    const cv = await db.cV.findUnique({
      where: { id: cvId },
    });
    const cvData = cv?.data as any;
    const cvInfo = extractCVInfo(cvData || {});
    
    // Interview kaydını finalize et
    try {
      await db.interview.update({
        where: { id: interviewId },
        data: {
          questions: formattedQuestions as any,
          duration: Math.ceil(formattedQuestions.length * 3), // Her soru için yaklaşık 3 dakika
          description: `CV'nize göre oluşturulmuş kapsamlı mülakat. ${formattedQuestions.length} soru içermektedir.`,
        },
      });
      const duration = Date.now() - startTime;
      console.log(`[CV_INTERVIEW_BG] Tüm aşamalar tamamlandı: ${interviewId} (${Math.round(duration / 1000)}s)`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] Final güncelleme hatası:`, updateError);
      throw new Error(`Final güncelleme hatası: ${updateError?.message || "Bilinmeyen hata"}`);
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorMessage = error?.message || "Bilinmeyen hata";
    const errorDetails = error?.stack || error?.toString() || "Detay yok";
    
    console.error(`[CV_INTERVIEW_BG] Hata (interviewId: ${interviewId}, stage: ${currentStage}, ${Math.round(duration / 1000)}s):`, {
      message: errorMessage,
      details: errorDetails,
      stage: currentStage,
    });
    
    // Hata durumunda interview kaydını güncelle (hata mesajı ekle)
    try {
      const errorDescription = `Mülakat oluşturulurken hata oluştu (Aşama ${currentStage}): ${errorMessage}`;
      await db.interview.update({
        where: { id: interviewId },
        data: {
          description: errorDescription,
        },
      });
      console.log(`[CV_INTERVIEW_BG] Hata durumu veritabanına kaydedildi: ${interviewId}`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] Interview güncelleme hatası (hata kaydı):`, updateError);
      // Bu durumda en azından console'a yazdık
    }
    
    // Hata'yı tekrar fırlat ki üst seviyede de yakalanabilsin
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interviewId, cvId } = body;

    if (!interviewId || typeof interviewId !== "string") {
      return NextResponse.json(
        { error: "Interview ID gereklidir" },
        { status: 400 }
      );
    }

    if (!cvId || typeof cvId !== "string") {
      return NextResponse.json(
        { error: "CV ID gereklidir" },
        { status: 400 }
      );
    }

    // Interview'ın var olduğunu ve kullanıcıya ait olduğunu kontrol et
    const interview = await db.interview.findUnique({
      where: { id: interviewId },
      include: {
        cv: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview bulunamadı" },
        { status: 404 }
      );
    }

    // Interview'ın CV'si üzerinden kullanıcı kontrolü
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
    } else {
      return NextResponse.json(
        { error: "Interview CV ile ilişkili değil" },
        { status: 400 }
      );
    }

    // CV ID'lerin eşleştiğini kontrol et
    if (interview.cvId !== cvId) {
      return NextResponse.json(
        { error: "CV ID eşleşmiyor" },
        { status: 400 }
      );
    }

    console.log(`[CV_INTERVIEW_STAGES] Aşamalı mülakat oluşturma başlatılıyor: interviewId=${interviewId}, cvId=${cvId}`);

    // Arka planda aşamalı olarak soruları oluştur
    await generateInterviewStages(interviewId, cvId);

    return NextResponse.json({
      success: true,
      message: "Mülakat soruları başarıyla oluşturuldu",
      interviewId,
    });
  } catch (error: any) {
    console.error("[CV_INTERVIEW_STAGES] Genel hata:", error);
    return NextResponse.json(
      { 
        success: false,
        error: `Mülakat soruları oluşturulurken bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` 
      },
      { status: 500 }
    );
  }
}

