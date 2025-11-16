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

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json(
      { error: "Kariyer planı yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

