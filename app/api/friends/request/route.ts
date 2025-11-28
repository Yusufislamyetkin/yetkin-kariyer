import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { FriendshipStatus } from "@prisma/client";
import { broadcastFriendRequestNotification } from "@/lib/realtime/signalr-triggers";
import { checkSocialInteractionBadges, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";

const requestSchema = z.object({
  targetUserId: z
    .string({
      required_error: "Geçersiz kullanıcı.",
      invalid_type_error: "Geçersiz kullanıcı.",
    })
    .trim()
    .min(1, "Geçersiz kullanıcı."),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const payload = await request.json();
    const data = requestSchema.parse(payload);

    if (data.targetUserId === userId) {
      return NextResponse.json(
        { error: "Kendinize arkadaşlık isteği gönderemezsiniz." },
        { status: 400 }
      );
    }

    const targetUser = await db.user.findUnique({
      where: { id: data.targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const existing = await db.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: data.targetUserId },
          { requesterId: data.targetUserId, addresseeId: userId },
        ],
      },
    });

    if (existing) {
      if (existing.status === FriendshipStatus.blocked) {
        return NextResponse.json(
          { error: "Bu kullanıcı ile arkadaşlık isteği gönderemezsiniz." },
          { status: 403 }
        );
      }

      if (existing.status === FriendshipStatus.accepted) {
        return NextResponse.json(
          { friendship: existing, message: "Zaten arkadaşsınız." },
          { status: 200 }
        );
      }

      if (existing.status === FriendshipStatus.pending) {
        if (existing.requesterId === data.targetUserId) {
          const updated = await db.friendship.update({
            where: { id: existing.id },
            data: {
              status: FriendshipStatus.accepted,
              respondedAt: new Date(),
            },
          });

          // Sosyal etkileşim rozetlerini kontrol et (hem requester hem addressee için)
          let badgeResults: BadgeCheckResult = {
            newlyEarnedBadges: [],
            totalEarned: 0,
          };
          try {
            const [requesterBadges, addresseeBadges] = await Promise.all([
              checkSocialInteractionBadges({ userId: existing.requesterId }),
              checkSocialInteractionBadges({ userId: userId }),
            ]);
            // Return badges for the current user (addressee)
            badgeResults = addresseeBadges;
            if (badgeResults.totalEarned > 0) {
              console.log(`[FRIEND_REQUEST] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${userId}`);
            }
          } catch (error) {
            console.error("Error checking social interaction badges:", error);
          }

          return NextResponse.json(
            { friendship: updated, message: "Arkadaşlık isteği kabul edildi.", badgeResults },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: "Zaten bekleyen bir isteğiniz var." },
          { status: 409 }
        );
      }

      const updated = await db.friendship.update({
        where: { id: existing.id },
        data: {
          requesterId: userId,
          addresseeId: data.targetUserId,
          status: FriendshipStatus.pending,
          requestedAt: new Date(),
          respondedAt: null,
          cancelledAt: null,
          blockedById: null,
        },
      });

      // Send notification to target user
      try {
        const requester = await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        });

        if (requester) {
          await broadcastFriendRequestNotification(data.targetUserId, {
            type: "friend_request",
            requesterId: userId,
            requester: {
              id: requester.id,
              name: requester.name,
              profileImage: requester.profileImage,
            },
          });
        }
      } catch (error) {
        // Silently fail - notification is not critical
        console.error("Failed to send friend request notification:", error);
      }

      return NextResponse.json(
        { friendship: updated, message: "Arkadaşlık isteği yeniden gönderildi." },
        { status: 200 }
      );
    }

    const friendship = await db.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: data.targetUserId,
        status: FriendshipStatus.pending,
      },
    });

    // Send notification to target user
    try {
      const requester = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      });

      if (requester) {
        await broadcastFriendRequestNotification(data.targetUserId, {
          type: "friend_request",
          requesterId: userId,
          requester: {
            id: requester.id,
            name: requester.name,
            profileImage: requester.profileImage,
          },
        });
      }
    } catch (error) {
      // Silently fail - notification is not critical
      console.error("Failed to send friend request notification:", error);
    }

    return NextResponse.json(
      { friendship, message: "Arkadaşlık isteği gönderildi." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending friend request:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Arkadaşlık isteği gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

