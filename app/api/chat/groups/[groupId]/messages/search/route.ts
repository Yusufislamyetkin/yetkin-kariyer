import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const searchSchema = z.object({
  query: z.string().trim().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
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
    const parsed = searchSchema.safeParse({
      query: url.searchParams.get("q") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
    }

    const { query, limit, cursor } = parsed.data;

    if (!query) {
      return NextResponse.json({ error: "Arama sorgusu gerekli" }, { status: 400 });
    }

    // Mesajları içerik alanında arama yap
    const whereClause: any = {
      groupId: params.groupId,
      content: {
        contains: query,
        mode: "insensitive" as const,
      },
    };

    if (cursor) {
      whereClause.id = { lt: cursor };
    }

    const messages = await db.chatMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
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
      query,
    });
  } catch (error) {
    console.error("[CHAT_MESSAGES_SEARCH]", error);
    return NextResponse.json({ error: "Mesajlar aranırken bir hata oluştu." }, { status: 500 });
  }
}

