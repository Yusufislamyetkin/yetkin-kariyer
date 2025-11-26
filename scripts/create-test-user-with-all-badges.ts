/* eslint-disable no-console */
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { checkAllUserBadges } from "@/app/api/badges/check/badge-service";

const TEST_USER_EMAIL = "yusufislamyetkin@hotmail.com";
const TEST_USER_PASSWORD = "test123456";

interface BadgeData {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  tier: string;
  rarity: string;
  points: number;
  criteria: any;
}

// Tarih yardımcı fonksiyonları
function daysAgo(numDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - numDays);
  return d;
}

function randomDateBetween(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const rand = startMs + Math.random() * (endMs - startMs);
  return new Date(rand);
}

// Rozetleri JSON'dan yükle
function loadBadgesFromJson(): BadgeData[] {
  const badgesPath = path.join(process.cwd(), "public", "data", "badges.json");
  const badgesContent = fs.readFileSync(badgesPath, "utf-8");
  const badgesData = JSON.parse(badgesContent);
  return badgesData.badges;
}

// Kullanıcı oluştur veya bul
async function findOrCreateUser() {
  let user = await db.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 10);
    const oneYearAgo = daysAgo(365);
    
    user = await db.user.create({
      data: {
        email: TEST_USER_EMAIL,
        password: hashedPassword,
        name: "Yusuf İslam Yetkin",
        role: "candidate",
        createdAt: oneYearAgo,
      },
    });
    console.log(`✅ Kullanıcı oluşturuldu: ${user.id}`);
  } else {
    // Kullanıcı varsa, createdAt'i geçmişe al
    const oneYearAgo = daysAgo(365);
    user = await db.user.update({
      where: { id: user.id },
      data: { createdAt: oneYearAgo },
    });
    console.log(`✅ Kullanıcı bulundu: ${user.id}`);
  }

  return user;
}

// Rozetleri veritabanına yükle
async function loadBadgesToDatabase(badges: BadgeData[]) {
  console.log(`\n📦 ${badges.length} rozet veritabanına yükleniyor...`);
  
  let created = 0;
  let updated = 0;

  for (const badgeData of badges) {
    const existing = await db.badge.findFirst({
      where: {
        OR: [
          { key: badgeData.key },
          { id: badgeData.id },
        ],
      },
    });

    if (existing) {
      await db.badge.update({
        where: { id: existing.id },
        data: {
          name: badgeData.name,
          description: badgeData.description,
          icon: badgeData.icon,
          color: badgeData.color,
          category: badgeData.category as any,
          tier: badgeData.tier as any,
          rarity: badgeData.rarity as any,
          points: badgeData.points,
          criteria: badgeData.criteria,
          key: badgeData.key,
        },
      });
      updated++;
    } else {
      await db.badge.create({
        data: {
          id: badgeData.id,
          key: badgeData.key,
          name: badgeData.name,
          description: badgeData.description,
          icon: badgeData.icon,
          color: badgeData.color,
          category: badgeData.category as any,
          tier: badgeData.tier as any,
          rarity: badgeData.rarity as any,
          points: badgeData.points,
          criteria: badgeData.criteria,
        },
      });
      created++;
    }
  }

  console.log(`✅ ${created} rozet oluşturuldu, ${updated} rozet güncellendi`);
}

// İlk aktivite verilerini oluştur
async function createInitialActivities(userId: string) {
  console.log(`\n🎯 İlk aktivite verileri oluşturuluyor...`);
  
  const now = new Date();
  const oneYearAgo = daysAgo(365);
  const sixMonthsAgo = daysAgo(180);

  // Quiz'leri bul veya oluştur
  const existingQuizzes = await db.quiz.findMany({ take: 50 });
  let quizIds: string[] = [];

  if (existingQuizzes.length > 0) {
    quizIds = existingQuizzes.map(q => q.id);
  } else {
    // Eğer quiz yoksa, test için birkaç quiz oluştur
    for (let i = 0; i < 50; i++) {
      const quiz = await db.quiz.create({
        data: {
          title: `Test Quiz ${i + 1}`,
          description: `Test quiz açıklaması ${i + 1}`,
          type: "TEST",
          level: "intermediate",
          questions: { questions: [] },
          passingScore: 60,
        },
      });
      quizIds.push(quiz.id);
    }
  }

  // Quiz attempts oluştur (yüksek skorlu)
  const quizAttempts = [];
  for (let i = 0; i < 100; i++) {
    const quizId = quizIds[i % quizIds.length];
    const completedAt = randomDateBetween(oneYearAgo, now);
    const score = Math.random() < 0.3 ? 100 : Math.floor(Math.random() * 20) + 80; // %30 perfect score, geri kalanı 80-99
    
    quizAttempts.push({
      userId,
      quizId,
      score,
      answers: { answered: 10, correct: Math.round(score / 10) },
      duration: Math.floor(Math.random() * 1200) + 300,
      completedAt,
    });
  }
  
  await db.quizAttempt.createMany({ data: quizAttempts });
  console.log(`✅ ${quizAttempts.length} quiz attempt oluşturuldu`);

  // Lesson completions oluştur
  const lessonCompletions = [];
  for (let i = 0; i < 50; i++) {
    lessonCompletions.push({
      userId,
      lessonSlug: `lesson-${i + 1}`,
      completedAt: randomDateBetween(sixMonthsAgo, now),
    });
  }
  
  await db.lessonCompletion.createMany({ data: lessonCompletions });
  console.log(`✅ ${lessonCompletions.length} lesson completion oluşturuldu`);

  // Posts oluştur
  const posts = [];
  for (let i = 0; i < 50; i++) {
    posts.push({
      userId,
      content: `Test post içeriği ${i + 1}`,
      createdAt: randomDateBetween(sixMonthsAgo, now),
    });
  }
  
  const createdPosts = await Promise.all(
    posts.map(post => db.post.create({ data: post }))
  );
  console.log(`✅ ${createdPosts.length} post oluşturuldu`);

  // Post likes oluştur (başka kullanıcıların postlarına beğeni)
  const allPosts = await db.post.findMany({ take: 100 });
  if (allPosts.length > 0) {
    const likes = [];
    for (let i = 0; i < 100; i++) {
      const post = allPosts[i % allPosts.length];
      if (post.userId !== userId) {
        likes.push({
          userId,
          postId: post.id,
          createdAt: randomDateBetween(sixMonthsAgo, now),
        });
      }
    }
    
    // Unique constraint için mevcut beğenileri kontrol et
    for (const like of likes) {
      try {
        await db.postLike.create({ data: like });
      } catch (e) {
        // Zaten varsa atla
      }
    }
    console.log(`✅ Post likes eklendi`);
  }

  // Post comments oluştur
  if (allPosts.length > 0) {
    const comments = [];
    for (let i = 0; i < 100; i++) {
      const post = allPosts[i % allPosts.length];
      comments.push({
        userId,
        postId: post.id,
        content: `Test yorum ${i + 1}`,
        createdAt: randomDateBetween(sixMonthsAgo, now),
      });
    }
    
    await db.postComment.createMany({ data: comments });
    console.log(`✅ ${comments.length} post comment oluşturuldu`);
  }

  // Stories oluştur
  const stories = [];
  for (let i = 0; i < 50; i++) {
    stories.push({
      userId,
      content: `Test story ${i + 1}`,
      createdAt: randomDateBetween(sixMonthsAgo, now),
    });
  }
  
  await db.story.createMany({ data: stories });
  console.log(`✅ ${stories.length} story oluşturuldu`);

  // Live coding attempts
  const liveCodingChallenges = await db.liveCodingChallenge.findMany({ take: 20 });
  if (liveCodingChallenges.length > 0) {
    const liveAttempts = [];
    for (let i = 0; i < 30; i++) {
      const challenge = liveCodingChallenges[i % liveCodingChallenges.length];
      liveAttempts.push({
        userId,
        quizId: challenge.id,
        metrics: {
          codeQuality: Math.floor(Math.random() * 20) + 80,
          completionTime: Math.floor(Math.random() * 1200) + 300,
          testsPassed: Math.floor(Math.random() * 5) + 5,
        },
        completedAt: randomDateBetween(sixMonthsAgo, now),
      });
    }
    
    await db.liveCodingAttempt.createMany({ data: liveAttempts });
    console.log(`✅ ${liveAttempts.length} live coding attempt oluşturuldu`);
  }

  // Bug fix attempts
  const bugFixChallenges = await db.bugFixChallenge.findMany({ take: 20 });
  if (bugFixChallenges.length > 0) {
    const bugFixAttempts = [];
    for (let i = 0; i < 30; i++) {
      const challenge = bugFixChallenges[i % bugFixChallenges.length];
      bugFixAttempts.push({
        userId,
        quizId: challenge.id,
        metrics: {
          bugsFixed: Math.floor(Math.random() * 3) + 1,
          codeQuality: Math.floor(Math.random() * 20) + 80,
        },
        completedAt: randomDateBetween(sixMonthsAgo, now),
      });
    }
    
    await db.bugFixAttempt.createMany({ data: bugFixAttempts });
    console.log(`✅ ${bugFixAttempts.length} bug fix attempt oluşturuldu`);
  }

  // Friendships oluştur
  const otherUsers = await db.user.findMany({
    where: { id: { not: userId } },
    take: 100,
  });
  
  if (otherUsers.length > 0) {
    const friendships = [];
    for (let i = 0; i < Math.min(50, otherUsers.length); i++) {
      const otherUser = otherUsers[i];
      friendships.push({
        requesterId: userId,
        addresseeId: otherUser.id,
        status: "accepted",
        createdAt: randomDateBetween(sixMonthsAgo, now),
      });
    }
    
    // Unique constraint için mevcut arkadaşlıkları kontrol et
    for (const friendship of friendships) {
      try {
        await db.friendship.create({ data: friendship });
      } catch (e) {
        // Zaten varsa atla
      }
    }
    console.log(`✅ Friendships eklendi`);
  }
}

// Streak verilerini güncelle
async function updateStreak(userId: string) {
  console.log(`\n🔥 Streak verileri güncelleniyor...`);
  
  const streak = await db.userStreak.findUnique({
    where: { userId },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = daysAgo(1);
  yesterday.setHours(0, 0, 0, 0);

  if (streak) {
    await db.userStreak.update({
      where: { userId },
      data: {
        currentStreak: 400,
        longestStreak: 500,
        totalDaysActive: 600,
        lastActivityDate: yesterday,
      },
    });
    console.log(`✅ Streak güncellendi`);
  } else {
    await db.userStreak.create({
      data: {
        userId,
        currentStreak: 400,
        longestStreak: 500,
        totalDaysActive: 600,
        lastActivityDate: yesterday,
      },
    });
    console.log(`✅ Streak oluşturuldu`);
  }
}

// Rozet gerekliliklerini analiz et
function analyzeBadgeRequirements(missingBadges: any[]): {
  needsMoreQuizzes: number;
  needsMorePosts: number;
  needsMoreLikes: number;
  needsMoreComments: number;
  needsMoreStories: number;
  needsMoreFriendships: number;
  needsHigherScore: boolean;
  needsMoreStreak: number;
  needsDailyActivities: { [key: string]: number };
} {
  const analysis = {
    needsMoreQuizzes: 0,
    needsMorePosts: 0,
    needsMoreLikes: 0,
    needsMoreComments: 0,
    needsMoreStories: 0,
    needsMoreFriendships: 0,
    needsHigherScore: false,
    needsMoreStreak: 0,
    needsDailyActivities: {} as { [key: string]: number },
  };

  for (const badge of missingBadges) {
    const criteria = badge.criteria as any;
    
    if (badge.category === "test_count") {
      if (criteria.type === "total_quizzes" && criteria.value) {
        analysis.needsMoreQuizzes = Math.max(analysis.needsMoreQuizzes, criteria.value);
      }
    }
    
    if (badge.category === "score") {
      if (criteria.type === "score" && criteria.min_score) {
        if (criteria.min_score >= 90) {
          analysis.needsHigherScore = true;
        }
      }
    }
    
    if (badge.category === "streak") {
      if (criteria.type === "streak" && criteria.days) {
        analysis.needsMoreStreak = Math.max(analysis.needsMoreStreak, criteria.days);
      }
    }
    
    if (badge.category === "social_interaction") {
      if (criteria.type === "social_interaction") {
        if (criteria.interaction_type === "post" && criteria.count) {
          analysis.needsMorePosts = Math.max(analysis.needsMorePosts, criteria.count);
        }
        if (criteria.interaction_type === "beğeni" && criteria.count) {
          analysis.needsMoreLikes = Math.max(analysis.needsMoreLikes, criteria.count);
        }
        if (criteria.interaction_type === "yorum" && criteria.count) {
          analysis.needsMoreComments = Math.max(analysis.needsMoreComments, criteria.count);
        }
        if (criteria.interaction_type === "story" && criteria.count) {
          analysis.needsMoreStories = Math.max(analysis.needsMoreStories, criteria.count);
        }
        if ((criteria.interaction_type === "arkadaş" || criteria.interaction_type === "takipçi") && criteria.count) {
          analysis.needsMoreFriendships = Math.max(analysis.needsMoreFriendships, criteria.count);
        }
      }
    }
    
    if (badge.category === "daily_activities") {
      if (criteria.type === "daily_activity" && criteria.activity_type && criteria.count) {
        const activityType = criteria.activity_type;
        if (!analysis.needsDailyActivities[activityType]) {
          analysis.needsDailyActivities[activityType] = 0;
        }
        analysis.needsDailyActivities[activityType] = Math.max(
          analysis.needsDailyActivities[activityType],
          criteria.count
        );
      }
    }
  }

  return analysis;
}

// Eksik aktiviteleri ekle
async function addMissingActivities(
  userId: string,
  analysis: ReturnType<typeof analyzeBadgeRequirements>
) {
  console.log(`\n➕ Eksik aktiviteler ekleniyor...`);
  
  const now = new Date();
  const oneYearAgo = daysAgo(365);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Quiz attempts ekle
  if (analysis.needsMoreQuizzes > 0) {
    const currentCount = await db.quizAttempt.count({ where: { userId } });
    const needed = Math.max(0, analysis.needsMoreQuizzes - currentCount + 10); // Biraz fazla ekle
    
    if (needed > 0) {
      const quizzes = await db.quiz.findMany({ take: 50 });
      if (quizzes.length > 0) {
        const newAttempts = [];
        for (let i = 0; i < needed; i++) {
          const quiz = quizzes[i % quizzes.length];
          newAttempts.push({
            userId,
            quizId: quiz.id,
            score: 100,
            answers: { answered: 10, correct: 10 },
            duration: 600,
            completedAt: randomDateBetween(oneYearAgo, now),
          });
        }
        await db.quizAttempt.createMany({ data: newAttempts });
        console.log(`✅ ${newAttempts.length} ek quiz attempt eklendi`);
      }
    }
  }

  // Posts ekle
  if (analysis.needsMorePosts > 0) {
    const currentCount = await db.post.count({ where: { userId } });
    const needed = Math.max(0, analysis.needsMorePosts - currentCount + 10);
    
    if (needed > 0) {
      const newPosts = [];
      for (let i = 0; i < needed; i++) {
        newPosts.push({
          userId,
          content: `Test post ${i + 1}`,
          createdAt: randomDateBetween(oneYearAgo, now),
        });
      }
      await db.post.createMany({ data: newPosts });
      console.log(`✅ ${newPosts.length} ek post eklendi`);
    }
  }

  // Likes ekle
  if (analysis.needsMoreLikes > 0) {
    const currentCount = await db.postLike.count({ where: { userId } });
    const needed = Math.max(0, analysis.needsMoreLikes - currentCount + 10);
    
    if (needed > 0) {
      const allPosts = await db.post.findMany({ take: 500 });
      if (allPosts.length > 0) {
        const newLikes = [];
        for (let i = 0; i < needed; i++) {
          const post = allPosts[i % allPosts.length];
          if (post.userId !== userId) {
            newLikes.push({
              userId,
              postId: post.id,
              createdAt: randomDateBetween(oneYearAgo, now),
            });
          }
        }
        
        for (const like of newLikes) {
          try {
            await db.postLike.create({ data: like });
          } catch (e) {
            // Zaten varsa atla
          }
        }
        console.log(`✅ Post likes eklendi`);
      }
    }
  }

  // Comments ekle
  if (analysis.needsMoreComments > 0) {
    const currentCount = await db.postComment.count({ where: { userId } });
    const needed = Math.max(0, analysis.needsMoreComments - currentCount + 10);
    
    if (needed > 0) {
      const allPosts = await db.post.findMany({ take: 500 });
      if (allPosts.length > 0) {
        const newComments = [];
        for (let i = 0; i < needed; i++) {
          const post = allPosts[i % allPosts.length];
          newComments.push({
            userId,
            postId: post.id,
            content: `Test yorum ${i + 1}`,
            createdAt: randomDateBetween(oneYearAgo, now),
          });
        }
        await db.postComment.createMany({ data: newComments });
        console.log(`✅ ${newComments.length} ek post comment eklendi`);
      }
    }
  }

  // Stories ekle
  if (analysis.needsMoreStories > 0) {
    const currentCount = await db.story.count({ where: { userId } });
    const needed = Math.max(0, analysis.needsMoreStories - currentCount + 10);
    
    if (needed > 0) {
      const newStories = [];
      for (let i = 0; i < needed; i++) {
        newStories.push({
          userId,
          content: `Test story ${i + 1}`,
          createdAt: randomDateBetween(oneYearAgo, now),
        });
      }
      await db.story.createMany({ data: newStories });
      console.log(`✅ ${newStories.length} ek story eklendi`);
    }
  }

  // Friendships ekle
  if (analysis.needsMoreFriendships > 0) {
    const currentCount = await db.friendship.count({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
        status: "accepted",
      },
    });
    const needed = Math.max(0, analysis.needsMoreFriendships - currentCount + 10);
    
    if (needed > 0) {
      const otherUsers = await db.user.findMany({
        where: { id: { not: userId } },
        take: needed + 50,
      });
      
      if (otherUsers.length > 0) {
        const newFriendships = [];
        for (let i = 0; i < needed && i < otherUsers.length; i++) {
          const otherUser = otherUsers[i];
          newFriendships.push({
            requesterId: userId,
            addresseeId: otherUser.id,
            status: "accepted",
            createdAt: randomDateBetween(oneYearAgo, now),
          });
        }
        
        for (const friendship of newFriendships) {
          try {
            await db.friendship.create({ data: friendship });
          } catch (e) {
            // Zaten varsa atla
          }
        }
        console.log(`✅ Friendships eklendi`);
      }
    }
  }

  // Streak güncelle
  if (analysis.needsMoreStreak > 0) {
    await db.userStreak.update({
      where: { userId },
      data: {
        currentStreak: Math.max(analysis.needsMoreStreak + 10, 500),
        longestStreak: Math.max(analysis.needsMoreStreak + 10, 600),
      },
    });
    console.log(`✅ Streak güncellendi: ${analysis.needsMoreStreak + 10}`);
  }

  // Günlük aktiviteler ekle
  if (Object.keys(analysis.needsDailyActivities).length > 0) {
    for (const [activityType, count] of Object.entries(analysis.needsDailyActivities)) {
      // Bugün için günlük aktivite verileri oluştur
      if (activityType === "test" || activityType === "quiz" || activityType === "pratik") {
        const quizzes = await db.quiz.findMany({ take: count + 10 });
        if (quizzes.length > 0) {
          const attempts = [];
          for (let i = 0; i < count; i++) {
            attempts.push({
              userId,
              quizId: quizzes[i % quizzes.length].id,
              score: 100,
              answers: { answered: 10, correct: 10 },
              duration: 600,
              completedAt: today,
            });
          }
          await db.quizAttempt.createMany({ data: attempts });
          console.log(`✅ ${count} ${activityType} bugün için eklendi`);
        }
      } else if (activityType === "kurs" || activityType === "ders" || activityType === "eğitim") {
        const completions = [];
        for (let i = 0; i < count; i++) {
          completions.push({
            userId,
            lessonSlug: `lesson-${i + 1}`,
            completedAt: today,
          });
        }
        await db.lessonCompletion.createMany({ data: completions });
        console.log(`✅ ${count} ${activityType} bugün için eklendi`);
      } else if (activityType === "canlı kod" || activityType === "canlı kodlama") {
        const challenges = await db.liveCodingChallenge.findMany({ take: count + 10 });
        if (challenges.length > 0) {
          const attempts = [];
          for (let i = 0; i < count; i++) {
            attempts.push({
              userId,
              quizId: challenges[i % challenges.length].id,
              metrics: { codeQuality: 90, completionTime: 600, testsPassed: 5 },
              completedAt: today,
            });
          }
          await db.liveCodingAttempt.createMany({ data: attempts });
          console.log(`✅ ${count} ${activityType} bugün için eklendi`);
        }
      } else if (activityType === "bugfix" || activityType === "hata düzeltme") {
        const challenges = await db.bugFixChallenge.findMany({ take: count + 10 });
        if (challenges.length > 0) {
          const attempts = [];
          for (let i = 0; i < count; i++) {
            attempts.push({
              userId,
              quizId: challenges[i % challenges.length].id,
              metrics: { bugsFixed: 1, codeQuality: 90 },
              completedAt: today,
            });
          }
          await db.bugFixAttempt.createMany({ data: attempts });
          console.log(`✅ ${count} ${activityType} bugün için eklendi`);
        }
      }
    }
  }
}

// Ana fonksiyon
async function main() {
  try {
    console.log("🚀 Test kullanıcısı ve rozet profili oluşturuluyor...\n");

    // 1. Kullanıcı oluştur/bul
    const user = await findOrCreateUser();
    const userId = user.id;

    // 2. Rozetleri yükle
    const badges = loadBadgesFromJson();
    await loadBadgesToDatabase(badges);

    // 3. İlk aktiviteleri oluştur
    await createInitialActivities(userId);

    // 4. Streak güncelle
    await updateStreak(userId);

    // 5. İlk rozet kontrolü
    console.log(`\n🔍 İlk rozet kontrolü yapılıyor...`);
    const firstCheck = await checkAllUserBadges({ userId });
    const allBadges = await db.badge.findMany();
    const userBadges = await db.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
    const missingBadges = allBadges.filter(b => !earnedBadgeIds.has(b.id));
    
    console.log(`📊 İlk kontrol sonuçları:`);
    console.log(`   - Toplam rozet: ${allBadges.length}`);
    console.log(`   - Kazanılan rozet: ${earnedBadgeIds.size}`);
    console.log(`   - Eksik rozet: ${missingBadges.length}`);
    console.log(`   - Yeni kazanılan: ${firstCheck.totalEarned}`);

    // 6. Eksik rozetleri analiz et ve aktiviteleri ekle
    if (missingBadges.length > 0) {
      console.log(`\n📋 Eksik rozetler analiz ediliyor...`);
      const analysis = analyzeBadgeRequirements(missingBadges);
      console.log(`   Analiz sonuçları:`, analysis);
      
      await addMissingActivities(userId, analysis);

      // 7. Tekrar kontrol et
      console.log(`\n🔍 Tekrar rozet kontrolü yapılıyor...`);
      const secondCheck = await checkAllUserBadges({ userId });
      const userBadgesAfter = await db.userBadge.findMany({
        where: { userId },
        select: { badgeId: true },
      });
      const earnedBadgeIdsAfter = new Set(userBadgesAfter.map(ub => ub.badgeId));
      const missingBadgesAfter = allBadges.filter(b => !earnedBadgeIdsAfter.has(b.id));
      
      console.log(`📊 İkinci kontrol sonuçları:`);
      console.log(`   - Kazanılan rozet: ${earnedBadgeIdsAfter.size}`);
      console.log(`   - Eksik rozet: ${missingBadgesAfter.length}`);
      console.log(`   - Yeni kazanılan: ${secondCheck.totalEarned}`);

      // 8. Final rapor
      console.log(`\n📝 Final Rapor:`);
      console.log(`   - Toplam rozet: ${allBadges.length}`);
      console.log(`   - Kazanılan rozet: ${earnedBadgeIdsAfter.size}`);
      console.log(`   - Eksik rozet: ${missingBadgesAfter.length}`);
      
      if (missingBadgesAfter.length > 0) {
        console.log(`\n⚠️  Hala kazanılamayan rozetler:`);
        for (const badge of missingBadgesAfter.slice(0, 10)) {
          console.log(`   - ${badge.key}: ${badge.description}`);
        }
        if (missingBadgesAfter.length > 10) {
          console.log(`   ... ve ${missingBadgesAfter.length - 10} rozet daha`);
        }
      } else {
        console.log(`\n✅ Tüm rozetler başarıyla kazanıldı!`);
      }
    } else {
      console.log(`\n✅ Tüm rozetler zaten kazanılmış!`);
    }

    console.log(`\n✨ İşlem tamamlandı!`);
    console.log(`   Kullanıcı email: ${TEST_USER_EMAIL}`);
    console.log(`   Kullanıcı şifre: ${TEST_USER_PASSWORD}`);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

main();

