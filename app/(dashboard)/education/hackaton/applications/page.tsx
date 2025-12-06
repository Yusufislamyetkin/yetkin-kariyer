"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  CalendarDays,
  Clock,
  Crown,
  Rocket,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

type HackathonPhase =
  | "draft"
  | "upcoming"
  | "applications"
  | "submission"
  | "judging"
  | "completed"
  | "archived";

type HackathonApplicationStatus =
  | "pending_review"
  | "auto_accepted"
  | "approved"
  | "waitlisted"
  | "rejected"
  | "withdrawn";

type HackathonTeamRole = "leader" | "co_leader" | "member";

type HackathonSubmissionStatus =
  | "pending"
  | "valid"
  | "late"
  | "disqualified"
  | "under_review"
  | "finalist"
  | "winner";

interface HackathonLifecycle {
  derivedPhase: HackathonPhase;
  isApplicationWindowOpen: boolean;
  isSubmissionWindowOpen: boolean;
  isJudgingWindowOpen: boolean;
}

interface HackathonApplication {
  id: string;
  status: HackathonApplicationStatus;
  appliedAt: string;
  reviewedAt: string | null;
  hackathon: {
    id: string;
    title: string;
    description: string | null;
    phase: HackathonPhase;
    lifecycle: HackathonLifecycle;
    applicationOpensAt: string;
    applicationClosesAt: string;
    submissionOpensAt: string;
    submissionClosesAt: string;
    judgingOpensAt: string | null;
    judgingClosesAt: string | null;
    organizer: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
    prizesSummary: string | null;
  };
  team: {
    id: string;
    name: string;
    role: HackathonTeamRole | null;
  } | null;
  submission: {
    id: string;
    status: HackathonSubmissionStatus;
    submittedAt: string;
    title: string;
    summary: string | null;
  } | null;
}

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

const applicationStatusLabel = (status: HackathonApplicationStatus) =>
  ({
    pending_review: "Onay Bekliyor",
    auto_accepted: "Otomatik Onaylandı",
    approved: "Onaylandı",
    waitlisted: "Yedek Listede",
    rejected: "Reddedildi",
    withdrawn: "Geri Çekildi",
  }[status] ?? status);

const applicationStatusColor = (status: HackathonApplicationStatus) => {
  switch (status) {
    case "approved":
    case "auto_accepted":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "pending_review":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "waitlisted":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "withdrawn":
      return "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400";
  }
};

const submissionStatusLabel = (status: HackathonSubmissionStatus) =>
  ({
    pending: "Beklemede",
    valid: "Geçerli",
    late: "Geç Teslim",
    disqualified: "Diskalifiye",
    under_review: "İnceleniyor",
    finalist: "Finalist",
    winner: "Kazanan",
  }[status] ?? status);

const submissionStatusColor = (status: HackathonSubmissionStatus) => {
  switch (status) {
    case "valid":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "late":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    case "disqualified":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "under_review":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "finalist":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case "winner":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400";
  }
};

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

const roleLabel = (role: HackathonTeamRole | null) => {
  if (!role) return null;
  switch (role) {
    case "leader":
      return "Takım Lideri";
    case "co_leader":
      return "Eş Lider";
    case "member":
      return "Üye";
    default:
      return null;
  }
};

export default function HackathonApplicationsPage() {
  const [applications, setApplications] = useState<HackathonApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    const fetchApplications = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch("/api/hackathons/applications", {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Başvurular yüklenirken bir sorun oluştu.");
        }

        const data = await response.json();
        setApplications(data.applications ?? []);
      } catch (err) {
        console.error("Error fetching hackathon applications:", err);
        if ((err as Error).name === "AbortError") {
          setError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
        } else {
          setError("Başvurular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } finally {
        setLoading(false);
        window.clearTimeout(timeoutId);
      }
    };

    fetchApplications();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [requestKey]);

  if (loading && applications.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Hackathonlarım</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Başvurduğunuz hackathonlar ve durumlarınızı görüntüleyin.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Başvurular yükleniyor...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Hackathonlarım</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Başvurduğunuz hackathonlar ve durumlarınızı görüntüleyin.
          </p>
        </div>
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 dark:text-red-300" />
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <Button variant="secondary" onClick={() => setRequestKey((prev) => prev + 1)}>
                Yeniden dene
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Hackathonlarım</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Başvurduğunuz hackathonlar ve durumlarınızı görüntüleyin.
          </p>
        </div>
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <Rocket className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">
                Henüz hiç hackathona başvurmadınız.
              </p>
              <Link href="/education/hackaton">
                <Button variant="gradient" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Hackathonları Keşfet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Hackathonlarım</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Başvurduğunuz hackathonlar ve durumlarınızı görüntüleyin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {applications.map((application, index) => (
          <Card
            key={application.id}
            variant="elevated"
            hover
            className="flex flex-col justify-between animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/40 dark:shadow-none">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl line-clamp-2">{application.hackathon.title}</CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {application.hackathon.organizer?.name
                        ? `Organizatör: ${application.hackathon.organizer.name}`
                        : "Organizatör bilgisi yok"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${PHASE_BADGE_STYLES[application.hackathon.lifecycle.derivedPhase]}`}
                >
                  {phaseLabel(application.hackathon.lifecycle.derivedPhase)}
                </span>
              </div>
              {application.hackathon.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {application.hackathon.description}
                </p>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Başvuru Durumu:
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${applicationStatusColor(application.status)}`}
                  >
                    {applicationStatusLabel(application.status)}
                  </span>
                </div>

                {application.team && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Takım:
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {application.team.name}
                      </span>
                      {application.team.role && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({roleLabel(application.team.role)})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {application.submission && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Proje:
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${submissionStatusColor(application.submission.status)}`}
                    >
                      {submissionStatusLabel(application.submission.status)}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Başvuru Tarihi</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {formatDate(application.appliedAt)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatCountdown(application.appliedAt)}
                    </p>
                  </div>
                </div>
                {application.reviewedAt && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">İnceleme Tarihi</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {formatDate(application.reviewedAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatCountdown(application.reviewedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {application.hackathon.prizesSummary && (
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
                        {application.hackathon.prizesSummary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Link href={`/education/hackaton/${application.hackathon.id}`} className="w-full">
                  <Button variant="gradient" className="w-full flex items-center justify-center gap-2">
                    Detayları Gör
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

