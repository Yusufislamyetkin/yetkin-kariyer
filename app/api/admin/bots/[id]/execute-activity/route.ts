import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { executeBotActivity } from "@/lib/bot/activity-executor";
import { z } from "zod";

enum BotActivityType {
  POST = "POST",
  COMMENT = "COMMENT",
  LIKE = "LIKE",
  TEST = "TEST",
  LIVE_CODING = "LIVE_CODING",
  BUG_FIX = "BUG_FIX",
  LESSON = "LESSON",
  CHAT = "CHAT",
}

const executeActivitySchema = z.object({
  activityType: z.nativeEnum(BotActivityType),
  options: z.record(z.any()).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = executeActivitySchema.parse(body);

    // Check if bot exists
    const bot = await db.user.findUnique({
      where: {
        id: params.id,
        isBot: true,
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Bot bulunamadı" },
        { status: 404 }
      );
    }

    // Execute the activity
    const result = await executeBotActivity(
      params.id,
      data.activityType,
      data.options || {}
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Aktivite çalıştırılamadı" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      activityId: result.activityId,
      message: "Aktivite başarıyla çalıştırıldı",
    });
  } catch (error: any) {
    console.error("[BOT_EXECUTE_ACTIVITY]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Aktivite çalıştırılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

