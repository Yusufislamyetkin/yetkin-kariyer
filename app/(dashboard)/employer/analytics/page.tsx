"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BarChart3,
  Activity,
  Filter,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import LineChart from "@/app/components/charts/LineChart";
import BarChart from "@/app/components/charts/BarChart";
import PieChart from "@/app/components/charts/PieChart";
import AreaChart from "@/app/components/charts/AreaChart";
import RadarChart from "@/app/components/charts/RadarChart";

interface JobStats {
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  closedJobs: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  reviewingApplications: number;
  averageScore: number;
  timeSeries?: {
    weekly: { week: string; count: number; accepted: number; rejected: number }[];
    monthly: { month: string; count: number; accepted: number; rejected: number }[];
    daily: { date: string; count: number; accepted: number; rejected: number }[];
  };
  jobPerformance?: {
    jobId: string;
    jobTitle: string;
    totalApplications: number;
    acceptedCount: number;
    rejectedCount: number;
    pendingCount: number;
    averageScore: number;
    status: string;
    createdAt: string;
  }[];
  statistics?: {
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
    average: number;
  };
}

type TimeRange = "daily" | "weekly" | "monthly";

export default function EmployerAnalyticsPage() {
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/employer/analytics");
      if (!response.ok) {
        throw new Error("Veri yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Analiz verileri yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeRange === "daily") {
      return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
    } else if (timeRange === "weekly") {
      return `Hafta ${date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}`;
    } else {
      return date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    }
  };

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          İstatistikler yüklenemedi
        </p>
      </div>
    );
  }

  // Zaman serisi verileri
  const timeSeriesData = stats.timeSeries?.[timeRange] || [];
  const timeSeriesLabels = timeSeriesData.map((item) => {
    if (timeRange === "daily") {
      return formatDate((item as { date: string; count: number; accepted: number; rejected: number }).date);
    } else if (timeRange === "weekly") {
      return formatDate((item as { week: string; count: number; accepted: number; rejected: number }).week);
    } else {
      return formatDate((item as { month: string; count: number; accepted: number; rejected: number }).month + "-01");
    }
  });
  const applicationCounts = timeSeriesData.map((item) => item.count);
  const acceptedCounts = timeSeriesData.map((item) => item.accepted);
  const rejectedCounts = timeSeriesData.map((item) => item.rejected);

  // İlan performans verileri
  const jobPerformance = stats.jobPerformance || [];
  const topJobs = [...jobPerformance]
    .sort((a, b) => b.totalApplications - a.totalApplications)
    .slice(0, 10);
  const jobTitles = topJobs.map((job) => job.jobTitle);
  const jobApplicationCounts = topJobs.map((job) => job.totalApplications);

  // Başvuru durumu dağılımı
  const applicationStatusData = [
    stats.pendingApplications,
    stats.reviewingApplications,
    stats.acceptedApplications,
    stats.rejectedApplications,
  ];

  // İlan durumu dağılımı
  const jobStatusData = [
    stats.publishedJobs,
    stats.draftJobs,
    stats.closedJobs,
  ];

  // Radar chart için performans metrikleri
  const radarLabels = [
    "Toplam İlan",
    "Başvuru Sayısı",
    "Kabul Oranı",
    "Ortalama Skor",
    "Aktif İlan",
  ];
  const radarData = [
    Math.min((stats.totalJobs / 20) * 100, 100),
    Math.min((stats.totalApplications / 100) * 100, 100),
    stats.totalApplications > 0
      ? (stats.acceptedApplications / stats.totalApplications) * 100
      : 0,
    stats.averageScore,
    stats.publishedJobs > 0 ? (stats.publishedJobs / stats.totalJobs) * 100 : 0,
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            İşveren Analitikleri
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            İlanlarınız ve başvurularınızın detaylı analizi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Günlük</option>
            <option value="weekly">Haftalık</option>
            <option value="monthly">Aylık</option>
          </select>
        </div>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <Briefcase className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.totalJobs}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Toplam İlan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <FileText className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.publishedJobs}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Yayında
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <Users className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.totalApplications}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Toplam Başvuru
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <Award className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.averageScore}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Ortalama Skor
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İstatistiksel Özet */}
      {stats.statistics && (
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              İstatistiksel Özet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ortalama Skor</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.statistics.average}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Medyan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.statistics.median}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Standart Sapma</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.statistics.standardDeviation.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Min / Max</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.statistics.min}% / {stats.statistics.max}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zaman Serisi Grafikleri */}
      {timeSeriesData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Başvuru Trendi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={{
                  labels: timeSeriesLabels,
                  datasets: [
                    {
                      label: "Toplam Başvuru",
                      data: applicationCounts,
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                    {
                      label: "Kabul Edilen",
                      data: acceptedCounts,
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                    {
                      label: "Reddedilen",
                      data: rejectedCounts,
                      borderColor: "#ef4444",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                height={300}
              />
            </CardContent>
          </Card>

          <Card variant="elevated" className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                Başvuru Değişimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={{
                  labels: timeSeriesLabels,
                  datasets: [
                    {
                      label: "Toplam Başvuru",
                      data: applicationCounts,
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      tension: 0.4,
                    },
                  ],
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Başvuru ve İlan Analizleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Başvuru Durumu Dağılımı */}
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Başvuru Durumu Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={{
                labels: ["Beklemede", "İnceleniyor", "Kabul Edilen", "Reddedilen"],
                datasets: [
                  {
                    label: "Başvuru Sayısı",
                    data: applicationStatusData,
                  },
                ],
              }}
              height={300}
              variant="doughnut"
            />
          </CardContent>
        </Card>

        {/* İlan Durumu Dağılımı */}
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              İlan Durumu Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={{
                labels: ["Yayında", "Taslak", "Kapalı"],
                datasets: [
                  {
                    label: "İlan Sayısı",
                    data: jobStatusData,
                  },
                ],
              }}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* İlan Performans Analizi */}
      {jobTitles.length > 0 && (
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              İlana Göre Başvuru Sayıları (Top 10)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={{
                labels: jobTitles,
                datasets: [
                  {
                    label: "Başvuru Sayısı",
                    data: jobApplicationCounts,
                  },
                ],
              }}
              height={350}
              horizontal
            />
          </CardContent>
        </Card>
      )}

      {/* Performans Metrikleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Performans Karşılaştırması
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart
              data={{
                labels: radarLabels,
                datasets: [
                  {
                    label: "Performans",
                    data: radarData,
                  },
                ],
              }}
              height={350}
            />
          </CardContent>
        </Card>

        {/* Başvuru Durumları Detay */}
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              Başvuru Durumları Detay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Beklemede
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.pendingApplications}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    İnceleniyor
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.reviewingApplications}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Kabul Edilen
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.acceptedApplications}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Reddedilen
                  </span>
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.rejectedApplications}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
