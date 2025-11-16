"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { BookOpen, ChevronLeft, Clock, Compass, GraduationCap, ListChecks } from "lucide-react";
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

type CourseResource = {
  id: string;
  title: string;
  url?: string;
  type?: string;
  description?: string;
  estimatedMinutes?: number;
};

type CourseCapstone = {
  title?: string;
  description?: string;
  problemStatement?: string;
  deliverables?: string[];
  evaluationCriteria?: Array<{
    id?: string;
    dimension: string;
    levels?: Array<{ label: string; description: string }>;
  }>;
  recommendedDurationMinutes?: number;
};

interface CourseContentPayload {
  overview?: {
    description?: string | null;
    estimatedDurationMinutes?: number | null;
  };
  learningObjectives?: string[];
  prerequisites?: string[];
  modules?: ModuleSummary[];
  resources?: CourseResource[];
  capstone?: CourseCapstone | null;
}

interface Course {
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
  content: CourseContentPayload | null;
  quizzes: { id: string; title: string; description: string | null }[];
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

export default function CourseDetailPage() {
  const params = useParams();
  const courseIdParam = params?.id;
  const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    // If courseId is a number, it's likely a moduleIndex, redirect to moduleIndex route
    if (!isNaN(Number(courseId)) && Number(courseId) > 0 && Number.isInteger(Number(courseId))) {
      router.replace(`/education/courses/${courseId}`);
      return;
    }

  const fetchCourse = async () => {
      setLoading(true);
    try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Kurs bilgileri alınamadı");
        }
      const data = await response.json();
        setCourse(data.course ?? null);
    } catch (error) {
        console.error(error);
        setCourse(null);
    } finally {
      setLoading(false);
    }
  };

    void fetchCourse();
  }, [courseId, router]);

  const modules = useMemo<ModuleSummary[]>(() => {
    if (!course?.content?.modules) {
      return [];
    }
    const allModules = course.content.modules.map((module) => ({
      ...module,
      objectives: Array.isArray(module.objectives) ? module.objectives : [],
      relatedTopics: Array.isArray(module.relatedTopics) ? module.relatedTopics : [],
    }));
    
    // Sort by id (module-01, module-02, etc.) and limit to 15
    const sortedModules = allModules.sort((a, b) => {
      const aNum = parseInt(a.id.replace('module-', '')) || 0;
      const bNum = parseInt(b.id.replace('module-', '')) || 0;
      return aNum - bNum;
    });
    
    return sortedModules.slice(0, 15);
  }, [course]);

  useEffect(() => {
    if (!course?.id || modules.length === 0) {
      return;
    }

    const requestedModule = searchParams?.get("module");
    if (
      requestedModule &&
      modules.some((module) => module.id === requestedModule)
    ) {
      router.replace(`/education/courses/${course.id}/modules/${requestedModule}`);
    }
  }, [course?.id, modules, router, searchParams]);

  const courseOverview = course?.content?.overview;
  const overviewDescription =
    (courseOverview?.description ?? course?.description ?? "") ||
    "Bu kurs boyunca .NET Core ekosistemine ait modüller adım adım işlenir.";
  const overviewDuration =
    courseOverview?.estimatedDurationMinutes ?? course?.estimatedDuration ?? 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl border-blue-100 bg-blue-50/70 text-blue-700">
          <CardContent className="flex items-center gap-3 text-sm font-medium">
            <Clock className="h-5 w-5 animate-spin" />
            Kurs içeriği yükleniyor...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl border-red-200 bg-red-50 text-red-700">
          <CardContent>Kurs bulunamadı ya da içerik henüz hazırlanmadı.</CardContent>
        </Card>
      </div>
    );
  }

  const tagItems = [
    course.category && {
      label: course.category,
      style: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    course.field && {
      label: course.field,
      style: "bg-green-100 text-green-700 border border-green-200",
    },
    course.subCategory && {
      label: course.subCategory,
      style: "bg-purple-100 text-purple-700 border border-purple-200",
    },
    course.topic && {
      label: course.topic,
      style: "bg-orange-100 text-orange-700 border border-orange-200",
    },
    course.expertise && {
      label: `Uzmanlık: ${course.expertise}`,
      style: "bg-pink-100 text-pink-700 border border-pink-200",
    },
    course.topicContent && {
      label: course.topicContent,
      style: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    },
    course.difficulty && {
      label: `Seviye: ${course.difficulty}`,
      style: "bg-gray-100 text-gray-700 border border-gray-200",
    },
  ]
    .filter(Boolean)
    .map((tag) => tag as { label: string; style: string });

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <Link
        href="/education/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Kurslara dön
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {course.description ??
              "Uzmanlık modülleri ile .NET Core ekosistemini uçtan uca öğrenin."}
          </p>
          {tagItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagItems.map((tag) => (
                <span
                  key={tag.label}
                  className={clsx(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    tag.style
                  )}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <Card variant="outlined" className="md:w-72 border-dashed border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30">
          <CardContent className="flex items-start gap-4 px-5 py-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Tahmini süre
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {formatMinutes(overviewDuration) ?? "Süre bilgisi yakında"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatMinutes(overviewDuration)
                  ? "Modülleri tamamlamak için planlanan toplam süre."
                  : "Program süresi henüz belirlenmedi."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card
        variant="elevated"
        className="overflow-hidden border border-blue-100 shadow-lg shadow-blue-100/40"
      >
        <CardHeader className="space-y-3 border-b border-blue-100/80 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 px-8 py-6 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <Compass className="h-6 w-6 text-blue-600" />
            Modül Listesi
          </CardTitle>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Başlamak istediğin modülü seç ve detay sayfasında dersleri incele.
          </p>
        </CardHeader>
        <CardContent className="p-8 pt-12">
          {modules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/50">
              Bu kurs için yayınlanmış modül bulunmuyor.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => {
                const lessonCount = module.relatedTopics?.length ?? 0;

                return (
                  <Link
                    key={module.id}
                    href={`/education/courses/${course.id}/modules/${module.id}`}
                    className={clsx(
                      "group flex flex-col rounded-2xl border-2 border-transparent bg-white p-6 shadow-md transition-all duration-300",
                      "hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex flex-col items-end gap-2 text-xs">
                        {formatMinutes(module.durationMinutes) && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 font-semibold text-blue-700 shadow-sm">
                            <Clock className="h-3.5 w-3.5" />
                            {formatMinutes(module.durationMinutes)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 font-semibold text-gray-700">
                          <BookOpen className="h-3.5 w-3.5" />
                          {lessonCount} ders
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {module.summary ?? "Bu modülün açıklaması yakında eklenecek."}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Modüle git
                      <ChevronLeft className="h-4 w-4 rotate-180" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


