import type { Prisma } from "@prisma/client";
import crypto from "crypto";

/**
 * Extracts all lesson slugs from course content
 */
export function extractAllLessonSlugs(courseContent: Prisma.JsonValue | null): string[] {
  if (!courseContent || typeof courseContent !== "object") {
    return [];
  }

  const content = courseContent as any;
  const modules = Array.isArray(content.modules) ? content.modules : [];
  const lessonSlugs: string[] = [];

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
        lessonSlugs.push(topic.href);
      }
    }

    // Extract from lessons (old format)
    for (const lesson of lessons) {
      if (lesson?.slug && typeof lesson.slug === "string") {
        // Build href from module and lesson slug if needed
        const moduleId = moduleItem.id || "";
        const lessonSlug = lesson.slug;
        // This might need adjustment based on your URL structure
        lessonSlugs.push(`/education/lessons/${moduleId}/${lessonSlug}`);
      } else if (lesson?.href && typeof lesson.href === "string") {
        lessonSlugs.push(lesson.href);
      }
    }
  }

  return [...new Set(lessonSlugs)]; // Remove duplicates
}

/**
 * Generates a unique certificate number
 * Format: CERT-YYYY-XXXXXX (where XXXXXX is random alphanumeric)
 */
export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `CERT-${year}-${randomPart}`;
}

/**
 * Formats date for certificate display
 */
export function formatCertificateDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats date in short format for certificate
 */
export function formatCertificateDateShort(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

