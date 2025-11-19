import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOwaspCourse } from "@/lib/admin/create-owasp-course";

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

    console.log("[CREATE_COURSE_API] Starting OWASP & Web Security course creation...");

    // Load course content from JSON
    let courseStats;
    try {
      courseStats = await createOwaspCourse();
    } catch (error: any) {
      console.error("[CREATE_COURSE_API] Error loading course content:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Kurs içeriği yüklenirken bir hata oluştu",
        },
        { status: 500 }
      );
    }

    console.log(
      `[CREATE_COURSE_API] Course created successfully. Modules: ${courseStats.modulesCreated}, Lessons: ${courseStats.lessonsCreated}`
    );

    return NextResponse.json({
      success: true,
      message: `OWASP & Web Security kursu başarıyla oluşturuldu. ${courseStats.modulesCreated} modül ve ${courseStats.lessonsCreated} ders eklendi.`,
      stats: {
        modulesCreated: courseStats.modulesCreated,
        lessonsCreated: courseStats.lessonsCreated,
        totalDuration: courseStats.totalDuration,
      },
    });
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

