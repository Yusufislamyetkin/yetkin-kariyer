import { db } from "@/lib/db";
import { generateInterviewFromCV, formatQuestionsForInterview, extractCVInfo } from "@/lib/ai/interview-generator";

/**
 * CV için mülakat oluşturma helper fonksiyonu
 * Bu fonksiyon doğrudan çağrılabilir (server-side)
 */
export async function generateInterviewForCV(cvId: string, userId: string): Promise<{
  success: boolean;
  interviewId?: string;
  alreadyExists?: boolean;
  error?: string;
}> {
  try {
    // CV'nin kullanıcıya ait olduğunu kontrol et
    const cv = await db.cV.findUnique({
      where: { id: cvId },
    });

    if (!cv) {
      return {
        success: false,
        error: "CV bulunamadı",
      };
    }

    if (cv.userId !== userId) {
      return {
        success: false,
        error: "Bu CV'ye erişim yetkiniz yok",
      };
    }

    // Bu CV için zaten mülakat var mı kontrol et
    const existingInterview = await db.interview.findFirst({
      where: {
        cvId: cvId,
        type: "cv_based",
      },
    });

    if (existingInterview) {
      return {
        success: true,
        interviewId: existingInterview.id,
        alreadyExists: true,
      };
    }

    // CV bilgilerini çıkar
    const cvData = cv.data as any;
    const cvInfo = extractCVInfo(cvData);

    // CV'den mülakat soruları oluştur
    console.log(`[CV_INTERVIEW_BG] CV'den mülakat oluşturuluyor: ${cvId}`);
    
    let questions;
    try {
      const interviewQuestions = await generateInterviewFromCV(cvId);
      questions = formatQuestionsForInterview(interviewQuestions);
    } catch (error: any) {
      console.error("[CV_INTERVIEW_BG] Soru oluşturma hatası:", error);
      return {
        success: false,
        error: `Mülakat soruları oluşturulurken hata: ${error?.message || "Bilinmeyen hata"}`,
      };
    }

    // Interview kaydı oluştur
    const interview = await db.interview.create({
      data: {
        title: `CV Bazlı Mülakat - ${cvData?.personalInfo?.name || "Kullanıcı"}`,
        description: `CV'nize göre oluşturulmuş kapsamlı mülakat. ${questions.length} soru içermektedir.`,
        questions: questions as any,
        type: "cv_based",
        difficulty: cvInfo.level, // CV'den çıkarılan seviye
        duration: Math.ceil(questions.length * 3), // Her soru için yaklaşık 3 dakika
        cvId: cvId, // CV ile ilişkilendir
      },
    });

    console.log(`[CV_INTERVIEW_BG] Mülakat oluşturuldu: ${interview.id} (CV: ${cvId})`);

    return {
      success: true,
      interviewId: interview.id,
      alreadyExists: false,
    };
  } catch (error: any) {
    console.error("[CV_INTERVIEW_BG] Genel hata:", error);
    return {
      success: false,
      error: `Mülakat oluşturulurken bir hata oluştu: ${error?.message || "Bilinmeyen hata"}`,
    };
  }
}

