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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { BadgeDisplay } from "@/app/components/badges/BadgeDisplay";
import { Trophy, Award } from "lucide-react";
import type { MentorRecommendation } from "@/types";
import { StrikeDisplay } from "./_components/StrikeDisplay";

interface DashboardStats {
  quizAttempts: number;
  interviewAttempts: number;
  cvs: number;
  applications: number;
  averageQuizScore: number;
  averageInterviewScore: number;
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
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<MentorRecommendation[]>([]);
  const [aiRecommendationSource, setAiRecommendationSource] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyRank, setDailyRank] = useState<LeaderboardRank | null>(null);
  const [monthlyRank, setMonthlyRank] = useState<LeaderboardRank | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [strikeData, setStrikeData] = useState<any>(null);
  const [strikeLoading, setStrikeLoading] = useState(true);
  const recentBadges = badges.slice(0, 3);

  // Fetch core dashboard data (non-blocking)
  useEffect(() => {
    fetchCoreData();
  }, []);

  // Fetch AI recommendations separately (non-blocking)
  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const fetchCoreData = async () => {
    try {
      // Fetch strike data first and in parallel with stats for faster loading
      const [strikeResponse, statsResponse, interviewResponse, badgesResponse, dailyRankResponse, monthlyRankResponse, activitiesResponse] = await Promise.all([
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
        fetch("/api/competition/leaderboard?period=monthly&type=quiz_count").catch(() => ({
          json: async () => ({ userRank: null }),
        })),
        fetch("/api/profile/activity?limit=10").catch(() => ({
          json: async () => ({ activities: [] }),
        })),
      ]);

      const statsData = await statsResponse.json();
      if (statsResponse.ok && statsData.stats) {
        setStats(statsData.stats);
      }

      const interviewData = await interviewResponse.json();
      const interviewAttempts = interviewData.attempts || [];

      const badgesData = await badgesResponse.json();
      if (badgesData.badges) {
        setBadges(badgesData.badges || []);
      }

      const dailyRankData = await dailyRankResponse.json();
      if (dailyRankData.userRank) {
        setDailyRank({
          rank: dailyRankData.userRank.rank || 0,
          quizCount: dailyRankData.userRank.quizCount || 0,
          averageScore: dailyRankData.userRank.averageScore || 0,
          points: dailyRankData.userRank.points || 0,
        });
      }

      const monthlyRankData = await monthlyRankResponse.json();
      if (monthlyRankData.userRank) {
        setMonthlyRank({
          rank: monthlyRankData.userRank.rank || 0,
          quizCount: monthlyRankData.userRank.quizCount || 0,
          averageScore: monthlyRankData.userRank.averageScore || 0,
          points: monthlyRankData.userRank.points || 0,
        });
      }

      const activitiesData = await activitiesResponse.json();
      if (activitiesData.activities) {
        setActivities(activitiesData.activities || []);
      }

      // Process strike data first for faster display
      try {
        if (strikeResponse.ok) {
          const strikeData = await strikeResponse.json();
          if (strikeData && !strikeData.error) {
            setStrikeData(strikeData);
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

  const statCards = [
    {
      title: "Test Denemeleri",
      value: stats?.quizAttempts || 0,
      subtitle: `Ortalama: ${stats?.averageQuizScore || 0}%`,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Mülakat Denemeleri",
      value: stats?.interviewAttempts || 0,
      subtitle: `Ortalama: ${stats?.averageInterviewScore || 0}%`,
      icon: Video,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "CV'ler",
      value: stats?.cvs || 0,
      subtitle: "Toplam CV sayısı",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Başvurular",
      value: stats?.applications || 0,
      subtitle: "Aktif başvurular",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const quickActions = [
    {
      title: "Kurslara Git",
      description: "Yeni beceriler öğrenin",
      href: "/education/courses",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Mülakat Pratiği",
      description: "Mülakat becerilerinizi geliştirin",
      href: "/interview/practice",
      icon: Video,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "CV'lerim",
      description: "CV'lerinizi yönetin",
      href: "/cv/my-cvs",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "İş İlanları",
      description: "Yeni fırsatları keşfedin",
      href: "/jobs/browse",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Kariyer Planım",
      description: "Kariyer yolculuğunuzu planlayın",
      href: "/career/roadmap",
      icon: TrendingUp,
      color: "from-indigo-500 to-purple-500",
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
        <div className="flex gap-3">
          <Link href="/education/courses">
            <Button variant="gradient" size="md">
              Yeni Kurs Keşfet
            </Button>
          </Link>
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
                  <div className={`px-2.5 py-1 rounded-full ${stat.bgColor} backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 min-w-0 max-w-[60%]`}>
                    <span className={`text-xs font-semibold ${stat.textColor} truncate block whitespace-nowrap`}>
                      {stat.subtitle}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                    {stat.title}
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
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Test: {dailyRank.quizCount}</p>
                    <p>Ortalama: %{dailyRank.averageScore.toFixed(1)}</p>
                    <p>Puan: {dailyRank.points}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Henüz günlük sıralamada yer almıyorsunuz</p>
                </div>
              )}
              {monthlyRank && monthlyRank.rank > 0 ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Aylık Sıralama</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">#{monthlyRank.rank}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Test: {monthlyRank.quizCount}</p>
                    <p>Ortalama: %{monthlyRank.averageScore.toFixed(1)}</p>
                    <p>Puan: {monthlyRank.points}</p>
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

        <Card variant="elevated" hover>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              İlerleme Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Test Başarısı</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {stats?.averageQuizScore || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" 
                    style={{ width: `${stats?.averageQuizScore || 0}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mülakat Başarısı</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {stats?.averageInterviewScore || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full" 
                    style={{ width: `${stats?.averageInterviewScore || 0}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements - Full Row */}
      <Card variant="elevated" hover>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Başarımlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toplam {badges.length} rozet kazandınız
                </p>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {badges.reduce((sum, b) => sum + (b.points || 0), 0)} puan
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {badges.slice(0, 8).map((badge) => (
                  <BadgeDisplay
                    key={badge.id}
                    badge={badge}
                    earned={true}
                    size="sm"
                  />
                ))}
              </div>
              {badges.length > 8 && (
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Tüm Rozetleri Gör ({badges.length})
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                Henüz rozet kazanmadınız
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Test çözerek ve aktiviteler yaparak rozet kazanın
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card variant="elevated" hover>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            Son Aktiviteler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                  Henüz aktivite yok
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Test çözerek veya kurslara başlayarak aktiviteler oluşturun
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
