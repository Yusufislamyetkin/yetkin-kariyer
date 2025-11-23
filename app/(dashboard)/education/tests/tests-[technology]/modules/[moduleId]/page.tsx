"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, FileText, Clock, ArrowRight, Sparkles, ArrowLeft, Code2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { routeToTechnology, technologyToRoute } from "@/lib/utils/technology-normalize";

interface Test {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  questionCount: number;
  timeLimitMinutes: number | null;
  href: string | null;
}

export default function ModuleTestsPage() {
  const params = useParams();
  const technologyParam = params?.technology;
  const moduleIdParam = params?.moduleId;
  const technology = Array.isArray(technologyParam) ? technologyParam[0] : technologyParam;
  const moduleId = Array.isArray(moduleIdParam) ? moduleIdParam[0] : moduleIdParam;
  
  // tests-{technology-name} formatından teknoloji adını çıkar
  // Utility fonksiyonunu kullan
  const decodedTechnology = technology ? routeToTechnology(technology) : "";
  const decodedModule = moduleId ? decodeURIComponent(moduleId) : "";

  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [moduleTitle, setModuleTitle] = useState<string>("");

  useEffect(() => {
    if (!decodedTechnology || !decodedModule) {
      return;
    }

    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/education/tests/${encodeURIComponent(decodedTechnology)}/${encodeURIComponent(decodedModule)}/tests`
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Testler yüklenirken bir hata oluştu");
        }
        
        const data = await response.json();
        setTests(data.tests || []);
        setModuleTitle(data.module?.title || decodedModule); // API'den gelen gerçek modül title'ını kullan
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError(err instanceof Error ? err.message : "Testler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    void fetchTests();
  }, [decodedTechnology, decodedModule]);

  const handleGenerateTest = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/education/tests/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technology: decodedTechnology,
          module: decodedModule,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Test oluşturulurken bir hata oluştu");
      }

      // Testler listesini yeniden yükle
      const fetchResponse = await fetch(
        `/api/education/tests/${encodeURIComponent(decodedTechnology)}/${encodeURIComponent(decodedModule)}/tests`
      );
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        setTests(data.tests || []);
      }
    } catch (err) {
      console.error("Error generating test:", err);
      setError(err instanceof Error ? err.message : "Test oluşturulurken bir hata oluştu");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-blue-200/50 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/30 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 text-sm font-medium text-blue-700 dark:text-blue-300 py-8">
            <Clock className="h-5 w-5 animate-spin" />
            Testler yükleniyor...
          </CardContent>
        </Card>
      </div>
    );
  }

  // Technology name'i route formatına çevir (quiz route için)
  // Utility fonksiyonunu kullan, ama "tests-" prefix'ini kaldır
  const technologySlug = technologyToRoute(decodedTechnology).replace(/^tests-/, '');

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 space-y-8 md:space-y-10">
      {/* Module Header */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 dark:border-blue-800/50 gradient-mesh-tech shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10">
        {/* Particle background */}
        <div className="absolute inset-0 particle-bg-tech" />
        
        {/* Animated floating orbs */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 dark:bg-blue-500/15 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 dark:bg-purple-500/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-pink-500/15 dark:bg-pink-500/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        
        {/* Enhanced glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-md" />

        <div className="relative z-10 p-6 md:p-8 space-y-4">
          <Link
            href={`/education/tests/${technology}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300 hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            {decodedTechnology}
          </Link>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 tech-badge text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 mb-2">
              <Code2 className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Modül Başlığı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-text-shimmer">
                {moduleTitle || decodedModule}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Modül içerisindeki testlerden birini seçerek teste başlayabilirsiniz.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="tech-badge text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-3 py-1.5 sm:px-4 sm:py-2" style={{ background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(156, 163, 175, 0.1))', borderColor: 'rgba(107, 114, 128, 0.3)' }}>
              <FileText className="h-4 w-4" />
              {tests.length} test
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-6">
        {/* Tests List */}
        <div className="relative tech-card glass-tech overflow-hidden border border-blue-200/50 dark:border-blue-800/50 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 rounded-3xl">
          {/* Particle background */}
          <div className="absolute inset-0 particle-bg-tech" />
          
          <div className="relative z-10 border-b border-blue-100/80 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
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
            {error && (
              <div className="rounded-xl border border-red-200/50 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-800 dark:text-red-200 backdrop-blur-sm">
                {error}
              </div>
            )}
            {tests.length === 0 ? (
              <div className="rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/30 px-4 py-8 text-center backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-800/50 mb-4">
                  <Sparkles className="h-7 w-7 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Henüz test bulunamadı
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
                  Bu modül için henüz test oluşturulmamış. AI ile test oluşturmak ister misiniz?
                </p>
                <Button
                  onClick={handleGenerateTest}
                  disabled={generating}
                  variant="gradient"
                  className="mt-4"
                >
                  {generating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Test oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI ile Test Oluştur
                    </>
                  )}
                </Button>
              </div>
            ) : (
              tests.map((test, index) => {
                return (
                  <div
                    key={test.id}
                    className="group relative tech-card tech-card-glow card-shimmer hover-3d glass-tech flex flex-col gap-4 rounded-xl p-5 transition-all duration-300 md:flex-row md:items-center md:justify-between border-gray-200/50 dark:border-gray-700/50"
                  >
                    {/* Particle background for test card */}
                    <div className="absolute inset-0 particle-bg-tech rounded-xl" />
                    
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 via-indigo-400/0 to-purple-400/0 dark:from-blue-400/0 dark:via-indigo-400/0 dark:to-purple-400/0 group-hover:from-blue-400/5 group-hover:via-indigo-400/5 group-hover:to-purple-400/5 dark:group-hover:from-blue-400/8 dark:group-hover:via-indigo-400/8 dark:group-hover:to-purple-400/8 transition-all duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 flex items-start gap-4 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {index + 1}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {test.title}
                          </h4>
                        </div>
                        {test.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {test.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {test.level && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                              {test.level}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {test.questionCount} soru
                          </span>
                          {test.timeLimitMinutes && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {test.timeLimitMinutes} dk
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 shrink-0">
                      <Button 
                        href={test.href || `/education/tests/quiz/${technologySlug}/${encodeURIComponent(moduleId)}/${encodeURIComponent(test.id)}`}
                        className="w-full sm:w-auto inline-flex items-center gap-2"
                        variant="primary"
                      >
                        Teste Başla
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

