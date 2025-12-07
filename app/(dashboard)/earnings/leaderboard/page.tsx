"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Trophy,
  Users,
  DollarSign,
  Award,
  Briefcase,
  Medal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Gem,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

interface EarningsLeaderboardEntry {
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  rank: number;
  totalEarnings: number;
  breakdown: {
    hackathon: number;
    leaderboard: number;
    freelancer: number;
  };
  counts: {
    hackathon: number;
    leaderboard: number;
    freelancer: number;
  };
}

interface EarningsLeaderboardResponse {
  leaderboard: EarningsLeaderboardEntry[];
}

export default function EarningsLeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [leaderboard, setLeaderboard] = useState<EarningsLeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

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

  useEffect(() => {
    // Reset visible count when period changes
    setVisibleCount(20);
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period,
      });

      const response = await fetch(`/api/earnings/leaderboard?${params.toString()}`);
      const data: EarningsLeaderboardResponse = await response.json();

      if (!response.ok) {
        throw new Error(data as unknown as string);
      }

      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Error fetching earnings leaderboard:", err);
      setError("Kazanç sıralaması yüklenirken bir sorun oluştu.");
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const currentUserEntry = leaderboard.find(
    (entry) => entry.userId === (session?.user?.id as string)
  );

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const allRestOfLeaderboard = useMemo(() => leaderboard.slice(3), [leaderboard]);
  const restOfLeaderboard = useMemo(() => 
    allRestOfLeaderboard.slice(0, visibleCount), 
    [allRestOfLeaderboard, visibleCount]
  );
  const hasMoreUsers = allRestOfLeaderboard.length > visibleCount;

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const rankVariants: ("blue" | "yellow" | "green")[] = ["blue", "yellow", "green"];
  const rankIcons = [Gem, Trophy, Medal];
  const rankLabels = ["1.", "2.", "3."];

  return (
    <div className="animate-fade-in space-y-6 pb-10 md:space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-3xl sm:text-4xl font-display font-bold text-transparent md:text-5xl">
          En Çok Kazananlar
        </h1>
        <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
          Platformda en çok kazanç elde eden kullanıcıları görüntüle
        </p>
      </div>

      {/* Period Selector */}
      <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-gray-800/60 dark:bg-gray-900/60 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full max-w-full">
          <div className="w-full sm:w-auto">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Sıralama Periyodu
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {period === "daily"
                ? "Son 24 saatteki kazançlar"
                : period === "weekly"
                ? "Bu haftaki kazançlar (Pazartesi-Pazar)"
                : "Son 30 gündeki kazançlar"}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 text-xs sm:text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900/70 w-full sm:w-auto justify-center sm:justify-start flex-wrap">
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
                  className={`rounded-full px-3 sm:px-4 py-2 font-semibold transition text-xs sm:text-sm ${
                    isActive
                      ? period === "daily"
                        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 text-white shadow"
                        : period === "weekly"
                        ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow"
                        : "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow"
                      : "text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800/70"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {currentUserEntry && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 shadow-[0_25px_45px_-35px_rgba(59,130,246,0.45)] w-full max-w-full overflow-x-hidden">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                  Senin Sıralaman
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    #{currentUserEntry.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Toplam Kazanç
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currentUserEntry.totalEarnings.toLocaleString("tr-TR")} ₺
              </span>
            </div>
          </div>
        </div>
      )}

      <Card
        variant="elevated"
        className="border border-gray-200/70 bg-white/80 shadow-xl dark:border-gray-800/60 dark:bg-gray-900/60 w-full max-w-full overflow-x-hidden"
      >
        <CardHeader className="border-b border-gray-200/60 dark:border-gray-800/60 w-full max-w-full">
          <CardTitle className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full max-w-full">
            <div className="flex items-center gap-3 w-full max-w-full">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white shadow-lg"
              >
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Kazanç Sıralaması
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toplam kazanç miktarına göre sıralama.
                </p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {leaderboard.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
              <p className="font-medium text-gray-600 dark:text-gray-400">
                Henüz kazanç yok
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Hackathon kazanarak, sıralamada birinci olarak veya freelancer
                projelerinde çalışarak kazanç elde edebilirsin.
              </p>
            </div>
          ) : (
            <>
              {/* Podium - İlk Üç Kazanan */}
              {topThree.length > 0 && (
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {period === "daily"
                        ? "Günlük"
                        : period === "weekly"
                        ? "Haftalık"
                        : "Aylık"}{" "}
                      İlk Üç Kazanan
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 w-full max-w-full">
                    {topThree.map((entry, index) => {
                      const variant = rankVariants[index];
                      const Icon = rankIcons[index];
                      const label = rankLabels[index];
                      const initials = getInitials(entry.user.name, entry.user.email);
                      const isCurrentUser = entry.userId === (session?.user?.id as string);
                      const podiumHeight = "min-h-[450px]";

                      return (
                        <>
                          {/* Mobile - Minimal compact card */}
                          <Link
                            key={`${entry.userId}-mobile`}
                            href={`/profile/${entry.userId}`}
                            className="block md:hidden focus:outline-none group"
                          >
                              <div
                                className={cn(
                                  "p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-700/60 border border-gray-200/60 dark:border-gray-700/60 w-full max-w-full overflow-x-hidden",
                                  isCurrentUser &&
                                    "ring-2 ring-blue-500/60 ring-offset-2 ring-offset-white dark:ring-blue-400/60 dark:ring-offset-gray-900"
                                )}
                              >
                                <div className="flex items-center gap-3 w-full max-w-full">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                    #{entry.rank}
                                  </span>
                                </div>
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                                  {entry.user.profileImage ? (
                                    <Image
                                      src={entry.user.profileImage}
                                      alt={entry.user.name || entry.user.email}
                                      width={40}
                                      height={40}
                                      className="h-full w-full object-cover rounded-full"
                                      unoptimized
                                      priority={index < 3}
                                      loading={index < 3 ? "eager" : "lazy"}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent && !parent.querySelector('.fallback-initials')) {
                                          if (initials) {
                                            const span = document.createElement('span');
                                            span.className = 'fallback-initials text-xs font-bold text-gray-700 dark:text-gray-200';
                                            span.textContent = initials;
                                            parent.appendChild(span);
                                          } else {
                                            const icon = document.createElement('div');
                                            icon.innerHTML = '<svg class="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                                            parent.appendChild(icon);
                                          }
                                        }
                                      }}
                                    />
                                  ) : initials ? (
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{initials}</span>
                                  ) : (
                                    <UserCircle2 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1 overflow-hidden">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-0">
                                      {entry.user.name || entry.user.email}
                                    </h3>
                                    {isCurrentUser && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/50">
                                        <ShieldCheck className="h-3 w-3" />
                                        Sen
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-1 flex items-baseline gap-1.5">
                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                      {entry.totalEarnings.toLocaleString("tr-TR")}
                                    </span>
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">₺</span>
                                  </div>
                                </div>
                                <div className={cn(
                                  "ml-auto h-8 w-8 flex items-center justify-center rounded-lg border text-white",
                                  index === 0 && "bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-300/60",
                                  index === 1 && "bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300/60",
                                  index === 2 && "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-300/60"
                                )}>
                                  <Icon className="h-4 w-4" />
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {entry.breakdown.hackathon > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/80 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-200 border border-purple-200/50 dark:border-purple-800/40">
                                    🏆 {entry.breakdown.hackathon.toLocaleString("tr-TR")}
                                  </span>
                                )}
                                {entry.breakdown.leaderboard > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100/80 px-2 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200/50 dark:border-yellow-800/40">
                                    🥇 {entry.breakdown.leaderboard.toLocaleString("tr-TR")}
                                  </span>
                                )}
                                {entry.breakdown.freelancer > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/40">
                                    💼 {entry.breakdown.freelancer.toLocaleString("tr-TR")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>

                          {/* Desktop - existing detailed podium card */}
                          <Link
                            key={entry.userId}
                            href={`/profile/${entry.userId}`}
                            className="hidden md:block focus:outline-none group"
                          >
                            <div
                              className={cn(
                                "h-full w-full transition-all duration-300 hover:scale-105 rounded-2xl border border-gray-200/80 bg-white/85 p-6 hover:shadow-2xl dark:border-gray-800/60 dark:bg-gray-900/70",
                                podiumHeight,
                                isCurrentUser &&
                                  "ring-2 ring-blue-500/60 ring-offset-2 ring-offset-white dark:ring-blue-400/60 dark:ring-offset-gray-900"
                              )}
                            >
                              <div className="flex h-full flex-col relative z-10">
                                <div className="mb-4 flex items-center justify-center">
                                  <div className={cn(
                                    "flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl",
                                    index === 0 && "bg-gradient-to-br from-yellow-400 to-amber-500 dark:from-blue-500 dark:to-blue-600",
                                    index === 1 && "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700",
                                    index === 2 && "bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700"
                                  )}>
                                    <Icon className={cn(
                                      "h-10 w-10 drop-shadow-lg",
                                      index === 0 && "text-white dark:text-blue-100",
                                      index !== 0 && "text-white"
                                    )} />
                                  </div>
                                </div>

                                <div className="mb-4 text-center">
                                  <p className={cn(
                                    "font-bold text-gray-900 dark:text-gray-100",
                                    index === 0 && "text-5xl",
                                    index === 1 && "text-4xl",
                                    index === 2 && "text-4xl"
                                  )}>
                                    {label}
                                  </p>
                                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
                                    {index === 0 && "🏆 Şampiyon"}
                                    {index === 1 && "🥈 İkinci"}
                                    {index === 2 && "🥉 Üçüncü"}
                                  </p>
                                </div>

                                <div className="mb-4 flex justify-center">
                                  <div className={cn(
                                    "relative flex items-center justify-center rounded-full border-4 border-gray-200/50 dark:border-gray-700/50 shadow-2xl",
                                    index === 0 && "h-28 w-28",
                                    index === 1 && "h-24 w-24",
                                    index === 2 && "h-24 w-24"
                                  )}>
                                    {entry.user.profileImage ? (
                                      <Image
                                        src={entry.user.profileImage}
                                        alt={entry.user.name || entry.user.email}
                                        width={index === 0 ? 112 : 96}
                                        height={index === 0 ? 112 : 96}
                                        className="h-full w-full rounded-full object-cover"
                                        unoptimized
                                        priority={index < 3}
                                        loading={index < 3 ? "eager" : "lazy"}
                                      />
                                    ) : initials ? (
                                      <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                        {initials}
                                      </span>
                                    ) : (
                                      <UserCircle2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    )}
                                    {index === 0 && (
                                      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                                        <Trophy className="h-4 w-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mb-4 text-center">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {entry.user.name || entry.user.email.split("@")[0]}
                                  </h3>
                                  {isCurrentUser && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/50">
                                      <ShieldCheck className="h-3 w-3" />
                                      Sen
                                    </span>
                                  )}
                                </div>

                                <div className="mt-auto rounded-xl bg-gray-50/80 dark:bg-gray-800/80 p-4 border border-gray-200/60 dark:border-gray-700/60">
                                  <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                    Toplam Kazanç
                                  </p>
                                  <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                      {entry.totalEarnings.toLocaleString("tr-TR")}
                                    </span>
                                    <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                      ₺
                                    </span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                    {entry.breakdown.hackathon > 0 && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/80 px-2 py-1 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-200/50 dark:border-purple-800/50">
                                        🏆 {entry.breakdown.hackathon.toLocaleString("tr-TR")}
                                      </span>
                                    )}
                                    {entry.breakdown.leaderboard > 0 && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100/80 px-2 py-1 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200 border border-yellow-200/50 dark:border-yellow-800/50">
                                        🥇 {entry.breakdown.leaderboard.toLocaleString("tr-TR")}
                                      </span>
                                    )}
                                    {entry.breakdown.freelancer > 0 && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-1 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/50">
                                        💼 {entry.breakdown.freelancer.toLocaleString("tr-TR")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rest of Leaderboard */}
              {restOfLeaderboard.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">
                    Diğer Sıralama
                  </h3>
                  <ol className="space-y-5">
                    {restOfLeaderboard.map((entry) => {
                      const isCurrentUser = entry.userId === (session?.user?.id as string);
                      const initials = getInitials(entry.user.name, entry.user.email);

                      return (
                        <li key={entry.userId}>
                          <Link
                            href={`/profile/${entry.userId}`}
                            className="focus:outline-none"
                          >
                              <div
                              className={cn(
                                "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/85 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-gray-800/60 dark:bg-gray-900/70 w-full max-w-full",
                                isCurrentUser &&
                                  "ring-2 ring-blue-500/60 ring-offset-2 ring-offset-white dark:ring-blue-400/60 dark:ring-offset-gray-900"
                              )}
                            >
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full max-w-full">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center text-lg font-semibold text-gray-600 dark:text-gray-300">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-base font-bold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                                      #{entry.rank}
                                    </span>
                                  </div>
                                  <div className="relative flex items-center gap-3">
                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-lg font-bold text-gray-700 shadow-inner dark:from-gray-800 dark:to-gray-700 dark:text-gray-100">
                                      {entry.user.profileImage ? (
                                        <Image
                                          src={entry.user.profileImage}
                                          alt={entry.user.name || entry.user.email}
                                          width={56}
                                          height={56}
                                          className="h-full w-full rounded-full object-cover"
                                          unoptimized
                                          loading="lazy"
                                        />
                                      ) : initials ? (
                                        <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{initials}</span>
                                      ) : (
                                        <UserCircle2 className="h-8 w-8 opacity-70" />
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                                          {entry.user.name || entry.user.email}
                                        </h3>
                                        <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                                      </div>
                                      <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {entry.user.email}
                                      </p>
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
                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                  <div className="flex flex-col items-start gap-2 md:items-end w-full sm:w-auto">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                      Toplam Kazanç
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {entry.totalEarnings.toLocaleString("tr-TR")} ₺
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 md:justify-end w-full">
                                    {entry.breakdown.hackathon > 0 && (
                                      <div className="flex items-center gap-1 rounded-full bg-purple-100/80 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-200">
                                        <Award className="h-3 w-3" />
                                        Hackathon: {entry.breakdown.hackathon.toLocaleString("tr-TR")} ₺
                                      </div>
                                    )}
                                    {entry.breakdown.leaderboard > 0 && (
                                      <div className="flex items-center gap-1 rounded-full bg-yellow-100/80 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200">
                                        <Medal className="h-3 w-3" />
                                        Sıralama: {entry.breakdown.leaderboard.toLocaleString("tr-TR")} ₺
                                      </div>
                                    )}
                                    {entry.breakdown.freelancer > 0 && (
                                      <div className="flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                                        <Briefcase className="h-3 w-3" />
                                        Freelancer: {entry.breakdown.freelancer.toLocaleString("tr-TR")} ₺
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                  {hasMoreUsers && (
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 20)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                        <Users className="h-5 w-5" />
                        Diğer Kullanıcıları Gör
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
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

