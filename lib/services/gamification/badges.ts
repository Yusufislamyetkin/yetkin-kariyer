import { db } from "@/lib/db";

export async function awardBadgeIfEligible(userId: string, key: string) {
	const badge = await db.badge.findFirst({ where: { key } });
	if (!badge) return null;
	const existing = await db.userBadge.findUnique({
		where: { userId_badgeId: { userId, badgeId: badge.id } },
	});
	if (existing) return null;
	const created = await db.userBadge.create({
		data: { userId, badgeId: badge.id, isDisplayed: false },
	});
	return created;
}

export async function setFeaturedOrder(userId: string, badgeIdToOrder: Array<{ badgeId: string; order: number }>) {
	for (const { badgeId, order } of badgeIdToOrder) {
		await db.userBadge.update({
			where: { userId_badgeId: { userId, badgeId } },
			data: { featuredOrder: order, isDisplayed: order != null },
		});
	}
}


