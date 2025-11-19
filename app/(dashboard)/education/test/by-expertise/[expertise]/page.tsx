"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { BookOpen, ChevronLeft, Clock, Compass, ArrowRight, FileText, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

type ModuleTest = {
  id: string;
  title: string;
  description?: string;
  href?: string;
};

type ModuleSummary = {
  id: string;
  title: string;
  summary?: string | null;
  durationMinutes?: number | null;
  objectives?: string[];
  relatedTests?: ModuleTest[]; // Modül içinde testler (dersler değil)
};

interface TestContentPayload {
  overview?: {
    description?: string | null;
    estimatedDurationMinutes?: number | null;
  };
  learningObjectives?: string[];
  prerequisites?: string[];
  modules?: ModuleSummary[];
}

interface Test {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  level: string | null;
  passingScore: number;
  content: TestContentPayload | null;
  course: {
    id: string;
    title: string;
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
    difficulty: string;
  } | null;
}

function formatMinutes(minutes?: number | null) {
  if (!minutes || minutes <= 0) {
    return null;
  }

  if (minutes < 60) {
    return `${minutes} dk`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return `${hours} saat`;
  }

  return `${hours} saat ${remainder} dk`;
}

export default function TestByExpertisePage() {
  const params = useParams();
  const expertiseParam = params?.expertise;
  const expertise = Array.isArray(expertiseParam) ? expertiseParam[0] : expertiseParam;
  const decodedExpertise = expertise ? decodeURIComponent(expertise) : "";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!expertise) {
      return;
    }

    const fetchTest = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/education/test/by-expertise/${encodeURIComponent(decodedExpertise)}`);
        if (!response.ok) {
          throw new Error("Test bilgileri alınamadı");
        }
        const data = await response.json();
        setTest(data.quiz ?? null);
      } catch (error) {
        console.error(error);
        setTest(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchTest();
  }, [expertise, decodedExpertise]);

  const modules = useMemo<ModuleSummary[]>(() => {
    if (!test?.content?.modules) {
      return [];
    }
    const allModules = test.content.modules.map((module) => ({
      ...module,
      objectives: Array.isArray(module.objectives) ? module.objectives : [],
      relatedTests: Array.isArray(module.relatedTests) ? module.relatedTests : [],
    }));
    
    // Sort by id (module-01, module-02, etc.) and limit to 15
    const sortedModules = allModules.sort((a, b) => {
      const aNum = parseInt(a.id.replace('module-', '')) || 0;
      const bNum = parseInt(b.id.replace('module-', '')) || 0;
      return aNum - bNum;
    });
    
    return sortedModules.slice(0, 15);
  }, [test]);

  useEffect(() => {
    if (!test?.id || modules.length === 0) {
      return;
    }

    const requestedModule = searchParams?.get("module");
    if (
      requestedModule &&
      modules.some((module) => module.id === requestedModule)
    ) {
      router.replace(`/education/test/${test.id}/modules/${requestedModule}`);
    }
  }, [test?.id, modules, router, searchParams]);

  const testOverview = test?.content?.overview;
  const overviewDescription =
    (testOverview?.description ?? test?.description ?? "") ||
    "Bu test boyunca modüller adım adım işlenir.";
  const overviewDuration =
    testOverview?.estimatedDurationMinutes ?? 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-blue-200/50 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/30 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 text-sm font-medium text-blue-700 dark:text-blue-300 py-8">
            <Clock className="h-5 w-5 animate-spin" />
            Test içeriği yükleniyor...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-red-200/50 dark:border-red-800/50 bg-red-50/70 dark:bg-red-950/30 backdrop-blur-sm">
          <CardContent className="text-red-700 dark:text-red-300 py-8">
            {decodedExpertise} için test bulunamadı ya da içerik henüz hazırlanmadı.
          </CardContent>
        </Card>
      </div>
    );
  }

  const tagItems = [
    test.topic && {
      label: test.topic,
      style: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50",
    },
    test.level && {
      label: `Seviye: ${test.level}`,
      style: "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50",
    },
    test.course?.expertise && {
      label: `Uzmanlık: ${test.course.expertise}`,
      style: "bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-800/50",
    },
    test.passingScore && {
      label: `Geçme Notu: %${test.passingScore}`,
      style: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50",
    },
  ]
    .filter(Boolean)
    .map((tag) => tag as { label: string; style: string });

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 space-y-8 md:space-y-10">
      {/* Breadcrumb */}
      <Link
        href="/education/test"
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300"
      >
        <ChevronLeft className="h-4 w-4" />
        Testlere dön
      </Link>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-200/50 dark:border-purple-800/50 gradient-mesh-tech shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10">
        {/* Particle background */}
        <div className="absolute inset-0 particle-bg-tech" />
        
        {/* Animated floating orbs */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-500/20 dark:bg-purple-500/15 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-500/20 dark:bg-pink-500/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-rose-500/15 dark:bg-rose-500/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        
        {/* Enhanced glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-md" />

        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4 flex-1">
              {/* Tech icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50 mb-4">
                <FileText className="h-7 w-7 text-white" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 dark:from-white dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
                  {test.title}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {test.description ??
                  "Test modülleri ile bilginizi test edin ve kendinizi değerlendirin."}
              </p>
              {tagItems.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {tagItems.map((tag) => (
                    <span
                      key={tag.label}
                      className={clsx(
                        "tech-badge inline-flex items-center rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide shadow-sm",
                        tag.style
                      )}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Enhanced Duration Card */}
            {overviewDuration > 0 && (
              <div className="md:w-80 tech-card glass-tech rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 hover:scale-105 transition-transform duration-300">
                <div className="relative z-10 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                        Tahmini süre
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {formatMinutes(overviewDuration) ?? "Süre bilgisi yakında"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatMinutes(overviewDuration)
                          ? "Modülleri tamamlamak için planlanan toplam süre."
                          : "Program süresi henüz belirlenmedi."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="relative tech-card glass-tech overflow-hidden border border-purple-200/50 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10 rounded-3xl">
        {/* Particle background */}
        <div className="absolute inset-0 particle-bg-tech" />
        
        <div className="relative z-10 border-b border-purple-100/80 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/60 via-pink-50/60 to-rose-50/60 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 px-6 md:px-8 py-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Compass className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Modül Listesi
            </h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Başlamak istediğin modülü seç ve detay sayfasında testleri incele.
          </p>
        </div>
        <div className="relative z-10 p-6 md:p-8 pt-8 md:pt-12">
          {modules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Bu test için yayınlanmış modül bulunmuyor.
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => {
                const testCount = module.relatedTests?.length ?? 0;

                return (
                  <Link
                    key={module.id}
                    href={`/education/test/${test.id}/modules/${module.id}`}
                    className="group relative tech-card tech-card-glow card-shimmer hover-3d glass-tech rounded-2xl overflow-hidden p-5 sm:p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 dark:focus-visible:outline-purple-400 focus-visible:outline-offset-2"
                  >
                    {/* Particle background for module card */}
                    <div className="absolute inset-0 particle-bg-tech rounded-2xl" />
                    
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-pink-400/0 to-rose-400/0 dark:from-purple-400/0 dark:via-pink-400/0 dark:to-rose-400/0 group-hover:from-purple-400/5 group-hover:via-pink-400/5 group-hover:to-rose-400/5 dark:group-hover:from-purple-400/8 dark:group-hover:via-pink-400/8 dark:group-hover:to-rose-400/8 transition-all duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-lg font-bold text-white shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {index + 1}
                      </div>
                      <div className="flex flex-col items-end gap-2 text-xs">
                        {formatMinutes(module.durationMinutes) && (
                          <span className="tech-badge text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 px-3 py-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {formatMinutes(module.durationMinutes)}
                          </span>
                        )}
                        <span className="tech-badge text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-3 py-1.5" style={{ background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(156, 163, 175, 0.1))', borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                          <FileText className="h-3.5 w-3.5" />
                          {testCount} test
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex-1 space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
                        {module.summary ?? "Bu modülün açıklaması yakında eklenecek."}
                      </p>
                    </div>
                    <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Modüle git
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

