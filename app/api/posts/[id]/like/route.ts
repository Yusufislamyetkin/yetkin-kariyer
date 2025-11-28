import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { broadcastSocialNotification } from "@/lib/realtime/signalr-triggers";
import { checkSocialInteractionBadges, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const postId = params.id;

    // Check if post exists and get owner info
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Gönderi bulunamadı" }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await db.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    // Initialize badge results
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };

    if (existingLike) {
      // Unlike
      await db.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like
      await db.postLike.create({
        data: {
          postId,
          userId,
        },
      });

      // Sosyal etkileşim rozetlerini kontrol et
      try {
        badgeResults = await checkSocialInteractionBadges({ userId });
        if (badgeResults.totalEarned > 0) {
          console.log(`[POST_LIKE] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${userId}`);
        }
      } catch (error) {
        console.error("Error checking social interaction badges:", error);
      }

      // Send notification to post owner if not the same user
      if (post.userId !== userId) {
        const actor = await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        });

        if (actor) {
          await broadcastSocialNotification(
            post.userId,
            "PostLiked",
            {
              type: "post_like",
              postId: post.id,
              postOwnerId: post.userId,
              actor: {
                id: actor.id,
                name: actor.name,
                profileImage: actor.profileImage,
              },
            }
          );
        }
      }
    }

    // Get updated like count
    const likesCount = await db.postLike.count({
      where: {
        postId,
      },
    });

    return NextResponse.json({
      liked: !existingLike,
      likesCount,
      badgeResults: existingLike ? { newlyEarnedBadges: [], totalEarned: 0 } : badgeResults,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Beğeni işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

