"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface TestItem {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  passingScore: number;
  course: {
    id: string;
    title: string;
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
    difficulty: string;
  };
}

export default function TestCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const expertise = params?.expertise as string;
  const decodedExpertise = expertise ? decodeURIComponent(expertise) : "";

  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expertise) return;

    const controller = new AbortController();

    const fetchTests = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("type", "TEST");
        params.append("expertise", decodedExpertise);

        const response = await fetch(`/api/education/items?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Testler yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        setTests(data.items || []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching tests:", err);
          setError((err as Error).message || "Testler yüklenirken bir hata oluştu");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();

    return () => controller.abort();
  }, [expertise, decodedExpertise]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link href="/education/test">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Test Kategorilerine Dön
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {decodedExpertise} Testleri
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {tests.length} test bulundu
        </p>
      </div>

      {error ? (
        <Card variant="elevated" className="border-red-200 dark:border-red-800/50">
          <CardContent className="py-16">
            <div className="text-center space-y-2">
              <FileText className="h-16 w-16 text-red-400 dark:text-red-300 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : tests.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Bu kategoride henüz test bulunmamaktadır.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tests.map((test, index) => {
            const gradients = [
              "from-purple-600 via-pink-600 to-rose-600",
              "from-blue-600 via-indigo-600 to-purple-600",
              "from-cyan-500 via-blue-500 to-indigo-600",
              "from-green-500 via-emerald-500 to-teal-600",
              "from-orange-500 via-red-500 to-pink-500",
              "from-blue-400 via-cyan-500 to-blue-600",
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <Link
                key={test.id}
                href={`/education/test/${test.id}`}
                className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${gradient} backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl pointer-events-none`}></div>
                
                {/* Content */}
                <div className="relative z-10 p-6 text-left h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    {test.level && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {test.level}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                      {test.title}
                    </h3>
                    {test.description && (
                      <p className="text-sm text-white/70 mb-4 line-clamp-2">
                        {test.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>Geçme: %{test.passingScore}</span>
                    </div>
                    {test.course.topic && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded">
                        {test.course.topic}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

