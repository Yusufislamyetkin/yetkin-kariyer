import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[RESET_USER_ACTIONS] Starting user actions reset...");

    // Use transaction to ensure atomicity
    const results = await db.$transaction(async (tx: any) => {
      const stats: Record<string, number> = {};

      // Test/Quiz denemeleri
      stats.testAttempts = await tx.testAttempt.deleteMany({}).then((r: any) => r.count);
      stats.quizAttempts = await tx.quizAttempt.deleteMany({}).then((r: any) => r.count);
      stats.liveCodingAttempts = await tx.liveCodingAttempt.deleteMany({}).then((r: any) => r.count);
      stats.bugFixAttempts = await tx.bugFixAttempt.deleteMany({}).then((r: any) => r.count);
      stats.hackatonAttempts = await tx.hackatonAttempt.deleteMany({}).then((r: any) => r.count);
      stats.lessonMiniTestAttempts = await tx.lessonMiniTestAttempt.deleteMany({}).then((r: any) => r.count);

      // Ders tamamlamaları
      stats.lessonCompletions = await tx.lessonCompletion.deleteMany({}).then((r: any) => r.count);

      // Yanlış sorular
      stats.wrongQuestions = await tx.wrongQuestion.deleteMany({}).then((r: any) => r.count);

      // Gamification
      stats.gamificationEvents = await tx.gamificationEvent.deleteMany({}).then((r: any) => r.count);
      stats.pointTransactions = await tx.pointTransaction.deleteMany({}).then((r: any) => r.count);
      stats.questProgress = await tx.questProgress.deleteMany({}).then((r: any) => r.count);
      
      // User balances - reset points, lifetimeXp, and level
      const userBalances = await tx.userBalance.findMany({});
      for (const balance of userBalances) {
        await tx.userBalance.update({
          where: { userId: balance.userId },
          data: {
            points: 0,
            lifetimeXp: 0,
            level: 1,
          },
        });
      }
      stats.userBalancesReset = userBalances.length;

      // Leaderboard entries
      stats.leaderboardEntries = await tx.leaderboardEntry.deleteMany({}).then((r: any) => r.count);
      stats.testLeaderboardEntries = await tx.testLeaderboardEntry.deleteMany({}).then((r: any) => r.count);
      stats.liveCodingLeaderboardEntries = await tx.liveCodingLeaderboardEntry.deleteMany({}).then((r: any) => r.count);
      stats.bugFixLeaderboardEntries = await tx.bugFixLeaderboardEntry.deleteMany({}).then((r: any) => r.count);
      stats.hackatonLeaderboardEntries = await tx.hackatonLeaderboardEntry.deleteMany({}).then((r: any) => r.count);

      // Hedefler
      stats.dailyGoals = await tx.dailyGoal.deleteMany({}).then((r: any) => r.count);
      stats.dashboardGoalPlans = await tx.dashboardGoalPlan.deleteMany({}).then((r: any) => r.count);

      // Streak
      stats.userStreaks = await tx.userStreak.deleteMany({}).then((r: any) => r.count);

      // İş başvuruları
      stats.jobApplications = await tx.jobApplication.deleteMany({}).then((r: any) => r.count);

      // Freelancer
      stats.freelancerBids = await tx.freelancerBid.deleteMany({}).then((r: any) => r.count);

      // Kariyer planları
      stats.careerPlans = await tx.careerPlan.deleteMany({}).then((r: any) => r.count);
      stats.learningPaths = await tx.learningPath.deleteMany({}).then((r: any) => r.count);

      // Threads
      stats.assistantThreads = await tx.assistantThread.deleteMany({}).then((r: any) => r.count);
      stats.lessonThreads = await tx.lessonThread.deleteMany({}).then((r: any) => r.count);

      // Sosyal medya
      stats.postSaves = await tx.postSave.deleteMany({}).then((r: any) => r.count);
      stats.postComments = await tx.postComment.deleteMany({}).then((r: any) => r.count);
      stats.postLikes = await tx.postLike.deleteMany({}).then((r: any) => r.count);
      stats.posts = await tx.post.deleteMany({}).then((r: any) => r.count);
      stats.storyViews = await tx.storyView.deleteMany({}).then((r: any) => r.count);
      stats.stories = await tx.story.deleteMany({}).then((r: any) => r.count);

      // Arkadaşlıklar
      stats.friendships = await tx.friendship.deleteMany({}).then((r: any) => r.count);

      // Chat
      stats.chatMessageReceipts = await tx.chatMessageReceipt.deleteMany({}).then((r: any) => r.count);
      stats.chatAttachments = await tx.chatAttachment.deleteMany({}).then((r: any) => r.count);
      stats.chatMessages = await tx.chatMessage.deleteMany({}).then((r: any) => r.count);

      // Hackathon
      stats.hackathonSubmissions = await tx.hackathonSubmission.deleteMany({}).then((r: any) => r.count);
      stats.hackathonTeamMembers = await tx.hackathonTeamMember.deleteMany({}).then((r: any) => r.count);
      stats.hackathonTeams = await tx.hackathonTeam.deleteMany({}).then((r: any) => r.count);
      stats.hackathonApplications = await tx.hackathonApplication.deleteMany({}).then((r: any) => r.count);

      // Bot aktiviteleri
      stats.botActivities = await tx.botActivity.deleteMany({}).then((r: any) => r.count);

      // Kullanıcı badge'leri (badge tanımları korunur)
      stats.userBadges = await tx.userBadge.deleteMany({}).then((r: any) => r.count);

      return stats;
    });

    const totalDeleted = Object.values(results).reduce((sum: number, count) => sum + (typeof count === 'number' ? count : 0), 0);

    console.log("[RESET_USER_ACTIONS] Reset completed:", results);

    return NextResponse.json({
      success: true,
      stats: results,
      totalDeleted,
      message: `Kullanıcı hareketleri başarıyla sıfırlandı. Toplam ${totalDeleted} kayıt silindi.`,
    });
  } catch (error: any) {
    console.error("[RESET_USER_ACTIONS] Error:", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcı hareketleri sıfırlanırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

