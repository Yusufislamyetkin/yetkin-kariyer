import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { broadcastChatMessage } from "@/lib/realtime/signalr-triggers";
import { getDirectThreadWithParticipants, isDirectThreadSlug } from "@/lib/chat/direct";

const paginationSchema = z.object({
  cursor: z.string().cuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(30),
});

const attachmentSchema = z.object({
  url: z.string().url(),
  type: z.enum(["image", "audio", "video", "file", "gif"]),
  metadata: z.record(z.any()).optional(),
  size: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
});

const createMessageSchema = z
  .object({
    type: z.enum(["text", "image", "audio", "video", "file", "gif", "system"]).default("text"),
    content: z.string().trim().max(4000).optional(),
    mentionIds: z.array(z.string()).optional(),
    attachments: z.array(attachmentSchema).optional(),
  })
  .refine((data) => !!data.content || (data.attachments && data.attachments.length > 0), {
    message: "Mesaj metni veya ek içeriği zorunludur.",
    path: ["content"],
  });

async function ensureDirectAccess(threadId: string, userId: string) {
  const thread = await getDirectThreadWithParticipants(threadId);

  if (!thread || !isDirectThreadSlug(thread.slug)) {
    return { status: 404 as const };
  }

  const membership = thread.memberships.find((member) => member.userId === userId);

  if (!membership) {
    return { status: 403 as const };
  }

  return {
    status: 200 as const,
    thread,
    membership,
  };
}

export async function GET(request: Request, { params }: { params: { threadId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const access = await ensureDirectAccess(params.threadId, userId);

    if (access.status !== 200) {
      return NextResponse.json({ error: "Bu mesaja erişiminiz yok." }, { status: access.status });
    }

    const url = new URL(request.url);
    const parsed = paginationSchema.safeParse({
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
    }

    const { cursor, limit } = parsed.data;

    const messages = await db.chatMessage.findMany({
      where: { groupId: params.threadId },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        attachments: true,
        receipts: {
          select: {
            userId: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id ?? null;
    }

    const payload = messages.map((message) => ({
      id: message.id,
      groupId: message.groupId,
      userId: message.userId,
      type: message.type,
      content: message.content,
      mentionIds: message.mentionIds,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
      deletedAt: message.deletedAt?.toISOString() ?? null,
      sender: {
        id: message.user.id,
        name: message.user.name,
        profileImage: message.user.profileImage,
      },
      attachments: message.attachments.map((attachment) => ({
        id: attachment.id,
        messageId: attachment.messageId,
        url: attachment.url,
        type: attachment.type,
        metadata: attachment.metadata,
        size: attachment.size,
        width: attachment.width,
        height: attachment.height,
        duration: attachment.duration,
        createdAt: attachment.createdAt.toISOString(),
      })),
      readByUserIds: message.receipts.map((receipt) => receipt.userId),
    }));

    return NextResponse.json({
      messages: payload,
      nextCursor,
    });
  } catch (error) {
    console.error("[CHAT_DIRECT_MESSAGES_GET]", error);
    return NextResponse.json({ error: "Mesajlar alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const access = await ensureDirectAccess(params.threadId, userId);

    if (access.status !== 200) {
      return NextResponse.json({ error: "Bu mesaja erişiminiz yok." }, { status: access.status });
    }

    const body = await request.json();
    const parsed = createMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    const message = await db.chatMessage.create({
      data: {
        groupId: params.threadId,
        userId,
        type: data.type,
        content: data.content,
        mentionIds: data.mentionIds ?? [],
        attachments:
          data.attachments && data.attachments.length > 0
            ? {
                create: data.attachments.map((attachment) => ({
                  url: attachment.url,
                  type: attachment.type,
                  metadata: attachment.metadata,
                  size: attachment.size,
                  width: attachment.width,
                  height: attachment.height,
                  duration: attachment.duration,
                })),
              }
            : undefined,
      },
      include: {
        attachments: true,
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    const now = new Date();

    await Promise.all([
      db.chatMessageReceipt.create({
        data: {
          messageId: message.id,
          userId,
        },
      }),
      db.chatGroupMembership.upsert({
        where: {
          groupId_userId: {
            groupId: params.threadId,
            userId,
          },
        },
        update: {
          lastSeenAt: now,
        },
        create: {
          groupId: params.threadId,
          userId,
          lastSeenAt: now,
        },
      }),
      db.chatGroup.update({
        where: { id: params.threadId },
        data: {
          updatedAt: now,
        },
      }),
    ]);

    const fullMessage = await db.chatMessage.findUnique({
      where: { id: message.id },
      include: {
        attachments: true,
        receipts: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    if (!fullMessage) {
      throw new Error("Mesaj oluşturuldu ancak alınamadı");
    }

    const payload = {
      message: {
        id: fullMessage.id,
        groupId: fullMessage.groupId,
        userId: fullMessage.userId,
        type: fullMessage.type,
        content: fullMessage.content,
        mentionIds: fullMessage.mentionIds,
        createdAt: fullMessage.createdAt.toISOString(),
        updatedAt: fullMessage.updatedAt.toISOString(),
        deletedAt: fullMessage.deletedAt?.toISOString() ?? null,
        attachments: fullMessage.attachments.map((attachment) => ({
          id: attachment.id,
          messageId: attachment.messageId,
          url: attachment.url,
          type: attachment.type,
          metadata: attachment.metadata ? (attachment.metadata as Record<string, unknown>) : null,
          size: attachment.size,
          width: attachment.width,
          height: attachment.height,
          duration: attachment.duration,
          createdAt: attachment.createdAt.toISOString(),
        })),
        readByUserIds: fullMessage.receipts.map((receipt) => receipt.userId),
      },
      sender: {
        id: fullMessage.user.id,
        name: fullMessage.user.name,
        profileImage: fullMessage.user.profileImage,
      },
    };

    await broadcastChatMessage(params.threadId, payload);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[CHAT_DIRECT_MESSAGES_POST]", error);
    return NextResponse.json({ error: "Mesaj gönderilirken bir hata oluştu." }, { status: 500 });
  }
}


