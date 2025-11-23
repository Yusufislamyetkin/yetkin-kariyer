import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Cleanup expired stories (should be called by cron job)
export async function POST(request: Request) {
  try {
    // Verify this is called from a cron job or admin
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete expired stories
    const result = await db.story.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("[STORY_CLEANUP]", error);
    return NextResponse.json(
      { error: "Story temizleme sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

