import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFile } from "fs/promises";
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

    console.log("[CREATE_COURSE_API] Starting MSSQL course creation...");

    // Read JSON file
    let courseContent;
    try {
      const filePath = join(process.cwd(), "data", "lesson-contents", "mssql-course.json");
      const fileContent = await readFile(filePath, "utf-8");
      courseContent = JSON.parse(fileContent);
    } catch (error: any) {
      console.error("[CREATE_COURSE_API] Error reading course JSON file:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Kurs JSON dosyası okunurken bir hata oluştu",
        },
        { status: 500 }
      );
    }

    // Transform JSON structure to match database schema
    // Convert lessons to relatedTopics format
    const transformedContent = {
      overview: {
        description: courseContent.description || "Microsoft SQL Server veritabanı yönetimi ve geliştirme konularında kapsamlı bir kurs.",
        estimatedDurationMinutes: courseContent.totalLessons * 30, // 30 minutes per lesson
      },
      learningObjectives: [
        "MSSQL veritabanı yönetimini öğrenmek",
        "SQL ve T-SQL komutlarını etkili kullanmak",
        "Stored procedures, functions ve triggers geliştirmek",
        "Veritabanı performansını optimize etmek",
        "Güvenlik ve yedekleme stratejilerini uygulamak",
      ],
      prerequisites: [
        "Temel bilgisayar bilgisi",
        "Veritabanı kavramlarına aşinalık",
        "Temel programlama bilgisi (opsiyonel)",
      ],
      modules: courseContent.modules.map((module: any) => ({
        id: module.moduleId,
        title: module.moduleTitle,
        summary: `${module.moduleTitle} modülü MSSQL veritabanı yönetimi için temel konuları kapsar.`,
        durationMinutes: module.lessons.length * 30,
        objectives: [
          `${module.moduleTitle} konularını öğrenmek`,
          "Pratik örnekler ile konuları pekiştirmek",
          "Best practices uygulamak",
        ],
        relatedTopics: module.lessons.map((lesson: any) => ({
          label: lesson.label,
          href: lesson.href,
          description: lesson.description,
        })),
      })),
    };

    // Save course to database
    try {
      const course = await db.course.upsert({
        where: { id: "course-mssql-roadmap" },
        create: {
          id: "course-mssql-roadmap",
          title: "MSSQL Kursu",
          description: transformedContent.overview.description,
          category: "Database",
          field: "Database Management",
          difficulty: "intermediate",
          estimatedDuration: transformedContent.overview.estimatedDurationMinutes,
          content: transformedContent as any,
        },
        update: {
          title: "MSSQL Kursu",
          description: transformedContent.overview.description,
          category: "Database",
          field: "Database Management",
          difficulty: "intermediate",
          estimatedDuration: transformedContent.overview.estimatedDurationMinutes,
          content: transformedContent as any,
          updatedAt: new Date(),
        },
      });

      const totalModules = transformedContent.modules.length;
      const totalLessons = transformedContent.modules.reduce(
        (sum: number, module: any) => sum + module.relatedTopics.length,
        0
      );

      console.log(
        `[CREATE_COURSE_API] Course created successfully. Modules: ${totalModules}, Lessons: ${totalLessons}`
      );

      return NextResponse.json({
        success: true,
        message: `MSSQL kursu başarıyla oluşturuldu. ${totalModules} modül ve ${totalLessons} ders eklendi.`,
        stats: {
          modulesCreated: totalModules,
          lessonsCreated: totalLessons,
          totalDuration: transformedContent.overview.estimatedDurationMinutes,
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

