"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

interface CourseStatus {
  loading: boolean;
  success: string | null;
  error: string | null;
  stats: {
    modulesCreated?: number;
    lessonsCreated?: number;
    totalDuration?: number;
  } | null;
}

export default function AdminPage() {
  const [courseState, setCourseState] = useState<CourseStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const handleCreateDotNetCourse = async () => {
    if (
      !confirm(
        ".NET Core kursu oluşturmak istediğinizden emin misiniz? Bu işlem 15 modül ve her modülde 15 ders oluşturacak. (Kurs zaten varsa güncellenecek)"
      )
    ) {
      return;
    }

    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/dotnet-core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Admin Paneli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Sistem ayarları ve yönetim
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="rounded-3xl border border-blue-200 bg-white shadow-lg dark:border-blue-800 dark:bg-gray-950 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            📚 Kurslar
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Kurs yapıları oluşturun. Her kurs 15 modül ve her modülde 15 ders içerir.
        </p>
        <div className="max-w-md">
          <Button
            onClick={handleCreateDotNetCourse}
            disabled={courseState.loading}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
          >
            {courseState.loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-5 w-5" />
                .NET Core Kurs Oluştur
              </>
            )}
          </Button>
          {courseState.success && (
            <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
              <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">{courseState.success}</div>
                  {courseState.stats && (
                    <div className="mt-1 text-xs opacity-80">
                      <div>Modüller: {courseState.stats.modulesCreated}</div>
                      <div>Dersler: {courseState.stats.lessonsCreated}</div>
                      {courseState.stats.totalDuration && (
                        <div>
                          Toplam Süre:{" "}
                          {Math.floor(courseState.stats.totalDuration / 60)} saat{" "}
                          {courseState.stats.totalDuration % 60} dakika
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {courseState.error && (
            <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">{courseState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
