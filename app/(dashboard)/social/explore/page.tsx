"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExploreGrid } from "@/app/components/social/ExploreGrid";
import { Loader2, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

interface Post {
  id: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
}

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const searchParam = search && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";
      const response = await fetch(
        `/api/posts?type=explore&page=${pageNum}&limit=21${searchParam}`
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

  const handlePostClick = useCallback((postId: string) => {
    router.push(`/social/posts/${postId}`);
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !isLoadingMore &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore, isLoadingMore, hasMore]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-[#0095f6]" />
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

        {/* Posts Grid */}
        {posts.length === 0 && !isLoading ? (
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-16 text-center shadow-lg">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {searchQuery
                ? `"${searchQuery}" için sonuç bulunamadı.`
                : "Henüz keşfedilecek gönderi yok."}
            </p>
          </div>
        ) : (
          <ExploreGrid posts={posts} onPostClick={handlePostClick} />
        )}

        {/* Loading more */}
        {isLoadingMore && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#0095f6]" />
              <span className="text-base text-gray-600 dark:text-gray-400 font-medium">
                Daha fazla yükleniyor...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

