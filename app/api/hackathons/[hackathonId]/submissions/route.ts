import { NextResponse } from "next/server";
import { HackathonSubmissionStatus, HackathonTeamMemberStatus } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeHackathonPhase } from "@/lib/hackathon/lifecycle";

const submissionSchema = z.object({
  repoUrl: z.string().url(),
  branch: z.string().min(1).max(60).default("main"),
  commitSha: z.string().min(6).max(64).optional(),
  title: z.string().min(3).max(120).optional(),
  summary: z.string().max(1200).optional(),
  presentationUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

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

    const activeMemberships = await db.hackathonTeamMember.findMany({
      where: {
        userId,
        status: HackathonTeamMemberStatus.active,
        team: {
          hackathonId: ctx.params.hackathonId,
        },
      },
      select: {
        teamId: true,
      },
    });

    const teamIds = activeMemberships.map((membership: { teamId: string }) => membership.teamId);

    const submission = await db.hackathonSubmission.findFirst({
      where: {
        hackathonId: ctx.params.hackathonId,
        OR: [
          { userId },
          ...(teamIds.length > 0 ? [{ teamId: { in: teamIds } }] : []),
        ],
      },
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
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error fetching hackathon submission:", error);
    return NextResponse.json(
      { error: "Projeni getirirken bir hata oluştu." },
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

    const payload = await request.json();
    const data = submissionSchema.parse(payload);

    const hackathon = await db.hackathon.findUnique({
      where: { id: ctx.params.hackathonId },
      include: {
        applications: {
          where: {
            userId,
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon bulunamadı." }, { status: 404 });
    }

    const lifecycle = computeHackathonPhase(hackathon);

    if (!lifecycle.isSubmissionWindowOpen) {
      return NextResponse.json(
        { error: "Proje gönderimi şu an açık değil." },
        { status: 400 }
      );
    }

    if (!hackathon.quizId) {
      console.error("Hackathon is missing quizId; cannot create attempt.");
      return NextResponse.json(
        {
          error:
            "Hackathon yapılandırması eksik (quiz eşlemesi bulunamadı). Lütfen organizatör ile iletişime geçin.",
        },
        { status: 500 }
      );
    }

    const approvedStatuses = ["approved", "auto_accepted", "pending_review"];
    const userApplication = hackathon.applications[0] ?? null;

    if (!userApplication) {
      return NextResponse.json(
        { error: "Önce hackathona başvurmanız gerekiyor." },
        { status: 400 }
      );
    }

    if (!approvedStatuses.includes(userApplication.status)) {
      return NextResponse.json(
        { error: "Başvurunuz onaylanmadan proje gönderemezsiniz." },
        { status: 403 }
      );
    }

    const activeMemberships = await db.hackathonTeamMember.findMany({
      where: {
        userId,
        team: {
          hackathonId: hackathon.id,
        },
        status: HackathonTeamMemberStatus.active,
      },
      include: {
        team: {
          include: {
            members: {
              where: { status: HackathonTeamMemberStatus.active },
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    const minTeamSize = hackathon.minTeamSize ?? 1;
    const isTeamHackathon = minTeamSize > 1;

    if (isTeamHackathon && activeMemberships.length === 0) {
      return NextResponse.json(
        {
          error:
            "Takım hackathonlarında proje göndermek için aktif bir takım üyesi olmanız gerekir.",
        },
        { status: 400 }
      );
    }

    const membership = activeMemberships[0] ?? null;
    const teamId = membership?.teamId ?? null;

    const activeMemberIds = membership
      ? membership.team.members.map((member: { userId: string }) => member.userId)
      : [userId];

    const existingSubmission = await db.hackathonSubmission.findFirst({
      where: {
        hackathonId: hackathon.id,
        OR: [
          ...(teamId
            ? [
                {
                  teamId,
                },
              ]
            : []),
          { userId },
        ],
      },
    });

    const result = await db.$transaction(async (tx: any) => {
      let submission;

      if (existingSubmission) {
        submission = await tx.hackathonSubmission.update({
          where: {
            id: existingSubmission.id,
          },
          data: {
            repoUrl: data.repoUrl,
            branch: data.branch,
            commitSha: data.commitSha ?? null,
            title: data.title ?? null,
            summary: data.summary ?? null,
            presentationUrl: data.presentationUrl ?? null,
            demoUrl: data.demoUrl ?? null,
            metadata: data.metadata ?? {},
            status: HackathonSubmissionStatus.under_review,
          },
        });
      } else {
        submission = await tx.hackathonSubmission.create({
          data: {
            hackathonId: hackathon.id,
            teamId,
            userId: teamId ? null : userId,
            repoUrl: data.repoUrl,
            branch: data.branch,
            commitSha: data.commitSha ?? null,
            title: data.title ?? null,
            summary: data.summary ?? null,
            presentationUrl: data.presentationUrl ?? null,
            demoUrl: data.demoUrl ?? null,
            metadata: data.metadata ?? {},
            status: HackathonSubmissionStatus.pending,
          },
        });
      }

      let submitterAttemptId: string | null = null;

      for (const memberId of activeMemberIds) {
        const existingAttempt = await tx.hackatonAttempt.findFirst({
          where: {
            hackathonId: hackathon.id,
            userId: memberId,
          },
        });

        const baseMetrics = {
          projectScore: 0,
          featuresCompleted: 0,
          codeQuality: 0,
        };

        const quizId = hackathon.quizId ?? existingAttempt?.quizId;

        const updatedAttempt = existingAttempt
          ? await tx.hackatonAttempt.update({
              where: { id: existingAttempt.id },
              data: {
                projectUrl: data.repoUrl,
                metrics: existingAttempt.metrics ?? baseMetrics,
                hackathonId: hackathon.id,
                ...(hackathon.quizId ? { quizId: hackathon.quizId } : {}),
              },
            })
          : quizId
            ? await tx.hackatonAttempt.create({
                data: {
                  userId: memberId,
                  hackathonId: hackathon.id,
                  projectUrl: data.repoUrl,
                  metrics: baseMetrics,
                  quizId,
                },
              })
            : null;

        if (!updatedAttempt) {
          continue;
        }

        if (memberId === userId) {
          submitterAttemptId = updatedAttempt.id;
        }
      }

      if (submitterAttemptId && submission.attemptId !== submitterAttemptId) {
        submission = await tx.hackathonSubmission.update({
          where: { id: submission.id },
          data: {
            attemptId: submitterAttemptId,
          },
        });
      }

      return submission;
    });

    return NextResponse.json(
      {
        submission: result,
      },
      { status: existingSubmission ? 200 : 201 }
    );
  } catch (error: any) {
    console.error("Error submitting hackathon project:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Projeyi kaydederken bir hata oluştu." },
      { status: 500 }
    );
  }
}

