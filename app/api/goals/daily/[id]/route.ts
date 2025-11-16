import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// PUT /api/goals/daily/[id] - Hedef günceller
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await request.json();

    // Check if goal belongs to user
    const goal = await db.dailyGoal.findUnique({
      where: { id: params.id },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Hedef bulunamadı" },
        { status: 404 }
      );
    }

    if (goal.userId !== userId) {
      return NextResponse.json(
        { error: "Bu hedefe erişim yetkiniz yok" },
        { status: 403 }
      );
    }

    // Update goal
    const updatedGoal = await db.dailyGoal.update({
      where: { id: params.id },
      data: {
        targetValue: body.targetValue !== undefined ? parseInt(body.targetValue) : undefined,
        currentValue: body.currentValue !== undefined ? parseInt(body.currentValue) : undefined,
        completed: body.completed !== undefined ? body.completed : undefined,
        completedAt: body.completed ? new Date() : undefined,
      },
    });

    return NextResponse.json({ goal: updatedGoal });
  } catch (error) {
    console.error("Error updating daily goal:", error);
    return NextResponse.json(
      { error: "Hedef güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

