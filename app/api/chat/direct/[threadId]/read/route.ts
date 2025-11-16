import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDirectThreadWithParticipants, isDirectThreadSlug } from "@/lib/chat/direct";

const readSchema = z.object({
  messageIds: z.array(z.string().cuid()).optional(),
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

    const body = await request.json();
    const parsed = readSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { messageIds, lastSeenAt } = parsed.data;
    const now = new Date();

    await db.$transaction(async (tx) => {
      if (messageIds && messageIds.length > 0) {
        await tx.chatMessageReceipt.createMany({
          data: messageIds.map((messageId) => ({
            messageId,
            userId,
            readAt: now,
          })),
          skipDuplicates: true,
        });
      }

      await tx.chatGroupMembership.upsert({
        where: {
          groupId_userId: {
            groupId: params.threadId,
            userId,
          },
        },
        update: {
          lastSeenAt: lastSeenAt ? new Date(lastSeenAt) : now,
        },
        create: {
          groupId: params.threadId,
          userId,
          lastSeenAt: lastSeenAt ? new Date(lastSeenAt) : now,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAT_DIRECT_READ_POST]", error);
    return NextResponse.json({ error: "Okuma bilgisi güncellenirken bir hata oluştu." }, { status: 500 });
  }
}


