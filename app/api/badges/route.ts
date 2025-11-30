import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";

// Force dynamic rendering to prevent build timeout
export const dynamic = 'force-dynamic';

// Helper function to import badges from JSON to database
async function importBadgesFromJson() {
  try {
    console.log("[BADGES_AUTO_IMPORT] Starting automatic badge import...");
    
    // JSON dosyasını oku
    const filePath = join(process.cwd(), "public", "data", "badges.json");
    const fileContents = await readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);

    if (!jsonData.badges || !Array.isArray(jsonData.badges)) {
      console.error("[BADGES_AUTO_IMPORT] Geçersiz JSON formatı. 'badges' array'i bulunamadı.");
      return { success: false, imported: 0 };
    }

    const badges = jsonData.badges;
    console.log(`[BADGES_AUTO_IMPORT] Found ${badges.length} badges in JSON file`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Her rozeti işle
    for (const badgeData of badges) {
      try {
        // Gerekli alanları kontrol et
        if (!badgeData.id || !badgeData.name || !badgeData.category) {
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
          skipped++;
          continue;
        }

        // Tier enum mapping (optional)
        const tierMap: Record<string, string> = {
          "bronze": "bronze",
          "silver": "silver",
          "gold": "gold",
          "platinum": "platinum",
          "diamond": "diamond",
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
        // Önce key ile kontrol et (daha güvenilir)
        let existingBadge = null;
        if (badgeData.key) {
          existingBadge = await db.badge.findUnique({
            where: { key: badgeData.key },
          });
        }
        
        // Key ile bulunamazsa id ile kontrol et
        if (!existingBadge && badgeData.id) {
          existingBadge = await db.badge.findUnique({
            where: { id: badgeData.id },
          });
        }

        if (existingBadge) {
          // Güncelle - tüm alanları güncelle
          try {
            await db.badge.update({
              where: { id: existingBadge.id },
              data: badgePayload,
            });
            updated++;
          } catch (updateError: any) {
            // Update hatası (örn: unique constraint) durumunda logla ve devam et
            console.error(`[BADGES_AUTO_IMPORT] Update hatası (${badgeData.id || badgeData.key || 'unknown'}):`, updateError.message);
            skipped++;
          }
        } else {
          // Oluştur
          try {
            await db.badge.create({
              data: badgePayload,
            });
            created++;
          } catch (createError: any) {
            // Create hatası (örn: unique constraint) durumunda logla ve devam et
            console.error(`[BADGES_AUTO_IMPORT] Create hatası (${badgeData.id || badgeData.key || 'unknown'}):`, createError.message);
            skipped++;
          }
        }
      } catch (error: any) {
        console.error(`[BADGES_AUTO_IMPORT] Rozet işlenirken hata (${badgeData.id || badgeData.key || 'unknown'}):`, error.message);
        skipped++;
      }
    }

    // Import sonrası toplam rozet sayısını kontrol et
    const finalCount = await db.badge.count();
    console.log(`[BADGES_AUTO_IMPORT] Import completed: ${created} created, ${updated} updated, ${skipped} skipped. Toplam DB rozet sayısı: ${finalCount}`);
    
    return { success: true, imported: created + updated, total: finalCount };
  } catch (error: any) {
    console.error("[BADGES_AUTO_IMPORT] Error:", error);
    return { success: false, imported: 0 };
  }
}

// GET /api/badges - Tüm rozetleri listeler
export async function GET() {
  try {
    // Önce veritabanından çekmeyi dene
    const badges = await db.badge.findMany({
      orderBy: [
        { rarity: "asc" }, // common, rare, epic, legendary
        { points: "desc" },
      ],
    });

    // Her zaman import et (upsert kullanıyor, mevcutları günceller, eksikleri ekler)
    const expectedBadgeCount = 160;
    const currentCount = badges?.length || 0;
    
    if (currentCount > 0) {
      console.log(`[BADGES] Veritabanında ${currentCount} rozet var, ${expectedBadgeCount} olması gerekiyor. Tüm rozetler import ediliyor (upsert)...`);
    } else {
      console.log("[BADGES] Veritabanında rozet bulunamadı, JSON'dan otomatik import başlatılıyor...");
    }
    
    const importResult = await importBadgesFromJson();

    // Import sonrası tekrar veritabanından çek
    const importedBadges = await db.badge.findMany({
      orderBy: [
        { rarity: "asc" },
        { points: "desc" },
      ],
    });

    if (importedBadges && importedBadges.length > 0) {
      // Kategori bazında rozet sayısını log'la
      const byCategory: Record<string, number> = {};
      importedBadges.forEach((badge: any) => {
        byCategory[badge.category] = (byCategory[badge.category] || 0) + 1;
      });
      console.log(`[BADGES] Import tamamlandı. Toplam: ${importedBadges.length} rozet. Kategori bazında:`, byCategory);
      
      return NextResponse.json({ 
        badges: importedBadges,
        totalBadges: expectedBadgeCount
      });
    }

    // Import başarısızsa veya hala rozet yoksa, JSON dosyasından oku (fallback)
    try {
      const filePath = join(process.cwd(), "public", "data", "badges.json");
      const fileContents = await readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileContents);
      
      return NextResponse.json({ 
        badges: jsonData.badges || [],
        totalBadges: 160 // Her zaman 160 döndür
      });
    } catch (jsonError) {
      console.error("Error reading badges.json:", jsonError);
      // JSON dosyası da yoksa boş array döndür ama totalBadges yine 160
      return NextResponse.json({ 
        badges: [],
        totalBadges: 160
      });
    }
  } catch (error) {
    console.error("Error fetching badges:", error);
    
    // Hata durumunda da JSON dosyasından okumayı dene
    try {
      const filePath = join(process.cwd(), "public", "data", "badges.json");
      const fileContents = await readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileContents);
      
      return NextResponse.json({ 
        badges: jsonData.badges || [],
        totalBadges: 160 // Her zaman 160 döndür
      });
    } catch (jsonError) {
      console.error("Error reading badges.json:", jsonError);
      return NextResponse.json(
        { 
          error: "Rozetler yüklenirken bir hata oluştu",
          totalBadges: 160
        },
        { status: 500 }
      );
    }
  }
}

