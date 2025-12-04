import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateInterviewFromCV, formatQuestionsForInterview, extractCVInfo } from "@/lib/ai/interview-generator";

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

    // CV'den mülakat soruları oluştur
    console.log(`[CV_INTERVIEW] CV'den mülakat oluşturuluyor: ${cvId}`);
    
    let questions;
    try {
      const interviewQuestions = await generateInterviewFromCV(cvId);
      questions = formatQuestionsForInterview(interviewQuestions);
    } catch (error: any) {
      console.error("[CV_INTERVIEW] Soru oluşturma hatası:", error);
      return NextResponse.json(
        { error: `Mülakat soruları oluşturulurken hata: ${error?.message || "Bilinmeyen hata"}` },
        { status: 500 }
      );
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
      },
    });

    console.log(`[CV_INTERVIEW] Mülakat oluşturuldu: ${interview.id}`);

    return NextResponse.json(
      {
        interview: {
          id: interview.id,
          title: interview.title,
          description: interview.description,
          duration: interview.duration,
          questionCount: questions.length,
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

