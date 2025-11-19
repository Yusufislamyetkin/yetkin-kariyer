import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const now = new Date();
	const quests = await db.quest.findMany({
		where: {
			OR: [{ activeFrom: null }, { activeFrom: { lte: now } }],
			AND: [{ activeTo: null }, { activeTo: { gte: now } }],
		},
		orderBy: { createdAt: "desc" },
	});
	const progresses = await db.questProgress.findMany({
		where: { userId: session.user.id as string },
	});
	return NextResponse.json({ quests, progresses });
}


