import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/profile/activity - Kullanıcının son aktivitelerini döner
// type: "own" (default), "global", "connections"
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "own"; // own, global, connections

    // Determine which user IDs to fetch activities for
    let targetUserIds: string[] = [userId];

    if (type === "global") {
      // Get all users (no filter)
      targetUserIds = [];
    } else if (type === "connections") {
      // Get users that the current user follows
      const following = await db.friendship.findMany({
        where: {
          requesterId: userId,
          status: "accepted",
        },
        select: {
          addresseeId: true,
        },
      });
      targetUserIds = following.map((f: { addresseeId: string }) => f.addresseeId);
      // If no connections, return empty array
      if (targetUserIds.length === 0) {
        return NextResponse.json({ activities: [] });
      }
    }

    // Build where clause for user filtering
    const userWhere = type === "global" 
      ? {} // No user filter for global
      : { userId: { in: targetUserIds } };

    // Get recent quiz attempts
    const quizAttempts = await db.quizAttempt.findMany({
      where: userWhere,
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: type === "global" ? limit * 4 : limit, // Get more for global to have variety
    });

    // Get recent interview attempts
    const interviewAttempts = await db.interviewAttempt.findMany({
      where: userWhere,
      include: {
        interview: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: type === "global" ? limit * 4 : limit,
    });

    // Get recent CVs
    const cvs = await db.cV.findMany({
      where: userWhere,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: type === "global" ? limit * 4 : limit,
    });

    // Get recent job applications
    const applications = await db.jobApplication.findMany({
      where: userWhere,
      include: {
        job: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: type === "global" ? limit * 4 : limit,
    });

    // Combine and sort all activities
    const activities: any[] = [];

    quizAttempts.forEach((attempt: any) => {
      if (attempt.quiz) {
        const userName = attempt.user?.name || "Birisi";
        const isOwn = attempt.userId === userId;
        activities.push({
          id: attempt.id,
          type: "quiz",
          title: isOwn 
            ? `${attempt.quiz.title} testini tamamladı`
            : `${userName} ${attempt.quiz.title} testini tamamladı`,
          score: attempt.score,
          date: attempt.completedAt,
          icon: "📝",
          userId: attempt.userId,
          user: attempt.user ? {
            id: attempt.user.id,
            name: attempt.user.name,
            profileImage: attempt.user.profileImage,
          } : null,
        });
      }
    });

    interviewAttempts.forEach((attempt: any) => {
      if (attempt.interview) {
        const userName = attempt.user?.name || "Birisi";
        const isOwn = attempt.userId === userId;
        activities.push({
          id: attempt.id,
          type: "interview",
          title: isOwn
            ? `${attempt.interview.title} mülakatını tamamladı`
            : `${userName} ${attempt.interview.title} mülakatını tamamladı`,
          score: attempt.aiScore,
          date: attempt.completedAt,
          icon: "🎤",
          userId: attempt.userId,
          user: attempt.user ? {
            id: attempt.user.id,
            name: attempt.user.name,
            profileImage: attempt.user.profileImage,
          } : null,
        });
      }
    });

    cvs.forEach((cv: any) => {
      const userName = cv.user?.name || "Birisi";
      const isOwn = cv.userId === userId;
      activities.push({
        id: cv.id,
        type: "cv",
        title: isOwn ? "CV oluşturdu" : `${userName} CV oluşturdu`,
        date: cv.createdAt,
        icon: "📄",
        userId: cv.userId,
        user: cv.user ? {
          id: cv.user.id,
          name: cv.user.name,
          profileImage: cv.user.profileImage,
        } : null,
      });
    });

    applications.forEach((app: any) => {
      if (app.job) {
        const userName = app.user?.name || "Birisi";
        const isOwn = app.userId === userId;
        activities.push({
          id: app.id,
          type: "application",
          title: isOwn
            ? `${app.job.title} pozisyonuna başvurdu`
            : `${userName} ${app.job.title} pozisyonuna başvurdu`,
          date: app.appliedAt,
          icon: "💼",
          userId: app.userId,
          user: app.user ? {
            id: app.user.id,
            name: app.user.name,
            profileImage: app.user.profileImage,
          } : null,
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

