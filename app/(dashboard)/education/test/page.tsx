"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, FileText } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

interface TestCategory {
  expertise: string;
  testCount: number;
  description: string | null;
  topic: string | null;
  topicContent: string | null;
}

export default function TestPage() {
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tests/categories`, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", errorData);
          throw new Error(errorData.error || "Test kategorileri yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        console.log("Fetched categories data:", data);
        const categoriesList = data.categories || [];
        console.log("Categories list:", categoriesList);
        setCategories(categoriesList);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching categories:", err);
          setError((err as Error).message || "Test kategorileri şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  const heroStats = [
    { label: "Toplam Kategori", value: categories.length.toString() },
    {
      label: "Toplam Test",
      value: categories.reduce((sum, cat) => sum + cat.testCount, 0).toString(),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 md:space-y-10 animate-fade-in">
        <HeroSection loading stats={heroStats} />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in">
      <HeroSection stats={heroStats} />

      <div className="flex flex-col gap-6">
        {error ? (
          <Card variant="elevated" className="border-red-200 dark:border-red-800/50">
            <CardContent className="py-12 md:py-16">
              <div className="mx-auto max-w-xl space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 backdrop-blur-sm border border-rose-200/50 dark:border-rose-800/50">
                  <Sparkles className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Bir şeyler ters gitti
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : categories.length === 0 ? (
          <Card variant="gradient" className="border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="py-12 md:py-16">
              <div className="mx-auto max-w-xl space-y-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
                  <FileText className="h-7 w-7 text-purple-600 dark:text-purple-300" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Henüz test kategorisi bulunamadı
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Test kategorileri henüz yüklenmemiş. Lütfen admin panelinden test oluşturma merkezini kullanın.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => {
              // Her kategori için farklı gradient renkleri
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
                  key={category.expertise}
                  href={`/education/test/by-expertise/${encodeURIComponent(category.expertise)}`}
                  className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${gradient} backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl pointer-events-none`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 text-left h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                        {category.expertise}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-white/70 mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-white/60">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>{category.testCount} Test</span>
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
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl tech-card glass-tech h-64">
      <div className="absolute inset-0 particle-bg-tech" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 -translate-x-full animate-shimmer" />
      <div className="relative z-10 p-6 sm:p-8 space-y-4">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface HeroSectionProps {
  loading?: boolean;
  stats: { label: string; value: string }[];
}

function HeroSection({ loading = false, stats }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 via-purple-50/50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239c27b0' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Subtle gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute -top-16 -right-16 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-purple-400/20 dark:bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-pink-400/20 dark:bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 sm:space-y-5 lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/40 px-4 py-2 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Test Merkezi
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              Yazılım Geliştirme
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                Testleri
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Bilginizi test edin, kendinizi değerlendirin ve kariyerinizde ilerleyin. 
              Her teknoloji için kapsamlı test paketleri.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-auto lg:flex-shrink-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative flex flex-col gap-1.5 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-3 sm:px-4 sm:py-3.5 text-left shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {loading ? (
                  <div className="h-6 sm:h-7 w-12 sm:w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                )}
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

