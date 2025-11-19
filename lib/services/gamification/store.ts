import { db } from "@/lib/db";

export async function listRewards() {
	return db.reward.findMany({
		orderBy: { createdAt: "desc" },
	});
}

export async function redeemReward(userId: string, rewardId: string) {
	return db.$transaction(async (tx: any) => {
		const reward = await tx.reward.findUnique({ where: { id: rewardId } });
		if (!reward) throw new Error("Reward not found");
			// @ts-ignore Prisma enum type mapping at runtime
			const rewardType: string = (reward as any).type;
		const balance = await tx.userBalance.upsert({
			where: { userId },
			update: {},
			create: { userId, points: 0, lifetimeXp: 0, level: 1 },
		});
		if (balance.points < reward.cost) throw new Error("Insufficient points");
		if (reward.stock != null && reward.stock <= 0) throw new Error("Out of stock");
		// deduct points
		await tx.userBalance.update({
			where: { userId },
			data: { points: { decrement: reward.cost } },
		});
		// decrement stock if finite
		if (reward.stock != null) {
			await tx.reward.update({ where: { id: reward.id }, data: { stock: { decrement: 1 } } });
		}
		// create redemption
		const redemption = await tx.rewardRedemption.create({
			data: {
				userId,
				rewardId: reward.id,
				cost: reward.cost,
					status: rewardType === "VIRTUAL" ? "FULFILLED" : "REQUESTED",
			},
		});
			// grant virtual inventory immediately
			if (rewardType === "VIRTUAL") {
				await tx.userInventory.upsert({
					where: { userId_itemKey: { userId, itemKey: reward.sku } },
					update: { metaJson: reward.metaJson ?? undefined },
					create: { userId, itemKey: reward.sku, metaJson: reward.metaJson ?? undefined },
				});
			}
		// log transaction
		await tx.pointTransaction.create({
			data: {
				userId,
				delta: -reward.cost,
				reason: `redeem:${reward.sku}`,
			},
		});
		return redemption;
	});
}


