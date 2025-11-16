import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeaderboardPeriod } from "@prisma/client";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Mevcut kullanıcıları al (admin hariç)
    const users = await db.user.findMany({
      where: {
        role: {
          not: "admin"
        }
      },
      select: {
        id: true
      },
      take: 20 // En az 20 kullanıcıya ihtiyacımız var
    });

    if (users.length < 10) {
      return NextResponse.json(
        { error: "En az 10 kullanıcı bulunmalıdır" },
        { status: 400 }
      );
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // Günlük veriler (son 10 gün için)
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const periodDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatı

      // Her gün için farklı kullanıcılar kullan
      const userId = users[i % users.length].id;

      try {
        const entry = await db.leaderboardEntry.upsert({
          where: {
            userId_period_periodDate: {
              userId: userId,
              period: LeaderboardPeriod.daily,
              periodDate: periodDate,
            },
          },
          update: {
            quizCount: Math.floor(Math.random() * 20) + 1,
            averageScore: Math.random() * 40 + 60, // 60-100 arası
            totalScore: Math.floor(Math.random() * 1000) + 500,
            highestScore: Math.floor(Math.random() * 30) + 70,
            rank: Math.floor(Math.random() * 10) + 1,
            points: Math.floor(Math.random() * 500) + 100,
          },
          create: {
            userId: userId,
            period: LeaderboardPeriod.daily,
            periodDate: periodDate,
            quizCount: Math.floor(Math.random() * 20) + 1,
            averageScore: Math.random() * 40 + 60,
            totalScore: Math.floor(Math.random() * 1000) + 500,
            highestScore: Math.floor(Math.random() * 30) + 70,
            rank: Math.floor(Math.random() * 10) + 1,
            points: Math.floor(Math.random() * 500) + 100,
          },
        });

        created.push(`daily-${periodDate}-${userId.substring(0, 8)}`);
      } catch (error: any) {
        errors.push(`daily-${periodDate}: ${error.message || 'Unknown error'}`);
      }
    }

    // Aylık veriler (son 10 ay için)
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const periodDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM formatı

      // Her ay için farklı kullanıcılar kullan
      const userId = users[(i + 10) % users.length].id;

      try {
        const entry = await db.leaderboardEntry.upsert({
          where: {
            userId_period_periodDate: {
              userId: userId,
              period: LeaderboardPeriod.monthly,
              periodDate: periodDate,
            },
          },
          update: {
            quizCount: Math.floor(Math.random() * 100) + 20,
            averageScore: Math.random() * 40 + 60,
            totalScore: Math.floor(Math.random() * 5000) + 2000,
            highestScore: Math.floor(Math.random() * 30) + 70,
            rank: Math.floor(Math.random() * 10) + 1,
            points: Math.floor(Math.random() * 2000) + 500,
          },
          create: {
            userId: userId,
            period: LeaderboardPeriod.monthly,
            periodDate: periodDate,
            quizCount: Math.floor(Math.random() * 100) + 20,
            averageScore: Math.random() * 40 + 60,
            totalScore: Math.floor(Math.random() * 5000) + 2000,
            highestScore: Math.floor(Math.random() * 30) + 70,
            rank: Math.floor(Math.random() * 10) + 1,
            points: Math.floor(Math.random() * 2000) + 500,
          },
        });

        created.push(`monthly-${periodDate}-${userId.substring(0, 8)}`);
      } catch (error: any) {
        errors.push(`monthly-${periodDate}: ${error.message || 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      dailyCreated: 10,
      monthlyCreated: 10,
      message: `10 günlük ve 10 aylık derece kazancı verisi başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating leaderboard entries:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "Derece kazancı verileri oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

