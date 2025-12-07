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
    console.log(`[CV_INTERVIEW_BG] ========== AŞAMALI MÜLAKAT OLUŞTURMA BAŞLADI ==========`);
    console.log(`[CV_INTERVIEW_BG] Timestamp: ${new Date().toISOString()}`);
    console.log(`[CV_INTERVIEW_BG] interviewId: ${interviewId}, cvId: ${cvId}`);
    
    console.log(`[CV_INTERVIEW_BG] [INIT] Interview kaydı kontrol ediliyor...`);
    // Interview'ın var olduğunu kontrol et
    const initialInterview = await db.interview.findUnique({
      where: { id: interviewId },
    });
    
    if (!initialInterview) {
      console.error(`[CV_INTERVIEW_BG] [INIT] ❌ Interview bulunamadı: ${interviewId}`);
      throw new Error(`Interview bulunamadı: ${interviewId}`);
    }
    
    const initTime = Date.now() - startTime;
    console.log(`[CV_INTERVIEW_BG] [INIT] ✅ Interview kaydı doğrulandı - süre: ${initTime}ms`);
    console.log(`[CV_INTERVIEW_BG] [INIT] Interview bilgileri:`, {
      title: initialInterview.title,
      type: initialInterview.type,
      difficulty: initialInterview.difficulty,
    });

    // Aşama 1: Genel Tanışma
    currentStage = 1;
    const stage1StartTime = Date.now();
    console.log(`[CV_INTERVIEW_BG] ========== AŞAMA 1: GENEL TANIŞMA ==========`);
    console.log(`[CV_INTERVIEW_BG] [STAGE_1] Başlatılıyor... (interviewId: ${interviewId})`);
    
    let stage1;
    try {
      console.log(`[CV_INTERVIEW_BG] [STAGE_1] generateStage1Questions çağrılıyor... (cvId: ${cvId})`);
      stage1 = await generateStage1Questions(cvId);
      const stage1Time = Date.now() - stage1StartTime;
      const questionCount = stage1.stage1_introduction?.length || 0;
      console.log(`[CV_INTERVIEW_BG] [STAGE_1] ✅ Sorular oluşturuldu - ${questionCount} soru, süre: ${Math.round(stage1Time / 1000)}s`);
    } catch (stageError: any) {
      const stage1Time = Date.now() - stage1StartTime;
      console.error(`[CV_INTERVIEW_BG] [STAGE_1] ❌ Hata oluştu - süre: ${Math.round(stage1Time / 1000)}s`);
      console.error(`[CV_INTERVIEW_BG] [STAGE_1] Hata detayları:`, {
        message: stageError?.message,
        name: stageError?.name,
        stack: stageError?.stack,
      });
      const errorMessage = stageError?.message || "Bilinmeyen hata";
      const isTimeoutError = 
        errorMessage.includes("zaman aşımı") ||
        errorMessage.includes("aborted") ||
        errorMessage.includes("Request was aborted") ||
        stageError?.isTimeout === true;
      
      if (isTimeoutError) {
        console.error(`[CV_INTERVIEW_BG] [STAGE_1] ❌ Zaman aşımı hatası`);
        throw new Error(
          `Aşama 1 (Genel Tanışma) soruları oluşturulurken zaman aşımı oluştu. Lütfen tekrar deneyin.`
        );
      }
      throw new Error(`Aşama 1 (Genel Tanışma) hatası: ${errorMessage}`);
    }
    
    // Interview kaydını güncelle - Aşama 1
    try {
      const dbUpdateStartTime = Date.now();
      console.log(`[CV_INTERVIEW_BG] [STAGE_1] Veritabanı güncellemesi yapılıyor...`);
      await db.interview.update({
        where: { id: interviewId },
        data: {
          questions: {
            stage1_introduction: stage1.stage1_introduction,
          } as any,
        },
      });
      const dbUpdateTime = Date.now() - dbUpdateStartTime;
      console.log(`[CV_INTERVIEW_BG] [STAGE_1] ✅ Veritabanına kaydedildi - süre: ${dbUpdateTime}ms`);
      const totalStage1Time = Date.now() - stage1StartTime;
      console.log(`[CV_INTERVIEW_BG] [STAGE_1] ========== TAMAMLANDI (Toplam: ${Math.round(totalStage1Time / 1000)}s) ==========`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] [STAGE_1] ❌ Veritabanı güncelleme hatası:`, updateError);
      throw new Error(`Aşama 1 veritabanı güncelleme hatası: ${updateError?.message || "Bilinmeyen hata"}`);
    }

    // Aşama 2: Deneyim
    currentStage = 2;
    const stage2StartTime = Date.now();
    console.log(`[CV_INTERVIEW_BG] ========== AŞAMA 2: DENEYİM ==========`);
    console.log(`[CV_INTERVIEW_BG] [STAGE_2] Başlatılıyor... (interviewId: ${interviewId})`);
    
    let stage2;
    try {
      console.log(`[CV_INTERVIEW_BG] [STAGE_2] generateStage2Questions çağrılıyor... (cvId: ${cvId})`);
      stage2 = await generateStage2Questions(cvId);
      const stage2Time = Date.now() - stage2StartTime;
      const questionCount = stage2.stage2_experience?.length || 0;
      console.log(`[CV_INTERVIEW_BG] [STAGE_2] ✅ Sorular oluşturuldu - ${questionCount} soru, süre: ${Math.round(stage2Time / 1000)}s`);
    } catch (stageError: any) {
      const stage2Time = Date.now() - stage2StartTime;
      console.error(`[CV_INTERVIEW_BG] [STAGE_2] ❌ Hata oluştu - süre: ${Math.round(stage2Time / 1000)}s`);
      console.error(`[CV_INTERVIEW_BG] [STAGE_2] Hata detayları:`, {
        message: stageError?.message,
        name: stageError?.name,
        stack: stageError?.stack,
      });
      const errorMessage = stageError?.message || "Bilinmeyen hata";
      const isTimeoutError = 
        errorMessage.includes("zaman aşımı") ||
        errorMessage.includes("aborted") ||
        errorMessage.includes("Request was aborted") ||
        stageError?.isTimeout === true;
      
      if (isTimeoutError) {
        console.error(`[CV_INTERVIEW_BG] [STAGE_2] ❌ Zaman aşımı hatası`);
        throw new Error(
          `Aşama 2 (Deneyim) soruları oluşturulurken zaman aşımı oluştu. Lütfen tekrar deneyin.`
        );
      }
      throw new Error(`Aşama 2 (Deneyim) hatası: ${errorMessage}`);
    }
    
    // Interview kaydını güncelle - Aşama 2
    try {
      const dbUpdateStartTime = Date.now();
      console.log(`[CV_INTERVIEW_BG] [STAGE_2] Mevcut sorular alınıyor...`);
      const currentInterview = await db.interview.findUnique({
        where: { id: interviewId },
      });
      const currentQuestions = (currentInterview?.questions as any) || {};
      
      console.log(`[CV_INTERVIEW_BG] [STAGE_2] Veritabanı güncellemesi yapılıyor...`);
      await db.interview.update({
        where: { id: interviewId },
        data: {
          questions: {
            ...currentQuestions,
            stage2_experience: stage2.stage2_experience,
          } as any,
        },
      });
      const dbUpdateTime = Date.now() - dbUpdateStartTime;
      console.log(`[CV_INTERVIEW_BG] [STAGE_2] ✅ Veritabanına kaydedildi - süre: ${dbUpdateTime}ms`);
      const totalStage2Time = Date.now() - stage2StartTime;
      console.log(`[CV_INTERVIEW_BG] [STAGE_2] ========== TAMAMLANDI (Toplam: ${Math.round(totalStage2Time / 1000)}s) ==========`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] [STAGE_2] ❌ Veritabanı güncelleme hatası:`, updateError);
      throw new Error(`Aşama 2 veritabanı güncelleme hatası: ${updateError?.message || "Bilinmeyen hata"}`);
    }

    // Aşama 3: Teknik
    currentStage = 3;
    const stage3StartTime = Date.now();
    console.log(`[CV_INTERVIEW_BG] ========== AŞAMA 3: TEKNİK ==========`);
    console.log(`[CV_INTERVIEW_BG] [STAGE_3] Başlatılıyor... (interviewId: ${interviewId})`);
    
    let stage3;
    try {
      console.log(`[CV_INTERVIEW_BG] [STAGE_3] generateStage3Questions çağrılıyor... (cvId: ${cvId})`);
      stage3 = await generateStage3Questions(cvId);
      const stage3Time = Date.now() - stage3StartTime;
      const stage3Count = 
        (stage3.stage3_technical?.testQuestions?.length || 0) +
        (stage3.stage3_technical?.liveCoding ? 1 : 0) +
        (stage3.stage3_technical?.bugFix ? 1 : 0) +
        (stage3.stage3_technical?.realWorldScenarios?.length || 0);
      console.log(`[CV_INTERVIEW_BG] [STAGE_3] ✅ Sorular oluşturuldu - ${stage3Count} soru, süre: ${Math.round(stage3Time / 1000)}s`);
      console.log(`[CV_INTERVIEW_BG] [STAGE_3] Soru detayları:`, {
        testQuestions: stage3.stage3_technical?.testQuestions?.length || 0,
        liveCoding: stage3.stage3_technical?.liveCoding ? 1 : 0,
        bugFix: stage3.stage3_technical?.bugFix ? 1 : 0,
        realWorldScenarios: stage3.stage3_technical?.realWorldScenarios?.length || 0,
      });
    } catch (stageError: any) {
      const stage3Time = Date.now() - stage3StartTime;
      console.error(`[CV_INTERVIEW_BG] [STAGE_3] ❌ Hata oluştu - süre: ${Math.round(stage3Time / 1000)}s`);
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
      console.error(`[CV_INTERVIEW_BG] [STAGE_3] Hata detayları:`, {
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
        console.error(`[CV_INTERVIEW_BG] [STAGE_3] ❌ Zaman aşımı hatası`);
        throw new Error(
          `Aşama 3 (Teknik) soruları oluşturulurken zaman aşımı oluştu. Lütfen tekrar deneyin.`
        );
      }
      
      if (isValidationError) {
        console.error(`[CV_INTERVIEW_BG] [STAGE_3] ❌ Validation hatası`);
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
    const formatStartTime = Date.now();
    console.log(`[CV_INTERVIEW_BG] ========== SORU FORMATLAMA ==========`);
    console.log(`[CV_INTERVIEW_BG] [FORMAT] Sorular birleştiriliyor...`);
    const allQuestions = {
      stage1_introduction: stage1.stage1_introduction,
      stage2_experience: stage2.stage2_experience,
      stage3_technical: stage3.stage3_technical,
    };
    
    let formattedQuestions;
    try {
      console.log(`[CV_INTERVIEW_BG] [FORMAT] formatQuestionsForInterview çağrılıyor...`);
      formattedQuestions = formatQuestionsForInterview(allQuestions);
      const formatTime = Date.now() - formatStartTime;
      console.log(`[CV_INTERVIEW_BG] [FORMAT] ✅ ${formattedQuestions.length} soru formatlandı - süre: ${formatTime}ms`);
    } catch (formatError: any) {
      const formatTime = Date.now() - formatStartTime;
      console.error(`[CV_INTERVIEW_BG] [FORMAT] ❌ Soru formatlama hatası - süre: ${formatTime}ms`);
      console.error(`[CV_INTERVIEW_BG] [FORMAT] Hata detayları:`, formatError);
      throw new Error(`Soru formatlama hatası: ${formatError?.message || "Bilinmeyen hata"}`);
    }
    
    // CV bilgilerini al (duration hesaplamak için)
    const finalizeStartTime = Date.now();
    console.log(`[CV_INTERVIEW_BG] ========== FİNALİZASYON ==========`);
    console.log(`[CV_INTERVIEW_BG] [FINALIZE] CV bilgileri alınıyor...`);
    const cv = await db.cV.findUnique({
      where: { id: cvId },
    });
    const cvData = cv?.data as any;
    const cvInfo = extractCVInfo(cvData || {});
    console.log(`[CV_INTERVIEW_BG] [FINALIZE] CV bilgileri alındı - difficulty: ${cvInfo.level}`);
    
    // Interview kaydını finalize et
    try {
      console.log(`[CV_INTERVIEW_BG] [FINALIZE] Interview kaydı güncelleniyor...`);
      const calculatedDuration = Math.ceil(formattedQuestions.length * 3);
      await db.interview.update({
        where: { id: interviewId },
        data: {
          questions: formattedQuestions as any,
          duration: calculatedDuration, // Her soru için yaklaşık 3 dakika
          description: `CV'nize göre oluşturulmuş kapsamlı mülakat. ${formattedQuestions.length} soru içermektedir.`,
        },
      });
      const finalizeTime = Date.now() - finalizeStartTime;
      const totalDuration = Date.now() - startTime;
      console.log(`[CV_INTERVIEW_BG] [FINALIZE] ✅ Interview kaydı güncellendi - süre: ${finalizeTime}ms`);
      console.log(`[CV_INTERVIEW_BG] [FINALIZE] Final bilgiler:`, {
        totalQuestions: formattedQuestions.length,
        calculatedDuration: calculatedDuration,
        totalTime: Math.round(totalDuration / 1000),
      });
      console.log(`[CV_INTERVIEW_BG] ========== TÜM AŞAMALAR TAMAMLANDI ==========`);
      console.log(`[CV_INTERVIEW_BG] Toplam süre: ${Math.round(totalDuration / 1000)}s (${Math.round(totalDuration / 60000)} dakika)`);
    } catch (updateError: any) {
      const finalizeTime = Date.now() - finalizeStartTime;
      console.error(`[CV_INTERVIEW_BG] [FINALIZE] ❌ Final güncelleme hatası - süre: ${finalizeTime}ms`);
      console.error(`[CV_INTERVIEW_BG] [FINALIZE] Hata detayları:`, updateError);
      throw new Error(`Final güncelleme hatası: ${updateError?.message || "Bilinmeyen hata"}`);
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorMessage = error?.message || "Bilinmeyen hata";
    const errorDetails = error?.stack || error?.toString() || "Detay yok";
    
    console.error(`[CV_INTERVIEW_BG] ========== HATA OLUŞTU ==========`);
    console.error(`[CV_INTERVIEW_BG] Timestamp: ${new Date().toISOString()}`);
    console.error(`[CV_INTERVIEW_BG] interviewId: ${interviewId}`);
    console.error(`[CV_INTERVIEW_BG] Hata aşaması: ${currentStage}`);
    console.error(`[CV_INTERVIEW_BG] Toplam süre: ${Math.round(duration / 1000)}s`);
    console.error(`[CV_INTERVIEW_BG] Hata detayları:`, {
      message: errorMessage,
      name: error?.name,
      details: errorDetails,
      stage: currentStage,
    });
    
    // Hata durumunda interview kaydını güncelle (hata mesajı ekle)
    try {
      console.log(`[CV_INTERVIEW_BG] [ERROR] Hata mesajı veritabanına kaydediliyor...`);
      const errorDescription = `Mülakat oluşturulurken hata oluştu (Aşama ${currentStage}): ${errorMessage}`;
      await db.interview.update({
        where: { id: interviewId },
        data: {
          description: errorDescription,
        },
      });
      console.log(`[CV_INTERVIEW_BG] [ERROR] ✅ Hata durumu veritabanına kaydedildi: ${interviewId}`);
    } catch (updateError: any) {
      console.error(`[CV_INTERVIEW_BG] [ERROR] ❌ Interview güncelleme hatası (hata kaydı):`, updateError);
      // Bu durumda en azından console'a yazdık
    }
    
    console.error(`[CV_INTERVIEW_BG] ========== HATA İŞLEME TAMAMLANDI ==========`);
    // Hata'yı tekrar fırlat ki üst seviyede de yakalanabilsin
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interviewId, cvId, userId: providedUserId } = body;

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

    // Interview'ı bir kez sorgula
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

    // Internal call kontrolü: Eğer userId body'de sağlanmışsa ve interview'ın CV'si bu userId'ye aitse, session kontrolünü bypass et
    let userId: string | null = null;
    
    if (providedUserId && typeof providedUserId === "string" && interview.cvId) {
      const cv = await db.cV.findUnique({
        where: { id: interview.cvId },
      });
      
      // CV'nin userId'si sağlanan userId ile eşleşiyorsa internal call olarak kabul et
      if (cv && cv.userId === providedUserId) {
        userId = providedUserId;
        console.log(`[CV_INTERVIEW_STAGES] Internal call detected for interviewId: ${interviewId}, userId: ${userId}`);
      }
    }
    
    // Eğer internal call değilse, normal session kontrolü yap
    if (!userId) {
      const session = await auth();
      userId = await getUserIdFromSession(session);
      
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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

