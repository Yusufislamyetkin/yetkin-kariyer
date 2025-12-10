"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Video,
  FileText,
  Briefcase,
  TrendingUp,
  Lightbulb,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Compass,
  Plus,
  Search,
  GraduationCap,
  Coins,
  Trophy,
  MessageCircle,
  Users,
  DollarSign,
  Medal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import type { MentorRecommendation } from "@/types";
import { StrikeDisplay } from "./_components/StrikeDisplay";
import { useStrikeCompletionCheck } from "@/hooks/useStrikeCompletionCheck";
import { ActivityTimeline } from "../profile/_components/ActivityTimeline";

interface DashboardStats {
  quizAttempts: number;
  testAttempts?: number;
  interviewAttempts: number;
  cvs: number;
  applications: number;
  averageQuizScore: number;
  averageInterviewScore: number;
  completedTopics?: number;
  participatedHackathons?: number;
  socialInteractions?: number;
  communityContributions?: number;
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

interface LeaderboardRank {
  rank: number;
  quizCount: number;
  averageScore: number;
  points: number;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  score?: number;
  date: string;
  icon: string;
  timeAgo: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string | null;
  } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<MentorRecommendation[]>([]);
  const [aiRecommendationSource, setAiRecommendationSource] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [dailyRank, setDailyRank] = useState<LeaderboardRank | null>(null);
  const [weeklyRank, setWeeklyRank] = useState<LeaderboardRank | null>(null);
  const [monthlyRank, setMonthlyRank] = useState<LeaderboardRank | null>(null);
  const [ranksLoading, setRanksLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityType, setActivityType] = useState<"global" | "connections">("global");
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesHasMore, setActivitiesHasMore] = useState(true);
  const [activitiesLoadingMore, setActivitiesLoadingMore] = useState(false);
  const activitiesSkipRef = useRef(0);
  const [strikeData, setStrikeData] = useState<any>(null);
  const [strikeLoading, setStrikeLoading] = useState(true);
  const [completedTopics, setCompletedTopics] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [participatedHackathons, setParticipatedHackathons] = useState<number>(0);
  const [motivationMessage, setMotivationMessage] = useState<{ message: string; emoji: string } | null>(null);
  const [motivationLoading, setMotivationLoading] = useState(true);
  const recentBadges = badges.slice(0, 6);
  const { checkStrikeCompletion } = useStrikeCompletionCheck();

  // Fetch core dashboard data using unified API
  useEffect(() => {
    fetchDashboardData();
    fetchLeaderboardRanks();
  }, []);

  // Fetch AI recommendations separately (non-blocking)
  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  // Fetch motivation message separately (non-blocking)
  useEffect(() => {
    fetchMotivationMessage();
  }, []);

  // Fetch activities when type changes (separate from core data)
  useEffect(() => {
    fetchActivities(true);
  }, [activityType]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats, badges, earnings, and strike data
      const response = await fetch("/api/dashboard/data", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();

      // Process stats - ensure all values are properly set
      if (data.stats) {
        // Set stats with all values, ensuring defaults for missing fields
        const processedStats: DashboardStats = {
          quizAttempts: data.stats.quizAttempts ?? 0,
          testAttempts: data.stats.testAttempts ?? 0,
          interviewAttempts: data.stats.interviewAttempts ?? 0,
          cvs: data.stats.cvs ?? 0,
          applications: data.stats.applications ?? 0,
          averageQuizScore: data.stats.averageQuizScore ?? 0,
          averageInterviewScore: data.stats.averageInterviewScore ?? 0,
          completedTopics: data.stats.completedTopics ?? 0,
          participatedHackathons: data.stats.participatedHackathons ?? 0,
          socialInteractions: data.stats.socialInteractions ?? 0,
          communityContributions: data.stats.communityContributions ?? 0,
        };
        setStats(processedStats);
        
        // Also update separate state for backward compatibility
        setCompletedTopics(processedStats.completedTopics ?? 0);
        setParticipatedHackathons(processedStats.participatedHackathons ?? 0);
      } else {
        // If stats is missing, set defaults
        setStats({
          quizAttempts: 0,
          testAttempts: 0,
          interviewAttempts: 0,
          cvs: 0,
          applications: 0,
          averageQuizScore: 0,
          averageInterviewScore: 0,
          completedTopics: 0,
          participatedHackathons: 0,
          socialInteractions: 0,
          communityContributions: 0,
        });
        setCompletedTopics(0);
        setParticipatedHackathons(0);
      }
      setStatsLoading(false);

      // Process badges
      if (data.badges) {
        setBadges(data.badges || []);
      } else {
        setBadges([]);
      }
      setBadgesLoading(false);

      // Process earnings
      if (data.earnings) {
        setTotalEarnings(data.earnings.total ?? 0);
      } else {
        setTotalEarnings(0);
      }
      setEarningsLoading(false);

      // Process strike data
      if (data.strike) {
        setStrikeData(data.strike);
        // Check if strike was newly completed and show notification
        if (data.strike.isNewlyCompleted === true) {
          checkStrikeCompletion();
        }
      } else {
        setStrikeData(null);
      }
      setStrikeLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set loading states to false on error
      setStatsLoading(false);
      setBadgesLoading(false);
      setEarningsLoading(false);
      setStrikeLoading(false);
      
      // Set default values on error to prevent showing 0 incorrectly
      // Keep existing values if available, otherwise set defaults
      setStats((prev) => prev || {
        quizAttempts: 0,
        testAttempts: 0,
        interviewAttempts: 0,
        cvs: 0,
        applications: 0,
        averageQuizScore: 0,
        averageInterviewScore: 0,
        completedTopics: 0,
        participatedHackathons: 0,
        socialInteractions: 0,
        communityContributions: 0,
      });
    }
  };

  // Fetch leaderboard ranks from competition API for each period
  const fetchLeaderboardRanks = async () => {
    try {
      setRanksLoading(true);
      
      // Fetch ranks for all periods in parallel
      const [dailyResponse, weeklyResponse, monthlyResponse] = await Promise.all([
        fetch(`/api/competition/leaderboard?period=daily&limit=100`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }),
        fetch(`/api/competition/leaderboard?period=weekly&limit=100`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }),
        fetch(`/api/competition/leaderboard?period=monthly&limit=100`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }),
      ]);

      // Process daily rank
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        if (dailyData.userRank && dailyData.userRank.rank && dailyData.userRank.rank > 0) {
          setDailyRank({
            rank: dailyData.userRank.rank,
            quizCount: dailyData.userRank.attempts?.quiz || dailyData.userRank.attempts?.test || 0,
            averageScore: dailyData.userRank.metrics?.test || 0,
            points: dailyData.userRank.points || 0,
          });
        } else {
          setDailyRank(null);
        }
      } else {
        setDailyRank(null);
      }

      // Process weekly rank
      if (weeklyResponse.ok) {
        const weeklyData = await weeklyResponse.json();
        if (weeklyData.userRank && weeklyData.userRank.rank && weeklyData.userRank.rank > 0) {
          setWeeklyRank({
            rank: weeklyData.userRank.rank,
            quizCount: weeklyData.userRank.attempts?.quiz || weeklyData.userRank.attempts?.test || 0,
            averageScore: weeklyData.userRank.metrics?.test || 0,
            points: weeklyData.userRank.points || 0,
          });
        } else {
          setWeeklyRank(null);
        }
      } else {
        setWeeklyRank(null);
      }

      // Process monthly rank
      if (monthlyResponse.ok) {
        const monthlyData = await monthlyResponse.json();
        if (monthlyData.userRank && monthlyData.userRank.rank && monthlyData.userRank.rank > 0) {
          setMonthlyRank({
            rank: monthlyData.userRank.rank,
            quizCount: monthlyData.userRank.attempts?.quiz || monthlyData.userRank.attempts?.test || 0,
            averageScore: monthlyData.userRank.metrics?.test || 0,
            points: monthlyData.userRank.points || 0,
          });
        } else {
          setMonthlyRank(null);
        }
      } else {
        setMonthlyRank(null);
      }
    } catch (error) {
      console.error("Error fetching leaderboard ranks:", error);
      setDailyRank(null);
      setWeeklyRank(null);
      setMonthlyRank(null);
    } finally {
      setRanksLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      setAiLoading(true);
      const insightsResponse = await fetch("/api/ai/dashboard-insights");
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setAiRecommendations(insightsData.recommendations || []);
        setAiRecommendationSource(insightsData.source || null);
      } else {
        setAiRecommendations([]);
        setAiRecommendationSource(null);
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setAiRecommendations([]);
      setAiRecommendationSource(null);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchMotivationMessage = async () => {
    try {
      setMotivationLoading(true);
      const response = await fetch("/api/ai/motivation");
      if (response.ok) {
        const data = await response.json();
        setMotivationMessage(data);
      } else {
        setMotivationMessage({
          message: "Her gün küçük adımlar atarak büyük başarılara ulaşırsın. Bugün de bir adım daha at! 🚀",
          emoji: "🚀",
        });
      }
    } catch (error) {
      console.error("Error fetching motivation message:", error);
      setMotivationMessage({
        message: "Harika bir ilerleme kaydediyorsun! Devam et, hedeflerine ulaşmana çok az kaldı. 💪",
        emoji: "💪",
      });
    } finally {
      setMotivationLoading(false);
    }
  };

  const fetchActivities = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setActivitiesLoading(true);
        activitiesSkipRef.current = 0;
      } else {
        setActivitiesLoadingMore(true);
      }

      const skip = reset ? 0 : activitiesSkipRef.current;
      const response = await fetch(`/api/profile/activity?limit=10&skip=${skip}&type=${activityType}`);
      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setActivities(data.activities || []);
        } else {
          setActivities((prev) => [...prev, ...(data.activities || [])]);
        }
        setActivitiesHasMore(data.hasMore || false);
        activitiesSkipRef.current = skip + (data.activities?.length || 0);
      } else {
        if (reset) {
          setActivities([]);
        }
        setActivitiesHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      if (reset) {
        setActivities([]);
      }
      setActivitiesHasMore(false);
    } finally {
      setActivitiesLoading(false);
      setActivitiesLoadingMore(false);
    }
  }, [activityType]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      activitiesLoadingMore ||
      !activitiesHasMore ||
      activitiesLoading
    ) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 200; // Load when 200px from bottom

    if (scrollPosition >= documentHeight - threshold) {
      fetchActivities(false);
    }
  }, [activitiesLoadingMore, activitiesHasMore, activitiesLoading, fetchActivities]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Memoize statCards to ensure consistent values and prevent unnecessary re-renders
  const statCards = useMemo(() => [
    {
      title: "Test",
      value: stats?.testAttempts ?? 0,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Ders",
      value: stats?.completedTopics ?? completedTopics ?? 0,
      icon: GraduationCap,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Sosyal Etkileşim",
      value: stats?.socialInteractions ?? 0,
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Topluluğa Katkı",
      value: stats?.communityContributions ?? 0,
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ], [stats, completedTopics]);

  const quickActions = [
    {
      title: "Yazılım Öğren",
      description: "Kurslar, testler ve eğitim içerikleri",
      href: "/hub/yazilim-ogren",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "İş Bul",
      description: "İş ilanları, CV ve kariyer fırsatları",
      href: "/hub/is-bul",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Kazanç Elde Et",
      description: "Hackathon, freelancer ve yarışmalar",
      href: "/hub/kazanc-elde-et",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Sosyal",
      description: "Topluluk, sohbet ve bağlantılar",
      href: "/hub/sosyal",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
  ];

  const displayedAiRecommendations = aiRecommendations.slice(0, 1);

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full max-w-full">
        <div className="w-full max-w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer mb-2">
            Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
            Kariyerinize genel bakış ve hızlı erişim
          </p>
        </div>
      </div>

      {/* Strike Display */}
      <StrikeDisplay strikeData={strikeData} loading={strikeLoading} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-full">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              variant="elevated"
              className="overflow-hidden relative animate-pulse"
            >
              <CardContent className="px-5 pt-6 pb-5">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                variant="elevated"
                hover
                className="overflow-hidden group animate-fade-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
                <CardContent className="px-5 pt-6 pb-5 relative z-10">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden`}
                    >
                      <Icon className="h-4 w-4 text-white flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide flex-1 min-w-0">
                      {stat.title}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {badgesLoading ? (
        <Card variant="elevated" className="border border-emerald-200 dark:border-emerald-800 animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl w-48" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : recentBadges.length > 0 ? (
        <Card variant="elevated" className="border border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-5 w-5" />
              Son Başarılar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {recentBadges.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  Yeni Rozetler
                </h3>
                <div className="flex flex-wrap gap-4">
                  {recentBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2"
                    >
                      <span className="text-xl">{badge.icon || "🏅"}</span>
                      <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                          {badge.name}
                        </p>
                        <p className="text-xs text-amber-600/80 dark:text-amber-300/80">
                          {badge.description ?? "Yeni bir başarı kazandın"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      ) : null}

      {/* Quick Actions & AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-full">
        <Card variant="elevated" hover className="md:col-span-2 w-full max-w-full overflow-x-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              Hızlı Erişim
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-full">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-5 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 group border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg md:group-hover:scale-110 transition-all duration-300 flex-shrink-0`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-display font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 md:group-hover:translate-x-2 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              AI Önerileri
            </CardTitle>
            {aiRecommendationSource && !aiLoading && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Kaynak: {aiRecommendationSource === "ai" ? "AI Mentor" : "Mentor fallback"}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-yellow-200/60 dark:border-yellow-800/50 bg-gradient-to-br from-yellow-50 via-orange-50/60 to-amber-100/40 dark:from-yellow-900/20 dark:via-orange-900/10 dark:to-amber-900/5 shadow-sm animate-pulse">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-3 bg-yellow-200/50 dark:bg-yellow-800/30 rounded w-24"></div>
                        <div className="h-5 bg-gray-200/50 dark:bg-gray-700/50 rounded w-3/4"></div>
                      </div>
                      <div className="h-6 bg-yellow-200/50 dark:bg-yellow-800/30 rounded-full w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-2/3"></div>
                    <div className="space-y-2 mt-2">
                      <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded w-full"></div>
                      <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded w-4/5"></div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="h-4 bg-blue-200/50 dark:bg-blue-800/30 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : displayedAiRecommendations.length > 0 ? (
              <div className="space-y-4">
                {displayedAiRecommendations.map((rec, index) => (
                  <div
                    key={`${rec.title}-${index}`}
                    className="p-4 rounded-xl border border-yellow-200/60 dark:border-yellow-800/50 bg-gradient-to-br from-yellow-50 via-orange-50/60 to-amber-100/40 dark:from-yellow-900/20 dark:via-orange-900/10 dark:to-amber-900/5 shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
                            {rec.category ?? "Mentor Önerisi"}
                          </p>
                          <h3 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100">
                            {rec.title}
                          </h3>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 whitespace-nowrap">
                          {rec.timeframe}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{rec.summary}</p>
                      {rec.metric && (
                        <p className="text-xs font-semibold text-orange-600 dark:text-orange-300">
                          {rec.metric}
                        </p>
                      )}
                      {rec.actionSteps.length > 0 && (
                        <ul className="mt-2 space-y-2">
                          {rec.actionSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <Link
                          href={rec.ctaHref || "#"}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        >
                          {rec.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        {rec.relatedGoalId && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Hedefle bağlantılı
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                  Henüz öneri yok
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Daha fazla aktivite yaparak öneriler alın
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ranking & Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="elevated" hover>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              Sıralama
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ranksLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-200 dark:bg-gray-700 h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dailyRank ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50 dark:border-yellow-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Günlük Sıralama</span>
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">#{dailyRank.rank}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Henüz günlük sıralamada yer almıyorsunuz</p>
                </div>
              )}
              {weeklyRank ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Haftalık Sıralama</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{weeklyRank.rank}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Henüz haftalık sıralamada yer almıyorsunuz</p>
                </div>
              )}
              {monthlyRank ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Aylık Sıralama</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">#{monthlyRank.rank}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Henüz aylık sıralamada yer almıyorsunuz</p>
                </div>
              )}
                <div className="mt-6">
                  <Link href="/competition">
                    <Button variant="gradient" size="sm" className="w-full">
                      Detaylı Sıralama Görüntüle
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              AI Öğretmen Mesajı
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {motivationLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mesaj hazırlanıyor...</p>
                </div>
              </div>
            ) : motivationMessage ? (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-rose-900/20 border border-purple-200/60 dark:border-purple-800/40 shadow-lg">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-700/20 dark:to-pink-700/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/30 to-purple-200/30 dark:from-rose-700/20 dark:to-purple-700/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm opacity-50"></div>
                      <img
                        src="/Photos/AiTeacher/teacher.jpg"
                        alt="AI Öğretmen Selin"
                        className="relative w-20 h-20 rounded-full object-cover border-4 border-white dark:border-purple-900/50 shadow-xl ring-2 ring-purple-200/50 dark:ring-purple-700/50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with emoji and name */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl leading-none">{motivationMessage.emoji}</span>
                        <div>
                          <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 leading-tight">
                            AI Öğretmen Selin
                          </h4>
                          <p className="text-xs text-purple-600/80 dark:text-purple-300/80 font-medium">
                            Kişisel Mentorunuz
                          </p>
                        </div>
                      </div>
                      
                      {/* Message */}
                      <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-100/50 dark:border-purple-800/30 shadow-sm">
                        <p className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
                          {motivationMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                  Mesaj yüklenemedi
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Lütfen sayfayı yenileyin
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {activitiesLoading ? (
        <Card variant="elevated" hover>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ActivityTimeline
          activities={activities.map((activity) => ({
            id: activity.id,
            type: activity.type as "lesson" | "quiz" | "live-coding" | "hackathon" | "cv" | "application" | "badge" | "interview",
            title: activity.title,
            score: activity.score,
            date: activity.date,
            icon: activity.icon,
            timeAgo: activity.timeAgo,
            userId: activity.userId,
            user: activity.user,
          }))}
          title="Kullanıcı Hareketleri"
          loadingMore={activitiesLoadingMore}
          hideHeaderIcon={true}
          headerContent={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivityType("global")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activityType === "global"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setActivityType("connections")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activityType === "connections"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Bağlantılar
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
