"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Code, Clock, Target, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkSubscriptionBeforeAction } from "@/lib/utils/subscription-check";
import type { LiveCodingCase } from "@/lib/education/loadLiveCodingCases";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  advanced: "İleri",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

interface CaseListProps {
  cases: LiveCodingCase[];
  color: string;
}

export function CaseList({ cases, color }: CaseListProps) {
  const [completedCaseIds, setCompletedCaseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Get user completed cases
    fetch("/api/lessons/completions")
      .then((res) => res.json())
      .then((data) => {
        const completed = new Set<string>();
        // Process completions if needed
        setCompletedCaseIds(completed);
      })
      .catch(() => {
        // Ignore errors
      });
  }, []);

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-full overflow-x-hidden">
      {cases.map((caseItem) => {
        const isCompleted = completedCaseIds.has(caseItem.id);
        
        return (
          <Link
            key={caseItem.id}
            href={`/education/live-coding/quiz-${caseItem.id}`}
            className="group block"
            onClick={async (e) => {
              const hasSubscription = await checkSubscriptionBeforeAction();
              if (!hasSubscription) {
                e.preventDefault();
              }
            }}
          >
            <Card
              variant="elevated"
              className={cn(
                "h-full border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden",
                isCompleted
                  ? "border-emerald-500/60 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/30 dark:border-emerald-500/40"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-emerald-500 dark:hover:border-emerald-500"
              )}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 z-10">
                  {/* Modern ribbon corner badge */}
                  <div className="relative w-20 h-20 overflow-hidden">
                    {/* Ribbon diagonal strip */}
                    <div className="absolute top-0 right-0 w-28 h-8 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 shadow-lg transform rotate-45 translate-x-6 -translate-y-2 group-hover:shadow-xl group-hover:shadow-emerald-500/50 group-hover:scale-105 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center transform -rotate-45 translate-x-0 translate-y-0">
                        <CheckCircle className="h-4 w-4 text-white drop-shadow-md" />
                      </div>
                    </div>
                    {/* Ribbon fold shadow for depth */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-700/30 transform rotate-45 translate-x-6 translate-y-0"></div>
                  </div>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${color}15`,
                      border: `2px solid ${color}30`,
                    }}
                  >
                    <Code className="h-6 w-6" style={{ color }} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        DIFFICULTY_STYLES[caseItem.difficulty?.toLowerCase()] || 
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {DIFFICULTY_LABELS[caseItem.difficulty] || caseItem.difficulty}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {caseItem.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {caseItem.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                    Görev
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">
                    {caseItem.instructions}
                  </p>
                </div>

                {caseItem.hints && caseItem.hints.length > 0 && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-950/30 p-3">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      İpuçları
                    </p>
                    <ul className="space-y-1">
                      {caseItem.hints.slice(0, 2).map((hint, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <span className="mt-1 h-1 w-1 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
                          <span className="flex-1 line-clamp-1">{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className={cn(
                    "text-sm font-semibold transition-colors",
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
                  )}>
                    {isCompleted ? "Tekrar Çöz" : "Case'i Çöz"}
                  </span>
                  <ArrowLeft className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 rotate-180",
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )} />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </section>
  );
}
