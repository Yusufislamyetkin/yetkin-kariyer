import { NextResponse } from "next/server";
import { seedChallenges } from "@/scripts/seed-challenges";

export async function POST() {
	try {
		// TODO: add auth check (admin only) when auth context is available
		await seedChallenges();
		return NextResponse.json({ ok: true });
	} catch (error: any) {
		console.error("[ADMIN_SEED_CHALLENGES]", error);
		return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
	}
}

