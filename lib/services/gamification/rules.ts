import { db } from "@/lib/db";
import { applyXp } from "./level";
import { updateDailyLoginStreak } from "./streaks";

type Event = {
	userId: string;
	type: string;
	payload?: Record<string, any>;
};

export async function applyRules(event: Event) {
	let pointsDelta = 0;
	let xpDelta = 0;

	switch (event.type) {
		case "daily_login": {
			const streak = await updateDailyLoginStreak(event.userId);
			pointsDelta = Math.floor(10 * streak.multiplier);
			xpDelta = Math.floor(10 * streak.multiplier);
			break;
		}
		case "lesson_complete": {
			pointsDelta = 50;
			xpDelta = 50;
			if (event.payload?.perfectScore) {
				pointsDelta += 20;
			}
			break;
		}
		case "test_solved": {
			const firstAttempt = !!event.payload?.firstAttempt;
			pointsDelta = firstAttempt ? 10 : 3;
			xpDelta = firstAttempt ? 10 : 3;
			break;
		}
		case "live_coding_completed": {
			pointsDelta = 80;
			xpDelta = 100;
			break;
		}
		case "bug_fix_completed": {
			pointsDelta = 80;
			xpDelta = 100;
			break;
		}
		case "hackathon_submission": {
			pointsDelta = 150;
			xpDelta = 150;
			break;
		}
		case "hackathon_finalist": {
			pointsDelta = 400;
			xpDelta = 400;
			break;
		}
		case "hackathon_winner": {
			pointsDelta = 1200;
			xpDelta = 1200;
			break;
		}
		case "job_application": {
			pointsDelta = 20;
			xpDelta = 20;
			break;
		}
		case "interview_scheduled": {
			pointsDelta = 60;
			xpDelta = 60;
			break;
		}
		case "daily_strike_completed": {
			pointsDelta = 100;
			xpDelta = 100;
			break;
		}
		default:
			break;
	}

	// apply XP and compute level up
	const { levelUp } = await applyXp(event.userId, xpDelta);

	// update points balance + log transaction
	if (pointsDelta !== 0) {
		await db.$transaction(async (tx: any) => {
			await tx.userBalance.upsert({
				where: { userId: event.userId },
				update: { points: { increment: pointsDelta } },
				create: { userId: event.userId, points: pointsDelta, lifetimeXp: 0, level: 1 },
			});
			await tx.pointTransaction.create({
				data: {
					userId: event.userId,
					delta: pointsDelta,
					reason: event.type,
					sourceEvent: event.payload?.sourceEventId
						? { connect: { id: String(event.payload.sourceEventId) } }
						: undefined,
				},
			});
		});
	}

	return { pointsDelta, xpDelta, levelUp };
}


