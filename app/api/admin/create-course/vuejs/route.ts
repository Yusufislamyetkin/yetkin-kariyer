import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createVueJSCourse } from "@/lib/admin/create-vuejs-course";

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

    console.log("[CREATE_COURSE_API] Starting Vue.js course creation...");

    // Generate course content
    let courseContent;
    try {
      courseContent = await createVueJSCourse();
    } catch (error: any) {
      console.error("[CREATE_COURSE_API] Error generating course content:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Kurs içeriği oluşturulurken bir hata oluştu",
        },
        { status: 500 }
      );
    }

    // Save course to database
    try {
      const course = await db.course.upsert({
        where: { id: "course-vuejs-roadmap" },
        create: {
          id: "course-vuejs-roadmap",
          title: "Vue.js Kursu",
          description: courseContent.overview.description,
          category: "Frontend",
          field: "Software Development",
          expertise: "Vue.js", // Test oluşturma API'si için gerekli
          difficulty: "intermediate",
          estimatedDuration: courseContent.overview.estimatedDurationMinutes,
          content: courseContent as any,
        },
        update: {
          title: "Vue.js Kursu",
          description: courseContent.overview.description,
          category: "Frontend",
          field: "Software Development",
          expertise: "Vue.js", // Test oluşturma API'si için gerekli
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
        message: `Vue.js kursu başarıyla oluşturuldu. ${totalModules} modül ve ${totalLessons} ders eklendi.`,
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

