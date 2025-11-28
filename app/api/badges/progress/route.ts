import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";
import { calculateBadgeProgress } from "@/lib/services/gamification/badge-progress";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// JSON'dan rozetleri yükle
async function loadBadgesFromJson() {
  try {
    const filePath = join(process.cwd(), "public", "data", "badges.json");
    const fileContents = await readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);
    return jsonData.badges || [];
  } catch (error) {
    console.error("Error loading badges from JSON:", error);
    return [];
  }
}

// GET /api/badges/progress - Kullanıcının tüm rozetler için ilerleme durumunu döner
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Rozetleri yükle (önce veritabanından, yoksa JSON'dan)
    let badges: any[] = [];
    
    try {
      const { db } = await import("@/lib/db");
      const dbBadges = await db.badge.findMany();
      if (dbBadges && dbBadges.length > 0) {
        badges = dbBadges;
      } else {
        badges = await loadBadgesFromJson();
      }
    } catch (error) {
      // Veritabanı hatası durumunda JSON'dan yükle
      badges = await loadBadgesFromJson();
    }

    // Her rozet için ilerleme hesapla
    const progressPromises = badges.map((badge) =>
      calculateBadgeProgress(userId, badge)
    );
    const progress = await Promise.all(progressPromises);

    return NextResponse.json({
      progress,
      totalBadges: badges.length,
    });
  } catch (error) {
    console.error("Error calculating badge progress:", error);
    return NextResponse.json(
      { error: "İlerleme hesaplanırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

