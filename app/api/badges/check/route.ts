import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkBadgesForAttempt } from "@/app/api/badges/check/badge-service";

// POST /api/badges/check - Test tamamlandığında rozet kontrolü yapar
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await request.json();
    const { quizAttemptId } = body;

    if (!quizAttemptId) {
      return NextResponse.json(
        { error: "quizAttemptId gerekli" },
        { status: 400 }
      );
    }

    try {
      const result = await checkBadgesForAttempt({ userId, quizAttemptId });
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === "Test denemesi bulunamadı") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error checking badges:", error);
    const message =
      error instanceof Error ? error.message : "Rozet kontrolü sırasında bir hata oluştu";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

