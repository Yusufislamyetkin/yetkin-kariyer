import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFileSync } from "fs";
import { join } from "path";

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

    console.log("[CREATE_COURSE_API] Starting Java course creation...");

    // Read JSON file
    let courseData;
    try {
      const jsonPath = join(process.cwd(), "DB-Seeds", "JSON", "seed-course-java.json");
      const jsonContent = readFileSync(jsonPath, "utf-8");
      courseData = JSON.parse(jsonContent);
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

    // Extract course content from JSON
    const courseContent = courseData.course.content;
    const courseInfo = courseData.course;

    // Calculate total modules and lessons
    const totalModules = courseContent.modules.length;
    const totalLessons = courseContent.modules.reduce(
      (sum: number, module: any) => sum + (module.lessons?.length || 0),
      0
    );

    // Save course to database
    try {
      const course = await db.course.upsert({
        where: { id: "course-java-roadmap" },
        create: {
          id: "course-java-roadmap",
          title: "Java Kursu",
          description: courseContent.overview.description,
          category: "Backend",
          field: "Software Development",
          expertise: "Java", // Test oluşturma API'si için gerekli
          difficulty: "intermediate",
          estimatedDuration: courseContent.overview.estimatedDurationMinutes,
          content: courseContent as any,
        },
        update: {
          title: "Java Kursu",
          description: courseContent.overview.description,
          category: "Backend",
          field: "Software Development",
          expertise: "Java", // Test oluşturma API'si için gerekli
          difficulty: "intermediate",
          estimatedDuration: courseContent.overview.estimatedDurationMinutes,
          content: courseContent as any,
          updatedAt: new Date(),
        },
      });

      console.log(
        `[CREATE_COURSE_API] Course created successfully. Modules: ${totalModules}, Lessons: ${totalLessons}`
      );

      return NextResponse.json({
        success: true,
        message: `Java kursu başarıyla oluşturuldu. 15 modül ve 225 ders eklendi. Modüller: 15 Dersler: 225`,
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

