"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "./_components/ProfileHeader";
import { GamificationSummary } from "./_components/GamificationSummary";
import { StatsGrid } from "./_components/StatsGrid";
import { BadgesSection } from "./_components/BadgesSection";
import { ActivityTimeline } from "./_components/ActivityTimeline";
import { CVSection } from "./_components/CVSection";
import { CareerPlanSection } from "./_components/CareerPlanSection";
import { LearningPathSection } from "./_components/LearningPathSection";
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
  const [cvs, setCvs] = useState<any[]>([]);
  const [careerPlan, setCareerPlan] = useState<any | null>(null);
  const [learningPath, setLearningPath] = useState<any | null>(null);

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
        cvsResponse,
        careerResponse,
      ] = await Promise.allSettled([
        fetch(`/api/profile/${userId}`),
        fetch(`/api/profile/${userId}/badges`),
        fetch("/api/profile/activity?limit=10"),
        fetch("/api/gamification/me/summary"),
        fetch("/api/cv"),
        fetch("/api/career/plan"),
      ]);

      // Handle profile data
      if (profileResponse.status === "fulfilled" && profileResponse.value.ok) {
        const profileData = await profileResponse.value.json();
        setProfileUser(profileData.user || null);
        setProfileStats(profileData.stats || null);
      }

      // Handle badges
      if (badgesResponse.status === "fulfilled" && badgesResponse.value.ok) {
        const badgesData = await badgesResponse.value.json();
        setBadges(badgesData.badges || []);
        setDisplayedBadges(badgesData.displayedBadges || []);
      }

      // Handle activities
      if (activityResponse.status === "fulfilled" && activityResponse.value.ok) {
        const activityData = await activityResponse.value.json();
        setActivities(activityData.activities || []);
      }

      // Handle gamification
      if (gamiResponse.status === "fulfilled" && gamiResponse.value.ok) {
        const gami = await gamiResponse.value.json();
        setGamiSummary(gami);
      }

      // Handle CVs
      if (cvsResponse.status === "fulfilled" && cvsResponse.value.ok) {
        const cvsData = await cvsResponse.value.json();
        setCvs(cvsData.cvs || []);
      }

      // Handle career plan
      if (careerResponse.status === "fulfilled" && careerResponse.value.ok) {
        const careerData = await careerResponse.value.json();
        setCareerPlan(careerData.plan || null);
      }

      // Learning path will be fetched separately if needed
      // For now, we'll leave it as null
      setLearningPath(null);
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 lg:p-6 space-y-6">
      {/* Profile Header */}
      <ProfileHeader user={displayUser} onUpdate={() => fetchProfileData({ silent: true })} />

      {/* Gamification Summary */}
      {gamiSummary && (
        <GamificationSummary
          level={gamificationData.level}
          points={gamificationData.points}
          xp={gamificationData.xp}
          streak={gamificationData.streak}
        />
      )}

      {/* Stats Grid */}
      {profileStats && (
        <StatsGrid stats={profileStats} leaderboardRank={undefined} />
      )}

      {/* Badges Section */}
      {badges.length > 0 && (
        <BadgesSection badges={badges} displayedBadges={displayedBadges} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activities */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityTimeline activities={activities} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <CVSection cvs={cvs} />
          <CareerPlanSection careerPlan={careerPlan} />
          <LearningPathSection learningPath={learningPath} />
        </div>
      </div>
    </main>
  );
}
