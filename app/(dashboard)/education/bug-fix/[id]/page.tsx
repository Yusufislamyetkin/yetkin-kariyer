"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import {
  AlertCircle,
  ArrowLeft,
  Bug,
  CheckCircle,
  Lightbulb,
  ListChecks,
  Terminal,
  Wrench,
} from "lucide-react";
import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage } from "@/types/live-coding";
import { cn } from "@/lib/utils";

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

interface BugFixTask {
  id: string;
  title: string;
  description: string | null;
  buggyCode: Partial<Record<LiveCodingLanguage, string>>;
  expectedFix: string | null;
  expectedOutput: string | null;
  hints: string[];
  acceptanceCriteria: string[];
  languages: LiveCodingLanguage[];
  timeLimitMinutes: number | null;
}

const LANGUAGE_LABEL: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
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
  typescript: "javascript",
  ts: "javascript",
  node: "javascript",
  java: "java",
};

const DEFAULT_LANGUAGE: LiveCodingLanguage = "javascript";

const normalizeLanguage = (value: unknown): LiveCodingLanguage | null => {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase();
  return LANGUAGE_ALIASES[key] ?? null;
};

const normalizeLanguageList = (input: unknown): LiveCodingLanguage[] => {
  if (!input) return [];
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
    ? input.split(",")
    : [input];
  const languages = values
    .map((entry) => normalizeLanguage(entry))
    .filter((language): language is LiveCodingLanguage => Boolean(language));
  return Array.from(new Set(languages));
};

const normalizeStringArray = (input: unknown): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map((item) => item.trim());
  }
  if (typeof input === "string" && input.trim().length > 0) {
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
  return [];
};

const normalizeTextBlock = (input: unknown): string | null => {
  if (!input) return null;
  if (typeof input === "string") {
    const trimmed = input.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(input)) {
    const joined = input
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .join("\n");
    return joined.length > 0 ? joined : null;
  }
  return null;
};

const normalizeCodeMap = (
  input: unknown,
  languages: LiveCodingLanguage[],
  fallbackLanguage: LiveCodingLanguage
): Partial<Record<LiveCodingLanguage, string>> => {
  const map: Partial<Record<LiveCodingLanguage, string>> = {};

  if (typeof input === "string") {
    map[fallbackLanguage] = input;
  } else if (input && typeof input === "object" && !Array.isArray(input)) {
    Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
      const language = normalizeLanguage(key);
      if (language && typeof value === "string") {
        map[language] = value;
      }
    });
  } else if (Array.isArray(input)) {
    input.forEach((entry) => {
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        const language = normalizeLanguage(
          (entry as Record<string, unknown>).language ??
            (entry as Record<string, unknown>).lang
        );
        const code = (entry as Record<string, unknown>).code;
        if (language && typeof code === "string") {
          map[language] = code;
        }
      }
    });
  }

  if (Object.keys(map).length === 0) {
    map[fallbackLanguage] = "";
  }

  const ensuredLanguages = languages.length ? languages : [fallbackLanguage];
  ensuredLanguages.forEach((language) => {
    if (map[language] === undefined) {
      map[language] = map[fallbackLanguage] ?? "";
    }
  });

  return map;
};

const parseBugFixTasks = (raw: unknown): BugFixTask[] => {
  if (!raw) return [];

  const payload = Array.isArray(raw)
    ? raw
    : typeof raw === "object" && raw !== null && Array.isArray((raw as { tasks?: unknown }).tasks)
    ? (raw as { tasks: unknown[] }).tasks
    : typeof raw === "object" && raw !== null
    ? [raw]
    : [];

  return payload
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const parsedLanguages = normalizeLanguageList(
        record.languages ?? record.language ?? record.languageOptions ?? record.allowedLanguages
      );
      const languages = parsedLanguages.length ? parsedLanguages : [DEFAULT_LANGUAGE];
      const fallbackLanguage = languages[0] ?? DEFAULT_LANGUAGE;

      const buggyCode = normalizeCodeMap(
        record.buggyCode ??
          record.bugCode ??
          record.code ??
          record.initialCode ??
          record.starterCode ??
          record.template,
        languages,
        fallbackLanguage
      );

      const acceptanceCriteria = normalizeStringArray(
        record.acceptanceCriteria ?? record.expectations ?? record.checks ?? record.successCriteria
      );
      const hints = normalizeStringArray(record.hints ?? record.tips ?? record.suggestions);

      return {
        id: typeof record.id === "string" ? record.id : `bugfix-task-${index + 1}`,
        title:
          typeof record.title === "string"
            ? record.title
            : typeof record.scenario === "string"
            ? record.scenario
            : typeof record.name === "string"
            ? record.name
            : `Bug Fix Görevi ${index + 1}`,
        description:
          typeof record.description === "string"
            ? record.description
            : typeof record.scenario === "string"
            ? record.scenario
            : typeof record.prompt === "string"
            ? record.prompt
            : null,
        buggyCode,
        expectedFix:
          typeof record.expectedFix === "string"
            ? record.expectedFix
            : typeof record.expectedBehavior === "string"
            ? record.expectedBehavior
            : typeof record.expectedBehaviour === "string"
            ? record.expectedBehaviour
            : typeof record.solution === "string"
            ? record.solution
            : null,
        expectedOutput: normalizeTextBlock(
          record.expectedOutput ?? record.expectedOutputs ?? record.output ?? record.outputs
        ),
        hints,
        acceptanceCriteria,
        languages,
        timeLimitMinutes:
          typeof record.timeLimitMinutes === "number"
            ? record.timeLimitMinutes
            : typeof record.timeLimit === "number"
            ? record.timeLimit
            : null,
      } satisfies BugFixTask;
    })
    .filter((task): task is BugFixTask => Boolean(task));
};

export default function BugFixPage() {
  const params = useParams();
  const router = useRouter();

  const resolvedBugFixId =
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

  const startedAtRef = useRef<number | null>(null);

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

        const response = await fetch(`/api/education/bug-fix/${resolvedId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isCancelled) return;

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data?.error || "Bug fix bilgileri alınamadı.";
          const errorDetails = data?.details;
          console.error("[BugFixPage] Error fetching quiz:", errorMessage, errorDetails);
          setSubmitError(errorMessage);
          setQuiz(null);
          return;
        }

        if (isCancelled) return;

        if (!data.quiz) {
          console.error("[BugFixPage] Quiz data is missing in response");
          setSubmitError("Bug fix verisi bulunamadı.");
          setQuiz(null);
          return;
        }

        // Questions field'ının varlığını kontrol et
        if (!data.quiz.questions) {
          console.error("[BugFixPage] Quiz questions field is missing");
          setSubmitError("Bug fix içeriği eksik veya bozuk.");
          setQuiz(null);
          return;
        }

        setQuiz(data.quiz);
        setSubmitError(null);
      } catch (error) {
        if (isCancelled) return;
        console.error("[BugFixPage] Error fetching bug fix:", error);
        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
        if (error instanceof Error && error.name === "AbortError") {
          setSubmitError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
        } else {
          setSubmitError(`Bug fix yüklenirken hata: ${errorMessage}`);
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
      const parsedTasks = parseBugFixTasks(quiz.questions);
      if (parsedTasks.length === 0) {
        console.error("[BugFixPage] No tasks parsed from quiz questions");
        setSubmitError("Bug fix görevleri parse edilemedi veya boş.");
      }
      return parsedTasks;
    } catch (parseError) {
      console.error("[BugFixPage] Error parsing bug fix tasks:", parseError);
      setSubmitError("Bug fix görevleri işlenirken bir hata oluştu.");
      return [];
    }
  }, [quiz]);

  useEffect(() => {
    if (!tasks.length) {
      setActiveTaskId(null);
      if (quiz && !submitError) {
        // Only set error if we have a quiz but no tasks
        setSubmitError("Bug fix görevleri bulunamadı.");
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
              task.buggyCode[language] ?? task.buggyCode[languages[0]] ?? "";
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

  const activeBuggyCode =
    activeTask && activeLanguage
      ? activeTask.buggyCode[activeLanguage] ??
        activeTask.buggyCode[activeTask.languages[0] ?? DEFAULT_LANGUAGE] ??
        ""
      : "";

  const activeUserCode =
    activeTask && activeLanguage
      ? taskCodes[activeTask.id]?.[activeLanguage] ?? ""
      : "";

  const completedTaskCount = useMemo(() => {
    return tasks.reduce((count, task) => {
      const language = taskLanguages[task.id] ?? task.languages[0] ?? DEFAULT_LANGUAGE;
      const userCode = taskCodes[task.id]?.[language] ?? "";
      const buggyCode =
        task.buggyCode[language] ??
        task.buggyCode[task.languages[0] ?? DEFAULT_LANGUAGE] ??
        "";
      if (userCode.trim() && userCode.trim() !== buggyCode.trim()) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [tasks, taskCodes, taskLanguages]);

  const isAnyTaskEdited = completedTaskCount > 0;
  const submitDisabled = submitting || !isAnyTaskEdited;

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
              task.buggyCode[language] ??
              task.buggyCode[fallbackLanguage] ??
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
    },
    [activeTask, activeLanguage]
  );

  const handleSubmit = async () => {
    if (submitting || !quiz) return;

    if (!isAnyTaskEdited) {
      setSubmitError("En az bir görevi düzenledikten sonra gönderim yapabilirsiniz.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const durationSeconds = startedAtRef.current
        ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000))
        : 0;

      const combinedCode = tasks
        .map((task, index) => {
          const language = taskLanguages[task.id] ?? task.languages[0] ?? DEFAULT_LANGUAGE;
          const userCode = taskCodes[task.id]?.[language] ?? "";
          const label = LANGUAGE_LABEL[language] ?? language.toUpperCase();
          return `// Görev ${index + 1}: ${task.title} (${label})\n${userCode}`;
        })
        .join("\n\n/* --- */\n\n");

      const response = await fetch(`/api/education/bug-fix/${resolvedBugFixId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fixedCode: combinedCode,
          metrics: {
            bugsFixed: completedTaskCount,
            timeTaken: durationSeconds,
            codeQuality: 0,
          },
          duration: durationSeconds,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Bug fix gönderimi başarısız oldu.");
      }

      if (typeof window !== "undefined" && data?.bugFixAttempt) {
        sessionStorage.setItem(
          "latest-bug-fix-attempt",
          JSON.stringify({
            attempt: data.bugFixAttempt,
            quizId: resolvedBugFixId,
            quizTitle: quiz?.title ?? "",
            storedAt: Date.now(),
          })
        );
      }

      router.push(`/education/bug-fix/${resolvedBugFixId}/result`);
    } catch (error) {
      console.error("Error submitting bug fix:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Bug fix gönderimi sırasında bir hata oluştu."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Bug fix yükleniyor...</p>
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
            Bug Fix Bulunamadı
          </h2>
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {submitError}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/education/bug-fix">
              <Button variant="gradient" className="w-full sm:w-auto">
                Bug Fix&apos;lere Dön
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
    <div className="mx-auto max-w-6xl space-y-6 pb-12 animate-fade-in">
      <Link href="/education/bug-fix">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bug Fix&apos;lere Dön
        </Button>
      </Link>

      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-6 text-white">
          <div className="mb-2 flex items-center gap-3">
            <Bug className="h-8 w-8" />
            <h1 className="text-2xl font-display font-bold md:text-3xl">{quiz.title}</h1>
          </div>
          {quiz.description ? <p className="text-red-100">{quiz.description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {quiz.course.expertise ? (
              <span className="rounded bg-white/20 px-2 py-1">{quiz.course.expertise}</span>
            ) : null}
            {quiz.course.topic ? (
              <span className="rounded bg-white/20 px-2 py-1">{quiz.course.topic}</span>
            ) : null}
            {quiz.course.topicContent ? (
              <span className="rounded bg-white/20 px-2 py-1">{quiz.course.topicContent}</span>
            ) : null}
          </div>
        </div>
      </Card>

      {tasks.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Görevler Bulunamadı
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {submitError || "Bu bug fix için henüz görev tanımlanmamış."}
            </p>
            <Link href="/education/bug-fix">
              <Button variant="outline">Bug Fix&apos;lere Dön</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {tasks.length > 1 ? (
            <div className="space-y-4">
              <Card variant="elevated" className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ListChecks className="h-5 w-5 text-red-400" />
                    Görevler ({completedTaskCount}/{tasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.map((task, index) => {
                    const language =
                      taskLanguages[task.id] ?? task.languages[0] ?? DEFAULT_LANGUAGE;
                    const userCode = taskCodes[task.id]?.[language] ?? "";
                    const buggyCode =
                      task.buggyCode[language] ??
                      task.buggyCode[task.languages[0] ?? DEFAULT_LANGUAGE] ??
                      "";
                    const isCompleted =
                      userCode.trim().length > 0 && userCode.trim() !== buggyCode.trim();

                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => handleSelectTask(task.id)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-3 text-left transition-all duration-150",
                          activeTaskId === task.id
                            ? "border-red-500/60 bg-red-500/10 shadow-sm"
                            : "border-gray-800 bg-gray-950/70 hover:border-red-500/40 hover:bg-gray-900/60",
                          isCompleted ? "ring-1 ring-emerald-500/40" : ""
                        )}
                      >
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                          <span>Görev {index + 1}</span>
                          <span className={isCompleted ? "text-emerald-400" : "text-gray-500"}>
                            {isCompleted ? "Düzeltildi" : "Bekliyor"}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-sm font-medium text-gray-100">
                          {task.title}
                        </p>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ) : null}

          <div className="space-y-6">
            {activeTask ? (
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl">{activeTask.title}</CardTitle>
                    {activeLanguage ? (
                      <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Seçili dil: {LANGUAGE_LABEL[activeLanguage]}
                      </span>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activeTask.description ? (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      {activeTask.description}
                    </div>
                  ) : null}

                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-red-200">
                          <Bug className="h-4 w-4" />
                          Hatalı Kod
                        </div>
                      </div>
                      <div className="border border-red-500/40 rounded-lg overflow-hidden">
                        <LiveCodingEditor
                          taskId={`${activeTask.id}-buggy`}
                          languages={activeTask.languages}
                          activeLanguage={activeLanguage ?? activeTask.languages[0] ?? DEFAULT_LANGUAGE}
                          value={activeBuggyCode}
                          onChange={() => undefined}
                          onLanguageChange={() => undefined}
                          readOnly
                          height={420}
                          className="border-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                          <Wrench className="h-4 w-4" />
                          Çözümünüz
                        </div>
                      </div>
                      <div className="border border-emerald-500/40 rounded-lg overflow-hidden">
                        <LiveCodingEditor
                          taskId={activeTask.id}
                          languages={activeTask.languages}
                          activeLanguage={activeLanguage ?? activeTask.languages[0] ?? DEFAULT_LANGUAGE}
                          value={activeUserCode}
                          onChange={handleActiveCodeChange}
                          onLanguageChange={handleActiveLanguageSelect}
                          height={420}
                          className="border-0"
                        />
                      </div>
                    </div>
                  </div>

                  {activeTask.expectedFix ? (
                    <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                      <p className="mb-1 font-semibold text-emerald-200">Beklenen Davranış</p>
                      <p>{activeTask.expectedFix}</p>
                    </div>
                  ) : null}

                  {activeTask.acceptanceCriteria.length ? (
                    <div className="rounded-lg border border-gray-800 bg-gray-950/70 px-4 py-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-200">
                        <ListChecks className="h-4 w-4 text-emerald-400" />
                        Kontrol Listesi
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {activeTask.acceptanceCriteria.map((criteria, index) => (
                          <li key={`${activeTask.id}-criteria-${index}`}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {activeTask.expectedOutput ? (
                    <div className="rounded-lg border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-100">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-gray-200">
                        <Terminal className="h-4 w-4 text-emerald-400" />
                        Beklenen Çıktı
                      </div>
                      <pre className="max-h-64 overflow-auto whitespace-pre-wrap">
                        {activeTask.expectedOutput}
                      </pre>
                    </div>
                  ) : null}

                  {activeTask.hints.length ? (
                    <div className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      <div className="flex items-center gap-2 font-semibold text-amber-200">
                        <Lightbulb className="h-4 w-4" />
                        İpuçları
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {activeTask.hints.map((hint, index) => (
                          <li key={`${activeTask.id}-hint-${index}`}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card variant="elevated">
                <CardContent className="py-16 text-center text-gray-400">
                  Görev seçilemedi.
                </CardContent>
              </Card>
            )}

            <Card variant="elevated">
              <CardContent className="space-y-4">
                {submitError ? (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {submitError}
                  </div>
                ) : null}
                <Button
                  onClick={handleSubmit}
                  disabled={submitDisabled}
                  variant="gradient"
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Düzeltmeyi Gönder
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  Gönderim sonrası AI değerlendirmesi otomatik olarak başlatılır.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

