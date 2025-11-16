import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildDirectThreadIdentifiers, ensureDirectThread, getDirectThreadWithParticipants, isDirectThreadSlug } from "@/lib/chat/direct";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const startThreadSchema = z.object({
  userId: z.string().cuid(),
});

function serializeDirectThread(
  thread: Awaited<ReturnType<typeof getDirectThreadWithParticipants>>,
  currentUserId: string,
  lastMessage: {
    id: string;
    type: string;
    content: string | null;
    mentionIds: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    attachments: Array<{
      id: string;
      messageId: string;
      url: string;
      type: string;
      metadata: Record<string, unknown> | null;
      size: number | null;
      width: number | null;
      height: number | null;
      duration: number | null;
      createdAt: string;
    }>;
    sender: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
  } | null,
  unreadCount: number
) {
  if (!thread) {
    return null;
  }

  const membership = thread.memberships.find((member) => member.userId === currentUserId);
  const participant = thread.memberships.find((member) => member.userId !== currentUserId);

  return {
    id: thread.id,
    slug: thread.slug,
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
    memberCount: thread.memberships.length,
    membership: membership
      ? {
          role: membership.role,
          isMuted: membership.isMuted,
          lastSeenAt: membership.lastSeenAt?.toISOString() ?? null,
        }
      : null,
    participant: participant
      ? {
          id: participant.user.id,
          name: participant.user.name,
          email: participant.user.email,
          profileImage: participant.user.profileImage,
          lastSeenAt: participant.lastSeenAt?.toISOString() ?? null,
        }
      : null,
    lastMessage,
    unreadCount,
  };
}

async function buildThreadPayload(threadId: string, currentUserId: string) {
  const thread = await getDirectThreadWithParticipants(threadId);
  if (!thread || !isDirectThreadSlug(thread.slug)) {
    return null;
  }

  const membership = thread.memberships.find((member) => member.userId === currentUserId);

  const [lastMessage, unreadCount] = await Promise.all([
    db.chatMessage.findFirst({
      where: { groupId: thread.id },
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
    membership
      ? db.chatMessage.count({
          where: {
            groupId: thread.id,
            userId: { not: currentUserId },
            createdAt: {
              gt: membership.lastSeenAt ?? new Date(0),
            },
          },
        })
      : Promise.resolve(0),
  ]);

  const serializedLastMessage = lastMessage
    ? {
        id: lastMessage.id,
        type: lastMessage.type,
        content: lastMessage.content,
        mentionIds: lastMessage.mentionIds,
        createdAt: lastMessage.createdAt.toISOString(),
        updatedAt: lastMessage.updatedAt.toISOString(),
        deletedAt: lastMessage.deletedAt?.toISOString() ?? null,
        sender: {
          id: lastMessage.user.id,
          name: lastMessage.user.name,
          profileImage: lastMessage.user.profileImage,
        },
        attachments: lastMessage.attachments.map((attachment) => ({
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
      }
    : null;

  return serializeDirectThread(thread, currentUserId, serializedLastMessage, unreadCount);
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const threads = await db.chatGroup.findMany({
      where: {
        slug: {
          startsWith: "dm-",
        },
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
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
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const payload = (
      await Promise.all(
        threads.map(async (thread) => {
          try {
            const serialized = await buildThreadPayload(thread.id, userId);
            return serialized;
          } catch (err) {
            console.error(`[CHAT_DIRECT_LIST] Error building payload for thread ${thread.id}:`, err);
            return null;
          }
        })
      )
    ).filter((thread): thread is NonNullable<typeof thread> => Boolean(thread));

    return NextResponse.json({ threads: payload });
  } catch (error) {
    console.error("[CHAT_DIRECT_LIST]", error);
    const errorMessage = error instanceof Error ? error.message : "Mesajlaşma listesi alınırken bir hata oluştu.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await request.json();
    const parsed = startThreadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const targetUserId = parsed.data.userId;

    if (targetUserId === userId) {
      return NextResponse.json({ error: "Kendinizle direkt mesaj başlatamazsınız." }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Hedef kullanıcı bulunamadı." }, { status: 404 });
    }

    await ensureDirectThread(userId, targetUserId);
    const identifiers = buildDirectThreadIdentifiers(userId, targetUserId);
    const payload = await buildThreadPayload(identifiers.id, userId);

    if (!payload) {
      throw new Error("Direct thread oluşturuldu fakat yüklenemedi.");
    }

    return NextResponse.json({ thread: payload });
  } catch (error) {
    console.error("[CHAT_DIRECT_START]", error);
    return NextResponse.json({ error: "Direkt mesaj başlatılırken bir hata oluştu." }, { status: 500 });
  }
}


