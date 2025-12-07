import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { startKeepOnlineJob, stopKeepOnlineJob, stopJobsForUsers, getActiveJobs } from "@/lib/bot/keep-online-jobs";
import { z } from "zod";

const startJobSchema = z.object({
  userIds: z.array(z.string()).min(1).max(1000),
  durationHours: z.number().min(1).max(24),
});

const stopJobSchema = z.object({
  jobId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});

/**
 * POST: Start a keep-online job
 * GET: Get all active jobs
 * DELETE: Stop a keep-online job
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const data = startJobSchema.parse(body);

    // Validate that all users are bots
    const { db } = await import("@/lib/db");
    const users = await db.user.findMany({
      where: {
        id: { in: data.userIds },
        isBot: true,
      },
      select: {
        id: true,
      },
    });

    if (users.length !== data.userIds.length) {
      return NextResponse.json(
        { error: "Tüm seçilen kullanıcılar bot olmalıdır" },
        { status: 400 }
      );
    }

    const { jobId, endTime } = startKeepOnlineJob(data.userIds, data.durationHours);

    return NextResponse.json({
      success: true,
      jobId,
      message: `${data.userIds.length} bot ${data.durationHours} saat boyunca çevrimiçi tutulacak`,
      endTime: endTime.toISOString(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz istek: " + error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("[KEEP_ONLINE_START]", error);
    return NextResponse.json(
      { error: error.message || "Job başlatılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobs = getActiveJobs();

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (error: any) {
    console.error("[KEEP_ONLINE_GET]", error);
    return NextResponse.json(
      { error: error.message || "Job'lar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const data = stopJobSchema.parse(body);

    let stopped = 0;

    if (data.jobId) {
      // Stop specific job
      const success = stopKeepOnlineJob(data.jobId);
      if (success) {
        stopped = 1;
      }
    } else if (data.userIds && data.userIds.length > 0) {
      // Stop all jobs for specific users
      stopped = stopJobsForUsers(data.userIds);
    } else {
      return NextResponse.json(
        { error: "jobId veya userIds gerekli" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${stopped} job durduruldu`,
      stopped,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz istek: " + error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("[KEEP_ONLINE_STOP]", error);
    return NextResponse.json(
      { error: error.message || "Job durdurulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

