"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Loader2,
  RefreshCcw,
  Sparkles,
  Target,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { AIAnalysis } from "@/types";
import { useCelebration } from "@/app/contexts/CelebrationContext";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic?: string | null;
  difficulty?: string | null;
}

interface QuizAttempt {
  id: string;
  score: number;
  answers: number[];
  aiAnalysis: AIAnalysis | null;
  completedAt: string;
  duration?: number | null;
  quiz: {
    id: string;
    title: string;
    passingScore: number;
    topic?: string | null;
    level?: string | null;
    questions: QuizQuestion[];
    course: {
      id: string;
      title: string;
    } | null;
  };
}

interface AchievementPayload {
  attemptId: string;
  source: "quiz" | "test";
  badgeResults?: {
    newlyEarnedBadges?: any[];
    totalEarned?: number;
  };
  goalResults?: {
    updated?: boolean;
    updatedGoals?: any[];
    completedGoals?: any[];
  };
  score?: number;
  quizTitle?: string;
  timestamp?: number;
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDuration = (seconds?: number | null) => {
  if (!seconds || seconds <= 0) return "Bilgi yok";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} dk ${secs.toString().padStart(2, "0")} sn`;
};

export default function QuizResultsPage() {
  const params = useParams();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<AchievementPayload | null>(null);
  const { celebrate } = useCelebration();
  const celebratedBadgeIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (params.id) {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Rozet kazanıldığında kutlama yap
  useEffect(() => {
    const newBadges = achievement?.badgeResults?.newlyEarnedBadges ?? [];
    if (newBadges.length > 0) {
      newBadges.forEach((badge) => {
        // Her rozet için sadece bir kere kutlama yap
        if (!celebratedBadgeIds.current.has(badge.id)) {
          celebratedBadgeIds.current.add(badge.id);
          
          // Her rozet için ayrı ayrı kutlama yap (sırayla)
          setTimeout(() => {
            celebrate({
              title: "Yeni Rozet Kazandın!",
              message: `${badge.icon ?? "🏅"} ${badge.name} - ${badge.description}`,
              variant: "badge",
              durationMs: 5000,
            });
          }, celebratedBadgeIds.current.size * 600); // Her rozet için 600ms gecikme
        }
      });
    }
  }, [achievement, celebrate]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/quiz/results/${params.id}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Sonuç bulunamadı");
      }
      const data = await response.json();
      setAttempt(data.attempt);
      const existingAnalysis = (data.attempt?.aiAnalysis ?? null) as AIAnalysis | null;
      const needsUpgrade =
        !!existingAnalysis &&
        (
          typeof existingAnalysis.summary !== "string" ||
          existingAnalysis.summary.trim().length < 20 ||
          !Array.isArray(existingAnalysis.focusAreas) ||
          !Array.isArray(existingAnalysis.nextSteps)
        );

      if (needsUpgrade) {
        setAnalysis(null);
        await handleGenerateAnalysis(true, data.attempt);
      } else {
        setAnalysis(existingAnalysis);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis = async (
    forceOverride?: boolean,
    attemptOverride?: QuizAttempt | null
  ) => {
    const targetAttempt = attemptOverride ?? attempt;
    if (!targetAttempt) return;
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      const shouldForceRegenerate =
        typeof forceOverride === "boolean" ? forceOverride : Boolean(analysis);
      const response = await fetch("/api/ai/analyze-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAttemptId: targetAttempt.id, force: shouldForceRegenerate }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI analizi oluşturulamadı");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Error generating analysis:", err);
      setAnalysisError(
        err instanceof Error ? err.message : "AI analizi oluşturulamadı"
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    if (!attempt || typeof window === "undefined") {
      return;
    }

    try {
      const raw = sessionStorage.getItem("latest-achievement");
      if (!raw) {
        return;
      }
      const parsed: AchievementPayload = JSON.parse(raw);
      if (parsed?.attemptId === attempt.id) {
        setAchievement(parsed);
        sessionStorage.removeItem("latest-achievement");
      }
    } catch (storageError) {
      console.error("Achievement verisi okunamadı:", storageError);
    }
  }, [attempt]);


  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-gray-600 dark:text-gray-300">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span>Sonuçlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="elevated" className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
              Sonuç Yüklenemedi
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="primary" onClick={fetchResults}>
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Sonuç bulunamadı</CardTitle>
            <CardDescription>
              Bu test sonucuna erişilemiyor. Lütfen farklı bir test seçin.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const passed = attempt.score >= attempt.quiz.passingScore;
  const newBadges = achievement?.badgeResults?.newlyEarnedBadges ?? [];
  const completedGoals = achievement?.goalResults?.completedGoals ?? [];
  const totalQuestions = attempt.quiz.questions.length;
  const correctCount = attempt.answers.reduce((count, userAnswer, index) => {
    const correctAnswer = attempt.quiz.questions[index]?.correctAnswer;
    return userAnswer === correctAnswer ? count + 1 : count;
  }, 0);
  const incorrectCount = Math.max(totalQuestions - correctCount, 0);
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : attempt.score;
  const averageTimePerQuestionSeconds =
    attempt.duration && totalQuestions > 0
      ? Math.round((attempt.duration ?? 0) / totalQuestions)
      : null;
  const averageTimePerQuestionLabel =
    averageTimePerQuestionSeconds !== null
      ? `${Math.floor(averageTimePerQuestionSeconds / 60)} dk ${String(
          averageTimePerQuestionSeconds % 60
        ).padStart(2, "0")} sn`
      : "Bilgi yok";

  const topicStatsMap = new Map<
    string,
    { total: number; correct: number; wrong: number }
  >();

  attempt.quiz.questions.forEach((question, index) => {
    const topicKey = question.topic ?? "Genel";
    if (!topicStatsMap.has(topicKey)) {
      topicStatsMap.set(topicKey, { total: 0, correct: 0, wrong: 0 });
    }
    const entry = topicStatsMap.get(topicKey)!;
    entry.total += 1;
    if (attempt.answers[index] === question.correctAnswer) {
      entry.correct += 1;
    } else {
      entry.wrong += 1;
    }
  });

  const topicStats = Array.from(topicStatsMap.entries()).map(([topic, data]) => ({
    topic,
    total: data.total,
    correct: data.correct,
    wrong: data.wrong,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));

  const strongestTopic = topicStats
    .filter((item) => item.total > 0)
    .sort((a, b) => b.accuracy - a.accuracy)[0];

  const weakestTopic = topicStats
    .filter((item) => item.wrong > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  const heroHeading = passed
    ? "Tebrikler, testi başarıyla tamamladın!"
    : "Denemen tamamlandı, sıradaki turda fark yaratabilirsin.";

  const heroDescription = passed
    ? `Genel doğruluk oranı %${accuracy}. ${
        strongestTopic
          ? `${strongestTopic.topic} konusunda oldukça iyi bir performans sergiledin.`
          : ""
      }`
    : `Genel doğruluk oranı %${accuracy}. ${
        weakestTopic
          ? `${weakestTopic.topic} tarafında odaklanırsan skoru hızla yukarı çekebilirsin.`
          : "Bir sonraki denemede kritik konulara çalışarak büyük ilerleme kaydedebilirsin."
      }`;

  const focusImpactStyles: Record<"critical" | "major" | "moderate" | "minor", string> = {
    critical:
      "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
    major:
      "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
    moderate:
      "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
    minor:
      "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
  };

  const focusImpactLabel: Record<"critical" | "major" | "moderate" | "minor", string> = {
    critical: "Kritik Öncelik",
    major: "Yüksek Öncelik",
    moderate: "Orta Öncelik",
    minor: "İyileştirilebilir",
  };

  const summaryText =
    analysis?.summary && analysis.summary.trim().length > 0
      ? analysis.summary
      : undefined;
  const hasDistinctFeedback =
    analysis?.feedback &&
    (!summaryText || analysis.feedback.trim() !== summaryText.trim());
  const strengthsList = analysis?.strengths ?? [];
  const weaknessesList = analysis?.weaknesses ?? [];
  const recommendationsList = analysis?.recommendations ?? [];
  const nextStepsList = analysis?.nextSteps ?? [];
  const focusAreasList = analysis?.focusAreas ?? [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 p-6 shadow-xl dark:border-slate-800/60 dark:from-slate-950 dark:via-slate-900/80 dark:to-indigo-950 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-indigo-200">
              <Sparkles className="h-4 w-4" />
              {passed ? "Başarılı Tamamlama" : "Gelişim Fırsatı"}
            </div>
            <div className="space-y-3 text-slate-900 dark:text-slate-100">
              <h2 className="text-3xl font-display font-semibold sm:text-4xl">{heroHeading}</h2>
              <p className="text-base text-slate-600 dark:text-slate-300">{heroDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="rounded-full bg-white/70 px-3 py-1 text-slate-600 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-slate-200">
                Kurs: {attempt.quiz.course?.title ?? "Bağlı kurs bulunmuyor"}
              </span>
              {attempt.quiz.topic && (
                <span className="rounded-full bg-white/70 px-3 py-1 text-slate-600 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-slate-200">
                  Konu: {attempt.quiz.topic}
                </span>
              )}
              {attempt.quiz.level && (
                <span className="rounded-full bg-white/70 px-3 py-1 text-slate-600 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-slate-200">
                  Seviye: {attempt.quiz.level}
                </span>
              )}
              <span className="rounded-full bg-white/70 px-3 py-1 text-slate-600 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-slate-200">
                Çözüm süresi: {formatDuration(attempt.duration)}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-slate-600 shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-slate-200">
                Tamamlanma zamanı: {formatDateTime(attempt.completedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-lg backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/70">
              <span className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Skorun
              </span>
              <div
                className={`mt-4 flex h-32 w-32 items-center justify-center rounded-full border-4 ${
                  passed
                    ? "border-emerald-400/80 bg-emerald-100/50 text-emerald-600 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "border-rose-400/80 bg-rose-100/40 text-rose-600 dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-300"
                }`}
              >
                <span className="text-4xl font-black">%{attempt.score}</span>
              </div>
              <div className="mt-4 flex flex-col gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span>{passed ? "Geçme kriteri karşılandı" : "Geçme kriteri karşılanmadı"}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Geçme Notu %{attempt.quiz.passingScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Doğruluk Oranı
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">%{accuracy}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {correctCount} doğru / {totalQuestions} soru
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Yanlış Sayısı
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {incorrectCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Doğruya en yakın konular için AI analizi önerileri
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Ortalama Soru Süresi
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {averageTimePerQuestionLabel}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Takıldığın sorular için AI önerilerini incele
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Odaklanılacak Konu
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {weakestTopic ? weakestTopic.topic : "Belirtilmedi"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {weakestTopic
                ? `Doğruluk %${weakestTopic.accuracy} • ${weakestTopic.wrong} yanlış`
                : "AI analizi zorlanılan alanları belirleyecek"}
            </p>
          </div>
        </div>

        {(newBadges.length > 0 || completedGoals.length > 0) && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {newBadges.length > 0 && (
              <div className="rounded-2xl border border-amber-200/70 bg-white/85 p-5 shadow-sm backdrop-blur-sm dark:border-amber-800/40 dark:bg-amber-900/30">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Yeni Rozetler
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {newBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 rounded-xl bg-amber-100/80 px-3 py-2 text-sm font-medium text-amber-800 shadow-sm dark:bg-amber-900/40 dark:text-amber-200"
                    >
                      <span className="text-lg">{badge.icon ?? "🏅"}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div className="rounded-2xl border border-blue-200/70 bg-white/85 p-5 shadow-sm backdrop-blur-sm dark:border-blue-800/40 dark:bg-blue-900/30">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Tamamlanan Hedefler
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-blue-800 dark:text-blue-100">
                  {completedGoals.map((goal) => (
                    <li key={goal.id} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>
                        {goal.goalType === "test_count" && "Test sayısı hedefi tamamlandı"}
                        {goal.goalType === "score_target" && "Skor hedefi tutturuldu"}
                        {goal.goalType === "topic_complete" && "Konu tamamlama hedefi bitti"}
                        {goal.goalType === "streak_maintain" && "Seri hedefi korundu"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              En Güçlü Konu
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {strongestTopic ? strongestTopic.topic : "Genel Yetenek"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {strongestTopic
                ? `Doğruluk %${strongestTopic.accuracy} • ${strongestTopic.correct} doğru`
                : "AI analizi güçlü yönlerini özetleyecek"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Test Boyutu
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {totalQuestions} soru
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {correctCount} doğru • {incorrectCount} yanlış
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Ortalama Zorluk
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {attempt.quiz.level ?? "Belirtilmedi"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Zorluk seviyesi, sonraki hedefleri planlamak için AI raporunda detaylandırılacak.
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Motivasyon Mesajı
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {passed
                ? "Aynı tempoda devam ederek uzmanlık seviyesine yaklaşabilirsin."
                : "AI analizi sana özel aksiyon planı oluşturacak, önerileri uygulamayı unutma."}
            </p>
          </div>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Konu Bazlı Performans</CardTitle>
          <CardDescription className="text-base">
            {attempt.quiz.title} sınavında hangi konularda güçlendiğini ve nerelerde zorlandığını incele.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topicStats.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-12 bg-slate-100/70 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <div className="col-span-4 px-4 py-3">Konu</div>
                <div className="col-span-2 px-4 py-3 text-center">Toplam</div>
                <div className="col-span-2 px-4 py-3 text-center text-emerald-600 dark:text-emerald-300">
                  Doğru
                </div>
                <div className="col-span-2 px-4 py-3 text-center text-rose-600 dark:text-rose-300">
                  Yanlış
                </div>
                <div className="col-span-2 px-4 py-3 text-center">Doğruluk</div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {topicStats.map((item) => (
                  <div key={item.topic} className="grid grid-cols-12 bg-white/90 px-4 py-3 text-sm dark:bg-slate-900/60">
                    <div className="col-span-4 font-medium text-slate-700 dark:text-slate-200">
                      {item.topic}
                    </div>
                    <div className="col-span-2 text-center text-slate-600 dark:text-slate-300">
                      {item.total}
                    </div>
                    <div className="col-span-2 text-center text-emerald-600 dark:text-emerald-300">
                      {item.correct}
                    </div>
                    <div className="col-span-2 text-center text-rose-600 dark:text-rose-300">
                      {item.wrong}
                    </div>
                    <div className="col-span-2 text-center text-slate-700 dark:text-slate-200">
                      %{item.accuracy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              Bu test için konu bazlı veri bulunamadı. AI analizi gelecekte daha fazla deneme ile güçlenecek.
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="elevated" className="relative">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              AI Analizi
            </CardTitle>
            <CardDescription>
              Performansınızı yapay zekâ ile analiz edin ve kişisel geri bildirim alın.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleGenerateAnalysis()}
              disabled={analysisLoading}
              className="flex items-center gap-2"
            >
              {analysisLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analiz yapılıyor...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  {analysis ? "Analizi Yenile" : "AI Analizi Oluştur"}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {analysisError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {!analysis && !analysisLoading && !analysisError && (
            <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/60 p-8 text-center dark:border-blue-900 dark:bg-blue-900/10">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-blue-500 dark:text-blue-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Henüz AI analizi oluşturulmadı
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Güçlü ve gelişime açık yönlerinizi görmek için yukarıdaki butona tıklayarak AI analizi başlatabilirsiniz.
              </p>
              <Button variant="gradient" onClick={() => void handleGenerateAnalysis()}>
                AI Analizi Başlat
              </Button>
            </div>
          )}

          {analysisLoading && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analiz hazırlanıyor...</span>
            </div>
          )}

          {analysis && !analysisLoading && (
            <div className="space-y-6">
              {summaryText && (
                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    <Sparkles className="h-4 w-4" />
                    Genel Özet
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {summaryText}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-5 dark:border-emerald-900/40 dark:bg-emerald-900/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="h-4 w-4" />
                    Güçlü Yönler
                  </h4>
                  {strengthsList.length > 0 ? (
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {strengthsList.map((item, index) => (
                        <li key={`strength-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Güçlü yön bilgisi bulunamadı.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 p-5 dark:border-amber-900/40 dark:bg-amber-900/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    Gelişim Alanları
                  </h4>
                  {weaknessesList.length > 0 ? (
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {weaknessesList.map((item, index) => (
                        <li key={`weakness-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-amber-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Geliştirilmesi gereken alan bilgisi bulunamadı.
                    </p>
                  )}
                </div>
              </div>

              {focusAreasList.length > 0 && (
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    <Target className="h-4 w-4" />
                    Öncelikli Gelişim Alanları
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {focusAreasList.map((area, index) => {
                      const impact = (area.impact ?? "moderate") as keyof typeof focusImpactStyles;
                      return (
                        <div
                          key={`focus-area-${index}`}
                          className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/40 dark:bg-slate-900/40"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {area.topic}
                            </p>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${focusImpactStyles[impact]}`}
                            >
                              {focusImpactLabel[impact]}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {area.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="rounded-full bg-slate-200/60 px-3 py-1 dark:bg-slate-800/60">
                              Doğruluk %{area.accuracy}
                            </span>
                            {weakestTopic && weakestTopic.topic === area.topic && (
                              <span className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                                Sınavdaki en düşük performans
                              </span>
                            )}
                          </div>
                          {area.actions?.length > 0 && (
                            <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                              {area.actions.map((action, actionIndex) => (
                                <li
                                  key={`focus-area-${index}-action-${actionIndex}`}
                                  className="flex items-start gap-2"
                                >
                                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400 dark:bg-indigo-300" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {recommendationsList.length > 0 && (
                <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/80 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                    <Brain className="h-4 w-4" />
                    Uzman Önerileri
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    {recommendationsList.map((item, index) => (
                      <li key={`recommendation-${index}`} className="flex items-start gap-2">
                        <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nextStepsList.length > 0 && (
                <div className="rounded-2xl border border-teal-200/70 bg-teal-50/80 p-5 dark:border-teal-900/40 dark:bg-teal-950/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                    <Target className="h-4 w-4" />
                    Sonraki Günler İçin Aksiyon Planı
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    {nextStepsList.map((step, index) => (
                      <li key={`next-step-${index}`} className="flex items-start gap-2">
                        <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-teal-400" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasDistinctFeedback && (
                <div className="rounded-2xl border border-purple-200/70 bg-purple-50/80 p-5 dark:border-purple-900/40 dark:bg-purple-900/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                    Genel Geri Bildirim
                  </h4>
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {analysis.feedback}
                  </p>
                </div>
              )}

              {analysis.detailedReport && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/40 dark:bg-slate-900/40">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    <Brain className="h-4 w-4" />
                    Detaylı Rapor
                  </h4>
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {analysis.detailedReport}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Soru Cevapları</CardTitle>
          <CardDescription>
            Hangi sorularda doğru ya da yanlış cevap verdiğinizi inceleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {attempt.quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id ?? index}
                className={`rounded-xl border p-5 transition-all ${
                  isCorrect
                    ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10"
                    : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Soru {index + 1}
                    </h4>
                    {question.topic && (
                      <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                        {question.topic}
                      </p>
                    )}
                  </div>
                  <span
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      isCorrect
                        ? "bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        Doğru
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Yanlış
                      </>
                    )}
                  </span>
                </div>

                <p className="mb-4 text-sm text-gray-800 dark:text-gray-200">
                  {question.question}
                </p>

                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const isCorrectOption = optIndex === question.correctAnswer;
                    const isUserAnswer = optIndex === userAnswer;
                    return (
                      <div
                        key={`${question.id}-option-${optIndex}`}
                        className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                          isCorrectOption
                            ? "border-green-300 bg-green-100 font-semibold text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-200"
                            : isUserAnswer
                            ? "border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
                            : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {attempt.quiz.course && (
          <Link href={`/education/courses/${attempt.quiz.course.id}`}>
            <Button variant="gradient" className="flex items-center gap-2">
              Kurs sayfasına dön
            </Button>
          </Link>
        )}
        <Link href="/education/courses">
          <Button variant="secondary">Tüm kurslar</Button>
        </Link>
      </div>
    </div>
  );
}

