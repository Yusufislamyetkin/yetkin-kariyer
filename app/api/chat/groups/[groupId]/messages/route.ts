import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { broadcastChatMessage } from "@/lib/realtime/signalr-triggers";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { checkRateLimit, rateLimitKey, Limits } from "@/lib/security/rateLimit";

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

export async function GET(request: Request, { params }: { params: { groupId: string } }) {
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
      where: { groupId: params.groupId },
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

    const payload = messages.map((message: any) => ({
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
      attachments: message.attachments.map((attachment: any) => ({
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
      readByUserIds: message.receipts.map((receipt: { userId: string }) => receipt.userId),
    }));

    return NextResponse.json({
      messages: payload,
      nextCursor,
    });
  } catch (error) {
    console.error("[CHAT_MESSAGES_GET]", error);
    return NextResponse.json({ error: "Mesajlar alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Rate limit: messages per group+user
    {
      const key = rateLimitKey(["chat:group:message", params.groupId, session.user.id]);
      const verdict = checkRateLimit(key, Limits.messageCreate);
      if (!verdict.ok) {
        return NextResponse.json(
          { error: "Çok sık mesaj gönderimi. Lütfen daha sonra tekrar deneyin." },
          { status: 429, headers: { "Retry-After": Math.ceil(verdict.retryAfterMs / 1000).toString() } }
        );
      }
    }

    const membership = await db.chatGroupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId: params.groupId,
          userId: session.user.id,
        },
      },
      include: {
        group: true,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Bu gruba erişiminiz yok." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const safeContent = data.content ? sanitizePlainText(data.content, 4000) : null;

    const message = await db.chatMessage.create({
      data: {
        groupId: params.groupId,
        userId: session.user.id,
        type: data.type,
        content: safeContent ?? undefined,
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

    await Promise.all([
      db.chatMessageReceipt.create({
        data: {
          messageId: message.id,
          userId: session.user.id,
        },
      }),
      db.chatGroupMembership.update({
        where: {
          groupId_userId: {
            groupId: params.groupId,
            userId: session.user.id,
          },
        },
        data: {
          lastSeenAt: new Date(),
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
        attachments: fullMessage.attachments.map((attachment: any) => ({
          id: attachment.id,
          messageId: attachment.messageId,
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
        readByUserIds: fullMessage.receipts.map((receipt: { userId: string }) => receipt.userId),
      },
      sender: {
        id: fullMessage.user.id,
        name: fullMessage.user.name,
        profileImage: fullMessage.user.profileImage,
      },
    };

    await broadcastChatMessage(params.groupId, payload);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[CHAT_MESSAGES_POST]", error);
    return NextResponse.json({ error: "Mesaj gönderilirken bir hata oluştu." }, { status: 500 });
  }
}

