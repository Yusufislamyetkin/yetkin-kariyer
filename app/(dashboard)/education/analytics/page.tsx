"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Briefcase,
  CalendarRange,
  CheckCircle,
  Flame,
  Gauge,
  Medal,
  PieChart as PieChartIcon,
  Sparkles,
  Timer,
  Trophy,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import AreaChart from "@/app/components/charts/AreaChart";
import BarChart from "@/app/components/charts/BarChart";
import LineChart from "@/app/components/charts/LineChart";
import PieChart from "@/app/components/charts/PieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

interface SummaryMetrics {
  totalAttempts: number;
  passRate: number;
  averageScore: number;
  bestScore: number;
  averageDurationSeconds: number;
  totalDurationSeconds: number;
}

interface PassFailMetrics {
  passed: number;
  failed: number;
  passRate: number;
}

interface ScoreTrendPoint {
  id: string;
  completedAt: string;
  score: number;
  passingScore: number;
  passed: boolean;
  quizTitle: string;
}

interface TopicPerformance {
  topic: string;
  averageScore: number;
  passRate: number;
  attempts: number;
}

interface DifficultyPerformance {
  difficulty: string;
  label: string;
  averageScore: number;
  passRate: number;
  attempts: number;
}

interface TimeOnTask {
  averageDurationSeconds: number;
  medianDurationSeconds: number;
  totalDurationSeconds: number;
}

interface ScoreBucket {
  min: number;
  max: number;
  label: string;
  count: number;
}

interface ScoreDistribution {
  buckets: ScoreBucket[];
  min: number;
  max: number;
  average: number;
}

interface AnalyticsOverview {
  totalLearningSeconds: number;
  totalCompletions: number;
  courseEngagementCount: number;
  completionCounts: {
    tests: number;
    liveCoding: number;
    bugFix: number;
    hackaton: number;
    interviews: number;
  };
  aiAverages: {
    quiz: number | null;
    interview: number | null;
  };
  lastActivityAt: string | null;
}

interface ActivityDay {
  date: string;
  tests: number;
  liveCoding: number;
  bugFix: number;
  hackaton: number;
  total: number;
}

interface ActivitySummary {
  timeline: ActivityDay[];
  totals: {
    last30Days: {
      total: number;
      tests: number;
      liveCoding: number;
      bugFix: number;
      hackaton: number;
    };
  };
}

interface LeaderboardTrendItem {
  date: string;
  rank: number | null;
  points: number;
  attemptCount: number;
}

type LeaderboardType = "test" | "liveCoding" | "bugFix" | "hackaton";

interface LeaderboardData {
  dailyRankTrend: Record<LeaderboardType, LeaderboardTrendItem[]>;
  pointsVsAttempts: Array<{
    type: LeaderboardType;
    periodDate: string;
    points: number;
    attemptCount: number;
    rank: number | null;
  }>;
}

interface DurationInsightEntry {
  id: string;
  quizTitle: string;
  durationSeconds: number;
  completedAt: string;
}

interface DurationInsights {
  tests: {
    averageDurationSeconds: number;
    averageScore: number;
    data: Array<
      DurationInsightEntry & {
        score: number;
      }
    >;
  };
  liveCoding: {
    averageDurationSeconds: number;
    averageCompletionRate: number;
    data: Array<
      DurationInsightEntry & {
        completionRate: number;
      }
    >;
  };
  bugFix: {
    averageDurationSeconds: number;
    averageCodeQuality: number;
    data: Array<
      DurationInsightEntry & {
        codeQuality: number | null;
        bugsFixed: number | null;
      }
    >;
  };
  hackaton: {
    averageDurationSeconds: number;
    averageProjectScore: number;
    data: Array<
      DurationInsightEntry & {
        projectScore: number | null;
        featuresCompleted: number | null;
      }
    >;
  };
}

interface BadgeInsights {
  totalBadges: number;
  distribution: Array<{
    rarity: string;
    count: number;
  }>;
  rarityProgress: Array<{
    rarity: string;
    owned: number;
    total: number;
    completionRate: number;
  }>;
  recentBadges: Array<{
    id: string;
    name: string;
    rarity: string;
    earnedAt: string;
    icon?: string | null;
    color?: string | null;
  }>;
}

interface AnalyticsData {
  summary: SummaryMetrics;
  passFail: PassFailMetrics;
  scoreTrend: ScoreTrendPoint[];
  topics: TopicPerformance[];
  difficulties: DifficultyPerformance[];
  timeOnTask: TimeOnTask;
  scoreDistribution: ScoreDistribution;
  overview: AnalyticsOverview;
  activity: ActivitySummary;
  leaderboard: LeaderboardData;
  durationInsights: DurationInsights;
  badgeInsights: BadgeInsights;
}

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const RARITY_COLORS: Record<string, string> = {
  common: "#9CA3AF",
  rare: "#3B82F6",
  epic: "#8B5CF6",
  legendary: "#F59E0B",
};

const formatDuration = (seconds: number) => {
  if (!seconds || seconds <= 0) {
    return "-";
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} g ${remainingHours} s`;
    }
    return `${hours} sa ${remainingMins} dk`;
  }
  return `${mins} dk ${secs.toString().padStart(2, "0")} sn`;
};

const formatTotalLearningTime = (seconds: number) => {
  if (!seconds || seconds <= 0) {
    return "0 dk";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} sa`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} dk`);
  }
  if (parts.length === 0) {
    parts.push("1 dk");
  }
  return parts.join(" ");
};

const formatDateLabel = (isoString: string) =>
  new Date(isoString).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
  });

const formatFullDateTime = (isoString: string) =>
  new Date(isoString).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatNumber = (value: number) => value.toLocaleString("tr-TR");

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobApplicationsCount, setJobApplicationsCount] = useState<number>(0);
  const [hackathonApplicationsCount, setHackathonApplicationsCount] = useState<number>(0);

  useEffect(() => {
    void fetchAnalytics();
    void fetchJobAndHackathonData();
  }, []);

  const fetchJobAndHackathonData = async () => {
    try {
      const [jobResponse, hackathonResponse] = await Promise.all([
        fetch("/api/jobs/applications").catch(() => ({ ok: false, json: async () => ({ applications: [] }) })),
        fetch("/api/hackathons?limit=100").catch(() => ({ ok: false, json: async () => ({ hackathons: [] }) })),
      ]);
      
      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        if (jobData.applications) {
          setJobApplicationsCount(jobData.applications.length || 0);
        }
      }

      if (hackathonResponse.ok) {
        const hackathonData = await hackathonResponse.json();
        if (hackathonData.hackathons) {
          // Count hackathons where user has applied (hasApplication field)
          const appliedCount = hackathonData.hackathons.filter((h: any) => h.hasApplication).length || 0;
          setHackathonApplicationsCount(appliedCount);
        }
      }
    } catch (error) {
      console.error("Error fetching job and hackathon data:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/education/analytics");
      if (!response.ok) {
        throw new Error("Veri yüklenirken bir hata oluştu");
      }
      const data = (await response.json()) as AnalyticsData;
      setAnalytics(data);
    } catch (fetchError) {
      console.error("Error fetching analytics:", fetchError);
      setError("Analiz verileri yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const topicChartData = useMemo(() => {
    if (!analytics || analytics.topics.length === 0) {
      return null;
    }
    return {
      labels: analytics.topics.map((topic) => topic.topic),
      datasets: [
        {
          label: "Başarı Oranı (%)",
          data: analytics.topics.map((topic) => topic.passRate),
        },
      ],
    };
  }, [analytics]);

  const difficultyChartData = useMemo(() => {
    if (!analytics || analytics.difficulties.length === 0) {
      return null;
    }
    return {
      labels: analytics.difficulties.map((item) => item.label),
      datasets: [
        {
          label: "Başarı Oranı (%)",
          data: analytics.difficulties.map((item) => item.passRate),
          backgroundColor: "#3b82f6",
        },
        {
          label: "Ortalama Skor (%)",
          data: analytics.difficulties.map((item) => item.averageScore),
          backgroundColor: "#10b981",
        },
      ],
    };
  }, [analytics]);

  const scoreTrendChartData = useMemo(() => {
    if (!analytics || analytics.scoreTrend.length === 0) {
      return null;
    }
    return {
      labels: analytics.scoreTrend.map((point) => formatDateLabel(point.completedAt)),
      datasets: [
        {
          label: "Skor",
          data: analytics.scoreTrend.map((point) => point.score),
          fill: true,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
        },
        {
          label: "Geçme Barajı",
          data: analytics.scoreTrend.map((point) => point.passingScore),
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          fill: false,
          borderDash: [6, 6],
        },
      ],
    };
  }, [analytics]);

  const scoreDistributionChart = useMemo(() => {
    if (!analytics) {
      return null;
    }
    return {
      labels: analytics.scoreDistribution.buckets.map((bucket) => bucket.label),
      datasets: [
        {
          label: "Deneme Sayısı",
          data: analytics.scoreDistribution.buckets.map((bucket) => bucket.count),
        },
      ],
    };
  }, [analytics]);

  const activityChartData = useMemo(() => {
    if (!analytics || analytics.activity.timeline.length === 0) {
      return null;
    }
    const labels = analytics.activity.timeline.map((day) => formatDateLabel(day.date));
    return {
      labels,
      datasets: [
        {
          label: "Toplam Aktivite",
          data: analytics.activity.timeline.map((day) => day.total),
        },
        {
          label: "Test",
          data: analytics.activity.timeline.map((day) => day.tests),
        },
        {
          label: "Canlı Kodlama",
          data: analytics.activity.timeline.map((day) => day.liveCoding),
        },
        {
          label: "Bug Fix",
          data: analytics.activity.timeline.map((day) => day.bugFix),
        },
      ],
    };
  }, [analytics]);

  const leaderboardRankChartData = useMemo(() => {
    if (!analytics) return null;
    const dateSet = new Set<string>();
    const types: LeaderboardType[] = ["test", "liveCoding", "bugFix", "hackaton"];
    types.forEach((type) => {
      analytics.leaderboard.dailyRankTrend[type].forEach((entry) => {
        dateSet.add(entry.date);
      });
    });
    const dates = Array.from(dateSet).sort();
    if (dates.length === 0) {
      return null;
    }
    const labels = dates.map((date) => formatDateLabel(date));
    const datasetMeta: Record<LeaderboardType, { label: string; color: string }> = {
      test: { label: "Test", color: "#2563eb" },
      liveCoding: { label: "Canlı Kodlama", color: "#10b981" },
      bugFix: { label: "Bug Fix", color: "#f59e0b" },
      hackaton: { label: "Hackaton", color: "#8b5cf6" },
    };
    const datasets = types
      .map((type) => {
        const map = new Map(
          analytics.leaderboard.dailyRankTrend[type].map((entry) => [entry.date, entry.rank])
        );
        const data = dates.map((date) => {
          const value = map.get(date);
          return typeof value === "number" ? value : Number.NaN;
        });
        if (data.every((value) => Number.isNaN(value))) {
          return null;
        }
        return {
          label: datasetMeta[type].label,
          data,
          borderColor: datasetMeta[type].color,
          backgroundColor: `${datasetMeta[type].color}33`,
          fill: false,
        };
      })
      .filter((dataset): dataset is NonNullable<typeof dataset> => dataset !== null);
    if (datasets.length === 0) {
      return null;
    }
    return { labels, datasets };
  }, [analytics]);

  const durationCorrelationChart = useMemo(() => {
    if (!analytics) return null;
    const items = [
      {
        label: "Test",
        duration: Math.round(analytics.durationInsights.tests.averageDurationSeconds / 60),
        performance: analytics.durationInsights.tests.averageScore,
      },
      {
        label: "Canlı Kodlama",
        duration: Math.round(analytics.durationInsights.liveCoding.averageDurationSeconds / 60),
        performance: analytics.durationInsights.liveCoding.averageCompletionRate,
      },
      {
        label: "Bug Fix",
        duration: Math.round(analytics.durationInsights.bugFix.averageDurationSeconds / 60),
        performance: analytics.durationInsights.bugFix.averageCodeQuality,
      },
      {
        label: "Hackaton",
        duration: Math.round(analytics.durationInsights.hackaton.averageDurationSeconds / 60),
        performance: analytics.durationInsights.hackaton.averageProjectScore,
      },
    ].filter((item) => item.duration > 0 || item.performance > 0);
    if (items.length === 0) {
      return null;
    }
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          label: "Süre (dk)",
          data: items.map((item) => item.duration),
          backgroundColor: "#2563eb",
          yAxisID: "y",
        },
        {
          label: "Performans (%)",
          data: items.map((item) => Math.round(item.performance)),
          backgroundColor: "#f97316",
          yAxisID: "y1",
        },
      ],
    };
  }, [analytics]);

  const badgeDistributionChart = useMemo(() => {
    if (!analytics || analytics.badgeInsights.distribution.length === 0) {
      return null;
    }
    const labels = analytics.badgeInsights.distribution.map(
      (item) => RARITY_LABELS[item.rarity] ?? item.rarity
    );
    const data = analytics.badgeInsights.distribution.map((item) => item.count);
    const colors = analytics.badgeInsights.distribution.map(
      (item) => RARITY_COLORS[item.rarity] ?? "#60a5fa"
    );
    return {
      labels,
      datasets: [
        {
          label: "Rozet Sayısı",
          data,
          backgroundColor: colors,
        },
      ],
    };
  }, [analytics]);

  const leaderboardSummary = useMemo(() => {
    if (!analytics) return [];
    const types: Array<{ type: LeaderboardType; label: string; accent: string }> = [
      { type: "test", label: "Test", accent: "from-blue-500/10 via-blue-500/5 to-transparent" },
      {
        type: "liveCoding",
        label: "Canlı Kodlama",
        accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      },
      { type: "bugFix", label: "Bug Fix", accent: "from-amber-500/10 via-amber-500/5 to-transparent" },
    ];
    return types.map(({ type, label, accent }) => {
      const entries = analytics.leaderboard.dailyRankTrend[type];
      const ranks = entries.filter((entry) => entry.rank !== null).map((entry) => entry.rank as number);
      const averageRank =
        ranks.length > 0 ? (ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length).toFixed(1) : null;
      const latestRank = entries.length > 0 ? entries[entries.length - 1].rank : null;
      const averagePoints =
        entries.length > 0
          ? Math.round(entries.reduce((sum, entry) => sum + entry.points, 0) / entries.length)
          : 0;
      const averageAttempts =
        entries.length > 0
          ? (entries.reduce((sum, entry) => sum + entry.attemptCount, 0) / entries.length).toFixed(1)
          : null;
      return {
        type,
        label,
        accent,
        averageRank,
        latestRank,
        averagePoints,
        averageAttempts,
      };
    });
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400">Analizler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Henüz analiz verisi bulunmuyor.</p>
      </div>
    );
  }

  // Calculate completed topics count from lesson completions
  // We'll use totalCompletions as a proxy for completed topics since analytics doesn't separate them
  const completedTopicsCount = analytics.overview.totalCompletions || 0;

  const overviewCards = [
    {
      title: "Toplam Öğrenme Süresi",
      value: formatTotalLearningTime(analytics.overview.totalLearningSeconds),
      icon: Timer,
      accent: "from-blue-500 to-cyan-500",
      description: analytics.overview.lastActivityAt
        ? `Son aktivite ${formatDateLabel(analytics.overview.lastActivityAt)}`
        : "Henüz aktivite yok",
    },
    {
      title: "Tamamlanan Eğitimler",
      value: analytics.overview.totalCompletions,
      icon: Activity,
      accent: "from-emerald-500 to-teal-500",
      description: `${analytics.overview.completionCounts.tests} test · ${completedTopicsCount} konu · ${analytics.overview.completionCounts.liveCoding} canlı kodlama · ${analytics.overview.completionCounts.bugFix} bug fix`,
    },
    {
      title: "Başvurulan İş İlanları",
      value: jobApplicationsCount,
      icon: Briefcase,
      accent: "from-purple-500 to-indigo-500",
      description: `Toplam ${jobApplicationsCount} iş ilanına başvuru yaptınız`,
    },
    {
      title: "Başvurulan Hackatonlar",
      value: hackathonApplicationsCount,
      icon: Trophy,
      accent: "from-amber-500 to-orange-500",
      description: `Toplam ${hackathonApplicationsCount} hackatona başvuru yaptınız`,
    },
  ];

  const durationHighlights = [
    {
      label: "Test",
      duration: formatDuration(analytics.durationInsights.tests.averageDurationSeconds),
      detail: `Ortalama skor %${analytics.durationInsights.tests.averageScore}`,
    },
    {
      label: "Canlı Kodlama",
      duration: formatDuration(analytics.durationInsights.liveCoding.averageDurationSeconds),
      detail: `Tamamlanma oranı %${analytics.durationInsights.liveCoding.averageCompletionRate}`,
    },
    {
      label: "Bug Fix",
      duration: formatDuration(analytics.durationInsights.bugFix.averageDurationSeconds),
      detail: `Kod kalitesi %${analytics.durationInsights.bugFix.averageCodeQuality}`,
    },
    {
      label: "Hackaton",
      duration: formatDuration(analytics.durationInsights.hackaton.averageDurationSeconds),
      detail: `Proje skoru %${analytics.durationInsights.hackaton.averageProjectScore}`,
    },
  ].filter((item) => item.duration !== "-");

  return (
    <main className="p-4 lg:p-6">
      Performans Analizi Bitirdiğiniz eğitimleri, sıralamalardaki konumunuzu ve çalışma verimliliğinizi tek ekranda takip edin. AI değerlendirmeleri ve rozetlerinizle gelişiminizi gözlemleyin. TOPLAM ÖĞRE
      <div className="space-y-10 pb-10 mt-6">

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              variant="elevated"
              hover
              className="relative overflow-hidden transition-transform duration-200 hover:-translate-y-1"
            >
              <div
                className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${card.accent} opacity-30 blur-3xl`}
              />
              <CardContent className="relative z-10 flex flex-col gap-4 px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 ${
                      card.title === "Toplam Öğrenme Süresi" || card.title === "Tamamlanan Eğitimler" ? "pt-4" : ""
                    }`}>
                      {card.title}
                    </span>
                    <span className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
                      {card.value}
                    </span>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-lg shadow-black/5 dark:bg-gray-900/60 dark:shadow-black/30">
                    <Icon className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card variant="elevated" className="xl:col-span-2">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              30 Günlük Aktivite Akışı
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gün bazlı toplam aktivite, test, canlı kodlama ve bug fix yoğunluğu
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {activityChartData ? (
              <AreaChart data={activityChartData} height={320} />
            ) : (
              <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Aktivite grafiği için yeterli veri bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarRange className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Son 30 Gün Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="rounded-xl border border-gray-200/60 bg-gray-50/60 px-4 py-3 dark:border-gray-800/60 dark:bg-gray-900/40">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Toplam Aktivite
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {formatNumber(analytics.activity.totals.last30Days.total)}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Tüm eğitim türleri</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Konu</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(completedTopicsCount)}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Test</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(analytics.activity.totals.last30Days.tests)}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Canlı Kodlama</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(analytics.activity.totals.last30Days.liveCoding)}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Bug Fix</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(analytics.activity.totals.last30Days.bugFix)}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Kurs</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(analytics.overview.courseEngagementCount)}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card variant="elevated" className="xl:col-span-2">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Günlük Liderlik Sırası
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sıralamalarda gün bazlı konum değişimi (daha düşük değer daha iyi)
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {leaderboardRankChartData ? (
              <LineChart
                data={leaderboardRankChartData}
                height={320}
                options={{
                  scales: {
                    y: {
                      reverse: true,
                      ticks: {
                        stepSize: 1,
                        precision: 0,
                      },
                      title: {
                        display: true,
                        text: "Sıra",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number | null;
                          return `${context.dataset.label}: ${value ?? "N/A"}. sıra`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Liderlik trendini gösterecek veri bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {leaderboardSummary.map((item) => (
            <Card key={item.type} variant="elevated" className="overflow-hidden">
              <div className={`h-1 w-full bg-gradient-to-r ${item.accent}`} />
              <CardContent className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Ortalama Sıra: {item.averageRank ?? "-"}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>Son Sıra: {item.latestRank ?? "-"}</p>
                  <p>Puan Ort.: {formatNumber(item.averagePoints)}</p>
                  <p>Deneme Ort.: {item.averageAttempts ?? "-"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card variant="elevated" className="lg:col-span-7">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              Süre & Performans Korelasyonu
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ortalama süre ile başarı puanları arasındaki ilişkiyi inceleyin
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {durationCorrelationChart ? (
              <BarChart
                data={durationCorrelationChart}
                height={320}
                options={{
                  scales: {
                    y: {
                      position: "left",
                      title: {
                        display: true,
                        text: "Süre (dk)",
                      },
                    },
                    y1: {
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                      suggestedMin: 0,
                      suggestedMax: 100,
                      title: {
                        display: true,
                        text: "Performans (%)",
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Süre-performans analizini gösterecek veri yok.
              </p>
            )}
          </CardContent>
        </Card>
        <Card variant="elevated" className="lg:col-span-5">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="h-5 w-5 text-teal-500 dark:text-teal-400" />
              Ortalama Tamamlama Süreleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {durationHighlights.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-gray-200/60 px-4 py-3 dark:border-gray-800/60"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.duration}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card variant="elevated" className="lg:col-span-5">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-fuchsia-500 dark:text-fuchsia-400" />
              Rozet Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {badgeDistributionChart ? (
              <PieChart data={badgeDistributionChart} height={280} variant="doughnut" />
            ) : (
              <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Henüz rozet kazanmadınız.
              </p>
            )}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Toplam rozet: {analytics.badgeInsights.totalBadges}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="lg:col-span-4">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Medal className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              Nadirlik İlerlemesi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {analytics.badgeInsights.rarityProgress.map((item) => (
              <div key={item.rarity} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {RARITY_LABELS[item.rarity] ?? item.rarity}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.owned}/{item.total} • %{item.completionRate}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.completionRate}%`,
                      backgroundColor: RARITY_COLORS[item.rarity] ?? "#3b82f6",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card variant="elevated" className="lg:col-span-3">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-rose-500 dark:text-rose-400" />
              Son Rozetler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            {analytics.badgeInsights.recentBadges.length > 0 ? (
              analytics.badgeInsights.recentBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-800/60"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{badge.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {RARITY_LABELS[badge.rarity] ?? badge.rarity} • {formatFullDateTime(badge.earnedAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Henüz rozet kazanılmadı.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Öğrenme Analizi Ayrıntıları
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card variant="elevated" className="xl:col-span-2">
            <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Skor Trendi
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Denemelerdeki skor değişimi ve geçme barajı
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {scoreTrendChartData ? (
                <LineChart
                  data={scoreTrendChartData}
                  height={320}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          title: (items) => {
                            const point = analytics.scoreTrend[items[0].dataIndex];
                            return `${point.quizTitle}`;
                          },
                          label: (context) => {
                            const point = analytics.scoreTrend[context.dataIndex];
                            const label = context.dataset.label || "";
                            if (label === "Skor") {
                              return `${label}: ${point.score}%`;
                            }
                            return `${label}: ${point.passingScore}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  Skor trendini gösterecek veri yok.
                </p>
              )}
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Başarı Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <PieChart
                data={{
                  labels: ["Başarılı", "Başarısız"],
                  datasets: [
                    {
                      label: "Deneme Sayısı",
                      data: [analytics.passFail.passed, analytics.passFail.failed],
                    },
                  ],
                }}
                height={280}
                variant="doughnut"
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">
                  <p className="font-semibold">Başarılı</p>
                  <p>{analytics.passFail.passed} deneme</p>
                </div>
                <div className="rounded-lg bg-rose-500/10 p-3 text-rose-700 dark:text-rose-300">
                  <p className="font-semibold">Başarısız</p>
                  <p>{analytics.passFail.failed} deneme</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card variant="elevated">
            <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Konu Bazlı Performans
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Başarı oranı yüksek konulara odaklanın
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {topicChartData ? (
                <BarChart
                  data={topicChartData}
                  height={360}
                  horizontal
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const topic = analytics.topics[context.dataIndex];
                            return [
                              `Başarı: ${topic.passRate}%`,
                              `Skor: ${topic.averageScore}%`,
                              `Deneme: ${topic.attempts}`,
                            ];
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  Konu bazlı performans verisi bulunamadı.
                </p>
              )}
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Zorluk Seviyesi Analizi
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seviyelere göre başarı dağılımı
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {difficultyChartData ? (
                <BarChart
                  data={difficultyChartData}
                  height={360}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          afterLabel: (context) => {
                            const difficulty = analytics.difficulties[context.dataIndex];
                            return `Deneme: ${difficulty.attempts}`;
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  Seviye verisi bulunamadı.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Skor Dağılımı
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Skor aralıklarındaki yoğunluk ve ortalamalar
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {scoreDistributionChart ? (
              <>
                <BarChart data={scoreDistributionChart} height={320} />
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Ortalama</p>
                    <p>{analytics.scoreDistribution.average}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Minimum</p>
                    <p>{analytics.scoreDistribution.min}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Maksimum</p>
                    <p>{analytics.scoreDistribution.max}%</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Skor dağılımını gösterecek veri yok.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
      </div>
    </main>
  );
}
