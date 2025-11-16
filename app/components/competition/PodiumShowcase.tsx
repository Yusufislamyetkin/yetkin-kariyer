/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Gem,
  Medal,
  Sparkle,
  Trophy,
  UserCircle2,
} from "lucide-react";
import {
  type LeaderboardEntry,
  type LeaderboardMetrics,
} from "@/app/components/competition/types";
import { type LeaderboardViewType } from "@/app/components/competition/FilterTabs";
import { cn } from "@/lib/utils";

interface PodiumShowcaseProps {
  entries: LeaderboardEntry[];
  viewType: LeaderboardViewType;
}

const metricKeyByView: Record<
  LeaderboardViewType,
  keyof LeaderboardMetrics | "composite"
> = {
  overall: "composite",
  topic: "topicCompletion",
  hackaton: "hackaton",
  test: "test",
  liveCoding: "liveCoding",
  bugFix: "bugFix",
};

const gradientByRank = [
  "from-cyan-500 via-blue-500 to-indigo-600",
  "from-amber-500 via-yellow-500 to-orange-500",
  "from-orange-500 via-rose-500 to-amber-600",
];

const cardBackgroundByRank = [
  "from-sky-500/25 via-blue-500/20 to-indigo-500/30",
  "from-amber-400/30 via-yellow-400/25 to-orange-400/35",
  "from-orange-400/30 via-rose-400/25 to-amber-400/35",
];

const progressAccentByRank = [
  "from-sky-400 via-cyan-400 to-blue-500",
  "from-orange-400 via-amber-400 to-yellow-500",
  "from-orange-400 via-rose-400 to-amber-500",
];

const iconByRank = [Gem, Trophy, Medal];

const podiumLayout = [1, 0, 2]; // center first place visually

export function PodiumShowcase({ entries, viewType }: PodiumShowcaseProps) {
  if (!entries.length) {
    return null;
  }

  const metricKey = metricKeyByView[viewType] ?? "composite";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {podiumLayout.map((position) => {
        const entry = entries[position];
        if (!entry) return <span key={`placeholder-${position}`} />;

        const rankIndex = Math.min(entry.rank - 1, gradientByRank.length - 1);
        const Icon = iconByRank[rankIndex] ?? Sparkle;
        const gradient = gradientByRank[rankIndex] ?? gradientByRank[0];
        const cardGradient =
          cardBackgroundByRank[rankIndex] ?? cardBackgroundByRank[0];
        const progressGradient =
          progressAccentByRank[rankIndex] ?? progressAccentByRank[0];
        const isChampion = entry.rank === 1;
        const metricValue =
          metricKey === "composite"
            ? entry.compositeScore
            : entry.metrics[metricKey] ?? 0;

        return (
          <Link
            key={entry.userId}
            href={`/profile/${entry.userId}`}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-white/50 bg-white/90 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl focus:outline-none dark:border-gray-800/70 dark:bg-gray-900/80",
              isChampion && "md:translate-y-4 md:pb-10",
              entry.rank === 1 && "ring-2 ring-sky-400/40 shadow-[0_12px_40px_-12px_rgba(59,130,246,0.4)]",
              entry.rank === 2 && "ring-2 ring-amber-400/40 shadow-[0_12px_40px_-12px_rgba(251,191,36,0.4)]",
              entry.rank === 3 && "ring-2 ring-orange-400/40 shadow-[0_12px_40px_-12px_rgba(251,146,60,0.4)]"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 -z-10 opacity-90 blur-3xl",
                `bg-gradient-to-br ${cardGradient}`
              )}
            />
            <div className="absolute inset-0 -z-[1] bg-white/30 dark:bg-black/20 backdrop-blur-xl" />
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg",
                    `bg-gradient-to-br ${gradient}`
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {entry.rank}. Sıra
                  </p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {entry.user.name || entry.user.email}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-gray-100/80 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800/60 dark:text-gray-300">
                {metricLabel(viewType)}
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "relative flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-[0_25px_45px_-25px_rgba(14,116,226,0.4)]",
                    `bg-gradient-to-br ${gradient}`
                  )}
                >
                  {entry.user.profileImage ? (
                    <img
                      src={entry.user.profileImage}
                      alt={entry.user.name || entry.user.email}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <UserCircle2 className="h-10 w-10 opacity-70" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {metricLabel(viewType)} Skoru
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 dark:text-gray-100">
                      {metricValue.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {metricKey === "composite" ? "/ 100" : "%"}
                    </span>
                  </div>
                  <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-gray-200/70 shadow-inner dark:bg-gray-800/70">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r bg-[length:200%_100%] transition-all duration-700 ease-out animate-pulse",
                        `from-white/20 via-white/0 ${progressGradient}`
                      )}
                      style={{
                        width: `${Math.min(100, metricValue)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {entry.attempts?.hackaton ? (
                  <PodiumChip label="Hackaton" value={entry.attempts.hackaton} />
                ) : null}
                {entry.attempts?.liveCoding ? (
                  <PodiumChip
                    label="Canlı Kodlama"
                    value={entry.attempts.liveCoding}
                  />
                ) : null}
                {entry.attempts?.bugFix ? (
                  <PodiumChip label="Bug Fix" value={entry.attempts.bugFix} />
                ) : null}
                {entry.attempts?.test ? (
                  <PodiumChip label="Test" value={entry.attempts.test} />
                ) : null}
                {entry.attempts?.quiz ? (
                  <PodiumChip label="Quiz" value={entry.attempts.quiz} />
                ) : null}
              </div>
            </div>

            {isChampion && (
              <div className="mt-5 rounded-2xl border border-white/60 bg-white/70 p-3 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/60 dark:bg-gray-900/60 dark:text-gray-200">
                <span className="flex items-center gap-2">
                  <Sparkle className="h-4 w-4 text-cyan-500" />
                  Şampiyonluk Modunda! Performansın tüm topluluk tarafından
                  konuşuluyor.
                </span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function metricLabel(viewType: LeaderboardViewType) {
  switch (viewType) {
    case "topic":
      return "Konu Tamamlama";
    case "hackaton":
      return "Hackaton";
    case "test":
      return "Test";
    case "liveCoding":
      return "Canlı Kodlama";
    case "bugFix":
      return "Bug Fix";
    default:
      return "Genel Performans";
  }
}

interface PodiumChipProps {
  label: string;
  value?: number;
}

function PodiumChip({ label, value = 0 }: PodiumChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100/80 px-2.5 py-1 font-semibold text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
      <span className="text-[11px] uppercase tracking-wide">{label}</span>
      <span>{value}</span>
    </span>
  );
}

