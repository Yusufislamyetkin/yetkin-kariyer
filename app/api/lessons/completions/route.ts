import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id as string;

    const completions = await db.lessonCompletion.findMany({
      where: {
        userId,
        completedAt: {
          not: null,
        },
      },
      select: {
        lessonSlug: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      completions,
    });
  } catch (error) {
    console.error("Error fetching lesson completions:", error);
    return NextResponse.json(
      { error: "Tamamlanan dersler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

