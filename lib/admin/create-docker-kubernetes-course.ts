import { readFileSync } from "fs";
import { join } from "path";

interface CourseModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  relatedTopics: Array<{
    label: string;
    href: string;
    description: string;
  }>;
}

interface CourseContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

/**
 * Create Docker & Kubernetes course structure from JSON file
 */
export async function createDockerKubernetesCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Docker & Kubernetes course creation from JSON...");

  try {
    // Read JSON file
    const jsonPath = join(process.cwd(), "lib", "admin", "docker-kubernetes-course.json");
    const jsonContent = readFileSync(jsonPath, "utf-8");
    const courseContent: CourseContent = JSON.parse(jsonContent);

    // Validate structure
    if (!courseContent.overview || !courseContent.modules || !Array.isArray(courseContent.modules)) {
      throw new Error("Invalid course content structure in JSON file");
    }

    const totalModules = courseContent.modules.length;
    const totalLessons = courseContent.modules.reduce(
      (sum, module) => sum + (module.relatedTopics?.length || 0),
      0
    );

    console.log(
      `[CREATE_COURSE] Course content loaded from JSON. Total modules: ${totalModules}, Total lessons: ${totalLessons}`
    );

    return courseContent;
  } catch (error: any) {
    console.error("[CREATE_COURSE] Error reading course content from JSON:", error);
    throw new Error(
      `Failed to load course content from JSON: ${error.message || "Unknown error"}`
    );
  }
}

