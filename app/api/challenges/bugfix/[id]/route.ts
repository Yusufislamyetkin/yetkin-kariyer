import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
	try {
		const { id } = params;
		// @ts-ignore
		const item = await db.bugFixChallenge.findUnique({ where: { id } });
		if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ item });
	} catch (error: any) {
		console.error("[BUGFIX_GET]", error);
		return NextResponse.json({ error: "Failed to fetch bugfix challenge" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, { params }: Params) {
	try {
		const { id } = params;
		const body = await req.json();
		// @ts-ignore
		const updated = await db.bugFixChallenge.update({
			where: { id },
			data: body
		});
		return NextResponse.json({ item: updated });
	} catch (error: any) {
		console.error("[BUGFIX_UPDATE]", error);
		return NextResponse.json({ error: "Failed to update bugfix challenge" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: Params) {
	try {
		const { id } = params;
		// @ts-ignore
		await db.bugFixChallenge.delete({ where: { id } });
		return NextResponse.json({ ok: true });
	} catch (error: any) {
		console.error("[BUGFIX_DELETE]", error);
		return NextResponse.json({ error: "Failed to delete bugfix challenge" }, { status: 500 });
	}
}

