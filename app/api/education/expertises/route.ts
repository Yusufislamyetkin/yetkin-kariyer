import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMockExpertises } from "@/lib/mock/education";

export async function GET() {
  try {
    // Tüm benzersiz uzmanlıkları getir
    const courses = await db.course.findMany({
      where: {
        expertise: {
          not: null,
        },
      },
      select: {
        expertise: true,
      },
      distinct: ["expertise"],
    });

    const expertises = courses
      .map((c: { expertise: string | null }) => c.expertise)
      .filter((e: string | null): e is string => e !== null)
      .sort();

    return NextResponse.json({ expertises });
  } catch (error) {
    console.error("Error fetching expertises:", error);

    const fallbackExpertises = getMockExpertises();
    if (fallbackExpertises.length > 0) {
      return NextResponse.json({
        expertises: fallbackExpertises,
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: "Uzmanlıklar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

