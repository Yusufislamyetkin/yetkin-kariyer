"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Bug,
  Loader2,
  Wrench,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface BugFixMetrics {
  bugsFixed?: number | null;
  timeTaken?: number | null;
  codeQuality?: number | null;
  [key: string]: unknown;
}

interface BugFixAttempt {
  id: string;
  quizId: string;
  fixedCode?: string | null;
  metrics?: BugFixMetrics | null;
  createdAt?: string;
}

interface StoredBugFixAttempt {
  attempt: BugFixAttempt;
  quizId: string;
  quizTitle: string;
  storedAt: number;
}

export default function BugFixResultPage() {
  const params = useParams();
  const router = useRouter();
  const quizId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [attempt, setAttempt] = useState<BugFixAttempt | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) {
      setError("Geçersiz bug fix oturumu.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        let stored: StoredBugFixAttempt | null = null;
        if (typeof window !== "undefined") {
          const raw = sessionStorage.getItem("latest-bug-fix-attempt");
          if (raw) {
            try {
              stored = JSON.parse(raw) as StoredBugFixAttempt;
            } catch {
              stored = null;
            }
            sessionStorage.removeItem("latest-bug-fix-attempt");
          }
        }

        if (stored && stored.quizId === quizId) {
          setAttempt(stored.attempt);
          setQuizTitle(stored.quizTitle ?? "");
          return;
        }

        const response = await fetch(
          `/api/education/bug-fix/attempts?quizId=${quizId}&limit=1`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Bug fix sonucu alınamadı.");
        }

        const payload = await response.json();
        const latestAttempt = (payload?.attempts ?? [])[0] as
          | (BugFixAttempt & { quiz?: { title?: string | null } })
          | undefined;

        if (!latestAttempt) {
          throw new Error("Gönderilen düzeltme bulunamadı.");
        }

        setAttempt(latestAttempt);
        setQuizTitle(latestAttempt.quiz?.title ?? "");
      } catch (err) {
        console.error("Bug fix result fetch error:", err);
        setError(err instanceof Error ? err.message : "Sonuçlar yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quizId]);

  const metrics = useMemo(() => {
    if (!attempt?.metrics || typeof attempt.metrics !== "object") {
      return {} as BugFixMetrics;
    }
    return attempt.metrics as BugFixMetrics;
  }, [attempt]);

  const formattedDuration = useMemo(() => {
    const seconds = metrics.timeTaken ?? null;
    if (typeof seconds !== "number" || seconds <= 0) {
      return "Belirsiz";
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
            {error || "Son gönderim verisine ulaşılamadı. Lütfen tekrar deneyin."}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push(`/education/bug-fix/${quizId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Bug fix görevine dön
            </Button>
            <Button variant="outline" onClick={() => router.push("/education/bug-fix")}>
              Bug fix listesine dön
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
            Bug Fix Sonucu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {quizTitle
              ? `${quizTitle} düzeltmesini tamamladınız.`
              : "Gönderiminiz kaydedildi."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/education/bug-fix")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Listeye Dön
          </Button>
          <Button variant="gradient" onClick={() => router.push(`/education/bug-fix/${quizId}`)}>
            Yeniden Dene
          </Button>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bug className="h-5 w-5 text-red-500" />
            Düzeltme Özeti
          </CardTitle>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Gönderim Kimliği: {attempt.id}
          </span>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200/60 bg-white/40 p-4 text-center dark:border-gray-700/60 dark:bg-gray-900/40">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Düzeltilen Hata</p>
            <p className="mt-2 text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {typeof metrics.bugsFixed === "number" ? metrics.bugsFixed : "Bekleniyor"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white/40 p-4 text-center dark:border-gray-700/60 dark:bg-gray-900/40">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Harcanan Süre</p>
            <p className="mt-2 text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {formattedDuration}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white/40 p-4 text-center dark:border-gray-700/60 dark:bg-gray-900/40">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kod Kalitesi</p>
            <p className="mt-2 text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {typeof metrics.codeQuality === "number"
                ? `%${Math.round(metrics.codeQuality)}`
                : "Bekleniyor"}
            </p>
          </div>
        </CardContent>
      </Card>

      {attempt.fixedCode ? (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Düzeltilen Kod</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-lg bg-gray-950/80 p-4 text-sm text-gray-100">
              {attempt.fixedCode}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <Card variant="elevated">
          <CardContent className="text-sm text-gray-600 dark:text-gray-400">
            Kod analizi kısa süre içinde güncellenecektir.
          </CardContent>
        </Card>
      )}

      <Card variant="elevated">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Sonraki adım: performansını geliştir
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kod kalitesi analizi tamamlandığında detaylar analytics ekranında görünecek.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => router.push("/education/analytics")}>
              <Wrench className="mr-2 h-4 w-4" />
              Analizleri Görüntüle
            </Button>
            <Button variant="ghost" onClick={() => router.push("/education/tutor")}>
              AI mentor ile devam et
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

