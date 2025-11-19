import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(request: Request, context: { params: { id: string } }) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json();
	const redemption = await db.rewardRedemption.findUnique({ where: { id: context.params.id } });
	if (!redemption || redemption.userId !== session.user.id) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
	if (redemption.status !== "REQUESTED") {
		return NextResponse.json({ error: "Cannot update shipping" }, { status: 400 });
	}
	const updated = await db.rewardRedemption.update({
		where: { id: redemption.id },
		data: { shippingJson: body.shipping ?? {} },
	});
	return NextResponse.json({ redemption: updated });
}


