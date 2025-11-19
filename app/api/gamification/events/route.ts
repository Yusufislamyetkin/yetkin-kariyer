import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { applyRules } from "@/lib/services/gamification/rules";
import { checkDedup, exceedsVelocityLimit, recordEvent } from "@/lib/services/gamification/antiAbuse";
import { isGamificationEnabled } from "@/lib/featureFlags";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
	try {
		if (!isGamificationEnabled()) {
			return NextResponse.json({ error: "Feature disabled" }, { status: 404 });
		}
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const body = await request.json();
		const type: string = body.type;
		const payload = body.payload || {};
		const dedupKey: string | undefined = body.dedupKey;
		const occurredAt: Date | undefined = body.occurredAt ? new Date(body.occurredAt) : undefined;

		if (!type) {
			return NextResponse.json({ error: "Missing event type" }, { status: 400 });
		}
		if (await checkDedup(dedupKey)) {
			return NextResponse.json({ dedup: true, awarded: { pointsDelta: 0, xpDelta: 0 } });
		}
		// simple velocity cap
		if (await exceedsVelocityLimit(session.user.id as string, type)) {
			return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
		}

		const event = await recordEvent({
			userId: session.user.id as string,
			type,
			payload,
			dedupKey,
			occurredAt,
		});
		const awarded = await applyRules({
			userId: event.userId,
			type: event.type,
			payload: { ...payload, sourceEventId: event.id },
		});
		return NextResponse.json({ eventId: event.id, awarded });
	} catch (error) {
		console.error("Gamification event error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}


