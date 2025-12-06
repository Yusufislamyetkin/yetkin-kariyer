"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<MentorRecommendation[]>([]);
  const [aiRecommendationSource, setAiRecommendationSource] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyRank, setDailyRank] = useState<LeaderboardRank | null>(null);
  const [weeklyRank, setWeeklyRank] = useState<LeaderboardRank | null>(null);
  const [monthlyRank, setMonthlyRank] = useState<LeaderboardRank | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityType, setActivityType] = useState<"global" | "connections">("global");
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [strikeData, setStrikeData] = useState<any>(null);
  const [strikeLoading, setStrikeLoading] = useState(true);
  const [completedTopics, setCompletedTopics] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [participatedHackathons, setParticipatedHackathons] = useState<number>(0);
  const [motivationMessage, setMotivationMessage] = useState<{ message: string; emoji: string } | null>(null);
  const [motivationLoading, setMotivationLoading] = useState(true);
  const recentBadges = badges.slice(0, 6);
  const { checkStrikeCompletion } = useStrikeCompletionCheck();

  // Fetch core dashboard data (non-blocking)
  useEffect(() => {
    fetchCoreData();
  }, []);

  // Fetch AI recommendations separately (non-blocking)
  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  // Fetch motivation message separately (non-blocking)
  useEffect(() => {
    fetchMotivationMessage();
  }, []);

  // Fetch activities when type changes
  useEffect(() => {
    fetchActivities();
  }, [activityType]);

  const fetchCoreData = async () => {
    try {
      // Fetch strike data first and in parallel with stats for faster loading
      const [strikeResponse, statsResponse, interviewResponse, badgesResponse, dailyRankResponse, weeklyRankResponse, monthlyRankResponse, activitiesResponse, earningsResponse] = await Promise.all([
        fetch("/api/strike").catch(() => {
          // Return a response-like object that indicates failure
          return {
            ok: false,
            status: 500,
            json: async () => ({ error: "Failed to fetch strike data" }),
          };
        }),
        fetch("/api/dashboard/stats"),
        fetch("/api/interview/history").catch(() => ({
          json: async () => ({ attempts: [] }),
        })),
        fetch("/api/badges/user").catch(() => ({
          json: async () => ({ badges: [] }),
        })),
        fetch("/api/competition/leaderboard?period=daily&type=quiz_count").catch(() => ({
          json: async () => ({ userRank: null }),
        })),
        fetch("/api/competition/leaderboard?period=weekly&type=quiz_count").catch(() => ({
          json: async () => ({ userRank: null }),
        })),
        fetch("/api/competition/leaderboard?period=monthly&type=quiz_count").catch(() => ({
          json: async () => ({ userRank: null }),
        })),
        fetch(`/api/profile/activity?limit=10&type=global`).catch(() => ({
          json: async () => ({ activities: [] }),
        })),
        fetch("/api/earnings").catch(() => ({
          json: async () => ({ earnings: { total: 0 } }),
        })),
      ]);

      const statsData = await statsResponse.json();
      if (statsResponse.ok && statsData.stats) {
        setStats(statsData.stats);
        if (statsData.stats.completedTopics !== undefined) {
          setCompletedTopics(statsData.stats.completedTopics);
        }
        if (statsData.stats.participatedHackathons !== undefined) {
          setParticipatedHackathons(statsData.stats.participatedHackathons);
        }
      }

      const interviewData = await interviewResponse.json();
      const interviewAttempts = interviewData.attempts || [];

      const badgesData = await badgesResponse.json();
      if (badgesData.badges) {
        setBadges(badgesData.badges || []);
      }

      const dailyRankData = await dailyRankResponse.json();
      if (dailyRankData.userRank && dailyRankData.userRank.rank && dailyRankData.userRank.rank > 0) {
        setDailyRank({
          rank: dailyRankData.userRank.rank,
          quizCount: dailyRankData.userRank.attempts?.quiz || 0,
          averageScore: dailyRankData.userRank.metrics?.test || 0,
          points: dailyRankData.userRank.points || 0,
        });
      }

      const weeklyRankData = await weeklyRankResponse.json();
      if (weeklyRankData.userRank && weeklyRankData.userRank.rank && weeklyRankData.userRank.rank > 0) {
        setWeeklyRank({
          rank: weeklyRankData.userRank.rank,
          quizCount: weeklyRankData.userRank.attempts?.quiz || 0,
          averageScore: weeklyRankData.userRank.metrics?.test || 0,
          points: weeklyRankData.userRank.points || 0,
        });
      }

      const monthlyRankData = await monthlyRankResponse.json();
      if (monthlyRankData.userRank && monthlyRankData.userRank.rank && monthlyRankData.userRank.rank > 0) {
        setMonthlyRank({
          rank: monthlyRankData.userRank.rank,
          quizCount: monthlyRankData.userRank.attempts?.quiz || 0,
          averageScore: monthlyRankData.userRank.metrics?.test || 0,
          points: monthlyRankData.userRank.points || 0,
        });
      }

      const activitiesData = await activitiesResponse.json();
      if (activitiesData.activities) {
        setActivities(activitiesData.activities || []);
      }

      const earningsData = await earningsResponse.json();
      if (earningsData.earnings) {
        setTotalEarnings(earningsData.earnings.total || 0);
      }

      // Process strike data first for faster display
      try {
        if (strikeResponse.ok) {
          const strikeData = await strikeResponse.json();
          if (strikeData && !strikeData.error) {
            setStrikeData(strikeData);
            // Check if strike was newly completed and show notification
            // This happens when user completes all daily tasks and visits dashboard
            if (strikeData.isNewlyCompleted === true) {
              // Trigger celebration modal with confetti
              checkStrikeCompletion();
            }
          } else {
            // Set to null so StrikeDisplay shows default/empty state
            setStrikeData(null);
          }
        } else {
          // API returned an error (e.g., 401, 500)
          console.warn("Strike API returned error:", strikeResponse.status);
          setStrikeData(null);
        }
      } catch (error) {
        console.error("Error parsing strike data:", error);
        setStrikeData(null);
      }
      setStrikeLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await fetch(`/api/profile/activity?limit=10&type=${activityType}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const statCards = [
    {
      title: "Test",
      value: stats?.testAttempts || 0,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Ders",
      value: completedTopics,
      icon: GraduationCap,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Sosyal Etkileşim",
      value: stats?.socialInteractions || 0,
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Topluluğa Katkı",
      value: stats?.communityContributions || 0,
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const quickActions = [
    {
      title: "Keşfet",
      description: "Yeni içerikleri keşfedin",
      href: "/social/explore",
      icon: Compass,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "İçerik Oluşturma",
      description: "İçerik oluşturun ve paylaşın",
      href: "/social/create",
      icon: Plus,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Kurslar",
      description: "Yeni beceriler öğrenin",
      href: "/education/courses",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Testler",
      description: "Bilginizi test edin",
      href: "/education/tests",
      icon: FileText,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "En Çok Kazananlar",
      description: "Kazanç sıralamasını görüntüleyin",
      href: "/earnings/leaderboard",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Derece Kazancı",
      description: "Sıralama kazançlarınızı görün",
      href: "/competition",
      icon: Medal,
      color: "from-amber-500 to-yellow-500",
    },
    {
      title: "İş Arama",
      description: "Yeni fırsatları keşfedin",
      href: "/jobs/browse",
      icon: Search,
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "CV Oluşturma",
      description: "CV'nizi oluşturun",
      href: "/cv/create",
      icon: FileText,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const displayedAiRecommendations = aiRecommendations.slice(0, 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Kariyerinize genel bakış ve hızlı erişim
          </p>
        </div>
      </div>

      {/* Strike Display */}
      <StrikeDisplay strikeData={strikeData} loading={strikeLoading} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
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
        })}
      </div>

      {recentBadges.length > 0 && (
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
      )}

      {/* Quick Actions & AI Recommendations */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="elevated" hover className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Hızlı Erişim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 group border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg md:group-hover:scale-110 transition-all duration-300 flex-shrink-0`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-display font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 md:group-hover:translate-x-2 transition-all flex-shrink-0" />
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
            <div className="space-y-4">
              {dailyRank && dailyRank.rank > 0 ? (
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
              {weeklyRank && weeklyRank.rank > 0 ? (
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
              {monthlyRank && monthlyRank.rank > 0 ? (
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
      <Card variant="elevated" hover>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              Kullanıcı Hareketleri
            </CardTitle>
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
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity: any) => {
                  const hasUser = activity.user && (activityType === "global" || activityType === "connections");
                  const profileUrl = hasUser && activity.user.id ? `/profile/${activity.user.id}` : null;
                  
                  const ActivityCard = profileUrl ? (
                    <Link
                      href={profileUrl}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-200 cursor-pointer group"
                    >
                      {hasUser && (
                        <div className="flex-shrink-0">
                          {activity.user.profileImage ? (
                            <img
                              src={activity.user.profileImage}
                              alt={activity.user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm group-hover:from-blue-600 group-hover:to-cyan-600 transition-colors">
                              {activity.user.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timeAgo}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
                      {hasUser && (
                        <div className="flex-shrink-0">
                          {activity.user.profileImage ? (
                            <img
                              src={activity.user.profileImage}
                              alt={activity.user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                              {activity.user.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timeAgo}</p>
                      </div>
                    </div>
                  );
                  
                  return <div key={activity.id}>{ActivityCard}</div>;
                })
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                    {activityType === "connections"
                      ? "Henüz bağlantılarınızın aktivitesi yok"
                      : "Henüz aktivite yok"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {activityType === "connections"
                      ? "Bağlantılarınız aktivite yaptıkça burada görünecek"
                      : "Test çözerek veya kurslara başlayarak aktiviteler oluşturun"}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
