export type GamificationEventPayload = {
	userId: string;
	type: string;
	payload?: Record<string, unknown>;
	occurredAt?: Date;
	dedupKey?: string;
};

export type AwardResult = {
	pointsDelta: number;
	xpDelta: number;
	levelUp?: { previousLevel: number; newLevel: number };
	awardedBadges?: string[];
	streaks?: { type: string; count: number; multiplier: number };
	transactions?: string[];
};

// Placeholder event bus. In production, swap with a queue or background job.
export const publishEvent = async (_event: GamificationEventPayload): Promise<void> => {
	return;
};


