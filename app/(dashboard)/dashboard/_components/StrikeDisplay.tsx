"use client";

import { useState } from "react";
import { Flame, Calendar, Target, BookOpen, MessageCircle, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { DayDetailModal } from "./DayDetailModal";

interface DayTaskStatus {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
  tasks: {
    login: boolean;
    testSolved: boolean;
    topicCompleted: boolean;
    socialInteraction: boolean;
    communityContribution: boolean;
  };
  allTasksCompleted: boolean;
  taskDetails?: {
    login?: { completedAt: string | null };
    testSolved?: { completedAt: string | null; count: number };
    topicCompleted?: { completedAt: string | null; count: number };
    socialInteraction?: { completedAt: string | null; count: number };
    communityContribution?: { completedAt: string | null; count: number };
  };
}

interface StrikeData {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  todayCompleted: {
    login: boolean;
    testSolved: boolean;
    topicCompleted: boolean;
    socialInteraction: boolean;
    communityContribution: boolean;
  };
  weekDays: DayTaskStatus[];
  weeklyProgress: {
    daysCompleted: number;
    totalDays: number;
    registrationDate: string;
    weekStart: string;
    weekEnd: string;
  };
}

interface StrikeDisplayProps {
  strikeData: StrikeData | null;
  loading?: boolean;
}

export function StrikeDisplay({ strikeData, loading }: StrikeDisplayProps) {
  const [selectedDay, setSelectedDay] = useState<DayTaskStatus | null>(null);
  const [isCheckingReward, setIsCheckingReward] = useState(false);

  if (loading) {
    return (
      <Card variant="elevated" className="border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default values if strikeData is null
  const defaultStrikeData = {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysActive: 0,
    todayCompleted: {
      login: false,
      testSolved: false,
      topicCompleted: false,
      socialInteraction: false,
      communityContribution: false,
    },
    weekDays: [],
    weeklyProgress: {
      daysCompleted: 0,
      totalDays: 7,
      registrationDate: new Date().toISOString(),
      weekStart: new Date().toISOString(),
      weekEnd: new Date().toISOString(),
    },
  };

  const strike = strikeData || defaultStrikeData;
  const { currentStreak, longestStreak, totalDaysActive, todayCompleted, weekDays, weeklyProgress } = strike;
  const weeklyPercentage = (weeklyProgress.daysCompleted / weeklyProgress.totalDays) * 100;

  const handleDayClick = (day: DayTaskStatus) => {
    if (!day.isFuture) {
      setSelectedDay(day);
    }
  };

  const handleCheckReward = async () => {
    setIsCheckingReward(true);
    try {
      const response = await fetch("/api/strike/reward", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.eligible && !data.alreadyAwarded) {
        alert(`🎉 Tebrikler! ${data.badge.points} puan kazandınız!`);
        // Refresh the page to update the display
        window.location.reload();
      } else if (data.alreadyAwarded) {
        alert("Bu hafta zaten ödül kazandınız!");
      } else {
        alert(`Henüz ödül için yeterli değil. ${data.daysCompleted}/${data.totalDays} gün tamamlandı.`);
      }
    } catch (error) {
      console.error("Error checking reward:", error);
      alert("Ödül kontrolü sırasında bir hata oluştu.");
    } finally {
      setIsCheckingReward(false);
    }
  };

  return (
    <Card variant="elevated" className="border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl text-orange-700 dark:text-orange-300">
          <Flame className="h-6 w-6" />
          Günlük Strike
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Main Strike Display */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Flame className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Mevcut Strike</p>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {currentStreak} <span className="text-xl sm:text-2xl text-orange-600 dark:text-orange-400">gün</span>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                En uzun: {longestStreak} gün
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Toplam Aktif Gün</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalDaysActive}
            </p>
          </div>
        </div>

        {/* Weekly Days Visualization (Monday to Sunday) */}
        <div className="space-y-2 md:space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Haftalık Görünüm (Pazartesi - Pazar)</p>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {weekDays.length > 0 ? weekDays.map((day) => {
              const allCompleted = day.allTasksCompleted;
              const hasAnyActivity = day.tasks.login || day.tasks.testSolved || day.tasks.topicCompleted || 
                                     day.tasks.socialInteraction || day.tasks.communityContribution;
              
              return (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day)}
                  disabled={day.isFuture}
                  className={`flex flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-2 rounded-lg border-2 transition-all ${
                    day.isFuture
                      ? "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-50"
                      : allCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-600 dark:border-green-500 shadow-md hover:shadow-lg cursor-pointer"
                      : hasAnyActivity
                      ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-500 dark:border-orange-600 shadow-md hover:shadow-lg cursor-pointer"
                      : "bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer"
                  } ${day.isToday ? "ring-1 sm:ring-2 ring-orange-300 dark:ring-orange-600 ring-offset-1 sm:ring-offset-2" : ""}`}
                >
                  <div className={`text-[10px] sm:text-xs font-bold ${
                    allCompleted || hasAnyActivity
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {allCompleted ? "✓✓✓" : hasAnyActivity ? "✓" : "○"}
                  </div>
                  <div className={`text-[8px] sm:text-[10px] font-medium text-center leading-tight ${
                    allCompleted || hasAnyActivity
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {day.isToday ? "Bugün" : `${day.dayName} ${day.dayNumber}`}
                  </div>
                </button>
              );
            }) : (
              // Placeholder for empty weekDays
              Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-50"
                >
                  <div className="text-xs font-bold text-gray-400">○</div>
                  <div className="text-[10px] font-medium text-center leading-tight text-gray-400">-</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Progress */}
        <div className="space-y-2 md:space-y-3">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Bugünün Hedefleri</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Strike alabilmek için günün tüm görevlerinin tamamlanması gerekmektedir.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border-2 ${
              todayCompleted.login
                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}>
              <Calendar className={`h-5 w-5 ${
                todayCompleted.login
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              <span className={`text-xs font-medium ${
                todayCompleted.login
                  ? "text-green-700 dark:text-green-300"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {todayCompleted.login ? "✓ Giriş" : "Giriş"}
              </span>
            </div>
            <div className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border-2 ${
              todayCompleted.testSolved
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}>
              <Target className={`h-5 w-5 ${
                todayCompleted.testSolved
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              <span className={`text-xs font-medium ${
                todayCompleted.testSolved
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {todayCompleted.testSolved ? "✓ Test" : "Test"}
              </span>
            </div>
            <div className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border-2 ${
              todayCompleted.topicCompleted
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}>
              <BookOpen className={`h-5 w-5 ${
                todayCompleted.topicCompleted
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              <span className={`text-xs font-medium ${
                todayCompleted.topicCompleted
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {todayCompleted.topicCompleted ? "✓ Konu" : "Konu"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <div className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border-2 ${
              todayCompleted.socialInteraction
                ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}>
              <MessageCircle className={`h-5 w-5 ${
                todayCompleted.socialInteraction
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              <span className={`text-xs font-medium ${
                todayCompleted.socialInteraction
                  ? "text-cyan-700 dark:text-cyan-300"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {todayCompleted.socialInteraction ? "✓ Sosyal" : "Sosyal"}
              </span>
            </div>
            <div className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border-2 ${
              todayCompleted.communityContribution
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}>
              <Users className={`h-5 w-5 ${
                todayCompleted.communityContribution
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              <span className={`text-xs font-medium ${
                todayCompleted.communityContribution
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {todayCompleted.communityContribution ? "✓ Topluluk" : "Topluluk"}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Haftalık İlerleme</p>
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {weeklyProgress.daysCompleted} / {weeklyProgress.totalDays} gün
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${weeklyPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {weeklyProgress.daysCompleted === weeklyProgress.totalDays
                ? "🎉 Tüm günler tamamlandı! Ödül kazanabilirsiniz!"
                : `${weeklyProgress.totalDays - weeklyProgress.daysCompleted} gün kaldı`}
            </p>
            {weeklyProgress.daysCompleted === weeklyProgress.totalDays && (
              <button
                onClick={handleCheckReward}
                disabled={isCheckingReward}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trophy className="w-3 h-3" />
                {isCheckingReward ? "Kontrol ediliyor..." : "Ödül Al"}
              </button>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </Card>
  );
}

