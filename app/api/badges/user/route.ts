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
    const badgesMap = new Map(badgesFromJson.map((b: any) => [b.id, b]));

    // Rozetleri eşleştir: önce veritabanından, yoksa JSON'dan
    const enrichedBadges = userBadges.map((ub: any) => {
      let badge = ub.badge;
      
      // Eğer veritabanında rozet yoksa, JSON'dan bul
      if (!badge && badgesMap.has(ub.badgeId)) {
        badge = badgesMap.get(ub.badgeId);
      }

      // Eğer hala rozet bulunamadıysa, null döndürme (skip et)
      if (!badge) {
        return null;
      }

      return {
        ...badge,
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

