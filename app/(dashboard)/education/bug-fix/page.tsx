/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import {
  Bug,
  Cpu,
  Globe2,
  Hexagon,
  Layers,
  TerminalSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import type { LiveCodingLanguage } from "@/types/live-coding";

type BugFixLanguageMeta = {
  language: LiveCodingLanguage;
  title: string;
  description: string;
  badge: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradient: string;
};

const LANGUAGE_CARDS: BugFixLanguageMeta[] = [
  {
    language: "csharp",
    title: "C# Bug Fix",
    description: "Hatalı C# kodlarını bulun, düzeltin ve .NET ekosisteminde debug becerilerinizi geliştirin.",
    badge: ".NET & OOP",
    icon: Hexagon,
    gradient: "from-violet-500 via-indigo-500 to-purple-500",
  },
  {
    language: "javascript",
    title: "JavaScript Bug Fix",
    description: "JavaScript hatalarını tespit edin, düzeltin ve web geliştirme becerilerinizi güçlendirin.",
    badge: "Web & Frontend",
    icon: Globe2,
    gradient: "from-yellow-400 via-orange-400 to-amber-500",
  },
  {
    language: "python",
    title: "Python Bug Fix",
    description: "Python kodlarındaki hataları bulun, düzeltin ve veri analizi becerilerinizi artırın.",
    badge: "Data & AI",
    icon: Layers,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
  },
  {
    language: "java",
    title: "Java Bug Fix",
    description: "Java kodlarındaki hataları tespit edin, düzeltin ve backend geliştirme yetkinliğinizi artırın.",
    badge: "Backend & API",
    icon: Cpu,
    gradient: "from-red-500 via-rose-500 to-pink-500",
  },
];

export default function BugFixPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-300">
          <TerminalSquare className="h-3.5 w-3.5" />
          Bug Fix Studio
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Programlama Dillerinde Bug Fix
        </h1>
        <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          Hatalı kodları bulun, düzeltin ve debug becerilerinizi geliştirin. Dilediğiniz programlama dilini seçin,
          hazırlanmış bug fix görevleriyle pratik yapın.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {LANGUAGE_CARDS.map(({ language, title, description, badge, icon: Icon, gradient }) => (
          <Card
            key={language}
            variant="elevated"
            hover
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gray-950/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(15,23,42,0.8)]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 transition-opacity duration-300 group-hover:opacity-90`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/30 opacity-60" />
            <Link href={`/education/bug-fix/language/${language}`} className="relative z-10 block h-full">
              <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-inset ring-white/30 backdrop-blur">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 shadow-sm backdrop-blur">
                    {badge}
                  </span>
                </div>
                <CardTitle className="text-2xl font-semibold text-white drop-shadow">{title}</CardTitle>
                <p className="text-sm leading-relaxed text-white/80">{description}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white/90 shadow-lg transition-all duration-200 group-hover:border-white/30 group-hover:bg-black/30 group-hover:shadow-xl">
                <span className="flex items-center gap-2">
                  Bug fix görevlerini keşfet
                  <span className="h-1 w-10 rounded-full bg-white/40 transition-all duration-200 group-hover:w-14 group-hover:bg-white/70" />
                </span>
                <Bug className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

