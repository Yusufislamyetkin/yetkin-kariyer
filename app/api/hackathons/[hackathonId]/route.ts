import { NextResponse } from "next/server";
import { HackathonPhase, HackathonTeamMemberStatus } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeHackathonPhase, synchronizeHackathonPhase } from "@/lib/hackathon/lifecycle";
import type { UserRole } from "@/types";

interface RouteContext {
  params: {
    hackathonId: string;
  };
}

const organizerRoles: UserRole[] = ["admin", "employer"];

const updateSchema = z
  .object({
    title: z.string().min(5).max(150).optional(),
    description: z.string().min(10).max(2000).nullable().optional(),
    bannerUrl: z.string().url().nullable().optional(),
    applicationOpensAt: z.coerce.date().optional(),
    applicationClosesAt: z.coerce.date().optional(),
    submissionOpensAt: z.coerce.date().optional(),
    submissionClosesAt: z.coerce.date().optional(),
    judgingOpensAt: z.coerce.date().nullable().optional(),
    judgingClosesAt: z.coerce.date().nullable().optional(),
    timezone: z.string().min(2).max(60).optional(),
    maxParticipants: z.number().int().positive().nullable().optional(),
    minTeamSize: z.number().int().min(1).max(10).optional(),
    maxTeamSize: z.number().int().min(1).max(10).optional(),
    tags: z.array(z.string().min(1).max(40)).optional(),
    prizesSummary: z.string().max(500).nullable().optional(),
    archived: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.minTeamSize !== undefined &&
        data.maxTeamSize !== undefined &&
        data.minTeamSize > data.maxTeamSize
      ) {
        return false;
      }
      return true;
    },
    {
      path: ["minTeamSize"],
      message: "Minimum takım büyüklüğü maksimum değerden büyük olamaz.",
    }
  );

export async function GET(request: Request, ctx: RouteContext) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    const hackathon = await db.hackathon.findUnique({
      where: { id: ctx.params.hackathonId },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        teams: {
          orderBy: { createdAt: "asc" },
          include: {
            members: {
              orderBy: { joinedAt: "asc" },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
              },
            },
            submission: {
              include: {
                attempt: {
                  select: {
                    id: true,
                    metrics: true,
                    completedAt: true,
                  },
                },
              },
            },
          },
        },
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        submissions: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            attempt: {
              select: {
                id: true,
                metrics: true,
                completedAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            teams: true,
            submissions: true,
          },
        },
      },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon bulunamadı." }, { status: 404 });
    }

    const lifecycle = computeHackathonPhase(hackathon);

    if (hackathon.phase !== lifecycle.derivedPhase) {
      await synchronizeHackathonPhase(hackathon.id, hackathon.phase, lifecycle.derivedPhase);
    }

    const submissionWindowClosed =
      !!hackathon.submissionClosesAt && new Date(hackathon.submissionClosesAt) <= new Date();

    const teams = hackathon.teams.map((team: {
      id: string; name: string; slug: string; inviteCode: string | null;
      lockedAt: Date | null; createdAt: Date; updatedAt: Date;
      members: Array<{ id: string; userId: string; role: string; status: HackathonTeamMemberStatus; joinedAt: Date; invitedById: string | null; user: { id: string; name: string | null; profileImage: string | null } }>;
      submission: { id: string; status: string; repoUrl: string | null; branch: string | null; commitSha: string | null; submittedAt: Date | null; attempt: { id: string; metrics: any; completedAt: Date | null } | null } | null;
    }) => {
      const isViewerTeamMember = userId
        ? team.members.some(
            (member: { userId: string; status: HackathonTeamMemberStatus }) =>
              member.userId === userId && member.status === HackathonTeamMemberStatus.active
          )
        : false;

      return {
        id: team.id,
        name: team.name,
        slug: team.slug,
        inviteCode: team.inviteCode,
        lockedAt: team.lockedAt,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        members: team.members.map((member: { id: string; userId: string; role: string; status: HackathonTeamMemberStatus; joinedAt: Date; invitedById: string | null; user: { id: string; name: string | null; profileImage: string | null } }) => ({
          id: member.id,
          userId: member.userId,
          role: member.role,
          status: member.status,
          joinedAt: member.joinedAt,
          invitedById: member.invitedById,
          user: member.user,
        })),
        submission: team.submission
          ? {
              id: team.submission.id,
              status: team.submission.status,
              repoUrl:
                submissionWindowClosed || isViewerTeamMember ? team.submission.repoUrl : null,
              branch: team.submission.branch,
              commitSha: team.submission.commitSha,
              submittedAt: team.submission.submittedAt,
              attempt: team.submission.attempt,
            }
          : null,
      };
    });

    const soloSubmissions = hackathon.submissions
      .filter((submission: { teamId: string | null }) => submission.teamId === null)
      .map((submission: { id: string; status: string; repoUrl: string | null; branch: string | null; commitSha: string | null; submittedAt: Date | null; userId: string | null; user: any; attempt: any }) => ({
        id: submission.id,
        status: submission.status,
        repoUrl:
          submissionWindowClosed || submission.userId === userId ? submission.repoUrl : null,
        branch: submission.branch,
        commitSha: submission.commitSha,
        submittedAt: submission.submittedAt,
        user: submission.user,
        attempt: submission.attempt,
      }));

    const activeMembership = userId
      ? hackathon.teams
          .flatMap((team: { id: string; name: string; members: Array<{ id: string; status: HackathonTeamMemberStatus; userId: string; invitedById: string | null }> }) =>
            team.members.map((member: { id: string; status: HackathonTeamMemberStatus; userId: string; invitedById: string | null }) => ({
              team,
              member,
            }))
          )
          .find(
            ({ member }: { member: { userId: string; status: HackathonTeamMemberStatus } }) =>
              member.userId === userId && member.status === HackathonTeamMemberStatus.active
          )
      : null;

    const userApplication = userId
      ? hackathon.applications.find((application: { userId: string }) => application.userId === userId) ?? null
      : null;

    const approvedApplicationStatuses = new Set(["approved", "auto_accepted", "pending_review"]);
    const isUserApproved =
      !!userApplication && approvedApplicationStatuses.has(userApplication.status as string);

    const pendingInvitations = userId
      ? hackathon.teams
          .flatMap((team: { id: string; name: string; members: Array<{ id: string; status: HackathonTeamMemberStatus; userId: string; invitedById: string | null }> }) =>
            team.members
              .filter(
                (member: { status: HackathonTeamMemberStatus; userId: string }) =>
                  member.status === HackathonTeamMemberStatus.invited &&
                  member.userId === userId
              )
              .map((member: { id: string; invitedById: string | null }) => ({
                id: member.id,
                teamId: team.id,
                teamName: team.name,
                invitedById: member.invitedById,
              }))
          )
      : [];

    const userSubmission = userId
      ? hackathon.submissions.find(
          (submission: { userId: string | null; teamId: string | null }) =>
            submission.userId === userId ||
            (activeMembership && submission.teamId === activeMembership.team.id)
        ) ?? null
      : null;

    const responsePayload = {
      hackathon: {
        id: hackathon.id,
        slug: hackathon.slug,
        quizId: hackathon.quizId,
        title: hackathon.title,
        description: hackathon.description,
        bannerUrl: hackathon.bannerUrl,
        visibility: hackathon.visibility,
        phase: hackathon.phase,
        lifecycle,
        timezone: hackathon.timezone,
        applicationOpensAt: hackathon.applicationOpensAt,
        applicationClosesAt: hackathon.applicationClosesAt,
        submissionOpensAt: hackathon.submissionOpensAt,
        submissionClosesAt: hackathon.submissionClosesAt,
        judgingOpensAt: hackathon.judgingOpensAt,
        judgingClosesAt: hackathon.judgingClosesAt,
        maxParticipants: hackathon.maxParticipants,
        minTeamSize: hackathon.minTeamSize,
        maxTeamSize: hackathon.maxTeamSize,
        tags: hackathon.tags,
        requirements: hackathon.requirements,
        prizesSummary: hackathon.prizesSummary,
        organizer: hackathon.organizer,
        counts: hackathon._count,
        archivedAt: hackathon.archivedAt,
        createdAt: hackathon.createdAt,
        updatedAt: hackathon.updatedAt,
      },
      teams,
      soloSubmissions,
      userContext: {
        application: userApplication
          ? {
              id: userApplication.id,
              status: userApplication.status,
              teamId: userApplication.teamId,
              appliedAt: userApplication.appliedAt,
              reviewedAt: userApplication.reviewedAt,
            }
          : null,
        team: activeMembership
          ? {
              id: activeMembership.team.id,
              name: activeMembership.team.name,
              role: activeMembership.member.role,
              status: activeMembership.member.status,
            }
          : null,
        submission: userSubmission
          ? {
              id: userSubmission.id,
              status: userSubmission.status,
              submittedAt: userSubmission.submittedAt,
            }
          : null,
        permissions: {
          canApply:
            lifecycle.derivedPhase === HackathonPhase.applications &&
            !userApplication &&
            (!hackathon.maxParticipants ||
              hackathon._count.applications < hackathon.maxParticipants),
          canSubmit: (() => {
            if (!lifecycle.isSubmissionWindowOpen) {
              return false;
            }

            if (!isUserApproved) {
              return false;
            }

            const minTeamSize = hackathon.minTeamSize ?? 1;
            if (minTeamSize > 1) {
              return !!activeMembership;
            }

            return true;
          })(),
        },
        pendingInvitations,
      },
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error fetching hackathon detail:", error);
    return NextResponse.json(
      { error: "Hackathon detayları yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, ctx: RouteContext) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;
    const sessionUser = session?.user as { role?: UserRole } | undefined;
    const userRole = sessionUser?.role ?? "candidate";

    if (!userId || !organizerRoles.includes(userRole)) {
      return NextResponse.json(
        { error: "Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor." },
        { status: 403 }
      );
    }

    const existing = await db.hackathon.findUnique({
      where: { id: ctx.params.hackathonId },
      select: {
        organizerId: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Hackathon bulunamadı." }, { status: 404 });
    }

    if (existing.organizerId !== userId && userRole !== "admin") {
      return NextResponse.json(
        { error: "Sadece organize ettiğiniz hackathonları güncelleyebilirsiniz." },
        { status: 403 }
      );
    }

    const requestBody = await request.json();
    const data = updateSchema.parse(requestBody);

    if (
      data.applicationOpensAt &&
      data.applicationClosesAt &&
      data.applicationOpensAt >= data.applicationClosesAt
    ) {
      return NextResponse.json(
        { error: "Başvuru bitiş tarihi başlangıç tarihinden sonra olmalıdır." },
        { status: 400 }
      );
    }

    if (
      data.applicationClosesAt &&
      data.submissionOpensAt &&
      data.applicationClosesAt > data.submissionOpensAt
    ) {
      return NextResponse.json(
        { error: "Başvuru dönemi, proje teslim dönemi başlamadan kapanmalıdır." },
        { status: 400 }
      );
    }

    if (
      data.submissionOpensAt &&
      data.submissionClosesAt &&
      data.submissionOpensAt >= data.submissionClosesAt
    ) {
      return NextResponse.json(
        { error: "Teslim bitiş tarihi teslim başlangıç tarihinden sonra olmalıdır." },
        { status: 400 }
      );
    }

    const result = await db.hackathon.update({
      where: { id: ctx.params.hackathonId },
      data: {
        title: data.title ?? undefined,
        description: data.description === undefined ? undefined : data.description,
        bannerUrl: data.bannerUrl === undefined ? undefined : data.bannerUrl,
        applicationOpensAt: data.applicationOpensAt ?? undefined,
        applicationClosesAt: data.applicationClosesAt ?? undefined,
        submissionOpensAt: data.submissionOpensAt ?? undefined,
        submissionClosesAt: data.submissionClosesAt ?? undefined,
        judgingOpensAt: data.judgingOpensAt ?? undefined,
        judgingClosesAt: data.judgingClosesAt ?? undefined,
        timezone: data.timezone ?? undefined,
        maxParticipants:
          data.maxParticipants === undefined ? undefined : data.maxParticipants,
        minTeamSize: data.minTeamSize ?? undefined,
        maxTeamSize: data.maxTeamSize ?? undefined,
        tags: data.tags ? data.tags.map((tag) => tag.toLowerCase()) : undefined,
        prizesSummary: data.prizesSummary === undefined ? undefined : data.prizesSummary,
        archivedAt:
          data.archived === undefined ? undefined : data.archived ? new Date() : null,
      },
    });

    const lifecycle = computeHackathonPhase(result);

    if (result.phase !== lifecycle.derivedPhase) {
      await db.hackathon.update({
        where: { id: result.id },
        data: {
          phase: lifecycle.derivedPhase,
        },
      });
    }

    return NextResponse.json({
      hackathon: {
        ...result,
        lifecycle,
      },
    });
  } catch (error) {
    console.error("Error updating hackathon:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Hackathon güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

