"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  ExternalLink,
  Loader2,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface HackatonMetrics {
  projectScore?: number | null;
  featuresCompleted?: number | null;
  codeQuality?: number | null;
  [key: string]: unknown;
}

interface HackatonAttempt {
  id: string;
  quizId: string;
  projectUrl?: string | null;
  metrics?: HackatonMetrics | null;
  createdAt?: string;
}

interface StoredHackatonAttempt {
  attempt: HackatonAttempt;
  quizId: string;
  quizTitle: string;
  storedAt: number;
}

export default function HackatonResultPage() {
  const params = useParams();
  const router = useRouter();
  const quizId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [attempt, setAttempt] = useState<HackatonAttempt | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) {
      setError("Geçersiz hackaton tanımı.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        let stored: StoredHackatonAttempt | null = null;
        if (typeof window !== "undefined") {
          const raw = sessionStorage.getItem("latest-hackaton-attempt");
          if (raw) {
            try {
              stored = JSON.parse(raw) as StoredHackatonAttempt;
            } catch {
              stored = null;
            }
            sessionStorage.removeItem("latest-hackaton-attempt");
          }
        }

        if (stored && stored.quizId === quizId) {
          setAttempt(stored.attempt);
          setQuizTitle(stored.quizTitle ?? "");
          return;
        }

        const response = await fetch(
          `/api/education/hackaton/attempts?quizId=${quizId}&limit=1`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Hackaton sonucu alınamadı.");
        }

        const payload = await response.json();
        const latestAttempt = (payload?.attempts ?? [])[0] as
          | (HackatonAttempt & { quiz?: { title?: string | null } })
          | undefined;

        if (!latestAttempt) {
          throw new Error("Gönderilen proje bulunamadı.");
        }

        setAttempt(latestAttempt);
        setQuizTitle(latestAttempt.quiz?.title ?? "");
      } catch (err) {
        console.error("Hackaton result fetch error:", err);
        setError(err instanceof Error ? err.message : "Sonuçlar yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quizId]);

  const metrics = useMemo(() => {
    if (!attempt?.metrics || typeof attempt.metrics !== "object") {
      return {} as HackatonMetrics;
    }
    return attempt.metrics as HackatonMetrics;
  }, [attempt]);

  const projectScore =
    typeof metrics.projectScore === "number" ? Math.round(metrics.projectScore) : null;
  const featuresCompleted =
    typeof metrics.featuresCompleted === "number" ? metrics.featuresCompleted : null;
  const codeQuality =
    typeof metrics.codeQuality === "number" ? Math.round(metrics.codeQuality) : null;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span>Sonuçlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card variant="elevated" className="max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <CardTitle className="mb-2 text-xl">Sonuç bulunamadı</CardTitle>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {error || "Son gönderim verisine ulaşılamadı. Lütfen tekrar deneyin."}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push(`/education/hackaton/${quizId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Hackaton görevine dön
            </Button>
            <Button variant="outline" onClick={() => router.push("/education/hackaton")}>
              Hackaton listesine dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Hackaton Sonucu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {quizTitle ? `${quizTitle} projesini gönderdiniz.` : "Gönderiminiz kaydedildi."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/education/hackaton")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Listeye Dön
          </Button>
          <Button variant="gradient" onClick={() => router.push(`/education/hackaton/${quizId}`)}>
            Projeyi Güncelle
          </Button>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-amber-500" />
            Proje Skoru
          </CardTitle>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Gönderim Kimliği: {attempt.id}
          </span>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200/60 bg-white/40 p-4 text-center dark:border-gray-700/60 dark:bg-gray-900/40">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Proje Skoru</p>
            <p className="mt-2 text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {projectScore !== null ? `%${projectScore}` : "Bekleniyor"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white/40 p-4 text-center dark:border-gray-700/60 dark:bg-gray-900/40">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tamamlanan Özellikler
            </p>
            <p className="mt-2 text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {featuresCompleted ?? "Bekleniyor"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white/40 p-4 text-center dark:border-gray-700/60 dark:bg-gray-900/40">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kod Kalitesi</p>
            <p className="mt-2 text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {codeQuality !== null ? `%${codeQuality}` : "Bekleniyor"}
            </p>
          </div>
        </CardContent>
      </Card>

      {attempt.projectUrl ? (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Proje Bağlantısı</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <span className="truncate text-sm text-gray-600 dark:text-gray-400">
              {attempt.projectUrl}
            </span>
            <Link
              href={attempt.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
            >
              <ExternalLink className="h-4 w-4" />
              Projeyi Aç
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card variant="elevated">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Analiz sonuçlarını beklerken
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kod kalitesi ve ayrıntılı değerlendirme AI analizleri tamamlandığında güncellenecek.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => router.push("/education/analytics")}>
              <Award className="mr-2 h-4 w-4" />
              Performansı Görüntüle
            </Button>
            <Button variant="ghost" onClick={() => router.push("/education/tutor")}>
              AI mentor önerileri
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

