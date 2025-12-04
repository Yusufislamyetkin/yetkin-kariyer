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

    // Delete all bot activities
    const result = await db.botActivity.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `${result.count} bot aktivitesi başarıyla temizlendi`,
      deleted: result.count,
    });
  } catch (error: any) {
    console.error("[BOT_ACTIVITIES_CLEAR] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Bot aktiviteleri temizlenirken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

