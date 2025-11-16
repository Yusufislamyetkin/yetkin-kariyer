"use client";

import { Award } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

type BadgePlacement = "attached" | "inline";

interface BadgeOverlayProps {
  badges: Badge[];
  className?: string;
  placement?: BadgePlacement;
}

export function BadgeOverlay({
  badges,
  className = "",
  placement = "attached",
}: BadgeOverlayProps) {
  const displayedBadges = badges.slice(0, 3); // Max 3 badges

  if (displayedBadges.length === 0) {
    return null;
  }

  return (
    <div
      className={
        placement === "attached"
          ? `absolute left-1/2 top-full z-10 -translate-x-1/2 translate-y-2 ${className}`
          : `flex items-center gap-2 ${className}`
      }
    >
      <div
        className={
          placement === "attached"
            ? "flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg backdrop-blur-md transition duration-200 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-200"
            : "flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm dark:border-gray-700/70 dark:bg-gray-800/80 dark:text-gray-200"
        }
      >
        {displayedBadges.map((badge, index) => (
          <div
            key={badge.id}
            className="relative group"
            style={{
              zIndex: displayedBadges.length - index,
            }}
          >
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/90 text-lg transition-transform duration-200 group-hover:scale-110 dark:border-white/20 dark:bg-gray-900/80"
              style={{
                background: `linear-gradient(135deg, ${badge.color}bb, ${badge.color}66)`,
              }}
              title={badge.name}
            >
              <span className="drop-shadow-md">{badge.icon}</span>
              <div className="absolute inset-0 rounded-full border border-white/40 dark:border-white/10" />
            </div>
            {placement === "attached" ? (
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 px-2.5 py-1.5 rounded-full bg-gray-900/90 text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none">
                {badge.name}
              </div>
            ) : (
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 px-2 py-1 rounded-full bg-gray-900/95 text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none">
                {badge.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

