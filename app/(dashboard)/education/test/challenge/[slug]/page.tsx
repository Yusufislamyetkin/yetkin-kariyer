"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, BookOpen, Clock, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { ChallengeGroup, TestItem, createChallengeGroups } from "../../utils";

type FetchState = "idle" | "loading" | "error" | "success";

const FILTER_KEYS = ["expertise", "topic", "content", "search"] as const;

const buildQueryFromSearchParams = (searchParams: ReturnType<typeof useSearchParams>) => {
  const query: Record<string, string> = {};
  FILTER_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      query[key] = value;
    }
  });
  return query;
};

export default function ChallengeTestsPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [status, setStatus] = useState<FetchState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParamsString = searchParams.toString();
  const slug = params.slug;

  useEffect(() => {
    const controller = new AbortController();
    let didTimeout = false;
    const timeoutId = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, 10000);

    const loadTests = async () => {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const query = new URLSearchParams();
        query.append("type", "TEST");

        FILTER_KEYS.forEach((key) => {
          const value = searchParams.get(key);
          if (value) {
            query.append(key, value);
          }
        });

        const response = await fetch(`/api/education/items?${query.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Testler yüklenirken bir sorun oluştu");
        }

        const data = await response.json();
        setTests(data.items || []);
        setStatus("success");
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          if (didTimeout) {
            setErrorMessage("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
            setStatus("error");
          }
          return;
        }

        console.error("Error fetching challenge tests:", error);
        setErrorMessage("Testler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        setStatus("error");
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    loadTests();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchParamsString]);

  const challenges = useMemo<ChallengeGroup[]>(() => createChallengeGroups(tests), [tests]);
  const challenge = useMemo(
    () => challenges.find((item) => item.slug === slug) ?? null,
    [challenges, slug]
  );

  const backQuery = buildQueryFromSearchParams(searchParams);
  const backHref =
    Object.keys(backQuery).length > 0
      ? { pathname: "/education/test", query: backQuery }
      : { pathname: "/education/test" };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href={backHref}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Testlere Dön
          </Button>
        </Link>
        <Card variant="elevated">
          <CardContent className="py-16 text-center space-y-3">
            <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} variant="gradient">
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href={backHref}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Testlere Dön
          </Button>
        </Link>
        <Card variant="elevated" className="py-16 text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-blue-500 dark:text-blue-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Challenge bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aradığınız challenge mevcut değil veya filtreler hiçbir test döndürmedi.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <Link href={backHref} className="w-max">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Testlere Dön
          </Button>
        </Link>
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Challenge</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{challenge.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toplam {challenge.tests.length} test. Birini seçerek hemen başlayın.
          </p>
          <div className="flex flex-wrap gap-2">
            {challenge.expertise && (
              <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                {challenge.expertise}
              </span>
            )}
            {challenge.topic && (
              <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                {challenge.topic}
              </span>
            )}
            {challenge.topicContent && (
              <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                {challenge.topicContent}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {challenge.tests.map((test, index) => (
          <Card
            key={test.id}
            variant="elevated"
            hover
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Link href={`/education/test/${test.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  {test.level && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-full">
                      {test.level}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">{test.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {test.description || "Açıklama yok"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {test.course.topicContent && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs font-semibold rounded">
                      {test.course.topicContent}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-xs font-semibold rounded">
                    {test.course.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Geçme: %{test.passingScore}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                    <Play className="h-4 w-4" />
                    <span>Başla</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

