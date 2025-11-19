import { db } from "@/lib/db";

export const xpForLevel = (level: number): number => {
	if (level <= 1) return 0;
	// xpForLevel(n) ~ 100 * n^1.3 (rounded)
	return Math.floor(100 * Math.pow(level, 1.3));
};

export const calculateLevelFromXp = (lifetimeXp: number): number => {
	let level = 1;
	// find highest level whose required xp is <= lifetimeXp
	while (xpForLevel(level + 1) <= lifetimeXp) {
		level += 1;
		if (level > 1000) break;
	}
	return level;
};

export const applyXp = async (userId: string, xpDelta: number) => {
	const balance = await db.userBalance.upsert({
		where: { userId },
		update: {},
		create: { userId, points: 0, lifetimeXp: 0, level: 1 },
	});
	const newXp = Math.max(0, balance.lifetimeXp + xpDelta);
	const newLevel = calculateLevelFromXp(newXp);
	const levelUp =
		newLevel > balance.level ? { previousLevel: balance.level, newLevel } : undefined;
	await db.userBalance.update({
		where: { userId },
		data: { lifetimeXp: newXp, level: newLevel },
	});
	return { levelUp, newLevel };
};


