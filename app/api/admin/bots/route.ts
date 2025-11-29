import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bots = await db.user.findMany({
      where: {
        isBot: true,
      },
      include: {
        character: true,
        configuration: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      bots,
    });
  } catch (error: any) {
    console.error("[ADMIN_BOTS_GET]", error);
    return NextResponse.json(
      { error: error.message || "Botlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

