import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let deletedLessonsCount = 0;
    let deletedModulesCount = 0;
    let roadmapCleared = false;

    await db.$transaction(async (tx) => {
      // 1. Delete all lesson and topic records (those starting with "lesson-" or "topic-")
      const lessonResult = await tx.course.deleteMany({
        where: {
          OR: [
            { id: { startsWith: "lesson-" } },
            { id: { startsWith: "topic-" } },
          ],
        },
      });
      deletedLessonsCount = lessonResult.count;

      // 2. Completely clear or reset course-dotnet-roadmap
      const roadmapCourse = await tx.course.findUnique({
        where: { id: 'course-dotnet-roadmap' },
      });

      if (roadmapCourse) {
        // Delete the entire course-dotnet-roadmap record to start fresh
        await tx.course.delete({
          where: { id: 'course-dotnet-roadmap' },
        });
        roadmapCleared = true;
        deletedModulesCount = Array.isArray((roadmapCourse.content as any)?.modules) 
          ? (roadmapCourse.content as any).modules.length 
          : 0;
      }
    });

    return NextResponse.json({
      success: true,
      deletedLessonsCount,
      deletedModulesCount,
      roadmapCleared,
      message: `${deletedLessonsCount} ders kaydı silindi, ${deletedModulesCount} modül silindi ve course-dotnet-roadmap kaydı tamamen temizlendi.`,
    });
  } catch (error: any) {
    console.error("Error clearing topics:", error);
    return NextResponse.json(
      { error: error.message || "Konular temizlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

