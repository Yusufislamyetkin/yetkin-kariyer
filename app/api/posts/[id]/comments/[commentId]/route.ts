import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const commentId = params.commentId;

    // Check if comment exists
    const comment = await db.postComment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Yorum bulunamadı" }, { status: 404 });
    }

    // Check if user owns the comment
    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "Bu yorumu silme yetkiniz yok" },
        { status: 403 }
      );
    }

    // Delete comment
    await db.postComment.delete({
      where: {
        id: commentId,
      },
    });

    // Get updated comment count
    const commentsCount = await db.postComment.count({
      where: {
        postId: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      commentsCount,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Yorum silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

