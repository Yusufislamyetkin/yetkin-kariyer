import { NextResponse } from "next/server";
import { z } from "zod";

import { generateUniqueGroupInviteCode } from "@/lib/chat/invite";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const updateInviteSchema = z.object({
  allowLinkJoin: z.boolean().optional(),
  regenerate: z.boolean().optional(),
});

async function ensureManageAccess(groupId: string, userId: string) {
  const [group, membership] = await Promise.all([
    db.chatGroup.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        visibility: true,
        allowLinkJoin: true,
        inviteCode: true,
        createdById: true,
      },
    }),
    db.chatGroupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      select: {
        role: true,
      },
    }),
  ]);

  if (!group) {
    return { group: null, canManage: false };
  }

  const canManage =
    group.createdById === userId ||
    membership?.role === "admin" ||
    membership?.role === "moderator";

  return { group, canManage };
}

export async function GET(_request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { group, canManage } = await ensureManageAccess(params.groupId, userId);

    if (!group) {
      return NextResponse.json({ error: "Grup bulunamadı." }, { status: 404 });
    }

    if (!canManage) {
      return NextResponse.json({ error: "Davet linkini yönetme yetkiniz yok." }, { status: 403 });
    }

    return NextResponse.json({
      visibility: group.visibility,
      allowLinkJoin: group.allowLinkJoin,
      inviteCode: group.inviteCode,
    });
  } catch (error) {
    console.error("[CHAT_GROUP_INVITE_LINK_GET]", error);
    return NextResponse.json({ error: "Davet bilgileri alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { group, canManage } = await ensureManageAccess(params.groupId, userId);

    if (!group) {
      return NextResponse.json({ error: "Grup bulunamadı." }, { status: 404 });
    }

    if (!canManage) {
      return NextResponse.json({ error: "Davet linkini yönetme yetkiniz yok." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = updateInviteSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        { error: issues[0] ?? "Geçersiz istek verisi." },
        { status: 400 },
      );
    }

    const desiredAllowLinkJoin =
      parsed.data.allowLinkJoin !== undefined ? parsed.data.allowLinkJoin : group.allowLinkJoin;
    const shouldRegenerate =
      Boolean(parsed.data.regenerate) || (desiredAllowLinkJoin && !group.inviteCode);

    let inviteCode = group.inviteCode;
    if (!desiredAllowLinkJoin) {
      inviteCode = null;
    } else if (shouldRegenerate) {
      inviteCode = await generateUniqueGroupInviteCode();
    }

    const updated = await db.chatGroup.update({
      where: { id: group.id },
      data: {
        allowLinkJoin: desiredAllowLinkJoin,
        inviteCode,
      },
      select: {
        visibility: true,
        allowLinkJoin: true,
        inviteCode: true,
      },
    });

    return NextResponse.json({
      visibility: updated.visibility,
      allowLinkJoin: updated.allowLinkJoin,
      inviteCode: updated.inviteCode,
    });
  } catch (error) {
    console.error("[CHAT_GROUP_INVITE_LINK_POST]", error);
    return NextResponse.json({ error: "Davet linki güncellenirken bir hata oluştu." }, { status: 500 });
  }
}


