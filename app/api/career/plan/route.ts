import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await db.careerPlan.findFirst({
      where: { userId: session.user.id as string },
      orderBy: { updatedAt: "desc" },
    });

    // Return plan even if null, so frontend can distinguish between "no plan" and "error"
    return NextResponse.json({ plan: plan || null });
  } catch (error) {
    console.error("[CAREER_PLAN] Error fetching plan:", error);
    return NextResponse.json(
      { error: "Kariyer planı yüklenirken bir hata oluştu", plan: null },
      { status: 500 }
    );
  }
}

