import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(request: Request, context: { params: { id: string } }) {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json();
	const status: string = body.status;
	const code: string | undefined = body.code;
	if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });
	const updated = await db.rewardRedemption.update({
		where: { id: context.params.id },
		data: { status, code: code ?? undefined },
	});
	return NextResponse.json({ redemption: updated });
}


