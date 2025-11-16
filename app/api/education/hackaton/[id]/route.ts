import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "HACKATON",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            expertise: true,
            topic: true,
            topicContent: true,
            difficulty: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Hackaton bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error fetching hackaton:", error);
    return NextResponse.json(
      { error: "Hackaton yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectUrl, metrics } = body;

    const quiz = await db.quiz.findUnique({
      where: { 
        id: params.id,
        type: "HACKATON",
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Hackaton bulunamadı" }, { status: 404 });
    }

    const userId = session.user.id as string;

    // HackatonAttempt oluştur
    const hackatonAttempt = await db.hackatonAttempt.create({
      data: {
        userId,
        quizId: params.id,
        projectUrl: projectUrl || null,
        metrics: metrics || {
          projectScore: 0,
          featuresCompleted: 0,
          codeQuality: 0,
        },
      },
    });

    // AI analysis'i background'da yap
    if (process.env.OPENAI_API_KEY && process.env.NEXTAUTH_URL) {
      fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackatonAttemptId: hackatonAttempt.id }),
      }).catch(() => {});
    }

    return NextResponse.json({ hackatonAttempt });
  } catch (error) {
    console.error("Error submitting hackaton:", error);
    return NextResponse.json(
      { error: "Hackaton gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

