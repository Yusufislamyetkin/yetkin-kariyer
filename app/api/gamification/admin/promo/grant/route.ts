import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json();
	const userId: string = body.userId;
	const points: number = Number(body.points ?? 0);
	const inventoryItemKey: string | undefined = body.itemKey;
	if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
	await db.$transaction(async (tx: any) => {
		if (points && points !== 0) {
			await tx.userBalance.upsert({
				where: { userId },
				update: { points: { increment: points } },
				create: { userId, points, lifetimeXp: 0, level: 1 },
			});
			await tx.pointTransaction.create({
				data: { userId, delta: points, reason: "promo:grant" },
			});
		}
		if (inventoryItemKey) {
			await tx.userInventory.upsert({
				where: { userId_itemKey: { userId, itemKey: inventoryItemKey } },
				update: {},
				create: { userId, itemKey: inventoryItemKey },
			});
		}
	});
	return NextResponse.json({ ok: true });
}


