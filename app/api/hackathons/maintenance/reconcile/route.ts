import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeHackathonPhase, synchronizeHackathonPhase } from "@/lib/hackathon/lifecycle";
import type { UserRole } from "@/types";

export async function POST() {
  try {
    const session = await auth();
    const sessionUser = session?.user as { role?: UserRole } | undefined;
    const userId = session?.user?.id as string | undefined;
    const userRole = sessionUser?.role ?? "candidate";

    if (!userId || userRole !== "admin") {
      return NextResponse.json(
        { error: "Bu işlemi sadece yöneticiler başlatabilir." },
        { status: 403 }
      );
    }

    const hackathons = await db.hackathon.findMany({
      select: {
        id: true,
        phase: true,
        applicationOpensAt: true,
        applicationClosesAt: true,
        submissionOpensAt: true,
        submissionClosesAt: true,
        judgingOpensAt: true,
        judgingClosesAt: true,
        archivedAt: true,
      },
    });

    let updatedCount = 0;
    await Promise.all(
      hackathons.map(async (hackathon) => {
        const lifecycle = computeHackathonPhase(hackathon);
        if (hackathon.phase !== lifecycle.derivedPhase) {
          await synchronizeHackathonPhase(hackathon.id, hackathon.phase, lifecycle.derivedPhase);
          updatedCount += 1;
        }
      })
    );

    return NextResponse.json({
      total: hackathons.length,
      updated: updatedCount,
      message: "Hackathon fazları senkronize edildi.",
    });
  } catch (error) {
    console.error("Error reconciling hackathon phases:", error);
    return NextResponse.json(
      { error: "Hackathon fazları güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

