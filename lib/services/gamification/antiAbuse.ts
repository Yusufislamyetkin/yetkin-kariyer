import { db } from "@/lib/db";

export async function checkDedup(dedupKey?: string) {
	if (!dedupKey) return false;
	const existing = await db.gamificationEvent.findUnique({ where: { dedupKey } });
	return !!existing;
}

export async function recordEvent(params: {
	userId: string;
	type: string;
	payload?: any;
	dedupKey?: string;
	occurredAt?: Date;
}) {
	return db.gamificationEvent.create({
		data: {
			userId: params.userId,
			type: params.type,
			payload: params.payload,
			dedupKey: params.dedupKey,
			occurredAt: params.occurredAt ?? new Date(),
		},
	});
}

export async function exceedsVelocityLimit(userId: string, type: string, maxPerHour = 100) {
	const since = new Date(Date.now() - 60 * 60 * 1000);
	const count = await db.gamificationEvent.count({
		where: { userId, type, occurredAt: { gte: since } },
	});
	return count >= maxPerHour;
}


