"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PostCard } from "@/app/components/social/PostCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { useBadgeNotificationHandler } from "@/hooks/useBadgeNotificationHandler";

interface Post {
  id: string;
  userId: string;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
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
  const [friendSuggestions, setFriendSuggestions] = useState<any[]>([]);
  const [isLoadingFriendSuggestions, setIsLoadingFriendSuggestions] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [friendshipIds, setFriendshipIds] = useState<Map<string, string>>(new Map());
  const observerTarget = useRef<HTMLDivElement>(null);

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

  // Fetch current user profile from DB
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCurrentUserProfile(data.user);
          }
        })
        .catch((err) => console.error("Error fetching user profile:", err));
    }
  }, [session?.user?.id]);

  // Fetch friend suggestions
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoadingFriendSuggestions(true);
      // Fetch friend suggestions
      fetch("/api/users/friend-suggestions")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) {
            setFriendSuggestions(data.users);
          }
        })
        .catch((err) => console.error("Error fetching friend suggestions:", err))
        .finally(() => setIsLoadingFriendSuggestions(false));

      // Fetch existing pending requests to populate state
      fetch("/api/friends")
        .then((res) => res.json())
        .then((data) => {
          if (data.friendships) {
            const pendingRequests = new Set<string>();
            const friendshipIdMap = new Map<string, string>();
            
            data.friendships.forEach((friendship: { 
              id: string; 
              direction: string; 
              status: string; 
              counterpart: { id: string } 
            }) => {
              if (friendship.direction === "outgoing" && friendship.status === "pending") {
                pendingRequests.add(friendship.counterpart.id);
                friendshipIdMap.set(friendship.counterpart.id, friendship.id);
              }
            });
            
            setSentRequests(pendingRequests);
            setFriendshipIds(friendshipIdMap);
          }
        })
        .catch((err) => console.error("Error fetching friendships:", err));
    }
  }, [session?.user?.id]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: userId }),
      });
      if (response.ok) {
        const data = await response.json();
        // Check for badge results and show notification
        if (data.badgeResults) {
          handleBadgeResults(data.badgeResults);
        }
        // Kullanıcıyı listeden kaldırmak yerine, istek gönderildi durumunu işaretle
        setSentRequests((prev) => new Set(prev).add(userId));
        // Friendship ID'yi sakla (iptal için gerekli)
        if (data.friendship?.id) {
          setFriendshipIds((prev) => new Map(prev).set(userId, data.friendship.id));
        }
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleCancelFriendRequest = async (userId: string) => {
    try {
      const friendshipId = friendshipIds.get(userId);
      if (!friendshipId) {
        console.error("Friendship ID not found for user:", userId);
        return;
      }

      const response = await fetch("/api/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendshipId: friendshipId,
          action: "cancel",
        }),
      });

      if (response.ok) {
        // İstek iptal edildi, durumu temizle
        setSentRequests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        setFriendshipIds((prev) => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading && status === "authenticated" && session?.user?.id) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, true, searchQuery);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, page, fetchPosts, searchQuery, status, session]);


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
        <div className="flex gap-8 lg:gap-12">
          {/* Center Column - Feed */}
          <main className="flex-1 max-w-[900px] mx-auto lg:mx-0">
            {/* Error */}
            {error && (
              <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-base text-red-700 dark:text-red-400 shadow-sm">
                {error}
              </div>
            )}

            {/* Posts Feed */}
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

                {/* Infinite scroll trigger */}
                {hasMore && (
                  <div ref={observerTarget} className="flex justify-center py-8">
                    {isLoadingMore && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Yükleniyor...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Right Sidebar - Profile Suggestions */}
          <aside className="hidden xl:block w-[320px] flex-shrink-0">
            <div className="sticky top-6 space-y-5">
              {/* Current User Profile */}
              {session?.user && (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-lg">
                  <Link href="/profile" className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-800">
                      {currentUserProfile?.profileImage ? (
                        <Image
                          src={currentUserProfile.profileImage}
                          alt={currentUserProfile.name || currentUserProfile.email || "User"}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                          {(currentUserProfile?.name || session.user.name || session.user.email || "U")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href="/profile"
                      className="block text-base font-semibold text-gray-900 dark:text-gray-100 hover:underline truncate"
                    >
                      {currentUserProfile?.name || session.user.name || (session.user.email?.split("@")[0] || "User")}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {currentUserProfile?.email || session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="text-sm text-[#0095f6] hover:text-[#1877f2] font-semibold whitespace-nowrap"
                  >
                    Profili Görüntüle
                  </Link>
                </div>
              )}

              {/* Friend Suggestions */}
              <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Bağlantı Önerileri
                  </h3>
                  <Link
                    href="/dashboard/friends"
                    className="text-sm text-[#0095f6] hover:text-[#1877f2] font-semibold hover:underline"
                  >
                    Tümünü Gör
                  </Link>
                </div>
                {isLoadingFriendSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : friendSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {friendSuggestions.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Link
                          href={`/profile/${user.id}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                            {user.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.name || user.email}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-base font-bold">
                                {(user.name || user.email)[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {user.name || user.email.split("@")[0]}
                            </p>
                            {user.mutualConnections > 0 ? (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {user.mutualConnections} ortak bağlantı
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Yeni üye
                              </p>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={() => 
                            sentRequests.has(user.id) 
                              ? handleCancelFriendRequest(user.id)
                              : handleSendFriendRequest(user.id)
                          }
                          className="text-sm text-[#0095f6] hover:text-[#1877f2] font-semibold flex-shrink-0 ml-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          {sentRequests.has(user.id) ? "İstek gönderildi" : "Bağlantı Kur"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Henüz bağlantı önerisi yok
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Links */}
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3 pt-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Hakkında
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Yardım
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Basın
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    API
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    İş Fırsatları
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Gizlilik
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Koşullar
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Konumlar
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    Dil
                  </a>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  © 2025 AI RECRUIT
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

