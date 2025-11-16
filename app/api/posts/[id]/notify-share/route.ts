import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { broadcastSocialNotification } from "@/lib/realtime/signalr-triggers";

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

    // Get post with owner info
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Gönderi bulunamadı" }, { status: 404 });
    }

    // Don't send notification if user is sharing their own post
    if (post.userId === userId) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // Get actor (current user) info
    const actor = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profileImage: true,
      },
    });

    if (!actor) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Send notification to post owner
    await broadcastSocialNotification(
      post.userId,
      "PostShared",
      {
        type: "post_share",
        postId: post.id,
        postOwnerId: post.userId,
        actor: {
          id: actor.id,
          name: actor.name,
          profileImage: actor.profileImage,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending share notification:", error);
    return NextResponse.json(
      { error: "Bildirim gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

