import { NextResponse } from "next/server";
import { HackathonTeamMemberStatus } from "@prisma/client";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeHackathonPhase } from "@/lib/hackathon/lifecycle";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const applications = await db.hackathonApplication.findMany({
      where: {
        userId,
      },
      include: {
        hackathon: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        team: {
          include: {
            members: {
              where: {
                userId,
                status: HackathonTeamMemberStatus.active,
              },
              select: {
                id: true,
                role: true,
                status: true,
              },
            },
            submission: {
              select: {
                id: true,
                status: true,
                submittedAt: true,
                title: true,
                summary: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    const applicationsWithLifecycle = applications.map((app: typeof applications[0]) => {
      const lifecycle = computeHackathonPhase(app.hackathon);
      const teamMember = app.team?.members?.[0];

      return {
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt.toISOString(),
        reviewedAt: app.reviewedAt?.toISOString() ?? null,
        hackathon: {
          id: app.hackathon.id,
          title: app.hackathon.title,
          description: app.hackathon.description,
          phase: app.hackathon.phase,
          lifecycle,
          applicationOpensAt: app.hackathon.applicationOpensAt.toISOString(),
          applicationClosesAt: app.hackathon.applicationClosesAt.toISOString(),
          submissionOpensAt: app.hackathon.submissionOpensAt.toISOString(),
          submissionClosesAt: app.hackathon.submissionClosesAt.toISOString(),
          judgingOpensAt: app.hackathon.judgingOpensAt?.toISOString() ?? null,
          judgingClosesAt: app.hackathon.judgingClosesAt?.toISOString() ?? null,
          organizer: app.hackathon.organizer,
          prizesSummary: app.hackathon.prizesSummary,
        },
        team: app.team
          ? {
              id: app.team.id,
              name: app.team.name,
              role: teamMember?.role ?? null,
            }
          : null,
        submission: app.team?.submission
          ? {
              id: app.team.submission.id,
              status: app.team.submission.status,
              submittedAt: app.team.submission.submittedAt.toISOString(),
              title: app.team.submission.title,
              summary: app.team.submission.summary,
            }
          : null,
      };
    });

    return NextResponse.json({
      applications: applicationsWithLifecycle,
    });
  } catch (error) {
    console.error("Error fetching user hackathon applications:", error);
    return NextResponse.json(
      { error: "Başvurular yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

