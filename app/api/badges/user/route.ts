import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";

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

// GET /api/badges/user - Kullanıcının rozetlerini döner
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const userBadges = await db.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    // Eğer bazı rozetler veritabanında yoksa (badge null), JSON'dan yükle
    const badgesFromJson = await loadBadgesFromJson();
    // Key ile map oluştur (key bazlı eşleştirme için)
    const badgesMapByKey = new Map(badgesFromJson.map((b: any) => [b.key, b]).filter(([key]: [any, any]) => key != null));
    // ID ile de map oluştur (fallback için)
    const badgesMapById = new Map(badgesFromJson.map((b: any) => [b.id, b]));

    // Veritabanındaki tüm badge'leri key ile map'le (key bazlı eşleştirme için)
    const allDbBadges = await db.badge.findMany();
    const dbBadgesMapById = new Map(allDbBadges.map((b: any) => [b.id, b]));

    // Rozetleri eşleştir: önce veritabanından, yoksa JSON'dan (key bazlı)
    const enrichedBadges = userBadges.map((ub: any) => {
      let badge = ub.badge;
      
      // Eğer veritabanında rozet yoksa, badgeId ile veritabanından bul
      if (!badge) {
        const dbBadge = dbBadgesMapById.get(ub.badgeId) as any;
        if (dbBadge) {
          badge = dbBadge;
          // Veritabanı badge'inin key'ini kullanarak JSON'dan tam bilgileri al
          if (dbBadge.key && badgesMapByKey.has(dbBadge.key)) {
            const jsonBadge = badgesMapByKey.get(dbBadge.key);
            // JSON'dan gelen bilgileri veritabanı badge'i ile birleştir
            if (jsonBadge) {
              badge = { ...jsonBadge, ...dbBadge };
            }
          }
        } else {
          // Veritabanında da yoksa, JSON'dan ID ile ara (fallback)
          if (badgesMapById.has(ub.badgeId)) {
            badge = badgesMapById.get(ub.badgeId);
          }
        }
      } else {
        // Veritabanında badge varsa, key ile JSON'dan tam bilgileri al
        const badgeAny = badge as any;
        if (badgeAny.key && badgesMapByKey.has(badgeAny.key)) {
          const jsonBadge = badgesMapByKey.get(badgeAny.key);
          // JSON'dan gelen bilgileri veritabanı badge'i ile birleştir
          if (jsonBadge) {
            badge = { ...jsonBadge, ...badge };
          }
        }
      }

      // Eğer hala rozet bulunamadıysa, null döndürme (skip et)
      if (!badge) {
        return null;
      }

      // Hem id hem key alanlarını doğru şekilde set et
      // Frontend'de key bazlı eşleştirme yapacağız, bu yüzden key alanını doğru şekilde set et
      return {
        ...badge,
        id: badge.id || ub.badgeId, // JSON'daki id veya veritabanı badgeId
        key: badge.key || badge.id, // Key varsa key, yoksa id (frontend'de key bazlı eşleştirme için)
        earnedAt: ub.earnedAt,
        isDisplayed: ub.isDisplayed,
      };
    }).filter((b: any) => b !== null); // null olanları filtrele

    // Displayed badges (max 3)
    const displayedBadges = enrichedBadges
      .filter((b: any) => b.isDisplayed)
      .slice(0, 3);

    return NextResponse.json({
      badges: enrichedBadges,
      displayedBadges,
      totalCount: enrichedBadges.length,
    });
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return NextResponse.json(
      { error: "Rozetler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

