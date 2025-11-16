import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// İstatistiksel hesaplamalar için yardımcı fonksiyonlar
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
  const variance = squaredDiffs.reduce((sum, n) => sum + n, 0) / numbers.length;
  return Math.sqrt(variance);
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employerId = session.user.id as string;

    // Tüm iş ilanlarını ve başvuruları getir
    const jobs = await prisma.job.findMany({
      where: { employerId },
      include: {
        applications: {
          orderBy: {
            appliedAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (jobs.length === 0) {
      return NextResponse.json({
        totalJobs: 0,
        publishedJobs: 0,
        draftJobs: 0,
        closedJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        reviewingApplications: 0,
        averageScore: 0,
        timeSeries: {
          weekly: [],
          monthly: [],
          daily: [],
        },
        jobPerformance: [],
        statistics: {
          median: 0,
          standardDeviation: 0,
          min: 0,
          max: 0,
        },
      });
    }

    // Temel istatistikler
    const totalJobs = jobs.length;
    const publishedJobs = jobs.filter((j) => j.status === "published").length;
    const draftJobs = jobs.filter((j) => j.status === "draft").length;
    const closedJobs = jobs.filter((j) => j.status === "closed").length;

    // Başvuru istatistikleri
    const allApplications = jobs.flatMap((job) => job.applications);
    const totalApplications = allApplications.length;
    const pendingApplications = allApplications.filter(
      (a) => a.status === "pending"
    ).length;
    const acceptedApplications = allApplications.filter(
      (a) => a.status === "accepted"
    ).length;
    const rejectedApplications = allApplications.filter(
      (a) => a.status === "rejected"
    ).length;
    const reviewingApplications = allApplications.filter(
      (a) => a.status === "reviewing"
    ).length;

    // Skor istatistikleri
    const scores = allApplications
      .map((a) => a.score)
      .filter((s): s is number => s !== null && s !== undefined);
    const averageScore =
      scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        : 0;

    // Zaman serisi verileri (başvuru trendleri)
    const dailyData: Record<
      string,
      { date: string; count: number; accepted: number; rejected: number }
    > = {};
    const weeklyData: Record<
      string,
      { week: string; count: number; accepted: number; rejected: number }
    > = {};
    const monthlyData: Record<
      string,
      { month: string; count: number; accepted: number; rejected: number }
    > = {};

    allApplications.forEach((application) => {
      const date = new Date(application.appliedAt);
      const dateStr = date.toISOString().split("T")[0];
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekStr = weekStart.toISOString().split("T")[0];
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      // Günlük
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, count: 0, accepted: 0, rejected: 0 };
      }
      dailyData[dateStr].count += 1;
      if (application.status === "accepted") dailyData[dateStr].accepted += 1;
      if (application.status === "rejected") dailyData[dateStr].rejected += 1;

      // Haftalık
      if (!weeklyData[weekStr]) {
        weeklyData[weekStr] = { week: weekStr, count: 0, accepted: 0, rejected: 0 };
      }
      weeklyData[weekStr].count += 1;
      if (application.status === "accepted") weeklyData[weekStr].accepted += 1;
      if (application.status === "rejected") weeklyData[weekStr].rejected += 1;

      // Aylık
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { month: monthStr, count: 0, accepted: 0, rejected: 0 };
      }
      monthlyData[monthStr].count += 1;
      if (application.status === "accepted") monthlyData[monthStr].accepted += 1;
      if (application.status === "rejected") monthlyData[monthStr].rejected += 1;
    });

    const daily = Object.values(dailyData)
      .sort((a, b) => a.date.localeCompare(b.date));
    const weekly = Object.values(weeklyData)
      .sort((a, b) => a.week.localeCompare(b.week));
    const monthly = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // İlan performans metrikleri
    const jobPerformance = jobs.map((job) => {
      const applications = job.applications;
      const applicationScores = applications
        .map((a) => a.score)
        .filter((s): s is number => s !== null && s !== undefined);
      const avgScore =
        applicationScores.length > 0
          ? Math.round(
              applicationScores.reduce((sum, s) => sum + s, 0) /
                applicationScores.length
            )
          : 0;

      return {
        jobId: job.id,
        jobTitle: job.title,
        totalApplications: applications.length,
        acceptedCount: applications.filter((a) => a.status === "accepted")
          .length,
        rejectedCount: applications.filter((a) => a.status === "rejected")
          .length,
        pendingCount: applications.filter((a) => a.status === "pending").length,
        averageScore: avgScore,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
      };
    });

    // İstatistiksel özetler
    const statistics = {
      median: scores.length > 0 ? Math.round(calculateMedian(scores)) : 0,
      standardDeviation:
        scores.length > 0
          ? Math.round(calculateStandardDeviation(scores) * 100) / 100
          : 0,
      min: scores.length > 0 ? Math.min(...scores) : 0,
      max: scores.length > 0 ? Math.max(...scores) : 0,
      average: averageScore,
    };

    return NextResponse.json({
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      reviewingApplications,
      averageScore,
      timeSeries: {
        weekly,
        monthly,
        daily,
      },
      jobPerformance,
      statistics,
    });
  } catch (error) {
    console.error("Error fetching employer analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

