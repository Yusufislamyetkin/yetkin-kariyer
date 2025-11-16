"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/app/components/social/PostCard";
import { PostCreate } from "@/app/components/social/PostCreate";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

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

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    if (status !== "authenticated" || !session?.user?.id) return;

    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await fetch(
        `/api/posts?type=feed&page=${pageNum}&limit=10`
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
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchPosts(1);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, fetchPosts, router]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  }, [page, hasMore, isLoadingMore, fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Beğeni işlemi başarısız");
      }

      const data = await response.json();

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
  }, []);

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

  const handlePostCreated = useCallback(() => {
    setShowCreateModal(false);
    // Refresh posts from the beginning
    setPage(1);
    setPosts([]);
    setIsLoading(true);
    fetchPosts(1, false);
  }, [fetchPosts]);

  if (status === "loading" || isLoading) {
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
    <div className="animate-fade-in space-y-4 sm:space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl sm:text-3xl">Haber Akışı</CardTitle>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Bağlantılarınızın en son gönderilerini keşfedin
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="gradient"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Gönderi Oluştur
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error */}
      {error && (
        <Card variant="elevated">
          <CardContent className="py-4">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      {posts.length === 0 && !isLoading ? (
        <Card variant="elevated">
          <CardContent className="py-12 text-center">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              Henüz gönderi yok. Bağlantılarınızın gönderileri burada görünecek.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="gradient"
            >
              İlk Gönderinizi Oluşturun
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center space-y-4">
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
            <div className="flex justify-center py-6">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant="outline"
                size="sm"
                className="min-w-[150px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

      {/* Create modal */}
      {showCreateModal && (
        <PostCreate
          onClose={() => setShowCreateModal(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </div>
  );
}

