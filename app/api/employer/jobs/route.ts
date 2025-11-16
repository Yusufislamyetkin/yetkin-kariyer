import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await db.job.findMany({
      where: { employerId: session.user.id as string },
      include: {
        applications: {
          select: {
            id: true,
            status: true,
            score: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json(
      { error: "İlanlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, requirements, location, salary } = body;

    const job = await db.job.create({
      data: {
        employerId: session.user.id as string,
        title,
        description,
        requirements: requirements as any,
        location: location || null,
        salary: salary || null,
        status: "draft",
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "İlan oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

