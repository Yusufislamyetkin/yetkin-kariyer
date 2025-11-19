import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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

export async function POST() {
  try {
    // Check admin authorization
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[CREATE_COURSE_API] Starting Ethical Hacking course creation...");

    // Read JSON file
    let courseContent: CourseContent;
    try {
      const jsonFilePath = path.join(process.cwd(), "data", "ethical-hacking-course.json");
      
      if (!fs.existsSync(jsonFilePath)) {
        console.error("[CREATE_COURSE_API] JSON file not found:", jsonFilePath);
        return NextResponse.json(
          {
            success: false,
            error: "Kurs JSON dosyası bulunamadı",
          },
          { status: 404 }
        );
      }

      const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
      courseContent = JSON.parse(fileContent) as CourseContent;
      
      console.log("[CREATE_COURSE_API] JSON file loaded successfully");
    } catch (error: any) {
      console.error("[CREATE_COURSE_API] Error reading JSON file:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "JSON dosyası okunurken bir hata oluştu",
        },
        { status: 500 }
      );
    }

    // Save course to database
    try {
      const course = await db.course.upsert({
        where: { id: "course-ethical-hacking" },
        create: {
          id: "course-ethical-hacking",
          title: "Ethical Hacking Kursu",
          description: courseContent.overview.description,
          category: "Security",
          field: "Cybersecurity",
          difficulty: "intermediate",
          estimatedDuration: courseContent.overview.estimatedDurationMinutes,
          content: courseContent as any,
        },
        update: {
          title: "Ethical Hacking Kursu",
          description: courseContent.overview.description,
          category: "Security",
          field: "Cybersecurity",
          difficulty: "intermediate",
          estimatedDuration: courseContent.overview.estimatedDurationMinutes,
          content: courseContent as any,
          updatedAt: new Date(),
        },
      });

      const totalModules = courseContent.modules.length;
      const totalLessons = courseContent.modules.reduce(
        (sum, module) => sum + module.relatedTopics.length,
        0
      );

      console.log(
        `[CREATE_COURSE_API] Course created successfully. Modules: ${totalModules}, Lessons: ${totalLessons}`
      );

      return NextResponse.json({
        success: true,
        message: `Ethical Hacking kursu başarıyla oluşturuldu. ${totalModules} modül ve ${totalLessons} ders eklendi.`,
        stats: {
          modulesCreated: totalModules,
          lessonsCreated: totalLessons,
          totalDuration: courseContent.overview.estimatedDurationMinutes,
        },
      });
    } catch (error: any) {
      console.error("[CREATE_COURSE_API] Error saving course to database:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Kurs veritabanına kaydedilirken bir hata oluştu",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[CREATE_COURSE_API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Kurs oluşturulurken beklenmeyen bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

