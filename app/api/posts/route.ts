import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { checkRateLimit, rateLimitKey, Limits, isDuplicateWithin } from "@/lib/security/rateLimit";

const createPostSchema = z.object({
  content: z.string().max(2200).trim().transform((val) => val === "" ? null : val).nullable().optional(),
  imageUrl: z.preprocess(
    (val) => {
      // Convert empty string, null, or undefined to null
      if (val === "" || val === null || val === undefined) {
        return null;
      }
      return val;
    },
    z.union([z.string().url(), z.null()]).optional()
  ),
}).refine((data) => (data.content && data.content.trim().length > 0) || data.imageUrl, {
  message: "Gönderi için en az içerik veya görsel gerekli",
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "feed"; // feed, explore, profile
    const targetUserId = searchParams.get("userId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let posts: any[] = [];
    let hasMore = false;

    if (type === "feed") {
      // Get posts from users that the current user follows
      const following = await db.friendship.findMany({
        where: {
          requesterId: userId,
          status: "accepted",
        },
        select: {
          addresseeId: true,
        },
      });

      const followingIds = following.map((f: { addresseeId: string }) => f.addresseeId);
      // Include current user's posts in feed
      followingIds.push(userId);

      posts = await db.post.findMany({
        where: {
          userId: {
            in: followingIds,
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
          likes: {
            select: {
              userId: true,
            },
          },
          comments: {
            take: 2,
            orderBy: {
              createdAt: "desc",
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
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit + 1,
      });

      hasMore = posts.length > limit;
      if (hasMore) {
        posts = posts.slice(0, limit);
      }
    } else if (type === "explore") {
      // Get popular posts (most liked in last 7 days + recent posts)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Build where clause
      const whereClause: any = {
        createdAt: {
          gte: sevenDaysAgo,
        },
      };

      // Add search filter if provided
      if (search && search.trim()) {
        whereClause.AND = [
          {
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
          {
            OR: [
              {
                content: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                user: {
                  name: {
                    contains: search.trim(),
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          },
        ];
        // Remove the top-level createdAt since it's now in AND
        delete whereClause.createdAt;
      }

      // Get all posts from last 7 days (with optional search filter)
      const allPosts = await db.post.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          comments: {
            take: 2,
            orderBy: {
              createdAt: "desc",
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
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      // Sort by likes count (descending) and then by creation date (descending)
      posts = allPosts.sort((a: { _count: { likes: number }; createdAt: Date | string }, b: { _count: { likes: number }; createdAt: Date | string }) => {
        const likesDiff = b._count.likes - a._count.likes;
        if (likesDiff !== 0) return likesDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      // Paginate
      hasMore = posts.length > skip + limit;
      posts = posts.slice(skip, skip + limit);
    } else if (type === "profile" && targetUserId) {
      // Get posts from a specific user
      posts = await db.post.findMany({
        where: {
          userId: targetUserId,
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
          likes: {
            select: {
              userId: true,
            },
          },
          comments: {
            take: 2,
            orderBy: {
              createdAt: "desc",
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
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit + 1,
      });

      hasMore = posts.length > limit;
      if (hasMore) {
        posts = posts.slice(0, limit);
      }
    } else if (type === "saved") {
      // Get saved posts
      const savedPosts = await db.postSave.findMany({
        where: {
          userId: userId,
        },
        include: {
          post: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profileImage: true,
                },
              },
              likes: {
                select: {
                  userId: true,
                },
              },
              comments: {
                take: 2,
                orderBy: {
                  createdAt: "desc",
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
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit + 1,
      });

      hasMore = savedPosts.length > limit;
      const savedPostsList = savedPosts.slice(0, hasMore ? limit : savedPosts.length);
      posts = savedPostsList.map((sp: { post: any }) => ({
        ...sp.post,
        isSaved: true, // All saved posts are saved by definition
      }));
    }

    // Get saved posts for current user (only if not already marked as saved)
    const savedPostIds = new Set(
      type !== "saved"
        ? (
            await db.postSave.findMany({
              where: {
                userId: userId,
                postId: {
                  in: posts.map((p: any) => p.id),
                },
              },
              select: {
                postId: true,
              },
            })
          ).map((s: { postId: string }) => s.postId)
        : []
    );

    // Format posts with isLiked and isSaved flags
    const formattedPosts = posts.map((post: any) => {
      const isLiked = post.likes.some((like: any) => like.userId === userId);
      const isSaved = post.isSaved !== undefined ? post.isSaved : savedPostIds.has(post.id);

      return {
        id: post.id,
        userId: post.userId,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: post.user,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked,
        isSaved,
        comments: post.comments,
      };
    });

    return NextResponse.json({
      posts: formattedPosts,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Gönderiler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    // Rate limit: 20 posts / 10 min per user
    {
      const key = rateLimitKey(["post:create", userId]);
      const verdict = checkRateLimit(key, Limits.postCreate);
      if (!verdict.ok) {
        return NextResponse.json(
          { error: "Çok sık paylaşım denemesi. Lütfen daha sonra tekrar deneyin." },
          { status: 429, headers: { "Retry-After": Math.ceil(verdict.retryAfterMs / 1000).toString() } }
        );
      }
    }
    const body = await request.json();
    const data = createPostSchema.parse(body);

    // Sanitize plain text content conservatively
    const safeContent = data.content ? sanitizePlainText(data.content, 2200) : null;

    // Prevent duplicate content spam within 5 minutes
    if (safeContent) {
      const dupKey = rateLimitKey(["post:content", userId]);
      if (isDuplicateWithin(dupKey, safeContent, 5 * 60 * 1000)) {
        return NextResponse.json(
          { error: "Benzer içerik kısa süre içinde tekrar gönderilemez." },
          { status: 429 }
        );
      }
    }

    const post = await db.post.create({
      data: {
        userId,
        content: safeContent || null,
        imageUrl: data.imageUrl || null,
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

    return NextResponse.json({
      id: post.id,
      userId: post.userId,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: false,
      isSaved: false,
      comments: [],
    });
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof z.ZodError) {
      // Check if it's an imageUrl validation error
      const imageUrlError = error.errors.find((e) => e.path.includes("imageUrl"));
      if (imageUrlError) {
        return NextResponse.json(
          { error: "Geçersiz görsel URL formatı. Lütfen geçerli bir görsel URL'i girin." },
          { status: 400 }
        );
      }
      // Check if it's a refine error (content or imageUrl required)
      const refineError = error.errors.find((e) => e.code === "custom");
      if (refineError) {
        return NextResponse.json(
          { error: refineError.message || "Gönderi için en az içerik veya görsel gerekli" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gönderi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

