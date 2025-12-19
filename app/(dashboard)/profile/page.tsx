"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "./_components/ProfileHeader";
import { UserStats } from "./_components/UserStats";
import { BadgesSection } from "./_components/BadgesSection";
import { ActivityTimeline } from "./_components/ActivityTimeline";
import { PostsSection } from "./_components/PostsSection";
import { SubscriptionInfo } from "./_components/SubscriptionInfo";
import { Button } from "@/app/components/ui/Button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [profileStats, setProfileStats] = useState<any | null>(null);
  const [gamiSummary, setGamiSummary] = useState<any | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [displayedBadges, setDisplayedBadges] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status, router]);

  const fetchProfileData = async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    try {
      setError(null);
      if (!silent) {
        setLoading(true);
      }
      const userId = (session?.user as any)?.id as string | undefined;

      if (!userId || typeof userId !== "string") {
        console.error("User ID is not available");
        setError("Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      const [
        profileResponse,
        badgesResponse,
        activityResponse,
        gamiResponse,
      ] = await Promise.allSettled([
        fetch(`/api/profile/${userId}`),
        fetch(`/api/profile/${userId}/badges`),
        fetch("/api/profile/activity?limit=10"),
        fetch("/api/gamification/me/summary"),
      ]);

      // Handle profile data
      if (profileResponse.status === "fulfilled" && profileResponse.value.ok) {
        const profileData = await profileResponse.value.json();
        setProfileUser(profileData.user || null);
        // Ensure stats has all required fields with defaults
        if (profileData.stats) {
          setProfileStats({
            completedLessons: profileData.stats.completedLessons ?? 0,
            quizAttempts: profileData.stats.quizAttempts ?? 0,
            testAttempts: profileData.stats.testAttempts ?? 0,
            liveCodingAttempts: profileData.stats.liveCodingAttempts ?? 0,
            bugFixAttempts: profileData.stats.bugFixAttempts ?? 0,
            ...profileData.stats,
          });
        } else {
          setProfileStats({
            completedLessons: 0,
            quizAttempts: 0,
            testAttempts: 0,
            liveCodingAttempts: 0,
            bugFixAttempts: 0,
          });
        }
      } else if (profileResponse.status === "rejected") {
        console.error("Profile response rejected:", profileResponse.reason);
        setProfileStats({
          completedLessons: 0,
          quizAttempts: 0,
          testAttempts: 0,
          liveCodingAttempts: 0,
          bugFixAttempts: 0,
        });
      }

      // Handle badges
      if (badgesResponse.status === "fulfilled" && badgesResponse.value.ok) {
        const badgesData = await badgesResponse.value.json();
        setBadges(badgesData.badges || []);
        setDisplayedBadges(badgesData.displayedBadges || []);
      } else {
        setBadges([]);
        setDisplayedBadges([]);
      }

      // Handle activities
      if (activityResponse.status === "fulfilled" && activityResponse.value.ok) {
        const activityData = await activityResponse.value.json();
        setActivities(activityData.activities || []);
      } else {
        setActivities([]);
      }

      // Handle gamification
      if (gamiResponse.status === "fulfilled" && gamiResponse.value.ok) {
        const gami = await gamiResponse.value.json();
        // Ensure all gamification fields have defaults
        setGamiSummary({
          level: gami.level ?? 1,
          points: gami.points ?? 0,
          xp: gami.xp ?? 0,
          streak: gami.streak ?? { current: 0, longest: 0 },
          ...gami,
        });
      } else {
        // Set default gamification data if request fails
        setGamiSummary({
          level: 1,
          points: 0,
          xp: 0,
          streak: { current: 0, longest: 0 },
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Profil verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchProfileData();
            }}
            variant="gradient"
          >
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

  const sessionUser = session?.user as any;
  const displayUser = {
    id: profileUser?.id ?? sessionUser?.id ?? "",
    name: profileUser?.name ?? sessionUser?.name ?? "",
    email: profileUser?.email ?? sessionUser?.email ?? "",
    profileImage: profileUser?.profileImage ?? null,
    role: profileUser?.role ?? sessionUser?.role ?? "candidate",
    createdAt: profileUser?.createdAt ?? sessionUser?.createdAt ?? new Date(),
  };

  const gamificationData = {
    level: gamiSummary?.level ?? 1,
    points: gamiSummary?.points ?? 0,
    xp: gamiSummary?.xp ?? 0,
    streak: gamiSummary?.streak ?? { current: 0, longest: 0 },
  };

  const userStatsData = {
    level: gamificationData.level,
    points: gamificationData.points,
    xp: gamificationData.xp,
    streak: gamificationData.streak,
    stats: {
      completedLessons: profileStats?.completedLessons ?? 0,
      quizAttempts: profileStats?.quizAttempts ?? 0,
      testAttempts: profileStats?.testAttempts ?? 0,
      liveCodingAttempts: profileStats?.liveCodingAttempts ?? 0,
      bugFixAttempts: profileStats?.bugFixAttempts ?? 0,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 lg:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Profile Header */}
      <ProfileHeader user={displayUser} onUpdate={() => fetchProfileData({ silent: true })} />

      {/* User Stats */}
      <UserStats
        level={userStatsData.level}
        points={userStatsData.points}
        xp={userStatsData.xp}
        streak={userStatsData.streak}
        stats={userStatsData.stats}
      />

      {/* Subscription Info */}
      <SubscriptionInfo userId={displayUser.id} />

      {/* Son Aktiviteler - Full Width */}
      <ActivityTimeline activities={activities} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full">
        {/* Left Column - Posts */}
        <div className="lg:col-span-2 space-y-6 w-full max-w-full overflow-x-hidden">
          <PostsSection userId={displayUser.id} compact={false} />
        </div>

        {/* Right Column - Badges */}
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
          {badges.length > 0 && (
            <BadgesSection badges={badges} displayedBadges={displayedBadges} />
          )}
        </div>
      </div>
    </main>
  );
}
