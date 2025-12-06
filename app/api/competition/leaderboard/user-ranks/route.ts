import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { LeaderboardPeriod } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = "daily" | "weekly" | "monthly";

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const getPeriodBounds = (period: Period) => {
  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
  
  let periodDate: string;
  let startDate: Date;
  let endDate: Date;

  if (period === "daily") {
    periodDate = nowUTC.toISOString().split("T")[0];
    startDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate(), 0, 0, 0, 0));
    endDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate() + 1, 0, 0, 0, 0));
  } else if (period === "weekly") {
    const day = nowUTC.getUTCDay();
    const diff = nowUTC.getUTCDate() - day + (day === 0 ? -6 : 1);
    const mondayUTC = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), diff, 0, 0, 0, 0));
    startDate = mondayUTC;
    endDate = new Date(Date.UTC(mondayUTC.getUTCFullYear(), mondayUTC.getUTCMonth(), mondayUTC.getUTCDate() + 7, 0, 0, 0, 0));
    const year = startDate.getUTCFullYear();
    const weekNumber = getWeekNumber(startDate);
    periodDate = `${year}-W${String(weekNumber).padStart(2, "0")}`;
  } else {
    periodDate = `${nowUTC.getUTCFullYear()}-${String(nowUTC.getUTCMonth() + 1).padStart(2, "0")}`;
    startDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), 1, 0, 0, 0, 0));
    endDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  }

  return { periodDate, startDate, endDate };
};

// GET /api/competition/leaderboard/user-ranks - Multiple periods için kullanıcının sıralamalarını döner (optimize edilmiş)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodsParam = searchParams.get("periods") || "daily,weekly,monthly";
    const periods = periodsParam.split(",").filter((p): p is Period => ["daily", "weekly", "monthly"].includes(p as Period));
    const type = searchParams.get("type") || "quiz_count";

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tüm period'lar için cache'lenmiş entry'leri paralel olarak oku
    const periodBounds = periods.map((period) => ({
      period,
      ...getPeriodBounds(period),
      leaderboardPeriod: (period === "daily" ? "daily" : period === "weekly" ? "weekly" : "monthly") as LeaderboardPeriod,
    }));

    const cachedEntries = await Promise.all(
      periodBounds.map(({ period, periodDate, leaderboardPeriod }) =>
        db.leaderboardEntry.findUnique({
          where: {
            userId_period_periodDate: {
              userId,
              period: leaderboardPeriod,
              periodDate,
            },
          },
          select: {
            rank: true,
            quizCount: true,
            averageScore: true,
            points: true,
            highestScore: true,
          },
        }).then((entry: { rank: number; quizCount: number | null; averageScore: number | null; points: number | null; highestScore: number | null } | null) => ({ period, entry }))
      )
    );

    // Her period için sonucu hazırla
    const results: Record<string, any> = {};

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      const cachedEntry = cachedEntries[i]?.entry;

      if (cachedEntry && cachedEntry.rank > 0) {
        // Cache'de varsa direkt kullan
        results[period] = {
          rank: cachedEntry.rank,
          quizCount: cachedEntry.quizCount || 0,
          averageScore: cachedEntry.averageScore || 0,
          points: cachedEntry.points || 0,
          highestScore: cachedEntry.highestScore || 0,
        };
      } else {
        // Cache'de yoksa null döndür (dashboard'da gösterilmez)
        results[period] = null;
      }
    }

    return NextResponse.json({
      userRanks: results,
    });
  } catch (error) {
    console.error("Error fetching user ranks:", error);
    return NextResponse.json(
      { error: "Sıralamalar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

