import * as fs from "fs";
import * as path from "path";

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
 * Create complete Flutter course structure by reading from JSON file
 */
export async function createFlutterCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Flutter course creation...");

  const jsonFilePath = path.join(process.cwd(), "data", "flutter-course-content.json");

  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(`Flutter course JSON file not found: ${jsonFilePath}`);
  }

  const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
  const courseContent: CourseContent = JSON.parse(fileContent);

  // Validate structure
  if (!courseContent.modules || !Array.isArray(courseContent.modules)) {
    throw new Error("Invalid JSON structure: modules array not found");
  }

  if (courseContent.modules.length !== 15) {
    throw new Error(`Expected 15 modules, but found ${courseContent.modules.length}`);
  }

  const totalLessons = courseContent.modules.reduce(
    (sum, module) => sum + module.relatedTopics.length,
    0
  );

  if (totalLessons !== 225) {
    throw new Error(`Expected 225 lessons, but found ${totalLessons}`);
  }

  console.log(
    `[CREATE_COURSE] Course creation completed. Total modules: ${courseContent.modules.length}, Total lessons: ${totalLessons}`
  );

  return courseContent;
}

