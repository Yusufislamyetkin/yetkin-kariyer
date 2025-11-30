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

    // Get users that current user is already friends with or has pending requests
    const existingFriendships = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUserId },
          { addresseeId: currentUserId },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    const excludeIds = new Set([
      currentUserId,
      ...existingFriendships.map((f: { requesterId: string; addresseeId: string }) =>
        f.requesterId === currentUserId ? f.addresseeId : f.requesterId
      ),
    ]);

    // First, try to get users with posts, not already friends, and not current user
    let suggestedUsers = await db.user.findMany({
      where: {
        id: {
          notIn: Array.from(excludeIds),
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
      take: 8,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    });

    // If no users with posts found, get any users (excluding current user and existing friends)
    if (suggestedUsers.length === 0) {
      // Get total count of available users
      const totalAvailableUsers = await db.user.count({
        where: {
          id: {
            notIn: Array.from(excludeIds),
          },
        },
      });

      if (totalAvailableUsers > 0) {
        // Get more users than needed, then shuffle and take random ones
        const takeCount = Math.min(20, totalAvailableUsers); // Get up to 20 users
        let allAvailableUsers = await db.user.findMany({
          where: {
            id: {
              notIn: Array.from(excludeIds),
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
          take: takeCount,
          orderBy: {
            createdAt: "desc",
          },
        });

        // Shuffle the array for better randomness
        allAvailableUsers = allAvailableUsers.sort(() => Math.random() - 0.5);
        
        // Take first 8 random users
        suggestedUsers = allAvailableUsers.slice(0, 8);
      }
    }

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
    console.error("[FRIEND_SUGGESTIONS]", error);
    return NextResponse.json(
      { error: "Önerilen kullanıcılar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

