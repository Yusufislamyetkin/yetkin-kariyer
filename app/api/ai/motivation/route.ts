import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAIEnabled, createChatCompletion } from "@/lib/ai/client";
import { getCache, setCache, cacheKeys, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const motivationSchema = z.object({
  message: z.string(),
  emoji: z.string(),
});

export async function GET() {
  let userId: string | null = null;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    userId = session.user.id as string;

    // Check Redis cache first
    const cacheKey = cacheKeys.motivation(userId);
    const cachedData = await getCache<any>(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Kullanıcı istatistiklerini al - her birini ayrı ayrı handle et
    const getQuizStats = async () => {
      try {
        if (!db.quizAttempt?.aggregate) {
          return { _avg: { score: null }, _count: { _all: 0 } };
        }
        return await db.quizAttempt.aggregate({
          where: { userId },
          _avg: { score: true },
          _count: { _all: true },
        });
      } catch {
        return { _avg: { score: null }, _count: { _all: 0 } };
      }
    };

    const getInterviewStats = async () => {
      try {
        if (!db.interviewAttempt?.aggregate) {
          return { _avg: { aiScore: null }, _count: { _all: 0 } };
        }
        return await db.interviewAttempt.aggregate({
          where: { userId },
          _avg: { aiScore: true },
          _count: { _all: true },
        });
      } catch {
        return { _avg: { aiScore: null }, _count: { _all: 0 } };
      }
    };

    const getRecentBadges = async () => {
      try {
        if (!db.badgeEarned?.findMany) {
          return [];
        }
        return await db.badgeEarned.findMany({
          where: { userId },
          orderBy: { earnedAt: "desc" },
          take: 3,
          include: {
            badge: {
              select: {
                name: true,
              },
            },
          },
        });
      } catch {
        return [];
      }
    };

    const getCompletedTopics = async () => {
      try {
        if (!db.topicProgress?.count) {
          return 0;
        }
        return await db.topicProgress.count({
          where: {
            userId,
            completed: true,
          },
        });
      } catch {
        return 0;
      }
    };

    const [quizStats, interviewStats, recentBadges, completedTopics] = await Promise.all([
      getQuizStats(),
      getInterviewStats(),
      getRecentBadges(),
      getCompletedTopics(),
    ]);

    const stats = {
      quizCount: quizStats._count?._all ?? 0,
      avgQuizScore: Math.round(quizStats._avg?.score ?? 0),
      interviewCount: interviewStats._count?._all ?? 0,
      avgInterviewScore: Math.round(interviewStats._avg?.aiScore ?? 0),
      recentBadges: Array.isArray(recentBadges)
        ? recentBadges
            .map((b: any) => b?.badge?.name)
            .filter((name: string | undefined): name is string => !!name)
        : [],
      completedTopics: completedTopics ?? 0,
    };

    if (!isAIEnabled()) {
      // Fallback motivasyon mesajları
      const fallbackMessages = [
        {
          message: "İlerleme kaydediyorsun. Devam et, hedeflerine ulaşmana az kaldı.",
          emoji: "😊",
        },
        {
          message: "Her gün küçük adımlar atarak büyük başarılara ulaşırsın. Bugün de bir adım daha atabilirsin.",
          emoji: "😊",
        },
        {
          message: "Öğrenme yolculuğunda sabır ve azim önemli. İyi gidiyorsun.",
          emoji: "❤️",
        },
      ];

      const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      // Cache the fallback message
      await setCache(cacheKey, randomMessage, CACHE_TTL.MOTIVATION);
      return NextResponse.json(randomMessage);
    }

    const prompt = `
Sen AI Öğretmen Selin'sin, öğrencilerine ilham veren bir öğretmensin.

Öğrenci İstatistikleri:
- Test Denemeleri: ${stats.quizCount}
- Ortalama Test Skoru: %${stats.avgQuizScore}
- Mülakat Denemeleri: ${stats.interviewCount}
- Ortalama Mülakat Skoru: %${stats.avgInterviewScore}
- Tamamlanan Konular: ${stats.completedTopics}
- Son Rozetler: ${stats.recentBadges.join(", ") || "Henüz yok"}

Görev:
- Öğrencinin performansına göre kişiselleştirilmiş, nötr bir mesaj yaz.
- Mesaj 2-3 cümle uzunluğunda olsun.
- Nötr ve bilgilendirici bir ton kullan, çok destekleyici olma.
- Öğrencinin durumunu objektif şekilde değerlendir.
- Türkçe yaz.
- Ünlem işareti kullanma, nokta kullan.

Çıktı formatı (JSON):
{
  "message": "Mesaj buraya",
  "emoji": "😊"
}
`;

    const { parsed } = await createChatCompletion({
      schema: motivationSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen AI Öğretmen Selin'sin, öğrencilerine bilgi veren ve durumlarını değerlendiren bir öğretmensin. Kısa, öz ve nötr mesajlar yazarsın. Çok destekleyici olma, objektif kal.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    if (parsed) {
      const response = {
        message: parsed.message,
        emoji: parsed.emoji || "😊",
      };
      // Cache the AI-generated message
      await setCache(cacheKey, response, CACHE_TTL.MOTIVATION);
      return NextResponse.json(response);
    }

    // Fallback
    const fallbackResponse = {
      message: "İlerleme kaydediyorsun. Devam et, hedeflerine ulaşmana az kaldı.",
      emoji: "😊",
    };
    // Cache the fallback message
    await setCache(cacheKey, fallbackResponse, CACHE_TTL.MOTIVATION);
    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error("Error generating motivation message:", error);
    const errorResponse = {
      message: "Her gün küçük adımlar atarak büyük başarılara ulaşırsın. Bugün de bir adım daha atabilirsin.",
      emoji: "😊",
    };
    // Cache the error fallback message
    if (userId) {
      const cacheKey = cacheKeys.motivation(userId);
      await setCache(cacheKey, errorResponse, CACHE_TTL.MOTIVATION);
    }
    return NextResponse.json(errorResponse, { status: 200 });
  }
}

