import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EarningType } from "@prisma/client";

interface EarningsLeaderboardEntry {
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  rank: number;
  totalEarnings: number;
  breakdown: {
    hackathon: number;
    leaderboard: number;
    freelancer: number;
  };
  counts: {
    hackathon: number;
    leaderboard: number;
    freelancer: number;
  };
}

/**
 * Calculate start date based on period
 * - daily: last 24 hours
 * - weekly: beginning of current calendar week (Monday)
 * - monthly: last 30 days
 */
function getStartDate(period: "daily" | "weekly" | "monthly"): Date {
  const now = new Date();
  
  if (period === "daily") {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  
  if (period === "weekly") {
    // Get Monday of current week
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
  
  // monthly
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get("period") || "monthly";
    const period = (periodParam === "daily" || periodParam === "weekly" || periodParam === "monthly")
      ? periodParam
      : "monthly";

    // Calculate start date based on period
    const startDate = getStartDate(period);

    // Get all earnings in the period, grouped by user and type
    const earnings = await db.earning.findMany({
      where: {
        earnedAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    // Group earnings by user and type
    const earningsMap = new Map<string, {
      hackathon: number;
      leaderboard: number;
      freelancer: number;
      hackathonCount: number;
      leaderboardCount: number;
      freelancerCount: number;
      user: {
        id: string;
        name: string | null;
        email: string;
        profileImage: string | null;
      };
    }>();

    earnings.forEach((earning: { userId: string; type: EarningType; amount: number; user: { id: string; name: string | null; email: string; profileImage: string | null } }) => {
      const userId = earning.userId;
      let userEarnings = earningsMap.get(userId);

      if (!userEarnings) {
        userEarnings = {
          hackathon: 0,
          leaderboard: 0,
          freelancer: 0,
          hackathonCount: 0,
          leaderboardCount: 0,
          freelancerCount: 0,
          user: earning.user,
        };
        earningsMap.set(userId, userEarnings);
      }

      switch (earning.type) {
        case EarningType.HACKATHON:
          userEarnings.hackathon += earning.amount;
          userEarnings.hackathonCount += 1;
          break;
        case EarningType.MONTHLY_WINNER:
          userEarnings.leaderboard += earning.amount;
          userEarnings.leaderboardCount += 1;
          break;
        case EarningType.FREELANCER_PROJECT:
          userEarnings.freelancer += earning.amount;
          userEarnings.freelancerCount += 1;
          break;
      }
    });

    // Build leaderboard entries - only include users with actual earnings (> 0)
    const leaderboard: EarningsLeaderboardEntry[] = Array.from(earningsMap.values())
      .map((earnings) => {
        const totalEarnings =
          earnings.hackathon + earnings.leaderboard + earnings.freelancer;

        // Only include users with actual earnings (greater than 0)
        if (totalEarnings <= 0) {
          return null;
        }

        return {
          userId: earnings.user.id,
          user: earnings.user,
          rank: 0, // Will be set after sorting
          totalEarnings,
          breakdown: {
            hackathon: earnings.hackathon,
            leaderboard: earnings.leaderboard,
            freelancer: earnings.freelancer,
          },
          counts: {
            hackathon: earnings.hackathonCount,
            leaderboard: earnings.leaderboardCount,
            freelancer: earnings.freelancerCount,
          },
        };
      })
      .filter((entry): entry is EarningsLeaderboardEntry => entry !== null)
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching earnings leaderboard:", error);
    return NextResponse.json(
      { error: "Kazanç sıralaması yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

