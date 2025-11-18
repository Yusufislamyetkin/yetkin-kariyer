import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
	try {
		const { id } = params;
		// @ts-ignore
		const item = await db.liveCodingChallenge.findUnique({ where: { id } });
		if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ item });
	} catch (error: any) {
		console.error("[LIVE_GET]", error);
		return NextResponse.json({ error: "Failed to fetch live coding challenge" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, { params }: Params) {
	try {
		const { id } = params;
		const body = await req.json();
		// @ts-ignore
		const updated = await db.liveCodingChallenge.update({
			where: { id },
			data: body
		});
		return NextResponse.json({ item: updated });
	} catch (error: any) {
		console.error("[LIVE_UPDATE]", error);
		return NextResponse.json({ error: "Failed to update live coding challenge" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: Params) {
	try {
		const { id } = params;
		// @ts-ignore
		await db.liveCodingChallenge.delete({ where: { id } });
		return NextResponse.json({ ok: true });
	} catch (error: any) {
		console.error("[LIVE_DELETE]", error);
		return NextResponse.json({ error: "Failed to delete live coding challenge" }, { status: 500 });
	}
}

