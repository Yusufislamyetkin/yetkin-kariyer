import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const [events, transactions, redemptions, usersWithBalances] = await Promise.all([
		db.gamificationEvent.count(),
		db.pointTransaction.count(),
		db.rewardRedemption.count(),
		db.userBalance.count(),
	]);
	return NextResponse.json({
		events,
		transactions,
		redemptions,
		usersWithBalances,
	});
}


