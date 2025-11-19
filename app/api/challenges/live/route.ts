import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const q = searchParams.get("q") || undefined;
		const tag = searchParams.get("tag") || undefined;
		const published = searchParams.get("published");

		const where: any = {};
		if (typeof q === "string" && q.trim()) {
			where.OR = [
				{ title: { contains: q, mode: "insensitive" } },
				{ description: { contains: q, mode: "insensitive" } }
			];
		}
		if (typeof tag === "string" && tag.trim()) {
			where.tags = { has: tag };
		}
		if (published === "true") where.isPublished = true;
		if (published === "false") where.isPublished = false;

		// @ts-ignore prisma client will include this model after migration
		const items = await db.liveCodingChallenge.findMany({
			where,
			orderBy: { createdAt: "desc" }
		});

		return NextResponse.json({ items });
	} catch (error: any) {
		console.error("[LIVE_LIST]", error);
		return NextResponse.json({ error: "Failed to list live coding challenges" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			title,
			description,
			difficulty,
			languages = [],
			starterCode = null,
			tests = null,
			tags = [],
			isPublished = false
		} = body || {};

		if (!title || typeof title !== "string") {
			return NextResponse.json({ error: "Title is required" }, { status: 400 });
		}
		if (!Array.isArray(languages) || languages.length === 0) {
			return NextResponse.json({ error: "At least one language is required" }, { status: 400 });
		}

		// @ts-ignore prisma client will include this model after migration
		const created = await db.liveCodingChallenge.create({
			data: {
				title,
				description,
				difficulty,
				languages,
				starterCode,
				tests,
				tags,
				isPublished
			}
		});

		return NextResponse.json({ item: created }, { status: 201 });
	} catch (error: any) {
		console.error("[LIVE_CREATE]", error);
		return NextResponse.json({ error: "Failed to create live coding challenge" }, { status: 500 });
	}
}

