"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, FileText, Clock, ArrowRight, Code2, Compass } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { routeToTechnology } from "@/lib/utils/technology-normalize";

interface Module {
  id: string;
  title: string;
  description?: string | null;
  testCount: number;
}

export default function TechnologyModulesPage() {
  const params = useParams();
  const technologyParam = params?.technology;
  const technology = Array.isArray(technologyParam) ? technologyParam[0] : technologyParam;
  
  // tests-{technology-name} formatından teknoloji adını çıkar
  // Utility fonksiyonunu kullan
  const decodedTechnology = technology ? routeToTechnology(technology) : "";

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [technologyName, setTechnologyName] = useState<string>("");

  useEffect(() => {
    if (!decodedTechnology) {
      return;
    }

    const fetchModules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/education/tests/${encodeURIComponent(decodedTechnology)}/modules`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Modüller yüklenirken bir hata oluştu");
        }
        
        const data = await response.json();
        setModules(data.modules || []);
        setTechnologyName(data.technology || decodedTechnology); // API'den gelen gerçek teknoloji adını kullan
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError(err instanceof Error ? err.message : "Modüller yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    void fetchModules();
  }, [decodedTechnology]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-blue-200/50 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/30 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 text-sm font-medium text-blue-700 dark:text-blue-300 py-8">
            <Clock className="h-5 w-5 animate-spin" />
            Modüller yükleniyor...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-red-200/50 dark:border-red-800/50 bg-red-50/70 dark:bg-red-950/30 backdrop-blur-sm">
          <CardContent className="text-red-700 dark:text-red-300 py-8">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 space-y-8 md:space-y-10">
      {/* Breadcrumb */}
      <Link
        href="/education/tests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300"
      >
        <ChevronLeft className="h-4 w-4" />
        Teknolojilere dön
      </Link>

      {/* Hero Header Section */}
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

        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          <div className="space-y-4">
            {/* Tech icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 mb-4">
              <Code2 className="h-7 w-7 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-text-shimmer">
                {technologyName || decodedTechnology}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Modül seçerek ilgili testlere erişebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="relative tech-card glass-tech overflow-hidden border border-blue-200/50 dark:border-blue-800/50 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 rounded-3xl">
        {/* Particle background */}
        <div className="absolute inset-0 particle-bg-tech" />
        
        <div className="relative z-10 border-b border-blue-100/80 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 px-6 md:px-8 py-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
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
              Bu teknoloji için yayınlanmış modül bulunmuyor.
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => {
                return (
                  <Link
                    key={module.id}
                    href={`/education/tests/${technology}/modules/${encodeURIComponent(module.id)}`}
                    className="group relative tech-card tech-card-glow card-shimmer hover-3d glass-tech rounded-2xl overflow-hidden p-5 sm:p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400 focus-visible:outline-offset-2"
                  >
                    {/* Particle background for module card */}
                    <div className="absolute inset-0 particle-bg-tech rounded-2xl" />
                    
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-indigo-400/0 to-purple-400/0 dark:from-blue-400/0 dark:via-indigo-400/0 dark:to-purple-400/0 group-hover:from-blue-400/5 group-hover:via-indigo-400/5 group-hover:to-purple-400/5 dark:group-hover:from-blue-400/8 dark:group-hover:via-indigo-400/8 dark:group-hover:to-purple-400/8 transition-all duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {index + 1}
                      </div>
                      <div className="flex flex-col items-end gap-2 text-xs">
                        <span className="tech-badge text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-3 py-1.5" style={{ background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(156, 163, 175, 0.1))', borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                          <FileText className="h-3.5 w-3.5" />
                          {module.testCount} test
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex-1 space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
                        {module.description ?? "Bu modülün açıklaması yakında eklenecek."}
                      </p>
                    </div>
                    <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
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

