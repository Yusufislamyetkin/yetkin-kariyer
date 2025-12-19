import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkUserSubscription } from "@/lib/services/subscription-service";

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Abonelik kontrolü - gruba katılmak için abonelik gerekli
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

    const body = await request.json().catch(() => ({}));
    const inviteCodeInput =
      typeof body.inviteCode === "string" ? body.inviteCode.trim().toUpperCase() : undefined;

    const group = await db.chatGroup.findUnique({
      where: { id: params.groupId },
      select: {
        id: true,
        visibility: true,
        allowLinkJoin: true,
        inviteCode: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Grup bulunamadı." }, { status: 404 });
    }

    const existingMembership = await db.chatGroupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
      select: {
        role: true,
        lastSeenAt: true,
        isMuted: true,
      },
    });

    if (existingMembership) {
      return NextResponse.json({
        success: true,
        membership: {
          role: existingMembership.role,
          lastSeenAt: existingMembership.lastSeenAt?.toISOString() ?? null,
          isMuted: existingMembership.isMuted,
        },
        alreadyMember: true,
      });
    }

    // Public gruplar için direkt katılım izni ver
    if (group.visibility === "private") {
      if (!group.allowLinkJoin) {
        return NextResponse.json(
          { error: "Bu gruba yalnızca yönetici tarafından davet edilen üyeler katılabilir." },
          { status: 403 },
        );
      }

      if (!group.inviteCode || !inviteCodeInput || inviteCodeInput !== group.inviteCode) {
        return NextResponse.json({ error: "Geçerli bir davet kodu gereklidir." }, { status: 403 });
      }
    }
    // Public gruplar (visibility !== "private") için invite code kontrolü yapılmaz, direkt katılım izni verilir

    const membership = await db.chatGroupMembership.create({
      data: {
        groupId: group.id,
        userId,
      },
      select: {
        role: true,
        lastSeenAt: true,
        isMuted: true,
      },
    });

    return NextResponse.json({
      success: true,
      membership: {
        role: membership.role,
        lastSeenAt: membership.lastSeenAt?.toISOString() ?? null,
        isMuted: membership.isMuted,
      },
    });
  } catch (error) {
    console.error("[CHAT_GROUP_JOIN_POST]", error);
    return NextResponse.json({ error: "Gruba katılırken bir hata oluştu." }, { status: 500 });
  }
}


