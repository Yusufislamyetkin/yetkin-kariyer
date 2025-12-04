import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateInterviewForCV } from "@/lib/background/cv-interview-generator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Kullanıcının tüm CV'lerini al
    const cvs = await db.cV.findMany({
      where: { userId },
      select: { id: true },
    });

    if (cvs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "CV bulunamadı",
        generated: 0,
      });
    }

    // Her CV için mülakat var mı kontrol et
    const cvIds = cvs.map((cv: typeof cvs[0]) => cv.id);
    const existingInterviews = await db.interview.findMany({
      where: {
        cvId: { in: cvIds },
        type: "cv_based",
      },
      select: { cvId: true },
    });

    const existingCvIds = new Set(
      existingInterviews.map((interview: typeof existingInterviews[0]) => interview.cvId).filter(Boolean)
    );
    const missingCvIds = cvIds.filter((id: string) => !existingCvIds.has(id));

    if (missingCvIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tüm CV'ler için mülakat mevcut",
        generated: 0,
      });
    }

    // Eksik mülakatları arka planda oluştur (fire-and-forget)
    let generatedCount = 0;
    if (process.env.OPENAI_API_KEY) {
      for (const cvId of missingCvIds) {
        // Fire and forget - don't await
        generateInterviewForCV(cvId, userId)
          .then((result) => {
            if (result.success) {
              generatedCount++;
              console.log(`[CV_INTERVIEW_CHECK] Background interview generation completed for CV: ${cvId}`);
            } else {
              console.error(`[CV_INTERVIEW_CHECK] Failed to generate interview for CV ${cvId}:`, result.error);
            }
          })
          .catch((error) => {
            // Silently fail - interview can be generated later
            console.error(`[CV_INTERVIEW_CHECK] Failed to trigger interview for CV ${cvId}:`, error);
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${missingCvIds.length} CV için mülakat oluşturma işlemi başlatıldı`,
      total: cvIds.length,
      existing: existingCvIds.size,
      missing: missingCvIds.length,
      generated: generatedCount,
    });
  } catch (error: any) {
    console.error("[CV_INTERVIEW_CHECK] Hata:", error);
    return NextResponse.json(
      { error: `Mülakat kontrolü sırasında bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

