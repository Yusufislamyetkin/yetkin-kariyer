import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json();
	const questId: string = body.questId;
	const delta: number = Number(body.delta ?? 1);
	if (!questId) return NextResponse.json({ error: "questId required" }, { status: 400 });
	const quest = await db.quest.findUnique({ where: { id: questId } });
	if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
	const progress = await db.questProgress.upsert({
		where: { userId_questId: { userId: session.user.id as string, questId } },
		update: { progress: { increment: delta } },
		create: { userId: session.user.id as string, questId, progress: Math.max(0, delta) },
	});
	// auto complete if ruleJson.target exists
	const target = (quest.ruleJson as any)?.target;
	let completed = false;
	if (typeof target === "number" && progress.progress >= target && !progress.completedAt) {
		await db.questProgress.update({
			where: { id: progress.id },
			data: { completedAt: new Date() },
		});
		completed = true;
	}
	return NextResponse.json({ progress: { ...progress, completed } });
}


