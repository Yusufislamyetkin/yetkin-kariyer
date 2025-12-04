import { db } from "@/lib/db";
import { logBotActivity } from "./bot-activity-logger";
import { BotActivityType } from "@prisma/client";

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

/**
 * Join bot to random communities
 */
export async function joinCommunities(userId: string, count: number = 3) {
  try {
    // Get all communities
    const communities = await db.chatGroup.findMany({
      where: {
        slug: { in: COMMUNITY_SLUGS },
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (communities.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.CHAT,
        success: false,
        errorMessage: "No communities found",
      });
      return { success: false, joined: 0 };
    }

    // Get communities user is already in
    const existingMemberships = await db.chatGroupMembership.findMany({
      where: {
        userId,
        groupId: { in: communities.map((c: typeof communities[0]) => c.id) },
      },
      select: {
        groupId: true,
      },
    });

    const existingGroupIds = new Set(existingMemberships.map((m: typeof existingMemberships[0]) => m.groupId));
    const availableCommunities = communities.filter(
      (c: typeof communities[0]) => !existingGroupIds.has(c.id)
    );

    // Shuffle and take random communities
    const shuffled = availableCommunities.sort(() => Math.random() - 0.5);
    const toJoin = shuffled.slice(0, Math.min(count, shuffled.length));

    if (toJoin.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.CHAT,
        success: true,
        details: { message: "Already in all communities" },
      });
      return { success: true, joined: 0 };
    }

    // Create memberships
    await db.chatGroupMembership.createMany({
      data: toJoin.map((community: typeof toJoin[0]) => ({
        groupId: community.id,
        userId,
        role: "member",
      })),
      skipDuplicates: true,
    });

    await logBotActivity({
      userId,
      activityType: BotActivityType.CHAT,
      targetId: toJoin[0]?.id,
      details: { joinedCount: toJoin.length, communities: toJoin.map((c: typeof toJoin[0]) => c.slug) },
      success: true,
    });

    return { success: true, joined: toJoin.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.CHAT,
      success: false,
      errorMessage: error.message || "Failed to join communities",
    });
    return { success: false, joined: 0, error: error.message };
  }
}

/**
 * Like random posts
 */
export async function likePosts(userId: string, count: number = 5) {
  try {
    // Get random posts that user hasn't liked yet
    const posts = await db.post.findMany({
      where: {
        userId: { not: userId }, // Don't like own posts
        likes: {
          none: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
      take: count * 2, // Get more to have options
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LIKE,
        success: false,
        errorMessage: "No posts available to like",
      });
      return { success: false, liked: 0 };
    }

    // Shuffle and take random posts
    const shuffled = posts.sort(() => Math.random() - 0.5);
    const toLike = shuffled.slice(0, Math.min(count, shuffled.length));

    // Create likes
    await db.postLike.createMany({
      data: toLike.map((post: typeof toLike[0]) => ({
        postId: post.id,
        userId,
      })),
      skipDuplicates: true,
    });

    await logBotActivity({
      userId,
      activityType: BotActivityType.LIKE,
      targetId: toLike[0]?.id,
      details: { likedCount: toLike.length },
      success: true,
    });

    return { success: true, liked: toLike.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.LIKE,
      success: false,
      errorMessage: error.message || "Failed to like posts",
    });
    return { success: false, liked: 0, error: error.message };
  }
}

/**
 * Comment on random posts (AI-generated comments)
 * Note: This will be enhanced with AI service later
 */
export async function commentOnPosts(
  userId: string,
  count: number = 3,
  generateComment: (postId: string) => Promise<string>
) {
  try {
    // Get random posts that user hasn't commented on yet
    const posts = await db.post.findMany({
      where: {
        userId: { not: userId }, // Don't comment on own posts
        comments: {
          none: {
            userId,
          },
        },
      },
      select: {
        id: true,
        content: true,
      },
      take: count * 2,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.COMMENT,
        success: false,
        errorMessage: "No posts available to comment on",
      });
      return { success: false, commented: 0 };
    }

    // Shuffle and take random posts
    const shuffled = posts.sort(() => Math.random() - 0.5);
    const toComment = shuffled.slice(0, Math.min(count, shuffled.length));

    const comments = [];
    for (const post of toComment) {
      try {
        const commentContent = await generateComment(post.id);
        if (commentContent && commentContent.trim().length > 0) {
          const comment = await db.postComment.create({
            data: {
              postId: post.id,
              userId,
              content: commentContent.trim().substring(0, 1000), // Limit to 1000 chars
            },
          });
          comments.push(comment);
        }
      } catch (error: any) {
        console.error(`[BOT_COMMENT] Error commenting on post ${post.id}:`, error);
        // Continue with next post
      }
    }

    if (comments.length > 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.COMMENT,
        targetId: comments[0]?.postId,
        details: { commentedCount: comments.length },
        success: true,
      });
    }

    return { success: true, commented: comments.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.COMMENT,
      success: false,
      errorMessage: error.message || "Failed to comment on posts",
    });
    return { success: false, commented: 0, error: error.message };
  }
}

/**
 * Create a post (AI-generated content)
 */
export async function createPost(
  userId: string,
  generatePostContent: () => Promise<string>
) {
  try {
    const content = await generatePostContent();
    if (!content || content.trim().length === 0) {
      throw new Error("Generated content is empty");
    }

    const post = await db.post.create({
      data: {
        userId,
        content: content.trim().substring(0, 2200), // Limit to 2200 chars
      },
    });

    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      targetId: post.id,
      details: { contentLength: post.content?.length || 0 },
      success: true,
    });

    return { success: true, postId: post.id };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      success: false,
      errorMessage: error.message || "Failed to create post",
    });
    return { success: false, error: error.message };
  }
}

/**
 * Complete random lessons
 */
export async function completeLessons(userId: string, count: number = 2) {
  try {
    // Get courses with lessons
    const courses = await db.course.findMany({
      select: {
        id: true,
        content: true,
      },
      take: 50,
    });

    if (courses.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LESSON,
        success: false,
        errorMessage: "No courses found",
      });
      return { success: false, completed: 0 };
    }

    // Extract lesson slugs from courses
    const lessonSlugs: string[] = [];
    for (const course of courses) {
      if (course.content && typeof course.content === "object") {
        const content = course.content as any;
        if (Array.isArray(content.lessons)) {
          for (const lesson of content.lessons) {
            if (lesson.slug && typeof lesson.slug === "string") {
              lessonSlugs.push(lesson.slug);
            }
          }
        }
      }
    }

    if (lessonSlugs.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LESSON,
        success: false,
        errorMessage: "No lessons found",
      });
      return { success: false, completed: 0 };
    }

    // Get already completed lessons
    const completed = await db.lessonCompletion.findMany({
      where: {
        userId,
        lessonSlug: { in: lessonSlugs },
      },
      select: {
        lessonSlug: true,
      },
    });

    const completedSlugs = new Set(completed.map((c: typeof completed[0]) => c.lessonSlug));
    const availableSlugs = lessonSlugs.filter((slug: string) => !completedSlugs.has(slug));

    if (availableSlugs.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LESSON,
        success: true,
        details: { message: "All lessons already completed" },
      });
      return { success: true, completed: 0 };
    }

    // Shuffle and take random lessons
    const shuffled = availableSlugs.sort(() => Math.random() - 0.5);
    const toComplete = shuffled.slice(0, Math.min(count, shuffled.length));

    // Find course for each lesson
    const completions = [];
    for (const lessonSlug of toComplete) {
      const course = courses.find((c: typeof courses[0]) => {
        if (c.content && typeof c.content === "object") {
          const content = c.content as any;
          if (Array.isArray(content.lessons)) {
            return content.lessons.some((l: any) => l.slug === lessonSlug);
          }
        }
        return false;
      });

      const completion = await db.lessonCompletion.upsert({
        where: {
          userId_lessonSlug: {
            userId,
            lessonSlug,
          },
        },
        update: {
          completedAt: new Date(),
        },
        create: {
          userId,
          courseId: course?.id || null,
          lessonSlug,
          completedAt: new Date(),
          miniTestPassed: true,
          miniTestScore: Math.floor(Math.random() * 20) + 80, // Random score 80-100
        },
      });

      completions.push(completion);
    }

    await logBotActivity({
      userId,
      activityType: BotActivityType.LESSON,
      targetId: toComplete[0],
      details: { completedCount: completions.length },
      success: true,
    });

    return { success: true, completed: completions.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.LESSON,
      success: false,
      errorMessage: error.message || "Failed to complete lessons",
    });
    return { success: false, completed: 0, error: error.message };
  }
}

/**
 * Complete random tests (with AI-generated answers)
 */
export async function completeTests(
  userId: string,
  count: number = 2,
  answerQuestions: (quizId: string) => Promise<any>
) {
  try {
    // Get available quizzes
    const quizzes = await db.quiz.findMany({
      where: {
        type: "TEST",
      },
      select: {
        id: true,
        title: true,
        questions: true,
      },
      take: 50,
    });

    if (quizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.TEST,
        success: false,
        errorMessage: "No tests found",
      });
      return { success: false, completed: 0 };
    }

    // Get already completed tests (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completed = await db.testAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizzes.map((q: typeof quizzes[0]) => q.id) },
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        quizId: true,
      },
    });

    const completedQuizIds = new Set(completed.map((c: typeof completed[0]) => c.quizId));
    const availableQuizzes = quizzes.filter((q: typeof quizzes[0]) => !completedQuizIds.has(q.id));

    if (availableQuizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.TEST,
        success: true,
        details: { message: "All available tests already completed today" },
      });
      return { success: true, completed: 0 };
    }

    // Shuffle and take random quizzes
    const shuffled = availableQuizzes.sort(() => Math.random() - 0.5);
    const toComplete = shuffled.slice(0, Math.min(count, shuffled.length));

    const attempts = [];
    for (const quiz of toComplete) {
      try {
        const answers = await answerQuestions(quiz.id);
        if (!answers) continue;

        // Calculate score
        const questions = quiz.questions as any;
        if (!Array.isArray(questions)) continue;

        let correctCount = 0;
        const breakdown = questions.map((q: any, index: number) => {
          const selected = answers[index] ?? -1;
          const correct = q.correctAnswer ?? -1;
          const isCorrect = selected === correct;
          if (isCorrect) correctCount++;
          return {
            questionId: q.id || index,
            selectedIndex: selected,
            correctIndex: correct,
            isCorrect,
          };
        });

        const score = Math.round((correctCount / questions.length) * 100);

        // Create quiz attempt
        const quizAttempt = await db.quizAttempt.create({
          data: {
            userId,
            quizId: quiz.id,
            score,
            answers: { submitted: answers, breakdown },
            duration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
            topic: null,
            level: null,
          },
        });

        // Create test attempt
        const testAttempt = await db.testAttempt.create({
          data: {
            userId,
            quizId: quiz.id,
            metrics: {
              score,
              duration: quizAttempt.duration,
              correctCount,
              totalQuestions: questions.length,
            },
            completedAt: new Date(),
          },
        });

        attempts.push({ quizAttempt, testAttempt });
      } catch (error: any) {
        console.error(`[BOT_TEST] Error completing test ${quiz.id}:`, error);
        // Continue with next test
      }
    }

    if (attempts.length > 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.TEST,
        targetId: attempts[0]?.quizAttempt.quizId,
        details: { completedCount: attempts.length },
        success: true,
      });
    }

    return { success: true, completed: attempts.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.TEST,
      success: false,
      errorMessage: error.message || "Failed to complete tests",
    });
    return { success: false, completed: 0, error: error.message };
  }
}

/**
 * Complete live coding challenges
 */
export async function completeLiveCoding(userId: string, count: number = 1) {
  try {
    // Get available live coding challenges
    const quizzes = await db.quiz.findMany({
      where: {
        type: "LIVE_CODING",
      },
      select: {
        id: true,
        title: true,
      },
      take: 20,
    });

    if (quizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LIVE_CODING,
        success: false,
        errorMessage: "No live coding challenges found",
      });
      return { success: false, completed: 0 };
    }

    // Get already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completed = await db.liveCodingAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizzes.map((q: typeof quizzes[0]) => q.id) },
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        quizId: true,
      },
    });

    const completedQuizIds = new Set(completed.map((c: typeof completed[0]) => c.quizId));
    const availableQuizzes = quizzes.filter((q: typeof quizzes[0]) => !completedQuizIds.has(q.id));

    if (availableQuizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LIVE_CODING,
        success: true,
        details: { message: "All available challenges already completed today" },
      });
      return { success: true, completed: 0 };
    }

    // Shuffle and take random
    const shuffled = availableQuizzes.sort(() => Math.random() - 0.5);
    const toComplete = shuffled.slice(0, Math.min(count, shuffled.length));

    const attempts = [];
    for (const quiz of toComplete) {
      try {
        const attempt = await db.liveCodingAttempt.create({
          data: {
            userId,
            quizId: quiz.id,
            code: JSON.stringify({ tasks: [], metadata: { completed: true } }),
            metrics: {
              caseCompleted: true,
              caseCompletedAt: new Date().toISOString(),
              completedTaskIds: [],
              totalDurationSeconds: Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
            },
            completedAt: new Date(),
          },
        });

        attempts.push(attempt);
      } catch (error: any) {
        console.error(`[BOT_LIVE_CODING] Error completing challenge ${quiz.id}:`, error);
        // Continue with next
      }
    }

    if (attempts.length > 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LIVE_CODING,
        targetId: attempts[0]?.quizId,
        details: { completedCount: attempts.length },
        success: true,
      });
    }

    return { success: true, completed: attempts.length };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.LIVE_CODING,
      success: false,
      errorMessage: error.message || "Failed to complete live coding",
    });
    return { success: false, completed: 0, error: error.message };
  }
}

