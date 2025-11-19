import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DEFAULT_CHAT_GROUP_IDS, ensureDefaultChatGroups } from "@/lib/chat/defaults";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SummarySection = {
  unreadCount: number;
  channelIds: string[];
};

type SummaryPayload = {
  direct: SummarySection;
  groups: SummarySection;
  community: SummarySection;
};

async function calculateUnreadTotals(
  userId: string,
  memberships: Array<{ groupId: string; lastSeenAt: Date | null }>
) {
  const results = await Promise.all(
    memberships.map(async ({ groupId, lastSeenAt }) => {
      const unread = await db.chatMessage.count({
        where: {
          groupId,
          userId: { not: userId },
          createdAt: {
            gt: lastSeenAt ?? new Date(0),
          },
        },
      });
      return unread;
    })
  );
  return results.reduce((total, value) => total + value, 0);
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id as string;

    try {
      await ensureDefaultChatGroups();
    } catch (err) {
      console.error("[CHAT_SUMMARY_GET] Error ensuring default chat groups:", err);
      // Continue execution even if default groups fail to ensure
    }

    const [directMemberships, groupMemberships] = await Promise.all([
      db.chatGroupMembership.findMany({
        where: {
          userId,
          group: {
            slug: {
              startsWith: "dm-",
            },
          },
        },
        select: {
          groupId: true,
          lastSeenAt: true,
        },
      }),
      db.chatGroupMembership.findMany({
        where: {
          userId,
          group: {
            NOT: {
              slug: {
                startsWith: "dm-",
              },
            },
          },
        },
        select: {
          groupId: true,
          lastSeenAt: true,
        },
      }),
    ]);

    const communityGroupIds = new Set(DEFAULT_CHAT_GROUP_IDS);

    const userGroups: Array<{ groupId: string; lastSeenAt: Date | null }> = [];
    const communityGroups: Array<{ groupId: string; lastSeenAt: Date | null }> = [];

    groupMemberships.forEach((membership: { groupId: string; lastSeenAt: Date | null }) => {
      if (communityGroupIds.has(membership.groupId)) {
        communityGroups.push({
          groupId: membership.groupId,
          lastSeenAt: membership.lastSeenAt,
        });
      } else {
        userGroups.push({
          groupId: membership.groupId,
          lastSeenAt: membership.lastSeenAt,
        });
      }
    });

    const [directUnreadCount, userGroupUnreadCount, communityUnreadCount] = await Promise.all([
      calculateUnreadTotals(userId, directMemberships),
      calculateUnreadTotals(userId, userGroups),
      calculateUnreadTotals(userId, communityGroups),
    ]);

    const payload: SummaryPayload = {
      direct: {
        unreadCount: directUnreadCount,
        channelIds: directMemberships.map((membership: { groupId: string }) => membership.groupId),
      },
      groups: {
        unreadCount: userGroupUnreadCount,
        channelIds: userGroups.map((membership: { groupId: string }) => membership.groupId),
      },
      community: {
        unreadCount: communityUnreadCount,
        channelIds: communityGroups.map((membership: { groupId: string }) => membership.groupId),
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[CHAT_SUMMARY_GET] Error:", error);
    
    if (error instanceof Error) {
      console.error("[CHAT_SUMMARY_GET] Error message:", error.message);
      console.error("[CHAT_SUMMARY_GET] Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("P1001")) {
        console.error("[CHAT_SUMMARY_GET] Database connection error detected");
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Sohbet özeti alınırken bir hata oluştu.";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}

