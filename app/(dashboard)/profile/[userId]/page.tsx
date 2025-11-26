/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Award,
  Trophy,
  Mail,
  Shield,
  Clock,
  Star,
  TrendingUp,
  Layers,
  Activity,
  Users,
  Target,
  Copy,
  Check,
  UserPlus,
  XCircle,
  Grid3x3,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { BadgeCollection } from "@/app/components/badges/BadgeDisplay";
import { BadgeOverlay } from "@/app/components/badges/BadgeOverlay";
import { RankingDisplay } from "@/app/components/competition/RankingDisplay";
import { Button } from "@/app/components/ui/Button";
import { ProfileGrid } from "@/app/components/social/ProfileGrid";
import Image from "next/image";
import Link from "next/link";

interface PublicProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    role: string;
    createdAt: string;
  };
  stats: {
    badgeCount: number;
    completedLessons: number;
    quizAttempts: number;
    testAttempts: number;
    liveCodingAttempts: number;
    bugFixAttempts: number;
    hackatonAttempts: number;
    averageScores: {
      quiz: number;
      test: number;
      liveCoding: number;
      bugFix: number;
      hackaton: number;
    };
  };
  expertises: string[];
  recentAchievements: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    earnedAt: string;
  }>;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  earnedAt?: string;
  isDisplayed?: boolean;
}

interface Comment {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  employer: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  badge?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
}

interface LeaderboardEntry {
  rank: number;
  compositeScore: number;
  metrics: {
    topicCompletion: number;
    test: number;
    liveCoding: number;
    bugFix: number;
    hackaton: number;
  };
}

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [displayedBadges, setDisplayedBadges] = useState<Badge[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [dailyRank, setDailyRank] = useState<LeaderboardEntry | null>(null);
  const [weeklyRank, setWeeklyRank] = useState<LeaderboardEntry | null>(null);
  const [monthlyRank, setMonthlyRank] = useState<LeaderboardEntry | null>(null);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [categoryRankings, setCategoryRankings] = useState<Record<string, number>>({});
  const [idCopied, setIdCopied] = useState(false);
  const [friendRequestState, setFriendRequestState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
  }>({
    status: "idle",
    message: null,
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "stats">("posts");

  useEffect(() => {
    const userId = params?.userId;
    if (!userId) {
      setError("Kullanıcı bilgisine erişilemedi.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          profileRes,
          badgesRes,
          commentsRes,
          dailyRes,
          weeklyRes,
          monthlyRes,
          postsRes,
          followersRes,
          followingRes,
        ] = await Promise.all([
          fetch(`/api/profile/${userId}`),
          fetch(`/api/profile/${userId}/badges`),
          fetch(`/api/profile/${userId}/comments`),
          fetch(`/api/competition/leaderboard?period=daily&limit=1&userId=${userId}`),
          fetch(`/api/competition/leaderboard?period=weekly&limit=1&userId=${userId}`),
          fetch(`/api/competition/leaderboard?period=monthly&limit=1&userId=${userId}`),
          fetch(`/api/posts?type=profile&userId=${userId}&limit=100`).catch(() => null),
          fetch(`/api/users/${userId}/followers?limit=1`).catch(() => null),
          fetch(`/api/users/${userId}/following?limit=1`).catch(() => null),
          fetch(`/api/friends`).catch(() => null),
        ]);

        if (!profileRes.ok) {
          if (profileRes.status === 404) {
            setError("Kullanıcı bulunamadı.");
            setLoading(false);
            return;
          }
          throw new Error("Profil bilgileri alınamadı");
        }

        const profileData: PublicProfileResponse = await profileRes.json();
        setProfile(profileData);

        if (badgesRes.ok) {
          const badgePayload = await badgesRes.json();
          setBadges(badgePayload.badges || []);
          setDisplayedBadges(badgePayload.displayedBadges || []);
        }

        if (commentsRes.ok) {
          const commentPayload = await commentsRes.json();
          setComments(commentPayload.comments || []);
        }

        if (dailyRes.ok) {
          const dailyData = await dailyRes.json();
          if (dailyData.userRank) {
            setDailyRank({
              rank: dailyData.userRank.rank,
              compositeScore: dailyData.userRank.compositeScore,
              metrics: dailyData.userRank.metrics,
            });
          }
        }

        if (weeklyRes.ok) {
          const weeklyData = await weeklyRes.json();
          if (weeklyData.userRank) {
            setWeeklyRank({
              rank: weeklyData.userRank.rank,
              compositeScore: weeklyData.userRank.compositeScore,
              metrics: weeklyData.userRank.metrics,
            });
          }
        }

        if (monthlyRes.ok) {
          const monthlyData = await monthlyRes.json();
          if (monthlyData.userRank) {
            setMonthlyRank({
              rank: monthlyData.userRank.rank,
              compositeScore: monthlyData.userRank.compositeScore,
              metrics: monthlyData.userRank.metrics,
            });
          }
        }

        // Fetch connections count - use followers count as connections
        // Note: This should ideally query accepted friendships, but using followers for now
        setConnectionsCount(followersCount);

        // Fetch category-specific rankings
        try {
          const categoryRankPromises = [
            fetch(`/api/competition/leaderboard/test?period=monthly&userId=${userId}`).catch(() => null),
            fetch(`/api/competition/leaderboard/live-coding?period=monthly&userId=${userId}`).catch(() => null),
            fetch(`/api/competition/leaderboard/bug-fix?period=monthly&userId=${userId}`).catch(() => null),
            fetch(`/api/competition/leaderboard/hackaton?period=monthly&userId=${userId}`).catch(() => null),
          ];

          const categoryRankResults = await Promise.all(categoryRankPromises);
          const rankings: Record<string, number> = {};
          
          for (let i = 0; i < categoryRankResults.length; i++) {
            const res = categoryRankResults[i];
            if (res?.ok) {
              try {
                const data = await res.json();
                if (data.userRank) {
                  const category = i === 0 ? "test" : i === 1 ? "liveCoding" : i === 2 ? "bugFix" : "hackaton";
                  rankings[category] = data.userRank.rank;
                }
              } catch (e) {
                // Ignore errors
              }
            }
          }
          
          setCategoryRankings(rankings);
        } catch (e) {
          // Ignore ranking errors
        }

        // Fetch posts
        if (postsRes?.ok) {
          const postsData = await postsRes.json();
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

        // Fetch followers count
        if (followersRes?.ok) {
          const followersData = await followersRes.json();
          setFollowersCount(followersData.totalCount || 0);
        }

        // Fetch following count
        if (followingRes?.ok) {
          const followingData = await followingRes.json();
          setFollowingCount(followingData.totalCount || 0);
        }

        // Check if current user is following this user
        if (sessionStatus === "authenticated" && session?.user?.id && session.user.id !== userId) {
          const followCheckResponse = await fetch(`/api/users/${userId}/followers?limit=1000`).catch(() => null);
          if (followCheckResponse?.ok) {
            const followCheckData = await followCheckResponse.json();
            const isCurrentlyFollowing = followCheckData.users?.some(
              (u: any) => u.id === session?.user?.id
            );
            setIsFollowing(isCurrentlyFollowing || false);
          }
        }
      } catch (err) {
        console.error("Error loading public profile:", err);
        setError("Profil verileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [params?.userId, router]);

  useEffect(() => {
    setFriendRequestState({
      status: "idle",
      message: null,
    });
  }, [params?.userId]);

  const handleCopyUserId = () => {
    if (typeof navigator === "undefined" || !profile?.user?.id) {
      return;
    }

    navigator.clipboard
      .writeText(profile.user.id)
      .then(() => {
        setIdCopied(true);
        window.setTimeout(() => setIdCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy user id:", err);
      });
  };

  const handleSendFriendRequest = async () => {
    if (!profile?.user?.id) {
      return;
    }

    if (sessionStatus !== "authenticated") {
      const fallbackPath = `/profile/${profile.user.id}`;
      const callbackUrl =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : fallbackPath;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    setFriendRequestState({
      status: "loading",
      message: null,
    });

    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: profile.user.id }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setFriendRequestState({
            status: "success",
            message: data?.error || "Zaten bekleyen bir isteğiniz var.",
          });
          return;
        }

        if (response.status === 401) {
          const message = data?.error || "Giriş yapmalısınız.";
          setFriendRequestState({
            status: "error",
            message,
          });
          const fallbackRedirect = `/profile/${profile.user.id}`;
          const redirectUrl =
            typeof window !== "undefined"
              ? `${window.location.pathname}${window.location.search}`
              : fallbackRedirect;
          router.push(`/login?callbackUrl=${encodeURIComponent(redirectUrl)}`);
          return;
        }

        throw new Error(data?.error || "Arkadaşlık isteği gönderilemedi.");
      }

      setFriendRequestState({
        status: "success",
        message: data?.message || "Arkadaşlık isteği gönderildi.",
      });
    } catch (err) {
      setFriendRequestState({
        status: "error",
        message:
          (err as Error).message ||
          "Arkadaşlık isteği gönderilirken bir hata oluştu.",
      });
    }
  };


  const handlePostClick = (postId: string) => {
    router.push(`/social/posts/${postId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const earnedBadgeIds = new Set(badges.map((badge) => badge.id));
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;
  const isOwnProfile = currentUserId === profile.user.id;
  const isFriendButtonDisabled =
    friendRequestState.status === "loading" ||
    friendRequestState.status === "success" ||
    sessionStatus === "loading";
  const friendButtonLabel =
    sessionStatus !== "authenticated"
      ? "Giriş yap ve arkadaşlık isteği gönder"
      : friendRequestState.status === "success"
      ? "İstek gönderildi"
      : "Arkadaşlık isteği gönder";

  const infoTiles = [
    {
      label: "Rozet Sayısı",
      value: profile.stats.badgeCount,
      icon: Award,
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "Tamamlanan Ders",
      value: profile.stats.completedLessons || 0,
      icon: Layers,
      color: "from-green-400 to-emerald-500",
    },
    {
      label: "Toplam Test",
      value: profile.stats.quizAttempts,
      icon: Target,
      color: "from-blue-400 to-indigo-500",
    },
    {
      label: "Canlı Kodlama",
      value: profile.stats.liveCodingAttempts,
      icon: Activity,
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      label: "Bug Fix",
      value: profile.stats.bugFixAttempts,
      icon: Users,
      color: "from-rose-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-12 animate-fade-in">
      <Card variant="elevated" className="overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/50 to-transparent" />
          <CardContent className="relative z-10 p-6 md:p-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
              <div className="relative -mt-4 md:-mt-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/40 flex items-center justify-center text-4xl md:text-5xl text-white font-bold shadow-2xl overflow-hidden">
                  {profile.user.profileImage ? (
                    <img
                      src={profile.user.profileImage}
                      alt={profile.user.name || profile.user.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(profile.user.name || profile.user.email)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 text-white space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                    {profile.user.name || "İsimsiz Yetek"}
                  </h1>
                  <p className="text-white/80 flex items-center gap-2 mt-2 text-sm md:text-base">
                    <Mail className="h-4 w-4" />
                    {profile.user.email}
                  </p>
                  <p className="text-white/70 flex items-center gap-2 mt-1 text-sm">
                    <Shield className="h-4 w-4" />
                    {profile.user.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/80">
                    <span className="font-mono rounded-md border border-white/20 bg-white/10 px-2.5 py-1">
                      {profile.user.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUserId}
                      className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-medium transition hover:bg-white/20"
                    >
                      {idCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          ID’yi Kopyala
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {displayedBadges.length > 0 && (
                  <div className="mt-4">
                    <BadgeOverlay
                      badges={displayedBadges}
                      placement="inline"
                      className="flex-wrap gap-3 text-sm"
                    />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/70">
                  <Clock className="h-4 w-4" />
                  <span>
                    Sisteme katılım:{" "}
                    {new Date(profile.user.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {profile.expertises.length > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 border border-white/20">
                      <Layers className="h-3.5 w-3.5" />
                      {profile.expertises.join(" • ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end md:min-w-[240px] mt-2 md:mt-4">
              {/* Stats - Instagram style */}
              <div className="flex items-center gap-6 text-white">
                <div className="text-center">
                  <span className="block text-lg font-semibold">{postsCount}</span>
                  <span className="text-sm opacity-80">gönderi</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-semibold">{connectionsCount}</span>
                  <span className="text-sm opacity-80">bağlantı</span>
                </div>
                {monthlyRank && (
                  <div className="text-center">
                    <span className="block text-lg font-semibold">#{monthlyRank.rank}</span>
                    <span className="text-sm opacity-80">aylık sıra</span>
                  </div>
                )}
              </div>
              {!isOwnProfile && sessionStatus === "authenticated" && (
                <Button
                  variant="gradient"
                  onClick={handleSendFriendRequest}
                  isLoading={friendRequestState.status === "loading"}
                  disabled={isFriendButtonDisabled}
                  className="w-full md:w-auto px-5 py-2 text-sm md:text-base bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {friendButtonLabel}
                </Button>
              )}
              {!isOwnProfile && sessionStatus !== "authenticated" && (
                <Button
                  variant="gradient"
                  onClick={handleSendFriendRequest}
                  isLoading={friendRequestState.status === "loading"}
                  disabled={isFriendButtonDisabled}
                  className="w-full md:w-auto px-5 py-2 text-sm md:text-base mt-2"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {friendButtonLabel}
                </Button>
              )}
              {friendRequestState.status === "error" && friendRequestState.message && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-rose-100 backdrop-blur-sm">
                  <XCircle className="h-4 w-4" />
                  <span>{friendRequestState.message}</span>
                </div>
              )}
              {friendRequestState.status === "success" && friendRequestState.message && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-emerald-100 backdrop-blur-sm">
                  <Check className="h-4 w-4" />
                  <span>{friendRequestState.message}</span>
                </div>
              )}
              {displayedBadges.length > 0 && (
                <div className="w-full flex justify-start md:justify-end">
                  <BadgeOverlay
                    badges={displayedBadges}
                    placement="inline"
                    className="flex-wrap gap-2 md:justify-end"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {infoTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card
              key={tile.label}
              variant="elevated"
              className="overflow-hidden border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70"
            >
              <CardContent className="px-5 pt-7 pb-5 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.color} flex items-center justify-center text-white shadow-[0_12px_20px_-12px_rgba(79,70,229,0.55)]`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {tile.value}
                  </p>
                  <p className="text-xs uppercase font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                    {tile.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="elevated" className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Güncel Sıralama
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pt-8 pb-6 space-y-6">
            {weeklyRank ? (
              <RankingDisplay
                currentRank={weeklyRank.rank}
                period="weekly"
                points={weeklyRank.compositeScore}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Haftalık sıralama kaydı bulunamadı.
              </p>
            )}
            {monthlyRank ? (
              <RankingDisplay
                currentRank={monthlyRank.rank}
                period="monthly"
                points={monthlyRank.compositeScore}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aylık sıralama kaydı bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated" className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Ortalama Skorlar
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pt-8 pb-6 space-y-4">
            {[
              { key: "quiz", label: "Konu", value: profile.stats.averageScores.quiz },
              { key: "test", label: "Test", value: profile.stats.averageScores.test },
              { key: "liveCoding", label: "Canlı Kodlama", value: profile.stats.averageScores.liveCoding },
              { key: "bugFix", label: "Bug Fix", value: profile.stats.averageScores.bugFix },
            ].map(({ key, label, value }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {label}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    %{value}
                  </span>
                  {categoryRankings[key] && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Sıra: {categoryRankings[key]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800 flex flex-col gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-yellow-500" />
            Rozet Koleksiyonu
          </CardTitle>
          {profile.recentAchievements.length > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              Son kazanılan rozetler:
              <div className="flex gap-2">
                {profile.recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    <span>{achievement.icon}</span>
                    <span>{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="px-6 pt-8 pb-6">
          {badges.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Henüz rozet kazanılmamış.
            </p>
          ) : (
            <BadgeCollection badges={badges} earnedBadgeIds={earnedBadgeIds} />
          )}
        </CardContent>
      </Card>


      {/* Posts Section - Instagram style */}
      <Card variant="elevated" className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        </CardHeader>
        <CardContent className="px-6 pt-8 pb-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Grid3x3 className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-sm text-[#8e8e8e]">Henüz gönderi yok</p>
            </div>
          ) : (
            <ProfileGrid posts={posts} onPostClick={handlePostClick} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

