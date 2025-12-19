import { NextResponse } from "next/server";
import {
  HackathonApplicationStatus,
  HackathonTeamMemberStatus,
  HackathonTeamRole,
} from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeHackathonPhase } from "@/lib/hackathon/lifecycle";
import { buildTeamSlug, generateTeamInviteCode } from "@/lib/hackathon/team";

const applicationSchema = z
  .object({
    motivation: z.string().max(1000).optional(),
    skills: z.array(z.string().min(1).max(50)).optional(),
    githubProfile: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
    responses: z.record(z.any()).optional(),
    team: z
      .object({
        mode: z.enum(["solo", "create", "join"]),
        name: z.string().min(3).max(80).optional(),
        inviteCode: z.string().min(6).max(16).optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.team?.mode === "create" && !data.team.name) {
      ctx.addIssue({
        path: ["team", "name"],
        code: "custom",
        message: "Takım adı zorunludur.",
      });
    }

    if (data.team?.mode === "join" && !data.team.inviteCode) {
      ctx.addIssue({
        path: ["team", "inviteCode"],
        code: "custom",
        message: "Katılmak için davet kodu gerekli.",
      });
    }
  });

interface RouteContext {
  params: {
    hackathonId: string;
  };
}

const normalizeSkill = (value: string) => value.trim().toLowerCase();

export async function GET(request: Request, ctx: RouteContext) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const application = await db.hackathonApplication.findUnique({
      where: {
        hackathonId_userId: {
          hackathonId: ctx.params.hackathonId,
          userId,
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            inviteCode: true,
          },
        },
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching hackathon application:", error);
    return NextResponse.json(
      { error: "Başvuru bilgileri alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, ctx: RouteContext) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    // Abonelik kontrolü - başvuru gönderme işlemi için abonelik gerekli
    const { checkUserSubscription } = await import("@/lib/services/subscription-service");
    const subscription = await checkUserSubscription(userId);
    if (!subscription || !subscription.isActive) {
      return NextResponse.json(
        {
          error: "Abone değilsiniz. Lütfen bir abonelik planı seçin.",
          redirectTo: "/fiyatlandirma",
          requiresSubscription: true,
        },
        { status: 403 }
      );
    }

    const payload = await request.json();
    const data = applicationSchema.parse(payload);

    const hackathon = await db.hackathon.findUnique({
      where: { id: ctx.params.hackathonId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon bulunamadı." }, { status: 404 });
    }

    const lifecycle = computeHackathonPhase(hackathon);

    if (!lifecycle.isApplicationWindowOpen) {
      return NextResponse.json(
        { error: "Başvuru dönemi açık değil." },
        { status: 400 }
      );
    }

    if (
      hackathon.maxParticipants &&
      hackathon._count.applications >= hackathon.maxParticipants
    ) {
      return NextResponse.json(
        { error: "Kontenjan dolduğu için başvuru alınamamaktadır." },
        { status: 409 }
      );
    }

    const existingApplication = await db.hackathonApplication.findUnique({
      where: {
        hackathonId_userId: {
          hackathonId: hackathon.id,
          userId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Bu hackathona zaten başvurdunuz." },
        { status: 409 }
      );
    }

    const existingMembership = await db.hackathonTeamMember.findFirst({
      where: {
        userId,
        team: {
          hackathonId: hackathon.id,
        },
        status: {
          in: [HackathonTeamMemberStatus.active, HackathonTeamMemberStatus.invited],
        },
      },
      select: {
        teamId: true,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Bu hackathonda aktif bir takım üyeliğiniz bulunuyor." },
        { status: 409 }
      );
    }

    const minTeamSize = hackathon.minTeamSize ?? 1;
    const requiresTeam = minTeamSize > 1;
    const teamMode = data.team?.mode ?? (requiresTeam ? "create" : "solo");

    if (requiresTeam && teamMode === "solo") {
      return NextResponse.json(
        { error: "Bu hackathona katılmak için takım oluşturmanız veya bir takıma katılmanız gerekir." },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx: any) => {
      let teamId: string | null = null;

      if (teamMode === "create") {
        const slug = buildTeamSlug(data.team!.name!);
        let inviteCode = generateTeamInviteCode();

        // Ensure invite code uniqueness
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const existingCode = await tx.hackathonTeam.findUnique({
            where: { inviteCode },
            select: { id: true },
          });
          if (!existingCode) break;
          inviteCode = generateTeamInviteCode();
        }

        const team = await tx.hackathonTeam.create({
          data: {
            hackathonId: hackathon.id,
            name: data.team!.name!,
            slug,
            inviteCode,
            creatorId: userId,
          },
        });

        await tx.hackathonTeamMember.create({
          data: {
            teamId: team.id,
            userId,
            role: HackathonTeamRole.leader,
            status: HackathonTeamMemberStatus.active,
          },
        });

        teamId = team.id;
      } else if (teamMode === "join") {
        const inviteCode = data.team!.inviteCode!.toUpperCase();
        const team = await tx.hackathonTeam.findFirst({
          where: {
            inviteCode,
            hackathonId: hackathon.id,
          },
          include: {
            members: {
              where: { status: HackathonTeamMemberStatus.active },
              select: { id: true },
            },
          },
        });

        if (!team) {
          const err = new Error("TEAM_NOT_FOUND");
          (err as any).code = "TEAM_NOT_FOUND";
          throw err;
        }

        if (team.lockedAt) {
          const err = new Error("TEAM_LOCKED");
          (err as any).code = "TEAM_LOCKED";
          throw err;
        }

        if (
          hackathon.maxTeamSize &&
          team.members.length >= hackathon.maxTeamSize
        ) {
          const err = new Error("TEAM_FULL");
          (err as any).code = "TEAM_FULL";
          throw err;
        }

        await tx.hackathonTeamMember.create({
          data: {
            teamId: team.id,
            userId,
            role: HackathonTeamRole.member,
            status: HackathonTeamMemberStatus.active,
          },
        });

        teamId = team.id;
      }

      const application = await tx.hackathonApplication.create({
        data: {
          hackathonId: hackathon.id,
          userId,
          teamId,
          status: HackathonApplicationStatus.auto_accepted,
          motivation: data.motivation,
          skills: (data.skills ?? []).map(normalizeSkill),
          githubProfile: data.githubProfile,
          portfolioUrl: data.portfolioUrl,
          responses: data.responses ?? {},
        },
      });

      return application;
    });

    return NextResponse.json(
      {
        application: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting hackathon application:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }

    if (error?.code === "TEAM_NOT_FOUND") {
      return NextResponse.json(
        { error: "Geçersiz davet kodu." },
        { status: 404 }
      );
    }

    if (error?.code === "TEAM_LOCKED") {
      return NextResponse.json(
        { error: "Bu takım kilitlenmiş. Yeni üyeler kabul edilmiyor." },
        { status: 409 }
      );
    }

    if (error?.code === "TEAM_FULL") {
      return NextResponse.json(
        { error: "Takım kontenjanı dolu." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Başvurunuz kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

