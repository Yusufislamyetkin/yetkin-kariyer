import { db } from "@/lib/db";

export async function getLeaderboard(scope = "global", period: "daily" | "weekly" | "monthly" | "season" = "daily") {
	// For now, compute on the fly from PointTransaction over the period
	const now = new Date();
	const since =
		period === "daily"
			? new Date(now.getTime() - 24 * 60 * 60 * 1000)
			: period === "weekly"
			? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
			: period === "monthly"
			? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
			: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

	const rows = await db.pointTransaction.groupBy({
		by: ["userId"],
		where: { createdAt: { gte: since } },
		_sum: { delta: true },
		orderBy: { _sum: { delta: "desc" } },
		take: 100,
	});
	return rows.map((r: { userId: string; _sum: { delta: number | null } }, idx: number) => ({
		rank: idx + 1,
		userId: r.userId,
		points: r._sum.delta || 0,
		scope,
		period,
	}));
}


