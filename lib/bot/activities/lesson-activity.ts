import { db } from "@/lib/db";

interface ActivityResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

interface ActivityOptions {
  targetId?: string;
  courseId?: string;
  lessonSlug?: string;
}

/**
 * Creates a lesson completion activity for a bot
 */
export async function createLessonActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Find a course and lesson to complete
    let courseId = options.courseId;
    let lessonSlug = options.lessonSlug;

    if (!courseId || !lessonSlug) {
      // Get bot's expertise to find relevant courses
      const bot = await db.user.findUnique({
        where: { id: userId, isBot: true },
        include: {
          character: true,
        },
      });

      const botExpertise = bot?.character?.expertise || [];

      // Find a course
      const courses = await db.course.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          topic: true,
          content: true,
        },
      });

      if (courses.length === 0) {
        return {
          success: false,
          error: "No courses found",
        };
      }

      // Try to match expertise, otherwise pick random
      const matchingCourses = botExpertise.length > 0
        ? courses.filter((c: any) => {
            const titleLower = c.title?.toLowerCase() || "";
            const topicLower = c.topic?.toLowerCase() || "";
            return botExpertise.some((exp: any) => 
              titleLower.includes(exp.toLowerCase()) || 
              topicLower.includes(exp.toLowerCase())
            );
          })
        : courses;

      const selectedCourse = matchingCourses.length > 0
        ? matchingCourses[Math.floor(Math.random() * matchingCourses.length)]
        : courses[Math.floor(Math.random() * courses.length)];

      courseId = selectedCourse.id;

      // Extract lesson slug from course content
      const content = selectedCourse.content as any;
      const lessons = content?.lessons || content?.modules?.[0]?.lessons || [];
      
      if (lessons.length > 0) {
        const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
        lessonSlug = randomLesson.slug || randomLesson.id || `lesson-${Math.random()}`;
      } else {
        lessonSlug = `lesson-${Date.now()}`;
      }
    }

    if (!lessonSlug) {
      return {
        success: false,
        error: "Lesson slug not found",
      };
    }

    // Check if already completed
    const existing = await db.lessonCompletion.findUnique({
      where: {
        userId_lessonSlug: {
          userId,
          lessonSlug,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Lesson already completed",
      };
    }

    // Create lesson completion
    const completion = await db.lessonCompletion.create({
      data: {
        userId,
        courseId: courseId || null,
        lessonSlug,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      activityId: completion.id,
    };
  } catch (error: any) {
    console.error(`[BOT_LESSON_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create lesson completion",
    };
  }
}

