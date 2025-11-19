import { NextResponse } from "next/server";
import {
  HackathonApplicationStatus,
  HackathonTeamMemberStatus,
  HackathonTeamRole,
} from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const inviteResponseSchema = z.object({
  inviteId: z.string().cuid(),
  action: z.enum(["accept", "decline"]),
});

interface RouteContext {
  params: {
    hackathonId: string;
  };
}

export async function POST(request: Request, ctx: RouteContext) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const payload = await request.json();
    const data = inviteResponseSchema.parse(payload);

    const invitation = await db.hackathonTeamMember.findUnique({
      where: { id: data.inviteId },
      include: {
        team: {
          include: {
            hackathon: {
              select: {
                id: true,
                maxTeamSize: true,
              },
            },
            members: {
              where: {
                status: HackathonTeamMemberStatus.active,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Davet bulunamadı." }, { status: 404 });
    }

    if (invitation.userId !== userId) {
      return NextResponse.json(
        { error: "Bu davete yanıt verme yetkiniz yok." },
        { status: 403 }
      );
    }

    if (invitation.team.hackathon.id !== ctx.params.hackathonId) {
      return NextResponse.json(
        { error: "Davet bu hackathona ait değil." },
        { status: 400 }
      );
    }

    if (invitation.status !== HackathonTeamMemberStatus.invited) {
      return NextResponse.json(
        { error: "Bu davet zaten yanıtlanmış." },
        { status: 400 }
      );
    }

    if (data.action === "decline") {
      const updated = await db.hackathonTeamMember.update({
        where: { id: invitation.id },
        data: {
          status: HackathonTeamMemberStatus.removed,
        },
      });

      return NextResponse.json({ invitation: updated });
    }

    if (
      invitation.team.hackathon.maxTeamSize &&
      invitation.team.members.length >= invitation.team.hackathon.maxTeamSize
    ) {
      return NextResponse.json(
        { error: "Takım kontenjanı dolu." },
        { status: 409 }
      );
    }

    const updated = await db.$transaction(async (tx: any) => {
      const activeMember = await tx.hackathonTeamMember.update({
        where: { id: invitation.id },
        data: {
          status: HackathonTeamMemberStatus.active,
          role: HackathonTeamRole.member,
          joinedAt: new Date(),
        },
      });

      const existingApplication = await tx.hackathonApplication.findUnique({
        where: {
          hackathonId_userId: {
            hackathonId: invitation.team.hackathon.id,
            userId,
          },
        },
      });

      if (existingApplication) {
        const nextStatus =
          existingApplication.status === HackathonApplicationStatus.approved
            ? existingApplication.status
            : HackathonApplicationStatus.auto_accepted;

        await tx.hackathonApplication.update({
          where: { id: existingApplication.id },
          data: {
            teamId: invitation.teamId,
            status: nextStatus,
          },
        });
      } else {
        await tx.hackathonApplication.create({
          data: {
            hackathonId: invitation.team.hackathon.id,
            userId,
            teamId: invitation.teamId,
            status: HackathonApplicationStatus.auto_accepted,
          },
        });
      }

      return activeMember;
    });

    return NextResponse.json({ invitation: updated });
  } catch (error) {
    console.error("Error responding to team invite:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Davet yanıtlanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

