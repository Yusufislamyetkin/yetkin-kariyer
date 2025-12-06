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
  // Use UTC for all date calculations to match database timestamps
  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
  
  let periodDate: string;
  let startDate: Date;
  let endDate: Date;

  if (period === "daily") {
    // Get today's date in UTC
    periodDate = nowUTC.toISOString().split("T")[0];
    startDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate(), 0, 0, 0, 0));
    endDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate() + 1, 0, 0, 0, 0));
  } else if (period === "weekly") {
    // Get Monday of current week in UTC
    const day = nowUTC.getUTCDay();
    const diff = nowUTC.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const mondayUTC = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), diff, 0, 0, 0, 0));
    startDate = mondayUTC;
    
    // Get Sunday of current week (end of week)
    endDate = new Date(Date.UTC(mondayUTC.getUTCFullYear(), mondayUTC.getUTCMonth(), mondayUTC.getUTCDate() + 7, 0, 0, 0, 0));
    
    // Format periodDate as YYYY-WW (year-week number) - Ana endpoint ile aynı format
    const year = startDate.getUTCFullYear();
    const weekNumber = getWeekNumber(startDate);
    periodDate = `${year}-W${String(weekNumber).padStart(2, "0")}`;
  } else {
    // monthly - use UTC
    periodDate = `${nowUTC.getUTCFullYear()}-${String(nowUTC.getUTCMonth() + 1).padStart(2, "0")}`;
    startDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), 1, 0, 0, 0, 0));
    endDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  }

  return { periodDate, startDate, endDate };
};

// GET /api/competition/leaderboard/user-rank - Sadece kullanıcının sıralamasını döner (optimize edilmiş)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "daily") as Period;
    const type = searchParams.get("type") || "quiz_count";

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { periodDate, startDate, endDate } = getPeriodBounds(period);
    const leaderboardPeriod: LeaderboardPeriod =
      (period === "daily" ? "daily" : period === "weekly" ? "weekly" : "monthly") as LeaderboardPeriod;

    // Önce cache'lenmiş leaderboardEntry'den oku (çok daha hızlı)
    const cachedEntry = await db.leaderboardEntry.findUnique({
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
    });

    // Eğer cache'de varsa direkt döndür
    if (cachedEntry && cachedEntry.rank > 0) {
      return NextResponse.json({
        userRank: {
          rank: cachedEntry.rank,
          quizCount: cachedEntry.quizCount || 0,
          averageScore: cachedEntry.averageScore || 0,
          points: cachedEntry.points || 0,
          highestScore: cachedEntry.highestScore || 0,
        },
      });
    }

    // Cache'de yoksa, kullanıcının verilerini hesapla (sadece bu kullanıcı için)
    const [user, userPoints, userBadges] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      }),
      db.userEarnedPoint.groupBy({
        by: ["userId"],
        where: {
          userId,
          earnedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        _sum: {
          points: true,
        },
      }),
      db.userBadge.findMany({
        where: {
          userId,
          isDisplayed: true,
        },
        include: {
          badge: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
              rarity: true,
            },
          },
        },
        take: 3,
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kullanıcının bu period'daki attempt'lerini say
    const [quizCount, testCount] = await Promise.all([
      db.quizAttempt.count({
        where: {
          userId,
          completedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
      db.testAttempt.count({
        where: {
          userId,
          completedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
    ]);

    // Ortalama skor hesapla
    const testStats = await db.testAttempt.aggregate({
      where: {
        userId,
        completedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _avg: {
        metrics: true,
      },
      _max: {
        metrics: true,
      },
    });

    const averageScore = testStats._avg.metrics
      ? (typeof testStats._avg.metrics === "object" && testStats._avg.metrics !== null && "score" in testStats._avg.metrics
          ? (testStats._avg.metrics as { score?: number }).score || 0
          : 0)
      : 0;

    const highestScore = testStats._max.metrics
      ? (typeof testStats._max.metrics === "object" && testStats._max.metrics !== null && "score" in testStats._max.metrics
          ? (testStats._max.metrics as { score?: number }).score || 0
          : 0)
      : 0;

    const points = userPoints[0]?._sum.points || 0;

    // Rank hesaplamak için leaderboardEntry tablosundan oku (eğer varsa)
    // Bu tablo zaten tüm kullanıcıların rank'larını içeriyor
    const leaderboardEntry = await db.leaderboardEntry.findUnique({
      where: {
        userId_period_periodDate: {
          userId,
          period: leaderboardPeriod,
          periodDate,
        },
      },
      select: {
        rank: true,
      },
    });

    let rank = leaderboardEntry?.rank || null;

    // Eğer cache'de rank yoksa veya 0 ise, kullanıcının aktivitesi varsa rank hesapla
    if (!rank || rank === 0) {
      // Eğer kullanıcının bu period'da aktivitesi varsa (quiz veya points), rank hesapla
      if (quizCount > 0 || points > 0 || testCount > 0) {
        if (type === "quiz_count") {
          // Bu period'da daha fazla quiz yapan kullanıcı sayısını say
          const usersWithMoreQuizzes = await db.quizAttempt.groupBy({
            by: ["userId"],
            where: {
              completedAt: {
                gte: startDate,
                lt: endDate,
              },
            },
            _count: {
              _all: true,
            },
            having: {
              _count: {
                _all: {
                  gt: quizCount,
                },
              },
            },
          });
          rank = usersWithMoreQuizzes.length + 1;
        } else {
          // Points bazlı rank
          const usersWithMorePoints = await db.userEarnedPoint.groupBy({
            by: ["userId"],
            where: {
              earnedAt: {
                gte: startDate,
                lt: endDate,
              },
            },
            _sum: {
              points: true,
            },
            having: {
              _sum: {
                points: {
                  gt: points,
                },
              },
            },
          });
          rank = usersWithMorePoints.length + 1;
        }
      }
    }

    // Eğer hala rank yoksa ama aktivite varsa, en azından bir rank ver (son sıralarda olabilir)
    if ((!rank || rank === 0) && (quizCount > 0 || points > 0 || testCount > 0)) {
      // Tüm aktif kullanıcı sayısını al ve son sıralarda olduğunu varsay
      const totalActiveUsers = await db.quizAttempt.groupBy({
        by: ["userId"],
        where: {
          completedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      rank = totalActiveUsers.length; // Son sıralarda olduğunu varsay
    }

    return NextResponse.json({
      userRank: {
        rank: rank && rank > 0 ? rank : null,
        quizCount,
        averageScore: Math.round(averageScore),
        points,
        highestScore: Math.round(highestScore),
      },
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return NextResponse.json(
      { error: "Sıralama yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

