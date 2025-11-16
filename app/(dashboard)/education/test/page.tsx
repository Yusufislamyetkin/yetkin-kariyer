/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { CascadingFilter } from "@/app/components/education/CascadingFilter";
import { ChallengeGroup, TestItem, createChallengeGroups } from "./utils";

export default function TestPage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    expertise: string | null;
    topic: string | null;
    content: string | null;
  }>({
    expertise: null,
    topic: null,
    content: null,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialSearch = searchParams.get("search") ?? "";
    const initialFilters = {
      expertise: searchParams.get("expertise"),
      topic: searchParams.get("topic"),
      content: searchParams.get("content"),
    };
    setSearch(initialSearch);
    setFilters({
      expertise: initialFilters.expertise || null,
      topic: initialFilters.topic || null,
      content: initialFilters.content || null,
    });
  }, [searchParams]);

  useEffect(() => {
    fetchTests();
  }, [filters, search]);

  const fetchTests = async () => {
    try {
      setError(null);
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);
      const params = new URLSearchParams();
      params.append("type", "TEST");

      if (filters.expertise) params.append("expertise", filters.expertise);
      if (filters.topic) params.append("topic", filters.topic);
      if (filters.content) params.append("content", filters.content);
      if (search) params.append("search", search);

      try {
        const response = await fetch(`/api/education/items?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Testler yüklenirken bir sorun oluştu");
        }

        const data = await response.json();
        setTests(data.items || []);
      } finally {
        window.clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      if ((error as Error).name === "AbortError") {
        setError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
      } else {
        setError("Testler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const challenges = useMemo<ChallengeGroup[]>(() => {
    return createChallengeGroups(tests);
  }, [tests]);

  if (loading && tests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Testler
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bilginizi test edin ve kendinizi geliştirin
        </p>
      </div>

      <CascadingFilter onFilterChange={setFilters} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Test ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="text-center space-y-2">
              <BookOpen className="h-16 w-16 text-red-400 dark:text-red-300 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={fetchTests}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Tekrar dene
              </button>
            </div>
          </CardContent>
        </Card>
      ) : challenges.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Test bulunamadı</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Challenge Seçin</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                İlgi alanınıza uygun challenge&apos;ı seçin, detay sayfasını açın ve ilgili test kartlarına göz atın.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {challenges.map((challenge, index) => {
                const query: Record<string, string> = {};
                if (filters.expertise) query.expertise = filters.expertise;
                if (filters.topic) query.topic = filters.topic;
                if (filters.content) query.content = filters.content;
                if (search) query.search = search;
                return (
                  <Link
                    key={challenge.slug}
                    href={{
                      pathname: `/education/test/challenge/${challenge.slug}`,
                      query: Object.keys(query).length ? query : undefined,
                    }}
                    className="text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-xl hover:shadow-md group"
                  >
                    <Card
                      variant="elevated"
                      className="h-full animate-fade-in group-hover:border-blue-500/50"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-300 group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white transition-colors">
                            <Code className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                            {challenge.tests.length} test
                          </span>
                        </div>
                        <CardTitle className="text-lg leading-snug text-gray-900 dark:text-gray-100">
                          {challenge.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {challenge.expertise && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {challenge.expertise}
                            </span>
                          )}
                          {challenge.topicContent && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                              {challenge.topicContent}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

