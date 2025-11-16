import { NextResponse } from "next/server";
import { FriendshipStatus } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const respondSchema = z.object({
  friendshipId: z.string().cuid(),
  action: z.enum(["accept", "decline", "cancel", "remove"]),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const payload = await request.json();
    const data = respondSchema.parse(payload);

    const friendship = await db.friendship.findUnique({
      where: { id: data.friendshipId },
    });

    if (!friendship) {
      return NextResponse.json({ error: "Arkadaşlık isteği bulunamadı." }, { status: 404 });
    }

    const isRequester = friendship.requesterId === userId;
    const isAddressee = friendship.addresseeId === userId;

    if (!isRequester && !isAddressee) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmuyor." },
        { status: 403 }
      );
    }

    let updatedStatus: FriendshipStatus | null = null;
    let respondedAt: Date | null = friendship.respondedAt;
    let cancelledAt: Date | null = friendship.cancelledAt;

    switch (data.action) {
      case "accept":
        if (!isAddressee) {
          return NextResponse.json(
            { error: "Sadece gelen isteği kabul edebilirsiniz." },
            { status: 403 }
          );
        }
        updatedStatus = FriendshipStatus.accepted;
        respondedAt = new Date();
        cancelledAt = null;
        
        // Send notification to requester (the person who sent the request)
        try {
          const accepter = await db.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          });

          if (accepter) {
            // Use the same notification system but with a different event name
            const SIGNALR_API_URL = process.env.SIGNALR_API_URL || "http://softwareinterview.tryasp.net";
            await fetch(`${SIGNALR_API_URL}/api/chat/notify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: friendship.requesterId, // Notify the person who sent the request
                eventName: "FriendRequestAccepted",
                payload: {
                  type: "friend_request_accepted",
                  accepterId: accepter.id,
                  accepter: {
                    id: accepter.id,
                    name: accepter.name,
                    profileImage: accepter.profileImage,
                  },
                },
              }),
            });
          }
        } catch (error) {
          console.error("[FRIENDS_RESPOND] Error sending acceptance notification:", error);
          // Don't fail the request if notification fails
        }
        break;
      case "decline":
        if (!isAddressee) {
          return NextResponse.json(
            { error: "Sadece gelen isteği reddedebilirsiniz." },
            { status: 403 }
          );
        }
        updatedStatus = FriendshipStatus.declined;
        respondedAt = new Date();
        
        // Send notification to requester (the person who sent the request)
        try {
          const SIGNALR_API_URL = process.env.SIGNALR_API_URL || "http://softwareinterview.tryasp.net";
          await fetch(`${SIGNALR_API_URL}/api/chat/notify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: friendship.requesterId, // Notify the person who sent the request
              eventName: "FriendRequestDeclined",
              payload: {
                type: "friend_request_declined",
                friendshipId: friendship.id,
              },
            }),
          });
        } catch (error) {
          console.error("[FRIENDS_RESPOND] Error sending decline notification:", error);
          // Don't fail the request if notification fails
        }
        break;
      case "cancel":
        if (!isRequester) {
          return NextResponse.json(
            { error: "Sadece gönderdiğiniz isteği iptal edebilirsiniz." },
            { status: 403 }
          );
        }
        updatedStatus = FriendshipStatus.declined;
        cancelledAt = new Date();
        respondedAt = null;
        
        // Send notification to addressee (the person who received the request)
        try {
          const SIGNALR_API_URL = process.env.SIGNALR_API_URL || "http://softwareinterview.tryasp.net";
          await fetch(`${SIGNALR_API_URL}/api/chat/notify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: friendship.addresseeId, // Notify the person who received the request
              eventName: "FriendRequestDeclined",
              payload: {
                type: "friend_request_declined",
                friendshipId: friendship.id,
              },
            }),
          });
        } catch (error) {
          console.error("[FRIENDS_RESPOND] Error sending cancel notification:", error);
          // Don't fail the request if notification fails
        }
        break;
      case "remove":
        if (friendship.status !== FriendshipStatus.accepted) {
          return NextResponse.json(
            { error: "Sadece mevcut arkadaşlıkları silebilirsiniz." },
            { status: 400 }
          );
        }
        
        // Get the other user's ID before deleting
        const otherUserId = isRequester ? friendship.addresseeId : friendship.requesterId;
        
        await db.friendship.delete({
          where: { id: friendship.id },
        });
        
        // Send notification to the other user
        try {
          const SIGNALR_API_URL = process.env.SIGNALR_API_URL || "http://softwareinterview.tryasp.net";
          await fetch(`${SIGNALR_API_URL}/api/chat/notify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: otherUserId, // Notify the other user
              eventName: "FriendRequestDeclined",
              payload: {
                type: "friend_request_declined",
                friendshipId: friendship.id,
              },
            }),
          });
        } catch (error) {
          console.error("[FRIENDS_RESPOND] Error sending remove notification:", error);
          // Don't fail the request if notification fails
        }
        
        return NextResponse.json(
          { message: "Arkadaş listenizden kaldırıldı." },
          { status: 200 }
        );
      default:
        break;
    }

    const updated = await db.friendship.update({
      where: { id: friendship.id },
      data: {
        status: updatedStatus!,
        respondedAt,
        cancelledAt,
      },
    });

    return NextResponse.json({ friendship: updated });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Arkadaşlık isteği güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

