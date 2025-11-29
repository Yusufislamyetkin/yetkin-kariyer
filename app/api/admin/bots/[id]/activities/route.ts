import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Check if bot exists
    const bot = await db.user.findUnique({
      where: {
        id: params.id,
        isBot: true,
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Bot bulunamadı" },
        { status: 404 }
      );
    }

    // Get activities
    const [activities, totalCount] = await Promise.all([
      db.botActivity.findMany({
        where: {
          userId: params.id,
        },
        orderBy: {
          executedAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.botActivity.count({
        where: {
          userId: params.id,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("[BOT_ACTIVITIES_GET]", error);
    return NextResponse.json(
      { error: error.message || "Aktivite logları alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

