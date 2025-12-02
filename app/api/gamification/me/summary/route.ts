import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isGamificationEnabled } from "@/lib/featureFlags";
import { calculateLevelFromPoints } from "@/lib/services/gamification/level";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		if (!isGamificationEnabled()) {
			return NextResponse.json({ error: "Feature disabled" }, { status: 404 });
		}
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userId = session.user.id as string;
		const [balance, badges, transactions, streak] = await Promise.all([
			db.userBalance.findUnique({ where: { userId } }),
			db.userBadge.findMany({
				where: { userId },
				include: { badge: true },
				orderBy: [{ featuredOrder: "asc" }, { earnedAt: "desc" }],
				take: 50,
			}),
			db.pointTransaction.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
				take: 20,
			}),
			db.userStreak.findUnique({ where: { userId } }),
		]);
		
		// Calculate total points from badges
		const badgePoints = badges.reduce((sum: number, userBadge: typeof badges[0]) => sum + (userBadge.badge.points || 0), 0);
		
		// Add strike points and other activity points from UserBalance
		const balancePoints = balance?.points ?? 0;
		
		// Total points = badge points + strike/activity points
		const totalPoints = badgePoints + balancePoints;
		
		// Calculate level from total points
		const calculatedLevel = calculateLevelFromPoints(totalPoints);
		
		return NextResponse.json({
			points: totalPoints, // Badge points + strike/activity points
			xp: balance?.lifetimeXp ?? 0,
			level: calculatedLevel, // Calculate level from points
			streak: {
				current: streak?.currentStreak ?? 0,
				longest: streak?.longestStreak ?? 0,
			},
			badges,
			recentTransactions: transactions,
		});
	} catch (error) {
		console.error("Summary error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}


