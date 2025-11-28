import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";
import { checkBadgesForActivity, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";

function resolveLessonSlug(params: { slug: string[] }): string | null {
  if (!params.slug || params.slug.length === 0) {
    return null;
  }
  return `/education/lessons/${params.slug.join("/")}`;
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const lessonSlug = resolveLessonSlug(params);

  if (!lessonSlug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id as string;

    // Find course for this lesson
    let courseId: string | null = null;
    const lessonId = `lesson-${lessonSlug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
    const topicId = `topic-${lessonSlug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;

    const lessonRecord = await db.course.findFirst({
      where: {
        OR: [{ id: lessonId }, { id: topicId }],
      },
      select: {
        id: true,
      },
    });

    if (lessonRecord) {
      courseId = lessonRecord.id;
    } else {
      // Find course by searching in course content
      const courses = await db.course.findMany({
        select: {
          id: true,
          content: true,
        },
      });

      for (const course of courses) {
        if (!course.content || typeof course.content !== "object") continue;
        const content = course.content as any;
        const modules = Array.isArray(content.modules) ? content.modules : [];

        for (const moduleItem of modules) {
          if (!moduleItem || typeof moduleItem !== "object") continue;
          const relatedTopics = Array.isArray((moduleItem as any).relatedTopics)
            ? ((moduleItem as any).relatedTopics as Array<Record<string, any>>)
            : [];

          const lesson = relatedTopics.find((topic) => topic?.href === lessonSlug);
          if (lesson) {
            courseId = course.id;
            break;
          }
        }
        if (courseId) break;
      }
    }

    // Mark lesson as completed
    const completion = await db.lessonCompletion.upsert({
      where: {
        userId_lessonSlug: {
          userId,
          lessonSlug,
        },
      },
      update: {
        completedAt: new Date(),
        miniTestPassed: true,
      },
      create: {
        userId,
        courseId,
        lessonSlug,
        completedAt: new Date(),
        miniTestPassed: true,
      },
    });

    // Emit gamification event
    try {
      const event = await recordEvent({
        userId,
        type: "lesson_complete",
        payload: { lessonSlug },
      });
      await applyRules({ userId, type: "lesson_complete", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn("Gamification lesson_complete failed:", e);
    }

    // Check for badges (daily activities, streak, etc.)
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };
    try {
      badgeResults = await checkBadgesForActivity({
        userId,
        activityType: "ders",
      });
      if (badgeResults.totalEarned > 0) {
        console.log(`[LESSON_COMPLETE] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${userId}`);
      }
    } catch (e) {
      console.warn("Badge check failed:", e);
    }

    return NextResponse.json({
      success: true,
      completion: {
        completedAt: completion.completedAt,
        lessonSlug: completion.lessonSlug,
      },
      badgeResults,
    });
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    return NextResponse.json(
      { error: "Ders tamamlanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

