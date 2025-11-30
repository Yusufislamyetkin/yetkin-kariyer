"use client";

import {
  FileText,
  Code,
  Bug,
  Trophy,
  Award,
  TrendingUp,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

interface StatsGridProps {
  stats: {
    badgeCount: number;
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
  leaderboardRank?: {
    daily?: number;
    monthly?: number;
  };
}

export function StatsGrid({ stats, leaderboardRank }: StatsGridProps) {
  const statCards = [
    {
      title: "Eğitim Sayıları",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      items: [
        { label: "Konu Bitirme Sayısı", value: stats.quizAttempts },
        { label: "Test Bitirme", value: stats.testAttempts },
        { label: "Live Coding", value: stats.liveCodingAttempts },
        { label: "Bug Fix", value: stats.bugFixAttempts },
      ],
    },
    {
      title: "Ortalama Skorlar",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      items: [
        { label: "Konu", value: `${stats.averageScores.quiz}%` },
        { label: "Test", value: `${stats.averageScores.test}%` },
        { label: "Canlı Kodlama", value: `${stats.averageScores.liveCoding}%` },
        { label: "Bug Fix", value: `${stats.averageScores.bugFix}%` },
      ],
    },
    {
      title: "Rozetler",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
      items: [
        { label: "Toplam Rozet", value: stats.badgeCount },
        { label: "Kazanılan", value: stats.badgeCount },
      ],
    },
    {
      title: "Leaderboard",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      items: [
        {
          label: "Günlük Sıralama",
          value: leaderboardRank?.daily ? `#${leaderboardRank.daily}` : "N/A",
        },
        {
          label: "Aylık Sıralama",
          value: leaderboardRank?.monthly ? `#${leaderboardRank.monthly}` : "N/A",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            variant="glass"
            hover
            className="relative overflow-hidden tech-card-glow"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}
            />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stat.title}
                </CardTitle>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-2">
              {stat.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50 last:border-0"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

