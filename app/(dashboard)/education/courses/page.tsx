"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  field: string | null;
  difficulty: string;
  estimatedDuration: number | null;
  moduleCount: number;
  totalLessons: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/courses`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", errorData);
          throw new Error(errorData.error || "Kurslar yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        console.log("Fetched courses data:", data);
        const coursesList = data.courses || [];
        console.log("Courses list:", coursesList);
        setCourses(coursesList);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching courses:", err);
          setError((err as Error).message || "Kurslar şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    return () => controller.abort();
  }, []);

  const heroStats = useMemo(
    () => {
      const totalModules = courses.reduce((sum, course) => sum + course.moduleCount, 0);
      const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0);
      
      return [
        { label: "Toplam Kurs", value: courses.length.toString() },
        {
          label: "Toplam Modül",
          value: totalModules.toString(),
        },
        {
          label: "Toplam Ders",
          value: totalLessons.toString(),
        },
      ];
    },
    [courses]
  );

  if (loading) {
    return (
      <div className="space-y-10 animate-fade-in">
        <HeroSection loading stats={heroStats} />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-48 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <HeroSection stats={heroStats} />

      <div className="flex flex-col gap-6">
        {error ? (
          <Card variant="elevated">
            <CardContent className="py-16">
              <div className="mx-auto max-w-xl space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <Sparkles className="h-7 w-7 text-rose-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bir şeyler ters gitti
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : courses.length === 0 ? (
          <Card variant="gradient">
            <CardContent className="py-16">
              <div className="mx-auto max-w-xl space-y-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-300" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Henüz kurs bulunamadı
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Kurslar henüz yüklenmemiş. Lütfen admin panelinden seed data&apos;yı yükleyin.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                href={`/education/courses/${course.id}`}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-blue-500 rounded-3xl"
              >
                <Card
                  variant="gradient"
                  hover
                  className="relative overflow-hidden backdrop-blur-xl shadow-lg border border-slate-200/70 dark:border-slate-700/60 transition-transform duration-300 group-hover:translate-y-[-4px] group-hover:shadow-2xl h-full"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <CardContent className="relative z-10 p-6 sm:p-8 lg:p-10">
                    <div className="mb-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 dark:group-hover:from-blue-400 dark:group-hover:via-purple-400 dark:group-hover:to-pink-400 transition-all duration-300 leading-tight">
                            {course.title}
                          </h3>
                          {course.description && (
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats Badges */}
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                            {course.moduleCount} Modül
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                            {course.totalLessons} Ders
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200/70 dark:border-gray-700/70">
                      <div className="flex-1" />
                      <span className="inline-flex items-center gap-2 text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300">
                        <span>Kursa Git</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
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
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-transparent bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-xl shadow-blue-900/30">
      <div className="absolute inset-0">
        <div className="absolute -top-16 -right-16 h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 sm:space-y-4 lg:max-w-2xl">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide backdrop-blur">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-300" />
              Kariyerinizi hızlandırın
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
              Modern teknolojilerle güçlendirilmiş dinamik öğrenme yolları
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Kariyer hedeflerinize uygun kursları filtreleyin, becerilerinizi değerlendirin ve
              oyunlaştırılmış deneyimlerle öğrenme motivasyonunuzu yüksek tutun.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-auto lg:flex-shrink-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2 sm:px-3 sm:py-2.5 text-left"
              >
                {loading ? (
                  <div className="h-5 sm:h-6 w-12 sm:w-16 animate-pulse rounded bg-white/20" />
                ) : (
                  <span className="text-lg sm:text-xl md:text-2xl font-semibold">{stat.value}</span>
                )}
                <span className="text-[10px] sm:text-xs uppercase tracking-wide text-white/70 leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
