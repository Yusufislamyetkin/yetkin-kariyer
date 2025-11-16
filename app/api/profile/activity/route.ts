import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/profile/activity - Kullanıcının son aktivitelerini döner
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get recent quiz attempts
    const quizAttempts = await db.quizAttempt.findMany({
      where: { 
        userId,
      },
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: limit,
    });

    // Get recent interview attempts
    const interviewAttempts = await db.interviewAttempt.findMany({
      where: { 
        userId,
      },
      include: {
        interview: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: limit,
    });

    // Get recent CVs
    const cvs = await db.cV.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Get recent job applications
    const applications = await db.jobApplication.findMany({
      where: { 
        userId,
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: limit,
    });

    // Combine and sort all activities
    const activities: any[] = [];

    quizAttempts.forEach((attempt) => {
      if (attempt.quiz) {
        activities.push({
          id: attempt.id,
          type: "quiz",
          title: `${attempt.quiz.title} testini tamamladı`,
          score: attempt.score,
          date: attempt.completedAt,
          icon: "📝",
        });
      }
    });

    interviewAttempts.forEach((attempt) => {
      if (attempt.interview) {
        activities.push({
          id: attempt.id,
          type: "interview",
          title: `${attempt.interview.title} mülakatını tamamladı`,
          score: attempt.aiScore,
          date: attempt.completedAt,
          icon: "🎤",
        });
      }
    });

    cvs.forEach((cv) => {
      activities.push({
        id: cv.id,
        type: "cv",
        title: "CV oluşturdu",
        date: cv.createdAt,
        icon: "📄",
      });
    });

    applications.forEach((app) => {
      if (app.job) {
        activities.push({
          id: app.id,
          type: "application",
          title: `${app.job.title} pozisyonuna başvurdu`,
          date: app.appliedAt,
          icon: "💼",
        });
      }
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Take only the most recent ones
    const recentActivities = activities.slice(0, limit);

    // Format dates
    const formatTimeAgo = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} gün önce`;
      if (hours > 0) return `${hours} saat önce`;
      if (minutes > 0) return `${minutes} dakika önce`;
      return "Az önce";
    };

    const formattedActivities = recentActivities.map((activity) => ({
      ...activity,
      timeAgo: formatTimeAgo(activity.date),
    }));

    return NextResponse.json({ activities: formattedActivities });
  } catch (error) {
    console.error("[PROFILE_ACTIVITY_GET] Error:", error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("[PROFILE_ACTIVITY_GET] Error message:", error.message);
      console.error("[PROFILE_ACTIVITY_GET] Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("P1001")) {
        console.error("[PROFILE_ACTIVITY_GET] Database connection error detected");
      }
    }
    return NextResponse.json(
      { 
        error: "Aktiviteler yüklenirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}

