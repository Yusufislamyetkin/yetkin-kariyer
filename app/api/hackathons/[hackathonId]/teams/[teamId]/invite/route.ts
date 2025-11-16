import { NextResponse } from "next/server";
import {
  HackathonTeamMemberStatus,
  HackathonTeamRole,
  FriendshipStatus,
} from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const inviteSchema = z.object({
  friendUserId: z.string().cuid(),
});

interface RouteContext {
  params: {
    hackathonId: string;
    teamId: string;
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
    const data = inviteSchema.parse(payload);

    if (data.friendUserId === userId) {
      return NextResponse.json(
        { error: "Kendinizi davet edemezsiniz." },
        { status: 400 }
      );
    }

    const team = await db.hackathonTeam.findFirst({
      where: {
        id: ctx.params.teamId,
        hackathonId: ctx.params.hackathonId,
      },
      include: {
        hackathon: {
          select: {
            maxTeamSize: true,
          },
        },
        members: {
          where: {
            status: {
              in: [HackathonTeamMemberStatus.active, HackathonTeamMemberStatus.invited],
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 });
    }

    const member = await db.hackathonTeamMember.findFirst({
      where: {
        teamId: team.id,
        userId,
        status: HackathonTeamMemberStatus.active,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Sadece takım üyeleri arkadaş davet edebilir." },
        { status: 403 }
      );
    }

    if (
      member.role !== HackathonTeamRole.leader &&
      member.role !== HackathonTeamRole.co_leader
    ) {
      return NextResponse.json(
        { error: "Sadece takım liderleri arkadaş davet edebilir." },
        { status: 403 }
      );
    }

    if (
      team.hackathon.maxTeamSize &&
      team.members.length >= team.hackathon.maxTeamSize
    ) {
      return NextResponse.json(
        { error: "Takım kontenjanı dolu." },
        { status: 409 }
      );
    }

    const friendship = await db.friendship.findFirst({
      where: {
        status: FriendshipStatus.accepted,
        OR: [
          {
            requesterId: userId,
            addresseeId: data.friendUserId,
          },
          {
            requesterId: data.friendUserId,
            addresseeId: userId,
          },
        ],
      },
    });

    if (!friendship) {
      return NextResponse.json(
        {
          error: "Bu kullanıcı ile arkadaş değilsiniz. Davet gönderemezsiniz.",
        },
        { status: 403 }
      );
    }

    const existingMember = await db.hackathonTeamMember.findFirst({
      where: {
        teamId: team.id,
        userId: data.friendUserId,
        status: {
          in: [HackathonTeamMemberStatus.active, HackathonTeamMemberStatus.invited],
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Bu kullanıcı zaten takımda veya davet edilmiş." },
        { status: 409 }
      );
    }

    const invitation = await db.hackathonTeamMember.create({
      data: {
        teamId: team.id,
        userId: data.friendUserId,
        role: HackathonTeamRole.member,
        status: HackathonTeamMemberStatus.invited,
        invitedById: userId,
      },
    });

    return NextResponse.json(
      { invitation, message: "Davet gönderildi." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inviting friend to team:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Davet gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

