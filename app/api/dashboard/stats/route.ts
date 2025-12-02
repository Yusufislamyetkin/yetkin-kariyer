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

    const [quizAttempts, testAttempts, interviewAttempts, cvs, applications, completedTopics, hackathonMemberships, posts, comments, communityMessages] = await Promise.all([
      db.quizAttempt.findMany({
        where: { userId },
        select: { score: true },
      }),
      db.testAttempt.findMany({
        where: { userId },
        select: { id: true },
      }),
      db.interviewAttempt.findMany({
        where: { userId },
        select: { aiScore: true },
      }),
      db.cV.findMany({
        where: { userId },
        select: { id: true },
      }),
      db.jobApplication.findMany({
        where: { userId },
        select: { id: true },
      }),
      db.lessonCompletion.findMany({
        where: { userId },
        select: { id: true },
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
      db.post.findMany({
        where: { userId },
        select: { id: true },
      }),
      db.postComment.findMany({
        where: { userId },
        select: { id: true },
      }),
      db.chatMessage.findMany({
        where: {
          userId,
          group: {
            slug: { in: COMMUNITY_SLUGS },
          },
        },
        select: { id: true },
      }),
    ]);

    const averageQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0) / quizAttempts.length
        : 0;

    const interviewScores = interviewAttempts
      .filter((a: { aiScore: number | null }) => a.aiScore !== null)
      .map((a: { aiScore: number | null }) => a.aiScore as number);
    const averageInterviewScore =
      interviewScores.length > 0
        ? interviewScores.reduce((sum: number, s: number) => sum + s, 0) / interviewScores.length
        : 0;

    // Get distinct hackathon IDs where user is an active team member
    const distinctHackathonIds = new Set(
      hackathonMemberships.map((membership: { team: { hackathonId: string } }) => membership.team.hackathonId)
    );
    const participatedHackathons = distinctHackathonIds.size;

    // Calculate social interactions (posts + comments)
    const socialInteractions = posts.length + comments.length;

    return NextResponse.json({
      stats: {
        quizAttempts: quizAttempts.length,
        testAttempts: testAttempts.length,
        interviewAttempts: interviewAttempts.length,
        cvs: cvs.length,
        applications: applications.length,
        averageQuizScore: Math.round(averageQuizScore),
        averageInterviewScore: Math.round(averageInterviewScore),
        completedTopics: completedTopics.length,
        participatedHackathons,
        socialInteractions,
        communityContributions: communityMessages.length,
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

