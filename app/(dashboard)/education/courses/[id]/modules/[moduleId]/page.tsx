"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Clock,
  GraduationCap,
  ListChecks,
  CheckCircle2,
  ArrowRight,
  Code2,
  Target,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { checkSubscriptionBeforeAction } from "@/lib/utils/subscription-check";

type ModuleLesson = {
  label: string;
  href: string;
  description?: string;
};

type ModuleSummary = {
  id: string;
  title: string;
  summary?: string | null;
  durationMinutes?: number | null;
  objectives?: string[];
  relatedTopics?: ModuleLesson[];
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  field: string | null;
  subCategory: string | null;
  expertise: string | null;
  topic: string | null;
  topicContent: string | null;
  difficulty: string;
  estimatedDuration: number | null;
  content: {
    overview?: {
      description?: string | null;
      estimatedDurationMinutes?: number | null;
    };
    modules?: ModuleSummary[];
    learningObjectives?: string[];
    prerequisites?: string[];
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

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseIdParam = params?.id;
  const moduleIdParam = params?.moduleId;

  const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam;
  const moduleId = Array.isArray(moduleIdParam) ? moduleIdParam[0] : moduleIdParam;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!courseId) {
      return;
    }

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const [courseResponse, completionsResponse] = await Promise.all([
          fetch(`/api/courses/${courseId}`),
          fetch("/api/lessons/completions"),
        ]);

        if (!courseResponse.ok) {
          throw new Error("Kurs bilgileri alınamadı");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData.course ?? null);

        // Load lesson completions
        if (completionsResponse.ok) {
          const completionsData = await completionsResponse.json();
          const completionsMap: Record<string, boolean> = {};
          if (Array.isArray(completionsData.completions)) {
            completionsData.completions.forEach((completion: { lessonSlug: string; completedAt: string | null }) => {
              if (completion.completedAt) {
                completionsMap[completion.lessonSlug] = true;
              }
            });
          }
          setLessonCompletions(completionsMap);
        }
      } catch (error) {
        console.error(error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchCourse();
  }, [courseId]);

  const modules = useMemo<ModuleSummary[]>(() => {
    if (!course?.content?.modules) {
      return [];
    }
    return course.content.modules.map((module) => ({
      ...module,
      objectives: Array.isArray(module.objectives) ? module.objectives : [],
      relatedTopics: Array.isArray(module.relatedTopics) ? module.relatedTopics : [],
    }));
  }, [course]);

  const selectedModule = useMemo(() => {
    if (!moduleId) {
      return null;
    }
    return modules.find((module) => module.id === moduleId) ?? null;
  }, [modules, moduleId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-blue-200/50 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/30 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 text-sm font-medium text-blue-700 dark:text-blue-300 py-8">
            <Clock className="h-5 w-5 animate-spin" />
            Modül içeriği yükleniyor...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mx-auto max-w-xl border-red-200/50 dark:border-red-800/50 bg-red-50/70 dark:bg-red-950/30 backdrop-blur-sm">
          <CardContent className="text-red-700 dark:text-red-300 py-8">
            Kurs bulunamadı ya da içerik henüz hazırlanmadı.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-6">
        <Link
          href={`/education/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Kursa dön
        </Link>
        <Card className="mx-auto max-w-2xl border-yellow-200/50 dark:border-yellow-800/50 bg-yellow-50/70 dark:bg-yellow-900/30 backdrop-blur-sm">
          <CardContent className="space-y-3 py-8 text-center">
            <CardTitle className="text-xl md:text-2xl">Modül bulunamadı</CardTitle>
            <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
              Ulaşmaya çalıştığınız modül bu kurs içerisinde yer almıyor olabilir. Modül listesinden
              başka bir başlık seçerek ilerleyebilirsiniz.
            </p>
            <div className="flex justify-center mt-4">
              <Button href={`/education/courses/${course.id}`} variant="secondary">
                Modül listesi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lessons = selectedModule.relatedTopics ?? [];

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
            href={`/education/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300 hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            {course.title}
          </Link>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 tech-badge text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 mb-2">
              <Code2 className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Modül Başlığı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-text-shimmer">
                {selectedModule.title}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {selectedModule.summary ?? "Bu modülün açıklaması yakında güncellenecek."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {formatMinutes(selectedModule.durationMinutes) && (
              <span className="tech-badge text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 px-3 py-1.5 sm:px-4 sm:py-2">
                <Clock className="h-4 w-4" />
                {formatMinutes(selectedModule.durationMinutes)}
              </span>
            )}
            <span className="tech-badge text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-3 py-1.5 sm:px-4 sm:py-2" style={{ background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(156, 163, 175, 0.1))', borderColor: 'rgba(107, 114, 128, 0.3)' }}>
              <BookOpen className="h-4 w-4" />
              {lessons.length} ders
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr),360px] xl:gap-10">
        {/* Lessons List */}
        <div className="space-y-6">
          <div className="relative tech-card glass-tech overflow-hidden border border-blue-200/50 dark:border-blue-800/50 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 rounded-3xl">
            {/* Particle background */}
            <div className="absolute inset-0 particle-bg-tech" />
            
            <div className="relative z-10 border-b border-blue-100/80 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Ders Listesi
                </h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Modül içerisindeki derslerden birini seçerek derse ait içeriğe geçebilirsin.
              </p>
            </div>
            <div className="relative z-10 space-y-3 sm:space-y-4 p-6">
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => {
                  const isCompleted = lessonCompletions[lesson.href] || false;
                  
                  return (
                    <div
                      key={lesson.href}
                      className={`
                        group relative tech-card tech-card-glow card-shimmer hover-3d glass-tech flex flex-col gap-4 rounded-xl p-5 transition-all duration-300
                        md:flex-row md:items-center md:justify-between
                        ${
                          isCompleted
                            ? "border-emerald-200/50 dark:border-emerald-800/50"
                            : "border-gray-200/50 dark:border-gray-700/50"
                        }
                      `}
                    >
                      {/* Particle background for lesson card */}
                      <div className="absolute inset-0 particle-bg-tech rounded-xl" />
                      
                      {/* Subtle gradient overlay on hover */}
                      <div className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none ${
                        isCompleted
                          ? "bg-gradient-to-br from-emerald-400/0 via-green-400/0 to-emerald-400/0 group-hover:from-emerald-400/5 group-hover:via-green-400/5 group-hover:to-emerald-400/5 dark:group-hover:from-emerald-400/8 dark:group-hover:via-green-400/8 dark:group-hover:to-emerald-400/8"
                          : "bg-gradient-to-br from-blue-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:via-indigo-400/5 group-hover:to-purple-400/5 dark:group-hover:from-blue-400/8 dark:group-hover:via-indigo-400/8 dark:group-hover:to-purple-400/8"
                      }`} />
                      
                      {/* Subtle glow effect */}
                      <div className={`absolute -inset-0.5 rounded-xl opacity-0 blur-xl transition-all duration-300 pointer-events-none ${
                        isCompleted 
                          ? "bg-gradient-to-r from-emerald-400/0 via-green-400/0 to-emerald-400/0 group-hover:from-emerald-400/10 group-hover:via-green-400/10 group-hover:to-emerald-400/10 dark:group-hover:from-emerald-400/15 dark:group-hover:via-green-400/15 dark:group-hover:to-emerald-400/15" 
                          : "bg-gradient-to-r from-blue-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:via-indigo-400/10 group-hover:to-purple-400/10 dark:group-hover:from-blue-400/15 dark:group-hover:via-indigo-400/15 dark:group-hover:to-purple-400/15"
                      }`} />
                      
                      <div className="relative z-10 flex items-start gap-4 flex-1">
                        <div
                          className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                            ${
                              isCompleted
                                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                            }
                          `}
                        >
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {lesson.label}
                            </h4>
                            {isCompleted && (
                              <span className="tech-badge text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600 px-2 py-0.5" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                <CheckCircle2 className="h-3 w-3" />
                                Tamamlandı
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {lesson.description ?? "Ders açıklaması kısa süre içerisinde eklenecek."}
                          </p>
                        </div>
                      </div>
                      <div className="relative z-10 shrink-0">
                        <Button 
                          onClick={async (e) => {
                            e.preventDefault();
                            const hasSubscription = await checkSubscriptionBeforeAction();
                            if (hasSubscription) {
                              router.push(`/education/lessons/chat${lesson.href.replace('/education/lessons', '')}`);
                            }
                          }}
                          className={`
                            w-full sm:w-auto inline-flex items-center gap-2
                            ${isCompleted ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700" : ""}
                          `}
                          variant={isCompleted ? "gradient" : "primary"}
                        >
                          {isCompleted ? "Tekrar Görüntüle" : "Derse Başla"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/30 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200 backdrop-blur-sm">
                  Bu modül için tanımlanmış ders başlığı bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {(selectedModule.objectives?.length ?? 0) > 0 && (
            <div className="relative tech-card glass-tech overflow-hidden border border-blue-200/50 dark:border-blue-800/50 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 rounded-2xl">
              {/* Particle background */}
              <div className="absolute inset-0 particle-bg-tech" />
              
              <div className="relative z-10 border-b border-blue-100/80 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/30 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
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
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                        <ListChecks className="h-3 w-3 text-white" />
                      </div>
                      <span className="leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {(course.content?.prerequisites?.length ?? 0) > 0 && (
            <div className="relative tech-card glass-tech overflow-hidden border border-blue-200/50 dark:border-blue-800/50 shadow-lg rounded-2xl">
              {/* Particle background */}
              <div className="absolute inset-0 particle-bg-tech" />
              
              <div className="relative z-10 border-b border-blue-100/80 dark:border-blue-800/50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Kurs Ön Gereksinimleri
                  </h3>
                </div>
              </div>
              <div className="relative z-10 p-5">
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  {course.content?.prerequisites?.map((item) => (
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
