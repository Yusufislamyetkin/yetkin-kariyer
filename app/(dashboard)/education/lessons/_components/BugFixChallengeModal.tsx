"use client";

import { useState, useCallback } from "react";
import { X, Play, Loader2, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage } from "@/types/live-coding";
import { cn } from "@/lib/utils";

type BugFixChallengeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    buggyCode: string;
    fixDescription: string;
    language: LiveCodingLanguage;
  };
  onComplete?: (code: string, language: LiveCodingLanguage, output?: any) => void;
};

type RunResult = {
  stdout?: string;
  stderr?: string;
  output?: string;
  compileStdout?: string;
  compileStderr?: string;
  exitCode?: number | null;
  errorMessage?: string;
};

export function BugFixChallengeModal({
  isOpen,
  onClose,
  task,
  onComplete,
}: BugFixChallengeModalProps) {
  const [code, setCode] = useState(task.buggyCode);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleRunCode = useCallback(async () => {
    if (!code.trim()) return;

    setRunning(true);
    setRunResult(null);

    try {
      const response = await fetch("/api/education/live-coding/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: task.language,
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRunResult({
          errorMessage: data.error || "Kod çalıştırılırken bir hata oluştu",
        });
      } else {
        setRunResult({
          stdout: data.run?.stdout,
          stderr: data.run?.stderr,
          output: data.run?.output,
          compileStdout: data.compile?.stdout,
          compileStderr: data.compile?.stderr,
          exitCode: data.run?.code,
        });
      }
    } catch (error) {
      console.error("Code run error:", error);
      setRunResult({
        errorMessage: "Kod çalıştırma servisine ulaşılamadı",
      });
    } finally {
      setRunning(false);
    }
  }, [code, task.language]);

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete(code, task.language, runResult || undefined);
    }
    setCompleted(true);
    setTimeout(() => {
      onClose();
      setCompleted(false);
      setCode(task.buggyCode);
      setRunResult(null);
    }, 1500);
  }, [code, task.language, task.buggyCode, runResult, onComplete, onClose]);

  const handleReset = useCallback(() => {
    setCode(task.buggyCode);
    setRunResult(null);
  }, [task.buggyCode]);

  if (!isOpen) return null;

  const languageLabel: Record<LiveCodingLanguage, string> = {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Bug Fix Görevi
              </h2>
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {task.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Task Description */}
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                Görev Açıklaması
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {task.fixDescription}
              </p>
            </CardContent>
          </Card>

          {/* Buggy Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Hatalı Kod ({languageLabel[task.language]})
              </p>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Başlangıç Koduna Dön
              </Button>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <LiveCodingEditor
                taskId="bugfix-challenge"
                languages={[task.language]}
                activeLanguage={task.language}
                value={code}
                onChange={setCode}
                onLanguageChange={() => {}}
                height={400}
              />
            </div>
          </div>

          {/* Run Button */}
          <Button
            onClick={handleRunCode}
            disabled={running || !code.trim()}
            className="w-full gap-2"
            variant="gradient"
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

          {/* Output */}
          {runResult && (
            <Card className={cn(
              "border-2",
              runResult.errorMessage || runResult.exitCode !== 0 || runResult.stderr || runResult.compileStderr
                ? "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/30"
                : "border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/30"
            )}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {runResult.errorMessage || runResult.exitCode !== 0 || runResult.stderr || runResult.compileStderr
                    ? "Hata veya Çıktı"
                    : "Başarılı Çıktı"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-mono max-h-64 overflow-y-auto">
                  {runResult.errorMessage ||
                    runResult.stderr ||
                    runResult.compileStderr ||
                    runResult.output ||
                    runResult.stdout ||
                    runResult.compileStdout ||
                    "Çıktı yok"}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Complete Button */}
          {runResult && !runResult.errorMessage && (
            <Button
              onClick={handleComplete}
              disabled={completed}
              className="w-full gap-2"
              variant="gradient"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Tamamlandı!
                </>
              ) : (
                "Görevi Tamamla"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

