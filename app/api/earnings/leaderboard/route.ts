import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly"; // daily or monthly

    // Get all users
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    // Calculate date filter based on period
    const now = new Date();
    const startDate = period === "daily"
      ? new Date(now.getTime() - 24 * 60 * 60 * 1000) // Last 24 hours
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

    // Calculate earnings for each user
    const earningsMap = new Map<string, {
      hackathon: number;
      leaderboard: number;
      freelancer: number;
      hackathonCount: number;
      leaderboardCount: number;
      freelancerCount: number;
    }>();

    // Initialize all users with zero earnings
    users.forEach((user: { id: string }) => {
      earningsMap.set(user.id, {
        hackathon: 0,
        leaderboard: 0,
        freelancer: 0,
        hackathonCount: 0,
        leaderboardCount: 0,
        freelancerCount: 0,
      });
    });

    // Get hackathon earnings (from submissions that won)
    try {
      const hackathonSubmissions = await db.hackathonSubmission.findMany({
        where: {
          status: {
            in: ["winner", "finalist"],
          },
          updatedAt: {
            gte: startDate,
          },
        },
        include: {
          hackathon: {
            select: {
              id: true,
              title: true,
            },
          },
          team: {
            include: {
              members: {
                where: {
                  status: "active",
                },
              },
            },
          },
        },
      });

      hackathonSubmissions.forEach((sub: { userId: string | null; team: { members: Array<{ userId: string }> } | null }) => {
        const earningsPerWin = 1000; // 1000 TL per win
        if (sub.userId) {
          const current = earningsMap.get(sub.userId);
          if (current) {
            current.hackathon += earningsPerWin;
            current.hackathonCount += 1;
          }
        }
        if (sub.team) {
          sub.team.members.forEach((member: { userId: string }) => {
            const current = earningsMap.get(member.userId);
            if (current) {
              current.hackathon += earningsPerWin;
              current.hackathonCount += 1;
            }
          });
        }
      });
    } catch (error) {
      console.error("Error fetching hackathon submissions:", error);
    }

    // Get leaderboard #1 positions
    try {
      const leaderboardFirstPlaces = await db.leaderboardEntry.findMany({
        where: {
          period: period === "daily" ? "daily" : "monthly",
          rank: 1,
          updatedAt: {
            gte: startDate,
          },
        },
      });

      leaderboardFirstPlaces.forEach((entry: { userId: string }) => {
        const earningsPerFirst = 500; // 500 TL per #1
        const current = earningsMap.get(entry.userId);
        if (current) {
          current.leaderboard += earningsPerFirst;
          current.leaderboardCount += 1;
        }
      });
    } catch (error) {
      console.error("Error fetching leaderboard entries:", error);
    }

    // Get freelancer earnings (accepted bids)
    try {
      const freelancerEarnings = await db.freelancerBid.findMany({
        where: {
          status: "accepted",
          updatedAt: {
            gte: startDate,
          },
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      freelancerEarnings.forEach((bid: { userId: string; amount: number | null }) => {
        const current = earningsMap.get(bid.userId);
        if (current) {
          current.freelancer += bid.amount || 0;
          current.freelancerCount += 1;
        }
      });
    } catch (error) {
      console.error("Error fetching freelancer earnings:", error);
    }

    // Build leaderboard entries - only include users with actual earnings (> 0)
    const leaderboard: EarningsLeaderboardEntry[] = users
      .map((user: { id: string; name: string | null; email: string; profileImage: string | null }) => {
        const earnings = earningsMap.get(user.id);
        if (!earnings) {
          return null;
        }

        const totalEarnings =
          earnings.hackathon + earnings.leaderboard + earnings.freelancer;

        // Only include users with actual earnings (greater than 0)
        if (totalEarnings <= 0) {
          return null;
        }

        return {
          userId: user.id,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          },
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
      .filter((entry: EarningsLeaderboardEntry | null): entry is EarningsLeaderboardEntry => entry !== null)
      .sort((a: EarningsLeaderboardEntry, b: EarningsLeaderboardEntry) => b.totalEarnings - a.totalEarnings)
      .map((entry: EarningsLeaderboardEntry, index: number) => ({
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

