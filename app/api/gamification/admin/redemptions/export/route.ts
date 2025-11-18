import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	const session = await auth();
	if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const rows = await db.rewardRedemption.findMany({
		where: { status: { in: ["REQUESTED", "APPROVED"] } },
		include: {
			reward: true,
			user: { select: { id: true, email: true, name: true } },
		},
		orderBy: { createdAt: "asc" },
	});
	const headers = ["id", "createdAt", "status", "userId", "email", "name", "rewardSku", "rewardTitle", "shippingJson"].join(",");
	const csv = [headers]
		.concat(
			rows.map((r: {
        id: string;
        createdAt: Date;
        status: string;
        userId: string;
        user?: { email?: string | null; name?: string | null } | null;
        reward: { sku: string; title: string };
        shippingJson?: unknown;
      }) =>
				[
					r.id,
					r.createdAt.toISOString(),
					r.status,
					r.userId,
					r.user?.email ?? "",
					r.user?.name ?? "",
					r.reward.sku,
					r.reward.title,
					JSON.stringify(r.shippingJson ?? {}),
				].join(","),
			),
		)
		.join("\n");
	return new NextResponse(csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="redemptions.csv"`,
		},
	});
}


