import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractCVInfo } from "@/lib/ai/interview-generator";
import { getUserIdFromSession } from "@/lib/auth-utils";

export const maxDuration = 60; // 60 seconds timeout for Vercel

/**
 * Base URL'i environment variable'lardan al
 */
function getBaseUrl(): string {
  let baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  // URL'de scheme yoksa ekle
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    // Production'da (Vercel) https:// kullan, localhost'ta http://
    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      baseUrl = `http://${baseUrl}`;
    } else {
      baseUrl = `https://${baseUrl}`;
    }
  }

  // URL'in sonundaki slash'ı kaldır
  baseUrl = baseUrl.replace(/\/$/, "");

  return baseUrl;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
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

    if (cv.userId !== userId) {
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
    // Yeni endpoint'i fetch ile tetikle - bu sayede bağımsız bir request olarak çalışacak
    const baseUrl = getBaseUrl();
    const generateStagesUrl = `${baseUrl}/api/interview/cv-based/generate-stages`;
    
    fetch(generateStagesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Session cookie'yi gönder (eğer varsa)
        ...(request.headers.get("cookie") && { Cookie: request.headers.get("cookie") || "" }),
      },
      body: JSON.stringify({
        interviewId: interview.id,
        cvId: cvId,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          console.log(`[CV_INTERVIEW] Arka plan işlemi başlatıldı: ${interview.id}`);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`[CV_INTERVIEW] Arka plan işlemi başlatılamadı (interviewId: ${interview.id}):`, {
            status: response.status,
            error: errorData.error || "Bilinmeyen hata",
          });
        }
      })
      .catch((error) => {
        console.error(`[CV_INTERVIEW] Arka plan endpoint çağrısı hatası (interviewId: ${interview.id}):`, {
          message: error?.message || "Bilinmeyen hata",
          stack: error?.stack,
          cvId: cvId,
          url: generateStagesUrl,
        });
        // Hata durumunda interview description'ına hata mesajı ekle
        db.interview.update({
          where: { id: interview.id },
          data: {
            description: `Mülakat soruları oluşturulurken hata oluştu: Arka plan endpoint'i çağrılamadı. Lütfen tekrar deneyin.`,
          },
        }).catch((updateError: unknown) => {
          console.error(`[CV_INTERVIEW] Hata mesajı kaydedilemedi:`, updateError);
        });
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

