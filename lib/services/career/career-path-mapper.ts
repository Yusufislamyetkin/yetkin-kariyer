/**
 * Career Path Mapper Service
 * Maps technology names and course titles to actual course/test IDs in the database
 */

import { db } from "@/lib/db";

export interface CourseMatch {
  courseId: string;
  title: string;
  found: boolean;
}

export interface TestMatch {
  quizIds: string[];
  technology: string;
  found: boolean;
}

export interface LiveCodingMatch {
  quizIds: string[];
  language: string;
  found: boolean;
}

/**
 * Find course by title, topic, or expertise
 */
export async function findCourseByMetadata(params: {
  courseTitle?: string;
  topic?: string;
  expertise?: string;
}): Promise<CourseMatch | null> {
  const { courseTitle, topic, expertise } = params;

  if (!courseTitle && !topic && !expertise) {
    return null;
  }

  try {
    // Build where clause
    const where: any = {};

    if (courseTitle) {
      // Try exact match first
      let course = await db.course.findFirst({
        where: {
          title: {
            equals: courseTitle,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      // If no exact match, try contains
      if (!course) {
        course = await db.course.findFirst({
          where: {
            title: {
              contains: courseTitle,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            title: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      if (course) {
        return {
          courseId: course.id,
          title: course.title,
          found: true,
        };
      }
    }

    // Try by topic and expertise
    if (topic || expertise) {
      const whereClause: any = {};
      if (topic) {
        whereClause.topic = {
          equals: topic,
          mode: "insensitive",
        };
      }
      if (expertise) {
        whereClause.expertise = {
          equals: expertise,
          mode: "insensitive",
        };
      }

      const course = await db.course.findFirst({
        where: whereClause,
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (course) {
        return {
          courseId: course.id,
          title: course.title,
          found: true,
        };
      }
    }

    // Try partial matching by splitting the search title
    if (courseTitle) {
      const words = courseTitle
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2);

      for (const word of words) {
        const course = await db.course.findFirst({
          where: {
            title: {
              contains: word,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            title: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (course) {
          return {
            courseId: course.id,
            title: course.title,
            found: true,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("[CAREER_PATH_MAPPER] Error finding course:", error);
    return null;
  }
}

/**
 * Find tests/quizzes by technology and topic
 */
export async function findTestsByMetadata(params: {
  technology?: string;
  topic?: string;
}): Promise<TestMatch | null> {
  const { technology, topic } = params;

  if (!technology && !topic) {
    return null;
  }

  try {
    const where: any = {
      type: {
        not: "MINI_TEST",
      },
    };

    // Build OR conditions for technology/topic matching
    const orConditions: any[] = [];

    if (technology) {
      // Normalize technology name
      const normalizedTech = technology.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      orConditions.push(
        { topic: { contains: technology, mode: "insensitive" } },
        { topic: { contains: normalizedTech, mode: "insensitive" } }
      );

      // Also check course relation
      orConditions.push({
        course: {
          OR: [
            { topic: { contains: technology, mode: "insensitive" } },
            { topic: { contains: normalizedTech, mode: "insensitive" } },
            { expertise: { contains: technology, mode: "insensitive" } },
          ],
        },
      });
    }

    if (topic) {
      orConditions.push({ topic: { contains: topic, mode: "insensitive" } });
      orConditions.push({
        course: {
          topic: { contains: topic, mode: "insensitive" },
        },
      });
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const quizzes = await db.quiz.findMany({
      where,
      select: {
        id: true,
        title: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit results
    });

    if (quizzes.length > 0) {
      return {
        quizIds: quizzes.map((q: { id: string; title: string; type: string }) => q.id),
        technology: technology || topic || "",
        found: true,
      };
    }

    return null;
  } catch (error) {
    console.error("[CAREER_PATH_MAPPER] Error finding tests:", error);
    return null;
  }
}

/**
 * Find live coding quizzes by language and technology
 */
export async function findLiveCodingByMetadata(params: {
  language?: string;
  technology?: string;
}): Promise<LiveCodingMatch | null> {
  const { language, technology } = params;

  if (!language && !technology) {
    return null;
  }

  try {
    const where: any = {
      type: "LIVE_CODING",
    };

    const orConditions: any[] = [];

    if (language) {
      // Normalize language name
      const normalizedLang = language.toLowerCase();
      const langVariants: Record<string, string[]> = {
        csharp: ["c#", "csharp", "dotnet", ".net"],
        javascript: ["js", "javascript", "nodejs", "node.js"],
        typescript: ["ts", "typescript"],
        python: ["py", "python"],
        java: ["java"],
        php: ["php"],
        go: ["golang", "go"],
        rust: ["rust"],
        cpp: ["c++", "cpp", "cplusplus"],
        kotlin: ["kotlin"],
        ruby: ["ruby"],
      };

      const variants = langVariants[normalizedLang] || [normalizedLang];
      
      for (const variant of variants) {
        orConditions.push({
          title: { contains: variant, mode: "insensitive" },
        });
        orConditions.push({
          topic: { contains: variant, mode: "insensitive" },
        });
      }
    }

    if (technology) {
      orConditions.push({
        title: { contains: technology, mode: "insensitive" },
      });
      orConditions.push({
        topic: { contains: technology, mode: "insensitive" },
      });
      orConditions.push({
        course: {
          OR: [
            { topic: { contains: technology, mode: "insensitive" } },
            { expertise: { contains: technology, mode: "insensitive" } },
          ],
        },
      });
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const quizzes = await db.quiz.findMany({
      where,
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit results
    });

    if (quizzes.length > 0) {
      return {
        quizIds: quizzes.map((q: { id: string; title: string; type: string }) => q.id),
        language: language || technology || "",
        found: true,
      };
    }

    return null;
  } catch (error) {
    console.error("[CAREER_PATH_MAPPER] Error finding live coding:", error);
    return null;
  }
}

/**
 * Map technology name to common variations
 */
export function normalizeTechnologyName(tech: string): string {
  const normalized = tech.toLowerCase().trim();
  
  const mappings: Record<string, string> = {
    "dotnet": ".net core",
    "dotnet-core": ".net core",
    ".net": ".net core",
    ".net core": ".net core",
    "net core": ".net core",
    "docker": "docker",
    "sql": "sql",
    "react": "react",
    "typescript": "typescript",
    "nodejs": "node.js",
    "node.js": "node.js",
    "node": "node.js",
  };

  return mappings[normalized] || normalized;
}

/**
 * Get course link URL
 */
export function getCourseLink(courseId: string): string {
  return `/education/courses/${courseId}`;
}

/**
 * Get test link URL
 */
export function getTestLink(technology: string, module?: string): string {
  const normalizedTech = technology.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (module) {
    return `/education/tests/${normalizedTech}/${module}`;
  }
  return `/education/tests/${normalizedTech}`;
}

/**
 * Get live coding link URL
 */
export function getLiveCodingLink(quizId: string): string {
  return `/education/live-coding/${quizId}`;
}

