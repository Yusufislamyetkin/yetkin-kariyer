"use client";

import { CheckCircle, Sparkles } from "lucide-react";
import { Card } from "@/app/components/ui/Card";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  earnedAt?: string;
  isDisplayed?: boolean;
}

interface BadgeProgress {
  current: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
}

interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  progress?: BadgeProgress;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600",
};

const rarityBorders = {
  common: "border-gray-300 dark:border-gray-700",
  rare: "border-blue-300 dark:border-blue-700",
  epic: "border-purple-300 dark:border-purple-700",
  legendary: "border-yellow-300 dark:border-orange-700",
};

const tierNames = {
  bronze: "Başlangıç Seviye",
  silver: "Orta Seviye",
  gold: "İleri Seviye",
  platinum: "Efsanevi",
};

const tierColors = {
  bronze: "from-amber-600 to-orange-600",
  silver: "from-gray-400 to-gray-600",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-purple-400 to-pink-500",
};

export function BadgeDisplay({
  badge,
  earned = false,
  onClick,
  size = "md",
  progress,
}: BadgeDisplayProps) {
  const sizeConfig = {
    sm: {
      container: "w-16 h-16",
      icon: "text-2xl",
      padding: "p-3",
    },
    md: {
      container: "w-24 h-24",
      icon: "text-4xl",
      padding: "p-5",
    },
    lg: {
      container: "w-32 h-32",
      icon: "text-5xl",
      padding: "p-6",
    },
  }[size];

  return (
    <div
      className={`group relative transition-transform duration-200 flex flex-col h-full ${earned ? "hover:-translate-y-1" : "opacity-60"}`}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-3xl blur-xl transition-opacity duration-300 ${earned ? "opacity-60" : "opacity-20"} ${earned ? `bg-gradient-to-br ${rarityColors[badge.rarity]}` : "bg-gray-400 dark:bg-gray-700"}`}
        />
        <div
          className={`relative rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-[0_25px_40px_-25px_rgba(30,64,175,0.35)]`}
        >
          <div
            className={`flex flex-col items-center ${sizeConfig.padding} gap-4`}
          >
            <div
              className={`relative ${sizeConfig.container} rounded-2xl flex items-center justify-center text-white shadow-inner overflow-hidden`}
              style={
                earned && badge.color
                  ? {
                      background: `linear-gradient(135deg, ${badge.color}dd, ${badge.color}88)`,
                    }
                  : {
                      background: `linear-gradient(135deg, #9ca3af, #6b7280)`,
                    }
              }
            >
              {!earned && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-80" />
              )}
              <span className={`relative z-10 drop-shadow-xl ${sizeConfig.icon} ${!earned ? "opacity-50" : ""}`}>
                {badge.icon || "🏅"}
              </span>
              {earned && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-80 mix-blend-screen" />
              )}
              <div className="absolute -inset-1 rounded-2xl border border-white/30 dark:border-white/10 pointer-events-none" />
            </div>
            {earned && (
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-white/90 dark:bg-white/10 text-gray-900 dark:text-gray-50 shadow-sm border border-white/40 dark:border-white/10`}>
                <Sparkles className="h-3 w-3 text-yellow-400" />
                {badge.rarity === "common" && "Klasik"}
                {badge.rarity === "rare" && "Nadir"}
                {badge.rarity === "epic" && "Efsanevi"}
                {badge.rarity === "legendary" && "Mitik"}
              </span>
            )}
            {!earned && (
              <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-gray-200/70 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 border border-gray-200/70 dark:border-gray-700/70">
                Kilitli
              </span>
            )}
          </div>
          {earned && (
            <div className="absolute -top-2 -right-2 rounded-full bg-white dark:bg-gray-900 p-1 shadow-lg">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 text-center space-y-2 flex-1 flex flex-col">
        <div className="flex-1">
          <p className={`text-sm font-semibold tracking-wide ${earned ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
            {badge.name}
          </p>
          {size !== "sm" && (
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{badge.points} puan</span>
              </div>
              {badge.tier && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-gradient-to-r ${tierColors[badge.tier]} text-white shadow-sm`}>
                  {tierNames[badge.tier]}
                </span>
              )}
            </div>
          )}
          {badge.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 px-2 mt-2 leading-relaxed">
              {badge.description}
            </p>
          )}
        </div>
        <div className="mt-3 min-h-[4.5rem] flex flex-col justify-end">
          {progress && progress.target > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs px-2">
                <span className={`font-medium ${earned ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                  İlerleme
                </span>
                <span className={`font-semibold ${earned ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                  {progress.current} / {progress.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    earned
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className={`text-xs text-center font-medium px-2 mt-1 min-h-[1.25rem] ${progress.isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-transparent"}`}>
                {progress.isCompleted ? "Tamamlandı ✓" : "\u00A0"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs px-2 opacity-0 pointer-events-none">
                <span className="font-medium">İlerleme</span>
                <span className="font-semibold">0 / 0</span>
              </div>
              <div className="w-full bg-transparent rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full" />
              </div>
              <p className="text-xs text-center text-transparent font-medium px-2 mt-1 min-h-[1.25rem]">
                &nbsp;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BadgeCollectionProps {
  badges: Badge[];
  earnedBadgeIds?: Set<string>;
  progressMap?: Map<string, BadgeProgress>;
}

export function BadgeCollection({
  badges,
  earnedBadgeIds = new Set(),
  progressMap,
}: BadgeCollectionProps) {
  const sortedBadges = [...badges].sort((a, b) => {
    const aProgress = progressMap?.get(a.id);
    const bProgress = progressMap?.get(b.id);
    // Rozet kazanılmışsa veya ilerleme tamamlanmışsa açık say
    const aEarned = earnedBadgeIds.has(a.id) || (aProgress?.isCompleted === true);
    const bEarned = earnedBadgeIds.has(b.id) || (bProgress?.isCompleted === true);

    if (aEarned !== bEarned) {
      return aEarned ? -1 : 1;
    }

    if (aEarned && bEarned) {
      const aEarnedAt = a.earnedAt ? new Date(a.earnedAt).getTime() : 0;
      const bEarnedAt = b.earnedAt ? new Date(b.earnedAt).getTime() : 0;

      if (aEarnedAt !== bEarnedAt) {
        return bEarnedAt - aEarnedAt;
      }
    }

    return a.name.localeCompare(b.name, "tr");
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {sortedBadges.map((badge) => {
        const progress = progressMap?.get(badge.id);
        // Rozet kazanılmışsa veya ilerleme tamamlanmışsa açık göster
        const isEarned = earnedBadgeIds.has(badge.id) || (progress?.isCompleted === true);
        return (
          <BadgeDisplay
            key={badge.id}
            badge={badge}
            earned={isEarned}
            progress={progress}
          />
        );
      })}
    </div>
  );
}

