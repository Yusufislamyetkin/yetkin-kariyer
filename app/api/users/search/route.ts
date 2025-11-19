import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Arama sorgusu en az 2 karakter olmalıdır" }, { status: 400 });
    }

    const currentUserId = session.user.id as string;

    // Search users by name or email, excluding current user
    const users = await db.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
      take: 20,
      orderBy: {
        name: "asc",
      },
    });

    // Check existing friendships to exclude blocked users and show friendship status
    const friendships = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: { in: users.map((u: { id: string }) => u.id) } },
          { addresseeId: currentUserId, requesterId: { in: users.map((u: { id: string }) => u.id) } },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
        status: true,
      },
    });

    const friendshipMap = new Map<string, { status: string; isRequester: boolean }>();
    friendships.forEach((friendship: { requesterId: string; addresseeId: string; status: string }) => {
      const counterpartId = friendship.requesterId === currentUserId ? friendship.addresseeId : friendship.requesterId;
      friendshipMap.set(counterpartId, {
        status: friendship.status,
        isRequester: friendship.requesterId === currentUserId,
      });
    });

    const usersWithStatus = users
      .filter((user: { id: string; name: string | null; email: string; profileImage: string | null }) => {
        const friendship = friendshipMap.get(user.id);
        // Exclude blocked users
        return !friendship || friendship.status !== "blocked";
      })
      .map((user: { id: string; name: string | null; email: string; profileImage: string | null }) => {
        const friendship = friendshipMap.get(user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          friendshipStatus: friendship?.status ?? null,
          isRequester: friendship?.isRequester ?? false,
        };
      });

    return NextResponse.json({ users: usersWithStatus });
  } catch (error) {
    console.error("[USERS_SEARCH_GET]", error);
    return NextResponse.json({ error: "Kullanıcı arama sırasında bir hata oluştu" }, { status: 500 });
  }
}

