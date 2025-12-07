import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { checkRateLimit, rateLimitKey, Limits } from "@/lib/security/rateLimit";
import { checkSocialInteractionBadges, type BadgeCheckResult } from "@/app/api/badges/check/badge-service";
import { getUserIdFromSession } from "@/lib/auth-utils";
import { generateBadgeSharePost } from "@/lib/bot/ai-service";
import { shareBadgePost } from "@/lib/bot/bot-activity-service";

const shareBadgeSchema = z.object({
  badgeId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 badge shares / 10 min per user
    {
      const key = rateLimitKey(["post:share-badge", userId]);
      const verdict = checkRateLimit(key, { max: 10, windowMs: 10 * 60 * 1000 });
      if (!verdict.ok) {
        return NextResponse.json(
          { error: "Çok sık rozet paylaşım denemesi. Lütfen daha sonra tekrar deneyin." },
          { status: 429, headers: { "Retry-After": Math.ceil(verdict.retryAfterMs / 1000).toString() } }
        );
      }
    }

    const body = await request.json();
    const data = shareBadgeSchema.parse(body);

    // Get badge and verify user has earned it
    const userBadge = await db.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: data.badgeId,
        },
      },
      include: {
        badge: true,
      },
    });

    if (!userBadge || !userBadge.badge) {
      return NextResponse.json(
        { error: "Rozet bulunamadı veya bu rozete sahip değilsiniz" },
        { status: 404 }
      );
    }

    // Get user info to check if bot
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        botCharacter: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Get base URL for links
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const baseUrl = origin;

    // Generate badge share post
    const botCharacter = user.botCharacter ? {
      name: user.botCharacter.name,
      persona: user.botCharacter.persona,
      systemPrompt: user.botCharacter.systemPrompt,
      expertise: user.botCharacter.expertise || [],
    } : undefined;

    const badge = {
      id: userBadge.badge.id,
      name: userBadge.badge.name,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon,
      color: userBadge.badge.color,
      category: userBadge.badge.category,
      rarity: userBadge.badge.rarity,
    };

    const postContent = await generateBadgeSharePost(
      botCharacter || {
        name: user.name || "Kullanıcı",
        persona: "Aktif bir topluluk üyesi",
        systemPrompt: "Sen aktif bir topluluk üyesisin.",
        expertise: [],
      },
      badge,
      userId,
      baseUrl
    );

    // Sanitize content
    const safeContent = sanitizePlainText(postContent, 2200);

    // Create post
    const post = await db.post.create({
      data: {
        userId,
        content: safeContent,
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
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Gamification: Record event and apply rules
    try {
      const { recordEvent } = await import("@/lib/services/gamification/antiAbuse");
      const { applyRules } = await import("@/lib/services/gamification/rules");
      
      const event = await recordEvent({
        userId,
        type: "post_created",
        payload: { postId: post.id },
      });
      await applyRules({ userId, type: "post_created", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn(`[BADGE_SHARE_POST] Gamification failed:`, e);
    }

    // Check social interaction badges
    let badgeResults: BadgeCheckResult = {
      newlyEarnedBadges: [],
      totalEarned: 0,
    };
    try {
      badgeResults = await checkSocialInteractionBadges({ userId });
      if (badgeResults.totalEarned > 0) {
        console.log(`[BADGE_SHARE_POST] User ${userId} earned ${badgeResults.totalEarned} badges`);
      }
    } catch (error) {
      console.error("Error checking social interaction badges:", error);
    }

    return NextResponse.json({
      id: post.id,
      userId: post.userId,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: false,
      badgeResults,
      isSaved: false,
      comments: [],
    });
  } catch (error: any) {
    console.error("Error sharing badge post:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Rozet paylaşımı sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

