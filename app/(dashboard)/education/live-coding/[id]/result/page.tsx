"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ListChecks,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface LiveCodingTaskMetric {
  taskId: string;
  language: string;
  durationSeconds?: number | null;
  timeRemainingSeconds?: number | null;
}

interface LiveCodingMetrics {
  totalDurationSeconds?: number;
  completedTaskCount?: number;
  totalTaskCount?: number;
  tasks?: LiveCodingTaskMetric[];
  [key: string]: unknown;
}

interface LiveCodingAttempt {
  id: string;
  quizId: string;
  createdAt?: string;
  updatedAt?: string;
  metrics?: LiveCodingMetrics | null;
}

interface StoredLiveCodingAttempt {
  attempt: LiveCodingAttempt;
  quizId: string;
  quizTitle: string;
  storedAt: number;
}

export default function LiveCodingResultPage() {
  const params = useParams();
  const router = useRouter();
  const quizId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [attempt, setAttempt] = useState<LiveCodingAttempt | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) {
      setLoading(false);
      setError("Geçersiz canlı kodlama oturumu.");
      return;
    }

    const loadAttempt = async () => {
      try {
        let stored: StoredLiveCodingAttempt | null = null;
        if (typeof window !== "undefined") {
          const raw = sessionStorage.getItem("latest-live-coding-attempt");
          if (raw) {
            try {
              stored = JSON.parse(raw) as StoredLiveCodingAttempt;
            } catch {
              stored = null;
            }
            sessionStorage.removeItem("latest-live-coding-attempt");
          }
        }

        if (stored && stored.quizId === quizId) {
          setAttempt(stored.attempt);
          setQuizTitle(stored.quizTitle ?? "");
          return;
        }

        const response = await fetch(
          `/api/education/live-coding/attempts?quizId=${quizId}&limit=1`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Canlı kodlama sonucu alınamadı.");
        }

        const payload = await response.json();
        const latestAttempt = (payload?.attempts ?? [])[0] as
          | (LiveCodingAttempt & { quiz?: { title?: string | null } })
          | undefined;

        if (!latestAttempt) {
          throw new Error("Son gönderim bulunamadı.");
        }

        setAttempt(latestAttempt);
        setQuizTitle(latestAttempt.quiz?.title ?? "");
      } catch (err) {
        console.error("Live coding result fetch error:", err);
        setError(err instanceof Error ? err.message : "Sonuçlar yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [quizId]);

  const metrics: LiveCodingMetrics | null = useMemo(() => {
    if (!attempt?.metrics || typeof attempt.metrics !== "object") {
      return null;
    }
    return attempt.metrics as LiveCodingMetrics;
  }, [attempt]);

  const formattedDuration = useMemo(() => {
    const seconds = metrics?.totalDurationSeconds;
    if (!seconds || seconds <= 0) {
      return "Bilgi yok";
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} dk ${secs.toString().padStart(2, "0")} sn`;
  }, [metrics]);

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
            {error ||
              "Bu canlı kodlama için sonuç verisine ulaşılamadı. Lütfen yeniden deneyin."}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push(`/education/live-coding/${quizId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Canlı kodlamaya geri dön
            </Button>
            <Button variant="outline" onClick={() => router.push("/education/live-coding")}>
              Canlı kodlama listesine dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const completed = metrics?.completedTaskCount ?? 0;
  const total = metrics?.totalTaskCount ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Canlı Kodlama Sonucu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {quizTitle ? `${quizTitle} oturumunu tamamladınız.` : "Son gönderimin özeti."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/education/live-coding")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Listeye Dön
          </Button>
          <Button variant="gradient" onClick={() => router.push(`/education/live-coding/${quizId}`)}>
            Yeniden Dene
          </Button>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Genel Bakış
          </CardTitle>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Gönderim Kimliği: {attempt.id}
          </span>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200/60 bg-white/30 p-4 dark:border-gray-700/60 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <ListChecks className="h-5 w-5 text-emerald-500" />
              Tamamlanan Görevler
            </div>
            <p className="mt-2 text-2xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {completed} / {total}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white/30 p-4 dark:border-gray-700/60 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Clock className="h-5 w-5 text-blue-500" />
              Toplam Süre
            </div>
            <p className="mt-2 text-2xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {formattedDuration}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white/30 p-4 dark:border-gray-700/60 dark:bg-gray-900/40">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gönderim Tarihi
            </div>
            <p className="mt-2 text-2xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {attempt.createdAt
                ? new Date(attempt.createdAt).toLocaleString("tr-TR")
                : "Bilgi yok"}
            </p>
          </div>
        </CardContent>
      </Card>

      {Array.isArray(metrics?.tasks) && metrics.tasks.length > 0 ? (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Görev Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.tasks.map((task) => {
              const duration = task.durationSeconds ?? 0;
              const minutes = Math.floor(duration / 60);
              const seconds = duration % 60;
              return (
                <div
                  key={task.taskId}
                  className="rounded-lg border border-gray-200/60 bg-white/20 px-4 py-3 dark:border-gray-700/60 dark:bg-gray-900/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Görev {task.taskId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Dil: {task.language?.toUpperCase?.() ?? "Bilinmiyor"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Süre: {minutes} dk {seconds.toString().padStart(2, "0")} sn
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      <Card variant="elevated">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Öğrenme yolculuğunuzu güçlendirin
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Performansınızı detaylı incelemek için analytics sayfasını ziyaret edin.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => router.push("/education/analytics")}>
              Performans Analizi
            </Button>
            <Button variant="ghost" onClick={() => router.push("/education/tutor")}>
              AI Mentor ile devam et
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

