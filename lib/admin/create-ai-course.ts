import fs from "fs";
import path from "path";

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

interface JsonCourseData {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  modules: Array<{
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
  }>;
}

/**
 * Create complete AI for Developers course structure from JSON file
 */
export async function createAICourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting AI for Developers course creation...");

  // Read JSON file
  const jsonPath = path.join(
    process.cwd(),
    "data",
    "lesson-contents",
    "ai-for-developers-course.json"
  );

  let jsonData: JsonCourseData;
  try {
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    jsonData = JSON.parse(fileContent);
  } catch (error: any) {
    console.error(
      "[CREATE_COURSE] Error reading JSON file:",
      error.message
    );
    throw new Error(
      `JSON dosyası okunurken hata oluştu: ${error.message}`
    );
  }

  // Convert JSON data to CourseContent format
  const courseContent: CourseContent = {
    overview: {
      description: jsonData.overview.description,
      estimatedDurationMinutes: jsonData.overview.estimatedDurationMinutes,
    },
    learningObjectives: jsonData.learningObjectives,
    prerequisites: jsonData.prerequisites,
    modules: jsonData.modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      durationMinutes: module.durationMinutes,
      objectives: module.objectives,
      relatedTopics: module.relatedTopics.map((topic) => ({
        label: topic.label,
        href: topic.href,
        description: topic.description,
      })),
    })),
  };

  console.log(
    `[CREATE_COURSE] Course creation completed. Total modules: ${courseContent.modules.length}, Total lessons: ${courseContent.modules.reduce(
      (sum, m) => sum + m.relatedTopics.length,
      0
    )}`
  );

  return courseContent;
}

