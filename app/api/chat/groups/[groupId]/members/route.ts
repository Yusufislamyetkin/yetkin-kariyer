import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const addMembersSchema = z.object({
  userIds: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Üye kimliği boş olamaz.")
    )
    .min(1, "En az bir kullanıcı seçmelisiniz.")
    .max(50, "En fazla 50 kişiyi aynı anda ekleyebilirsiniz."),
});

export async function GET(_request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const membership = await db.chatGroupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId: params.groupId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Bu gruba erişiminiz yok." }, { status: 403 });
    }

    const members = await db.chatGroupMembership.findMany({
      where: { groupId: params.groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        role: "desc",
      },
    });

    const payload = members.map((member) => ({
      id: member.id,
      role: member.role,
      isMuted: member.isMuted,
      lastSeenAt: member.lastSeenAt?.toISOString() ?? null,
      joinedAt: member.joinedAt.toISOString(),
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        profileImage: member.user.profileImage,
      },
    }));

    return NextResponse.json({ members: payload });
  } catch (error) {
    console.error("[CHAT_MEMBERS_GET]", error);
    return NextResponse.json({ error: "Grup üyeleri alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const group = await db.chatGroup.findUnique({
      where: { id: params.groupId },
      select: {
        id: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Grup bulunamadı." }, { status: 404 });
    }

    const membership = await db.chatGroupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId: params.groupId,
          userId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!membership || (membership.role !== "admin" && membership.role !== "moderator")) {
      return NextResponse.json(
        { error: "Yalnızca grup yöneticileri üye ekleyebilir." },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = addMembersSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        { error: issues[0] ?? "Geçersiz istek verisi." },
        { status: 400 },
      );
    }

    const requestedUserIds = Array.from(new Set(parsed.data.userIds))
      .map((candidate) => candidate.trim())
      .filter((candidate) => candidate.length > 0 && candidate !== userId);

    if (requestedUserIds.length === 0) {
      return NextResponse.json({ addedMembers: [], skippedUserIds: parsed.data.userIds ?? [] });
    }

    const friendships = await db.friendship.findMany({
      where: {
        status: "accepted",
        OR: [
          {
            requesterId: userId,
            addresseeId: { in: requestedUserIds },
          },
          {
            addresseeId: userId,
            requesterId: { in: requestedUserIds },
          },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    const acceptedFriendIds = new Set<string>();
    friendships.forEach((friendship) => {
      const counterpart = friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId;
      acceptedFriendIds.add(counterpart);
    });

    const allowedUserIds = requestedUserIds.filter((candidate) => acceptedFriendIds.has(candidate));

    if (allowedUserIds.length === 0) {
      return NextResponse.json({ addedMembers: [], skippedUserIds: requestedUserIds });
    }

    const existingMemberships = await db.chatGroupMembership.findMany({
      where: {
        groupId: params.groupId,
        userId: { in: allowedUserIds },
      },
      select: {
        userId: true,
      },
    });

    const alreadyMemberIds = new Set(existingMemberships.map((entry) => entry.userId));
    const createUserIds = allowedUserIds.filter((candidate) => !alreadyMemberIds.has(candidate));

    if (createUserIds.length > 0) {
      await db.chatGroupMembership.createMany({
        data: createUserIds.map((candidate) => ({
          groupId: params.groupId,
          userId: candidate,
          role: "member",
        })),
        skipDuplicates: true,
      });
    }

    if (createUserIds.length === 0) {
      return NextResponse.json({ addedMembers: [], skippedUserIds: requestedUserIds });
    }

    const members = await db.chatGroupMembership.findMany({
      where: {
        groupId: params.groupId,
        userId: { in: createUserIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    const payload = members.map((member) => ({
      id: member.id,
      role: member.role,
      isMuted: member.isMuted,
      lastSeenAt: member.lastSeenAt?.toISOString() ?? null,
      joinedAt: member.joinedAt.toISOString(),
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        profileImage: member.user.profileImage,
      },
    }));

    const skippedUserIds = requestedUserIds.filter((candidate) => !createUserIds.includes(candidate));

    return NextResponse.json({
      addedMembers: payload,
      skippedUserIds,
    });
  } catch (error) {
    console.error("[CHAT_MEMBERS_POST]", error);
    return NextResponse.json({ error: "Üye eklenirken bir hata oluştu." }, { status: 500 });
  }
}

