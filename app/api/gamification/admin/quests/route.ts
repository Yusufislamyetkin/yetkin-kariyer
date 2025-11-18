import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const quests = await db.quest.findMany({ orderBy: { createdAt: "desc" } });
	return NextResponse.json({ quests });
}

export async function POST(request: Request) {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json();
	const quest = await db.quest.create({
		data: {
			key: body.key,
			title: body.title,
			period: body.period,
			ruleJson: body.ruleJson,
			rewardJson: body.rewardJson,
			activeFrom: body.activeFrom ? new Date(body.activeFrom) : null,
			activeTo: body.activeTo ? new Date(body.activeTo) : null,
		},
	});
	return NextResponse.json({ quest });
}


