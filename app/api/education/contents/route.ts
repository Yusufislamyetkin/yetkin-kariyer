import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMockContents } from "@/lib/mock/education";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expertise = searchParams.get("expertise");
  const topic = searchParams.get("topic");

  if (!expertise || !topic) {
    return NextResponse.json(
      { error: "Uzmanlık ve konu parametreleri gerekli" },
      { status: 400 }
    );
  }

  try {
    // Belirli uzmanlık ve konuya göre benzersiz konu içeriklerini getir
    const courses = await db.course.findMany({
      where: {
        expertise,
        topic,
        topicContent: {
          not: null,
        },
      },
      select: {
        topicContent: true,
      },
      distinct: ["topicContent"],
    });

    const contents = courses
      .map((c: { topicContent: string | null }) => c.topicContent)
      .filter((c: string | null): c is string => c !== null)
      .sort();

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Error fetching contents:", error);

    const fallbackContents = getMockContents(expertise, topic);
    if (fallbackContents.length > 0) {
      return NextResponse.json({
        contents: fallbackContents,
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: "Konu içerikleri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

