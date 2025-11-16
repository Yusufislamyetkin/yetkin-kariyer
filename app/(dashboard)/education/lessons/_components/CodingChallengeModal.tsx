"use client";

import { useState, useCallback } from "react";
import { X, Play, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage } from "@/types/live-coding";
import { cn } from "@/lib/utils";

type CodingChallengeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    description: string;
    languages: LiveCodingLanguage[];
    acceptanceCriteria?: string[];
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
  aiExplanation?: string;
};

export function CodingChallengeModal({
  isOpen,
  onClose,
  task,
  onComplete,
}: CodingChallengeModalProps) {
  const [activeLanguage, setActiveLanguage] = useState<LiveCodingLanguage>(
    task.languages[0] || "javascript"
  );
  
  // C# template for console projects
  const getCSharpTemplate = () => `using System;

class Program
{
    static void Main(string[] args)
    {
        // Kodunu buraya yaz
        
    }
}`;

  const [code, setCode] = useState(() => {
    // Initialize with C# template if C# is the active language and code is empty
    const defaultLang = task.languages[0] || "javascript";
    if (defaultLang === "csharp") {
      return getCSharpTemplate();
    }
    return "";
  });
  
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
          language: activeLanguage,
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRunResult({
          errorMessage: data.error || "Kod çalıştırılırken bir hata oluştu",
        });
      } else {
        const hasError = data.run?.code !== 0 || data.run?.stderr || data.compile?.stderr;
        let aiExplanation: string | undefined;
        
        // If there's an error, get AI explanation
        if (hasError) {
          try {
            const errorText = data.run?.stderr || data.compile?.stderr || data.run?.stdout || "";
            const explanationResponse = await fetch("/api/ai/lesson-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lessonSlug: "", // Not needed for error explanation
                messages: [
                  {
                    role: "user",
                    content: `Kod hatası için kısa ve net bir açıklama yap (maksimum 2-3 cümle):\n\n${errorText}\n\nKod:\n${code.trim()}`,
                  },
                ],
              }),
            });
            
            if (explanationResponse.ok) {
              const explanationData = await explanationResponse.json();
              aiExplanation = explanationData.content || undefined;
            }
          } catch (err) {
            console.error("Error getting AI explanation:", err);
            // Continue without AI explanation
          }
        }
        
        setRunResult({
          stdout: data.run?.stdout,
          stderr: data.run?.stderr,
          output: data.run?.output,
          compileStdout: data.compile?.stdout,
          compileStderr: data.compile?.stderr,
          exitCode: data.run?.code,
          aiExplanation,
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
  }, [code, activeLanguage]);

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete(code, activeLanguage, runResult || undefined);
    }
    setCompleted(true);
    setTimeout(() => {
      onClose();
      setCompleted(false);
      setCode("");
      setRunResult(null);
    }, 1500);
  }, [code, activeLanguage, runResult, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {task.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {task.description}
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
          {/* Language Selector */}
          {task.languages.length > 1 && (
            <div className="flex gap-2">
              {task.languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setActiveLanguage(lang);
                    // Set C# template if switching to C# and code is empty
                    if (lang === "csharp" && !code.trim()) {
                      setCode(getCSharpTemplate());
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    activeLanguage === lang
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {lang === "csharp" ? "C#" : lang === "javascript" ? "JavaScript" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Acceptance Criteria */}
          {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="text-sm">Kabul Kriterleri</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {task.acceptanceCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 dark:text-amber-400">•</span>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Code Editor */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <LiveCodingEditor
              taskId="coding-challenge"
              languages={task.languages}
              activeLanguage={activeLanguage}
              value={code}
              onChange={setCode}
              onLanguageChange={setActiveLanguage}
              height={400}
            />
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
              runResult.errorMessage || runResult.exitCode !== 0
                ? "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/30"
                : "border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/30"
            )}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {runResult.errorMessage || runResult.exitCode !== 0
                    ? "Hata"
                    : "Çıktı"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {runResult.aiExplanation && (
                  <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">AI Açıklaması:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{runResult.aiExplanation}</p>
                  </div>
                )}
                <pre className="text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-mono">
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
