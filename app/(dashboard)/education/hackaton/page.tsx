"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarDays, Clock, Crown, Layers, Rocket, Trophy, Users, UserCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

type HackathonPhase =
  | "draft"
  | "upcoming"
  | "applications"
  | "submission"
  | "judging"
  | "completed"
  | "archived";

interface HackathonLifecycle {
  derivedPhase: HackathonPhase;
  isApplicationWindowOpen: boolean;
  isSubmissionWindowOpen: boolean;
  isJudgingWindowOpen: boolean;
}

interface HackathonSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  visibility: string;
  phase: HackathonPhase;
  applicationOpensAt: string;
  applicationClosesAt: string;
  submissionOpensAt: string;
  submissionClosesAt: string;
  judgingOpensAt: string | null;
  judgingClosesAt: string | null;
  tags: string[];
  prizesSummary: string | null;
  lifecycle: HackathonLifecycle;
  organizer: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  _count?: {
    applications: number;
    submissions: number;
    teams: number;
  };
}

type PhaseFilter = "all" | Exclude<HackathonPhase, "draft">;

const PHASE_OPTIONS: Array<{ key: PhaseFilter; label: string }> = [
  { key: "all", label: "Tümü" },
  { key: "upcoming", label: "Yaklaşan" },
  { key: "applications", label: "Başvurular Açık" },
  { key: "submission", label: "Projeler Hazırlanıyor" },
  { key: "judging", label: "Değerlendirme" },
  { key: "completed", label: "Tamamlandı" },
  { key: "archived", label: "Arşiv" },
];

const PHASE_BADGE_STYLES: Record<HackathonPhase, string> = {
  draft: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  applications: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  submission: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  judging: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  archived: "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400",
};

const phaseLabel = (phase: HackathonPhase) =>
  ({
    draft: "Taslak",
    upcoming: "Yaklaşan",
    applications: "Başvuru Dönemi",
    submission: "Proje Dönemi",
    judging: "Değerlendirme",
    completed: "Sonuçlandı",
    archived: "Arşivlendi",
  }[phase] ?? phase);

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd MMM yyyy HH:mm", { locale: tr });
  } catch {
    return "-";
  }
};

const formatCountdown = (value: string | null | undefined) => {
  if (!value) return "-";
  try {
    const target = new Date(value);
    if (Number.isNaN(target.getTime())) return "-";
    return formatDistanceToNow(target, { addSuffix: true, locale: tr });
  } catch {
    return "-";
  }
};

export default function HackatonPage() {
  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    const fetchHackathons = async () => {
      try {
        setError(null);
        setLoading(true);
        const params = new URLSearchParams();
        params.set("limit", "24");
        if (phaseFilter !== "all") {
          params.set("phase", phaseFilter);
        }
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(`/api/hackathons?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Hackathonlar yüklenirken bir sorun oluştu.");
        }

        const data = await response.json();
        setHackathons(data.hackathons ?? []);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        if ((err as Error).name === "AbortError") {
          setError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
        } else {
          setError("Hackathon listesi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } finally {
        setLoading(false);
        window.clearTimeout(timeoutId);
      }
    };

    fetchHackathons();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [phaseFilter, search, requestKey]);

  const headline = useMemo(
    () =>
      phaseFilter === "all"
        ? "Hackathonlar"
        : `${PHASE_OPTIONS.find((option) => option.key === phaseFilter)?.label ?? ""} Hackathonlar`,
    [phaseFilter]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{headline}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Takımınızı kurun, arkadaşlarınızı davet edin ve proje teslim sürecini birlikte yönetin.
          </p>
        </div>
        <Link href="/education/hackaton/applications">
          <Button variant="gradient" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Hackathonlarım
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Hackathon ara..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PHASE_OPTIONS.map((option) => (
            <Button
              key={option.key}
              variant={option.key === phaseFilter ? "gradient" : "outline"}
              size="sm"
              onClick={() => setPhaseFilter(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && hackathons.length === 0 ? (
        <div className="flex items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Hackathonlar yükleniyor...
            </p>
          </div>
        </div>
      ) : error ? (
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <Trophy className="h-12 w-12 text-red-400 dark:text-red-300" />
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <Button variant="secondary" onClick={() => setRequestKey((prev) => prev + 1)}>
                Yeniden dene
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : hackathons.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <Rocket className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">
                Seçili filtrelere uygun bir hackathon bulunamadı.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 w-full max-w-full overflow-x-hidden">
          {hackathons.map((hackathon, index) => (
            <Card
              key={hackathon.id}
              variant="elevated"
              hover
              className="flex flex-col justify-between animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/40 dark:shadow-none">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl line-clamp-2">{hackathon.title}</CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {hackathon.organizer?.name
                          ? `Organizatör: ${hackathon.organizer.name}`
                          : "Organizatör bilgisi yok"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${PHASE_BADGE_STYLES[hackathon.lifecycle.derivedPhase]}`}
                  >
                    {phaseLabel(hackathon.lifecycle.derivedPhase)}
                  </span>
                </div>
                {hackathon.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {hackathon.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Başvuru Bitişi
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {formatDate(hackathon.applicationClosesAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatCountdown(hackathon.applicationClosesAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Teslim Bitişi
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {formatDate(hackathon.submissionClosesAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatCountdown(hackathon.submissionClosesAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>
                      {hackathon._count?.applications ?? 0} başvuru •{" "}
                      {hackathon._count?.teams ?? 0} takım
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-500" />
                    <span>{hackathon._count?.submissions ?? 0} proje</span>
                  </div>
                </div>

                {hackathon.prizesSummary && (
                  <div className="relative overflow-hidden rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-amber-100 to-white p-4 text-sm shadow-inner dark:border-amber-500/40 dark:from-amber-500/20 dark:via-amber-500/10 dark:to-transparent">
                    <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/30" />
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-500 p-2 text-white shadow-lg shadow-amber-300/40">
                        <Crown className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
                          Ödül Havuzu
                        </p>
                        <p className="text-sm font-medium leading-snug text-amber-900 dark:text-amber-50">
                          {hackathon.prizesSummary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Link href={`/education/hackaton/${hackathon.id}`} className="w-full">
                    <Button variant="gradient" className="w-full">
                      Detayları Gör
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

