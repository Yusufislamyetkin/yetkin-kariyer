import { checkRateLimit, rateLimitKey, Limits, isDuplicateWithin } from "@/lib/security/rateLimit";
import test from "node:test";
import assert from "node:assert";

test("rateLimit allows up to max within window", () => {
	const key = rateLimitKey(["test", "allow"]);
	for (let i = 0; i < Limits.publicGeneral.max; i++) {
		const res = checkRateLimit(key, Limits.publicGeneral);
		assert.equal(res.ok, true);
	}
	const blocked = checkRateLimit(key, Limits.publicGeneral);
	assert.equal(blocked.ok, false);
});

test("deduplicates content within TTL", () => {
	const key = rateLimitKey(["dup", "user"]);
	const first = isDuplicateWithin(key, "same content", 60_000);
	assert.equal(first, false);
	const second = isDuplicateWithin(key, "same content", 60_000);
	assert.equal(second, true);
});


