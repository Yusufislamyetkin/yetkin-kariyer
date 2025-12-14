import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { botIds } = body;

    if (!botIds || !Array.isArray(botIds) || botIds.length === 0) {
      return NextResponse.json(
        { error: "botIds array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Verify all IDs are bots
    const bots = await db.user.findMany({
      where: {
        id: { in: botIds },
        isBot: true,
      },
      select: {
        id: true,
      },
    });

    if (bots.length !== botIds.length) {
      return NextResponse.json(
        { error: "Some bot IDs are invalid or not bots" },
        { status: 400 }
      );
    }

    // Delete all bot activities for selected bots
    const result = await db.botActivity.deleteMany({
      where: {
        userId: { in: botIds },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} aktivite ${botIds.length} bot için başarıyla temizlendi`,
      deleted: result.count,
      botCount: botIds.length,
    });
  } catch (error: any) {
    console.error("[BULK_CLEAR_ACTIVITIES] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Bot aktiviteleri temizlenirken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}
