"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { BottomSheet } from "@/app/components/ui/BottomSheet";
import {
  AlertCircle,
  ArrowLeft,
  Code,
  CheckCircle,
  Lightbulb,
  ListChecks,
  ChevronLeft,
  ChevronRight,
  Menu,
  Play,
  Loader2,
  Terminal,
} from "lucide-react";
import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage } from "@/types/live-coding";
import { cn } from "@/lib/utils";
import { normalizeLiveCodingPayload } from "@/lib/education/liveCoding";
import type { LiveCodingTask } from "@/types/live-coding";
import { useCelebration } from "@/app/contexts/CelebrationContext";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: unknown;
  course: {
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
  };
}

const LANGUAGE_LABEL: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  php: "PHP",
  typescript: "TypeScript",
  go: "Go",
  rust: "Rust",
  cpp: "C++",
  kotlin: "Kotlin",
  ruby: "Ruby",
};

const LANGUAGE_ALIASES: Record<string, LiveCodingLanguage> = {
  csharp: "csharp",
  "c#": "csharp",
  cs: "csharp",
  dotnet: "csharp",
  ".net": "csharp",
  python: "python",
  py: "python",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  node: "javascript",
  java: "java",
  php: "php",
  go: "go",
  golang: "go",
  rust: "rust",
  cpp: "cpp",
  "c++": "cpp",
  kotlin: "kotlin",
  kt: "kotlin",
  ruby: "ruby",
  rb: "ruby",
};

const DEFAULT_LANGUAGE: LiveCodingLanguage = "javascript";

const normalizeLanguage = (value: unknown): LiveCodingLanguage | null => {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase();
  return LANGUAGE_ALIASES[key] ?? null;
};

export default function LiveCodingPage() {
  const params = useParams();
  const router = useRouter();
  const { celebrate } = useCelebration();

  const resolvedLiveCodingId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [taskLanguages, setTaskLanguages] = useState<Record<string, LiveCodingLanguage>>({});
  const [taskCodes, setTaskCodes] =
    useState<Record<string, Partial<Record<LiveCodingLanguage, string>>>>({});
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileTaskSheetOpen, setMobileTaskSheetOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<{
    stdout?: string;
    stderr?: string;
    output?: string;
    compileStdout?: string;
    compileStderr?: string;
    exitCode?: number;
    errorMessage?: string;
    isCorrect?: boolean;
  } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [aiEvaluation, setAiEvaluation] = useState<{
    loading: boolean;
    feedback?: string;
    correctedCode?: string;
    comments?: string[];
    isCorrect?: boolean;
    errors?: Array<{ line: number; description: string }>;
    specificErrors?: Array<{ location: string; issue: string; fix: string }>;
  } | null>(null);

  const startedAtRef = useRef<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const aiFeedbackRef = useRef<HTMLDivElement>(null);

  // Normalize output for comparison (trim, normalize whitespace, remove trailing newlines)
  const normalizeOutput = (output: string): string => {
    return output
      .trim()
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n") // Normalize multiple newlines
      .replace(/[ \t]+/g, " ") // Normalize spaces
      .replace(/[ \t]+\n/g, "\n") // Remove trailing spaces
      .replace(/\n[ \t]+/g, "\n") // Remove leading spaces
      .trim();
  };

  // Compare output with expected output
  const compareOutputs = (actual: string, expected: string): boolean => {
    const normalizedActual = normalizeOutput(actual);
    const normalizedExpected = normalizeOutput(expected);
    
    // Exact match
    if (normalizedActual === normalizedExpected) {
      return true;
    }
    
    // Check if expected contains "..." (partial match indicator)
    if (normalizedExpected.includes("...")) {
      const parts = normalizedExpected.split("...");
      if (parts.length === 2) {
        const start = normalizeOutput(parts[0]);
        const end = normalizeOutput(parts[1]);
        return normalizedActual.startsWith(start) && normalizedActual.endsWith(end);
      }
    }
    
    return false;
  };

  useEffect(() => {
    const resolvedId = typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

    if (!resolvedId) {
        setLoading(false);
        setQuiz(null);
        return;
      }

    setSubmitError(null);
    setTaskLanguages({});
    setTaskCodes({});
    setActiveTaskId(null);
    startedAtRef.current = null;

    let isCancelled = false;

    const fetchQuiz = async () => {
      setLoading(true);
      setSubmitError(null);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 saniye timeout

        const response = await fetch(`/api/education/live-coding/${resolvedId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isCancelled) return;

        const data = await response.json();
        
        if (!response.ok) {
          const errorMessage = data?.error || "Canlı kodlama bilgileri alınamadı.";
          const errorDetails = data?.details;
          console.error("[LiveCodingPage] Error fetching quiz:", errorMessage, errorDetails);
          setSubmitError(errorMessage);
          setQuiz(null);
          return;
        }

        if (isCancelled) return;

        if (!data.quiz) {
          console.error("[LiveCodingPage] Quiz data is missing in response");
          setSubmitError("Canlı kodlama verisi bulunamadı.");
          setQuiz(null);
          return;
        }

        // Questions field'ının varlığını kontrol et
        if (!data.quiz.questions) {
          console.error("[LiveCodingPage] Quiz questions field is missing");
          setSubmitError("Canlı kodlama içeriği eksik veya bozuk.");
          setQuiz(null);
          return;
        }

        setQuiz(data.quiz);
        setSubmitError(null);
      } catch (error) {
        if (isCancelled) return;
        console.error("[LiveCodingPage] Error fetching live coding:", error);
        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
        if (error instanceof Error && error.name === "AbortError") {
          setSubmitError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
        } else {
          setSubmitError(`Canlı kodlama yüklenirken hata: ${errorMessage}`);
        }
        setQuiz(null);
      } finally {
        if (!isCancelled) {
        setLoading(false);
        }
      }
    };

    fetchQuiz();

    return () => {
      isCancelled = true;
    };
  }, [params.id]);

  const tasks = useMemo(() => {
    if (!quiz || !quiz.questions) {
      return [];
    }
    try {
      const normalized = normalizeLiveCodingPayload(quiz.questions);
      const parsedTasks = normalized.tasks || [];
      if (parsedTasks.length === 0) {
        console.error("[LiveCodingPage] No tasks parsed from quiz questions");
        setSubmitError("Canlı kodlama görevleri parse edilemedi veya boş.");
      }
      return parsedTasks;
    } catch (parseError) {
      console.error("[LiveCodingPage] Error parsing live coding tasks:", parseError);
      setSubmitError("Canlı kodlama görevleri işlenirken bir hata oluştu.");
      return [];
    }
  }, [quiz]);

  useEffect(() => {
    if (!tasks.length) {
      setActiveTaskId(null);
      if (quiz && !submitError) {
        // Only set error if we have a quiz but no tasks
        setSubmitError("Canlı kodlama görevleri bulunamadı.");
      }
      return;
    }

    setActiveTaskId((prev) => {
      if (prev && tasks.some((task) => task.id === prev)) {
        return prev;
      }
      return tasks[0]?.id ?? null;
    });

    setTaskLanguages((prev) => {
      let changed = false;
      const next: Record<string, LiveCodingLanguage> = {};

      tasks.forEach((task) => {
        const defaultLanguage = task.languages[0] ?? DEFAULT_LANGUAGE;
        const previous = prev[task.id];
        const resolved =
          previous && task.languages.includes(previous) ? previous : defaultLanguage;
        next[task.id] = resolved;
        if (resolved !== previous) {
          changed = true;
        }
      });

      if (Object.keys(prev).length !== tasks.length) {
        changed = true;
    }

      return changed ? next : prev;
    });

    setTaskCodes((prev) => {
      let changed = false;
      const next: Record<string, Partial<Record<LiveCodingLanguage, string>>> = {};

        tasks.forEach((task) => {
        const previousMap = prev[task.id] ?? {};
        const languages = task.languages.length ? task.languages : [DEFAULT_LANGUAGE];
        const map: Partial<Record<LiveCodingLanguage, string>> = {};
        let mapChanged = false;

        languages.forEach((language) => {
          if (typeof previousMap[language] === "string") {
            map[language] = previousMap[language];
          } else {
            map[language] =
              task.initialCode?.[language] ?? task.initialCode?.[languages[0]] ?? "";
            mapChanged = true;
          }
        });

        if (Object.keys(previousMap).length !== languages.length) {
          mapChanged = true;
        }

        if (mapChanged) {
          changed = true;
        }
        next[task.id] = map;
      });

      if (Object.keys(prev).length !== tasks.length) {
        changed = true;
          }

      return changed ? next : prev;
      });

    if (!startedAtRef.current) {
      startedAtRef.current = Date.now();
    }
  }, [tasks]);

  const activeTask = useMemo(
    () => (activeTaskId ? tasks.find((task) => task.id === activeTaskId) ?? null : null),
    [tasks, activeTaskId]
  );

  const activeLanguage: LiveCodingLanguage | null = useMemo(() => {
    if (!activeTask) return null;
    const candidate = taskLanguages[activeTask.id];
    if (candidate && activeTask.languages.includes(candidate)) {
      return candidate;
    }
    return activeTask.languages[0] ?? DEFAULT_LANGUAGE;
  }, [activeTask, taskLanguages]);

  const activeInitialCode =
    activeTask && activeLanguage
      ? activeTask.initialCode?.[activeLanguage] ??
        activeTask.initialCode?.[activeTask.languages[0] ?? DEFAULT_LANGUAGE] ??
        ""
      : "";

  const activeUserCode =
    activeTask && activeLanguage
      ? taskCodes[activeTask.id]?.[activeLanguage] ?? activeInitialCode
      : "";

  const completedTaskCount = useMemo(() => {
    return completedTasks.size;
  }, [completedTasks]);

  const submitDisabled = submitting || completedTaskCount === 0;

  const handleSelectTask = useCallback((taskId: string) => {
    setActiveTaskId(taskId);
    setSubmitError(null);
  }, []);

  const handleLanguageChange = useCallback(
    (taskId: string, language: LiveCodingLanguage) => {
      const task = tasks.find((item) => item.id === taskId);
      if (!task || !task.languages.includes(language)) {
        return;
      }
    setTaskLanguages((prev) => ({
      ...prev,
        [taskId]: language,
      }));
      setTaskCodes((prev) => {
        const previousMap = prev[taskId] ?? {};
        if (previousMap[language] !== undefined) {
          return prev;
        }
        const fallbackLanguage = task.languages[0] ?? DEFAULT_LANGUAGE;
        return {
          ...prev,
          [taskId]: {
            ...previousMap,
            [language]:
              task.initialCode?.[language] ??
              task.initialCode?.[fallbackLanguage] ??
              "",
          },
        };
      });
      setSubmitError(null);
    },
    [tasks]
  );

  const handleActiveLanguageSelect = useCallback(
    (language: LiveCodingLanguage) => {
      if (!activeTask) return;
      handleLanguageChange(activeTask.id, language);
    },
    [activeTask, handleLanguageChange]
  );

  const handleActiveCodeChange = useCallback(
    (code: string) => {
    if (!activeTask || !activeLanguage) return;
    setTaskCodes((prev) => ({
      ...prev,
      [activeTask.id]: {
        ...(prev[activeTask.id] ?? {}),
        [activeLanguage]: code,
      },
    }));
      setSubmitError(null);
      // Clear run result and AI evaluation when code changes
      setRunResult(null);
      setAiEvaluation(null);
    },
    [activeTask, activeLanguage]
  );

  const handleRunCode = useCallback(async () => {
    if (!activeTask || !activeLanguage || !activeUserCode.trim()) return;

    setRunning(true);
    setRunResult(null);
    setSubmitError(null);

    try {
      const runResponse = await fetch("/api/education/live-coding/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeLanguage,
          code: activeUserCode.trim(),
        }),
      });

      const runData = await runResponse.json();

      if (!runResponse.ok) {
        setRunResult({
          errorMessage: runData.error || "Kod çalıştırılırken bir hata oluştu",
          isCorrect: false,
        });
      return;
    }

      const actualOutput = runData.run?.stdout || runData.run?.output || "";
      const hasError = runData.run?.code !== 0 || runData.run?.stderr || runData.compile?.stderr;

      // Check if output matches expected output (simple comparison)
      let isCorrect = false;
      if (!hasError && activeTask.testCases && activeTask.testCases.length > 0) {
        const expectedOutput = activeTask.testCases[0].expectedOutput;
        isCorrect = compareOutputs(actualOutput, expectedOutput);
        
        if (isCorrect) {
          setCompletedTasks((prev) => new Set(prev).add(activeTask.id));
        }
      }

      setRunResult({
        stdout: runData.run?.stdout,
        stderr: runData.run?.stderr,
        output: runData.run?.output,
        compileStdout: runData.compile?.stdout,
        compileStderr: runData.compile?.stderr,
        exitCode: runData.run?.code,
        isCorrect,
      });

      // Scroll to output area
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Code run error:", error);
      setRunResult({
        errorMessage: "Kod çalıştırma servisine ulaşılamadı",
      });
    } finally {
      setRunning(false);
    }
  }, [activeTask, activeLanguage, activeUserCode, compareOutputs]);

  const handleAIAnalysis = useCallback(async () => {
    if (!activeTask || !activeLanguage || !activeUserCode.trim()) return;

    // Check if we have run result
    if (!runResult || (!runResult.stdout && !runResult.output && !runResult.errorMessage)) {
      setSubmitError("Önce kodu çalıştırmanız gerekiyor.");
      return;
    }

    setAiEvaluation({ loading: true });
    setSubmitError(null);

    try {
      const actualOutput = runResult.stdout || runResult.output || "";
      const expectedOutput = activeTask.testCases?.[0]?.expectedOutput || "";

      const evalResponse = await fetch("/api/education/live-coding/evaluate-output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskDescription: activeTask.description || activeTask.title,
          expectedOutput,
          userCode: activeUserCode.trim(),
          userOutput: actualOutput,
          language: activeLanguage,
        }),
      });

      if (evalResponse.ok) {
        const evalData = await evalResponse.json();
        setAiEvaluation({
          loading: false,
          feedback: evalData.feedback,
          correctedCode: evalData.correctedCode,
          comments: evalData.comments || [],
          isCorrect: evalData.isCorrect,
          errors: evalData.errors || [],
          specificErrors: evalData.specificErrors || [],
        });

        // Update completed tasks if AI says it's correct
        if (evalData.isCorrect) {
          setCompletedTasks((prev) => new Set(prev).add(activeTask.id));
          
          // Trigger confetti celebration
          celebrate({
            title: "Case Tamamlandı! 🎉",
            message: `${activeTask.title} başarıyla tamamlandı. Harika iş çıkardın!`,
            variant: "success",
            durationMs: 5000,
          });

          // Mark case as completed in database
          try {
            await fetch(`/api/education/live-coding/${resolvedLiveCodingId}/complete-case`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                taskId: activeTask.id,
                completedAt: new Date().toISOString(),
              }),
            });
          } catch (error) {
            console.error("Error completing case:", error);
            // Don't show error to user, this is a background operation
          }
        }

        // Scroll to AI feedback area
        setTimeout(() => {
          aiFeedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        const errorData = await evalResponse.json();
        setAiEvaluation({
          loading: false,
          feedback: errorData.error || "AI değerlendirmesi alınamadı",
          correctedCode: activeUserCode.trim(),
          comments: [],
          isCorrect: false,
          errors: [],
          specificErrors: [],
        });
      }
    } catch (evalError) {
      console.error("AI evaluation error:", evalError);
      setAiEvaluation({
        loading: false,
        feedback: "AI değerlendirmesi sırasında bir hata oluştu",
        correctedCode: activeUserCode.trim(),
        comments: [],
        isCorrect: false,
        errors: [],
        specificErrors: [],
      });
    }
  }, [activeTask, activeLanguage, activeUserCode, runResult, resolvedLiveCodingId, celebrate]);

  const handleSubmit = async () => {
    if (submitting || !quiz) return;

    if (completedTaskCount === 0) {
      setSubmitError("En az bir görevi başarıyla tamamladıktan sonra gönderim yapabilirsiniz.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const durationSeconds = startedAtRef.current
        ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000))
        : 0;

      const normalizedTasks = tasks.map((task) => {
        const language = taskLanguages[task.id] ?? task.languages[0] ?? DEFAULT_LANGUAGE;
        const userCode = taskCodes[task.id]?.[language] ?? "";
        const initialCode =
          task.initialCode?.[language] ??
          task.initialCode?.[task.languages[0] ?? DEFAULT_LANGUAGE] ??
          "";

        return {
          taskId: task.id,
          language,
          code: userCode || initialCode,
          durationSeconds: durationSeconds,
          timeLimitSeconds: task.timeLimitMinutes ? task.timeLimitMinutes * 60 : null,
        };
      });

      const response = await fetch(`/api/education/live-coding/${resolvedLiveCodingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: normalizedTasks,
          metadata: {
            startedAt: startedAtRef.current ? new Date(startedAtRef.current).toISOString() : null,
            completedAt: new Date().toISOString(),
          },
          metrics: {
            totalDurationSeconds: durationSeconds,
            completedTaskCount,
            totalTaskCount: tasks.length,
          },
          startedAt: startedAtRef.current ? new Date(startedAtRef.current).toISOString() : null,
          completedAt: new Date().toISOString(),
        }),
      });

        const data = await response.json();
        if (!response.ok) {
        throw new Error(data?.error || "Canlı kodlama gönderimi başarısız oldu.");
        }

        if (typeof window !== "undefined" && data?.liveCodingAttempt) {
          sessionStorage.setItem(
            "latest-live-coding-attempt",
            JSON.stringify({
              attempt: data.liveCodingAttempt,
            quizId: resolvedLiveCodingId,
              quizTitle: quiz?.title ?? "",
              storedAt: Date.now(),
            })
          );
        }

      router.push(`/education/live-coding/${resolvedLiveCodingId}/result`);
    } catch (error) {
      console.error("Error submitting live coding:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Canlı kodlama gönderimi sırasında bir hata oluştu."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Canlı kodlama yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <Card variant="elevated" className="max-w-md w-full p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Canlı Kodlama Bulunamadı
          </h2>
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {submitError}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/education/cases">
              <Button variant="gradient" className="w-full sm:w-auto">
                Case&apos;lere Dön
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

  // Task list component (reusable for sidebar and bottom sheet)
  const TaskList = ({ onTaskSelect }: { onTaskSelect?: () => void }) => (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const language =
          taskLanguages[task.id] ?? task.languages[0] ?? DEFAULT_LANGUAGE;
        const userCode = taskCodes[task.id]?.[language] ?? "";
        const initialCode =
          task.initialCode?.[language] ??
          task.initialCode?.[task.languages[0] ?? DEFAULT_LANGUAGE] ??
          "";
        const isCompleted = completedTasks.has(task.id);

  return (
          <button
            key={task.id}
            type="button"
            onClick={() => {
              handleSelectTask(task.id);
              onTaskSelect?.();
            }}
            className={cn(
              "w-full rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200",
              "hover:shadow-md hover:scale-[1.02]",
              activeTaskId === task.id
                ? "border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/20"
                : "border-gray-700/50 bg-gray-900/50 hover:border-cyan-500/50 hover:bg-gray-800/50",
              isCompleted && "ring-2 ring-emerald-500/50"
            )}
        >
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-400">Görev {index + 1}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-gray-700/50 text-gray-500"
                )}
              >
                {isCompleted ? "✓ Tamamlandı" : "Bekliyor"}
        </span>
            </div>
            <p className="line-clamp-2 text-sm font-medium text-gray-100 leading-snug">
              {task.title}
            </p>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8 px-4 sm:px-6 lg:px-8 animate-fade-in pt-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/education/cases">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Case&apos;lere Dön</span>
            <span className="sm:hidden">Geri</span>
          </Button>
        </Link>
        
        {/* Mobile task list button */}
        {tasks.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileTaskSheetOpen(true)}
            className="lg:hidden gap-2"
          >
            <Menu className="h-4 w-4" />
            <span>Görevler ({completedTaskCount}/{tasks.length})</span>
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <Card variant="elevated" className="border-2">
          <CardContent className="py-16 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Görevler Bulunamadı
              </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {submitError || "Bu canlı kodlama için henüz görev tanımlanmamış."}
              </p>
            <Link href="/education/cases">
              <Button variant="outline">Case&apos;lere Dön</Button>
              </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-4 lg:gap-6">
          {/* Desktop Sidebar - Collapsible */}
          {tasks.length > 1 && (
            <aside
              className={cn(
                "hidden lg:block transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "w-0 opacity-0" : "w-72 opacity-100"
              )}
            >
              <Card
                variant="elevated"
                className="sticky top-24 border-2 shadow-xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ListChecks className="h-5 w-5 text-cyan-400" />
                    Görevler ({completedTaskCount}/{tasks.length})
                  </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="h-8 w-8"
                    >
                      {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                    </Button>
                    </div>
                </CardHeader>
                <CardContent>
                  <TaskList />
            </CardContent>
          </Card>
            </aside>
          )}

          {/* Main Content - Full Width */}
          <div className="flex-1 min-w-0 space-y-6">
          {activeTask ? (
              <>
                {/* Task Info - Compact */}
                <Card variant="elevated" className="border-2 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl sm:text-2xl mb-2 text-gray-900 dark:text-gray-100">
                          {activeTask.title}
                        </CardTitle>
                        {activeLanguage && (
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-cyan-500/20 dark:bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                              {LANGUAGE_LABEL[activeLanguage]}
                      </span>
                    </div>
                        )}
                  </div>
                </div>
              </CardHeader>
                  <CardContent className="space-y-3 pt-3">
                    {activeTask.description && (
                      <div className="rounded-xl border-2 border-cyan-500/30 dark:border-cyan-500/30 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 px-4 py-3.5 text-sm text-cyan-900 dark:text-cyan-100 shadow-sm leading-relaxed">
                        {activeTask.description}
                </div>
                    )}


                    {/* Hints - Collapsible */}
                    {activeTask.hints && activeTask.hints.length > 0 && (
                      <details className="rounded-xl border-2 border-amber-500/30 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 overflow-hidden pt-3">
                        <summary className="cursor-pointer p-4 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-colors">
                          <Lightbulb className="h-4 w-4" />
                          İpuçları ({activeTask.hints.length})
                        </summary>
                        <div className="px-4 pb-4 space-y-1.5">
                          {activeTask.hints.map((hint, index) => (
                            <div
                              key={`${activeTask.id}-hint-${index}`}
                              className="text-sm text-amber-900 dark:text-amber-100 pl-4 border-l-2 border-amber-500/30 dark:border-amber-500/30"
                            >
                              {hint}
                            </div>
                      ))}
                  </div>
                      </details>
                    )}
                  </CardContent>
                </Card>

                {/* Full-Width Editor */}
                <Card variant="elevated" className="border-2 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 border-b-2 border-cyan-500/30 dark:border-cyan-500/30 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200 dark:text-cyan-200">
                        <Code className="h-5 w-5" />
                        <span>Kod Editörü</span>
                      </div>
                      <div className="flex items-center gap-3">
                    <Button
                          onClick={handleAIAnalysis}
                          disabled={aiEvaluation?.loading || !runResult || !activeUserCode.trim()}
                      variant="outline"
                          size="sm"
                          className="h-9 px-4 text-sm font-semibold border-2 border-purple-500/50 dark:border-purple-500/50 text-purple-300 dark:text-purple-300 hover:bg-purple-500/20 dark:hover:bg-purple-500/20 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 gap-2"
                        >
                          {aiEvaluation?.loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analiz Ediliyor...
                            </>
                          ) : (
                            <>
                              <Lightbulb className="h-4 w-4" />
                              Yapay Zekaya Analiz Ettir
                            </>
                          )}
                        </Button>
                        <Button
                      onClick={handleRunCode}
                          disabled={running || !activeUserCode.trim()}
                          variant="gradient"
                          size="sm"
                          className="h-9 px-4 text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 gap-2"
                    >
                          {running ? (
                        <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                          Çalıştırılıyor...
                        </>
                      ) : (
                        <>
                              <Play className="h-4 w-4" />
                          Kodu Çalıştır
                        </>
                      )}
                    </Button>
                  </div>
                      </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <div className="border-0 border-cyan-500/40 rounded-none overflow-hidden bg-gray-950">
                      <LiveCodingEditor
                        taskId={activeTask.id}
                        languages={activeTask.languages}
                        activeLanguage={
                          activeLanguage ?? activeTask.languages[0] ?? DEFAULT_LANGUAGE
                        }
                        value={activeUserCode}
                        onChange={handleActiveCodeChange}
                        onLanguageChange={handleActiveLanguageSelect}
                        height={500}
                        className="border-0"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Completion Badge */}
                {completedTasks.has(activeTask.id) && (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/20 border-2 border-emerald-500/40 dark:border-emerald-500/40">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Case Başarıyla Tamamlandı</span>
                      </div>
                )}

                {/* Output Display */}
                {runResult && (
                  <>
                    <div ref={outputRef} className="pt-4" />
                    <Card
                    variant="elevated"
                    className={cn(
                      "border-2 shadow-lg",
                      runResult.isCorrect
                        ? "border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 to-green-500/20 shadow-emerald-500/20"
                        : runResult.errorMessage ||
                          runResult.exitCode !== 0 ||
                          runResult.stderr ||
                          runResult.compileStderr
                        ? "border-red-500/40 bg-gradient-to-br from-red-500/10 to-rose-500/10"
                        : "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-yellow-500/10"
                    )}
                  >
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-300 dark:border-gray-700 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {runResult.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Terminal
                              className={cn(
                                "h-5 w-5",
                                runResult.errorMessage ||
                                  runResult.exitCode !== 0 ||
                                  runResult.stderr ||
                                  runResult.compileStderr
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-amber-600 dark:text-amber-400"
                              )}
                            />
                          )}
                          <span
                            className={
                              runResult.isCorrect
                                ? "text-emerald-700 dark:text-emerald-300"
                                : runResult.errorMessage ||
                                  runResult.exitCode !== 0 ||
                                  runResult.stderr ||
                                  runResult.compileStderr
                                ? "text-red-700 dark:text-red-300"
                                : "text-amber-700 dark:text-amber-300"
                            }
                          >
                            {runResult.isCorrect
                              ? "✓ Doğru Çıktı - Case Başarıyla Tamamlandı!"
                              : runResult.errorMessage ||
                                runResult.exitCode !== 0 ||
                                runResult.stderr ||
                                runResult.compileStderr
                              ? "Hata veya Çıktı"
                              : "Çıktı Beklenenle Eşleşmiyor"}
                          </span>
                      </div>
                        {runResult.exitCode !== undefined && (
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-1 rounded",
                              runResult.exitCode === 0
                                ? "bg-emerald-500/20 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                : "bg-red-500/20 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                            )}
                          >
                            Çıkış Kodu: {runResult.exitCode}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-4">
                      <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-100 font-mono max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-950/50 rounded-lg p-4 border border-gray-300 dark:border-gray-800 leading-relaxed" style={{ fontFamily: 'monospace', unicodeBidi: 'embed', direction: 'ltr' }}>
                        {runResult.errorMessage ||
                          runResult.stderr ||
                          runResult.compileStderr ||
                          runResult.output ||
                          runResult.stdout ||
                          runResult.compileStdout ||
                          "Çıktı yok"}
                      </pre>
                      {activeTask.testCases && activeTask.testCases.length > 0 && !runResult.isCorrect && (
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 p-4">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">Beklenen Çıktı:</p>
                          <pre className="text-xs whitespace-pre-wrap text-amber-800 dark:text-amber-200 font-mono leading-relaxed" style={{ fontFamily: 'monospace', unicodeBidi: 'embed', direction: 'ltr' }}>
                            {activeTask.testCases[0].expectedOutput}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  </>
                )}

                {/* AI Feedback and Corrected Code Section */}
                {aiEvaluation && (
                  <div ref={aiFeedbackRef} className="space-y-4">
                    {/* AI Feedback Card */}
                    <Card
                      variant="elevated"
                      className={cn(
                        "border-2 shadow-lg",
                        aiEvaluation.loading
                          ? "border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                          : aiEvaluation.isCorrect
                          ? "border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 to-green-500/20 shadow-emerald-500/20"
                          : "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-yellow-500/10"
                      )}
                    >
                    <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-700 dark:border-gray-700 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {aiEvaluation.loading ? (
                            <Loader2 className="h-5 w-5 text-cyan-500 dark:text-cyan-400 animate-spin" />
                          ) : aiEvaluation.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                          )}
                          <span
                            className={
                              aiEvaluation.loading
                                ? "text-cyan-600 dark:text-cyan-300"
                                : aiEvaluation.isCorrect
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-amber-600 dark:text-amber-300"
                            }
                          >
                            {aiEvaluation.loading
                              ? "AI Değerlendiriyor..."
                              : aiEvaluation.isCorrect
                              ? "AI Değerlendirmesi: Doğru"
                              : "AI Değerlendirmesi: İyileştirme Gerekli"}
                          </span>
                          </div>
                          </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-4">
                        {aiEvaluation.loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="h-8 w-8 text-cyan-500 dark:text-cyan-400 animate-spin" />
                              <p className="text-sm text-cyan-600 dark:text-cyan-300">AI kodunuzu analiz ediyor...</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {aiEvaluation.feedback && (
                              <div className="rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 p-4">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Geri Bildirim:</p>
                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                  {aiEvaluation.feedback}
                                </p>
                          </div>
                            )}

                            {aiEvaluation.specificErrors && aiEvaluation.specificErrors.length > 0 && (
                              <div className="rounded-lg bg-red-500/10 dark:bg-red-500/10 border border-red-500/30 dark:border-red-500/30 p-4">
                                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">
                                  🔍 Tespit Edilen Hatalar ve Düzeltme Önerileri:
                                </p>
                                <ul className="space-y-3">
                                  {aiEvaluation.specificErrors.map((error, index) => (
                                    <li
                                      key={`specific-error-${index}`}
                                      className="text-sm bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 dark:border-red-500 p-3 rounded-r-lg"
                                    >
                                      <div className="flex items-start gap-2 mb-1">
                                        <span className="text-red-600 dark:text-red-400 font-bold text-base">
                                          📍
                                        </span>
                                        <span className="text-red-800 dark:text-red-300 font-semibold">
                                          {error.location}
                                        </span>
                                      </div>
                                      <div className="ml-6 space-y-2">
                          <div>
                                          <span className="text-red-700 dark:text-red-400 font-medium">
                                            Sorun:
                                          </span>
                                          <p className="text-red-600 dark:text-red-300 mt-1">
                                            {error.issue}
                                          </p>
                          </div>
                        <div>
                                          <span className="text-red-700 dark:text-red-400 font-medium">
                                            Düzeltme:
                                          </span>
                                          <p className="text-red-600 dark:text-red-300 mt-1">
                                            {error.fix}
                                          </p>
                            </div>
                        </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {aiEvaluation.errors && aiEvaluation.errors.length > 0 && (
                              <div className="rounded-lg bg-orange-500/10 dark:bg-orange-500/10 border border-orange-500/30 dark:border-orange-500/30 p-4">
                                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-3">
                                  Genel Hatalar:
                                </p>
                                <ul className="space-y-2">
                                  {aiEvaluation.errors.map((error, index) => (
                                    <li
                                      key={`error-${index}`}
                                      className="text-sm text-orange-600 dark:text-orange-200 flex items-start gap-2"
                                    >
                                      <span className="text-orange-500 dark:text-orange-400 font-semibold">
                                        {error.line > 0 ? `Satır ${error.line}:` : "Genel:"}
                            </span>
                                      <span>{error.description}</span>
                                    </li>
                                  ))}
                                </ul>
                        </div>
                            )}

                            {aiEvaluation.comments && aiEvaluation.comments.length > 0 && (
                              <div className="rounded-lg bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/30 p-4">
                                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3">Önemli Notlar:</p>
                                <ul className="space-y-2">
                                  {aiEvaluation.comments.map((comment, index) => (
                                    <li
                                      key={`comment-${index}`}
                                      className="text-sm text-blue-600 dark:text-blue-200 flex items-start gap-2"
                                    >
                                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                                      <span>{comment}</span>
                                    </li>
                                  ))}
                                </ul>
                      </div>
                    )}
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Corrected Code Editor */}
                    {!aiEvaluation.loading && aiEvaluation.correctedCode && (
                      <Card variant="elevated" className="border-2 shadow-xl overflow-hidden border-purple-500/40 dark:border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-500/10 dark:to-indigo-500/10">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b-2 border-purple-500/30 dark:border-purple-500/30 px-4 py-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-200">
                            <Code className="h-5 w-5" />
                            <span>AI Önerilen Kod (Yorum Satırları ile Açıklamalı)</span>
                  </div>
                        </CardHeader>
                        <CardContent className="p-0 pt-4">
                          <div className="border-0 border-purple-500/40 rounded-none overflow-hidden bg-gray-50 dark:bg-gray-950">
                            <LiveCodingEditor
                              taskId={`${activeTask.id}-corrected`}
                              languages={[activeLanguage ?? activeTask.languages[0] ?? DEFAULT_LANGUAGE]}
                              activeLanguage={activeLanguage ?? activeTask.languages[0] ?? DEFAULT_LANGUAGE}
                              value={aiEvaluation.correctedCode}
                              onChange={() => {}} // Read-only
                              onLanguageChange={() => {}} // Read-only
                              height={400}
                              className="border-0"
                              readOnly={true}
                            />
                </div>
              </CardContent>
            </Card>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                {completedTaskCount > 0 && (
                  <Card variant="elevated" className="border-2 shadow-lg border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                    <CardContent className="space-y-4 pt-6">
              {submitError && (
                        <div className="rounded-xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/10 to-rose-500/10 px-4 py-3 text-sm text-red-200 shadow-sm">
                  {submitError}
                </div>
              )}
                      <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-3 mb-2">
                        <p className="text-sm font-semibold text-emerald-200 text-center">
                          {completedTaskCount} / {tasks.length} case başarıyla tamamlandı
                        </p>
                      </div>
              <Button
                onClick={handleSubmit}
                        disabled={submitDisabled}
                variant="gradient"
                        className="w-full h-12 text-base font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                {submitting ? (
                  <>
                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Çözümü Gönder ({completedTaskCount}/{tasks.length})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
                )}
              </>
            ) : (
              <Card variant="elevated" className="border-2">
                <CardContent className="py-16 text-center text-gray-400">
                  Görev seçilemedi.
                </CardContent>
              </Card>
            )}
        </div>

          {/* Collapsed Sidebar Toggle Button */}
          {tasks.length > 1 && sidebarCollapsed && (
            <div className="hidden lg:block">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarCollapsed(false)}
                className="sticky top-24 h-12 w-12 rounded-xl border-2 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
      </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      {tasks.length > 1 && (
        <BottomSheet
          isOpen={mobileTaskSheetOpen}
          onClose={() => setMobileTaskSheetOpen(false)}
          title={`Görevler (${completedTaskCount}/${tasks.length})`}
        >
          <TaskList onTaskSelect={() => setMobileTaskSheetOpen(false)} />
        </BottomSheet>
      )}
    </div>
  );
}

