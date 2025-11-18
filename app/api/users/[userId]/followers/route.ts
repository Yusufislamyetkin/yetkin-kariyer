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

    // Get followers (users who follow this user)
    const friendships = await db.friendship.findMany({
      where: {
        addresseeId: params.userId,
        status: "accepted",
      },
      include: {
        requester: {
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
    const users = friendships.slice(0, limit).map((friendship: { requester: { id: string; name: string | null; email: string; profileImage: string | null } }) => friendship.requester);

    // Get total count
    const totalCount = await db.friendship.count({
      where: {
        addresseeId: params.userId,
        status: "accepted",
      },
    });

    return NextResponse.json({
      users,
      hasMore,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { error: "Takipçiler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

