import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const rewards = await db.reward.findMany({ orderBy: { createdAt: "desc" } });
	return NextResponse.json({ rewards });
}

export async function POST(request: Request) {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json();
	const reward = await db.reward.create({
		data: {
			sku: body.sku,
			title: body.title,
			type: body.type,
			cost: Number(body.cost),
			stock: body.stock ?? null,
			metaJson: body.metaJson ?? null,
		},
	});
	return NextResponse.json({ reward });
}


