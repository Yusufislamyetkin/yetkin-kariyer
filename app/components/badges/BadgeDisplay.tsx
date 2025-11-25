"use client";

import { CheckCircle, Lock, Sparkles } from "lucide-react";
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

interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
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
      className={`group relative transition-transform duration-200 ${earned ? "hover:-translate-y-1" : "opacity-60"}`}
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
                  : undefined
              }
            >
              {!earned && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-300">
                    <Lock className="h-6 w-6" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Kilitli
                    </span>
                  </div>
                </>
              )}
              <span className={`relative z-10 drop-shadow-xl ${sizeConfig.icon}`}>
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
      <div className="mt-3 text-center space-y-1">
        <p className={`text-sm font-semibold tracking-wide ${earned ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
          {badge.name}
        </p>
        {size !== "sm" && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{badge.points} puan</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span>{badge.category}</span>
            </div>
            {badge.tier && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-gradient-to-r ${tierColors[badge.tier]} text-white shadow-sm`}>
                {tierNames[badge.tier]}
              </span>
            )}
          </div>
        )}
        {size === "lg" && badge.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 px-4 line-clamp-2">
            {badge.description}
          </p>
        )}
      </div>
    </div>
  );
}

interface BadgeCollectionProps {
  badges: Badge[];
  earnedBadgeIds?: Set<string>;
}

export function BadgeCollection({
  badges,
  earnedBadgeIds = new Set(),
}: BadgeCollectionProps) {
  const sortedBadges = [...badges].sort((a, b) => {
    const aEarned = earnedBadgeIds.has(a.id);
    const bEarned = earnedBadgeIds.has(b.id);

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {sortedBadges.map((badge) => (
        <BadgeDisplay
          key={badge.id}
          badge={badge}
          earned={earnedBadgeIds.has(badge.id)}
        />
      ))}
    </div>
  );
}

