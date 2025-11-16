import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { importLessonContents } from "@/lib/admin/seed-data";

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await importLessonContents();

    if (!result.success) {
      return NextResponse.json(
        { error: result.errors.join(", ") || "Ders içerikleri import edilirken bir hata oluştu" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lessonsProcessed: result.lessonsProcessed,
      message: `${result.lessonsProcessed} ders içeriği başarıyla import edildi.`,
    });
  } catch (error: any) {
    console.error("Error importing lesson contents:", error);
    return NextResponse.json(
      { error: error.message || "Ders içerikleri import edilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

