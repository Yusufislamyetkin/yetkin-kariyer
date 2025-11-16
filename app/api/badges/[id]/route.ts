import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/badges/[id] - Belirli bir rozet detayı
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const badge = await db.badge.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            userBadges: true,
          },
        },
      },
    });

    if (!badge) {
      return NextResponse.json(
        { error: "Rozet bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      badge: {
        ...badge,
        earnedCount: badge._count.userBadges,
      },
    });
  } catch (error) {
    console.error("Error fetching badge:", error);
    return NextResponse.json(
      { error: "Rozet yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

