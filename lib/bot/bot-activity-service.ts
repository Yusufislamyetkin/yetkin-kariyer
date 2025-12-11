import { db } from "@/lib/db";
import { logBotActivity } from "./bot-activity-logger";
import { BotActivityType } from "@prisma/client";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";
import { checkBadgesForActivity } from "@/app/api/badges/check/badge-service";
import { selectRandomUnusedSource, markSourceAsUsed } from "./bot-news-tracker";
import { NewsSource } from "./news-sources";
import { findTestsByMetadata } from "@/lib/services/career/career-path-mapper";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

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
 * Normalize technology name to standard format
 * Maps various technology names to normalized versions
 */
function normalizeTechnology(tech: string): string {
  if (!tech) return "";
  
  const normalized = tech.toLowerCase().trim();
  
  // Technology name mappings
  const techMap: Record<string, string> = {
    "c#": "csharp",
    "csharp": "csharp",
    ".net": "dotnet-core",
    ".net core": "dotnet-core",
    "dotnet": "dotnet-core",
    "dotnet-core": "dotnet-core",
    "node.js": "nodejs",
    "nodejs": "nodejs",
    "node": "nodejs",
    "javascript": "javascript",
    "js": "javascript",
    "typescript": "typescript",
    "ts": "typescript",
    "python": "python",
    "py": "python",
    "java": "java",
    "react": "react",
    "angular": "angular",
    "vue": "vuejs",
    "vue.js": "vuejs",
    "vuejs": "vuejs",
    "next.js": "nextjs",
    "nextjs": "nextjs",
    "spring boot": "spring-boot",
    "springboot": "spring-boot",
    "spring-boot": "spring-boot",
  };
  
  // Check direct mapping
  if (techMap[normalized]) {
    return techMap[normalized];
  }
  
  // Remove special characters and normalize
  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Get bot's registered technology
 * Tries multiple sources: BotCharacter.expertise, backend UserExpertise, or fallback to past activities
 */
async function getBotRegisteredTechnology(userId: string): Promise<string | null> {
  try {
    // 1. Try BotCharacter.expertise first
    const botCharacter = await db.botCharacter.findUnique({
      where: { userId },
      select: { expertise: true },
    });
    
    if (botCharacter?.expertise && botCharacter.expertise.length > 0) {
      // Use first expertise entry, normalize it
      const tech = normalizeTechnology(botCharacter.expertise[0]);
      if (tech) {
        return tech;
      }
    }
    
    // 2. Try backend API for UserExpertise (primary expertise)
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/user/${userId}/expertise/primary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data?.technology) {
          const tech = normalizeTechnology(data.technology);
          if (tech) {
            return tech;
          }
        }
      }
    } catch (error) {
      console.warn(`[BOT_TECH] Failed to fetch expertise from backend for ${userId}:`, error);
    }
    
    // 3. Fallback: Get technology from bot's past lesson/test completions
    const recentLessons = await db.lessonCompletion.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            topic: true,
            expertise: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 10,
    });
    
    // Extract technology from course topic/expertise
    for (const lesson of recentLessons) {
      if (lesson.course?.topic) {
        const tech = normalizeTechnology(lesson.course.topic);
        if (tech) return tech;
      }
      if (lesson.course?.expertise) {
        const tech = normalizeTechnology(lesson.course.expertise);
        if (tech) return tech;
      }
    }
    
    // Try test attempts
    const recentTests = await db.testAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            course: {
              select: {
                topic: true,
                expertise: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 10,
    });
    
    for (const test of recentTests) {
      if (test.quiz?.course?.topic) {
        const tech = normalizeTechnology(test.quiz.course.topic);
        if (tech) return tech;
      }
      if (test.quiz?.course?.expertise) {
        const tech = normalizeTechnology(test.quiz.course.expertise);
        if (tech) return tech;
      }
      if (test.quiz?.topic) {
        const tech = normalizeTechnology(test.quiz.topic);
        if (tech) return tech;
      }
    }
    
    return null;
  } catch (error: any) {
    console.error(`[BOT_TECH] Error getting bot technology for ${userId}:`, error);
    return null;
  }
}

/**
 * Generate realistic score using normal distribution
 * Returns a score between min and max, with most values around the mean
 */
function generateRealisticScore(min: number, max: number, mean: number): number {
  // Simple normal distribution approximation using Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  // Scale to desired range and mean
  const stdDev = (max - min) / 4; // Standard deviation
  let score = mean + z0 * stdDev;
  
  // Clamp to min-max range
  score = Math.max(min, Math.min(max, Math.round(score)));
  
  return score;
}

/**
 * Generate realistic duration in seconds
 * Returns duration between min and max seconds
 */
function generateRealisticDuration(minSeconds: number, maxSeconds: number): number {
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

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

          // Gamification: Record event and apply rules
          try {
            const event = await recordEvent({
              userId,
              type: "comment_created",
              payload: { commentId: comment.id, postId: post.id },
            });
            await applyRules({ userId, type: "comment_created", payload: { sourceEventId: event.id } });
          } catch (e) {
            console.warn(`[BOT_COMMENT] Gamification failed for comment ${comment.id}:`, e);
          }

          comments.push(comment);
        }
      } catch (error: any) {
        console.error(`[BOT_COMMENT] Error commenting on post ${post.id}:`, error);
        // Continue with next post
      }
    }

    if (comments.length > 0) {
      // Check badges for comment activity
      try {
        const badgeResults = await checkBadgesForActivity({
          userId,
          // activityType is optional, comment activity doesn't have a specific type
        });
        if (badgeResults.totalEarned > 0) {
          console.log(`[BOT_COMMENT] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
        }
      } catch (e) {
        console.warn(`[BOT_COMMENT] Badge check failed:`, e);
      }

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
 * Now generates LinkedIn-format posts (professional, no slang/typos)
 */
export async function createPost(
  userId: string,
  generatePostContent: (newsSource?: NewsSource) => Promise<string>,
  botExpertise?: string[]
) {
  try {
    // Haber kaynağı seç (bot'un kullanmadığı kaynaklardan) - optional for LinkedIn posts
    let selectedSource: NewsSource | null = null;
    try {
      selectedSource = await selectRandomUnusedSource(userId, botExpertise);
      if (selectedSource) {
        // Kaynağı kullanıldı olarak işaretle
        await markSourceAsUsed(userId, selectedSource.id);
      }
    } catch (error: any) {
      console.warn(`[BOT_POST] Error selecting news source for bot ${userId}:`, error);
      // Devam et, kaynak olmadan da post oluşturulabilir (LinkedIn formatında)
    }

    // generatePostContent() now generates LinkedIn-format posts
    const content = await generatePostContent(selectedSource || undefined);
    if (!content || content.trim().length === 0) {
      throw new Error("Generated content is empty");
    }

    const post = await db.post.create({
      data: {
        userId,
        content: content.trim().substring(0, 2200), // Limit to 2200 chars
      },
    });

    // Gamification: Record event and apply rules
    try {
      const event = await recordEvent({
        userId,
        type: "post_created",
        payload: { postId: post.id },
      });
      await applyRules({ userId, type: "post_created", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn(`[BOT_POST] Gamification failed:`, e);
    }

    // Check badges for post activity
    try {
      const badgeResults = await checkBadgesForActivity({
        userId,
        // activityType is optional, post activity doesn't have a specific type
      });
      if (badgeResults.totalEarned > 0) {
        console.log(`[BOT_POST] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
      }
    } catch (e) {
      console.warn(`[BOT_POST] Badge check failed:`, e);
    }

    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      targetId: post.id,
      details: {
        contentLength: post.content?.length || 0,
        postType: "linkedin",
        newsSourceId: selectedSource?.id,
        newsSourceName: selectedSource?.name,
      },
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
 * Create a LinkedIn-format post (AI-generated content)
 */
export async function createLinkedInPost(
  userId: string,
  generateLinkedInPost: (topic: string, postType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => Promise<string>,
  topic: string,
  postType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  botExpertise?: string[]
) {
  try {
    const content = await generateLinkedInPost(topic, postType);
    if (!content || content.trim().length === 0) {
      throw new Error("Generated LinkedIn post content is empty");
    }

    const post = await db.post.create({
      data: {
        userId,
        content: content.trim().substring(0, 2200), // Limit to 2200 chars
      },
    });

    // Gamification: Record event and apply rules
    try {
      const event = await recordEvent({
        userId,
        type: "post_created",
        payload: { postId: post.id },
      });
      await applyRules({ userId, type: "post_created", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn(`[BOT_LINKEDIN_POST] Gamification failed:`, e);
    }

    // Check badges for post activity
    try {
      const badgeResults = await checkBadgesForActivity({
        userId,
        // activityType is optional, post activity doesn't have a specific type
      });
      if (badgeResults.totalEarned > 0) {
        console.log(`[BOT_LINKEDIN_POST] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
      }
    } catch (e) {
      console.warn(`[BOT_LINKEDIN_POST] Badge check failed:`, e);
    }

    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      targetId: post.id,
      details: {
        contentLength: post.content?.length || 0,
        postType: "linkedin",
        topic,
        postTypeId: postType,
      },
      success: true,
    });

    return { success: true, postId: post.id };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      success: false,
      errorMessage: error.message || "Failed to create LinkedIn post",
    });
    return { success: false, error: error.message };
  }
}

/**
 * Complete lessons in sequential order based on bot's registered technology
 * Lessons are solved strictly in order within each course
 */
export async function completeLessons(userId: string, count: number = 2) {
  try {
    // Get bot's registered technology
    const botTechnology = await getBotRegisteredTechnology(userId);
    
    // Get courses, filter by technology if available
    let coursesQuery: any = {
      select: {
        id: true,
        content: true,
        topic: true,
        expertise: true,
      },
    };
    
    // Filter by technology if bot has registered technology
    if (botTechnology) {
      const normalizedTech = normalizeTechnology(botTechnology);
      coursesQuery.where = {
        OR: [
          { topic: { contains: normalizedTech, mode: "insensitive" } },
          { topic: { contains: botTechnology, mode: "insensitive" } },
          { expertise: { contains: normalizedTech, mode: "insensitive" } },
          { expertise: { contains: botTechnology, mode: "insensitive" } },
        ],
      };
    }
    
    const courses = await db.course.findMany({
      ...coursesQuery,
      take: 50,
    });

    // If no courses found for technology, try without filter (fallback)
    if (courses.length === 0 && botTechnology) {
      console.log(`[BOT_LESSON] No courses found for technology ${botTechnology}, trying all courses`);
      const allCourses = await db.course.findMany({
        select: {
          id: true,
          content: true,
          topic: true,
          expertise: true,
        },
        take: 50,
      });
      courses.push(...allCourses);
    }

    if (courses.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LESSON,
        success: false,
        errorMessage: "No courses found",
      });
      return { success: false, completed: 0 };
    }

    // Extract lessons in sequential order from courses
    interface LessonInfo {
      slug: string;
      courseId: string;
      courseIndex: number;
      moduleIndex: number;
      lessonIndex: number;
    }
    
    const lessonsInOrder: LessonInfo[] = [];
    
    for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
      const course = courses[courseIndex];
      if (!course.content || typeof course.content !== "object") continue;
      
      const content = course.content as any;
      const courseExpertise = course.topic?.toLowerCase().replace(/\s+/g, '-') || 
                             course.expertise?.toLowerCase().replace(/\s+/g, '-') || 
                             content.expertise?.toLowerCase().replace(/\s+/g, '-') || 
                             content.topic?.toLowerCase().replace(/\s+/g, '-') || 
                             (course.id.includes('java') ? 'java' : 
                              course.id.includes('dotnet') ? 'dotnet-core' : 
                              course.id.includes('nodejs') ? 'nodejs' : 'java');
      
      const modules = Array.isArray(content.modules) ? content.modules : [];
      
      // Process modules in order
      for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
        const moduleItem = modules[moduleIndex];
        if (!moduleItem || typeof moduleItem !== "object") continue;
        
        // Check for relatedTopics (new format) - process in order
        const relatedTopics = Array.isArray((moduleItem as any).relatedTopics)
          ? ((moduleItem as any).relatedTopics as Array<Record<string, any>>)
          : [];
        
        for (let topicIndex = 0; topicIndex < relatedTopics.length; topicIndex++) {
          const topic = relatedTopics[topicIndex];
          if (topic?.href && typeof topic.href === "string") {
            lessonsInOrder.push({
              slug: topic.href,
              courseId: course.id,
              courseIndex,
              moduleIndex,
              lessonIndex: topicIndex,
            });
          }
        }
        
        // Check for lessons (old format within modules) - process in order
        const lessons = Array.isArray((moduleItem as any).lessons)
          ? ((moduleItem as any).lessons as Array<Record<string, any>>)
          : [];
        
        for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
          const lesson = lessons[lessonIndex];
          if (lesson?.slug && typeof lesson.slug === "string") {
            const moduleId = (moduleItem as any).id || '';
            const lessonSlug = lesson.slug;
            const href = `/education/lessons/${courseExpertise}/${moduleId}/${lessonSlug}`;
            lessonsInOrder.push({
              slug: href,
              courseId: course.id,
              courseIndex,
              moduleIndex,
              lessonIndex,
            });
          } else if (lesson?.href && typeof lesson.href === "string") {
            lessonsInOrder.push({
              slug: lesson.href,
              courseId: course.id,
              courseIndex,
              moduleIndex,
              lessonIndex,
            });
          }
        }
      }
      
      // Check for direct lessons array (old format at root level) - process in order
      if (Array.isArray(content.lessons)) {
        for (let lessonIndex = 0; lessonIndex < content.lessons.length; lessonIndex++) {
          const lesson = content.lessons[lessonIndex];
          if (lesson?.slug && typeof lesson.slug === "string") {
            lessonsInOrder.push({
              slug: lesson.slug,
              courseId: course.id,
              courseIndex,
              moduleIndex: -1,
              lessonIndex,
            });
          } else if (lesson?.href && typeof lesson.href === "string") {
            lessonsInOrder.push({
              slug: lesson.href,
              courseId: course.id,
              courseIndex,
              moduleIndex: -1,
              lessonIndex,
            });
          }
        }
      }
    }

    if (lessonsInOrder.length === 0) {
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
        lessonSlug: { in: lessonsInOrder.map(l => l.slug) },
      },
      select: {
        lessonSlug: true,
      },
    });

    const completedSlugs = new Set(completed.map((c: typeof completed[0]) => c.lessonSlug));
    
    // Filter to only incomplete lessons, maintaining order
    const availableLessons = lessonsInOrder.filter(lesson => !completedSlugs.has(lesson.slug));

    if (availableLessons.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.LESSON,
        success: true,
        details: { message: "All lessons already completed" },
      });
      return { success: true, completed: 0 };
    }

    // Take lessons in strict sequential order (no shuffling!)
    // Start from the first incomplete lesson and continue sequentially
    const toComplete = availableLessons.slice(0, Math.min(count, availableLessons.length));

    const completions = [];
    for (const lessonInfo of toComplete) {
      // Generate realistic score (70-95, mostly 80-90)
      const miniTestScore = generateRealisticScore(70, 95, 85);
      
      const completion = await db.lessonCompletion.upsert({
        where: {
          userId_lessonSlug: {
            userId,
            lessonSlug: lessonInfo.slug,
          },
        },
        update: {
          completedAt: new Date(),
        },
        create: {
          userId,
          courseId: lessonInfo.courseId,
          lessonSlug: lessonInfo.slug,
          completedAt: new Date(),
          miniTestPassed: true,
          miniTestScore,
        },
      });

      completions.push(completion);

      // Gamification: Record event and check badges for each lesson
      try {
        const event = await recordEvent({
          userId,
          type: "lesson_complete",
          payload: { lessonSlug: lessonInfo.slug },
        });
        await applyRules({ userId, type: "lesson_complete", payload: { sourceEventId: event.id } });
      } catch (e) {
        console.warn(`[BOT_LESSON] Gamification failed for lesson ${lessonInfo.slug}:`, e);
      }
    }

    // Check badges for lesson activity
    try {
      const badgeResults = await checkBadgesForActivity({
        userId,
        activityType: "ders",
      });
      if (badgeResults.totalEarned > 0) {
        console.log(`[BOT_LESSON] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
      }
    } catch (e) {
      console.warn(`[BOT_LESSON] Badge check failed:`, e);
    }

    await logBotActivity({
      userId,
      activityType: BotActivityType.LESSON,
      targetId: toComplete[0]?.slug,
      details: { 
        completedCount: completions.length,
        technology: botTechnology || "unknown",
        sequential: true,
      },
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
 * Complete tests prioritizing bot's registered technology
 * Tests are selected from registered technology first, then fallback to others
 */
export async function completeTests(
  userId: string,
  count: number = 2,
  answerQuestions: (quizId: string) => Promise<any>
) {
  try {
    // Get bot's registered technology
    const botTechnology = await getBotRegisteredTechnology(userId);
    
    // Get already completed tests (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let preferredQuizzes: any[] = [];
    let fallbackQuizzes: any[] = [];

    // If bot has registered technology, prioritize tests from that technology
    if (botTechnology) {
      const normalizedTech = normalizeTechnology(botTechnology);
      
      // Try to find tests using findTestsByMetadata
      const testMatch = await findTestsByMetadata({ technology: normalizedTech });
      
      if (testMatch?.quizIds && testMatch.quizIds.length > 0) {
        // Get full quiz data for preferred technology
        preferredQuizzes = await db.quiz.findMany({
          where: {
            id: { in: testMatch.quizIds },
            type: "TEST",
          },
          select: {
            id: true,
            title: true,
            questions: true,
            topic: true,
            course: {
              select: {
                topic: true,
                expertise: true,
              },
            },
          },
        });
      }
      
      // Also try direct query for technology matching
      if (preferredQuizzes.length === 0) {
        preferredQuizzes = await db.quiz.findMany({
          where: {
            type: "TEST",
            OR: [
              { topic: { contains: normalizedTech, mode: "insensitive" } },
              { topic: { contains: botTechnology, mode: "insensitive" } },
              {
                course: {
                  OR: [
                    { topic: { contains: normalizedTech, mode: "insensitive" } },
                    { topic: { contains: botTechnology, mode: "insensitive" } },
                    { expertise: { contains: normalizedTech, mode: "insensitive" } },
                    { expertise: { contains: botTechnology, mode: "insensitive" } },
                  ],
                },
              },
            ],
          },
          select: {
            id: true,
            title: true,
            questions: true,
            topic: true,
            course: {
              select: {
                topic: true,
                expertise: true,
              },
            },
          },
          take: 50,
        });
      }
    }

    // Get fallback quizzes (all tests if preferred is not enough)
    if (preferredQuizzes.length < count) {
      fallbackQuizzes = await db.quiz.findMany({
        where: {
          type: "TEST",
          ...(preferredQuizzes.length > 0 ? {
            id: { notIn: preferredQuizzes.map(q => q.id) },
          } : {}),
        },
        select: {
          id: true,
          title: true,
          questions: true,
          topic: true,
          course: {
            select: {
              topic: true,
              expertise: true,
            },
          },
        },
        take: 50,
      });
    }

    const allQuizzes = [...preferredQuizzes, ...fallbackQuizzes];

    if (allQuizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.TEST,
        success: false,
        errorMessage: "No tests found",
      });
      return { success: false, completed: 0 };
    }

    // Filter out already completed tests today
    const completed = await db.testAttempt.findMany({
      where: {
        userId,
        quizId: { in: allQuizzes.map((q: typeof allQuizzes[0]) => q.id) },
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
    
    // Separate available quizzes by preference
    const availablePreferred = preferredQuizzes.filter((q: typeof preferredQuizzes[0]) => !completedQuizIds.has(q.id));
    const availableFallback = fallbackQuizzes.filter((q: typeof fallbackQuizzes[0]) => !completedQuizIds.has(q.id));

    // Combine: preferred first, then fallback
    const availableQuizzes = [...availablePreferred, ...availableFallback];

    if (availableQuizzes.length === 0) {
      await logBotActivity({
        userId,
        activityType: BotActivityType.TEST,
        success: true,
        details: { message: "All available tests already completed today" },
      });
      return { success: true, completed: 0 };
    }

    // Take quizzes (preferred first, maintaining order)
    const toComplete = availableQuizzes.slice(0, Math.min(count, availableQuizzes.length));

    const attempts = [];
    for (const quiz of toComplete) {
      try {
        const answers = await answerQuestions(quiz.id);
        if (!answers) continue;

        // Calculate score
        const questions = quiz.questions as any;
        if (!Array.isArray(questions)) continue;

        // Generate realistic answers with some wrong answers (10-30% wrong)
        const wrongAnswerRate = Math.random() * 0.2 + 0.1; // 10-30%
        const wrongCount = Math.floor(questions.length * wrongAnswerRate);
        const wrongIndices = new Set<number>();
        
        // Randomly select which questions to get wrong
        while (wrongIndices.size < wrongCount && wrongIndices.size < questions.length) {
          wrongIndices.add(Math.floor(Math.random() * questions.length));
        }

        let correctCount = 0;
        const breakdown = questions.map((q: any, index: number) => {
          let selected = answers[index] ?? -1;
          const correct = q.correctAnswer ?? -1;
          
          // If this question should be wrong, select a different answer
          if (wrongIndices.has(index) && correct >= 0) {
            // Select a wrong answer (not the correct one)
            const wrongOptions = [0, 1, 2, 3].filter(opt => opt !== correct);
            if (wrongOptions.length > 0) {
              selected = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
            }
          }
          
          const isCorrect = selected === correct;
          if (isCorrect) correctCount++;
          
          return {
            questionId: q.id || index,
            selectedIndex: selected,
            correctIndex: correct,
            isCorrect,
          };
        });

        // Generate realistic score (60-95, mostly 75-90)
        const baseScore = Math.round((correctCount / questions.length) * 100);
        const realisticScore = generateRealisticScore(60, 95, 80);
        // Use the calculated score but ensure it's realistic
        const finalScore = Math.max(60, Math.min(95, Math.max(baseScore, realisticScore - 5)));

        // Generate realistic duration (3-10 minutes based on question count)
        const baseDuration = questions.length * 30; // 30 seconds per question average
        const minDuration = Math.max(180, baseDuration - 60); // At least 3 minutes
        const maxDuration = Math.min(600, baseDuration + 120); // Max 10 minutes
        const duration = generateRealisticDuration(minDuration, maxDuration);

        // Create quiz attempt
        const quizAttempt = await db.quizAttempt.create({
          data: {
            userId,
            quizId: quiz.id,
            score: finalScore,
            answers: { submitted: answers, breakdown },
            duration,
            topic: quiz.topic || null,
            level: null,
          },
        });

        // Create test attempt
        const testAttempt = await db.testAttempt.create({
          data: {
            userId,
            quizId: quiz.id,
            metrics: {
              score: finalScore,
              duration,
              correctCount,
              totalQuestions: questions.length,
            },
            completedAt: new Date(),
          },
        });

        // Gamification: Record event and apply rules
        try {
          const event = await recordEvent({
            userId,
            type: "test_complete",
            payload: { quizId: quiz.id, quizAttemptId: quizAttempt.id, score: finalScore },
          });
          await applyRules({ userId, type: "test_complete", payload: { sourceEventId: event.id } });
        } catch (e) {
          console.warn(`[BOT_TEST] Gamification failed for test ${quiz.id}:`, e);
        }

        attempts.push({ quizAttempt, testAttempt });
      } catch (error: any) {
        console.error(`[BOT_TEST] Error completing test ${quiz.id}:`, error);
        // Continue with next test
      }
    }

    if (attempts.length > 0) {
      // Check badges for test activity
      try {
        // Check badges for the last quiz attempt
        const lastAttempt = attempts[attempts.length - 1];
        if (lastAttempt?.quizAttempt?.id) {
          const { checkBadgesForAttempt } = await import("@/app/api/badges/check/badge-service");
          const badgeResults = await checkBadgesForAttempt({
            userId,
            quizAttemptId: lastAttempt.quizAttempt.id,
          });
          if (badgeResults.totalEarned > 0) {
            console.log(`[BOT_TEST] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
          }
        }
      } catch (e) {
        console.warn(`[BOT_TEST] Badge check failed:`, e);
      }

      await logBotActivity({
        userId,
        activityType: BotActivityType.TEST,
        targetId: attempts[0]?.quizAttempt.quizId,
        details: { 
          completedCount: attempts.length,
          technology: botTechnology || "unknown",
          preferredCount: availablePreferred.length,
        },
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
 * Share a badge as a post
 */
export async function shareBadgePost(
  userId: string,
  generateBadgeSharePost: (botCharacter: any, badge: any, userId: string, baseUrl?: string) => Promise<string>,
  badge: { id: string; name: string; description: string; icon: string; color: string; category: string; rarity: string },
  botCharacter?: { persona: string; systemPrompt: string; name: string; expertise?: string[] },
  baseUrl?: string
) {
  try {
    // Default bot character if not provided
    const character = botCharacter || {
      name: "Teknoloji Lideri",
      persona: "LinkedIn üzerinde geniş bir takipçi kitlesine sahip, hem teknik derinliği olan hem de hikaye anlatıcılığı güçlü bir Teknoloji Lideri ve İçerik Üreticisi",
      systemPrompt: "Sen, LinkedIn üzerinde geniş bir takipçi kitlesine sahip, hem teknik derinliği olan hem de hikaye anlatıcılığı (storytelling) güçlü bir Teknoloji Lideri ve İçerik Üreticisisin.",
      expertise: [],
    };

    const content = await generateBadgeSharePost(character, badge, userId, baseUrl);
    if (!content || content.trim().length === 0) {
      throw new Error("Generated badge share post content is empty");
    }

    const post = await db.post.create({
      data: {
        userId,
        content: content.trim().substring(0, 2200), // Limit to 2200 chars
      },
    });

    // Gamification: Record event and apply rules
    try {
      const event = await recordEvent({
        userId,
        type: "post_created",
        payload: { postId: post.id },
      });
      await applyRules({ userId, type: "post_created", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn(`[BOT_BADGE_SHARE] Gamification failed:`, e);
    }

    // Check badges for post activity
    try {
      const badgeResults = await checkBadgesForActivity({
        userId,
        // activityType is optional, post activity doesn't have a specific type
      });
      if (badgeResults.totalEarned > 0) {
        console.log(`[BOT_BADGE_SHARE] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
      }
    } catch (e) {
      console.warn(`[BOT_BADGE_SHARE] Badge check failed:`, e);
    }

    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      targetId: post.id,
      details: {
        contentLength: post.content?.length || 0,
        postType: "badge_share",
        badgeId: badge.id,
        badgeName: badge.name,
      },
      success: true,
    });

    return { success: true, postId: post.id };
  } catch (error: any) {
    await logBotActivity({
      userId,
      activityType: BotActivityType.POST,
      success: false,
      errorMessage: error.message || "Failed to share badge post",
    });
    return { success: false, error: error.message };
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

        // Gamification: Record event and apply rules
        try {
          const event = await recordEvent({
            userId,
            type: "live_coding_completed",
            payload: { quizId: quiz.id, attemptId: attempt.id },
          });
          await applyRules({ userId, type: "live_coding_completed", payload: { sourceEventId: event.id } });
        } catch (e) {
          console.warn(`[BOT_LIVE_CODING] Gamification failed for challenge ${quiz.id}:`, e);
        }

        attempts.push(attempt);
      } catch (error: any) {
        console.error(`[BOT_LIVE_CODING] Error completing challenge ${quiz.id}:`, error);
        // Continue with next
      }
    }

    if (attempts.length > 0) {
      // Check badges for live coding activity
      try {
        const badgeResults = await checkBadgesForActivity({
          userId,
          activityType: "canlı kodlama",
        });
        if (badgeResults.totalEarned > 0) {
          console.log(`[BOT_LIVE_CODING] Bot ${userId} earned ${badgeResults.totalEarned} badges`);
        }
      } catch (e) {
        console.warn(`[BOT_LIVE_CODING] Badge check failed:`, e);
      }

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

