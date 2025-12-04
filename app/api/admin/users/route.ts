import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "";
    const isBot = searchParams.get("isBot")?.trim();

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isBot === "true") {
      where.isBot = true;
    } else if (isBot === "false") {
      where.isBot = false;
    }

    // Get total count for pagination
    const totalCount = await db.user.count({ where });

    // Get users with pagination
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        isBot: true,
        createdAt: true,
        updatedAt: true,
        botCharacter: {
          select: {
            id: true,
            name: true,
            persona: true,
            expertise: true,
          },
        },
        botConfiguration: {
          select: {
            id: true,
            isActive: true,
            minPostsPerDay: true,
            maxPostsPerDay: true,
            minCommentsPerDay: true,
            maxCommentsPerDay: true,
            minLikesPerDay: true,
            maxLikesPerDay: true,
            activityHours: true,
            lastActivityAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_USERS_GET]", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcılar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

