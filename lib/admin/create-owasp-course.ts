import * as fs from "fs";
import * as path from "path";
import { db } from "@/lib/db";

interface CourseJson {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    field: string;
    subCategory?: string;
    expertise?: string;
    topic?: string;
    topicContent?: string;
    difficulty: string;
    content: {
      overview: {
        description: string;
        targetAudience?: string[];
        skills?: string[];
        estimatedDurationMinutes: number;
        outcomes?: string[];
      };
      prerequisites?: string[];
      learningObjectives?: string[];
      modules: Array<{
        id: string;
        title: string;
        summary: string;
        durationMinutes: number;
        objectives: string[];
        lessons: Array<{
          id: string;
          title: string;
          type: string;
          durationMinutes: number;
          slug: string;
          resources: any[];
        }>;
      }>;
    };
    estimatedDuration?: number;
  };
}

/**
 * Create OWASP & Web Security course from JSON file
 */
export async function createOwaspCourse(): Promise<{
  modulesCreated: number;
  lessonsCreated: number;
  totalDuration: number;
}> {
  console.log("[CREATE_OWASP_COURSE] Starting OWASP course creation from JSON...");

  try {
    const jsonFilePath = path.join(process.cwd(), "data", "seed-data", "owasp-course.json");

    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSON dosyası bulunamadı: ${jsonFilePath}`);
    }

    const content = fs.readFileSync(jsonFilePath, "utf-8");
    const data: CourseJson = JSON.parse(content);

    if (!data.course || !data.course.content || !data.course.content.modules) {
      throw new Error("Geçersiz JSON yapısı: course.content.modules bulunamadı");
    }

    const courseData = data.course;
    const courseContent = courseData.content;

    // Calculate totals
    const totalModules = courseContent.modules.length;
    const totalLessons = courseContent.modules.reduce(
      (sum, module) => sum + (module.lessons?.length || 0),
      0
    );
    const totalDuration = courseContent.overview.estimatedDurationMinutes || 0;

    console.log(
      `[CREATE_OWASP_COURSE] Course data loaded. Modules: ${totalModules}, Lessons: ${totalLessons}`
    );

    // Transform modules to match the expected format
    // The database expects modules with relatedTopics (lessons)
    const transformedModules = courseContent.modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      durationMinutes: module.durationMinutes,
      objectives: module.objectives,
      relatedTopics: module.lessons.map((lesson) => ({
        label: lesson.title,
        href: `/education/lessons/owasp-security/${lesson.slug}`,
        description: lesson.title,
      })),
    }));

    // Transform to CourseContent format
    const transformedContent = {
      overview: courseContent.overview,
      learningObjectives: courseContent.learningObjectives || [],
      prerequisites: courseContent.prerequisites || [],
      modules: transformedModules,
    };

    // Save course to database
    await db.course.upsert({
      where: { id: courseData.id },
      create: {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        field: courseData.field,
        subCategory: courseData.subCategory,
        expertise: courseData.expertise,
        topic: courseData.topic,
        topicContent: courseData.topicContent,
        difficulty: courseData.difficulty,
        estimatedDuration: totalDuration,
        content: transformedContent as any,
      },
      update: {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        field: courseData.field,
        subCategory: courseData.subCategory,
        expertise: courseData.expertise,
        topic: courseData.topic,
        topicContent: courseData.topicContent,
        difficulty: courseData.difficulty,
        estimatedDuration: totalDuration,
        content: transformedContent as any,
        updatedAt: new Date(),
      },
    });

    console.log(
      `[CREATE_OWASP_COURSE] Course created successfully. Modules: ${totalModules}, Lessons: ${totalLessons}`
    );

    return {
      modulesCreated: totalModules,
      lessonsCreated: totalLessons,
      totalDuration,
    };
  } catch (error: any) {
    console.error("[CREATE_OWASP_COURSE] Error:", error);
    throw new Error(error.message || "Kurs oluşturulurken bir hata oluştu");
  }
}

