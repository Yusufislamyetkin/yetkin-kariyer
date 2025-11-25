import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";

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

    // Eğer veritabanında rozet varsa, onları döndür
    if (badges && badges.length > 0) {
      return NextResponse.json({ badges });
    }

    // Veritabanında rozet yoksa, JSON dosyasından oku
    try {
      const filePath = join(process.cwd(), "public", "data", "badges.json");
      const fileContents = await readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileContents);
      
      return NextResponse.json({ 
        badges: jsonData.badges || [],
        totalBadges: jsonData.totalBadges || 0
      });
    } catch (jsonError) {
      console.error("Error reading badges.json:", jsonError);
      // JSON dosyası da yoksa boş array döndür
      return NextResponse.json({ badges: [] });
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
        totalBadges: jsonData.totalBadges || 0
      });
    } catch (jsonError) {
      console.error("Error reading badges.json:", jsonError);
      return NextResponse.json(
        { error: "Rozetler yüklenirken bir hata oluştu" },
        { status: 500 }
      );
    }
  }
}

