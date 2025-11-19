import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { redeemReward } from "@/lib/services/gamification/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { rewardId } = await request.json();
		if (!rewardId) return NextResponse.json({ error: "Missing rewardId" }, { status: 400 });
		const redemption = await redeemReward(session.user.id as string, rewardId);
		return NextResponse.json({ redemption });
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "Redeem failed" }, { status: 400 });
	}
}


