"use client";

import { Flame, Trophy, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

interface GamificationSummaryProps {
  level: number;
  points: number;
  xp: number;
  streak: {
    current: number;
    longest: number;
  };
}

export function GamificationSummary({
  level,
  points,
  xp,
  streak,
}: GamificationSummaryProps) {
  // Calculate points needed for next level based on points-based leveling
  // Formula: 25 * n * (n + 3) - Linear at start, gradually increases
  const pointsForLevel = (lvl: number): number => {
    if (lvl <= 1) return 0;
    return Math.floor(25 * lvl * (lvl + 3));
  };
  
  const pointsForCurrentLevel = pointsForLevel(level);
  const pointsForNextLevel = pointsForLevel(level + 1);
  const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
  const pointsProgress = points - pointsForCurrentLevel;
  const progressPercentage = Math.min((pointsProgress / pointsNeeded) * 100, 100);

  return (
    <Card variant="gradient" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
      <CardContent className="relative p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Level */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 p-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl pt-4">
                <span className="text-4xl font-bold text-white">{level}</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-yellow-900" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              Seviye
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {pointsProgress}/{pointsNeeded} Puan
            </p>
          </div>

          {/* Points */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 p-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl pt-4">
                <Star className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              Toplam Puan
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {points.toLocaleString()}
            </p>
          </div>

          {/* Total Earnings */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 p-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-2xl pt-4">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              TOPLAM KAZANÇ
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {points.toLocaleString()}
            </p>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 p-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-2xl pt-4">
                <Flame className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              Günlük Streak
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {streak.current}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              En uzun: {streak.longest}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Seviye {level} → {level + 1}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              %{Math.round(progressPercentage)}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

