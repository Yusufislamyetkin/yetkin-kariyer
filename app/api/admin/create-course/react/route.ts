import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createReactCourse } from "@/lib/admin/create-react-course";

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

    console.log("[CREATE_COURSE_API] Starting React course creation...");

    // Generate course content
    let courseContent;
    try {
      courseContent = await createReactCourse();
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
        where: { id: "course-react-roadmap" },
        create: {
          id: "course-react-roadmap",
          title: "React Kursu",
          description: courseContent.overview.description,
          category: "Frontend",
          field: "Software Development",
          subCategory: "react",
          expertise: "frontend",
          topic: "React",
          topicContent: "Frontend Development",
          difficulty: "intermediate",
          estimatedDuration: courseContent.overview.estimatedDurationMinutes,
          content: courseContent as any,
        },
        update: {
          title: "React Kursu",
          description: courseContent.overview.description,
          category: "Frontend",
          field: "Software Development",
          subCategory: "react",
          expertise: "frontend",
          topic: "React",
          topicContent: "Frontend Development",
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
        message: `React kursu başarıyla oluşturuldu. ${totalModules} modül ve ${totalLessons} ders eklendi.`,
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

