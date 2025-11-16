import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkGoalsForToday } from "@/app/api/goals/check/goal-service";

// POST /api/goals/check - Hedef ilerlemesini kontrol eder ve günceller
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const result = await checkGoalsForToday({ userId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking goals:", error);
    return NextResponse.json(
      { error: "Hedef kontrolü sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

