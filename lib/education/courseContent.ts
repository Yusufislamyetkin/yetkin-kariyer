import type { Prisma } from "@prisma/client";

type CourseContentShape = {
  overview?: {
    description?: string;
    estimatedDurationMinutes?: number;
  };
  modules?: unknown;
  learningObjectives?: unknown;
  prerequisites?: unknown;
  resources?: unknown;
  capstone?: unknown;
};

export function parseCourseContent(content: Prisma.JsonValue | null): CourseContentShape | null {
  if (!content) {
    return null;
  }

  if (typeof content === "object") {
    return content as CourseContentShape;
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return parsed && typeof parsed === "object" ? (parsed as CourseContentShape) : null;
    } catch {
      return null;
    }
  }

  return null;
}

const ensureArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export function normalizeCourseContent(
  rawContent: Prisma.JsonValue | null,
  estimatedDuration: number | null,
  fallbackDescription: string | null
) {
  const parsed = parseCourseContent(rawContent) ?? {};
  const overview = parsed.overview ?? {};

  const safeOverview = {
    description:
      typeof overview.description === "string" && overview.description.trim().length > 0
        ? overview.description
        : fallbackDescription ?? "Bu kurs için detaylı açıklama henüz eklenmedi.",
    estimatedDurationMinutes:
      typeof overview.estimatedDurationMinutes === "number" && overview.estimatedDurationMinutes > 0
        ? overview.estimatedDurationMinutes
        : estimatedDuration ?? 0,
  };

  // Normalize modules and ensure relatedTopics is properly set
  const rawModules = ensureArray<Record<string, unknown>>(parsed.modules);
  const normalizedModules = rawModules.map((module: any) => {
    // Convert Java format (lessons) to relatedTopics format if needed
    // This conversion will be done in API route with course context
    // Here we just ensure relatedTopics exists as an array
    
    // Ensure relatedTopics is always an array
    return {
      ...module,
      relatedTopics: Array.isArray(module.relatedTopics) ? module.relatedTopics : [],
      objectives: Array.isArray(module.objectives) ? module.objectives : [],
    };
  });

  return {
    ...parsed,
    overview: safeOverview,
    modules: normalizedModules,
    learningObjectives: ensureArray<string>(parsed.learningObjectives),
    prerequisites: ensureArray<string>(parsed.prerequisites),
    resources: ensureArray<Record<string, unknown>>(parsed.resources),
    capstone:
      parsed.capstone && typeof parsed.capstone === "object" ? parsed.capstone : null,
  };
}

export type NormalizedCourseContent = ReturnType<typeof normalizeCourseContent>;


