import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Code,
  Layers,
  ListChecks,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { db } from "@/lib/db";
import { normalizeLiveCodingPayload } from "@/lib/education/liveCoding";
import type { LiveCodingLanguage } from "@/types/live-coding";

export const dynamic = "force-dynamic";

type LiveCodingCardData = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  expertise: string | null;
  topic: string | null;
  topicContent: string | null;
  taskCount: number;
  languages: LiveCodingLanguage[];
  acceptanceHighlights: string[];
  createdAt: Date;
};

type LiveCodingStats = {
  totalQuizzes: number;
  displayedTasks: number;
  languages: Array<{ key: LiveCodingLanguage; count: number }>;
  lastUpdated: Date | null;
};

const LANGUAGE_LABEL: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
};

const LANGUAGE_ORDER: LiveCodingLanguage[] = ["csharp", "javascript", "python", "java"];

async function getLiveCodingOverview() {
  try {
    const [recentQuizzes, totalQuizzes] = await Promise.all([
      db.quiz.findMany({
        where: { type: "LIVE_CODING" },
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
              topicContent: true,
              difficulty: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      db.quiz.count({
        where: { type: "LIVE_CODING" },
      }),
    ]);

    const cards: LiveCodingCardData[] = recentQuizzes.map((quiz) => {
      let normalized: ReturnType<typeof normalizeLiveCodingPayload> = {
        tasks: [],
        instructions: undefined,
      };
      try {
        normalized = normalizeLiveCodingPayload(quiz.questions as unknown);
      } catch (error) {
        console.error(`[LIVE_CODING_PAGE] normalize error for ${quiz.id}`, error);
      }

      const languages = new Set<LiveCodingLanguage>();
      const acceptanceHighlights = new Set<string>();

      normalized.tasks.forEach((task) => {
        (task.languages || []).forEach((language) => languages.add(language));
        (task.acceptanceCriteria || []).forEach((criteria) => {
          if (criteria && acceptanceHighlights.size < 4) {
            acceptanceHighlights.add(criteria);
          }
        });
      });

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        level: quiz.level,
        expertise: quiz.course?.expertise ?? null,
        topic: quiz.course?.topic ?? null,
        topicContent: quiz.course?.topicContent ?? null,
        taskCount: normalized.tasks.length,
        languages: Array.from(languages),
        acceptanceHighlights: Array.from(acceptanceHighlights),
        createdAt: quiz.createdAt,
      };
    });

    const displayedTasks = cards.reduce((sum, card) => sum + card.taskCount, 0);
    const languageMap = new Map<LiveCodingLanguage, number>();
    cards.forEach((card) => {
      card.languages.forEach((language) => {
        languageMap.set(language, (languageMap.get(language) ?? 0) + 1);
      });
    });

    const languages = LANGUAGE_ORDER.filter((key) => languageMap.has(key)).map((key) => ({
      key,
      count: languageMap.get(key) ?? 0,
    }));

    const stats: LiveCodingStats = {
      totalQuizzes,
      displayedTasks,
      languages,
      lastUpdated: cards[0]?.createdAt ?? null,
    };

    return { cards, stats };
  } catch (error) {
    console.error("[LIVE_CODING_PAGE] overview error", error);
    return {
      cards: [],
      stats: {
        totalQuizzes: 0,
        displayedTasks: 0,
        languages: [],
        lastUpdated: null,
      },
      error: "Canlı kodlama verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.",
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

export default async function LiveCodingPage() {
  const { cards, stats, error } = await getLiveCodingOverview();
  const hasData = cards.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/50 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <TerminalSquare className="h-3.5 w-3.5" />
              Live Coding Studio
            </span>
            <h1 className="text-4xl font-display font-bold leading-tight">
              Gerçek Zamanlı Canlı Kodlama Görevleri
            </h1>
            <p className="max-w-2xl text-base text-white/80">
              Farklı uzmanlık seviyelerine göre hazırlanmış görevlerle pratiğe başlayın. Her görev, AI destekli
              değerlendirme ve kabul kriterleriyle birlikte gelir.
            </p>
            <div className="flex flex-wrap gap-3">
              {LANGUAGE_ORDER.map((language) => (
                <Link key={language} href={`/education/live-coding/language/${language}`}>
                  <Button variant="outline" size="sm" className="bg-white/10 text-white hover:bg-white/20">
                    {LANGUAGE_LABEL[language]}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <Card variant="glass" className="w-full max-w-sm border-white/10 bg-white/10 text-white backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Anlık Özet</CardTitle>
              <p className="text-sm text-white/80">Veriler otomatik olarak güncellenir</p>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Toplam canlı kodlama testi</p>
                  <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
                </div>
                <div className="rounded-2xl bg-white/20 p-3">
                  <Code className="h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl bg-black/20 p-4 text-sm">
                <div className="flex items-center justify-between text-white/80">
                  <span>Gösterilen görev</span>
                  <span className="font-semibold text-white">{stats.displayedTasks}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Kapsanan diller</span>
                  <span className="font-semibold text-white">{stats.languages.length || "0"}</span>
                </div>
                <div className="text-xs text-white/70">Son güncelleme: {formatDate(stats.lastUpdated)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card variant="elevated" className="border-emerald-500/10 bg-white dark:bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-200">
              Deneyim Seviyeleri
            </CardTitle>
            <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Başlangıçtan ileri seviyeye kadar görevlere erişin. Filtreler dil sayfasında.
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="border-emerald-500/10 bg-white dark:bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-200">
              Anlık Değerlendirme
            </CardTitle>
            <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kod çalıştırma sonuçları ve kabul kriterleri aynı ekranda görüntülenir.
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="border-emerald-500/10 bg-white dark:bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-200">
              Uzmanlık Etiketleri
            </CardTitle>
            <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Her görev, uzmanlık alanı ve konu içeriği ile etiketlenmiştir.
            </p>
          </CardContent>
        </Card>
      </section>

      {error && !hasData ? (
        <Card variant="elevated">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Admin panelinden BTNSeedCodingAndBugfix tuşuyla içerik oluşturmayı deneyin.
            </p>
          </CardContent>
        </Card>
      ) : hasData ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
              Son eklenen görev paketleri
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              En güncel 12 canlı kodlama içeriği gösterilir.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <Card
                key={card.id}
                variant="glass"
                className="relative border border-emerald-500/10 bg-white/70 p-0 dark:bg-gray-950/80"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    <span>{card.level ?? "Seviye belirtilmedi"}</span>
                    <span>{formatDate(card.createdAt)}</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                    {card.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {card.description ?? "Bu canlı kodlama içeriği yakında açıklanacak."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {card.expertise && (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                        {card.expertise}
                      </span>
                    )}
                    {card.topic && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">
                        {card.topic}
                      </span>
                    )}
                    {card.topicContent && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">
                        {card.topicContent}
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 text-sm text-gray-700 dark:border-gray-800/60 dark:bg-gray-900/60 dark:text-gray-200">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <span>{card.taskCount} görev</span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {card.languages.length
                          ? card.languages.map((lang) => LANGUAGE_LABEL[lang]).join(" • ")
                          : "Dil etiketi yok"}
                      </span>
                    </div>
                    {card.acceptanceHighlights.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        {card.acceptanceHighlights.map((highlight) => (
                          <li key={`${card.id}-${highlight}`} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link href={`/education/live-coding/${card.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      Göreve git
                      <Sparkles className="ml-2 h-4 w-4 text-emerald-500" />
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
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Henüz içerik yok</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Canlı kodlama verisi bulunamadı. Admin panelinden{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">BTNSeedCodingAndBugfix</span>{" "}
              butonuna tıklayarak örnek veri oluşturabilirsiniz.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

