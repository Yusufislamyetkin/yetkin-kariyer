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
	
	// UserEarnedPoint kaydı ekle
	if (created && badge.points && badge.points > 0) {
		try {
			await db.userEarnedPoint.create({
				data: {
					userId,
					points: badge.points,
					source: "BADGE",
					sourceId: badge.id,
				},
			});
		} catch (pointError) {
			// UserEarnedPoint kaydı başarısız olsa bile rozet kaydı başarılı sayılır
			console.warn(`[awardBadgeIfEligible] UserEarnedPoint kaydı eklenirken hata:`, pointError);
		}
	}
	
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


