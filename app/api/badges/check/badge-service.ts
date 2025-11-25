import { db } from "@/lib/db";

export interface BadgeCheckResult {
  newlyEarnedBadges: any[];
  totalEarned: number;
}

interface BadgeCheckParams {
  userId: string;
  quizAttemptId: string;
}

interface ActivityBadgeCheckParams {
  userId: string;
  activityType?: "test" | "kurs" | "canlı kod" | "canlı kodlama" | "bugfix" | "hata düzeltme" | "ders" | "quiz";
}

// Ortak streak güncelleme fonksiyonu
async function updateUserStreak(userId: string) {
  let userStreak = await db.userStreak.findUnique({
    where: { userId },
  });

  if (!userStreak) {
    userStreak = await db.userStreak.create({
      data: {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalDaysActive: 0,
      },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActivityDate = userStreak.lastActivityDate
    ? new Date(userStreak.lastActivityDate)
    : null;
  const lastActivityDay = lastActivityDate
    ? new Date(lastActivityDate.setHours(0, 0, 0, 0))
    : null;

  let newStreak = userStreak.currentStreak;
  if (!lastActivityDay || lastActivityDay.getTime() < today.getTime()) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastActivityDay || lastActivityDay.getTime() === yesterday.getTime()) {
      newStreak = userStreak.currentStreak + 1;
    } else if (lastActivityDay.getTime() < yesterday.getTime()) {
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(newStreak, userStreak.longestStreak);

  await db.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
      totalDaysActive: {
        increment: lastActivityDay?.getTime() !== today.getTime() ? 1 : 0,
      },
    },
  });

  return { currentStreak: newStreak, longestStreak, totalDaysActive: userStreak.totalDaysActive + (lastActivityDay?.getTime() !== today.getTime() ? 1 : 0) };
}

export async function checkBadgesForAttempt({
  userId,
  quizAttemptId,
}: BadgeCheckParams): Promise<BadgeCheckResult> {
  const quizAttempt = await db.quizAttempt.findUnique({
    where: { id: quizAttemptId },
    include: { quiz: true },
  });

  if (!quizAttempt || quizAttempt.userId !== userId) {
    throw new Error("Test denemesi bulunamadı");
  }

  const allBadges = await db.badge.findMany();
  const userBadges = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const earnedBadgeIds = new Set(userBadges.map((ub: { badgeId: string }) => ub.badgeId));
  const newlyEarnedBadges: any[] = [];

  const userQuizAttempts = await db.quizAttempt.findMany({
    where: { userId },
  });

  const totalQuizCount = userQuizAttempts.length;
  const averageScore =
    totalQuizCount > 0
      ? userQuizAttempts.reduce((sum: number, qa: { score: number }) => sum + qa.score, 0) / totalQuizCount
      : 0;
  const maxSingleScore = userQuizAttempts.length > 0
    ? Math.max(...userQuizAttempts.map((qa: { score: number }) => qa.score))
    : 0;
  const perfectScoreCount = userQuizAttempts.filter(
    (qa: { score: number }) => qa.score === 100
  ).length;

  const streakData = await updateUserStreak(userId);
  const newStreak = streakData.currentStreak;
  const longestStreak = streakData.longestStreak;
  const totalDaysActive = streakData.totalDaysActive;

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) {
      continue;
    }

    const criteria = badge.criteria as any;
    let shouldEarn = false;

    switch (badge.category) {
      case "test_count":
        if (
          criteria.type === "total_quizzes" &&
          totalQuizCount >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "score":
        // Yeni badges.json yapısı: criteria.type === "score", criteria.score_type, criteria.min_score
        if (criteria.type === "score" && criteria.score_type && criteria.min_score !== undefined) {
          const maxSingleScore = userQuizAttempts.length > 0
            ? Math.max(...userQuizAttempts.map((qa: { score: number }) => qa.score))
            : 0;
          const totalScore = userQuizAttempts.reduce((sum: number, qa: { score: number }) => sum + qa.score, 0);
          const perfectScoreCount = userQuizAttempts.filter(
            (qa: { score: number }) => qa.score === 100
          ).length;
          
          switch (criteria.score_type) {
            case "tek test":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "efsanevi":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "ortalama":
              if (averageScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "toplam":
              if (totalScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "mükemmel":
              if (maxSingleScore >= criteria.min_score || perfectScoreCount > 0) {
                shouldEarn = true;
              }
              break;
            case "yüksek":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "tutarlı":
              // Tutarlı skor: tüm skorların standart sapması düşük olmalı (basitleştirilmiş: ortalama yüksekse tutarlı sayılır)
              if (averageScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "başarılı":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "harika":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (criteria.type === "average_score" && averageScore >= criteria.value) {
          shouldEarn = true;
        } else if (
          criteria.type === "single_score" &&
          quizAttempt.score >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "perfect_score" &&
          quizAttempt.score === 100
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "perfect_scores" &&
          criteria.value
        ) {
          const perfectScoreCount = userQuizAttempts.filter(
            (qa: { score: number }) => qa.score === 100
          ).length;
          if (perfectScoreCount >= criteria.value) {
            shouldEarn = true;
          }
        }
        break;
      case "streak":
        // Yeni badges.json yapısı: criteria.type === "streak", criteria.streak_type, criteria.days
        if (criteria.type === "streak" && criteria.streak_type && criteria.days !== undefined) {
          // Şu an için tüm streak_type'lar için currentStreak kullanıyoruz
          // Gelecekte farklı streak tipleri için ayrı tracking eklenebilir
          if (newStreak >= criteria.days) {
            shouldEarn = true;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (
          criteria.type === "current_streak" &&
          newStreak >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "longest_streak" &&
          longestStreak >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "topic":
        if (criteria.type === "topic_complete") {
          // Tüm konuları bul
          const allTopicsData = await db.quiz.findMany({
            select: { topic: true },
            distinct: ['topic'],
            where: { topic: { not: null } },
          });

          const allTopics = Array.from(
            new Set(allTopicsData.map((t: { topic: string | null }) => t.topic).filter(Boolean))
          ) as string[];

          let completedTopicsCount = 0;

          // Her konu için kontrol yap
          for (const topic of allTopics) {
            const topicQuizzes = await db.quiz.findMany({
              where: { topic },
            });

            if (topicQuizzes.length === 0) continue;

            const topicAttempts = await db.quizAttempt.findMany({
              where: {
                userId,
                quizId: { in: topicQuizzes.map((q: { id: string }) => q.id) },
              },
            });

            // Bu konudaki tüm quizleri tam puanla tamamladı mı?
            const allPerfect = topicQuizzes.every((tq: { id: string }) =>
              topicAttempts.some(
                (ta: { quizId: string; score: number }) => ta.quizId === tq.id && ta.score === 100
              )
            );

            if (allPerfect) {
              completedTopicsCount++;
            }
          }

          // Gerekli konu sayısını kontrol et
          const requiredCount = criteria.value || 1;
          if (completedTopicsCount >= requiredCount) {
            shouldEarn = true;
          }
        }
        break;
      case "special":
        // Yeni badges.json yapısı: criteria.type === "special", criteria.special_type
        if (criteria.type === "special" && criteria.special_type) {
          switch (criteria.special_type) {
            case "ilk test":
              if (totalQuizCount === 1) {
                shouldEarn = true;
              }
              break;
            case "ilk kurs":
              // İlk kurs tamamlama kontrolü
              const courseCompletions = await db.lessonCompletion.findMany({
                where: { userId },
                distinct: ['lessonId'],
              });
              if (courseCompletions.length === 1) {
                shouldEarn = true;
              }
              break;
            case "ilk post":
              const postCount = await db.post.count({ where: { userId } });
              if (postCount === 1) {
                shouldEarn = true;
              }
              break;
            case "hızlı tamamlama":
              if (quizAttempt.duration && quizAttempt.duration <= 300) { // 5 dakika
                shouldEarn = true;
              }
              break;
            case "mükemmel performans":
              if (quizAttempt.score === 100) {
                shouldEarn = true;
              }
              break;
            case "özel kombinasyon":
              // Özel kombinasyon: yüksek skor + hızlı tamamlama
              if (quizAttempt.score >= 90 && quizAttempt.duration && quizAttempt.duration <= 600) {
                shouldEarn = true;
              }
              break;
            case "nadir başarı":
              // Nadir başarı: perfect score
              if (quizAttempt.score === 100) {
                shouldEarn = true;
              }
              break;
            case "efsanevi an":
              // Efsanevi an: perfect score + çok hızlı
              if (quizAttempt.score === 100 && quizAttempt.duration && quizAttempt.duration <= 300) {
                shouldEarn = true;
              }
              break;
            case "tarihi başarı":
              // Tarihi başarı: ilk perfect score
              if (quizAttempt.score === 100 && perfectScoreCount === 1) {
                shouldEarn = true;
              }
              break;
            case "benzersiz başarı":
              // Benzersiz başarı: çok yüksek skor
              if (quizAttempt.score >= 95) {
                shouldEarn = true;
              }
              break;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (criteria.type === "first_quiz" && totalQuizCount === 1) {
          shouldEarn = true;
        } else if (
          criteria.type === "fast_completion" &&
          quizAttempt.duration &&
          quizAttempt.duration <= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "total_days_active" &&
          criteria.value
        ) {
          if (totalDaysActive >= criteria.value) {
            shouldEarn = true;
          }
        } else if (criteria.type === "special") {
          // Özel başarı rozetleri için genel kontrol
          shouldEarn = true; // Bu daha spesifik kontrol gerektirebilir
        }
        break;
      case "daily_activities":
        if (criteria.type === "daily_activity" && criteria.daily) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Bugünkü aktiviteleri say
          let todayCount = 0;
          
          if (criteria.activity_type === "test") {
            const todayAttempts = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayAttempts;
          } else if (criteria.activity_type === "kurs") {
            const todayCompletions = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayCompletions;
          } else if (criteria.activity_type === "canlı kod" || criteria.activity_type === "canlı kodlama") {
            const todayLiveCoding = await db.liveCodingAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayLiveCoding;
          } else if (criteria.activity_type === "bugfix" || criteria.activity_type === "hata düzeltme") {
            const todayBugFix = await db.bugFixAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayBugFix;
          } else if (criteria.activity_type === "pratik") {
            // Pratik: quiz attempt olarak sayılabilir
            const todayPratik = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayPratik;
          } else if (criteria.activity_type === "eğitim") {
            // Eğitim: lesson completion olarak sayılabilir
            const todayEgitim = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayEgitim;
          }
          
          if (todayCount >= criteria.count) {
            shouldEarn = true;
          }
        }
        break;
      case "social_interaction":
        if (criteria.type === "social_interaction") {
          let interactionCount = 0;
          
          if (criteria.interaction_type === "post") {
            interactionCount = await db.post.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "beğeni") {
            interactionCount = await db.postLike.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "yorum") {
            interactionCount = await db.postComment.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "story") {
            interactionCount = await db.story.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "arkadaş" || criteria.interaction_type === "takipçi") {
            interactionCount = await db.friendship.count({
              where: {
                OR: [
                  { requesterId: userId, status: "accepted" },
                  { addresseeId: userId, status: "accepted" },
                ],
              },
            });
          } else if (criteria.interaction_type === "paylaşım" || criteria.interaction_type === "etkileşim") {
            // Toplam sosyal etkileşim
            const posts = await db.post.count({ where: { userId } });
            const likes = await db.postLike.count({ where: { userId } });
            const comments = await db.postComment.count({ where: { userId } });
            interactionCount = posts + likes + comments;
          } else if (criteria.interaction_type === "topluluk") {
            // Topluluk: tüm sosyal etkileşimlerin toplamı
            const posts = await db.post.count({ where: { userId } });
            const likes = await db.postLike.count({ where: { userId } });
            const comments = await db.postComment.count({ where: { userId } });
            const stories = await db.story.count({ where: { userId } });
            interactionCount = posts + likes + comments + stories;
          } else if (criteria.interaction_type === "sosyal") {
            // Sosyal: tüm sosyal etkileşimlerin toplamı
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
            interactionCount = posts + likes + comments + stories + friendships;
          }
          
          if (interactionCount >= criteria.count) {
            shouldEarn = true;
          }
        }
        break;
    }

    if (shouldEarn) {
      await db.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      newlyEarnedBadges.push(badge);
      earnedBadgeIds.add(badge.id);
    }
  }

  return {
    newlyEarnedBadges,
    totalEarned: newlyEarnedBadges.length,
  };
}

// Aktivite tamamlandığında rozet kontrolü yapar (quizAttemptId gerektirmez)
export async function checkBadgesForActivity({
  userId,
  activityType,
}: ActivityBadgeCheckParams): Promise<BadgeCheckResult> {
  const allBadges = await db.badge.findMany();
  const userBadges = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const earnedBadgeIds = new Set(userBadges.map((ub: { badgeId: string }) => ub.badgeId));
  const newlyEarnedBadges: any[] = [];

  // Streak güncellemesi yap
  const streakData = await updateUserStreak(userId);
  const newStreak = streakData.currentStreak;
  const longestStreak = streakData.longestStreak;
  const totalDaysActive = streakData.totalDaysActive;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) {
      continue;
    }

    const criteria = badge.criteria as any;
    let shouldEarn = false;

    switch (badge.category) {
      case "streak":
        // Yeni badges.json yapısı: criteria.type === "streak", criteria.streak_type, criteria.days
        if (criteria.type === "streak" && criteria.streak_type && criteria.days !== undefined) {
          if (newStreak >= criteria.days) {
            shouldEarn = true;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (
          criteria.type === "current_streak" &&
          newStreak >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "longest_streak" &&
          longestStreak >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "special":
        // Yeni badges.json yapısı: criteria.type === "special", criteria.special_type
        if (criteria.type === "special" && criteria.special_type) {
          // checkBadgesForActivity'de quizAttempt yok, bu yüzden sadece genel kontroller yapılabilir
          const postCount = await db.post.count({ where: { userId } });
          const courseCompletions = await db.lessonCompletion.findMany({
            where: { userId },
            distinct: ['lessonId'],
          });
          
          switch (criteria.special_type) {
            case "ilk kurs":
              if (courseCompletions.length === 1) {
                shouldEarn = true;
              }
              break;
            case "ilk post":
              if (postCount === 1) {
                shouldEarn = true;
              }
              break;
            // Diğer special_type'lar quizAttempt gerektirdiği için burada kontrol edilemez
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (
          criteria.type === "total_days_active" &&
          criteria.value
        ) {
          if (totalDaysActive >= criteria.value) {
            shouldEarn = true;
          }
        }
        break;
      case "daily_activities":
        if (criteria.type === "daily_activity" && criteria.daily) {
          // Aktivite tipine göre bugünkü aktiviteleri say
          let todayCount = 0;
          
          if (criteria.activity_type === "test") {
            const todayAttempts = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayAttempts;
          } else if (criteria.activity_type === "kurs") {
            const todayCompletions = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayCompletions;
          } else if (criteria.activity_type === "canlı kod" || criteria.activity_type === "canlı kodlama") {
            const todayLiveCoding = await db.liveCodingAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayLiveCoding;
          } else if (criteria.activity_type === "bugfix" || criteria.activity_type === "hata düzeltme") {
            const todayBugFix = await db.bugFixAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayBugFix;
          } else if (criteria.activity_type === "ders") {
            const todayLessons = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayLessons;
          } else if (criteria.activity_type === "quiz") {
            const todayQuizzes = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayQuizzes;
          } else if (criteria.activity_type === "pratik") {
            // Pratik: quiz attempt olarak sayılabilir
            const todayPratik = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayPratik;
          } else if (criteria.activity_type === "eğitim") {
            // Eğitim: lesson completion olarak sayılabilir
            const todayEgitim = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayEgitim;
          }
          
          if (todayCount >= criteria.count) {
            shouldEarn = true;
          }
        }
        break;
    }

    if (shouldEarn) {
      await db.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      newlyEarnedBadges.push(badge);
      earnedBadgeIds.add(badge.id);
    }
  }

  return {
    newlyEarnedBadges,
    totalEarned: newlyEarnedBadges.length,
  };
}

// Sosyal etkileşim rozetlerini kontrol eder
export async function checkSocialInteractionBadges({
  userId,
}: {
  userId: string;
}): Promise<BadgeCheckResult> {
  const allBadges = await db.badge.findMany({
    where: {
      category: "social_interaction",
    },
  });

  const userBadges = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const earnedBadgeIds = new Set(userBadges.map((ub: { badgeId: string }) => ub.badgeId));
  const newlyEarnedBadges: any[] = [];

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) {
      continue;
    }

    const criteria = badge.criteria as any;
    if (criteria.type !== "social_interaction") {
      continue;
    }

    let interactionCount = 0;

    if (criteria.interaction_type === "post") {
      interactionCount = await db.post.count({
        where: { userId },
      });
    } else if (criteria.interaction_type === "beğeni") {
      interactionCount = await db.postLike.count({
        where: { userId },
      });
    } else if (criteria.interaction_type === "yorum") {
      interactionCount = await db.postComment.count({
        where: { userId },
      });
    } else if (criteria.interaction_type === "story") {
      interactionCount = await db.story.count({
        where: { userId },
      });
    } else if (criteria.interaction_type === "arkadaş" || criteria.interaction_type === "takipçi") {
      interactionCount = await db.friendship.count({
        where: {
          OR: [
            { requesterId: userId, status: "accepted" },
            { addresseeId: userId, status: "accepted" },
          ],
        },
      });
    } else if (criteria.interaction_type === "paylaşım" || criteria.interaction_type === "etkileşim") {
      // Toplam sosyal etkileşim
      const posts = await db.post.count({ where: { userId } });
      const likes = await db.postLike.count({ where: { userId } });
      const comments = await db.postComment.count({ where: { userId } });
      interactionCount = posts + likes + comments;
    } else if (criteria.interaction_type === "topluluk") {
      // Topluluk: tüm sosyal etkileşimlerin toplamı
      const posts = await db.post.count({ where: { userId } });
      const likes = await db.postLike.count({ where: { userId } });
      const comments = await db.postComment.count({ where: { userId } });
      const stories = await db.story.count({ where: { userId } });
      interactionCount = posts + likes + comments + stories;
    } else if (criteria.interaction_type === "sosyal") {
      // Sosyal: tüm sosyal etkileşimlerin toplamı
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
      interactionCount = posts + likes + comments + stories + friendships;
    }

    if (interactionCount >= criteria.count) {
      await db.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      newlyEarnedBadges.push(badge);
      earnedBadgeIds.add(badge.id);
    }
  }

  return {
    newlyEarnedBadges,
    totalEarned: newlyEarnedBadges.length,
  };
}

// Kullanıcının tüm rozetlerini kontrol eder (quizAttemptId gerektirmez)
export async function checkAllUserBadges({
  userId,
}: {
  userId: string;
}): Promise<BadgeCheckResult> {
  const allBadges = await db.badge.findMany();
  const userBadges = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const earnedBadgeIds = new Set(userBadges.map((ub: { badgeId: string }) => ub.badgeId));
  const newlyEarnedBadges: any[] = [];

  // Kullanıcının tüm quiz attempt'lerini al
  const userQuizAttempts = await db.quizAttempt.findMany({
    where: { userId },
  });

  const totalQuizCount = userQuizAttempts.length;
  const averageScore =
    totalQuizCount > 0
      ? userQuizAttempts.reduce((sum: number, qa: { score: number }) => sum + qa.score, 0) / totalQuizCount
      : 0;

  // En yüksek tek test skorunu bul
  const maxSingleScore = userQuizAttempts.length > 0
    ? Math.max(...userQuizAttempts.map((qa: { score: number }) => qa.score))
    : 0;

  // Perfect score sayısını hesapla
  const perfectScoreCount = userQuizAttempts.filter(
    (qa: { score: number }) => qa.score === 100
  ).length;

  // Streak bilgilerini güncelle ve al
  const streakData = await updateUserStreak(userId);
  const newStreak = streakData.currentStreak;
  const longestStreak = streakData.longestStreak;
  const totalDaysActive = streakData.totalDaysActive;

  // Tüm rozetleri kontrol et
  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) {
      continue;
    }

    const criteria = badge.criteria as any;
    let shouldEarn = false;

    switch (badge.category) {
      case "test_count":
        if (
          criteria.type === "total_quizzes" &&
          totalQuizCount >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "score":
        // Yeni badges.json yapısı: criteria.type === "score", criteria.score_type, criteria.min_score
        if (criteria.type === "score" && criteria.score_type && criteria.min_score !== undefined) {
          const totalScore = userQuizAttempts.reduce((sum: number, qa: { score: number }) => sum + qa.score, 0);
          
          switch (criteria.score_type) {
            case "tek test":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "efsanevi":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "ortalama":
              if (averageScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "toplam":
              if (totalScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "mükemmel":
              if (maxSingleScore >= criteria.min_score || perfectScoreCount > 0) {
                shouldEarn = true;
              }
              break;
            case "yüksek":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "tutarlı":
              // Tutarlı skor: tüm skorların standart sapması düşük olmalı (basitleştirilmiş: ortalama yüksekse tutarlı sayılır)
              if (averageScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "başarılı":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
            case "harika":
              if (maxSingleScore >= criteria.min_score) {
                shouldEarn = true;
              }
              break;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (criteria.type === "average_score" && averageScore >= criteria.value) {
          shouldEarn = true;
        } else if (
          criteria.type === "single_score" &&
          maxSingleScore >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "perfect_score" &&
          maxSingleScore === 100
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "perfect_scores" &&
          criteria.value
        ) {
          if (perfectScoreCount >= criteria.value) {
            shouldEarn = true;
          }
        }
        break;
      case "streak":
        // Yeni badges.json yapısı: criteria.type === "streak", criteria.streak_type, criteria.days
        if (criteria.type === "streak" && criteria.streak_type && criteria.days !== undefined) {
          if (newStreak >= criteria.days) {
            shouldEarn = true;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (
          criteria.type === "current_streak" &&
          newStreak >= criteria.value
        ) {
          shouldEarn = true;
        } else if (
          criteria.type === "longest_streak" &&
          longestStreak >= criteria.value
        ) {
          shouldEarn = true;
        }
        break;
      case "topic":
        if (criteria.type === "topic_complete") {
          // Tüm konuları bul
          const allTopicsData = await db.quiz.findMany({
            select: { topic: true },
            distinct: ['topic'],
            where: { topic: { not: null } },
          });

          const allTopics = Array.from(
            new Set(allTopicsData.map((t: { topic: string | null }) => t.topic).filter(Boolean))
          ) as string[];

          let completedTopicsCount = 0;

          // Her konu için kontrol yap
          for (const topic of allTopics) {
            const topicQuizzes = await db.quiz.findMany({
              where: { topic },
            });

            if (topicQuizzes.length === 0) continue;

            const topicAttempts = await db.quizAttempt.findMany({
              where: {
                userId,
                quizId: { in: topicQuizzes.map((q: { id: string }) => q.id) },
              },
            });

            // Bu konudaki tüm quizleri tam puanla tamamladı mı?
            const allPerfect = topicQuizzes.every((tq: { id: string }) =>
              topicAttempts.some(
                (ta: { quizId: string; score: number }) => ta.quizId === tq.id && ta.score === 100
              )
            );

            if (allPerfect) {
              completedTopicsCount++;
            }
          }

          // Gerekli konu sayısını kontrol et
          const requiredCount = criteria.value || 1;
          if (completedTopicsCount >= requiredCount) {
            shouldEarn = true;
          }
        }
        break;
      case "special":
        // Yeni badges.json yapısı: criteria.type === "special", criteria.special_type
        if (criteria.type === "special" && criteria.special_type) {
          const postCount = await db.post.count({ where: { userId } });
          const courseCompletions = await db.lessonCompletion.findMany({
            where: { userId },
            distinct: ['lessonId'],
          });
          const fastestAttempt = userQuizAttempts
            .filter((qa: { duration: number | null }) => qa.duration !== null)
            .sort((a: { duration: number }, b: { duration: number }) => a.duration - b.duration)[0];
          
          switch (criteria.special_type) {
            case "ilk test":
              if (totalQuizCount === 1) {
                shouldEarn = true;
              }
              break;
            case "ilk kurs":
              if (courseCompletions.length === 1) {
                shouldEarn = true;
              }
              break;
            case "ilk post":
              if (postCount === 1) {
                shouldEarn = true;
              }
              break;
            case "hızlı tamamlama":
              if (fastestAttempt && fastestAttempt.duration <= 300) { // 5 dakika
                shouldEarn = true;
              }
              break;
            case "mükemmel performans":
              if (maxSingleScore === 100) {
                shouldEarn = true;
              }
              break;
            case "özel kombinasyon":
              // Özel kombinasyon: yüksek skor + hızlı tamamlama
              if (maxSingleScore >= 90 && fastestAttempt && fastestAttempt.duration <= 600) {
                shouldEarn = true;
              }
              break;
            case "nadir başarı":
              // Nadir başarı: perfect score
              if (maxSingleScore === 100) {
                shouldEarn = true;
              }
              break;
            case "efsanevi an":
              // Efsanevi an: perfect score + çok hızlı
              if (maxSingleScore === 100 && fastestAttempt && fastestAttempt.duration <= 300) {
                shouldEarn = true;
              }
              break;
            case "tarihi başarı":
              // Tarihi başarı: ilk perfect score
              if (maxSingleScore === 100 && perfectScoreCount === 1) {
                shouldEarn = true;
              }
              break;
            case "benzersiz başarı":
              // Benzersiz başarı: çok yüksek skor
              if (maxSingleScore >= 95) {
                shouldEarn = true;
              }
              break;
          }
        }
        // Eski yapı desteği (geriye dönük uyumluluk)
        else if (criteria.type === "first_quiz" && totalQuizCount >= 1) {
          shouldEarn = true;
        } else if (
          criteria.type === "fast_completion" &&
          criteria.value
        ) {
          // En hızlı tamamlanan testi kontrol et
          const fastestAttempt = userQuizAttempts
            .filter((qa: { duration: number | null }) => qa.duration !== null)
            .sort((a: { duration: number }, b: { duration: number }) => a.duration - b.duration)[0];
          
          if (fastestAttempt && fastestAttempt.duration <= criteria.value) {
            shouldEarn = true;
          }
        } else if (
          criteria.type === "total_days_active" &&
          criteria.value
        ) {
          if (totalDaysActive >= criteria.value) {
            shouldEarn = true;
          }
        } else if (criteria.type === "special") {
          // Özel başarı rozetleri için genel kontrol
          shouldEarn = true; // Bu daha spesifik kontrol gerektirebilir
        }
        break;
      case "daily_activities":
        if (criteria.type === "daily_activity" && criteria.daily) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Bugünkü aktiviteleri say
          let todayCount = 0;
          
          if (criteria.activity_type === "test") {
            const todayAttempts = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayAttempts;
          } else if (criteria.activity_type === "kurs") {
            const todayCompletions = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayCompletions;
          } else if (criteria.activity_type === "canlı kod" || criteria.activity_type === "canlı kodlama") {
            const todayLiveCoding = await db.liveCodingAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayLiveCoding;
          } else if (criteria.activity_type === "bugfix" || criteria.activity_type === "hata düzeltme") {
            const todayBugFix = await db.bugFixAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayBugFix;
          } else if (criteria.activity_type === "ders") {
            const todayLessons = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayLessons;
          } else if (criteria.activity_type === "quiz") {
            const todayQuizzes = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayQuizzes;
          } else if (criteria.activity_type === "pratik") {
            // Pratik: quiz attempt olarak sayılabilir
            const todayPratik = await db.quizAttempt.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayPratik;
          } else if (criteria.activity_type === "eğitim") {
            // Eğitim: lesson completion olarak sayılabilir
            const todayEgitim = await db.lessonCompletion.count({
              where: {
                userId,
                completedAt: {
                  gte: today,
                },
              },
            });
            todayCount = todayEgitim;
          }
          
          if (todayCount >= criteria.count) {
            shouldEarn = true;
          }
        }
        break;
      case "social_interaction":
        if (criteria.type === "social_interaction") {
          let interactionCount = 0;
          
          if (criteria.interaction_type === "post") {
            interactionCount = await db.post.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "beğeni") {
            interactionCount = await db.postLike.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "yorum") {
            interactionCount = await db.postComment.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "story") {
            interactionCount = await db.story.count({
              where: { userId },
            });
          } else if (criteria.interaction_type === "arkadaş" || criteria.interaction_type === "takipçi") {
            interactionCount = await db.friendship.count({
              where: {
                OR: [
                  { requesterId: userId, status: "accepted" },
                  { addresseeId: userId, status: "accepted" },
                ],
              },
            });
          } else if (criteria.interaction_type === "paylaşım" || criteria.interaction_type === "etkileşim") {
            // Toplam sosyal etkileşim
            const posts = await db.post.count({ where: { userId } });
            const likes = await db.postLike.count({ where: { userId } });
            const comments = await db.postComment.count({ where: { userId } });
            interactionCount = posts + likes + comments;
          } else if (criteria.interaction_type === "topluluk") {
            // Topluluk: tüm sosyal etkileşimlerin toplamı
            const posts = await db.post.count({ where: { userId } });
            const likes = await db.postLike.count({ where: { userId } });
            const comments = await db.postComment.count({ where: { userId } });
            const stories = await db.story.count({ where: { userId } });
            interactionCount = posts + likes + comments + stories;
          } else if (criteria.interaction_type === "sosyal") {
            // Sosyal: tüm sosyal etkileşimlerin toplamı
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
            interactionCount = posts + likes + comments + stories + friendships;
          }
          
          if (interactionCount >= criteria.count) {
            shouldEarn = true;
          }
        }
        break;
    }

    if (shouldEarn) {
      await db.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      newlyEarnedBadges.push(badge);
      earnedBadgeIds.add(badge.id);
    }
  }

  return {
    newlyEarnedBadges,
    totalEarned: newlyEarnedBadges.length,
  };
}

