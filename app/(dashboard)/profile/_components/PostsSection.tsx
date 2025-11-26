"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/app/components/social/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { FileText } from "lucide-react";

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

interface PostsSectionProps {
  userId: string;
  compact?: boolean;
}

export function PostsSection({ userId, compact = false }: PostsSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = (session?.user as any)?.id;

  const fetchPosts = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const limit = compact ? 5 : 100;
      const response = await fetch(
        `/api/posts?type=profile&userId=${userId}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Gönderiler yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error: any) {
      setError(error.message || "Gönderiler yüklenirken bir hata oluştu");
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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

  if (!currentUserId) {
    return null;
  }

  return (
    <Card variant="glass" className="relative overflow-hidden tech-card-glow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Paylaştığım Gönderiler
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {posts.length > 0 ? `${posts.length} gönderi` : "Henüz gönderi yok"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Gönderiler yükleniyor...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Henüz gönderi paylaşmadınız
            </p>
          </div>
        ) : (
          <div className={compact ? "space-y-4" : "space-y-6"}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                onCommentClick={handleCommentClick}
                currentUserId={currentUserId}
              />
            ))}
            {compact && posts.length >= 5 && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => router.push(`/social/profile/${userId}`)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Tüm gönderileri gör →
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

