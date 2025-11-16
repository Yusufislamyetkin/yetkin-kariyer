import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Get following (users that this user follows)
    const friendships = await db.friendship.findMany({
      where: {
        requesterId: params.userId,
        status: "accepted",
      },
      include: {
        addressee: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
      skip,
      take: limit + 1,
    });

    const hasMore = friendships.length > limit;
    const users = friendships.slice(0, limit).map((friendship) => friendship.addressee);

    // Get total count
    const totalCount = await db.friendship.count({
      where: {
        requesterId: params.userId,
        status: "accepted",
      },
    });

    return NextResponse.json({
      users,
      hasMore,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Takip edilenler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

