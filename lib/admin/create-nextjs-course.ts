import { readFileSync } from "fs";
import { join } from "path";
import { CourseContent } from "@/types/course-content";

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

interface SimpleCourseContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

/**
 * Read Next.js course content from JSON file and convert to CourseContent type
 */
export async function createNextJSCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Next.js course creation from JSON...");

  try {
    // Read JSON file
    const filePath = join(process.cwd(), "lib", "admin", "nextjs-course-content.json");
    const fileContents = readFileSync(filePath, "utf-8");
    const jsonContent: SimpleCourseContent = JSON.parse(fileContents);

    // Convert to CourseContent type
    const courseContent: CourseContent = {
      overview: {
        description: jsonContent.overview.description,
        targetAudience: ["Frontend Developer", "Full Stack Developer", "Web Developer"],
        skills: [
          "Next.js",
          "React",
          "Server-Side Rendering",
          "Static Site Generation",
          "API Development",
          "Performance Optimization",
        ],
        estimatedDurationMinutes: jsonContent.overview.estimatedDurationMinutes,
        outcomes: [
          "Production-ready Next.js uygulamaları geliştirebilme",
          "SSR ve SSG tekniklerini uygulayabilme",
          "Next.js API Routes ile backend geliştirebilme",
          "Performance optimizasyonu yapabilme",
          "Modern web uygulamaları deploy edebilme",
        ],
      },
      learningObjectives: jsonContent.learningObjectives,
      prerequisites: jsonContent.prerequisites,
      modules: jsonContent.modules.map((module) => ({
        id: module.id,
        title: module.title,
        summary: module.summary,
        durationMinutes: module.durationMinutes,
        objectives: module.objectives,
        activities: [],
        relatedTopics: module.relatedTopics.map((topic) => ({
          label: topic.label,
          href: topic.href,
          description: topic.description,
        })),
      })),
      resources: [
        {
          id: "nextjs-docs",
          title: "Next.js Documentation",
          url: "https://nextjs.org/docs",
          type: "documentation",
          description: "Official Next.js documentation",
        },
        {
          id: "react-docs",
          title: "React Documentation",
          url: "https://react.dev",
          type: "documentation",
          description: "Official React documentation",
        },
        {
          id: "vercel",
          title: "Vercel Platform",
          url: "https://vercel.com",
          type: "tool",
          description: "Deploy and host Next.js applications",
        },
      ],
    };

    const totalModules = courseContent.modules.length;
    const totalLessons = courseContent.modules.reduce(
      (sum, module) => sum + (module.relatedTopics?.length || 0),
      0
    );

    console.log(
      `[CREATE_COURSE] Course creation completed. Total modules: ${totalModules}, Total lessons: ${totalLessons}`
    );

    return courseContent;
  } catch (error: any) {
    console.error("[CREATE_COURSE] Error reading or parsing JSON file:", error);
    throw new Error(
      error.message || "Next.js kurs içeriği JSON dosyası okunurken bir hata oluştu"
    );
  }
}

