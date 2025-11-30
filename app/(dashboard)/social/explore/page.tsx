"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/app/components/social/PostCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { useBadgeNotificationHandler } from "@/hooks/useBadgeNotificationHandler";

interface Post {
  id: string;
  userId: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments?: Array<{
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
  }>;
}

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { handleBadgeResults } = useBadgeNotificationHandler();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPosts = useCallback(async (pageNum: number, append: boolean = false, search?: string) => {
    if (status !== "authenticated" || !session?.user?.id) return;

    try {
      if (pageNum !== 1) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const searchParam = search && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";
      const response = await fetch(
        `/api/posts?type=explore&page=${pageNum}&limit=10${searchParam}`
      );

      if (!response.ok) {
        throw new Error("Gönderiler yüklenirken bir hata oluştu");
      }

      const data = await response.json();

      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }

      setHasMore(data.hasMore);
    } catch (error: any) {
      setError(error.message || "Gönderiler yüklenirken bir hata oluştu");
      console.error("Error fetching posts:", error);
    } finally {
      if (pageNum !== 1) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [session, status]);

  // Handle search with debounce
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset to page 1 when search changes
    setPage(1);
    setHasMore(true);

    // Debounce search - wait 500ms after user stops typing
    debounceTimerRef.current = setTimeout(() => {
      if (status === "authenticated" && session?.user?.id) {
        fetchPosts(1, false, searchQuery);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, status, session, fetchPosts]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && !searchQuery) {
      fetchPosts(1);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, fetchPosts, router, searchQuery]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true, searchQuery);
    }
  }, [page, hasMore, isLoadingMore, fetchPosts, searchQuery]);

  const handleLike = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Beğeni işlemi başarısız");
      }

      const data = await response.json();

      // Check for badge results and show notification
      if (data.badgeResults) {
        handleBadgeResults(data.badgeResults);
      }

      // Update local state
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: data.liked,
              likesCount: data.likesCount,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  }, [handleBadgeResults]);

  const handleSave = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Kaydetme işlemi başarısız");
      }

      const data = await response.json();

      // Update local state
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isSaved: data.saved,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error saving post:", error);
      throw error;
    }
  }, []);

  const handleCommentClick = useCallback((postId: string) => {
    router.push(`/social/posts/${postId}`);
  }, [router]);


  if (status === "loading" || (isLoading && posts.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Keşfet
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Popüler gönderileri keşfedin
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-base text-red-700 dark:text-red-400 shadow-sm">
            {error}
          </div>
        )}

        {/* Posts Feed */}
        <div className="flex justify-center">
          <div className="w-full max-w-[900px]">
            {posts.length === 0 && !isLoading ? (
              <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-16 text-center shadow-lg">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? `"${searchQuery}" için sonuç bulunamadı.`
                    : "Henüz keşfedilecek gönderi yok."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    onCommentClick={handleCommentClick}
                    currentUserId={session?.user?.id || ""}
                  />
                ))}

                {/* Load more */}
                {hasMore && (
                  <div className="flex justify-center py-8">
                    <Button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px] px-8 py-3 text-base font-semibold rounded-xl border-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        "Daha Fazla Yükle"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

