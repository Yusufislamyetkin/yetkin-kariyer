import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    const applications = await db.jobApplication.findMany({
      where: {
        job: {
          employerId: session.user.id as string,
          ...(jobId && { id: jobId }),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        cv: {
          select: {
            id: true,
            data: true,
          },
        },
      },
      orderBy: [
        { score: "desc" },
        { appliedAt: "desc" },
      ],
    });

    return NextResponse.json({ candidates: applications });
  } catch (error) {
    return NextResponse.json(
      { error: "Adaylar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

