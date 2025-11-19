import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, cvId } = body;

    // Check if already applied
    const existing = await db.jobApplication.findFirst({
      where: {
        jobId,
        userId: session.user.id as string,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu ilana zaten başvurdunuz" },
        { status: 400 }
      );
    }

    const application = await db.jobApplication.create({
      data: {
        jobId,
        userId: session.user.id as string,
        cvId,
        status: "pending",
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
        cv: {
          select: {
            id: true,
          },
        },
      },
    });

    // Emit gamification event
    try {
      const event = await recordEvent({
        userId: session.user.id as string,
        type: "job_application",
        payload: { jobId },
      });
      await applyRules({ userId: session.user.id as string, type: "job_application", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn("Gamification job_application failed:", e);
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { error: "Başvuru yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

