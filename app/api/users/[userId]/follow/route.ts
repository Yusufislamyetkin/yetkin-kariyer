import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkSocialInteractionBadges, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id as string;
    const targetUserId = params.userId;

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Kendinizle bağlantı kuramazsınız" },
        { status: 400 }
      );
    }

    // Check if user exists
    const targetUser = await db.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Check if already following
    const existingFriendship = await db.friendship.findUnique({
      where: {
        requesterId_addresseeId: {
          requesterId: currentUserId,
          addresseeId: targetUserId,
        },
      },
    });

    // Initialize badge results
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        // Unfollow (delete friendship)
        await db.friendship.delete({
          where: {
            id: existingFriendship.id,
          },
        });
      } else if (existingFriendship.status === "pending") {
        // Cancel pending request
        await db.friendship.delete({
          where: {
            id: existingFriendship.id,
          },
        });
      }
      // Unfollow or cancel - no badges
    } else {
      // Follow (create friendship with accepted status directly for one-way follow)
      await db.friendship.create({
        data: {
          requesterId: currentUserId,
          addresseeId: targetUserId,
          status: "accepted", // Direct follow, no pending state
        },
      });

      // Sosyal etkileşim rozetlerini kontrol et (hem requester hem addressee için)
      try {
        const [currentUserBadges, targetUserBadges] = await Promise.all([
          checkSocialInteractionBadges({ userId: currentUserId }),
          checkSocialInteractionBadges({ userId: targetUserId }),
        ]);
        // Return badges for the current user (follower)
        badgeResults = currentUserBadges;
        if (badgeResults.totalEarned > 0) {
          console.log(`[FOLLOW] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${currentUserId}`);
        }
      } catch (error) {
        console.error("Error checking social interaction badges:", error);
      }
    }

    // Get updated followers count
    const followersCount = await db.friendship.count({
      where: {
        addresseeId: targetUserId,
        status: "accepted",
      },
    });

    // Check if currently following after the operation
    const checkFollowing = await db.friendship.findUnique({
      where: {
        requesterId_addresseeId: {
          requesterId: currentUserId,
          addresseeId: targetUserId,
        },
      },
    });

    const following = checkFollowing?.status === "accepted" || false;

    return NextResponse.json({
      following,
      followersCount,
      badgeResults,
    });
  } catch (error) {
    console.error("Error toggling connection:", error);
    return NextResponse.json(
      { error: "Bağlantı işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

