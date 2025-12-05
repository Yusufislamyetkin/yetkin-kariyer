import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateStage1Questions, generateStage2Questions, generateStage3Questions, formatQuestionsForInterview, extractCVInfo } from "@/lib/ai/interview-generator";

export const maxDuration = 60; // 60 seconds timeout for Vercel

/**
 * Arka planda aşamalı olarak mülakat sorularını oluşturur
 */
async function generateInterviewStages(interviewId: string, cvId: string) {
  try {
    console.log(`[CV_INTERVIEW_BG] Aşamalı mülakat oluşturma başladı: ${interviewId}`);

    // Aşama 1: Genel Tanışma
    console.log(`[CV_INTERVIEW_BG] Aşama 1 başlatılıyor...`);
    const stage1 = await generateStage1Questions(cvId);
    
    // Interview kaydını güncelle - Aşama 1
    await db.interview.update({
      where: { id: interviewId },
      data: {
        questions: {
          stage1_introduction: stage1.stage1_introduction,
        } as any,
      },
    });
    console.log(`[CV_INTERVIEW_BG] Aşama 1 tamamlandı`);

    // Aşama 2: Deneyim
    console.log(`[CV_INTERVIEW_BG] Aşama 2 başlatılıyor...`);
    const stage2 = await generateStage2Questions(cvId);
    
    // Interview kaydını güncelle - Aşama 2
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
    console.log(`[CV_INTERVIEW_BG] Aşama 2 tamamlandı`);

    // Aşama 3: Teknik
    console.log(`[CV_INTERVIEW_BG] Aşama 3 başlatılıyor...`);
    const stage3 = await generateStage3Questions(cvId);
    
    // Tüm soruları birleştir ve formatla
    const allQuestions = {
      stage1_introduction: stage1.stage1_introduction,
      stage2_experience: stage2.stage2_experience,
      stage3_technical: stage3.stage3_technical,
    };
    
    const formattedQuestions = formatQuestionsForInterview(allQuestions);
    
    // CV bilgilerini al (duration hesaplamak için)
    const cv = await db.cV.findUnique({
      where: { id: cvId },
    });
    const cvData = cv?.data as any;
    const cvInfo = extractCVInfo(cvData || {});
    
    // Interview kaydını finalize et
    await db.interview.update({
      where: { id: interviewId },
      data: {
        questions: formattedQuestions as any,
        duration: Math.ceil(formattedQuestions.length * 3), // Her soru için yaklaşık 3 dakika
        description: `CV'nize göre oluşturulmuş kapsamlı mülakat. ${formattedQuestions.length} soru içermektedir.`,
      },
    });
    
    console.log(`[CV_INTERVIEW_BG] Tüm aşamalar tamamlandı: ${interviewId}`);
  } catch (error: any) {
    console.error(`[CV_INTERVIEW_BG] Hata (interviewId: ${interviewId}):`, error);
    // Hata durumunda interview kaydını güncelle (hata mesajı ekle)
    try {
      await db.interview.update({
        where: { id: interviewId },
        data: {
          description: `Mülakat oluşturulurken hata oluştu: ${error?.message || "Bilinmeyen hata"}`,
        },
      });
    } catch (updateError) {
      console.error(`[CV_INTERVIEW_BG] Interview güncelleme hatası:`, updateError);
    }
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
    generateInterviewStages(interview.id, cvId).catch((error) => {
      console.error(`[CV_INTERVIEW] Arka plan işlemi hatası:`, error);
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

