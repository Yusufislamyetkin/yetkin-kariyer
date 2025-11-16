"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Clock,
  GraduationCap,
  ListChecks,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

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
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl border-blue-100 bg-blue-50/70 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
          <CardContent className="flex items-center gap-3 text-sm font-medium">
            <Clock className="h-5 w-5 animate-spin" />
            Modül içeriği yükleniyor...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          <CardContent>Kurs bulunamadı ya da içerik henüz hazırlanmadı.</CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-6">
        <Link
          href={`/education/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Kursa dön
        </Link>
        <Card className="mx-auto max-w-2xl border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
          <CardContent className="space-y-3 py-8 text-center">
            <CardTitle className="text-xl">Modül bulunamadı</CardTitle>
            <p className="text-sm">
              Ulaşmaya çalıştığınız modül bu kurs içerisinde yer almıyor olabilir. Modül listesinden
              başka bir başlık seçerek ilerleyebilirsiniz.
            </p>
            <div className="flex justify-center">
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
    <div className="container mx-auto px-4 py-8 space-y-10">
      <div className="space-y-3">
        <Link
          href={`/education/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {course.title}
        </Link>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Modül Başlığı
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{selectedModule.title}</h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            {selectedModule.summary ?? "Bu modülün açıklaması yakında güncellenecek."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          {formatMinutes(selectedModule.durationMinutes) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <Clock className="h-4 w-4" />
              {formatMinutes(selectedModule.durationMinutes)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <BookOpen className="h-4 w-4" />
            {lessons.length} ders
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px] xl:gap-10">
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Ders Listesi
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Modül içerisindeki derslerden birini seçerek derse ait içeriğe geçebilirsin.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => {
                  const isCompleted = lessonCompletions[lesson.href] || false;
                  
                  return (
                    <div
                      key={lesson.href}
                      className={`
                        flex flex-col gap-4 rounded-xl border px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg
                        md:flex-row md:items-center md:justify-between
                        ${
                          isCompleted
                            ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700"
                            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700"
                        }
                      `}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`
                            flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm
                            ${
                              isCompleted
                                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                            }
                          `}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{lesson.label}</h4>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
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
                      <Button 
                        href={`/education/lessons/chat${lesson.href.replace('/education/lessons', '')}`} 
                        className={`
                          shrink-0 inline-flex items-center gap-2
                          ${isCompleted ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                        `}
                        variant={isCompleted ? "gradient" : "primary"}
                      >
                        {isCompleted ? "Tekrar Görüntüle" : "Derse Başla"}
                        <ChevronLeft className="rotate-180 h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                  Bu modül için tanımlanmış ders başlığı bulunmuyor.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {(selectedModule.objectives?.length ?? 0) > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Öğrenme Hedefleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {selectedModule.objectives?.map((objective) => (
                    <li key={objective} className="flex items-start gap-2">
                      <ListChecks className="mt-0.5 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {(course.content?.prerequisites?.length ?? 0) > 0 && (
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Kurs Ön Gereksinimleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {course.content?.prerequisites?.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ListChecks className="mt-0.5 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

