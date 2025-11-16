import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyzeJobMatch } from "@/lib/ai/job";
import { isAIEnabled } from "@/lib/ai/client";

const JobMatchRequestSchema = z.object({
  jobId: z.string().min(1),
  cvId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAIEnabled()) {
      return NextResponse.json(
        { error: "AI servisi şu anda mevcut değil" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { jobId, cvId } = JobMatchRequestSchema.parse(body);

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "İş ilanı bulunamadı" },
        { status: 404 }
      );
    }

    const cv = await db.cV.findUnique({
      where: { id: cvId },
      select: {
        id: true,
        data: true,
        userId: true,
      },
    });

    if (!cv || cv.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { error: "CV bulunamadı veya erişiminiz yok" },
        { status: 404 }
      );
    }

    const analysis = await analyzeJobMatch({
      cvData: cv.data,
      jobTitle: job.title,
      jobDescription: job.description,
      jobRequirements: job.requirements,
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error generating job match:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz istek verisi", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "AI iş uyumu analizi gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}


