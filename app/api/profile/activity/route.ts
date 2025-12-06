import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { normalizeCourseContent } from "@/lib/education/courseContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Removes "Ders X:" prefix from quiz/test titles
 * @param title - The title that may contain "Ders X:" prefix
 * @returns Title without the "Ders X:" prefix
 */
function removeLessonPrefix(title: string): string {
  if (!title) return title;
  // Remove "Ders " followed by digits, then ":" and optional whitespace at the start
  return title.replace(/^Ders \d+:\s*/i, "").trim();
}

/**
 * Removes "Kursu", "Kurs" suffix from course titles
 * @param title - The course title that may contain suffix
 * @returns Title without the suffix
 */
function removeCourseSuffix(title: string): string {
  if (!title) return title;
  return title.replace(/\s+(Kursu|Kurs)$/i, "").trim();
}

/**
 * Gets lesson details (course, module, lesson) from lessonSlug
 * @param lessonSlug - The lesson slug to look up
 * @returns Object with courseTitle, moduleTitle, lessonTitle or null if not found
 */
async function getLessonDetails(lessonSlug: string): Promise<{
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
} | null> {
  try {
    if (!lessonSlug) return null;

    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    for (const course of courses) {
      const normalized = normalizeCourseContent(course.content, null, null);
      const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

      for (const courseModule of modules) {
        if (!courseModule || typeof courseModule !== "object") continue;

        const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
          ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
          : [];

        const lesson = relatedTopics.find((topic) => topic?.href === lessonSlug);
        if (lesson && typeof lesson === "object") {
          const courseTitle = removeCourseSuffix(course.title);
          const moduleTitle = (courseModule as any).title || (courseModule as any).label || "";
          const lessonTitle = lesson.label || lesson.title || "";

          return {
            courseTitle,
            moduleTitle,
            lessonTitle,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("[getLessonDetails] Error:", error);
    return null;
  }
}

/**
 * Formats quiz details for activity notification
 * @param quiz - The quiz object
 * @param lessonDetails - Optional lesson details from getLessonDetails
 * @returns Formatted string for activity notification
 */
async function formatQuizDetails(quiz: any, lessonDetails: { courseTitle: string; moduleTitle: string; lessonTitle: string } | null): Promise<string> {
  if (lessonDetails) {
    return `${lessonDetails.courseTitle} => ${lessonDetails.moduleTitle} => ${lessonDetails.lessonTitle}`;
  }

  // If courseId exists, try to get course title
  if (quiz.courseId) {
    try {
      const course = await db.course.findUnique({
        where: { id: quiz.courseId },
        select: { title: true },
      });

      if (course) {
        const courseTitle = removeCourseSuffix(course.title);
        const parts: string[] = [courseTitle];

        if (quiz.topic) {
          parts.push(`Konu: ${quiz.topic}`);
        }
        if (quiz.level) {
          parts.push(`Seviye: ${quiz.level}`);
        }

        if (parts.length > 1) {
          return parts.join(" - ");
        }
        return courseTitle;
      }
    } catch (error) {
      console.error("[formatQuizDetails] Error getting course:", error);
    }
  }

  // Fallback to clean title
  return removeLessonPrefix(quiz.title || "");
}

// GET /api/profile/activity - Kullanıcının son aktivitelerini döner
// type: "own" (default), "global", "connections"
// userId: Belirli bir kullanıcının aktivitelerini çekmek için (opsiyonel)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id as string;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "own"; // own, global, connections
    const requestedUserId = searchParams.get("userId"); // Belirli bir kullanıcının aktivitelerini çekmek için

    // Determine which user IDs to fetch activities for
    let targetUserIds: string[] = [];
    
    // Eğer userId parametresi verildiyse, o kullanıcının aktivitelerini çek (type'ı override eder)
    if (requestedUserId) {
      targetUserIds = [requestedUserId];
    } else if (type === "global") {
      // Get all users (no filter)
      targetUserIds = [];
    } else if (type === "connections") {
      // Get users that the current user follows
      const following = await db.friendship.findMany({
        where: {
          requesterId: currentUserId,
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
    } else {
      // Default: own activities (current user)
      targetUserIds = [currentUserId];
    }

    // Build where clause for user filtering
    const userWhere = (type === "global" && !requestedUserId)
      ? {} // No user filter for global (unless userId is explicitly requested)
      : { userId: { in: targetUserIds } };

    // Get recent quiz attempts
    const quizAttempts = await db.quizAttempt.findMany({
      where: userWhere,
      include: {
        quiz: {
          select: {
            title: true,
            lessonSlug: true,
            courseId: true,
            topic: true,
            level: true,
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
            type: true,
            difficulty: true,
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
            location: true,
            salary: true,
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

    // Get recent live coding attempts
    const liveCodingAttempts = await db.liveCodingAttempt.findMany({
      where: userWhere,
      include: {
        quiz: {
          select: {
            title: true,
            lessonSlug: true,
            courseId: true,
            topic: true,
            level: true,
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

    // Get recent lesson completions (only completed ones)
    const lessonCompletions = await db.lessonCompletion.findMany({
      where: {
        ...userWhere,
        completedAt: { not: null },
      },
      include: {
        course: {
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

    // Get recent hackathon applications
    const hackathonApplications = await db.hackathonApplication.findMany({
      where: userWhere,
      include: {
        hackathon: {
          select: {
            title: true,
            phase: true,
            tags: true,
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

    // Get recent badge awards
    const badgeAwards = await db.userBadge.findMany({
      where: userWhere,
      include: {
        badge: {
          select: {
            name: true,
            icon: true,
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
      orderBy: { earnedAt: "desc" },
      take: type === "global" ? limit * 4 : limit,
    });

    // Combine and sort all activities
    const activities: any[] = [];

    // Process quiz attempts with detailed information
    for (const attempt of quizAttempts) {
      if (attempt.quiz) {
        const userName = attempt.user?.name || "Birisi";
        const isOwn = attempt.userId === currentUserId;
        
        // Get lesson details if lessonSlug exists
        let lessonDetails = null;
        if (attempt.quiz.lessonSlug) {
          lessonDetails = await getLessonDetails(attempt.quiz.lessonSlug);
        }
        
        // Format quiz details
        const quizDetails = await formatQuizDetails(attempt.quiz, lessonDetails);
        
        activities.push({
          id: attempt.id,
          type: "quiz",
          title: isOwn 
            ? `${quizDetails} testini tamamladı`
            : `${userName} ${quizDetails} testini tamamladı`,
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
    }

    interviewAttempts.forEach((attempt: any) => {
      if (attempt.interview) {
        const userName = attempt.user?.name || "Birisi";
        const isOwn = attempt.userId === currentUserId;
        
        // Build detailed interview title
        let interviewTitle = attempt.interview.title;
        const details: string[] = [];
        
        if (attempt.interview.type) {
          details.push(`Tip: ${attempt.interview.type}`);
        }
        if (attempt.interview.difficulty) {
          details.push(`Zorluk: ${attempt.interview.difficulty}`);
        }
        
        if (details.length > 0) {
          interviewTitle = `${interviewTitle} (${details.join(", ")})`;
        }
        
        activities.push({
          id: attempt.id,
          type: "interview",
          title: isOwn
            ? `${interviewTitle} mülakatını tamamladı`
            : `${userName} ${interviewTitle} mülakatını tamamladı`,
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
      const isOwn = cv.userId === currentUserId;
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
        const isOwn = app.userId === currentUserId;
        
        // Build detailed job title
        let jobTitle = app.job.title;
        if (app.job.location) {
          jobTitle = `${jobTitle} - ${app.job.location}`;
        }
        
        activities.push({
          id: app.id,
          type: "application",
          title: isOwn
            ? `${jobTitle} pozisyonuna başvurdu`
            : `${userName} ${jobTitle} pozisyonuna başvurdu`,
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

    // Process live coding attempts with detailed information
    for (const attempt of liveCodingAttempts) {
      if (attempt.quiz) {
        const userName = attempt.user?.name || "Birisi";
        const isOwn = attempt.userId === currentUserId;
        
        // Get lesson details if lessonSlug exists
        let lessonDetails = null;
        if (attempt.quiz.lessonSlug) {
          lessonDetails = await getLessonDetails(attempt.quiz.lessonSlug);
        }
        
        // Format quiz details
        const quizDetails = await formatQuizDetails(attempt.quiz, lessonDetails);
        
        activities.push({
          id: attempt.id,
          type: "live-coding",
          title: isOwn
            ? `${quizDetails} canlı kodlama görevini tamamladı`
            : `${userName} ${quizDetails} canlı kodlama görevini tamamladı`,
          date: attempt.completedAt,
          icon: "💻",
          userId: attempt.userId,
          user: attempt.user ? {
            id: attempt.user.id,
            name: attempt.user.name,
            profileImage: attempt.user.profileImage,
          } : null,
        });
      }
    }

    // Process lesson completions with detailed information
    for (const completion of lessonCompletions) {
      const userName = completion.user?.name || "Birisi";
      const isOwn = completion.userId === currentUserId;
      
      // Get lesson details from lessonSlug
      const lessonDetails = await getLessonDetails(completion.lessonSlug);
      
      let lessonTitle: string;
      if (lessonDetails) {
        // Format: "Kurs => Modül => Ders"
        lessonTitle = `${lessonDetails.courseTitle} => ${lessonDetails.moduleTitle} => ${lessonDetails.lessonTitle}`;
      } else {
        // Fallback: use course title without suffix or lessonSlug
        if (completion.course?.title) {
          lessonTitle = removeCourseSuffix(completion.course.title);
        } else {
          // If lessonSlug is a path, extract the last segment for display
          let slugTitle = completion.lessonSlug;
          if (slugTitle && slugTitle.includes("/")) {
            const segments = slugTitle.split("/");
            slugTitle = segments[segments.length - 1];
            // Convert kebab-case to readable format
            slugTitle = slugTitle
              .split("-")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          lessonTitle = slugTitle;
        }
      }
      
      activities.push({
        id: completion.id,
        type: "lesson",
        title: isOwn
          ? `${lessonTitle} dersini tamamladı`
          : `${userName} ${lessonTitle} dersini tamamladı`,
        date: completion.completedAt,
        icon: "📚",
        userId: completion.userId,
        user: completion.user ? {
          id: completion.user.id,
          name: completion.user.name,
          profileImage: completion.user.profileImage,
        } : null,
      });
    }

    hackathonApplications.forEach((app: any) => {
      if (app.hackathon) {
        const userName = app.user?.name || "Birisi";
        const isOwn = app.userId === currentUserId;
        
        // Build detailed hackathon title
        let hackathonTitle = app.hackathon.title;
        const details: string[] = [];
        
        if (app.hackathon.phase) {
          // Translate phase to Turkish
          const phaseMap: Record<string, string> = {
            draft: "Taslak",
            upcoming: "Yaklaşan",
            applications: "Başvurular",
            submission: "Teslim",
            judging: "Değerlendirme",
            completed: "Tamamlandı",
            archived: "Arşivlendi",
          };
          const phaseText = phaseMap[app.hackathon.phase] || app.hackathon.phase;
          details.push(`Faz: ${phaseText}`);
        }
        
        if (app.hackathon.tags && Array.isArray(app.hackathon.tags) && app.hackathon.tags.length > 0) {
          details.push(`Etiketler: ${app.hackathon.tags.slice(0, 3).join(", ")}`);
        }
        
        if (details.length > 0) {
          hackathonTitle = `${hackathonTitle} (${details.join(", ")})`;
        }
        
        activities.push({
          id: app.id,
          type: "hackathon",
          title: isOwn
            ? `${hackathonTitle} hackathonuna başvurdu`
            : `${userName} ${hackathonTitle} hackathonuna başvurdu`,
          date: app.appliedAt,
          icon: "🏆",
          userId: app.userId,
          user: app.user ? {
            id: app.user.id,
            name: app.user.name,
            profileImage: app.user.profileImage,
          } : null,
        });
      }
    });

    badgeAwards.forEach((award: any) => {
      if (award.badge) {
        const userName = award.user?.name || "Birisi";
        const isOwn = award.userId === currentUserId;
        const badgeIcon = award.badge.icon || "🏅";
        activities.push({
          id: award.id,
          type: "badge",
          title: isOwn
            ? `${badgeIcon} ${award.badge.name} rozetini kazandı`
            : `${userName} ${badgeIcon} ${award.badge.name} rozetini kazandı`,
          date: award.earnedAt,
          icon: badgeIcon,
          userId: award.userId,
          user: award.user ? {
            id: award.user.id,
            name: award.user.name,
            profileImage: award.user.profileImage,
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

