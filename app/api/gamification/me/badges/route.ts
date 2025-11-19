import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const badges = await db.userBadge.findMany({
		where: { userId: session.user.id as string },
		include: { badge: true },
		orderBy: [{ featuredOrder: "asc" }, { earnedAt: "desc" }],
	});
	return NextResponse.json({ badges });
}

export async function PATCH(request: Request) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json();
	const featured: Array<{ badgeId: string; order: number }> = body.featured ?? [];
	for (const { badgeId, order } of featured) {
		await db.userBadge.update({
			where: { userId_badgeId: { userId: session.user.id as string, badgeId } },
			data: { featuredOrder: order, isDisplayed: order != null },
		});
	}
	return NextResponse.json({ ok: true });
}


