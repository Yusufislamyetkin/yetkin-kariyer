"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpenCheck,
  Bug,
  Filter,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { CascadingFilter } from "@/app/components/education/CascadingFilter";
import type { LiveCodingLanguage, LiveCodingTask } from "@/types/live-coding";
import {
  normalizeLiveCodingPayload,
  resolveLiveCodingLanguage,
  SUPPORTED_LANGUAGES,
} from "@/lib/education/liveCoding";
import { cn } from "@/lib/utils";

interface BugFixItem {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  questions: unknown;
  course: {
    id: string;
    title: string;
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
    difficulty: string;
  };
}

const LANGUAGE_META: Record<
  LiveCodingLanguage,
  {
    label: string;
    description: string;
    badge: string;
    accent: string;
  }
> = {
  csharp: {
    label: "C# Bug Fix",
    description:
      "Hatalı C# kodlarını bulun, düzeltin ve .NET ekosisteminde debug becerilerinizi güçlendirin.",
    badge: ".NET & Console",
    accent: "from-violet-600 via-indigo-500 to-sky-500",
  },
  javascript: {
    label: "JavaScript Bug Fix",
    description:
      "JavaScript hatalarını tespit edin, düzeltin ve modern web becerilerinizi artırın.",
    badge: "Frontend & Web",
    accent: "from-amber-500 via-orange-500 to-yellow-500",
  },
  python: {
    label: "Python Bug Fix",
    description:
      "Python kodlarındaki hataları bulun, düzeltin ve veri analizi becerilerinizi geliştirin.",
    badge: "Data & Automation",
    accent: "from-emerald-500 via-green-500 to-teal-500",
  },
  java: {
    label: "Java Bug Fix",
    description:
      "Java kodlarındaki hataları tespit edin, düzeltin ve kurumsal Java görevlerini çözün.",
    badge: "Backend & OOP",
    accent: "from-rose-500 via-red-500 to-pink-500",
  },
};

type FilterState = {
  expertise: string | null;
  topic: string | null;
  content: string | null;
  level: string | null;
};

type ChallengeCard = {
  item: BugFixItem;
  tasks: LiveCodingTask[];
  highlights: string[];
};

const extractHighlights = (tasks: LiveCodingTask[]): string[] => {
  const primary = tasks.flatMap((task) => {
    if (Array.isArray(task.acceptanceCriteria) && task.acceptanceCriteria.length > 0) {
      return task.acceptanceCriteria.slice(0, 1);
    }
    return task.title ? [task.title] : [];
  });

  return Array.from(new Set(primary)).slice(0, 3);
};

export default function BugFixLanguagePage() {
  const params = useParams<{ language?: string }>();
  const resolvedLanguage = resolveLiveCodingLanguage(
    typeof params?.language === "string" ? params.language : null
  );

  const [items, setItems] = useState<BugFixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    expertise: null,
    topic: null,
    content: null,
    level: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search]);

  const fetchItems = useCallback(async () => {
    if (!resolvedLanguage) return;

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setError(null);
      setLoading(true);
      
      const timeoutId = window.setTimeout(() => {
        if (!controller.signal.aborted) {
          controller.abort();
        }
      }, 30000);

      const params = new URLSearchParams();
      params.append("type", "BUG_FIX");
      if (filters.expertise) params.append("expertise", filters.expertise);
      if (filters.topic) params.append("topic", filters.topic);
      if (filters.content) params.append("content", filters.content);
      if (filters.level) params.append("level", filters.level);
      if (debouncedSearch) params.append("search", debouncedSearch);

      let data: { items?: BugFixItem[] } = {};

      try {
        const response = await fetch(`/api/education/items?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (controller.signal.aborted) {
          return;
        }

        const json = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        if (!response.ok) {
          throw new Error(json?.error || "Bug fix'ler yüklenirken bir hata oluştu.");
        }

        data = json;
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }
        throw fetchError;
      } finally {
        window.clearTimeout(timeoutId);
      }

      if (controller.signal.aborted) {
        return;
      }

      setItems(
        Array.isArray(data.items)
          ? data.items.filter(
              (candidate): candidate is BugFixItem =>
                typeof candidate?.id === "string" && candidate?.questions !== undefined
            )
          : []
      );
    } catch (fetchError) {
      if (controller.signal.aborted) {
        return;
      }
      console.error("Error fetching bug fix items:", fetchError);
      if ((fetchError as Error).name === "AbortError") {
        setError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
      } else {
        setError("Bug fix'ler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [filters, debouncedSearch, resolvedLanguage]);

  useEffect(() => {
    fetchItems();

    // Cleanup function to abort request on unmount or dependency change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [fetchItems]);

  const challenges = useMemo<ChallengeCard[]>(() => {
    if (!resolvedLanguage) return [];

    return items
      .map((item) => {
        const config = normalizeLiveCodingPayload(item.questions);

        const compatibleTasks = config.tasks.filter((task) => {
          const taskLanguages =
            task.languages && task.languages.length > 0 ? task.languages : SUPPORTED_LANGUAGES;
          return taskLanguages.includes(resolvedLanguage);
        });

        if (compatibleTasks.length === 0) {
          return null;
        }

        return {
          item,
          tasks: compatibleTasks,
          highlights: extractHighlights(compatibleTasks),
        };
      })
      .filter((card): card is ChallengeCard => Boolean(card));
  }, [items, resolvedLanguage]);

  if (!resolvedLanguage) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card variant="elevated" className="max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-semibold text-gray-100">Desteklenmeyen dil seçimi</h2>
          <p className="mt-2 text-sm text-gray-400">
            Seçtiğiniz programlama dili için bug fix içerikleri bulunamadı. Lütfen mevcut dillerden birini seçin.
          </p>
          <Link href="/education/bug-fix" className="mt-6 inline-block">
            <Button variant="gradient">Dil Seçimine Dön</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const meta = LANGUAGE_META[resolvedLanguage];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header className="space-y-4">
        <Link href="/education/bug-fix">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dil Seçimine Dön
          </Button>
        </Link>
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm",
              meta.accent
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {meta.badge}
          </span>
          <h1 className="text-3xl font-bold text-gray-100">{meta.label}</h1>
          <p className="max-w-2xl text-sm text-gray-400">{meta.description}</p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <Input
              placeholder="Bug fix görevi veya içerik ara..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Filter className="h-4 w-4" />
            <span>Uzmanlık ve konu filtreleriyle içeriği daraltın.</span>
          </div>
        </div>
        
        {/* Level Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Seviye Filtresi</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.level === null ? "gradient" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, level: null }))}
              className={cn(
                filters.level === null && "bg-gradient-to-r from-red-600 to-orange-600 text-white"
              )}
            >
              Tümü
            </Button>
            <Button
              variant={filters.level === "beginner" ? "gradient" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, level: "beginner" }))}
              className={cn(
                filters.level === "beginner" && "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              )}
            >
              Başlangıç
            </Button>
            <Button
              variant={filters.level === "intermediate" ? "gradient" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, level: "intermediate" }))}
              className={cn(
                filters.level === "intermediate" && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              )}
            >
              Orta
            </Button>
            <Button
              variant={filters.level === "advanced" ? "gradient" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, level: "advanced" }))}
              className={cn(
                filters.level === "advanced" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              )}
            >
              İleri
            </Button>
          </div>
        </div>

        <CascadingFilter onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, expertise: newFilters.expertise, topic: newFilters.topic, content: newFilters.content }))} />
      </section>

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-red-400" />
            <p className="text-sm text-gray-400">Bug fix görevleri yükleniyor...</p>
          </div>
        </div>
      ) : error ? (
        <Card variant="elevated">
          <CardContent className="py-16 text-center space-y-3">
            <Bug className="mx-auto h-12 w-12 text-red-400" />
            <p className="text-gray-400">{error}</p>
            <Button onClick={() => fetchItems()}>Tekrar dene</Button>
          </CardContent>
        </Card>
      ) : challenges.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-16 text-center space-y-3">
            <BookOpenCheck className="mx-auto h-12 w-12 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-100">Bug fix görevi bulunamadı</h3>
            <p className="text-sm text-gray-400">
              Filtreleri temizleyerek veya arama kriterlerini değiştirerek tekrar deneyebilirsiniz.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {challenges.map(({ item, tasks, highlights }, index) => (
            <Card
              key={item.id}
              variant="elevated"
              hover
              className="group border border-gray-900/60 bg-gray-950/80 backdrop-blur transition duration-200"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <Link href={`/education/bug-fix/${item.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <Bug className="h-6 w-6" />
                    </div>
                    {item.level && (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                        {item.level}
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-4 text-xl text-gray-100">{item.title}</CardTitle>
                  <p className="mt-2 text-sm text-gray-400">
                    {item.description || "Görev açıklaması yakında eklenecek."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 border-t border-gray-900/80 pt-4">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-300">
                    {item.course.expertise && (
                      <span className="rounded bg-slate-800/80 px-2 py-1 uppercase tracking-wide">
                        {item.course.expertise}
                      </span>
                    )}
                    {item.course.topic && (
                      <span className="rounded bg-slate-800/60 px-2 py-1 uppercase tracking-wide">
                        {item.course.topic}
                      </span>
                    )}
                    {item.course.topicContent && (
                      <span className="rounded bg-slate-800/60 px-2 py-1 uppercase tracking-wide">
                        {item.course.topicContent}
                      </span>
                    )}
                    <span className="rounded bg-slate-900 px-2 py-1 uppercase tracking-wide text-red-300">
                      {item.course.difficulty}
                    </span>
                  </div>
                  <div className="space-y-2 rounded-md border border-gray-900/80 bg-gray-900/60 p-3 text-sm text-gray-300">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                      Öne çıkan alıştırmalar
                    </p>
                    <ul className="space-y-1">
                      {highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-gray-500">{tasks.length} görev içerir.</p>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-red-400">
                    Çözmeye başla
                    <ArrowLeft className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

