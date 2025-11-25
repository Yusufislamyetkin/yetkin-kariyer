import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAllUserBadges } from "@/app/api/badges/check/badge-service";

// POST /api/badges/check/all - Kullanıcının tüm rozetlerini kontrol eder
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    try {
      const result = await checkAllUserBadges({ userId });
      return NextResponse.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error checking all badges:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error checking all badges:", error);
    const message =
      error instanceof Error ? error.message : "Rozet kontrolü sırasında bir hata oluştu";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

