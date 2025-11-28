import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface BadgeProgress {
  badgeId: string;
  current: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
}

// Streak bilgilerini al (güncelleme yapmadan)
async function getUserStreak(userId: string) {
  let userStreak = await db.userStreak.findUnique({
    where: { userId },
  });

  if (!userStreak) {
    return { currentStreak: 0, longestStreak: 0, totalDaysActive: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActivityDate = userStreak.lastActivityDate
    ? new Date(userStreak.lastActivityDate)
    : null;
  const lastActivityDay = lastActivityDate
    ? new Date(lastActivityDate.setHours(0, 0, 0, 0))
    : null;

  let currentStreak = userStreak.currentStreak;
  if (!lastActivityDay || lastActivityDay.getTime() < today.getTime()) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastActivityDay || lastActivityDay.getTime() === yesterday.getTime()) {
      currentStreak = userStreak.currentStreak + 1;
    } else if (lastActivityDay.getTime() < yesterday.getTime()) {
      currentStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak: userStreak.longestStreak,
    totalDaysActive: userStreak.totalDaysActive,
  };
}

export async function calculateBadgeProgress(
  userId: string,
  badge: any
): Promise<BadgeProgress> {
  const criteria = badge.criteria as any;
  let current = 0;
  let target = 0;
  let isCompleted = false;

  // Önce kullanıcının bu rozeti kazanıp kazanmadığını kontrol et
  // Key bazlı eşleştirme yap: eğer badge.key varsa, önce key ile badge bul, sonra id ile userBadge ara
  let badgeIdToCheck = badge.id;
  
  if (badge.key) {
    // Key ile badge bul
    const badgeByKey = await db.badge.findUnique({
      where: { key: badge.key },
      select: { id: true },
    });
    if (badgeByKey) {
      badgeIdToCheck = badgeByKey.id;
    }
  }

  const userBadge = await db.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badgeIdToCheck,
      },
    },
  });

  if (userBadge) {
    isCompleted = true;
  }

  switch (badge.category) {
    case "daily_activities":
      if (criteria.type === "daily_activity" && criteria.daily) {
        target = criteria.count || 0;

        // UTC timezone kullanarak bugünün başlangıcını hesapla
        const now = new Date();
        const today = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        if (criteria.activity_type === "test") {
          current = await db.quizAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
        } else if (
          criteria.activity_type === "canlı kod" ||
          criteria.activity_type === "canlı kodlama"
        ) {
          current = await db.liveCodingAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
        } else if (
          criteria.activity_type === "bugfix" ||
          criteria.activity_type === "hata düzeltme"
        ) {
          current = await db.bugFixAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
        } else if (criteria.activity_type === "ders") {
          current = await db.lessonCompletion.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
        } else if (criteria.activity_type === "quiz") {
          current = await db.quizAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
        } else if (criteria.activity_type === "eğitim faaliyeti") {
          // Eğitim faaliyeti: test + ders + canlı kodlama + bugfix toplamı
          // Test (quiz attempt)
          const todayTests = await db.quizAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
          
          // Ders (lesson completion)
          const todayLessons = await db.lessonCompletion.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
          
          // Canlı kodlama (live coding attempt)
          const todayLiveCoding = await db.liveCodingAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
          
          // Bugfix (bugfix attempt)
          const todayBugFix = await db.bugFixAttempt.count({
            where: {
              userId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          });
          
          current = todayTests + todayLessons + todayLiveCoding + todayBugFix;
        }
      }
      break;

    case "social_interaction":
      if (criteria.type === "social_interaction") {
        target = criteria.count || 0;

        if (criteria.interaction_type === "post") {
          current = await db.post.count({
            where: { userId },
          });
        } else if (criteria.interaction_type === "mesaj") {
          current = await db.chatMessage.count({
            where: { userId },
          });
        } else if (criteria.interaction_type === "beğeni") {
          current = await db.postLike.count({
            where: { userId },
          });
        } else if (criteria.interaction_type === "yorum") {
          current = await db.postComment.count({
            where: { userId },
          });
        } else if (criteria.interaction_type === "story") {
          current = await db.story.count({
            where: { userId },
          });
        } else if (
          criteria.interaction_type === "arkadaş" ||
          criteria.interaction_type === "takipçi"
        ) {
          current = await db.friendship.count({
            where: {
              OR: [
                { requesterId: userId, status: "accepted" },
                { addresseeId: userId, status: "accepted" },
              ],
            },
          });
        } else if (
          criteria.interaction_type === "paylaşım" ||
          criteria.interaction_type === "etkileşim"
        ) {
          const posts = await db.post.count({ where: { userId } });
          const likes = await db.postLike.count({ where: { userId } });
          const comments = await db.postComment.count({ where: { userId } });
          current = posts + likes + comments;
        } else if (criteria.interaction_type === "sosyal_etkileşim") {
          const posts = await db.post.count({ where: { userId } });
          const likes = await db.postLike.count({ where: { userId } });
          const comments = await db.postComment.count({ where: { userId } });
          const stories = await db.story.count({ where: { userId } });
          const friendships = await db.friendship.count({
            where: {
              OR: [
                { requesterId: userId, status: "accepted" },
                { addresseeId: userId, status: "accepted" },
              ],
            },
          });
          current = posts + likes + comments + stories + friendships;
        }
      }
      break;

    case "streak":
      if (criteria.type === "streak" && criteria.streak_type && criteria.days !== undefined) {
        target = criteria.days;
        const streakData = await getUserStreak(userId);
        current = streakData.currentStreak;
      } else if (criteria.type === "current_streak" && criteria.value) {
        target = criteria.value;
        const streakData = await getUserStreak(userId);
        current = streakData.currentStreak;
      } else if (criteria.type === "longest_streak" && criteria.value) {
        target = criteria.value;
        const streakData = await getUserStreak(userId);
        current = streakData.longestStreak;
      }
      break;

    case "total_achievements":
      if (criteria.type && criteria.count !== undefined) {
        target = criteria.count;

        if (criteria.type === "test_count") {
          current = await db.quizAttempt.count({
            where: { userId },
          });
        } else if (criteria.type === "perfect_score_count") {
          const userQuizAttempts = await db.quizAttempt.findMany({
            where: { userId },
          });
          current = userQuizAttempts.filter(
            (qa: { score: number }) => qa.score === 100
          ).length;
        } else if (criteria.type === "total_score") {
          const userQuizAttempts = await db.quizAttempt.findMany({
            where: { userId },
          });
          current = userQuizAttempts.reduce(
            (sum: number, qa: { score: number }) => sum + qa.score,
            0
          );
        } else if (criteria.type === "lesson_count") {
          current = await db.lessonCompletion.count({
            where: { userId },
          });
        } else if (criteria.type === "quiz_count") {
          current = await db.quizAttempt.count({
            where: { userId },
          });
        } else if (criteria.type === "live_coding_count") {
          current = await db.liveCodingAttempt.count({
            where: { userId },
          });
        } else if (criteria.type === "bugfix_count") {
          current = await db.bugFixAttempt.count({
            where: { userId },
          });
        }
      }
      break;

    case "special":
      // Özel rozetler için ilerleme hesaplama
      if (criteria.type === "special" && criteria.special_type) {
        target = 1; // Özel rozetler genellikle tek seferlik

        switch (criteria.special_type) {
          case "ilk test":
            const totalQuizCount = await db.quizAttempt.count({
              where: { userId },
            });
            current = totalQuizCount >= 1 ? 1 : 0;
            break;
          case "ilk kurs":
          case "ilk ders":
            const lessonCompletions = await db.lessonCompletion.findMany({
              where: { userId },
              distinct: [Prisma.LessonCompletionScalarFieldEnum.lessonSlug],
            });
            current = lessonCompletions.length >= 1 ? 1 : 0;
            break;
          case "ilk post":
            const postCount = await db.post.count({ where: { userId } });
            current = postCount >= 1 ? 1 : 0;
            break;
          default:
            // Diğer özel rozetler için genel kontrol
            current = isCompleted ? 1 : 0;
            break;
        }
      }
      break;
  }

  // Eğer rozet kazanılmışsa, current'ı target'a eşitle
  if (isCompleted) {
    current = target;
  }

  // İlerleme tamamlanmış mı kontrol et (current >= target)
  // Bu kontrol, rozet henüz userBadge tablosunda olmasa bile ilerleme tamamlanmışsa true döndürür
  if (!isCompleted && target > 0 && current >= target) {
    isCompleted = true;
  }

  // Percentage hesapla
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  // Return badgeId olarak key varsa key, yoksa id kullan (frontend'de eşleştirme için)
  return {
    badgeId: badge.key || badge.id,
    current,
    target,
    percentage,
    isCompleted,
  };
}

