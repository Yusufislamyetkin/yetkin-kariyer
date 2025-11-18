import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const q = searchParams.get("q") || undefined;
		const language = searchParams.get("language") || undefined;
		const tag = searchParams.get("tag") || undefined;
		const published = searchParams.get("published");

		const where: any = {};
		if (typeof q === "string" && q.trim()) {
			where.OR = [
				{ title: { contains: q, mode: "insensitive" } },
				{ fixDescription: { contains: q, mode: "insensitive" } }
			];
		}
		if (typeof language === "string" && language.trim()) {
			where.language = language;
		}
		if (typeof tag === "string" && tag.trim()) {
			where.tags = { has: tag };
		}
		if (published === "true") where.isPublished = true;
		if (published === "false") where.isPublished = false;

		// @ts-ignore
		const items = await db.bugFixChallenge.findMany({
			where,
			orderBy: { createdAt: "desc" }
		});

		return NextResponse.json({ items });
	} catch (error: any) {
		console.error("[BUGFIX_LIST]", error);
		return NextResponse.json({ error: "Failed to list bugfix challenges" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			title,
			buggyCode,
			fixDescription,
			language,
			tests = null,
			tags = [],
			isPublished = false
		} = body || {};

		if (!title || typeof title !== "string") {
			return NextResponse.json({ error: "Title is required" }, { status: 400 });
		}
		if (!buggyCode || typeof buggyCode !== "string") {
			return NextResponse.json({ error: "Buggy code is required" }, { status: 400 });
		}
		if (!language || typeof language !== "string") {
			return NextResponse.json({ error: "Language is required" }, { status: 400 });
		}

		// @ts-ignore
		const created = await db.bugFixChallenge.create({
			data: {
				title,
				buggyCode,
				fixDescription,
				language,
				tests,
				tags,
				isPublished
			}
		});

		return NextResponse.json({ item: created }, { status: 201 });
	} catch (error: any) {
		console.error("[BUGFIX_CREATE]", error);
		return NextResponse.json({ error: "Failed to create bugfix challenge" }, { status: 500 });
	}
}

