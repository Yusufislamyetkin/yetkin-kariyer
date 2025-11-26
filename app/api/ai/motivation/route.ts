import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAIEnabled, createChatCompletion } from "@/lib/ai/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const motivationSchema = z.object({
  message: z.string(),
  emoji: z.string(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Kullanıcı istatistiklerini al
    const [quizStats, interviewStats, recentBadges, completedTopics] = await Promise.all([
      db.quizAttempt.aggregate({
        where: { userId },
        _avg: { score: true },
        _count: { _all: true },
      }),
      db.interviewAttempt.aggregate({
        where: { userId },
        _avg: { aiScore: true },
        _count: { _all: true },
      }),
      db.badgeEarned.findMany({
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
      }),
      db.topicProgress.count({
        where: {
          userId,
          completed: true,
        },
      }),
    ]);

    const stats = {
      quizCount: quizStats._count._all,
      avgQuizScore: Math.round(quizStats._avg.score ?? 0),
      interviewCount: interviewStats._count._all,
      avgInterviewScore: Math.round(interviewStats._avg.aiScore ?? 0),
      recentBadges: recentBadges.map((b: typeof recentBadges[0]) => b.badge.name),
      completedTopics,
    };

    if (!isAIEnabled()) {
      // Fallback motivasyon mesajları
      const fallbackMessages = [
        {
          message: "Harika bir ilerleme kaydediyorsun! Devam et, hedeflerine ulaşmana çok az kaldı. 💪",
          emoji: "💪",
        },
        {
          message: "Her gün küçük adımlar atarak büyük başarılara ulaşırsın. Bugün de bir adım daha at! 🚀",
          emoji: "🚀",
        },
        {
          message: "Öğrenme yolculuğunda sabır ve azim en büyük gücündür. Sen harika gidiyorsun! ⭐",
          emoji: "⭐",
        },
      ];

      const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      return NextResponse.json(randomMessage);
    }

    const prompt = `
Sen Yetkin Mentor'sun, öğrencilerine ilham veren bir öğretmensin.

Öğrenci İstatistikleri:
- Test Denemeleri: ${stats.quizCount}
- Ortalama Test Skoru: %${stats.avgQuizScore}
- Mülakat Denemeleri: ${stats.interviewCount}
- Ortalama Mülakat Skoru: %${stats.avgInterviewScore}
- Tamamlanan Konular: ${stats.completedTopics}
- Son Rozetler: ${stats.recentBadges.join(", ") || "Henüz yok"}

Görev:
- Öğrencinin performansına göre kişiselleştirilmiş, motive edici bir mesaj yaz.
- Mesaj 2-3 cümle uzunluğunda olsun.
- Pozitif, destekleyici ve ilham verici bir ton kullan.
- Öğrencinin başarılarını vurgula ve gelecekteki potansiyelini hatırlat.
- Türkçe yaz.

Çıktı formatı (JSON):
{
  "message": "Motivasyon mesajı buraya",
  "emoji": "🎯"
}
`;

    const { parsed } = await createChatCompletion({
      schema: motivationSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen Yetkin Mentor'sun, öğrencilerine ilham veren ve onları destekleyen bir öğretmensin. Kısa, öz ve motive edici mesajlar yazarsın.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    if (parsed) {
      return NextResponse.json({
        message: parsed.message,
        emoji: parsed.emoji || "💪",
      });
    }

    // Fallback
    return NextResponse.json({
      message: "Harika bir ilerleme kaydediyorsun! Devam et, hedeflerine ulaşmana çok az kaldı. 💪",
      emoji: "💪",
    });
  } catch (error) {
    console.error("Error generating motivation message:", error);
    return NextResponse.json(
      {
        message: "Her gün küçük adımlar atarak büyük başarılara ulaşırsın. Bugün de bir adım daha at! 🚀",
        emoji: "🚀",
      },
      { status: 200 }
    );
  }
}

