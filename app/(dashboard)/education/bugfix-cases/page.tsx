"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Bug, ArrowRight } from "lucide-react";
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

export default function BugfixCasesPage() {
  const languages = bugfixCases.languages;

  useEffect(() => {
    // Abonelik kontrolü
    checkSubscriptionAndRedirect();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl border border-red-500/10 bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/50 p-8 text-white shadow-2xl">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <Bug className="h-3.5 w-3.5" />
            Bugfix Case&apos;leri
          </span>
          <h1 className="text-4xl font-display font-bold leading-tight">
            Programlama Dilleri
          </h1>
          <p className="max-w-2xl text-base text-white/80">
            Farklı programlama dillerinde hata bulma ve düzeltme pratiği yapmak için hazırlanmış bugfix case&apos;lerini keşfedin. Her dil için 3 adet case bulunmaktadır.
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {languages.map((language) => {
          const icon = LANGUAGE_ICONS[language.id] || "💻";
          const color = LANGUAGE_COLORS[language.id] || "#666";

          return (
            <Link
              key={language.id}
              href={`/education/bugfix-cases/${language.id}`}
              className="group block"
            >
              <Card
                variant="elevated"
                className="relative h-full cursor-pointer border-2 border-transparent bg-white transition-all duration-300 hover:border-red-500/50 hover:shadow-lg dark:bg-gray-950 dark:hover:border-red-500/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                      style={{
                        backgroundColor: `${color}15`,
                        border: `2px solid ${color}30`,
                      }}
                    >
                      {icon}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-red-600 dark:text-gray-500 dark:group-hover:text-red-400" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                    {language.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900/50">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Case Sayısı
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color }}
                    >
                      {language.cases.length}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                      Case&apos;leri Görüntüle →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

