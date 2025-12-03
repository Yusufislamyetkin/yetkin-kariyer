/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type ComponentType, type ReactNode } from "react";
import {
  Award,
  ArrowUpRight,
  Bug,
  Code2,
  FlaskConical,
  Gem,
  Layers,
  Medal,
  Rocket,
  Shield,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { type LeaderboardEntry } from "@/app/components/competition/types";
import { cn } from "@/lib/utils";

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  currentUserId?: string;
  activeMetric?: keyof LeaderboardEntry["metrics"];
  accentGradient?: string;
}

const metricConfig: Array<{
  key: keyof LeaderboardEntry["metrics"];
  label: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    key: "topicCompletion",
    label: "Konu Tamamlama",
    color: "from-emerald-500 to-teal-500",
    icon: Layers,
  },
  {
    key: "test",
    label: "Test Performansı",
    color: "from-blue-500 to-indigo-500",
    icon: FlaskConical,
  },
  {
    key: "liveCoding",
    label: "Canlı Kodlama",
    color: "from-purple-500 to-fuchsia-500",
    icon: Code2,
  },
  {
    key: "bugFix",
    label: "Bug Fix",
    color: "from-rose-500 to-orange-500",
    icon: Bug,
  },
  {
    key: "hackaton",
    label: "Hackaton",
    color: "from-amber-500 to-yellow-500",
    icon: Rocket,
  },
];

const rankIconMap: Record<number, ReactNode> = {
  1: (
    <Gem className="h-6 w-6 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.45)]" />
  ),
  2: (
    <Trophy className="h-6 w-6 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]" />
  ),
  3: (
    <Medal className="h-6 w-6 text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.6)]" />
  ),
};

const rankGradientMap: Record<number, string> = {
  1: "from-sky-400/30 via-blue-500/25 to-indigo-600/35",
  2: "from-amber-400/35 via-orange-500/30 to-yellow-500/40",
  3: "from-orange-400/35 via-rose-500/30 to-amber-500/40",
};

const rankShadowMap: Record<number, string> = {
  1: "shadow-[0_8px_32px_-8px_rgba(59,130,246,0.5)]",
  2: "shadow-[0_8px_32px_-8px_rgba(251,191,36,0.6)]",
  3: "shadow-[0_8px_32px_-8px_rgba(251,146,60,0.5)]",
};

export function LeaderboardCard({
  entry,
  currentUserId,
  activeMetric,
  accentGradient = "from-blue-500 to-indigo-500",
}: LeaderboardCardProps) {
  const isCurrentUser = entry.userId === currentUserId;
  const isTopThree = entry.rank <= 3;

  const getRankDisplay = () => {
    if (entry.rank in rankIconMap) {
      return rankIconMap[entry.rank as keyof typeof rankIconMap];
    }
    return (
      <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
        #{entry.rank}
      </span>
    );
  };

  const getInitials = (name: string | null | undefined, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const attempts = entry.attempts ?? {};

  return (
    <Link href={`/profile/${entry.userId}`} className="block focus:outline-none">
      <Card
        variant="elevated"
        className={cn(
          "group relative overflow-hidden border border-gray-200/70 bg-white/85 transition-all duration-300 backdrop-blur-lg hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800/60 dark:bg-gray-900/75",
          isCurrentUser &&
            "ring-2 ring-blue-500/70 dark:ring-blue-400/60 bg-gradient-to-br from-blue-50/80 via-white/70 to-transparent dark:from-blue-900/40 dark:via-gray-900/60",
          isTopThree &&
            cn(
              "border-transparent ring-2",
              entry.rank === 1 && "ring-sky-400/50 dark:ring-sky-400/40",
              entry.rank === 2 && "ring-amber-400/50 dark:ring-amber-400/40",
              entry.rank === 3 && "ring-orange-400/50 dark:ring-orange-400/40",
              `bg-gradient-to-br ${
                rankGradientMap[entry.rank as keyof typeof rankGradientMap] ??
                "from-emerald-500/10 via-white/70 to-transparent"
              }`,
              rankShadowMap[entry.rank as keyof typeof rankShadowMap] ?? ""
            )
        )}
      >
        <div className="absolute inset-0 pointer-events-none opacity-60 blur-3xl" />
        <CardContent className="p-5 md:p-6 space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center">
                {getRankDisplay()}
              </div>
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-[0_18px_28px_-18px_rgba(99,102,241,0.65)]",
                    `bg-gradient-to-br ${accentGradient}`
                  )}
                >
                  {entry.user.profileImage ? (
                    <img
                      src={entry.user.profileImage}
                      alt={entry.user.name || entry.user.email}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(entry.user.name, entry.user.email)
                  )}
                </div>
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {entry.user.name || entry.user.email}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                </div>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {entry.user.email}
                </p>
                {isCurrentUser && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/70 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    <Shield className="h-3.5 w-3.5" />
                    Sen
                  </span>
                )}
              </div>
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
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm backdrop-blur-sm dark:bg-gray-800/70 dark:text-gray-300">
                <Award className="h-4 w-4 text-amber-500" />
                Toplam puan (rozet + strike)
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metricConfig.map(({ key, label, color, icon: Icon }) => {
              const value = entry.metrics[key];
              const isActive = activeMetric === key;
              return (
                <div
                  key={key}
                  className={cn(
                    "relative rounded-2xl border border-gray-200/70 bg-white/75 p-3 shadow-sm transition-all dark:border-gray-800/70 dark:bg-gray-900/65",
                    isActive &&
                      "border-transparent ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900",
                    isActive && `ring-[rgba(79,70,229,0.35)]`
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md",
                        `bg-gradient-to-br ${color}`
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold text-gray-900 dark:text-gray-100",
                        isActive && "text-indigo-600 dark:text-indigo-300"
                      )}
                    >
                      {value.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {label}
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-gray-800">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r bg-[length:200%_100%] transition-all duration-700 ease-out animate-pulse",
                        `from-white/10 via-white/0 ${color}`
                      )}
                      style={{ width: `${Math.min(100, value)}%` }}
                    />
                  </div>
                  {isActive && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-indigo-100/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                      Odak
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {attempts.quiz ? (
              <AttemptChip label="Quiz" value={attempts.quiz} />
            ) : null}
            {attempts.test ? (
              <AttemptChip label="Test" value={attempts.test} />
            ) : null}
            {attempts.liveCoding ? (
              <AttemptChip label="Canlı Kodlama" value={attempts.liveCoding} />
            ) : null}
            {attempts.bugFix ? (
              <AttemptChip label="Bug Fix" value={attempts.bugFix} />
            ) : null}
            {attempts.hackaton ? (
              <AttemptChip label="Hackaton" value={attempts.hackaton} />
            ) : null}
            {Object.values(attempts).every((value) => !value) && (
              <span>Henüz deneyim verisi yok</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface AttemptChipProps {
  label: string;
  value?: number;
}

function AttemptChip({ label, value = 0 }: AttemptChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100/80 px-2.5 py-1 font-semibold text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
      <span className="text-[11px] uppercase tracking-wide">{label}</span>
      <span>{value}</span>
    </span>
  );
}
