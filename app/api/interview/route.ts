import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");

    const interviews = await db.interview.findMany({
      where: {
        ...(type && { type }),
        ...(difficulty && { difficulty }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    return NextResponse.json(
      { error: "Mülakatlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

