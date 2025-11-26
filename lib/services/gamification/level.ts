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

/**
 * Calculate points required for a specific level
 * Formula: Linear at start (100 points for level 1), then gradually increases
 * Level 1: 0-100 points (100 points needed)
 * Level 2: 100-250 points (150 points needed)
 * Level 3: 250-450 points (200 points needed)
 * Level 4: 450-700 points (250 points needed)
 * Formula: pointsForLevel(n) = 25 * n * (n + 3)
 * This gives: 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250...
 */
export const pointsForLevel = (level: number): number => {
	if (level <= 1) return 0;
	// Formula: 25 * n * (n + 3)
	// Level 1: 25 * 1 * 4 = 100 ✓
	// Level 2: 25 * 2 * 5 = 250 ✓
	// Level 3: 25 * 3 * 6 = 450 ✓
	// Level 4: 25 * 4 * 7 = 700 ✓
	return Math.floor(25 * level * (level + 3));
};

/**
 * Calculate level from total points
 * Linear at start (100 points = level 1), then gradually increases difficulty
 */
export const calculateLevelFromPoints = (totalPoints: number): number => {
	if (totalPoints < 100) return 1;
	
	let level = 1;
	// Find highest level whose required points is <= totalPoints
	while (pointsForLevel(level + 1) <= totalPoints) {
		level += 1;
		if (level > 1000) break; // Safety limit
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


