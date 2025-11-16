import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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
    } else {
      // Follow (create friendship with accepted status directly for one-way follow)
      await db.friendship.create({
        data: {
          requesterId: currentUserId,
          addresseeId: targetUserId,
          status: "accepted", // Direct follow, no pending state
        },
      });
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
    });
  } catch (error) {
    console.error("Error toggling connection:", error);
    return NextResponse.json(
      { error: "Bağlantı işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

