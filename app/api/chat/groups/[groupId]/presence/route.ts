import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { broadcastPresenceUpdate } from "@/lib/realtime/signalr-triggers";
import { getBotsToUpdateForGroup } from "@/lib/bot/keep-online-jobs";
import { updateBotsPresence } from "@/lib/bot/bot-session";

const presenceSchema = z.object({
  status: z.enum(["online", "offline"]).default("online"),
  lastSeenAt: z.string().datetime().optional(),
});

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const membership = await db.chatGroupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId: params.groupId,
          userId,
        },
      },
    });

    if (!membership) {
      const group = await db.chatGroup.findUnique({
        where: { id: params.groupId },
        select: { id: true },
      });

      if (!group) {
        return NextResponse.json({ error: "Grup bulunamadı." }, { status: 404 });
      }
    }

    // sendBeacon ile gelen blob'ları destekle
    let body: unknown;
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      // Blob olarak gönderilmiş olabilir (sendBeacon)
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        // Eğer parse edilemezse varsayılan değerleri kullan
        body = { status: "offline" };
      }
    }

    const parsed = presenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { status, lastSeenAt } = parsed.data;
    // Client'tan lastSeenAt gönderilmiyorsa (normal durum), server zamanını kullan
    // Eğer gönderilmişse ve geçerliyse kullan, aksi halde server zamanını kullan
    const serverTime = new Date();
    let resolvedLastSeen = serverTime;
    
    if (lastSeenAt) {
      const clientTime = new Date(lastSeenAt);
      // Geçerli bir tarih mi ve gelecekte değil mi kontrol et
      if (!isNaN(clientTime.getTime()) && clientTime.getTime() <= serverTime.getTime()) {
        // Client zamanı geçmişte veya şimdi ise kullan (maksimum 10 saniye fark toleransı)
        const timeDiff = Math.abs(serverTime.getTime() - clientTime.getTime());
        if (timeDiff <= 10000) {
          resolvedLastSeen = clientTime;
        }
      }
    }

    await db.chatGroupMembership.upsert({
      where: {
        groupId_userId: {
          groupId: params.groupId,
          userId,
        },
      },
      update: {
        lastSeenAt: resolvedLastSeen,
      },
      create: {
        groupId: params.groupId,
        userId,
        lastSeenAt: resolvedLastSeen,
      },
    });

    await broadcastPresenceUpdate(params.groupId, {
      userId,
      status,
      lastSeenAt: resolvedLastSeen.toISOString(),
    });

    // Keep-online integration: Update bots that should be kept online for this group
    // This runs asynchronously to not block the main presence update
    try {
      // Get all member IDs of this group (for filtering)
      const groupMembers = await db.chatGroupMembership.findMany({
        where: { groupId: params.groupId },
        select: { userId: true },
      });
      const memberIds = groupMembers.map((m: { userId: string }) => m.userId);

      // Check if any bots should be kept online for this group
      const { userIds: botsToUpdate, shouldUpdate } = getBotsToUpdateForGroup(
        params.groupId,
        memberIds
      );

      if (shouldUpdate && botsToUpdate.length > 0) {
        // Batch update bots' presence (non-blocking)
        updateBotsPresence(botsToUpdate, params.groupId).catch((error) => {
          console.error("[KEEP_ONLINE] Error updating bots presence:", error);
        });

        // Broadcast presence updates for bots
        for (const botId of botsToUpdate) {
          broadcastPresenceUpdate(params.groupId, {
            userId: botId,
            status: "online",
            lastSeenAt: new Date().toISOString(),
          }).catch((error) => {
            console.error("[KEEP_ONLINE] Error broadcasting bot presence:", error);
          });
        }
      }
    } catch (error) {
      // Don't fail the main request if keep-online update fails
      console.error("[KEEP_ONLINE] Error in keep-online integration:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAT_PRESENCE_POST]", error);
    return NextResponse.json({ error: "Presence güncellenirken bir hata oluştu." }, { status: 500 });
  }
}


