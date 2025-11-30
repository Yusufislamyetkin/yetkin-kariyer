import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";
import { calculateBadgeProgress } from "@/lib/services/gamification/badge-progress";
import { db } from "@/lib/db";

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

// Rozetleri DB'ye import et (basit kontrol)
// Not: Bu fonksiyon sadece kontrol yapar, gerçek import /api/badges endpoint'inde yapılıyor
async function ensureBadgesInDatabase() {
  try {
    const existingBadges = await db.badge.findMany();
    const expectedBadgeCount = 160;
    const currentCount = existingBadges.length;
    
    if (currentCount < expectedBadgeCount) {
      console.log(`[BADGES_PROGRESS] Veritabanında ${currentCount} rozet var, ${expectedBadgeCount} olması gerekiyor.`);
      // Import işlemi /api/badges endpoint'inde otomatik yapılıyor
      // Burada sadece loglama yapıyoruz
    }
  } catch (error) {
    console.error("[BADGES_PROGRESS] ensureBadgesInDatabase hatası:", error);
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

    // Önce rozetlerin DB'de olduğundan emin ol
    await ensureBadgesInDatabase();
    
    // Rozetleri yükle (önce veritabanından, yoksa JSON'dan)
    let badges: any[] = [];
    
    try {
      const dbBadges = await db.badge.findMany({
        orderBy: [
          { rarity: "asc" },
          { points: "desc" },
        ],
      });
      
      if (dbBadges && dbBadges.length > 0) {
        badges = dbBadges;
      } else {
        // DB'de hala rozet yoksa JSON'dan yükle (fallback)
        console.log("[BADGES_PROGRESS] Veritabanında rozet bulunamadı, JSON'dan yükleniyor...");
        badges = await loadBadgesFromJson();
      }
    } catch (error) {
      // Veritabanı hatası durumunda JSON'dan yükle
      console.error("[BADGES_PROGRESS] Veritabanı hatası, JSON'dan yükleniyor:", error);
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

