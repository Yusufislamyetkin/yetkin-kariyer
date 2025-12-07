import { db } from "@/lib/db";

export type StreakUpdate = {
	count: number;
	longest: number;
	multiplier: number;
};

export async function updateDailyLoginStreak(userId: string, now = new Date()): Promise<StreakUpdate> {
	const streak = await db.userStreak.upsert({
		where: { userId },
		update: {},
		create: { userId, currentStreak: 0, longestStreak: 0, totalDaysActive: 0 },
	});
	const last = streak.lastActivityDate ? new Date(streak.lastActivityDate) : undefined;
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const yesterday = new Date(today);
	yesterday.setUTCDate(today.getUTCDate() - 1);

	let current = streak.currentStreak;
	let shouldIncrementTotalDays = false;
	if (!last) {
		current = 1;
		shouldIncrementTotalDays = true;
	} else {
		const lastDay = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()));
		if (lastDay.getTime() === today.getTime()) {
			// already counted today, keep streak
			shouldIncrementTotalDays = false;
		} else if (lastDay.getTime() === yesterday.getTime()) {
			current += 1;
			shouldIncrementTotalDays = true;
		} else {
			current = 1;
			shouldIncrementTotalDays = true;
		}
	}
	const longest = Math.max(streak.longestStreak, current);
	const totalDaysActive = shouldIncrementTotalDays ? (streak.totalDaysActive || 0) + 1 : (streak.totalDaysActive || 0);
	await db.userStreak.update({
		where: { userId },
		data: { currentStreak: current, longestStreak: longest, lastActivityDate: today, totalDaysActive },
	});
	const multiplier = current >= 30 ? 2.0 : current >= 7 ? 1.5 : current >= 3 ? 1.25 : 1.0;
	return { count: current, longest, multiplier };
}


