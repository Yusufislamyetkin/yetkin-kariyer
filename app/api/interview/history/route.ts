import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attempts = await db.interviewAttempt.findMany({
      where: { 
        userId: session.user.id as string,
      },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 50,
    });

    // Filter out attempts with null interview (orphaned records)
    const validAttempts = attempts.filter((attempt: { interview: { id: string; title: string } | null }) => attempt.interview !== null);

    return NextResponse.json({ attempts: validAttempts });
  } catch (error) {
    console.error("[INTERVIEW_HISTORY_GET] Error:", error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("[INTERVIEW_HISTORY_GET] Error message:", error.message);
      console.error("[INTERVIEW_HISTORY_GET] Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("P1001")) {
        console.error("[INTERVIEW_HISTORY_GET] Database connection error detected");
      }
    }
    return NextResponse.json(
      { 
        error: "Geçmiş yüklenirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}

