import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if (((session?.user as any)?.role) !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const badges = await db.badge.findMany({ orderBy: { createdAt: "desc" } });
	return NextResponse.json({ badges });
}

export async function POST(request: Request) {
	const session = await auth();
	if (((session?.user as any)?.role) !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json();
	const badge = await db.badge.create({
		data: {
			key: body.key,
			name: body.name,
			description: body.description,
			icon: body.icon,
			iconUrl: body.iconUrl ?? null,
			color: body.color,
			category: body.category,
			criteria: body.criteria ?? {},
			rarity: body.rarity ?? "common",
			tier: body.tier ?? null,
			points: Number(body.points ?? 10),
			ruleJson: body.ruleJson ?? null,
		},
	});
	return NextResponse.json({ badge });
}


