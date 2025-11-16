import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db.jobApplication.findMany({
      where: { userId: session.user.id as string },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
            employer: {
              select: {
                name: true,
              },
            },
          },
        },
        cv: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json(
      { error: "Başvurular yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

