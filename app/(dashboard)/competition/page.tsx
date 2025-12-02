"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpenCheck,
  Loader2,
  Trophy,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { RankingDisplay } from "@/app/components/competition/RankingDisplay";
import { RankingList } from "@/app/components/competition/RankingList";
import { type LeaderboardEntry } from "@/app/components/competition/types";

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  userRank: LeaderboardEntry | null;
  expertise: string | null;
  totals: {
    courses: number;
  };
}

export default function CompetitionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [totals, setTotals] = useState<{ courses: number }>({ courses: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      void fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period,
        limit: "100",
      });

      const response = await fetch(
        `/api/competition/leaderboard?${params.toString()}`
      );
      const data: LeaderboardResponse = await response.json();

      if (!response.ok) {
        throw new Error(data as unknown as string);
      }

      setLeaderboard(data.leaderboard || []);
      setUserRank(data.userRank);
      setTotals(data.totals || { courses: 0 });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Liderlik tablosu yüklenirken bir sorun oluştu.");
      setLeaderboard([]);
      setUserRank(null);
    } finally {
      setLoading(false);
    }
  };

  // Leaderboard is already sorted by points from API, just use it as-is
  const sortedLeaderboard = useMemo(() => {
    return leaderboard;
  }, [leaderboard]);

  const currentUserEntry = useMemo(() => {
    const currentUserId = session?.user?.id as string | undefined;
    if (!currentUserId) {
      return userRank;
    }
    return (
      sortedLeaderboard.find((entry) => entry.userId === currentUserId) ||
      userRank ||
      null
    );
  }, [session?.user?.id, sortedLeaderboard, userRank]);

  if (loading && sortedLeaderboard.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-10 md:space-y-8">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-4xl font-display font-bold text-transparent md:text-5xl">
          Rekabet Arenası
        </h1>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Uzmanlık alanında yeteneklerini sergile ve sıralamada öne çık.
        </p>
      </div>

      {currentUserEntry && (
        <RankingDisplay
          currentRank={currentUserEntry.rank}
          period={period}
          points={currentUserEntry.points}
        />
      )}

      <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/60 dark:bg-gray-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Sıralama Periyodu
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {period === "daily"
                ? "Son 24 saatteki performans ortalamaları"
                : period === "weekly"
                ? "Bu haftaki performans ortalamaları"
                : "Son 30 gündeki performans ortalamaları"}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            {(
              [
                { value: "daily", label: "Günlük" },
                { value: "weekly", label: "Haftalık" },
                { value: "monthly", label: "Aylık" },
              ] as const
            ).map(({ value, label }) => {
              const isActive = period === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 text-white shadow"
                      : "text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800/70"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-gray-200/60 bg-white/70 px-5 py-4 text-sm text-gray-600 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/70 dark:text-gray-300">
          Sıralama, kazandığınız rozetlerden toplam puanınıza göre yapılmaktadır.
          Rozetleri aktivitelerinizi tamamlayarak kazanabilirsiniz.
        </div>
      </div>

      <Card
        variant="elevated"
        className="border border-gray-200/70 bg-white/80 shadow-xl dark:border-gray-800/60 dark:bg-gray-900/60"
      >
        <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60">
          <CardTitle className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white shadow-lg"
              >
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {period === "daily" ? "Günlük" : period === "weekly" ? "Haftalık" : "Aylık"} Rozet Puanları
                  Liderlik Tablosu
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kazanılan rozet puanlarına göre sıralama.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <BookOpenCheck className="h-4 w-4 text-emerald-500" />
              Sıralama kriteri: toplam rozet puanları.
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {sortedLeaderboard.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
              <p className="font-medium text-gray-600 dark:text-gray-400">
                Henüz sıralama yok
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Uzmanlığınla ilgili içerikleri tamamlayarak ve etkinliklere
                katılarak sıralamada yer alabilirsin.
              </p>
            </div>
          ) : (
            <RankingList
              entries={sortedLeaderboard}
              currentUserId={session?.user?.id as string}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

