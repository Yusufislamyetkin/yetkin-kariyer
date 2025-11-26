import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const [quizAttempts, interviewAttempts, cvs, applications, completedTopics] = await Promise.all([
      db.quizAttempt.findMany({
        where: { userId },
        select: { score: true },
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

    return NextResponse.json({
      stats: {
        quizAttempts: quizAttempts.length,
        interviewAttempts: interviewAttempts.length,
        cvs: cvs.length,
        applications: applications.length,
        averageQuizScore: Math.round(averageQuizScore),
        averageInterviewScore: Math.round(averageInterviewScore),
        completedTopics: completedTopics.length,
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

