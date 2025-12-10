"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Gem,
  Medal,
  ShieldCheck,
  Trophy,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type LeaderboardEntry } from "@/app/components/competition/types";

interface RankingListProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const containerHighlightByRank = [
  "lux-glow border-transparent bg-gradient-to-br from-[#61c5ff]/50 via-[#6f49ff]/35 to-[#ffe9c9]/50 shadow-[0_22px_48px_-28px_rgba(79,70,229,0.8)] ring-2 ring-sky-400/40",
  "lux-glow border-transparent bg-gradient-to-br from-[#ffe7a0]/60 via-[#f8b84f]/40 to-[#fff4d9]/65 shadow-[0_22px_48px_-28px_rgba(217,119,6,0.75)] ring-2 ring-amber-400/40",
  "lux-glow border-transparent bg-gradient-to-br from-[#fdba74]/55 via-[#fb923c]/40 to-[#f97316]/50 shadow-[0_22px_48px_-28px_rgba(251,146,60,0.7)] ring-2 ring-orange-400/40",
];

const badgeGradientByRank = [
  "bg-gradient-to-br from-[#7dd7ff] via-[#4c6ef5] to-[#c4b5fd]",
  "bg-gradient-to-br from-[#ffe29d] via-[#f7b733] to-[#f0c27b]",
  "bg-gradient-to-br from-[#fb923c] via-[#f97316] to-[#ea580c]",
];

const iconByRank = [Gem, Trophy, Medal];

export function RankingList({ entries, currentUserId }: RankingListProps) {
  if (!entries.length) {
    return null;
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry) => {
        const rankIndex = entry.rank - 1;
        const isTopThree = rankIndex < 3;
        const isCurrentUser = entry.userId === currentUserId;
        const Icon = iconByRank[rankIndex] ?? Medal;
        const initials = getInitials(entry.user.name, entry.user.email);

        return (
          <li key={entry.userId}>
            <Link
              href={`/profile/${entry.userId}`}
              className="focus:outline-none"
            >
              <div
                className={cn(
                  "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-gray-800/60 dark:bg-gray-900/70",
                  isTopThree && containerHighlightByRank[rankIndex],
                  isCurrentUser &&
                    "ring-2 ring-blue-500/60 ring-offset-2 ring-offset-white dark:ring-blue-400/60 dark:ring-offset-gray-900"
                )}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center text-lg font-semibold text-gray-600 dark:text-gray-300">
                      {isTopThree ? (
                        <span
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 text-white shadow-[0_18px_28px_-16px_rgba(49,46,129,0.65)] backdrop-blur-sm",
                            badgeGradientByRank[rankIndex]
                          )}
                        >
                          <Icon className="h-6 w-6 drop-shadow-[0_6px_8px_rgba(15,23,42,0.25)]" />
                        </span>
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-base font-bold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                          #{entry.rank}
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center gap-3">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-lg font-bold text-gray-700 shadow-inner dark:from-gray-800 dark:to-gray-700 dark:text-gray-100">
                        {entry.user.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entry.user.profileImage}
                            alt={entry.user.name || entry.user.email}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : initials ? (
                          initials
                        ) : (
                          <UserCircle2 className="h-8 w-8 opacity-70" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                            {entry.user.name || "İsimsiz Kullanıcı"}
                          </h3>
                          <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          #{entry.rank}
                        </p>
                      </div>
                    </div>
                    {isCurrentUser && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                        <ShieldCheck className="h-4 w-4" />
                        Sen
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Toplam Puan
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {entry.points?.toLocaleString() ?? 0}
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        puan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function getInitials(name: string | null | undefined, email: string) {
  if (name && name.trim().length > 0) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email[0]?.toUpperCase() ?? "";
}

