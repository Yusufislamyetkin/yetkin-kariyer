import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/badges - Tüm rozetleri listeler
export async function GET() {
  try {
    const badges = await db.badge.findMany({
      orderBy: [
        { rarity: "asc" }, // common, rare, epic, legendary
        { points: "desc" },
      ],
    });

    return NextResponse.json({ badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { error: "Rozetler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

