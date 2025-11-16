import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Get hackathon earnings (from submissions that won)
    let hackathonSubmissions: any[] = [];
    try {
      hackathonSubmissions = await db.hackathonSubmission.findMany({
        where: {
          OR: [
            { userId: userId },
            {
              team: {
                members: {
                  some: {
                    userId: userId,
                    status: "active",
                  },
                },
              },
            },
          ],
          status: {
            in: ["winner", "finalist"],
          },
        },
        include: {
          hackathon: {
            select: {
              id: true,
              title: true,
              prizesSummary: true,
            },
          },
          team: {
            include: {
              members: {
                where: {
                  userId: userId,
                  status: "active",
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching hackathon submissions:", error);
      hackathonSubmissions = [];
    }

    // Get monthly leaderboard #1 positions
    let monthlyFirstPlaces: any[] = [];
    try {
      monthlyFirstPlaces = await db.leaderboardEntry.findMany({
        where: {
          userId: userId,
          period: "monthly",
          rank: 1,
        },
        orderBy: {
          periodDate: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching leaderboard entries:", error);
      monthlyFirstPlaces = [];
    }

    // Get freelancer earnings (accepted bids)
    let freelancerEarnings: any[] = [];
    try {
      freelancerEarnings = await db.freelancerBid.findMany({
        where: {
          userId: userId,
          status: "accepted",
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching freelancer earnings:", error);
      freelancerEarnings = [];
    }

    // Calculate totals
    const hackathonTotal = hackathonSubmissions.length * 1000; // Placeholder: 1000 TL per win
    const leaderboardTotal = monthlyFirstPlaces.length * 500; // Placeholder: 500 TL per #1
    const freelancerTotal = freelancerEarnings.reduce((sum, bid) => sum + (bid.amount || 0), 0);
    const totalEarnings = hackathonTotal + leaderboardTotal + freelancerTotal;

    // Format earnings data
    const earnings = {
      total: totalEarnings,
      breakdown: {
        hackathon: {
          total: hackathonTotal,
          count: hackathonSubmissions.length,
          items: hackathonSubmissions.map((sub) => ({
            id: sub.id,
            title: sub.hackathon?.title || "Hackathon",
            amount: 1000, // Placeholder
            date: sub.updatedAt.toISOString(),
            type: "hackathon",
          })),
        },
        leaderboard: {
          total: leaderboardTotal,
          count: monthlyFirstPlaces.length,
          items: monthlyFirstPlaces.map((entry) => ({
            id: entry.id,
            title: `Ayın 1.'si - ${entry.periodDate}`,
            amount: 500, // Placeholder
            date: entry.updatedAt.toISOString(),
            type: "leaderboard",
          })),
        },
        freelancer: {
          total: freelancerTotal,
          count: freelancerEarnings.length,
          items: freelancerEarnings.map((bid) => ({
            id: bid.id,
            title: bid.project?.title || "Proje",
            amount: bid.amount || 0,
            date: bid.updatedAt.toISOString(),
            type: "freelancer",
          })),
        },
      },
      allItems: [
        ...hackathonSubmissions.map((sub) => ({
          id: sub.id,
          title: sub.hackathon?.title || "Hackathon",
          amount: 1000,
          date: sub.updatedAt.toISOString(),
          type: "hackathon" as const,
        })),
        ...monthlyFirstPlaces.map((entry) => ({
          id: entry.id,
          title: `Ayın 1.'si - ${entry.periodDate}`,
          amount: 500,
          date: entry.updatedAt.toISOString(),
          type: "leaderboard" as const,
        })),
        ...freelancerEarnings.map((bid) => ({
          id: bid.id,
          title: bid.project?.title || "Proje",
          amount: bid.amount || 0,
          date: bid.updatedAt.toISOString(),
          type: "freelancer" as const,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };

    return NextResponse.json({ earnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json(
      { error: "Kazanç verileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

