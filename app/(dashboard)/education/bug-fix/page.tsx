import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Bug,
  Layers,
  ShieldCheck,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { db } from "@/lib/db";
import type { LiveCodingLanguage } from "@/types/live-coding";

export const dynamic = "force-dynamic";

type BugFixCardData = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  expertise: string | null;
  topic: string | null;
  hints: number;
  acceptance: string[];
  languages: LiveCodingLanguage[];
  createdAt: Date;
};

type ParsedBugFixTask = {
  id: string;
  title: string;
  description: string | null;
  languages: LiveCodingLanguage[];
  hints: number;
  acceptance: string[];
};

type BugFixStats = {
  totalScenarios: number;
  displayedScenarios: number;
  dominantLanguages: Array<{ key: LiveCodingLanguage; count: number }>;
  lastUpdated: Date | null;
};

const LANGUAGE_LABEL: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
};

const LANGUAGE_ORDER: LiveCodingLanguage[] = ["javascript", "csharp", "python", "java"];

const DEFAULT_LANGUAGE: LiveCodingLanguage = "javascript";

const languageAliases: Record<string, LiveCodingLanguage> = {
  csharp: "csharp",
  "c#": "csharp",
  cs: "csharp",
  dotnet: "csharp",
  ".net": "csharp",
  javascript: "javascript",
  js: "javascript",
  typescript: "javascript",
  ts: "javascript",
  node: "javascript",
  python: "python",
  py: "python",
  java: "java",
};

const normalizeLanguage = (value: unknown): LiveCodingLanguage | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return languageAliases[normalized] ?? null;
};

const normalizeLanguageList = (input: unknown): LiveCodingLanguage[] => {
  if (!input) return [];
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
    ? input.split(/[,/]/)
    : [input];

  const languages = values
    .map((entry) => normalizeLanguage(entry))
    .filter((language): language is LiveCodingLanguage => Boolean(language));

  return Array.from(new Set(languages));
};

const normalizeStringArray = (input: unknown, limit = 3): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .slice(0, limit)
      .map((item) => item.trim());
  }
  if (typeof input === "string") {
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, limit);
  }
  return [];
};

const parseBugFixTasks = (raw: unknown): ParsedBugFixTask[] => {
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
      const languages = normalizeLanguageList(
        record.languages ?? record.language ?? record.languageOptions ?? record.allowedLanguages
      );
      return {
        id: typeof record.id === "string" ? record.id : `bugfix-task-${index + 1}`,
        title:
          typeof record.title === "string"
            ? record.title
            : typeof record.scenario === "string"
            ? record.scenario
            : `Bug Fix Görevi ${index + 1}`,
        description:
          typeof record.description === "string"
            ? record.description
            : typeof record.scenario === "string"
            ? record.scenario
            : typeof record.prompt === "string"
            ? record.prompt
            : null,
        languages: languages.length ? languages : [DEFAULT_LANGUAGE],
        hints: normalizeStringArray(record.hints ?? record.tips ?? record.suggestions, 4).length,
        acceptance: normalizeStringArray(
          record.acceptanceCriteria ?? record.expectations ?? record.successCriteria,
          4
        ),
      };
      })
      .filter((task): task is ParsedBugFixTask => Boolean(task));
};

async function getBugFixOverview() {
  try {
    const [recentBugFixes, totalScenarios] = await Promise.all([
      db.quiz.findMany({
        where: { type: "BUG_FIX" },
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          createdAt: true,
          questions: true,
          course: {
            select: {
              expertise: true,
              topic: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      db.quiz.count({
        where: { type: "BUG_FIX" },
      }),
    ]);

    const cards: BugFixCardData[] = recentBugFixes.map((record: {
      id: string;
      title: string;
      description: string | null;
      level: string | null;
      createdAt: Date;
      questions: unknown;
      course?: { expertise?: string | null; topic?: string | null } | null;
    }) => {
      let tasks: ParsedBugFixTask[] = [];
      try {
        tasks = parseBugFixTasks(record.questions as unknown);
      } catch (error) {
        console.error(`[BUG_FIX_PAGE] parse error for ${record.id}`, error);
      }

      const firstTask = tasks[0];
      const languages = Array.from(
        new Set(tasks.flatMap((task) => task.languages))
      ) as LiveCodingLanguage[];

      return {
        id: record.id,
        title: record.title,
        description: record.description ?? firstTask?.description ?? null,
        level: record.level,
        expertise: record.course?.expertise ?? null,
        topic: record.course?.topic ?? null,
        hints: tasks.reduce((sum, task) => sum + task.hints, 0),
        acceptance: firstTask?.acceptance ?? [],
        languages,
        createdAt: record.createdAt,
      };
    });

    const languageMap = new Map<LiveCodingLanguage, number>();
    cards.forEach((card) => {
      card.languages.forEach((language) => {
        languageMap.set(language, (languageMap.get(language) ?? 0) + 1);
      });
    });

    const dominantLanguages = LANGUAGE_ORDER.filter((key) => languageMap.has(key)).map((key) => ({
      key,
      count: languageMap.get(key) ?? 0,
    }));

    const stats: BugFixStats = {
      totalScenarios,
      displayedScenarios: cards.length,
      dominantLanguages,
      lastUpdated: cards[0]?.createdAt ?? null,
    };

    return { cards, stats };
  } catch (error) {
    console.error("[BUG_FIX_PAGE] overview error", error);
    return {
      cards: [],
      stats: {
        totalScenarios: 0,
        displayedScenarios: 0,
        dominantLanguages: [],
        lastUpdated: null,
      },
      error: "Bug fix verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.",
    };
  }
}

function formatDate(value: Date | null) {
  if (!value) return "–";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function BugFixPage() {
  const { cards, stats, error } = await getBugFixOverview();
  const hasData = cards.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/60 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <TerminalSquare className="h-3.5 w-3.5" />
              Bug Fix Studio
            </span>
            <h1 className="text-4xl font-display font-bold leading-tight">
              Debug Odaklı Hata Bulma Atölyesi
            </h1>
            <p className="max-w-2xl text-base text-white/80">
              Hatalı kod parçacıklarını analiz edin, ipuçlarını kullanın ve kabul kriterlerini sağlayarak projeyi
              stabilize edin. Ciddi üretim hatalarına hazır olun.
            </p>
            <div className="flex flex-wrap gap-3">
              {LANGUAGE_ORDER.map((language) => (
                <Link key={language} href={`/education/bug-fix/language/${language}`}>
                  <Button variant="outline" size="sm" className="bg-white/10 text-white hover:bg-white/20">
                    {LANGUAGE_LABEL[language]}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <Card variant="glass" className="w-full max-w-sm border-white/10 bg-white/10 text-white backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Anlık Durum</CardTitle>
              <p className="text-sm text-white/80">Hata senaryolarının özet görünümü</p>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Toplam senaryo</p>
                  <p className="text-3xl font-bold">{stats.totalScenarios}</p>
                </div>
                <div className="rounded-2xl bg-white/20 p-3">
                  <Bug className="h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl bg-black/20 p-4 text-sm">
                <div className="flex items-center justify-between text-white/80">
                  <span>Gösterilen</span>
                  <span className="font-semibold text-white">{stats.displayedScenarios}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Öne çıkan diller</span>
                  <span className="font-semibold text-white">
                    {stats.dominantLanguages.length || "0"}
                  </span>
                </div>
                <div className="text-xs text-white/70">Son güncelleme: {formatDate(stats.lastUpdated)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card variant="elevated" className="border-red-500/10 bg-white dark:bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-200">
              Gerçek hatalar
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kod parçacıklarında gerçek hayattan alınmış hatalarla çalışın.
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="border-red-500/10 bg-white dark:bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-200">
              İpucu destekli çözüm
            </CardTitle>
            <Wrench className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Her senaryo ipuçları, kabul kriterleri ve beklenen çıktılar içerir.
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="border-red-500/10 bg-white dark:bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-200">
              Güvenlik & kalite
            </CardTitle>
            <ShieldCheck className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Refactoring, performans ve güvenlik kontrolleri aynı pakette.
            </p>
          </CardContent>
        </Card>
      </section>

      {error && !hasData ? (
        <Card variant="elevated">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Admin panelinde BTNSeedCodingAndBugfix butonunu kullanarak örnek veri oluşturabilirsiniz.
            </p>
          </CardContent>
        </Card>
      ) : hasData ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                Son hata senaryoları
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                En güncel 12 bug fix içeriği listelenir.
              </p>
            </div>
            <Link href="/education/bug-fix/language/javascript">
              <Button variant="gradient" size="sm">
                Tüm dilleri gör
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <Card
                key={card.id}
                variant="glass"
                className="border border-red-500/10 bg-white/70 p-0 dark:bg-gray-950/80"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-red-500">
                    <span>{card.level ?? "Seviye belirtilmedi"}</span>
                    <span>{formatDate(card.createdAt)}</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{card.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {card.description ?? "Bu bug fix senaryosu yakında açıklanacak."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {card.expertise && (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-600 dark:text-red-300">
                        {card.expertise}
                      </span>
                    )}
                    {card.topic && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">
                        {card.topic}
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 text-sm text-gray-700 dark:border-gray-800/60 dark:bg-gray-900/60 dark:text-gray-200">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <span>{card.languages.length ? card.languages.map((lang) => LANGUAGE_LABEL[lang]).join(" • ") : "Dil etiketi yok"}</span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {card.hints} ipucu
                      </span>
                    </div>
                    {card.acceptance.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        {card.acceptance.map((line) => (
                          <li key={`${card.id}-${line}`} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link href={`/education/bug-fix/${card.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      Senaryoyu aç
                      <Bug className="ml-2 h-4 w-4 text-red-500" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <Card variant="elevated">
          <CardContent className="py-12 text-center">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Henüz bug fix içeriği yok
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Admin panelinden{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">BTNSeedCodingAndBugfix</span>{" "}
              butonuna tıklayarak örnek senaryolar oluşturabilirsiniz.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

