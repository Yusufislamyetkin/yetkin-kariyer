import { db } from "@/lib/db";
import { generateCertificateNumber } from "./certificate-utils";
import { normalizeCourseContent } from "@/lib/education/courseContent";

/**
 * Checks if a user has completed all lessons in a course
 */
export async function checkCourseCompletion(
  userId: string,
  courseId: string
): Promise<{ completed: boolean; totalLessons: number; completedLessons: number }> {
  // Get course with content
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      content: true,
      expertise: true,
      topic: true,
    },
  });

  if (!course) {
    return { completed: false, totalLessons: 0, completedLessons: 0 };
  }

  // Extract all lesson slugs from course content
  // We need to normalize the content similar to how the API does it
  const normalizedContent = normalizeCourseContent(
    course.content,
    null,
    null
  );
  
  // Build lesson slugs from normalized content
  const allLessonSlugs: string[] = [];
  const modules = Array.isArray(normalizedContent.modules) ? normalizedContent.modules : [];
  
  // Determine course expertise for building lesson hrefs (for old format)
  const courseExpertise = course.expertise?.toLowerCase().replace(/\s+/g, '-') || 
                         course.topic?.toLowerCase().replace(/\s+/g, '-') || 
                         (course.id.includes('java') ? 'java' : 
                          course.id.includes('dotnet') ? 'dotnet-core' : 
                          course.id.includes('nodejs') ? 'nodejs' : 'java');
  
  for (const moduleItem of modules) {
    if (!moduleItem || typeof moduleItem !== "object") continue;
    
    // Check for relatedTopics (new format)
    const relatedTopics = Array.isArray((moduleItem as any).relatedTopics)
      ? ((moduleItem as any).relatedTopics as Array<Record<string, any>>)
      : [];
    
    // Check for lessons (old format)
    const lessons = Array.isArray((moduleItem as any).lessons)
      ? ((moduleItem as any).lessons as Array<Record<string, any>>)
      : [];
    
    // Extract from relatedTopics
    for (const topic of relatedTopics) {
      if (topic?.href && typeof topic.href === "string") {
        allLessonSlugs.push(topic.href);
      }
    }
    
    // Extract from lessons (old format) - build href similar to API
    for (const lesson of lessons) {
      if (lesson?.slug && typeof lesson.slug === "string") {
        const moduleId = (moduleItem as any).id || '';
        const lessonSlug = lesson.slug;
        const href = `/education/lessons/${courseExpertise}/${moduleId}/${lessonSlug}`;
        allLessonSlugs.push(href);
      } else if (lesson?.href && typeof lesson.href === "string") {
        allLessonSlugs.push(lesson.href);
      }
    }
  }
  
  const uniqueLessonSlugs = [...new Set(allLessonSlugs)];
  const totalLessons = uniqueLessonSlugs.length;

  if (totalLessons === 0) {
    return { completed: false, totalLessons: 0, completedLessons: 0 };
  }

  // Get all completed lessons for this user and course
  const completedLessons = await db.lessonCompletion.findMany({
    where: {
      userId,
      courseId,
      lessonSlug: { in: uniqueLessonSlugs },
      completedAt: { not: null },
      miniTestPassed: true,
    },
    select: {
      lessonSlug: true,
    },
  });

  const completedLessonSlugs = new Set(completedLessons.map((l: any) => l.lessonSlug));
  const completedCount = uniqueLessonSlugs.filter((slug) =>
    completedLessonSlugs.has(slug)
  ).length;

  return {
    completed: completedCount === totalLessons,
    totalLessons,
    completedLessons: completedCount,
  };
}

/**
 * Generates a certificate for a user who completed a course
 */
export async function generateCertificate(
  userId: string,
  courseId: string,
  userName?: string
): Promise<{ id: string; certificateNumber: string } | null> {
  // Check if certificate already exists
  const existingCertificate = await db.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingCertificate) {
    return {
      id: existingCertificate.id,
      certificateNumber: existingCertificate.certificateNumber,
    };
  }

  // Verify course completion
  const completionStatus = await checkCourseCompletion(userId, courseId);
  if (!completionStatus.completed) {
    throw new Error("Course is not completed yet");
  }

  // Get course details
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // Get user details for name
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
    },
  });

  // Use provided userName, fallback to user.name, or "Kullanıcı"
  const displayName = userName || user?.name || "Kullanıcı";

  // Generate certificate
  const certificateNumber = generateCertificateNumber();
  const certificate = await db.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber,
      userName: displayName,
      courseName: course.title,
    },
  });

  return {
    id: certificate.id,
    certificateNumber: certificate.certificateNumber,
  };
}

/**
 * Gets a certificate by its number (for verification)
 */
export async function getCertificateByNumber(
  certificateNumber: string
): Promise<{
  id: string;
  userName: string;
  courseName: string;
  issuedAt: Date;
  certificateNumber: string;
  userId: string;
  courseId: string;
} | null> {
  const certificate = await db.certificate.findUnique({
    where: { certificateNumber },
    select: {
      id: true,
      userName: true,
      courseName: true,
      issuedAt: true,
      certificateNumber: true,
      userId: true,
      courseId: true,
    },
  });

  return certificate;
}

/**
 * Gets all certificates for a user
 */
export async function getUserCertificates(userId: string) {
  const certificates = await db.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return certificates;
}

/**
 * Gets a certificate by ID (with user verification)
 */
export async function getCertificateById(
  certificateId: string,
  userId?: string
) {
  const certificate = await db.certificate.findUnique({
    where: { id: certificateId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!certificate) {
    return null;
  }

  // If userId is provided, verify ownership
  if (userId && certificate.userId !== userId) {
    return null;
  }

  return certificate;
}

