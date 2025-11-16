import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { broadcastPresenceUpdate } from "@/lib/realtime/signalr-triggers";
import { getDirectThreadWithParticipants, isDirectThreadSlug } from "@/lib/chat/direct";

const presenceSchema = z.object({
  status: z.enum(["online", "offline"]).default("online"),
  lastSeenAt: z.string().datetime().optional(),
});

async function ensureDirectAccess(threadId: string, userId: string) {
  const thread = await getDirectThreadWithParticipants(threadId);
  if (!thread || !isDirectThreadSlug(thread.slug)) {
    return false;
  }
  return thread.memberships.some((member) => member.userId === userId);
}

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const hasAccess = await ensureDirectAccess(params.threadId, userId);

    if (!hasAccess) {
      return NextResponse.json({ error: "Bu mesaja erişiminiz yok." }, { status: 403 });
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
          groupId: params.threadId,
          userId,
        },
      },
      update: {
        lastSeenAt: resolvedLastSeen,
      },
      create: {
        groupId: params.threadId,
        userId,
        lastSeenAt: resolvedLastSeen,
      },
    });

    await broadcastPresenceUpdate(params.threadId, {
      userId,
      status,
      lastSeenAt: resolvedLastSeen.toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAT_DIRECT_PRESENCE_POST] Error:", error);
    
    if (error instanceof Error) {
      console.error("[CHAT_DIRECT_PRESENCE_POST] Error message:", error.message);
      console.error("[CHAT_DIRECT_PRESENCE_POST] Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("P1001")) {
        console.error("[CHAT_DIRECT_PRESENCE_POST] Database connection error detected");
      }
    }
    
    return NextResponse.json(
      { 
        error: "Presence güncellenirken bir hata oluştu.",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}


