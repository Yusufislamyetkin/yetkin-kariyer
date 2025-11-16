import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMockTopics } from "@/lib/mock/education";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expertise = searchParams.get("expertise");

  if (!expertise) {
    return NextResponse.json(
      { error: "Uzmanlık parametresi gerekli" },
      { status: 400 }
    );
  }

  try {
    // Belirli uzmanlığa göre benzersiz konuları getir
    const courses = await db.course.findMany({
      where: {
        expertise,
        topic: {
          not: null,
        },
      },
      select: {
        topic: true,
      },
      distinct: ["topic"],
    });

    const topics = courses
      .map((c) => c.topic)
      .filter((t): t is string => t !== null)
      .sort();

    return NextResponse.json({ topics });
  } catch (error) {
    console.error("Error fetching topics:", error);

    const fallbackTopics = getMockTopics(expertise);
    if (fallbackTopics.length > 0) {
      return NextResponse.json({
        topics: fallbackTopics,
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: "Konular yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

