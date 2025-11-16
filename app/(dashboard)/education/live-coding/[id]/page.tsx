"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Code,
  AlertCircle,
  CheckCircle,
  Clock,
  ListChecks,
  Loader2,
  Play,
  Terminal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage, LiveCodingTask } from "@/types/live-coding";
import { cn } from "@/lib/utils";

interface LiveCodingQuizResponse {
  id: string;
  title: string;
  description: string | null;
  questions: unknown;
  liveCoding?: {
    instructions?: string;
    tasks: LiveCodingTask[];
    supportedLanguages: LiveCodingLanguage[];
    maxTaskCount: number;
  };
  course: {
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
  };
}

interface TaskSubmissionState {
  [taskId: string]: Partial<Record<LiveCodingLanguage, string>>;
}

interface TaskLanguageState {
  [taskId: string]: LiveCodingLanguage;
}

interface TaskTimerState {
  [taskId: string]: number;
}

type TaskRunStatus = "idle" | "running" | "success" | "error";

interface TaskRunResult {
  status: TaskRunStatus;
  stdout?: string;
  stderr?: string;
  output?: string;
  compileStdout?: string;
  compileStderr?: string;
  exitCode?: number | null;
  time?: number | null;
  languageVersion?: string;
  errorMessage?: string;
}

const languageLabel: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
};

export default function LiveCodingPage() {
  const params = useParams();
  const router = useRouter();

  const resolvedQuizId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const [quiz, setQuiz] = useState<LiveCodingQuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskCodes, setTaskCodes] = useState<TaskSubmissionState>({});
  const [taskLanguages, setTaskLanguages] = useState<TaskLanguageState>({});
  const [taskTimers, setTaskTimers] = useState<TaskTimerState>({});
  const [taskRunResults, setTaskRunResults] = useState<
    Record<string, Partial<Record<LiveCodingLanguage, TaskRunResult>>>
  >({});
  const initialisedRef = useRef(false);
  const startedAtRef = useRef<string | null>(null);

  const tasks = useMemo<LiveCodingTask[]>(() => {
    if (!quiz?.liveCoding?.tasks) {
      return [];
    }
    return quiz.liveCoding.tasks.slice(0, quiz.liveCoding.maxTaskCount ?? quiz.liveCoding.tasks.length);
  }, [quiz]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!params.id) {
        setLoading(false);
        setQuiz(null);
        return;
      }

      setLoading(true);
      setSubmitError(null);
      
      try {
        const response = await fetch(`/api/education/live-coding/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          const errorMessage = data?.error || "Canlı kodlama bilgileri alınamadı.";
          const errorDetails = data?.details;
          console.error("[LiveCodingPage] Error fetching quiz:", errorMessage, errorDetails);
          setSubmitError(errorMessage);
          setQuiz(null);
          return;
        }

        if (!data.quiz) {
          console.error("[LiveCodingPage] Quiz data is missing in response");
          setSubmitError("Canlı kodlama verisi bulunamadı.");
          setQuiz(null);
          return;
        }

        // LiveCoding config'inin varlığını kontrol et
        if (!data.quiz.liveCoding || !data.quiz.liveCoding.tasks || data.quiz.liveCoding.tasks.length === 0) {
          console.error("[LiveCodingPage] Live coding tasks are missing or empty");
          setSubmitError("Canlı kodlama görevleri bulunamadı.");
          setQuiz(null);
          return;
        }

        setQuiz(data.quiz);
        setSubmitError(null);
      } catch (error) {
        console.error("[LiveCodingPage] Error fetching live coding:", error);
        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
        setSubmitError(`Canlı kodlama yüklenirken hata: ${errorMessage}`);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (!tasks.length || initialisedRef.current) {
      return;
    }

    const defaultLanguages: TaskLanguageState = {};
    const defaultCodes: TaskSubmissionState = {};
    const defaultTimers: TaskTimerState = {};

    tasks.forEach((task) => {
      const defaultLanguage = task.languages?.[0] ?? "csharp";
      defaultLanguages[task.id] = defaultLanguage;

      const initialCode: Partial<Record<LiveCodingLanguage, string>> = {};
      (task.languages?.length ? task.languages : quiz?.liveCoding?.supportedLanguages || []).forEach(
        (language) => {
          initialCode[language] = task.initialCode?.[language] ?? "";
        }
      );
      defaultCodes[task.id] = initialCode;
      defaultTimers[task.id] = Math.max(0, task.timeLimitMinutes * 60);
    });

    setActiveTaskId(tasks[0]?.id ?? null);
    setTaskLanguages(defaultLanguages);
    setTaskCodes(defaultCodes);
    setTaskTimers(defaultTimers);
    startedAtRef.current = new Date().toISOString();
    initialisedRef.current = true;
  }, [tasks, quiz?.liveCoding?.supportedLanguages]);

  useEffect(() => {
    if (!tasks.length) {
      return;
    }

    const interval = window.setInterval(() => {
      setTaskTimers((prev) => {
        let hasChange = false;
        const next: TaskTimerState = { ...prev };

        tasks.forEach((task) => {
          const taskId = task.id;
          const previousValue = prev[taskId];
          if (previousValue === undefined) {
            return;
          }

          if (previousValue > 0) {
            next[taskId] = previousValue - 1;
            hasChange = true;
          }
        });

        return hasChange ? next : prev;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [tasks]);

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  const activeLanguage: LiveCodingLanguage | null = activeTask
    ? taskLanguages[activeTask.id] ?? activeTask.languages?.[0] ?? "csharp"
    : null;

  const activeCode =
    activeTask && activeLanguage
      ? taskCodes[activeTask.id]?.[activeLanguage] ?? ""
      : "";

  const activeRunResult =
    activeTask && activeLanguage ? taskRunResults[activeTask.id]?.[activeLanguage] : undefined;
  const isRunInProgress = activeRunResult?.status === "running";
  const isTaskExpired = useCallback(
    (taskId: string) => (taskTimers[taskId] ?? 0) <= 0,
    [taskTimers]
  );

  const runButtonDisabled =
    !activeTask ||
    !activeLanguage ||
    !activeCode.trim() ||
    isRunInProgress ||
    isTaskExpired(activeTask.id);
  const runStatus: TaskRunStatus = activeRunResult?.status ?? "idle";
  const runStatusLabel =
    runStatus === "running"
      ? "Çalıştırılıyor"
      : runStatus === "success"
      ? "Başarılı"
      : runStatus === "error"
      ? "Hata"
      : "Hazır";
  const runStatusBadgeClass = cn(
    "px-2.5 py-1 text-xs font-semibold rounded-full",
    runStatus === "running" && "bg-amber-500/20 text-amber-300 border border-amber-500/40",
    runStatus === "success" && "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
    runStatus === "error" && "bg-red-500/20 text-red-200 border border-red-500/30",
    runStatus === "idle" && "bg-gray-800 text-gray-300 border border-gray-700"
  );

  const handleLanguageChange = (language: LiveCodingLanguage) => {
    if (!activeTask) return;
    setTaskLanguages((prev) => ({
      ...prev,
      [activeTask.id]: language,
    }));
  };

  const handleCodeChange = (code: string) => {
    if (!activeTask || !activeLanguage) return;
    setTaskCodes((prev) => ({
      ...prev,
      [activeTask.id]: {
        ...(prev[activeTask.id] ?? {}),
        [activeLanguage]: code,
      },
    }));
    setTaskRunResults((prev) => {
      const taskEntry = prev[activeTask.id];
      if (!taskEntry) {
        return prev;
      }
      const runResult = taskEntry[activeLanguage];
      if (!runResult || runResult.status === "running" || runResult.status === "idle") {
        return prev;
      }
      return {
        ...prev,
        [activeTask.id]: {
          ...taskEntry,
          [activeLanguage]: {
            ...runResult,
            status: "idle",
          },
        },
      };
    });
  };

  const handleSelectTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setSubmitError(null);
  };

  const updateRunResult = (
    taskId: string,
    language: LiveCodingLanguage,
    result: TaskRunResult
  ) => {
    setTaskRunResults((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] ?? {}),
        [language]: result,
      },
    }));
  };

  const completedTaskCount = useMemo(() => {
    return tasks.filter((task) => {
      const language = taskLanguages[task.id] ?? task.languages[0];
      const code = language ? taskCodes[task.id]?.[language] : "";
      return Boolean(code && code.trim().length > 0);
    }).length;
  }, [tasks, taskCodes, taskLanguages]);

  const pendingSubmitDisabled = useMemo(() => {
    if (!tasks.length) return true;
    return tasks.every((task) => {
      const language = taskLanguages[task.id] ?? task.languages[0];
      const code = language ? taskCodes[task.id]?.[language] : "";
      return !code || !code.trim();
    });
  }, [tasks, taskCodes, taskLanguages]);

  const handleRunCode = async () => {
    if (!activeTask || !activeLanguage) {
      return;
    }

    const code = taskCodes[activeTask.id]?.[activeLanguage] ?? "";
    if (!code.trim()) {
      updateRunResult(activeTask.id, activeLanguage, {
        status: "error",
        errorMessage: "Önce kod girmeniz gerekiyor.",
      });
      return;
    }

    if (isTaskExpired(activeTask.id)) {
      updateRunResult(activeTask.id, activeLanguage, {
        status: "error",
        errorMessage: "Görev süresi dolduğu için kod çalıştırılamıyor.",
      });
      return;
    }

    updateRunResult(activeTask.id, activeLanguage, {
      status: "running",
    });

    try {
      const response = await fetch("/api/education/live-coding/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeLanguage,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Kod çalıştırılamadı.");
      }

      const compile = data?.compile ?? null;
      const run = data?.run ?? null;

      const compileExitCode =
        compile?.code === undefined || compile?.code === null ? 0 : Number(compile.code);
      const runExitCode = run?.code === undefined || run?.code === null ? 0 : Number(run.code);

      const success = compileExitCode === 0 && runExitCode === 0;
      const compileStderrText =
        typeof compile?.stderr === "string" ? compile.stderr.trim() : "";
      const runStderrText = typeof run?.stderr === "string" ? run.stderr.trim() : "";
      const resolvedErrorMessage = success
        ? undefined
        : typeof data?.error === "string" && data.error.trim().length > 0
        ? data.error
        : compileStderrText || runStderrText || undefined;

      updateRunResult(activeTask.id, activeLanguage, {
        status: success ? "success" : "error",
        stdout: run?.stdout ?? "",
        stderr: run?.stderr ?? "",
        output: run?.output ?? "",
        compileStdout: compile?.stdout ?? "",
        compileStderr: compile?.stderr ?? "",
        exitCode: run?.code ?? null,
        time: run?.time ?? null,
        languageVersion: typeof data?.version === "string" ? data.version : undefined,
        errorMessage: resolvedErrorMessage,
      });
    } catch (error) {
      updateRunResult(activeTask.id, activeLanguage, {
        status: "error",
        errorMessage: (error as Error).message || "Kod çalıştırılamadı.",
      });
    }
  };

  const handleSubmit = async () => {
    if (submitting || !quiz || !tasks.length) return;

    if (pendingSubmitDisabled) {
      setSubmitError("En az bir görev için kod yazmalısınız.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const tasksPayload = tasks.map((task) => {
        const language = taskLanguages[task.id] ?? task.languages?.[0] ?? "csharp";
        const code = taskCodes[task.id]?.[language] ?? "";
        const timeLimitSeconds = task.timeLimitMinutes * 60;
        const remainingSeconds = Math.max(0, taskTimers[task.id] ?? timeLimitSeconds);

        return {
          taskId: task.id,
          language,
          code,
          timeLimitSeconds,
          durationSeconds: timeLimitSeconds - remainingSeconds,
          timeRemainingSeconds: remainingSeconds,
        };
      });

        const response = await fetch(`/api/education/live-coding/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: tasksPayload,
          startedAt: startedAtRef.current,
          completedAt: new Date().toISOString(),
          metadata: {
            completedTaskCount,
            totalTaskCount: tasks.length,
          },
        }),
      });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Gönderim sırasında bir hata oluştu.");
        }

        if (typeof window !== "undefined" && data?.liveCodingAttempt) {
          sessionStorage.setItem(
            "latest-live-coding-attempt",
            JSON.stringify({
              attempt: data.liveCodingAttempt,
              quizId: resolvedQuizId,
              quizTitle: quiz?.title ?? "",
              storedAt: Date.now(),
            })
          );
        }

        router.push(`/education/live-coding/${params.id}/result`);
    } catch (error) {
      console.error("Error submitting live coding:", error);
      setSubmitError((error as Error).message || "Görevler gönderilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Canlı kodlama yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Card variant="elevated" className="p-8 text-center max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Canlı Kodlama Bulunamadı
          </h2>
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {submitError}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/education/live-coding">
              <Button variant="gradient" className="w-full sm:w-auto">
                Canlı Kodlamalara Dön
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Sayfayı Yenile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <Link href="/education/live-coding">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Canlı Kodlamalara Dön
        </Button>
      </Link>

      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Code className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-display font-bold">{quiz.title}</h1>
          </div>
          {quiz.description && <p className="text-green-100">{quiz.description}</p>}
          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            {quiz.course.expertise && (
              <span className="px-2 py-1 bg-white/20 rounded">{quiz.course.expertise}</span>
            )}
            {quiz.course.topic && (
              <span className="px-2 py-1 bg-white/20 rounded">{quiz.course.topic}</span>
            )}
            {quiz.course.topicContent && (
              <span className="px-2 py-1 bg-white/20 rounded">{quiz.course.topicContent}</span>
            )}
          </div>
        </div>
        {quiz.liveCoding?.instructions && (
          <div className="bg-gray-900 text-gray-100 px-6 py-4 text-sm border-t border-gray-800">
            {quiz.liveCoding.instructions}
          </div>
        )}
      </Card>

      {tasks.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Görevler Bulunamadı
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {submitError || "Bu canlı kodlama için henüz görev tanımlanmamış."}
            </p>
            <Link href="/education/live-coding">
              <Button variant="outline">Canlı Kodlamalara Dön</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <div className="space-y-4">
              <Card variant="elevated" className="sticky top-24 relative z-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ListChecks className="h-5 w-5 text-emerald-500" />
                    Görevler ({completedTaskCount}/{tasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative z-10">
                  {tasks.map((task, index) => {
                const language = taskLanguages[task.id] ?? task.languages[0];
                const code = language ? taskCodes[task.id]?.[language] : "";
                const isCompleted = Boolean(code && code.trim().length > 0);
                const expired = isTaskExpired(task.id);
                const remaining = taskTimers[task.id] ?? task.timeLimitMinutes * 60;
                const minutes = Math.floor(remaining / 60)
                  .toString()
                  .padStart(2, "0");
                const seconds = (remaining % 60).toString().padStart(2, "0");

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleSelectTask(task.id)}
                    disabled={false}
                    className={cn(
                      "w-full text-left rounded-lg border px-3 py-3 transition-all duration-150 relative z-10 cursor-pointer",
                      activeTaskId === task.id
                        ? "border-emerald-500/60 bg-emerald-500/10 shadow-sm"
                        : "border-gray-800 bg-gray-950/70 hover:border-emerald-500/40 hover:bg-gray-900/60",
                      expired ? "opacity-75 cursor-not-allowed" : ""
                    )}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Görev {index + 1}</span>
                      <span className={cn(expired ? "text-red-400" : "text-emerald-400")}>
                        {minutes}:{seconds}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 line-clamp-2">{task.title}</p>
                    <div className="mt-2 text-xs uppercase tracking-wide">
                      {expired
                        ? "Süre doldu"
                        : isCompleted
                        ? "Kod girildi"
                        : "Başlanmadı"}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {activeTask ? (
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl mb-2">{activeTask.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        {Math.ceil(activeTask.timeLimitMinutes)} dk
                      </span>
                      <span>{activeTask.languages.map((lang) => languageLabel[lang]).join(" • ")}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 text-sm text-gray-200 whitespace-pre-wrap">
                  {activeTask.description || "Görev açıklaması bulunmuyor."}
                </div>

                {activeTask.acceptanceCriteria?.length ? (
                  <div className="bg-gray-950/80 border border-gray-900 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-200 mb-3">Beklenenler</p>
                    <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                      {activeTask.acceptanceCriteria.map((criteria) => (
                        <li key={`${activeTask.id}-${criteria}`}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {activeLanguage ? (
                  <LiveCodingEditor
                    taskId={activeTask.id}
                    languages={activeTask.languages}
                    activeLanguage={activeLanguage}
                    value={activeCode}
                    onChange={handleCodeChange}
                    onLanguageChange={handleLanguageChange}
                    timeRemainingSeconds={taskTimers[activeTask.id]}
                    readOnly={isTaskExpired(activeTask.id)}
                    height={420}
                  />
                ) : null}
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      variant="outline"
                      onClick={handleRunCode}
                      disabled={runButtonDisabled}
                      className="sm:w-auto relative z-10"
                    >
                      {isRunInProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Çalıştırılıyor...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Kodu Çalıştır
                        </>
                      )}
                    </Button>
                    {activeRunResult?.languageVersion ? (
                      <span className="text-xs text-gray-500">
                        Çalıştırılan sürüm: {activeRunResult.languageVersion}
                      </span>
                    ) : null}
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-950/70">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                        <Terminal className="h-4 w-4 text-emerald-400" />
                        Çalışma Çıktısı
                      </div>
                      <span className={runStatusBadgeClass}>{runStatusLabel}</span>
                    </div>
                    {runStatus === "idle" && !activeRunResult ? (
                      <div className="px-4 py-6 text-sm text-gray-400 text-center">
                        Çıktıyı görmek için kodu çalıştırın.
                      </div>
                    ) : runStatus === "running" ? (
                      <div className="px-4 py-6 text-sm text-gray-300 flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Kod değerlendiriliyor...
                      </div>
                    ) : (
                      <div className="space-y-4 px-4 py-4 text-sm text-gray-300">
                        {runStatus === "idle" && activeRunResult ? (
                          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-100">
                            Kod değiştirildi. Güncel sonucu görmek için tekrar çalıştırın.
                          </div>
                        ) : null}
                        {activeRunResult?.errorMessage ? (
                          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200">
                            {activeRunResult.errorMessage}
                          </div>
                        ) : null}
                        {activeRunResult?.compileStderr ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-300 mb-1">
                              Derleme Hatası
                            </p>
                            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-gray-900/80 px-3 py-2 text-red-200">
                              {activeRunResult.compileStderr}
                            </pre>
                          </div>
                        ) : null}
                        {activeRunResult?.stderr ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300 mb-1">
                              Hata Çıktısı
                            </p>
                            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-gray-900/80 px-3 py-2 text-amber-100">
                              {activeRunResult.stderr}
                            </pre>
                          </div>
                        ) : null}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300 mb-1">
                            Standart Çıktı
                          </p>
                          {activeRunResult?.stdout?.trim() ? (
                            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-gray-900/80 px-3 py-2 text-gray-100">
                              {activeRunResult.stdout}
                            </pre>
                          ) : (
                            <div className="rounded-md border border-gray-800 bg-gray-900/50 px-3 py-2 text-xs text-gray-500">
                              Çıktı bulunmuyor.
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {activeRunResult?.exitCode !== undefined && activeRunResult?.exitCode !== null ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium text-gray-400">Çıkış Kodu:</span>
                              <span>{activeRunResult.exitCode}</span>
                            </span>
                          ) : null}
                          {typeof activeRunResult?.time === "number" ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium text-gray-400">Çalışma Süresi:</span>
                              <span>{activeRunResult.time.toFixed(3)} sn</span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card variant="elevated">
              <CardContent className="py-16 text-center text-gray-400">
                Görev bulunamadı.
              </CardContent>
            </Card>
          )}

          <Card variant="elevated">
            <CardContent className="space-y-4">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm rounded-lg px-4 py-3">
                  {submitError}
                </div>
              )}
              <Button
                onClick={handleSubmit}
                disabled={submitting || pendingSubmitDisabled}
                variant="gradient"
                className="w-full relative z-10"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Görevleri Gönder
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Gönderim sonrası AI değerlendirmesi otomatik olarak başlatılacaktır.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

