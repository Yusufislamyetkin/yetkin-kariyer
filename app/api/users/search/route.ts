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

    // Remove duplicates by both id and email (more robust deduplication)
    type UserType = { id: string; name: string | null; email: string; profileImage: string | null };
    
    // First pass: remove duplicates by ID
    const idMap = new Map<string, UserType>();
    users.forEach((user: UserType) => {
      if (!idMap.has(user.id)) {
        idMap.set(user.id, user);
      }
    });
    
    // Second pass: remove duplicates by email (safeguard - emails should be unique in DB)
    const emailMap = new Map<string, UserType>();
    const uniqueUsers: UserType[] = [];
    idMap.forEach((user: UserType) => {
      const normalizedEmail = user.email.toLowerCase().trim();
      if (!emailMap.has(normalizedEmail)) {
        emailMap.set(normalizedEmail, user);
        uniqueUsers.push(user);
      }
      // If email already exists, skip this user (keep the first one encountered)
    });

    const usersWithStatus = uniqueUsers
      .filter((user: UserType) => {
        const friendship = friendshipMap.get(user.id);
        // Exclude blocked users
        return !friendship || friendship.status !== "blocked";
      })
      .map((user: UserType) => {
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

