/* eslint-disable no-console */
import { db } from "@/lib/db";

async function checkStatus() {
  try {
    const email = "yusufislamyetkin@hotmail.com";
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ Kullanıcı bulunamadı");
      return;
    }

    console.log(`✅ Kullanıcı bulundu: ${user.id} (${user.name || user.email})`);
    console.log(`   Oluşturulma: ${user.createdAt}`);

    // Aktivite sayılarını kontrol et
    const quizAttempts = await db.quizAttempt.count({ where: { userId: user.id } });
    const posts = await db.post.count({ where: { userId: user.id } });
    const postLikes = await db.postLike.count({ where: { userId: user.id } });
    const postComments = await db.postComment.count({ where: { userId: user.id } });
    const stories = await db.story.count({ where: { userId: user.id } });
    const lessonCompletions = await db.lessonCompletion.count({ where: { userId: user.id } });
    const liveCodingAttempts = await db.liveCodingAttempt.count({ where: { userId: user.id } });
    const bugFixAttempts = await db.bugFixAttempt.count({ where: { userId: user.id } });
    const friendships = await db.friendship.count({
      where: {
        OR: [
          { requesterId: user.id },
          { addresseeId: user.id },
        ],
        status: "accepted",
      },
    });

    const userBadges = await db.userBadge.count({ where: { userId: user.id } });
    const allBadges = await db.badge.count();

    const streak = await db.userStreak.findUnique({
      where: { userId: user.id },
    });

    console.log(`\n📊 Aktivite Durumu:`);
    console.log(`   Quiz Attempts: ${quizAttempts}`);
    console.log(`   Posts: ${posts}`);
    console.log(`   Post Likes: ${postLikes}`);
    console.log(`   Post Comments: ${postComments}`);
    console.log(`   Stories: ${stories}`);
    console.log(`   Lesson Completions: ${lessonCompletions}`);
    console.log(`   Live Coding Attempts: ${liveCodingAttempts}`);
    console.log(`   Bug Fix Attempts: ${bugFixAttempts}`);
    console.log(`   Friendships: ${friendships}`);

    console.log(`\n🏅 Rozet Durumu:`);
    console.log(`   Toplam Rozet: ${allBadges}`);
    console.log(`   Kazanılan Rozet: ${userBadges}`);

    if (streak) {
      console.log(`\n🔥 Streak Durumu:`);
      console.log(`   Current Streak: ${streak.currentStreak}`);
      console.log(`   Longest Streak: ${streak.longestStreak}`);
      console.log(`   Total Days Active: ${streak.totalDaysActive}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

checkStatus();

