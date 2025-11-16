import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { loadAllSeedData, importTopicLessons, importLessonContents, fillEmptyLessonContents } from "@/lib/admin/seed-data";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Load module and quiz seed data
    const seedResult = await loadAllSeedData();

    // Import topic lessons
    const topicsResult = await importTopicLessons();

    // Import lesson contents
    const lessonsResult = await importLessonContents();

    // Fill empty lesson contents and limit to 10 lessons per module
    const fillResult = await fillEmptyLessonContents();

    return NextResponse.json({
      success: seedResult.success && topicsResult.success && lessonsResult.success && fillResult.success,
      results: seedResult.results,
      topicsProcessed: topicsResult.topicsProcessed,
      topicErrors: topicsResult.errors,
      lessonsProcessed: lessonsResult.lessonsProcessed,
      lessonErrors: lessonsResult.errors,
      lessonsFilled: fillResult.lessonsFilled,
      lessonsLimited: fillResult.lessonsLimited,
      fillErrors: fillResult.errors,
      message: seedResult.success && topicsResult.success && lessonsResult.success && fillResult.success
        ? `Seed data başarıyla yüklendi. ${topicsResult.topicsProcessed} konu anlatımı ve ${lessonsResult.lessonsProcessed} ders içeriği eklendi. ${fillResult.lessonsFilled} ders içeriği dolduruldu, ${fillResult.lessonsLimited} modülde ders sayısı 10'a indirildi.`
        : "Bazı veriler yüklenirken hata oluştu",
    });
  } catch (error: any) {
    console.error("Error loading seed data:", error);
    return NextResponse.json(
      { error: error.message || "Seed data yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

