import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attempt = await db.quizAttempt.findUnique({
      where: { id: params.id },
      include: {
        quiz: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      return NextResponse.json(
        { error: "Sonuç bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ attempt });
  } catch (error) {
    return NextResponse.json(
      { error: "Sonuç yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

