type Key = string;

export type RateLimitRule = {
	windowMs: number; // time window in ms
	max: number; // max allowed within window
};

type Slot = {
	resetAt: number;
	count: number;
};

const buckets = new Map<Key, Slot>();
const dedupe = new Map<Key, Map<string, number>>(); // key -> (hash -> expiresAt)

function now() {
	return Date.now();
}

export function rateLimitKey(parts: Array<string | number | undefined | null>): Key {
	return parts.filter((p) => p !== undefined && p !== null && String(p).length > 0).join(":");
}

export function checkRateLimit(key: Key, rule: RateLimitRule): { ok: true } | { ok: false; retryAfterMs: number } {
	const current = buckets.get(key);
	const ts = now();
	if (!current || current.resetAt <= ts) {
		buckets.set(key, { resetAt: ts + rule.windowMs, count: 1 });
		return { ok: true };
	}
	if (current.count < rule.max) {
		current.count += 1;
		return { ok: true };
	}
	return { ok: false, retryAfterMs: Math.max(0, current.resetAt - ts) };
}

export function remaining(key: Key, rule: RateLimitRule): { remaining: number; resetAt: number } {
	const current = buckets.get(key);
	if (!current) return { remaining: rule.max, resetAt: now() + rule.windowMs };
	return { remaining: Math.max(0, rule.max - current.count), resetAt: current.resetAt };
}

// Common presets
export const Limits = {
	publicGeneral: { windowMs: 10 * 60 * 1000, max: 60 } as RateLimitRule,
	userGeneral: { windowMs: 10 * 60 * 1000, max: 300 } as RateLimitRule,
	postCreate: { windowMs: 10 * 60 * 1000, max: 20 } as RateLimitRule,
	messageCreate: { windowMs: 10 * 60 * 1000, max: 120 } as RateLimitRule,
	loginIp: { windowMs: 10 * 60 * 1000, max: 10 } as RateLimitRule,
	loginUser: { windowMs: 10 * 60 * 1000, max: 5 } as RateLimitRule
};

function hashValue(input: string): string {
	// Simple FNV-1a hash
	let hash = 2166136261;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}
	// Convert to unsigned hex
	return (hash >>> 0).toString(16);
}

export function isDuplicateWithin(key: Key, value: string, ttlMs: number): boolean {
	const ts = now();
	let map = dedupe.get(key);
	if (!map) {
		map = new Map<string, number>();
		dedupe.set(key, map);
	}
	// Cleanup expired
	for (const [h, exp] of map.entries()) {
		if (exp <= ts) map.delete(h);
	}
	const h = hashValue(value);
	const exists = map.has(h);
	map.set(h, ts + ttlMs);
	return exists;
}


