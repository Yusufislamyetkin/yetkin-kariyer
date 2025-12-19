import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractCVInfo } from "@/lib/ai/interview-generator";
import { getUserIdFromSession } from "@/lib/auth-utils";
import { getBaseUrl } from "@/lib/qstash";
import { checkUserSubscription } from "@/lib/services/subscription-service";

export const maxDuration = 60; // 60 seconds timeout for Vercel

export async function POST(request: Request) {
  const requestStartTime = Date.now();
  console.log(`[CV_INTERVIEW] ========== YENİ MÜLAKAT OLUŞTURMA İSTEĞİ BAŞLADI ==========`);
  console.log(`[CV_INTERVIEW] Timestamp: ${new Date().toISOString()}`);
  
  try {
    console.log(`[CV_INTERVIEW] [1/6] Session kontrolü yapılıyor...`);
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      console.error(`[CV_INTERVIEW] [1/6] ❌ Session kontrolü başarısız: Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(`[CV_INTERVIEW] [1/6] ✅ Session kontrolü başarılı - userId: ${userId}`);

    // Abonelik kontrolü
    const subscription = await checkUserSubscription(userId);
    if (!subscription || !subscription.isActive) {
      return NextResponse.json(
        {
          error: "Abone değilsiniz. Lütfen bir abonelik planı seçin.",
          redirectTo: "/fiyatlandirma",
          requiresSubscription: true,
        },
        { status: 403 }
      );
    }

    console.log(`[CV_INTERVIEW] [2/6] Request body parse ediliyor...`);
    const body = await request.json();
    const { cvId } = body;
    console.log(`[CV_INTERVIEW] [2/6] ✅ Request body parse edildi - cvId: ${cvId}`);

    if (!cvId || typeof cvId !== "string") {
      console.error(`[CV_INTERVIEW] [2/6] ❌ CV ID geçersiz veya eksik`);
      return NextResponse.json(
        { error: "CV ID gereklidir" },
        { status: 400 }
      );
    }

    console.log(`[CV_INTERVIEW] [3/6] CV veritabanından sorgulanıyor... (cvId: ${cvId})`);
    // CV'nin kullanıcıya ait olduğunu kontrol et
    const cv = await db.cV.findUnique({
      where: { id: cvId },
    });

    if (!cv) {
      console.error(`[CV_INTERVIEW] [3/6] ❌ CV bulunamadı - cvId: ${cvId}`);
      return NextResponse.json(
        { error: "CV bulunamadı" },
        { status: 404 }
      );
    }
    console.log(`[CV_INTERVIEW] [3/6] ✅ CV bulundu - cvId: ${cvId}, cv.userId: ${cv.userId}`);

    if (cv.userId !== userId) {
      console.error(`[CV_INTERVIEW] [3/6] ❌ CV erişim yetkisi yok - cv.userId: ${cv.userId}, request.userId: ${userId}`);
      return NextResponse.json(
        { error: "Bu CV'ye erişim yetkiniz yok" },
        { status: 403 }
      );
    }

    console.log(`[CV_INTERVIEW] [4/6] CV bilgileri çıkarılıyor...`);
    // CV bilgilerini çıkar
    const cvData = cv.data as any;
    const cvInfo = extractCVInfo(cvData);
    console.log(`[CV_INTERVIEW] [4/6] ✅ CV bilgileri çıkarıldı - difficulty: ${cvInfo.level}, name: ${cvData?.personalInfo?.name || "N/A"}`);

    // CV için mevcut interview kontrolü (Faz 1: Soru Cache)
    console.log(`[CV_INTERVIEW] [4.5/6] Mevcut interview kontrolü yapılıyor... (cvId: ${cvId})`);
    const existingInterview = await db.interview.findFirst({
      where: {
        cvId: cvId,
        type: "cv_based",
      },
      orderBy: { createdAt: "desc" }, // En yeni olanı al
    });

    // Soruların dolu olup olmadığını kontrol et
    const hasQuestions = (questions: any): boolean => {
      if (!questions) return false;
      
      // Array formatında mı?
      if (Array.isArray(questions)) {
        return questions.length > 0;
      }
      
      // Object formatında mı? (aşamalı yapı)
      if (typeof questions === "object" && questions !== null) {
        const obj = questions as any;
        // Tüm aşamaların dolu olup olmadığını kontrol et
        const stage1 = obj.stage1_introduction;
        const stage2 = obj.stage2_experience;
        const stage3 = obj.stage3_technical;
        
        // En az bir aşama dolu olmalı ve array olmalı
        const hasStage1 = Array.isArray(stage1) && stage1.length > 0;
        const hasStage2 = Array.isArray(stage2) && stage2.length > 0;
        const hasStage3 = Array.isArray(stage3) && stage3.length > 0;
        
        return hasStage1 || hasStage2 || hasStage3;
      }
      
      return false;
    };

    let interview;
    
    if (existingInterview) {
      const questionsCheck = hasQuestions(existingInterview.questions);
      console.log(`[CV_INTERVIEW] [4.5/6] Mevcut interview bulundu - interviewId: ${existingInterview.id}, sorular dolu mu: ${questionsCheck}`);
      
      if (questionsCheck) {
        // Mevcut interview'ı kullan - yeni interview oluşturma
        console.log(`[CV_INTERVIEW] [4.5/6] ✅ Mevcut interview kullanılıyor (sorular dolu)`);
        interview = existingInterview;
        
        // Response'u hemen döndür
        const responseTime = Date.now() - requestStartTime;
        console.log(`[CV_INTERVIEW] ✅ Response döndürülüyor (cached interview) - interviewId: ${interview.id}, toplam süre: ${responseTime}ms`);
        
        return NextResponse.json(
          {
            interview: {
              id: interview.id,
              title: interview.title,
              description: interview.description,
              duration: interview.duration,
              questionCount: Array.isArray(interview.questions) 
                ? interview.questions.length 
                : 0,
              status: "completed",
            },
          },
          { status: 200 }
        );
      } else {
        // Mevcut interview var ama sorular boş - mevcut interview'ı kullan ama soruları generate et
        console.log(`[CV_INTERVIEW] [4.5/6] ⚠️ Mevcut interview var ama sorular boş - mevcut interview güncellenecek`);
        interview = existingInterview;
      }
    } else {
      // Mevcut interview yok - yeni interview oluştur
      console.log(`[CV_INTERVIEW] [4.5/6] Mevcut interview yok - yeni interview oluşturulacak`);
    }

    console.log(`[CV_INTERVIEW] [5/6] Interview kaydı oluşturuluyor/güncelleniyor...`);
    // Interview kaydını oluştur veya güncelle (boş sorularla)
    if (!interview) {
      interview = await db.interview.create({
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
      console.log(`[CV_INTERVIEW] [5/6] ✅ Yeni interview kaydı oluşturuldu - interviewId: ${interview.id}`);
    } else {
      // Mevcut interview'ı güncelle (description'ı güncelle)
      interview = await db.interview.update({
        where: { id: interview.id },
        data: {
          description: "Mülakat soruları oluşturuluyor...",
        },
      });
      console.log(`[CV_INTERVIEW] [5/6] ✅ Mevcut interview güncellendi - interviewId: ${interview.id}`);
    }
    const createTime = Date.now() - requestStartTime;
    console.log(`[CV_INTERVIEW] [5/6] ✅ Interview kaydı hazır - interviewId: ${interview.id}, süre: ${createTime}ms`);

    console.log(`[CV_INTERVIEW] [6/6] Arka plan işlemi başlatılıyor (fire-and-forget fetch)...`);
    // Arka planda aşamalı olarak soruları oluştur (fire-and-forget)
    // API endpoint üzerinden fetch ile çağır - ayrı request context'inde çalışır
    const baseUrl = getBaseUrl();
    const generateStagesUrl = `${baseUrl}/api/interview/cv-based/generate-stages`;
    
    console.log(`[CV_INTERVIEW] [6/6] Fetch URL: ${generateStagesUrl}`);
    console.log(`[CV_INTERVIEW] [6/6] Fetch body:`, {
      interviewId: interview.id,
      cvId: cvId,
      userId: userId,
    });
    
    // AbortController ile timeout ekle (30 saniye)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(`[CV_INTERVIEW] [6/6] ⚠️ Fetch timeout (30s) - aborting...`);
      controller.abort();
    }, 30000); // 30 saniye timeout
    
    // Fire-and-forget: await etmeden çağır
    const fetchStartTime = Date.now();
    fetch(generateStagesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Session cookie'yi forward et (internal call için gerekli)
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({
        interviewId: interview.id,
        cvId: cvId,
        userId: userId, // Internal call için userId'yi gönder
      }),
      signal: controller.signal,
    })
      .then(async (response) => {
        clearTimeout(timeoutId);
        const fetchTime = Date.now() - fetchStartTime;
        const totalTime = Date.now() - requestStartTime;
        
        console.log(`[CV_INTERVIEW] [6/6] Fetch response alındı - HTTP ${response.status}, fetch süre: ${fetchTime}ms, toplam: ${Math.round(totalTime / 1000)}s`);
        
        if (!response.ok) {
          let errorData: any = { error: "Unknown error" };
          try {
            const text = await response.text();
            console.error(`[CV_INTERVIEW] [6/6] Response body (error):`, text.substring(0, 500));
            try {
              errorData = JSON.parse(text);
            } catch {
              errorData = { error: text || `HTTP ${response.status}` };
            }
          } catch (parseError) {
            console.error(`[CV_INTERVIEW] [6/6] Response parse hatası:`, parseError);
            errorData = { error: `HTTP ${response.status} - Response parse edilemedi` };
          }
          
          console.error(`[CV_INTERVIEW] [6/6] ❌ Arka plan işlemi hatası - interviewId: ${interview.id}, süre: ${Math.round(totalTime / 1000)}s`);
          console.error(`[CV_INTERVIEW] [6/6] HTTP Status: ${response.status}`, {
            error: errorData.error || errorData.message || "Bilinmeyen hata",
            cvId: cvId,
            interviewId: interview.id,
            url: generateStagesUrl,
            statusText: response.statusText,
          });
          
          // Hata durumunda interview description'ına hata mesajı ekle
          const errorMsg = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
          await db.interview.update({
            where: { id: interview.id },
            data: {
              description: `Mülakat soruları oluşturulurken hata oluştu: ${errorMsg}. Lütfen tekrar deneyin.`,
            },
          }).catch((updateError: unknown) => {
            console.error(`[CV_INTERVIEW] [6/6] ❌ Hata mesajı veritabanına kaydedilemedi:`, updateError);
          });
        } else {
          let data: any = {};
          try {
            const text = await response.text();
            console.log(`[CV_INTERVIEW] [6/6] Response body (success):`, text.substring(0, 500));
            if (text) {
              try {
                data = JSON.parse(text);
              } catch {
                data = { message: text };
              }
            }
          } catch (parseError) {
            console.warn(`[CV_INTERVIEW] [6/6] Response parse hatası (non-critical):`, parseError);
          }
          
          console.log(`[CV_INTERVIEW] [6/6] ✅ Arka plan işlemi başlatıldı - interviewId: ${interview.id}, toplam süre: ${Math.round(totalTime / 1000)}s`);
          console.log(`[CV_INTERVIEW] [6/6] Response data:`, data);
          console.log(`[CV_INTERVIEW] ========== MÜLAKAT OLUŞTURMA İSTEĞİ TAMAMLANDI ==========`);
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        const fetchTime = Date.now() - fetchStartTime;
        const totalTime = Date.now() - requestStartTime;
        
        const isAborted = error?.name === "AbortError" || error?.message?.includes("aborted");
        const isTimeout = fetchTime >= 30000;
        const isNetworkError = 
          error?.message?.includes("fetch failed") ||
          error?.message?.includes("ECONNREFUSED") ||
          error?.message?.includes("ENOTFOUND") ||
          error?.message?.includes("network");
        
        console.error(`[CV_INTERVIEW] [6/6] ❌ Fetch hatası - interviewId: ${interview.id}, fetch süre: ${fetchTime}ms, toplam: ${Math.round(totalTime / 1000)}s`);
        console.error(`[CV_INTERVIEW] [6/6] Fetch hata detayları:`, {
          message: error?.message || "Bilinmeyen hata",
          name: error?.name,
          stack: error?.stack,
          cvId: cvId,
          interviewId: interview.id,
          url: generateStagesUrl,
          baseUrl: baseUrl,
          isAborted: isAborted,
          isTimeout: isTimeout,
          isNetworkError: isNetworkError,
        });
        
        // Hata durumunda interview description'ına hata mesajı ekle
        let errorMsg = error?.message || "Bilinmeyen hata";
        if (isAborted || isTimeout) {
          errorMsg = "Zaman aşımı: Arka plan işlemi başlatılamadı. Lütfen tekrar deneyin.";
        } else if (isNetworkError) {
          errorMsg = "Ağ hatası: Arka plan işlemi başlatılamadı. Lütfen tekrar deneyin.";
        }
        
        db.interview.update({
          where: { id: interview.id },
          data: {
            description: `Mülakat soruları oluşturulurken hata oluştu: ${errorMsg}. Lütfen tekrar deneyin.`,
          },
        }).catch((updateError: unknown) => {
          console.error(`[CV_INTERVIEW] [6/6] ❌ Hata mesajı veritabanına kaydedilemedi:`, updateError);
        });
      });

    // Hemen response döndür
    const responseTime = Date.now() - requestStartTime;
    console.log(`[CV_INTERVIEW] ✅ Response döndürülüyor - interviewId: ${interview.id}, toplam süre: ${responseTime}ms`);
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
    const errorTime = Date.now() - requestStartTime;
    console.error(`[CV_INTERVIEW] ========== MÜLAKAT OLUŞTURMA HATASI ==========`);
    console.error(`[CV_INTERVIEW] Hata süresi: ${errorTime}ms`);
    console.error(`[CV_INTERVIEW] Hata detayları:`, {
      message: error?.message || "Bilinmeyen hata",
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { error: `Mülakat oluşturulurken bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

