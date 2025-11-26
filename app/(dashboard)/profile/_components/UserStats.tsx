"use client";

import { Flame, Trophy, Star, BookOpen, FileText, Code, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

interface UserStatsProps {
  level: number;
  points: number;
  xp: number;
  streak: {
    current: number;
    longest: number;
  };
  stats: {
    completedLessons: number;
    quizAttempts: number;
    testAttempts: number;
    liveCodingAttempts: number;
    bugFixAttempts: number;
  };
}

export function UserStats({
  level,
  points,
  xp,
  streak,
  stats,
}: UserStatsProps) {
  // Calculate XP needed for next level (simplified formula: level * 1000)
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = xp - xpForCurrentLevel;
  const progressPercentage = Math.min((xpProgress / xpNeeded) * 100, 100);

  const totalCompleted = 
    stats.completedLessons + 
    stats.quizAttempts + 
    stats.testAttempts + 
    stats.liveCodingAttempts + 
    stats.bugFixAttempts;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Points */}
        <Card variant="glass" className="relative overflow-hidden tech-card-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Kazanılan Puan
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {points.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Level */}
        <Card variant="glass" className="relative overflow-hidden tech-card-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{level}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                  <Trophy className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Seviye
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Seviye {level}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {xpProgress}/{xpNeeded} XP
            </p>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card variant="glass" className="relative overflow-hidden tech-card-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Flame className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Günlük Streak
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {streak.current}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              En uzun: {streak.longest} gün
            </p>
          </CardContent>
        </Card>

        {/* Total Completed */}
        <Card variant="glass" className="relative overflow-hidden tech-card-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Tamamlanan İçerik
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalCompleted}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Toplam eğitim içeriği
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress Bar */}
      <Card variant="gradient" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Seviye İlerlemesi
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seviye {level} → {level + 1}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              %{Math.round(progressPercentage)}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{xpProgress} XP</span>
            <span>{xpNeeded} XP gerekli</span>
          </div>
        </CardContent>
      </Card>

      {/* Education Content Breakdown */}
      <Card variant="glass" className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Eğitim İçerikleri
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tamamlanan eğitim içerikleri detayı
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ders</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.completedLessons}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Test</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.testAttempts}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Canlı Kodlama</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.liveCodingAttempts}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200/50 dark:border-orange-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bug Fix</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.bugFixAttempts}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

