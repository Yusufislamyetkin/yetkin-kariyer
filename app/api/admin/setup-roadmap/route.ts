import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNetCoreRoadmapStructure } from "@/lib/admin/seed-data";
import { importLessonContents } from "@/lib/admin/seed-data";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const results = {
      clearTopics: { success: false, deletedLessonsCount: 0, deletedModulesCount: 0, error: null as string | null },
      createRoadmap: { success: false, modulesCreated: 0, error: null as string | null },
      importLessons: { success: false, lessonsProcessed: 0, error: null as string | null },
    };

    // Step 1: Clear topics
    try {
      let deletedLessonsCount = 0;
      let deletedModulesCount = 0;

      await db.$transaction(async (tx) => {
        // Delete all lesson and topic records
        const lessonResult = await tx.course.deleteMany({
          where: {
            OR: [
              { id: { startsWith: "lesson-" } },
              { id: { startsWith: "topic-" } },
            ],
          },
        });
        deletedLessonsCount = lessonResult.count;

        // Clear course-dotnet-roadmap
        const roadmapCourse = await tx.course.findUnique({
          where: { id: 'course-dotnet-roadmap' },
        });

        if (roadmapCourse) {
          await tx.course.delete({
            where: { id: 'course-dotnet-roadmap' },
          });
          deletedModulesCount = Array.isArray((roadmapCourse.content as any)?.modules) 
            ? (roadmapCourse.content as any).modules.length 
            : 0;
        }
      });

      results.clearTopics = {
        success: true,
        deletedLessonsCount,
        deletedModulesCount,
        error: null,
      };
    } catch (error: any) {
      console.error("Error clearing topics:", error);
      results.clearTopics.error = error.message || "Konular temizlenirken bir hata oluştu";
    }

    // Step 2: Create roadmap structure
    try {
      const roadmapResult = await createNetCoreRoadmapStructure();
      results.createRoadmap = {
        success: roadmapResult.success,
        modulesCreated: roadmapResult.modulesCreated,
        error: roadmapResult.success ? null : (roadmapResult.errors.join(", ") || "Roadmap yapısı oluşturulurken bir hata oluştu"),
      };
    } catch (error: any) {
      console.error("Error creating roadmap:", error);
      results.createRoadmap.error = error.message || "Roadmap yapısı oluşturulurken bir hata oluştu";
    }

    // Step 3: Import lesson contents
    try {
      const importResult = await importLessonContents();
      results.importLessons = {
        success: importResult.success,
        lessonsProcessed: importResult.lessonsProcessed,
        error: importResult.success ? null : (importResult.errors.join(", ") || "Ders içerikleri import edilirken bir hata oluştu"),
      };
    } catch (error: any) {
      console.error("Error importing lesson contents:", error);
      results.importLessons.error = error.message || "Ders içerikleri import edilirken bir hata oluştu";
    }

    // Check if all steps succeeded
    const allSuccess = results.clearTopics.success && results.createRoadmap.success && results.importLessons.success;

    const message = allSuccess
      ? `Net Core Roadmap başarıyla kuruldu! ${results.createRoadmap.modulesCreated} modül oluşturuldu, ${results.importLessons.lessonsProcessed} ders içeriği import edildi.`
      : `Kurulum tamamlandı ancak bazı hatalar oluştu. ${results.createRoadmap.modulesCreated} modül oluşturuldu, ${results.importLessons.lessonsProcessed} ders içeriği import edildi.`;

    return NextResponse.json({
      success: allSuccess,
      results,
      message,
    });
  } catch (error: any) {
    console.error("Error setting up roadmap:", error);
    return NextResponse.json(
      { error: error.message || "Roadmap kurulumu sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

