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

    const [quizAttempts, interviewAttempts, cvs, applications] = await Promise.all([
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
    ]);

    const averageQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length
        : 0;

    const interviewScores = interviewAttempts
      .filter((a) => a.aiScore !== null)
      .map((a) => a.aiScore!);
    const averageInterviewScore =
      interviewScores.length > 0
        ? interviewScores.reduce((sum, s) => sum + s, 0) / interviewScores.length
        : 0;

    return NextResponse.json({
      stats: {
        quizAttempts: quizAttempts.length,
        interviewAttempts: interviewAttempts.length,
        cvs: cvs.length,
        applications: applications.length,
        averageQuizScore: Math.round(averageQuizScore),
        averageInterviewScore: Math.round(averageInterviewScore),
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

