import { NextResponse } from "next/server";
import { HackathonTeamMemberStatus } from "@prisma/client";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteContext {
  params: {
    hackathonId: string;
  };
}

export async function GET(request: Request, ctx: RouteContext) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    // Check if hackathon exists
    const hackathon = await db.hackathon.findUnique({
      where: { id: ctx.params.hackathonId },
      select: { id: true },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon bulunamadı." }, { status: 404 });
    }

    // Get all applications for this hackathon
    const applications = await db.hackathonApplication.findMany({
      where: {
        hackathonId: ctx.params.hackathonId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        team: {
          include: {
            members: {
              where: {
                status: HackathonTeamMemberStatus.active,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
              },
              orderBy: {
                joinedAt: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    // Separate solo and team applications
    const soloApplications = applications
      .filter((app: typeof applications[0]) => !app.teamId)
      .map((app: typeof applications[0]) => ({
        id: app.id,
        user: {
          id: app.user.id,
          name: app.user.name,
          profileImage: app.user.profileImage,
        },
        appliedAt: app.appliedAt.toISOString(),
      }));

    // Group team applications by team (to avoid duplicates)
    const teamMap = new Map<
      string,
      {
        id: string;
        name: string;
        members: Array<{
          id: string;
          name: string | null;
          profileImage: string | null;
        }>;
        appliedAt: string;
      }
    >();

    applications
      .filter((app: typeof applications[0]) => app.teamId && app.team)
      .forEach((app: typeof applications[0]) => {
        if (!app.team) return;

        const teamId = app.team.id;
        if (!teamMap.has(teamId)) {
          teamMap.set(teamId, {
            id: teamId,
            name: app.team.name,
            members: app.team.members.map((member: typeof app.team.members[0]) => ({
              id: member.user.id,
              name: member.user.name,
              profileImage: member.user.profileImage,
            })),
            appliedAt: app.appliedAt.toISOString(),
          });
        } else {
          // Update with earliest application date
          const existing = teamMap.get(teamId);
          if (existing && new Date(app.appliedAt) < new Date(existing.appliedAt)) {
            existing.appliedAt = app.appliedAt.toISOString();
          }
        }
      });

    const teamApplications = Array.from(teamMap.values());

    return NextResponse.json({
      solo: soloApplications,
      teams: teamApplications,
    });
  } catch (error) {
    console.error("Error fetching hackathon applicants:", error);
    return NextResponse.json(
      { error: "Başvuranlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

