import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EarningType } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Get all earnings from the Earning table (source of truth)
    let allEarnings: any[] = [];
    try {
      allEarnings = await db.earning.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          earnedAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      allEarnings = [];
    }

    // Group earnings by type
    const hackathonEarnings = allEarnings.filter(
      (e) => e.type === EarningType.HACKATHON
    );
    const leaderboardEarnings = allEarnings.filter(
      (e) => e.type === EarningType.MONTHLY_WINNER
    );
    const freelancerEarnings = allEarnings.filter(
      (e) => e.type === EarningType.FREELANCER_PROJECT
    );

    // Calculate totals
    const hackathonTotal = hackathonEarnings.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    const leaderboardTotal = leaderboardEarnings.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    const freelancerTotal = freelancerEarnings.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    const totalEarnings = hackathonTotal + leaderboardTotal + freelancerTotal;

    // Helper function to get title from metadata
    const getTitle = (earning: any, type: EarningType): string => {
      if (earning.metadata) {
        const metadata = earning.metadata as any;
        if (type === EarningType.HACKATHON && metadata.hackathonTitle) {
          return metadata.hackathonTitle;
        }
        if (type === EarningType.FREELANCER_PROJECT && metadata.projectTitle) {
          return metadata.projectTitle;
        }
        if (type === EarningType.MONTHLY_WINNER && metadata.periodDate) {
          return `Ayın 1.'si - ${metadata.periodDate}`;
        }
      }
      // Fallback titles
      switch (type) {
        case EarningType.HACKATHON:
          return "Hackathon";
        case EarningType.MONTHLY_WINNER:
          return "Ayın 1.'si";
        case EarningType.FREELANCER_PROJECT:
          return "Proje";
        default:
          return "Kazanç";
      }
    };

    // Format earnings data
    const earnings = {
      total: totalEarnings,
      breakdown: {
        hackathon: {
          total: hackathonTotal,
          count: hackathonEarnings.length,
          items: hackathonEarnings.map((e) => ({
            id: e.id,
            title: getTitle(e, EarningType.HACKATHON),
            amount: Number(e.amount),
            date: e.earnedAt.toISOString(),
            type: "hackathon",
          })),
        },
        leaderboard: {
          total: leaderboardTotal,
          count: leaderboardEarnings.length,
          items: leaderboardEarnings.map((e) => ({
            id: e.id,
            title: getTitle(e, EarningType.MONTHLY_WINNER),
            amount: Number(e.amount),
            date: e.earnedAt.toISOString(),
            type: "leaderboard",
          })),
        },
        freelancer: {
          total: freelancerTotal,
          count: freelancerEarnings.length,
          items: freelancerEarnings.map((e) => ({
            id: e.id,
            title: getTitle(e, EarningType.FREELANCER_PROJECT),
            amount: Number(e.amount),
            date: e.earnedAt.toISOString(),
            type: "freelancer",
          })),
        },
      },
      allItems: allEarnings.map((e) => {
        let type: "hackathon" | "leaderboard" | "freelancer";
        switch (e.type) {
          case EarningType.HACKATHON:
            type = "hackathon";
            break;
          case EarningType.MONTHLY_WINNER:
            type = "leaderboard";
            break;
          case EarningType.FREELANCER_PROJECT:
            type = "freelancer";
            break;
          default:
            type = "hackathon"; // fallback
        }
        return {
          id: e.id,
          title: getTitle(e, e.type),
          amount: Number(e.amount),
          date: e.earnedAt.toISOString(),
          type: type,
        };
      }),
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

