"use client";

import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RankingDisplayProps {
  currentRank: number | null;
  previousRank?: number | null;
  period: "daily" | "monthly";
  compositeScore?: number | null;
  expertise?: string | null;
}

export function RankingDisplay({
  currentRank,
  previousRank,
  period,
  compositeScore,
  expertise,
}: RankingDisplayProps) {
  if (currentRank === null) {
    return (
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          Bu {period === "daily" ? "gün" : "ay"} henüz sıralamada değilsiniz
        </p>
      </div>
    );
  }

  const rankChange =
    previousRank !== null && previousRank !== undefined
      ? previousRank - currentRank
      : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 shadow-[0_25px_45px_-35px_rgba(59,130,246,0.45)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-10 w-10 text-yellow-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              {period === "daily" ? "Günlük" : "Aylık"} Sıralama
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                #{currentRank}
              </span>
              {expertise && (
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {expertise}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-1">
        {typeof compositeScore === "number" && compositeScore >= 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 text-right">
              Kompozit Skor
            </p>
            <div className="flex items-baseline gap-2 text-right">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {compositeScore.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                / 100
              </span>
            </div>
          </div>
        )}
        {rankChange !== null && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              rankChange > 0
                ? "text-green-600 dark:text-green-400"
                : rankChange < 0
                ? "text-red-500 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {rankChange > 0 ? (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>+{rankChange} sıra yükseldin</span>
              </>
            ) : rankChange < 0 ? (
              <>
                <TrendingDown className="h-4 w-4" />
                <span>{Math.abs(rankChange)} sıra düştün</span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4" />
                <span>Sıralama değişmedi</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

