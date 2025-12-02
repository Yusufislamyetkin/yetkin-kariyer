import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ensureDefaultChatGroups,
  DEFAULT_CHAT_GROUP_IDS,
  DEFAULT_CHAT_GROUP_SLUGS,
} from "@/lib/chat/defaults";
import { generateUniqueGroupInviteCode } from "@/lib/chat/invite";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Grup adı en az 3 karakter olmalıdır.")
    .max(60, "Grup adı 60 karakterden uzun olamaz."),
  description: z
    .string()
    .trim()
    .max(240, "Açıklama 240 karakterden uzun olamaz.")
    .optional(),
  expertise: z
    .string()
    .trim()
    .max(40, "Uzmanlık etiketi 40 karakterden uzun olamaz.")
    .optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  allowLinkJoin: z.boolean().optional(),
  memberIds: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Üye kimliği boş olamaz.")
    )
    .max(50, "En fazla 50 kişiyi aynı anda ekleyebilirsiniz.")
    .optional(),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 50);

const buildSlugCandidate = (base: string, attempt: number) => {
  if (attempt === 0) return base;
  const suffix = attempt.toString(36);
  const truncatedBase = base.slice(0, Math.max(1, 50 - suffix.length - 1));
  return `${truncatedBase}-${suffix}`;
};

async function resolveUniqueSlug(name: string) {
  const reserved = new Set(DEFAULT_CHAT_GROUP_SLUGS);
  const baseValue = slugify(name) || "grup";
  const base = baseValue.startsWith("dm-") ? `grup-${baseValue}` : baseValue;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = buildSlugCandidate(base, attempt);
    if (reserved.has(candidate)) {
      continue;
    }

    const exists = await db.chatGroup.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }
  }

  const fallback = `${base}-${Date.now().toString(36)}`;
  return fallback.slice(0, 60);
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    try {
      await ensureDefaultChatGroups();
    } catch (err) {
      console.error("[CHAT_GROUPS_GET] Error ensuring default chat groups:", err);
      // Continue execution even if default groups fail to ensure
    }

    const url = new URL(request.url);
    const requestedCategory = url.searchParams.get("category");
    const category = requestedCategory === "user" ? "user" : "community";

    const baseWhere: Prisma.ChatGroupWhereInput = {
      NOT: {
        slug: {
          startsWith: "dm-",
        },
      },
    };

    // Topluluk slug'ları (create-course-communities API'sinden)
    const COMMUNITY_SLUGS = [
      "dotnet-core-community",
      "java-community",
      "mssql-community",
      "react-community",
      "angular-community",
      "nodejs-community",
      "ai-community",
      "flutter-community",
      "ethical-hacking-community",
      "nextjs-community",
      "docker-kubernetes-community",
      "owasp-community",
      "python-community",
      "vuejs-community",
      "typescript-community",
      "go-community",
      "postgresql-community",
      "aws-community",
      "swift-community",
      "kotlin-community",
      "mongodb-community",
      "spring-boot-community",
      "nestjs-community",
      "azure-community",
    ];

    const communityIds = DEFAULT_CHAT_GROUP_IDS;

    const visibilityClause: Prisma.ChatGroupWhereInput = {
      OR: [
        { visibility: "public" },
        {
          visibility: "private",
          memberships: {
            some: {
              userId,
            },
          },
        },
      ],
    };

    const filters: Prisma.ChatGroupWhereInput[] = [baseWhere, visibilityClause];

    if (category === "community") {
      // Community kategorisinde: Sadece sistemde tanımlı 12 adet topluluk (slug'lara göre)
      // Bu topluluklar createdById: null ve visibility: "public" olmalı
      filters.push({
        slug: { in: COMMUNITY_SLUGS },
        createdById: null,
        visibility: "public",
      });
    } else if (category === "user") {
      // "user" kategorisinde: Sadece kullanıcının oluşturduğu gruplar
      filters.push({
        createdById: userId,
      });
      // Sistem topluluklarını (COMMUNITY_SLUGS) hariç tut
      filters.push({
        slug: { notIn: COMMUNITY_SLUGS },
      });
    }

    const where: Prisma.ChatGroupWhereInput = {
      AND: filters,
    };

    const groups = await db.chatGroup.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        memberships: {
          where: { userId },
          select: {
            role: true,
            lastSeenAt: true,
            isMuted: true,
          },
        },
      },
    });

    const payload = await Promise.all(
      groups.map(async (group: { id: string; memberships: Array<{ role: string; lastSeenAt: Date | null; isMuted: boolean }>; createdById: string; name: string; slug: string; visibility: string; allowLinkJoin: boolean; inviteCode: string | null; expertise: string | null; description: string | null; createdAt: Date; updatedAt: Date }) => {
        const membership = group.memberships[0] ?? null;

        const [lastMessage, memberCount, unreadCount] = await Promise.all([
          db.chatMessage.findFirst({
            where: { groupId: group.id },
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
              attachments: true,
            },
          }),
          db.chatGroupMembership.count({
            where: { groupId: group.id },
          }),
          membership
            ? db.chatMessage.count({
                where: {
                  groupId: group.id,
                  userId: { not: userId },
                  createdAt: {
                    gt: membership.lastSeenAt ?? new Date(0),
                  },
                },
              })
            : Promise.resolve(0),
        ]);

        const canManage =
          membership?.role === "admin" ||
          membership?.role === "moderator" ||
          group.createdById === userId;

        return {
          id: group.id,
          name: group.name,
          slug: group.slug,
          visibility: group.visibility,
          allowLinkJoin: group.allowLinkJoin,
          inviteCode: canManage ? group.inviteCode : null,
          createdById: group.createdById,
          expertise: group.expertise,
          description: group.description,
          createdAt: group.createdAt.toISOString(),
          updatedAt: group.updatedAt.toISOString(),
          memberCount,
          membership: membership
            ? {
                role: membership.role,
                lastSeenAt: membership.lastSeenAt?.toISOString() ?? null,
                isMuted: membership.isMuted,
              }
            : null,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                groupId: group.id,
                type: lastMessage.type,
                content: lastMessage.content,
                mentionIds: lastMessage.mentionIds,
                createdAt: lastMessage.createdAt.toISOString(),
                updatedAt: lastMessage.updatedAt.toISOString(),
                deletedAt: lastMessage.deletedAt?.toISOString() ?? null,
                user: {
                  id: lastMessage.user.id,
                  name: lastMessage.user.name,
                  profileImage: lastMessage.user.profileImage,
                },
                attachments: lastMessage.attachments.map((attachment: any) => ({
                  id: attachment.id,
                  url: attachment.url,
                  type: attachment.type,
                  metadata: attachment.metadata
                    ? (attachment.metadata as Record<string, unknown>)
                    : null,
                  size: attachment.size,
                  width: attachment.width,
                  height: attachment.height,
                  duration: attachment.duration,
                  createdAt: attachment.createdAt.toISOString(),
                })),
              }
            : null,
          unreadCount,
        };
      })
    );

    return NextResponse.json({ groups: payload });
  } catch (error) {
    console.error("[CHAT_GROUPS_GET]", error);
    return NextResponse.json({ error: "Gruplar alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = createGroupSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        { error: issues[0] ?? "Geçersiz istek verisi" },
        { status: 400 },
      );
    }

    const userId = session.user.id as string;

    const name = parsed.data.name.trim();
    const description = parsed.data.description?.trim() || null;
    const expertise = parsed.data.expertise?.trim() || null;
    const visibility = parsed.data.visibility ?? "public";
    const allowLinkJoin = visibility === "private" ? Boolean(parsed.data.allowLinkJoin) : false;
    const requestedMemberIds = Array.from(new Set(parsed.data.memberIds ?? []))
      .map((memberId) => memberId.trim())
      .filter((memberId) => memberId.length > 0 && memberId !== userId);

    let allowedMemberIds: string[] = [];
    if (requestedMemberIds.length > 0) {
      const friendships = await db.friendship.findMany({
        where: {
          status: "accepted",
          OR: [
            {
              requesterId: userId,
              addresseeId: { in: requestedMemberIds },
            },
            {
              addresseeId: userId,
              requesterId: { in: requestedMemberIds },
            },
          ],
        },
        select: {
          requesterId: true,
          addresseeId: true,
        },
      });

      const acceptedFriendIds = new Set<string>();
      friendships.forEach((friendship: { requesterId: string; addresseeId: string }) => {
        const counterpart = friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId;
        acceptedFriendIds.add(counterpart);
      });

      allowedMemberIds = requestedMemberIds.filter((candidate) => acceptedFriendIds.has(candidate));
    }

    const slug = await resolveUniqueSlug(name);

    const result = await db.$transaction(async (tx: any) => {
      const inviteCode = allowLinkJoin ? await generateUniqueGroupInviteCode(tx) : null;

      const group = await tx.chatGroup.create({
        data: {
          name,
          description,
          expertise,
          slug,
          visibility,
          allowLinkJoin,
          inviteCode,
          createdById: userId,
        },
      });

      const membership = await tx.chatGroupMembership.create({
        data: {
          groupId: group.id,
          userId,
          role: "admin",
        },
      });

      if (allowedMemberIds.length > 0) {
        await tx.chatGroupMembership.createMany({
          data: allowedMemberIds.map((friendId) => ({
            groupId: group.id,
            userId: friendId,
            role: "member",
          })),
          skipDuplicates: true,
        });
      }

      const memberCount = await tx.chatGroupMembership.count({
        where: { groupId: group.id },
      });

      return { group, membership, memberCount };
    });

    return NextResponse.json({
      group: {
        id: result.group.id,
        name: result.group.name,
        slug: result.group.slug,
        visibility: result.group.visibility,
        allowLinkJoin: result.group.allowLinkJoin,
        inviteCode: result.group.inviteCode,
        createdById: result.group.createdById,
        expertise: result.group.expertise,
        description: result.group.description,
        createdAt: result.group.createdAt.toISOString(),
        updatedAt: result.group.updatedAt.toISOString(),
        memberCount: result.memberCount,
        membership: {
          role: result.membership.role,
          lastSeenAt: result.membership.lastSeenAt?.toISOString() ?? null,
          isMuted: result.membership.isMuted,
        },
        lastMessage: null,
        unreadCount: 0,
      },
    });
  } catch (error) {
    console.error("[CHAT_GROUPS_POST]", error);
    return NextResponse.json(
      { error: "Grup oluşturulurken bir hata oluştu." },
      { status: 500 },
    );
  }
}

