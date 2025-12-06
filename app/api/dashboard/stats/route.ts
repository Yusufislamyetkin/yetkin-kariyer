import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { HackathonTeamMemberStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Community group slugs for filtering
    const COMMUNITY_SLUGS = [
      "dotnet-core-community",
      "java-community",
      "mssql-community",
      "react-community",
      "angular-community",
      "nodejs-community",
      "ai-community",
      "flutter-community",
      "ethical-hacking-community",
      "nextjs-community",
      "docker-kubernetes-community",
      "owasp-community",
    ];

    const [
      quizStats,
      testAttemptsCount,
      interviewStats,
      cvsCount,
      applicationsCount,
      completedTopicsCount,
      hackathonMemberships,
      postsCount,
      commentsCount,
      communityMessagesCount,
    ] = await Promise.all([
      // Use aggregate for quiz attempts to get count and average in one query
      db.quizAttempt.aggregate({
        where: { userId },
        _count: { _all: true },
        _avg: { score: true },
      }),
      db.testAttempt.count({
        where: { userId },
      }),
      // Use aggregate for interview attempts to get count and average in one query
      db.interviewAttempt.aggregate({
        where: { userId },
        _count: { _all: true },
        _avg: { aiScore: true },
      }),
      db.cV.count({
        where: { userId },
      }),
      db.jobApplication.count({
        where: { userId },
      }),
      db.lessonCompletion.count({
        where: { userId },
      }),
      db.hackathonTeamMember.findMany({
        where: {
          userId,
          status: HackathonTeamMemberStatus.active,
        },
        select: {
          team: {
            select: {
              hackathonId: true,
            },
          },
        },
      }),
      db.post.count({
        where: { userId },
      }),
      db.postComment.count({
        where: { userId },
      }),
      db.chatMessage.count({
        where: {
          userId,
          group: {
            slug: { in: COMMUNITY_SLUGS },
          },
        },
      }),
    ]);

    const averageQuizScore = quizStats._avg.score ? Math.round(quizStats._avg.score) : 0;
    const averageInterviewScore = interviewStats._avg.aiScore ? Math.round(interviewStats._avg.aiScore) : 0;

    // Get distinct hackathon IDs where user is an active team member
    const distinctHackathonIds = new Set(
      hackathonMemberships.map((membership: { team: { hackathonId: string } }) => membership.team.hackathonId)
    );
    const participatedHackathons = distinctHackathonIds.size;

    // Calculate social interactions (posts + comments)
    const socialInteractions = postsCount + commentsCount;

    return NextResponse.json({
      stats: {
        quizAttempts: quizStats._count._all,
        testAttempts: testAttemptsCount,
        interviewAttempts: interviewStats._count._all,
        cvs: cvsCount,
        applications: applicationsCount,
        averageQuizScore,
        averageInterviewScore,
        completedTopics: completedTopicsCount,
        participatedHackathons,
        socialInteractions,
        communityContributions: communityMessagesCount,
      },
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS_GET]", error);
    return NextResponse.json(
      { error: "İstatistikler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

