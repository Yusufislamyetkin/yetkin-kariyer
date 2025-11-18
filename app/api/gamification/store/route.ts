import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listRewards } from "@/lib/services/gamification/store";
import { isGamificationEnabled } from "@/lib/featureFlags";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	if (!isGamificationEnabled()) {
		return NextResponse.json({ error: "Feature disabled" }, { status: 404 });
	}
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const rewards = await listRewards();
	return NextResponse.json({ rewards });
}


