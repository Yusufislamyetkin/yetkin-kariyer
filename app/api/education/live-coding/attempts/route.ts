import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const quizId = searchParams.get("quizId");

    const where: any = {
      userId: session.user.id as string,
    };

    if (quizId) {
      where.quizId = quizId;
    }

    const attempts = await db.liveCodingAttempt.findMany({
      where,
      include: {
        quiz: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                expertise: true,
                topic: true,
                topicContent: true,
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Error fetching live coding attempts:", error);
    return NextResponse.json(
      { error: "Canlı kodlama geçmişi yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

