"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ChevronLeft,
  Clock,
  Target,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
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

type Test = {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  level: string | null;
  passingScore: number;
  content: {
    overview?: {
      description?: string | null;
      estimatedDurationMinutes?: number | null;
    };
    modules?: ModuleSummary[];
    learningObjectives?: string[];
    prerequisites?: string[];
  } | null;
  course: {
    id: string;
    title: string;
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
    difficulty: string;
  } | null;
};

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

export default function TestModuleDetailPage() {
  const params = useParams();
  const testIdParam = params?.id;
  const moduleIdParam = params?.moduleId;

  const testId = Array.isArray(testIdParam) ? testIdParam[0] : testIdParam;
  const moduleId = Array.isArray(moduleIdParam) ? moduleIdParam[0] : moduleIdParam;

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) {
      return;
    }

    const fetchTest = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/education/test/${testId}`);

        if (!response.ok) {
          throw new Error("Test bilgileri alınamadı");
        }
        const testData = await response.json();
        setTest(testData.quiz ?? null);
      } catch (error) {
        console.error(error);
        setTest(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchTest();
  }, [testId]);

  const modules = useMemo<ModuleSummary[]>(() => {
    if (!test?.content?.modules) {
      return [];
    }
    return test.content.modules.map((module) => ({
      ...module,
      objectives: Array.isArray(module.objectives) ? module.objectives : [],
      relatedTests: Array.isArray(module.relatedTests) ? module.relatedTests : [],
    }));
  }, [test]);

  const selectedModule = useMemo(() => {
    if (!moduleId) {
      return null;
    }
    return modules.find((module) => module.id === moduleId) ?? null;
  }, [modules, moduleId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-purple-200/50 dark:border-purple-800/50 bg-purple-50/70 dark:bg-purple-950/30 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 text-sm font-medium text-purple-700 dark:text-purple-300 py-8">
            <Clock className="h-5 w-5 animate-spin" />
            Modül içeriği yükleniyor...
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
            Test bulunamadı ya da içerik henüz hazırlanmadı.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-6">
        <Link
          href={`/education/test/${test.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Teste dön
        </Link>
        <Card className="mx-auto max-w-2xl border-yellow-200/50 dark:border-yellow-800/50 bg-yellow-50/70 dark:bg-yellow-900/30 backdrop-blur-sm">
          <CardContent className="space-y-3 py-8 text-center">
            <CardTitle className="text-xl md:text-2xl">Modül bulunamadı</CardTitle>
            <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
              Ulaşmaya çalıştığınız modül bu test içerisinde yer almıyor olabilir. Modül listesinden
              başka bir başlık seçerek ilerleyebilirsiniz.
            </p>
            <div className="flex justify-center mt-4">
              <Button href={`/education/test/${test.id}`} variant="secondary">
                Modül listesi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tests = selectedModule.relatedTests ?? [];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 space-y-8 md:space-y-10">
      {/* Module Header */}
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

        <div className="relative z-10 p-6 md:p-8 space-y-4">
          <Link
            href={`/education/test/${test.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300 hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            {test.title}
          </Link>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 tech-badge text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 mb-2">
              <FileText className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Modül Başlığı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 dark:from-white dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
                {selectedModule.title}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {selectedModule.summary ?? "Bu modülün açıklaması yakında güncellenecek."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {formatMinutes(selectedModule.durationMinutes) && (
              <span className="tech-badge text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 px-3 py-1.5 sm:px-4 sm:py-2">
                <Clock className="h-4 w-4" />
                {formatMinutes(selectedModule.durationMinutes)}
              </span>
            )}
            <span className="tech-badge text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-3 py-1.5 sm:px-4 sm:py-2" style={{ background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(156, 163, 175, 0.1))', borderColor: 'rgba(107, 114, 128, 0.3)' }}>
              <FileText className="h-4 w-4" />
              {tests.length} test
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr),360px] xl:gap-10">
        {/* Tests List */}
        <div className="space-y-6">
          <div className="relative tech-card glass-tech overflow-hidden border border-purple-200/50 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10 rounded-3xl">
            {/* Particle background */}
            <div className="absolute inset-0 particle-bg-tech" />
            
            <div className="relative z-10 border-b border-purple-100/80 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/30 dark:to-pink-950/30 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Test Listesi
                </h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Modül içerisindeki testlerden birini seçerek teste başlayabilirsin.
              </p>
            </div>
            <div className="relative z-10 space-y-3 sm:space-y-4 p-6">
              {tests.length > 0 ? (
                tests.map((testItem, index) => {
                  // Test ID'sini href'ten veya id'den al
                  const testItemId = testItem.id || testItem.href?.split('/').pop() || `test-${index}`;
                  
                  return (
                    <div
                      key={testItem.id || testItem.href || index}
                      className="group relative tech-card tech-card-glow card-shimmer hover-3d glass-tech flex flex-col gap-4 rounded-xl p-5 transition-all duration-300 md:flex-row md:items-center md:justify-between border-gray-200/50 dark:border-gray-700/50"
                    >
                      {/* Particle background for test card */}
                      <div className="absolute inset-0 particle-bg-tech rounded-xl" />
                      
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none bg-gradient-to-br from-purple-400/0 via-pink-400/0 to-rose-400/0 group-hover:from-purple-400/5 group-hover:via-pink-400/5 group-hover:to-rose-400/5 dark:group-hover:from-purple-400/8 dark:group-hover:via-pink-400/8 dark:group-hover:to-rose-400/8" />
                      
                      {/* Subtle glow effect */}
                      <div className="absolute -inset-0.5 rounded-xl opacity-0 blur-xl transition-all duration-300 pointer-events-none bg-gradient-to-r from-purple-400/0 via-pink-400/0 to-rose-400/0 group-hover:from-purple-400/10 group-hover:via-pink-400/10 group-hover:to-rose-400/10 dark:group-hover:from-purple-400/15 dark:group-hover:via-pink-400/15 dark:group-hover:to-rose-400/15" />
                      
                      <div className="relative z-10 flex items-start gap-4 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-base font-bold text-white shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          {index + 1}
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {testItem.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {testItem.description ?? "Test açıklaması kısa süre içerisinde eklenecek."}
                          </p>
                        </div>
                      </div>
                      <div className="relative z-10 shrink-0">
                        <Button 
                          href={`/education/test/${testItemId}/questions`}
                          className="w-full sm:w-auto inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          variant="gradient"
                        >
                          Teste Başla
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/30 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200 backdrop-blur-sm">
                  Bu modül için tanımlanmış test başlığı bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {(selectedModule.objectives?.length ?? 0) > 0 && (
            <div className="relative tech-card glass-tech overflow-hidden border border-purple-200/50 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10 rounded-2xl">
              {/* Particle background */}
              <div className="absolute inset-0 particle-bg-tech" />
              
              <div className="relative z-10 border-b border-purple-100/80 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/30 dark:to-pink-950/30 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Öğrenme Hedefleri
                  </h3>
                </div>
              </div>
              <div className="relative z-10 p-5">
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  {selectedModule.objectives?.map((objective) => (
                    <li key={objective} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600">
                        <ListChecks className="h-3 w-3 text-white" />
                      </div>
                      <span className="leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {(test.content?.prerequisites?.length ?? 0) > 0 && (
            <div className="relative tech-card glass-tech overflow-hidden border border-purple-200/50 dark:border-purple-800/50 shadow-lg rounded-2xl">
              {/* Particle background */}
              <div className="absolute inset-0 particle-bg-tech" />
              
              <div className="relative z-10 border-b border-purple-100/80 dark:border-purple-800/50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Test Ön Gereksinimleri
                  </h3>
                </div>
              </div>
              <div className="relative z-10 p-5">
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  {test.content?.prerequisites?.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600">
                        <ListChecks className="h-3 w-3 text-white" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

