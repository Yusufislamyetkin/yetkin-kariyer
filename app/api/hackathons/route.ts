import { NextResponse } from "next/server";
import { HackathonPhase, HackathonVisibility, Prisma } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeHackathonPhase, synchronizeHackathonPhase } from "@/lib/hackathon/lifecycle";
import type { UserRole } from "@/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const ORGANIZER_ROLES: UserRole[] = ["admin", "employer"];

const createHackathonSchema = z.object({
  quizId: z.string().cuid().optional(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir."),
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(2000).optional(),
  bannerUrl: z.string().url().optional(),
  visibility: z.nativeEnum(HackathonVisibility).default(HackathonVisibility.public),
  applicationOpensAt: z.coerce.date(),
  applicationClosesAt: z.coerce.date(),
  submissionOpensAt: z.coerce.date(),
  submissionClosesAt: z.coerce.date(),
  judgingOpensAt: z.coerce.date().optional(),
  judgingClosesAt: z.coerce.date().optional(),
  timezone: z.string().min(2).max(60).default("UTC"),
  maxParticipants: z.number().int().positive().optional(),
  minTeamSize: z.number().int().min(1).max(10).default(1),
  maxTeamSize: z.number().int().min(1).max(10).default(4),
  tags: z.array(z.string().min(1).max(40)).default([]),
  requirements: z
    .object({
      eligibility: z.array(z.string()).optional(),
      deliverables: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
    .passthrough()
    .optional(),
  prizesSummary: z.string().max(500).optional(),
});

const isValidPhase = (value: string | null): value is HackathonPhase => {
  if (!value) return false;
  return Object.values(HackathonPhase).includes(value as HackathonPhase);
};

const isValidVisibility = (value: string | null): value is HackathonVisibility => {
  if (!value) return false;
  return Object.values(HackathonVisibility).includes(value as HackathonVisibility);
};

const deriveWhereClause = (
  params: URLSearchParams
): Prisma.HackathonWhereInput => {
  const search = params.get("search");
  const visibility = params.get("visibility");
  const tag = params.get("tag");
  const includePast = params.get("includePast") === "true";

  const where: Prisma.HackathonWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  if (isValidVisibility(visibility)) {
    where.visibility = visibility;
  }

  if (tag) {
    where.tags = { has: tag.toLowerCase() };
  }

  if (!includePast) {
    const now = new Date();
    where.OR = [
      ...(where.OR ?? []),
      { archivedAt: null, submissionClosesAt: { gte: now } },
      { archivedAt: null, submissionOpensAt: { gte: now } },
    ];
  }

  return where;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10), 1),
      MAX_LIMIT
    );
    const phaseFilter = searchParams.get("phase");

    const where = deriveWhereClause(searchParams);

    const hackathons = await db.hackathon.findMany({
      where,
      take: limit,
      orderBy: { applicationOpensAt: "asc" },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
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

    const phaseSyncPromises: Promise<void>[] = [];

    const items = hackathons
      .map((hackathon: any) => {
        const lifecycle = computeHackathonPhase(hackathon as any);

        if (hackathon.phase !== lifecycle.derivedPhase) {
          phaseSyncPromises.push(
            synchronizeHackathonPhase(hackathon.id, hackathon.phase as any, lifecycle.derivedPhase as any)
          );
        }

        return {
          ...hackathon,
          lifecycle,
        };
      })
      .filter((item: { lifecycle: { derivedPhase: string } }) =>
        isValidPhase(phaseFilter) ? item.lifecycle.derivedPhase === phaseFilter : true
      );

    if (phaseSyncPromises.length > 0) {
      await Promise.allSettled(phaseSyncPromises);
    }

    return NextResponse.json({
      hackathons: items,
      count: items.length,
    });
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Hackathon listesi yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { role?: UserRole } | undefined;
    const userId = session?.user?.id as string | undefined;
    const userRole = sessionUser?.role ?? "candidate";

    if (!userId || !ORGANIZER_ROLES.includes(userRole)) {
      return NextResponse.json(
        {
          error: "Hackathon oluşturma yetkiniz bulunmuyor.",
        },
        { status: 403 }
      );
    }

    const payload = await request.json();
    const data = createHackathonSchema.parse(payload);

    if (data.applicationOpensAt >= data.applicationClosesAt) {
      return NextResponse.json(
        { error: "Başvuru bitiş tarihi başlangıç tarihinden sonra olmalıdır." },
        { status: 400 }
      );
    }

    if (data.applicationClosesAt > data.submissionOpensAt) {
      return NextResponse.json(
        { error: "Başvuru dönemi, proje teslim döneminden önce kapanmalıdır." },
        { status: 400 }
      );
    }

    if (data.submissionOpensAt >= data.submissionClosesAt) {
      return NextResponse.json(
        { error: "Teslim bitiş tarihi teslim başlangıç tarihinden sonra olmalıdır." },
        { status: 400 }
      );
    }

    if (data.minTeamSize > data.maxTeamSize) {
      return NextResponse.json(
        {
          error: "Minimum takım üyesi sayısı maksimumdan büyük olamaz.",
        },
        { status: 400 }
      );
    }

    const created = await db.hackathon.create({
      data: {
        quizId: data.quizId,
        slug: data.slug,
        title: data.title,
        description: data.description,
        bannerUrl: data.bannerUrl,
        visibility: data.visibility,
        applicationOpensAt: data.applicationOpensAt,
        applicationClosesAt: data.applicationClosesAt,
        submissionOpensAt: data.submissionOpensAt,
        submissionClosesAt: data.submissionClosesAt,
        judgingOpensAt: data.judgingOpensAt,
        judgingClosesAt: data.judgingClosesAt,
        timezone: data.timezone,
        maxParticipants: data.maxParticipants,
        minTeamSize: data.minTeamSize,
        maxTeamSize: data.maxTeamSize,
        tags: data.tags.map((tag) => tag.toLowerCase()),
        requirements: data.requirements ? (data.requirements as Prisma.InputJsonValue) : undefined,
        prizesSummary: data.prizesSummary,
        organizerId: userId,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    const lifecycle = computeHackathonPhase(created);

    if (created.phase !== lifecycle.derivedPhase) {
      await db.hackathon.update({
        where: { id: created.id },
        data: { phase: lifecycle.derivedPhase },
      });
    }

    return NextResponse.json(
      {
        hackathon: {
          ...created,
          lifecycle,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hackathon:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }

    if ((error as any)?.code === "P2002") {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor. Lütfen farklı bir slug deneyin." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Hackathon oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}

