import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calculateLevelFromPoints } from "@/lib/services/gamification/level";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Get users that current user is already following
    const following = await db.friendship.findMany({
      where: {
        requesterId: currentUserId,
        status: "accepted",
      },
      select: {
        addresseeId: true,
      },
    });

    const followingIds = following.map((f: { addresseeId: string }) => f.addresseeId);
    const excludeIds = [...followingIds, currentUserId];

    // Get suggested users (users with posts, not already followed)
    const suggestedUsers = await db.user.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
        posts: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      take: 10,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    });

    // Get mutual connections count and level for each suggested user
    const usersWithMutual = await Promise.all(
      suggestedUsers.map(async (user: { id: string; name: string | null; email: string; profileImage: string | null; _count: { posts: number } }) => {
        // Get users that both current user and suggested user follow
        const currentUserFollowing = await db.friendship.findMany({
          where: {
            requesterId: currentUserId,
            status: "accepted",
          },
          select: {
            addresseeId: true,
          },
        });

        const suggestedUserFollowing = await db.friendship.findMany({
          where: {
            requesterId: user.id,
            status: "accepted",
          },
          select: {
            addresseeId: true,
          },
        });

        const currentUserFollowingIds = new Set(
          currentUserFollowing.map((f: { addresseeId: string }) => f.addresseeId)
        );
        const mutualCount = suggestedUserFollowing.filter((f: { addresseeId: string }) =>
          currentUserFollowingIds.has(f.addresseeId)
        ).length;

        // Get user badges to calculate level
        const userBadges = await db.userBadge.findMany({
          where: { userId: user.id },
          include: { badge: true },
        });
        const totalPoints = userBadges.reduce((sum: number, userBadge: { badge: { points: number | null } }) => sum + (userBadge.badge.points || 0), 0);
        const level = calculateLevelFromPoints(totalPoints);

        return {
          ...user,
          mutualConnections: mutualCount,
          level,
        };
      })
    );

    return NextResponse.json({
      users: usersWithMutual,
    });
  } catch (error) {
    console.error("[SUGGESTED_USERS]", error);
    return NextResponse.json(
      { error: "Önerilen kullanıcılar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

