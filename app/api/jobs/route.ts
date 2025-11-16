import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const jobType = searchParams.get("jobType");
    const experienceLevel = searchParams.get("experienceLevel");
    const salaryRange = searchParams.get("salaryRange");

    // Build filter conditions
    const whereConditions: any = {
      status: "published",
    };

    // Location filter
    if (location) {
      whereConditions.location = { contains: location, mode: "insensitive" };
    }

    // Build AND conditions for multiple filters
    const andConditions: any[] = [];

    // Category filter
    if (category) {
      andConditions.push({
        OR: [
          { title: { contains: category, mode: "insensitive" } },
          { description: { contains: category, mode: "insensitive" } },
        ],
      });
    }

    // Search filter
    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { employer: { name: { contains: search, mode: "insensitive" } } },
        ],
      });
    }

    // Job Type filter (search in title, description, or requirements)
    if (jobType) {
      andConditions.push({
        OR: [
          { title: { contains: jobType, mode: "insensitive" } },
          { description: { contains: jobType, mode: "insensitive" } },
        ],
      });
    }

    // Experience Level filter
    if (experienceLevel) {
      andConditions.push({
        OR: [
          { title: { contains: experienceLevel, mode: "insensitive" } },
          { description: { contains: experienceLevel, mode: "insensitive" } },
        ],
      });
    }

    // Salary Range filter
    if (salaryRange) {
      // Parse salary range (e.g., "10.000 - 20.000 TL")
      const salaryMatch = salaryRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
      if (salaryMatch) {
        // Since salary is stored as string, we'll search for numeric values in the string
        // This is a simplified approach - in production, you'd want to store salary as numeric
        whereConditions.salary = {
          contains: salaryMatch[1].split(".")[0], // Search for the minimum value
        };
      } else if (salaryRange.includes("+")) {
        // For "75.000+ TL" format
        const minValue = salaryRange.match(/(\d+\.?\d*)/)?.[1];
        if (minValue) {
          whereConditions.salary = {
            contains: minValue.split(".")[0],
          };
        }
      }
    }

    // Combine all AND conditions
    if (andConditions.length > 0) {
      whereConditions.AND = andConditions;
    }

    const jobs = await db.job.findMany({
      where: whereConditions,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "İlanlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

