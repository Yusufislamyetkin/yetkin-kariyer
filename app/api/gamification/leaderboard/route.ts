import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLeaderboard } from "@/lib/services/gamification/leaderboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const scope = searchParams.get("scope") || "global";
	const period = (searchParams.get("period") as any) || "daily";
	const data = await getLeaderboard(scope, period);
	return NextResponse.json({ scope, period, data });
}


