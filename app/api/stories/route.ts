import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { optimizeImage } from "@/lib/image-optimization";
import { checkSocialInteractionBadges, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// Create story
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob yapılandırması eksik" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya eklenmedi" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'ı aşamaz" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG ve WebP formatları desteklenir" },
        { status: 400 }
      );
    }

    // Convert file to buffer and optimize
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const optimized = await optimizeImage(buffer, "webp");

    // Upload to blob storage
    const timestamp = Date.now();
    const filePath = `stories/${session.user.id}/${timestamp}.webp`;

    const blob = await put(filePath, optimized.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "image/webp",
    });

    // Create story with 24 hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = await db.story.create({
      data: {
        userId: session.user.id,
        imageUrl: blob.url,
        expiresAt,
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
        views: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Sosyal etkileşim rozetlerini kontrol et
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };
    try {
      badgeResults = await checkSocialInteractionBadges({ userId: session.user.id });
      if (badgeResults.totalEarned > 0) {
        console.log(`[STORY_CREATE] Kullanıcı ${badgeResults.totalEarned} rozet kazandı. userId: ${session.user.id}`);
      }
    } catch (error) {
      console.error("Error checking social interaction badges:", error);
    }

    return NextResponse.json({
      story: {
        id: story.id,
        imageUrl: story.imageUrl,
        videoUrl: story.videoUrl,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
        user: story.user,
        isViewed: story.views.length > 0,
      },
      badgeResults,
    });
  } catch (error) {
    console.error("[STORY_CREATE]", error);
    return NextResponse.json(
      { error: "Story oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Get stories for feed
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Get user's friends to show their stories
    const friendships = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUserId, status: "accepted" },
          { addresseeId: currentUserId, status: "accepted" },
        ],
      },
    });

    const friendIds = friendships.map((f: { requesterId: string; addresseeId: string }) =>
      f.requesterId === currentUserId ? f.addresseeId : f.requesterId
    );

    // Include current user's own stories
    const userIds = [...new Set([...friendIds, currentUserId])];

    // Get active stories (not expired)
    const stories = await db.story.findMany({
      where: {
        userId: userId ? userId : { in: userIds },
        expiresAt: {
          gt: new Date(),
        },
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
        views: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group stories by user
    const storiesByUser = stories.reduce((acc: Record<string, { user: any; stories: any[] }>, story: any) => {
      if (!acc[story.userId]) {
        acc[story.userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[story.userId].stories.push({
        id: story.id,
        imageUrl: story.imageUrl,
        videoUrl: story.videoUrl,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
        isViewed: story.views.length > 0,
      });
      return acc;
    }, {});

    return NextResponse.json({
      stories: Object.values(storiesByUser),
    });
  } catch (error) {
    console.error("[STORY_LIST]", error);
    return NextResponse.json(
      { error: "Story'ler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

