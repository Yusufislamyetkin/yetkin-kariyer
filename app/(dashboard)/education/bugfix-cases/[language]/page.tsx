"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Bug, Target, Wrench } from "lucide-react";
import bugfixCases from "@/data/bugfix-cases.json";
import { checkSubscriptionAndRedirect } from "@/lib/utils/subscription-check";

export const dynamic = "force-dynamic";

const LANGUAGE_ICONS: Record<string, string> = {
  csharp: "💻",
  java: "☕",
  python: "🐍",
  php: "🐘",
  javascript: "📜",
  typescript: "📘",
  go: "🐹",
  rust: "🦀",
  cpp: "⚡",
  kotlin: "🔷",
  swift: "🦉",
  ruby: "💎",
};

const LANGUAGE_COLORS: Record<string, string> = {
  csharp: "#239120",
  java: "#ED8B00",
  python: "#3776AB",
  php: "#777BB4",
  javascript: "#F7DF1E",
  typescript: "#3178C6",
  go: "#00ADD8",
  rust: "#000000",
  cpp: "#00599C",
  kotlin: "#7F52FF",
  swift: "#FA7343",
  ruby: "#CC342D",
};

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

export default function BugfixLanguageCasesPage({
  params,
}: {
  params: { language: string };
}) {
  const language = bugfixCases.languages.find(
    (lang) => lang.id === params.language
  );

  useEffect(() => {
    // Abonelik kontrolü
    checkSubscriptionAndRedirect();
  }, []);

  if (!language) {
    notFound();
  }

  const icon = LANGUAGE_ICONS[language.id] || "💻";
  const color = LANGUAGE_COLORS[language.id] || "#666";

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl border border-red-500/10 bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/50 p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-6 mb-6">
          <Link href="/education/bugfix-cases">
            <Button variant="outline" size="sm" className="bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dillere Dön
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl text-4xl"
              style={{
                backgroundColor: `${color}15`,
                border: `2px solid ${color}30`,
              }}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold leading-tight">
                {language.name} Bugfix Case&apos;leri
              </h1>
              <p className="text-base text-white/80 mt-2">
                {language.cases.length} adet bugfix case ile {language.name} programlama dilinde hata bulma ve düzeltme pratiği yapın.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-full overflow-x-hidden">
        {language.cases.map((caseItem) => (
          <Link
            key={caseItem.id}
            href={`/education/bug-fix/quiz-${caseItem.id}`}
            className="group block"
            onClick={async (e) => {
              const hasSubscription = await checkSubscriptionAndRedirect();
              if (!hasSubscription) {
                e.preventDefault();
              }
            }}
          >
            <Card
              variant="elevated"
              className="h-full border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 hover:border-red-500 dark:hover:border-red-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${color}15`,
                      border: `2px solid ${color}30`,
                    }}
                  >
                    <Bug className="h-6 w-6" style={{ color }} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      DIFFICULTY_STYLES[caseItem.difficulty?.toLowerCase()] || 
                      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {DIFFICULTY_LABELS[caseItem.difficulty] || caseItem.difficulty}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  {caseItem.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {caseItem.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-red-50 dark:bg-red-950/30 p-3">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
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

                {caseItem.acceptanceCriteria && caseItem.acceptanceCriteria.length > 0 && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Kabul Kriterleri
                    </p>
                    <ul className="space-y-1">
                      {caseItem.acceptanceCriteria.slice(0, 2).map((criteria, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="mt-1 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400 flex-shrink-0" />
                          <span className="flex-1 line-clamp-1">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                    Bugfix&apos;i Çöz
                  </span>
                  <ArrowLeft className="h-4 w-4 text-red-600 dark:text-red-400 transition-transform duration-200 group-hover:-translate-x-1 rotate-180" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

