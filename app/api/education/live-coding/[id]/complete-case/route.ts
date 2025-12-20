import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkBadgesForActivity, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Quiz ID'den "quiz-" prefix'ini kaldırır
 */
function normalizeQuizId(id: string): string {
  return id.startsWith("quiz-") ? id.substring(5) : id;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json(
        { error: "Geçersiz canlı kodlama ID'si" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { taskId, completedAt } = body;

    const userId = session.user.id as string;
    // ID'den "quiz-" prefix'ini kaldır
    const quizId = normalizeQuizId(params.id);

    // Quiz'in varlığını kontrol et
    const quiz = await db.quiz.findUnique({
      where: {
        id: quizId,
        type: "LIVE_CODING",
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Canlı kodlama bulunamadı" },
        { status: 404 }
      );
    }

    // Bugünün başlangıcını hesapla
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Bugün için bu kullanıcının bu quiz için kayıt var mı kontrol et
    const existingAttempt = await db.liveCodingAttempt.findFirst({
      where: {
        userId,
        quizId,
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Eğer kayıt varsa, sadece metrics'i güncelle
    if (existingAttempt) {
      const currentMetrics = (existingAttempt.metrics as any) || {};
      const updatedMetrics = {
        ...currentMetrics,
        caseCompleted: true,
        caseCompletedAt: completedAt || new Date().toISOString(),
        completedTaskIds: [
          ...(currentMetrics.completedTaskIds || []),
          ...(taskId && !currentMetrics.completedTaskIds?.includes(taskId)
            ? [taskId]
            : []),
        ],
      };

      await db.liveCodingAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          metrics: updatedMetrics,
          completedAt: new Date(),
        },
      });

      // Check for badges (daily activities, streak, etc.)
      let badgeResults: BadgeCheckResult = {
        newlyEarnedBadges: [],
        totalEarned: 0,
      };
      try {
        badgeResults = await checkBadgesForActivity({
          userId,
          activityType: "canlı kod",
        });
        if (badgeResults.totalEarned > 0) {
          console.log(`[LIVE_CODING] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${userId}`);
        }
      } catch (e) {
        console.warn("Badge check failed:", e);
      }

      return NextResponse.json({
        success: true,
        attempt: existingAttempt,
        updated: true,
        badgeResults,
      });
    }

    // Kayıt yoksa yeni kayıt oluştur
    const completedAtDate = completedAt
      ? new Date(completedAt)
      : new Date();

    const liveCodingAttempt = await db.liveCodingAttempt.create({
      data: {
        userId,
        quizId,
        code: null, // Code henüz gönderilmedi
        metrics: {
          caseCompleted: true,
          caseCompletedAt: completedAtDate.toISOString(),
          completedTaskIds: taskId ? [taskId] : [],
        },
        completedAt: completedAtDate,
      },
    });

    // Check for badges (daily activities, streak, etc.)
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };
    try {
      badgeResults = await checkBadgesForActivity({
        userId,
        activityType: "canlı kod",
      });
      if (badgeResults.totalEarned > 0) {
        console.log(`[LIVE_CODING] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${userId}`);
      }
    } catch (e) {
      console.warn("Badge check failed:", e);
    }

    return NextResponse.json({
      success: true,
      attempt: liveCodingAttempt,
      created: true,
      badgeResults,
    });
  } catch (error) {
    console.error("[LIVE_CODING] Error completing case:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      {
        error: "Case tamamlanırken bir hata oluştu",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

