import { db } from "@/lib/db";

/**
 * Simulate bot login - Update last activity to make bot appear as logged in
 * This doesn't create actual sessions, but updates activity timestamps
 * that can be used to show bots as "active" or "recently logged in"
 */
export async function simulateBotLogin(userId: string) {
  try {
    // Update user's updatedAt to simulate recent activity
    await db.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date(),
      },
    });

    // Update bot configuration last activity
    await db.botConfiguration.updateMany({
      where: { userId },
      data: {
        lastActivityAt: new Date(),
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[BOT_SESSION] Error simulating login:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get bot activity status - Check if bot appears active
 */
export async function getBotActivityStatus(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        botConfiguration: {
          select: {
            lastActivityAt: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isBot) {
      return { isActive: false, lastActivity: null };
    }

    const lastActivity = user.botConfiguration?.lastActivityAt || user.updatedAt;
    const now = new Date();
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    // Consider bot active if activity within last 24 hours
    const isActive = hoursSinceActivity < 24 && user.botConfiguration?.isActive;

    return {
      isActive: !!isActive,
      lastActivity,
      hoursSinceActivity,
    };
  } catch (error: any) {
    console.error("[BOT_SESSION] Error getting status:", error);
    return { isActive: false, lastActivity: null };
  }
}

/**
 * Update bots' presence to keep them online
 * Batch update for performance - updates all groups and bot configuration
 */
export async function updateBotsPresence(userIds: string[], groupId?: string) {
  try {
    if (userIds.length === 0) {
      return { success: true, updated: 0 };
    }

    const now = new Date();

    // Batch update bot configurations
    await db.botConfiguration.updateMany({
      where: {
        userId: { in: userIds },
      },
      data: {
        lastActivityAt: now,
      },
    });

    // If groupId is provided, update only that group's memberships
    if (groupId) {
      await db.chatGroupMembership.updateMany({
        where: {
          userId: { in: userIds },
          groupId,
        },
        data: {
          lastSeenAt: now,
        },
      });
    } else {
      // Update all group memberships for these bots (for all groups they're in)
      await db.chatGroupMembership.updateMany({
        where: {
          userId: { in: userIds },
        },
        data: {
          lastSeenAt: now,
        },
      });
    }

    // Update user updatedAt (optional, for general activity tracking)
    await db.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        updatedAt: now,
      },
    });

    return { success: true, updated: userIds.length };
  } catch (error: any) {
    console.error("[BOT_SESSION] Error updating bots presence:", error);
    return { success: false, error: error.message, updated: 0 };
  }
}

