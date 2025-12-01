import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;

    // Check if post exists
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Gönderi bulunamadı" }, { status: 404 });
    }

    // Get all likes with user information
    const likes = await db.postLike.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const users = likes.map((like: any) => ({
      id: like.user.id,
      name: like.user.name,
      email: like.user.email,
      profileImage: like.user.profileImage,
      likedAt: like.createdAt,
    }));

    return NextResponse.json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching post likes:", error);
    return NextResponse.json(
      { error: "Beğenenler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

