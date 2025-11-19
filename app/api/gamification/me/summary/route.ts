import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isGamificationEnabled } from "@/lib/featureFlags";

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
		return NextResponse.json({
			points: balance?.points ?? 0,
			xp: balance?.lifetimeXp ?? 0,
			level: balance?.level ?? 1,
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


