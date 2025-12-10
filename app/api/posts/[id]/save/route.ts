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

    // Check if post exists
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

    // Check if already saved
    const existingSave = await db.postSave.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await db.postSave.delete({
        where: {
          id: existingSave.id,
        },
      });
    } else {
      // Save
      await db.postSave.create({
        data: {
          postId,
          userId,
        },
      });

      // Send notification to post owner if not the same user
      if (post.userId !== userId) {
        try {
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
              "PostSaved",
              {
                type: "post_save",
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
        } catch (error) {
          // Silently fail - notification is not critical
          console.error("Failed to send save notification:", error);
        }
      }
    }

    return NextResponse.json({
      saved: !existingSave,
    });
  } catch (error) {
    console.error("Error toggling save:", error);
    return NextResponse.json(
      { error: "Kaydetme işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

