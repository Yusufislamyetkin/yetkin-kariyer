import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const wrongQuestions = await prisma.wrongQuestion.findMany({
      where: { userId },
      include: {
        quizAttempt: {
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ wrongQuestions });
  } catch (error) {
    console.error("Error fetching wrong questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id, status, notes } = await request.json();

    const wrongQuestion = await prisma.wrongQuestion.findFirst({
      where: { id, userId },
    });

    if (!wrongQuestion) {
      return NextResponse.json(
        { error: "Wrong question not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.wrongQuestion.update({
      where: { id },
      data: {
        status: status || wrongQuestion.status,
        notes: notes !== undefined ? notes : wrongQuestion.notes,
      },
    });

    return NextResponse.json({ wrongQuestion: updated });
  } catch (error) {
    console.error("Error updating wrong question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

