import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

    // Delete all courses except the roadmap course
    const result = await db.course.deleteMany({
      where: {
        id: {
          not: 'course-dotnet-roadmap',
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} kurs başarıyla silindi.`,
    });
  } catch (error: any) {
    console.error("Error clearing courses:", error);
    return NextResponse.json(
      { error: error.message || "Kurslar temizlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

