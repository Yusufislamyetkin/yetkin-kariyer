import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(_req: Request, context: { params: { id: string } }) {
	try {
		const session = await auth();
		if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		const userId = session.user.id as string;
		const quest = await db.quest.findUnique({ where: { id: context.params.id } });
		if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
		const progress = await db.questProgress.findUnique({
			where: { userId_questId: { userId, questId: quest.id } },
		});
		if (!progress || !progress.completedAt) {
			return NextResponse.json({ error: "Quest not completed" }, { status: 400 });
		}
		// simple reward: add points from rewardJson.points
		const rewardPoints = (quest.rewardJson as any)?.points ?? 0;
		if (rewardPoints > 0) {
			await db.$transaction(async (tx: any) => {
				await tx.userBalance.upsert({
					where: { userId },
					update: { points: { increment: rewardPoints } },
					create: { userId, points: rewardPoints, lifetimeXp: 0, level: 1 },
				});
				await tx.pointTransaction.create({
					data: {
						userId,
						delta: rewardPoints,
						reason: `quest:${quest.key}:claim`,
					},
				});
			});
		}
		return NextResponse.json({ ok: true, pointsGranted: rewardPoints });
	} catch (e) {
		return NextResponse.json({ error: "Claim failed" }, { status: 500 });
	}
}


