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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl sm:text-3xl">Keşfet</CardTitle>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Platformdaki en popüler ve ilgi çekici gönderileri keşfedin
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Gönderi veya kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Aramayı temizle"
                >
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
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

      {/* Posts Grid */}
      {posts.length === 0 && !isLoading ? (
        <Card variant="elevated">
          <CardContent className="py-12 text-center">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {searchQuery
                ? `"${searchQuery}" için sonuç bulunamadı.`
                : "Henüz keşfedilecek gönderi yok. Bağlantılarınızın gönderileri burada görünecek."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card variant="elevated">
          <CardContent className="p-2 sm:p-4">
            <ExploreGrid posts={posts} onPostClick={handlePostClick} />
          </CardContent>
        </Card>
      )}

      {/* Loading more */}
      {isLoadingMore && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}

