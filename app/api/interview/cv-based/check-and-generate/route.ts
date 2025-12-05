import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { queueJob } from "@/lib/qstash";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout for Vercel

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

    // QStash ile her CV için job queue'ya ekle
    // ÖNEMLİ: await etmeden paralel gönder, hemen response döndür
    let queuedCount = 0;
    
    if (process.env.OPENAI_API_KEY && process.env.QSTASH_TOKEN) {
      // Tüm job'ları paralel olarak başlat (fire and forget)
      const queuePromises = missingCvIds.map((cvId: string, i: number) => {
        // Her job'u 5 saniye arayla başlat (rate limiting için)
        const delay = i * 5;
        
        return queueJob(
          "/api/interview/cv-based/generate-background",
          {
            cvId,
            userId,
          },
          {
            retries: 2, // 2 kez retry yap
            delay, // Her job'u sırayla başlat
          }
        )
          .then(() => {
            queuedCount++;
            console.log(`[CV_INTERVIEW_CHECK] Job queued for CV: ${cvId}`);
          })
          .catch((error: any) => {
            console.error(`[CV_INTERVIEW_CHECK] Failed to queue job for CV ${cvId}:`, error);
            // Hata olsa bile devam et
          });
      });
      
      // İlk 3 job'u hızlıca göndermeye çalış (max 3 saniye bekle)
      // Sonra response döndür, geri kalanı background'da devam etsin
      if (queuePromises.length > 0) {
        const immediateJobs = queuePromises.slice(0, 3);
        Promise.race([
          Promise.all(immediateJobs),
          new Promise(resolve => setTimeout(resolve, 3000)), // Max 3 saniye bekle
        ]).catch(() => {
          // Ignore errors, continue
        });
      }
    } else {
      console.warn("[CV_INTERVIEW_CHECK] QStash not configured, skipping queue");
    }

    // Hemen response döndür (timeout önleme)
    // Geri kalan job'lar background'da devam edecek
    return NextResponse.json({
      success: true,
      message: `${missingCvIds.length} CV için mülakat oluşturma işlemi kuyruğa eklendi`,
      total: cvIds.length,
      existing: existingCvIds.size,
      missing: missingCvIds.length,
      queued: queuedCount,
      note: "Job'lar arka planda işleniyor",
    });
  } catch (error: any) {
    console.error("[CV_INTERVIEW_CHECK] Hata:", error);
    return NextResponse.json(
      { error: `Mülakat kontrolü sırasında bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

