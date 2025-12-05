import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateStage1Questions, generateStage2Questions, generateStage3Questions, formatQuestionsForInterview, extractCVInfo } from "@/lib/ai/interview-generator";

export const maxDuration = 60; // 60 seconds timeout for Vercel

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
      throw new Error(`Aşama 1 (Genel Tanışma) hatası: ${stageError?.message || "Bilinmeyen hata"}`);
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
      throw new Error(`Aşama 2 (Deneyim) hatası: ${stageError?.message || "Bilinmeyen hata"}`);
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
      console.error(`[CV_INTERVIEW_BG] Aşama 3 hatası:`, stageError);
      throw new Error(`Aşama 3 (Teknik) hatası: ${stageError?.message || "Bilinmeyen hata"}`);
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cvId } = body;

    if (!cvId || typeof cvId !== "string") {
      return NextResponse.json(
        { error: "CV ID gereklidir" },
        { status: 400 }
      );
    }

    // CV'nin kullanıcıya ait olduğunu kontrol et
    const cv = await db.cV.findUnique({
      where: { id: cvId },
    });

    if (!cv) {
      return NextResponse.json(
        { error: "CV bulunamadı" },
        { status: 404 }
      );
    }

    if (cv.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu CV'ye erişim yetkiniz yok" },
        { status: 403 }
      );
    }

    // CV bilgilerini çıkar
    const cvData = cv.data as any;
    const cvInfo = extractCVInfo(cvData);

    // Interview kaydını hemen oluştur (boş sorularla)
    const interview = await db.interview.create({
      data: {
        title: `CV Bazlı Mülakat - ${cvData?.personalInfo?.name || "Kullanıcı"}`,
        description: "Mülakat soruları oluşturuluyor...",
        questions: [] as any, // Başlangıçta boş
        type: "cv_based",
        difficulty: cvInfo.level,
        duration: 0, // Henüz hesaplanmadı
        cvId: cvId,
      },
    });

    console.log(`[CV_INTERVIEW] Interview kaydı oluşturuldu: ${interview.id}, arka planda sorular oluşturuluyor...`);

    // Arka planda aşamalı olarak soruları oluştur (fire-and-forget)
    // Not: Vercel serverless ortamında bu fonksiyon yanıt döndükten sonra çalışmaya devam edebilir
    // Ancak timeout süresi içinde tamamlanması gerekir
    generateInterviewStages(interview.id, cvId)
      .then(() => {
        console.log(`[CV_INTERVIEW] Arka plan işlemi başarıyla tamamlandı: ${interview.id}`);
      })
      .catch((error) => {
        console.error(`[CV_INTERVIEW] Arka plan işlemi hatası (interviewId: ${interview.id}):`, {
          message: error?.message || "Bilinmeyen hata",
          stack: error?.stack,
          cvId: cvId,
        });
        // Hata zaten generateInterviewStages içinde database'e kaydedildi
        // Burada sadece log tutuyoruz
      });

    // Hemen response döndür
    return NextResponse.json(
      {
        interview: {
          id: interview.id,
          title: interview.title,
          description: interview.description,
          duration: interview.duration,
          questionCount: 0,
          status: "generating",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CV_INTERVIEW] Genel hata:", error);
    return NextResponse.json(
      { error: `Mülakat oluşturulurken bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

