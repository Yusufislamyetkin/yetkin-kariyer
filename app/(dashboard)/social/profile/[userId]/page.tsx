"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProfileGrid } from "@/app/components/social/ProfileGrid";
import { FollowButton } from "@/app/components/social/FollowButton";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
}

interface Post {
  id: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
}

export default function SocialProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user profile
      const profileResponse = await fetch(`/api/profile/${userId}`);
      if (!profileResponse.ok) {
        throw new Error("Kullanıcı bulunamadı");
      }
      const profileData = await profileResponse.json();
      setUser(profileData.user);

      // Fetch posts
      const postsResponse = await fetch(
        `/api/posts?type=profile&userId=${userId}&limit=100`
      );
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(
          postsData.posts.map((post: any) => ({
            id: post.id,
            imageUrl: post.imageUrl,
            likesCount: post.likesCount,
            commentsCount: post.commentsCount,
          }))
        );
        setPostsCount(postsData.posts.length);
      }

      // Fetch followers count and check if following
      const followersResponse = await fetch(`/api/users/${userId}/followers?limit=1`);
      if (followersResponse.ok) {
        const followersData = await followersResponse.json();
        setFollowersCount(followersData.totalCount || 0);
        // Check if current user is following this user
        if (session?.user?.id && session?.user?.id !== userId) {
          const allFollowersResponse = await fetch(`/api/users/${userId}/followers?limit=1000`);
          if (allFollowersResponse.ok) {
            const allFollowersData = await allFollowersResponse.json();
            const isCurrentlyFollowing = allFollowersData.users?.some(
              (u: User) => u.id === session?.user?.id
            );
            setIsFollowing(isCurrentlyFollowing);
          }
        }
      }

      // Fetch following count
      const followingResponse = await fetch(`/api/users/${userId}/following?limit=1`);
      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        setFollowingCount(followingData.totalCount || 0);
      }
    } catch (error: any) {
      setError(error.message || "Profil yüklenirken bir hata oluştu");
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, session, status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProfile();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, fetchProfile, router]);

  const handleFollow = useCallback(
    async (targetUserId: string): Promise<{ following: boolean; followersCount: number }> => {
      if (isLoadingFollow || !session?.user?.id) {
        return { following: isFollowing, followersCount };
      }
      setIsLoadingFollow(true);

      try {
        const response = await fetch(`/api/users/${targetUserId}/follow`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Bağlantı işlemi başarısız");
        }

        const data = await response.json();
        setIsFollowing(data.following);
        setFollowersCount(data.followersCount);
        return { following: data.following, followersCount: data.followersCount };
      } catch (error) {
        console.error("Error toggling follow:", error);
        return { following: isFollowing, followersCount };
      } finally {
        setIsLoadingFollow(false);
      }
    },
    [session, isLoadingFollow, isFollowing, followersCount]
  );

  const handlePostClick = useCallback(
    (postId: string) => {
      router.push(`/social/posts/${postId}`);
    },
    [router]
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-4">{error || "Kullanıcı bulunamadı"}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-[#0a66c2] dark:text-[#70b5f9] hover:opacity-70 transition-opacity"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        {/* Profile Header - LinkedIn style */}
        <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-4 overflow-hidden">
          {/* Cover Image Placeholder */}
          <div className="h-32 bg-gradient-to-r from-[#0a66c2] to-[#0073b1]"></div>
          
          <div className="px-6 pb-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white dark:bg-[#1d1d1d] border-4 border-white dark:border-[#1d1d1d] flex items-center justify-center shadow-lg">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.name || user.email}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0a66c2] to-[#0073b1] flex items-center justify-center text-white text-4xl font-semibold">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-20 sm:pt-0">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {user.name || user.email.split("@")[0]}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {user.name ? user.email : "Profesyonel" /* Placeholder headline */}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{followersCount} bağlantı</span>
                    <span>·</span>
                    <span>{postsCount} gönderi</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isOwnProfile && (
                    <FollowButton
                      userId={userId}
                      isFollowing={isFollowing}
                      onFollow={handleFollow}
                    />
                  )}
                  {isOwnProfile && (
                    <Link
                      href="/profile"
                      className="px-4 py-1.5 text-sm font-semibold border border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10 dark:border-[#70b5f9] dark:text-[#70b5f9] dark:hover:bg-[#70b5f9]/10 rounded-full transition-colors"
                    >
                      Profili Düzenle
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Style Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* About Section */}
            <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Hakkında</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.name ? `${user.name} hakkında bilgi burada görünecek.` : "Profil özeti burada görünecek."}
              </p>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Deneyim</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                İş deneyimi bilgileri burada görünecek.
              </p>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Eğitim</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Eğitim bilgileri burada görünecek.
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Beceriler</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Beceri bilgileri burada görünecek.
              </p>
            </div>

            {/* Posts Section */}
            <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gönderiler</h2>
              </div>
              <ProfileGrid posts={posts} onPostClick={handlePostClick} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Connections */}
            <div className="bg-white dark:bg-[#1d1d1d] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Bağlantılar</h3>
              <button
                onClick={() => router.push(`/social/profile/${userId}/followers`)}
                className="text-sm text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
              >
                {followersCount} bağlantı görüntüle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

