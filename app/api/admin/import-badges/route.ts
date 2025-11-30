import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[IMPORT_BADGES] Starting badge import...");

    // JSON dosyasını oku
    const filePath = join(process.cwd(), "public", "data", "badges.json");
    const fileContents = await readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);

    if (!jsonData.badges || !Array.isArray(jsonData.badges)) {
      return NextResponse.json(
        { error: "Geçersiz JSON formatı. 'badges' array'i bulunamadı." },
        { status: 400 }
      );
    }

    const badges = jsonData.badges;
    console.log(`[IMPORT_BADGES] Found ${badges.length} badges in JSON file`);

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Her rozeti işle
    for (const badgeData of badges) {
      try {
        // Gerekli alanları kontrol et
        if (!badgeData.id || !badgeData.name || !badgeData.category) {
          errors.push(`Rozet eksik alanlar içeriyor: ${badgeData.id || badgeData.key || 'unknown'}`);
          skipped++;
          continue;
        }

        // Category enum mapping
        const categoryMap: Record<string, string> = {
          "daily_activities": "daily_activities",
          "score": "score",
          "social_interaction": "social_interaction",
          "streak": "streak",
          "special": "special",
          "test_count": "test_count",
          "topic": "topic",
          "total_achievements": "total_achievements",
        };

        const category = categoryMap[badgeData.category];
        if (!category) {
          errors.push(`Geçersiz kategori: ${badgeData.category} (Rozet: ${badgeData.id})`);
          skipped++;
          continue;
        }

        // Tier enum mapping (optional)
        const tierMap: Record<string, string> = {
          "bronze": "bronze",
          "silver": "silver",
          "gold": "gold",
          "platinum": "platinum",
        };

        const tier = badgeData.tier ? tierMap[badgeData.tier] : null;

        // Rarity enum mapping
        const rarityMap: Record<string, string> = {
          "common": "common",
          "rare": "rare",
          "epic": "epic",
          "legendary": "legendary",
        };

        const rarity = rarityMap[badgeData.rarity] || "common";

        // Rozet verilerini hazırla
        const badgePayload = {
          id: badgeData.id,
          key: badgeData.key || null,
          name: badgeData.name,
          description: badgeData.description || "",
          icon: badgeData.icon || "🏆",
          iconUrl: badgeData.iconUrl || null,
          color: badgeData.color || "#FFD700",
          category: category as any,
          tier: tier ? (tier as any) : null,
          rarity: rarity as any,
          points: badgeData.points || 10,
          criteria: badgeData.criteria || {},
          ruleJson: badgeData.ruleJson || null,
        };

        // Upsert işlemi (key veya id ile kontrol et)
        const existingBadge = await db.badge.findFirst({
          where: {
            OR: [
              { id: badgeData.id },
              ...(badgeData.key ? [{ key: badgeData.key }] : []),
            ],
          },
        });

        if (existingBadge) {
          // Güncelle
          await db.badge.update({
            where: { id: existingBadge.id },
            data: badgePayload,
          });
          updated++;
        } else {
          // Oluştur
          await db.badge.create({
            data: badgePayload,
          });
          created++;
        }
      } catch (error: any) {
        const errorMessage = `Rozet işlenirken hata (${badgeData.id || badgeData.key || 'unknown'}): ${error.message}`;
        console.error(`[IMPORT_BADGES] ${errorMessage}`, error);
        errors.push(errorMessage);
        skipped++;
      }
    }

    const stats = {
      total: badges.length,
      created,
      updated,
      skipped,
      errors: errors.length,
    };

    console.log(`[IMPORT_BADGES] Import completed:`, stats);

    return NextResponse.json({
      success: true,
      message: `${created} rozet eklendi, ${updated} rozet güncellendi, ${skipped} rozet atlandı.`,
      stats,
      errors: errors.length > 0 ? errors.slice(0, 10) : [], // İlk 10 hatayı göster
    });
  } catch (error: any) {
    console.error("[IMPORT_BADGES] Error:", error);
    return NextResponse.json(
      {
        error: "Rozetler import edilirken bir hata oluştu",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

