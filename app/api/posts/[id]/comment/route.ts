import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { broadcastSocialNotification } from "@/lib/realtime/signalr-triggers";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { checkRateLimit, rateLimitKey, Limits } from "@/lib/security/rateLimit";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

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

    // Rate limit: comments
    {
      const key = rateLimitKey(["post:comment", userId]);
      const verdict = checkRateLimit(key, { windowMs: 10 * 60 * 1000, max: 60 });
      if (!verdict.ok) {
        return NextResponse.json(
          { error: "Çok sık yorum denemesi. Lütfen daha sonra tekrar deneyin." },
          { status: 429, headers: { "Retry-After": Math.ceil(verdict.retryAfterMs / 1000).toString() } }
        );
      }
    }

    const body = await request.json();
    const data = createCommentSchema.parse(body);
    const safeContent = sanitizePlainText(data.content, 1000);

    // Check if post exists
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Gönderi bulunamadı" }, { status: 404 });
    }

    // Create comment
    const comment = await db.postComment.create({
      data: {
        postId,
        userId,
        content: safeContent,
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

    // Get updated comment count
    const commentsCount = await db.postComment.count({
      where: {
        postId,
      },
    });

    // Send notification to post owner if not the same user
    if (post.userId !== userId) {
      await broadcastSocialNotification(
        post.userId,
        "PostCommented",
        {
          type: "post_comment",
          postId: post.id,
          postOwnerId: post.userId,
          actor: {
            id: comment.user.id,
            name: comment.user.name,
            profileImage: comment.user.profileImage,
          },
          content: comment.content,
        }
      );
    }

    return NextResponse.json({
      comment: {
        id: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: comment.user,
      },
      commentsCount,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Yorum oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

