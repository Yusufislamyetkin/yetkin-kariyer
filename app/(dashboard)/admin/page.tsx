"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, CheckCircle2, AlertCircle, BookOpen, Trash2, Code2, Database, Globe, Zap, Shield, Container, Lock, FileText } from "lucide-react";

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

interface ClearStatus {
  loading: boolean;
  success: string | null;
  error: string | null;
}

interface TestStatus {
  loading: boolean;
  success: string | null;
  error: string | null;
  stats: {
    testsCreated?: number;
  } | null;
}

export default function AdminPage() {
  const [courseState, setCourseState] = useState<CourseStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const [clearState, setClearState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [testState, setTestState] = useState<TestStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const handleCreateDotNetCourse = async () => {
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

  const handleCreateJavaCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/java", {
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

  const handleCreateMssqlCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/mssql", {
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

  const handleCreateNodeJSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/nodejs", {
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

  const handleCreateReactCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/react", {
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

  const handleCreateAngularCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/angular", {
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

  const handleCreateAICourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/ai-for-developers", {
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

  const handleCreateFlutterCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/flutter", {
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

  const handleCreateEthicalHackingCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/ethical-hacking", {
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

  const handleCreateNextJSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/nextjs", {
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

  const handleCreateDockerKubernetesCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/docker-kubernetes", {
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

  const handleCreateOwaspCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/owasp-security", {
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

  const handleCreateDotNetTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/dotnet-core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateJavaTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/java", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateMssqlTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/mssql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateReactTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateAngularTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/angular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateNodeJSTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/nodejs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateAITest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/ai-for-developers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateFlutterTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/flutter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateEthicalHackingTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/ethical-hacking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateNextJSTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/nextjs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateDockerKubernetesTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/docker-kubernetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateOwaspTest = async () => {
    setTestState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-test/owasp-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test oluşturulurken bir hata oluştu");
      }

      setTestState({
        loading: false,
        success: data.message || "Test başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleClearAllCourseData = async () => {
    if (
      !confirm(
        "TÜM kurs, modül ve ders içeriklerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      return;
    }

    if (clearState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setClearState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      // Önce tüm ders kayıtlarını temizle (lesson- ve topic- ile başlayanlar)
      const clearTopicsResponse = await fetch("/api/admin/clear-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const topicsData = await clearTopicsResponse.json();

      if (!clearTopicsResponse.ok) {
        throw new Error(topicsData.error || "Ders ve modül verileri temizlenirken bir hata oluştu");
      }

      // Sonra tüm kursları temizle (course-dotnet-roadmap dahil)
      const clearCoursesResponse = await fetch("/api/admin/clear-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const coursesData = await clearCoursesResponse.json();

      if (!clearCoursesResponse.ok) {
        throw new Error(coursesData.error || "Kurslar temizlenirken bir hata oluştu");
      }

      setClearState({
        loading: false,
        success: `Tüm kurs, modül ve ders verileri başarıyla temizlendi. ${topicsData.deletedLessonsCount || 0} ders kaydı, ${topicsData.deletedModulesCount || 0} modül ve ${coursesData.deletedCount || 0} kurs silindi.`,
        error: null,
      });
    } catch (err: any) {
      setClearState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
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
      <div className="relative rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 shadow-2xl dark:border-blue-800/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                📚 Kurs Oluşturma Merkezi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Teknoloji stack&apos;inizi genişletin
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Her kurs 15 modül ve 225 ders içerir. Profesyonel eğitim içerikleri ile yazılım geliştirme yolculuğunuza başlayın.
          </p>
          
          {/* Modern Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Course Card Component */}
            {[
              { 
                title: ".NET Core", 
                handler: handleCreateDotNetCourse, 
                gradient: "from-blue-600 via-indigo-600 to-purple-600",
                icon: Code2,
                description: "Backend Framework"
              },
              { 
                title: "Java", 
                handler: handleCreateJavaCourse, 
                gradient: "from-orange-500 via-red-500 to-pink-500",
                icon: Code2,
                description: "Enterprise Language"
              },
              { 
                title: "MSSQL", 
                handler: handleCreateMssqlCourse, 
                gradient: "from-orange-600 via-red-600 to-orange-700",
                icon: Database,
                description: "Database Management"
              },
              { 
                title: "React", 
                handler: handleCreateReactCourse, 
                gradient: "from-cyan-500 via-blue-500 to-indigo-600",
                icon: Globe,
                description: "Frontend Library"
              },
              { 
                title: "Angular", 
                handler: handleCreateAngularCourse, 
                gradient: "from-red-600 via-pink-600 to-rose-600",
                icon: Globe,
                description: "Frontend Framework"
              },
              { 
                title: "Node.js", 
                handler: handleCreateNodeJSCourse, 
                gradient: "from-green-500 via-emerald-500 to-teal-600",
                icon: Zap,
                description: "Runtime Environment"
              },
              { 
                title: "Yapay Zeka", 
                handler: handleCreateAICourse, 
                gradient: "from-purple-600 via-pink-600 to-rose-500",
                icon: Zap,
                description: "AI for Developers"
              },
              { 
                title: "Flutter", 
                handler: handleCreateFlutterCourse, 
                gradient: "from-blue-400 via-cyan-500 to-blue-600",
                icon: Globe,
                description: "Mobile Development"
              },
              { 
                title: "Ethical Hacking", 
                handler: handleCreateEthicalHackingCourse, 
                gradient: "from-red-600 via-orange-600 to-red-700",
                icon: Shield,
                description: "Cybersecurity"
              },
              { 
                title: "Next.js", 
                handler: handleCreateNextJSCourse, 
                gradient: "from-gray-800 via-gray-900 to-black",
                icon: Code2,
                description: "React Framework"
              },
              { 
                title: "Docker & K8s", 
                handler: handleCreateDockerKubernetesCourse, 
                gradient: "from-blue-500 via-cyan-500 to-blue-600",
                icon: Container,
                description: "Containerization"
              },
              { 
                title: "OWASP Security", 
                handler: handleCreateOwaspCourse, 
                gradient: "from-yellow-500 via-orange-600 to-red-600",
                icon: Lock,
                description: "Web Security"
              },
            ].map((course, idx) => {
              const Icon = course.icon;
              return (
                <button
                  key={idx}
                  onClick={course.handler}
                  disabled={courseState.loading}
                  className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${course.gradient} backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 text-left">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {courseState.loading && (
                        <Loader2 className="h-5 w-5 text-white/80 animate-spin" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">{course.description}</p>
                    <div className="flex items-center text-xs text-white/60">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>15 Modül • 225 Ders</span>
                    </div>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </button>
              );
            })}
          </div>
          
          {/* Success/Error Messages */}
          {courseState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base mb-2">{courseState.success}</div>
                  {courseState.stats && (
                    <div className="flex flex-wrap gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Modüller: <strong>{courseState.stats.modulesCreated}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Dersler: <strong>{courseState.stats.lessonsCreated}</strong></span>
                      </div>
                      {courseState.stats.totalDuration && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span>
                            Süre: <strong>{Math.floor(courseState.stats.totalDuration / 60)}</strong> saat{" "}
                            <strong>{courseState.stats.totalDuration % 60}</strong> dakika
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {courseState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{courseState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tests Section */}
      <div className="relative rounded-3xl border border-purple-200/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 shadow-2xl dark:border-purple-800/50 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                📝 Test Oluşturma Merkezi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Bilginizi test edin ve değerlendirin
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Her teknoloji için kapsamlı test paketleri oluşturun. Test içeriği daha sonra eklenecektir.
          </p>
          
          {/* Modern Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { 
                title: ".NET Core", 
                handler: handleCreateDotNetTest, 
                gradient: "from-blue-600 via-indigo-600 to-purple-600",
                icon: Code2,
                description: "Backend Framework"
              },
              { 
                title: "Java", 
                handler: handleCreateJavaTest, 
                gradient: "from-orange-500 via-red-500 to-pink-500",
                icon: Code2,
                description: "Enterprise Language"
              },
              { 
                title: "MSSQL", 
                handler: handleCreateMssqlTest, 
                gradient: "from-orange-600 via-red-600 to-orange-700",
                icon: Database,
                description: "Database Management"
              },
              { 
                title: "React", 
                handler: handleCreateReactTest, 
                gradient: "from-cyan-500 via-blue-500 to-indigo-600",
                icon: Globe,
                description: "Frontend Library"
              },
              { 
                title: "Angular", 
                handler: handleCreateAngularTest, 
                gradient: "from-red-600 via-pink-600 to-rose-600",
                icon: Globe,
                description: "Frontend Framework"
              },
              { 
                title: "Node.js", 
                handler: handleCreateNodeJSTest, 
                gradient: "from-green-500 via-emerald-500 to-teal-600",
                icon: Zap,
                description: "Runtime Environment"
              },
              { 
                title: "Yapay Zeka", 
                handler: handleCreateAITest, 
                gradient: "from-purple-600 via-pink-600 to-rose-500",
                icon: Zap,
                description: "AI for Developers"
              },
              { 
                title: "Flutter", 
                handler: handleCreateFlutterTest, 
                gradient: "from-blue-400 via-cyan-500 to-blue-600",
                icon: Globe,
                description: "Mobile Development"
              },
              { 
                title: "Ethical Hacking", 
                handler: handleCreateEthicalHackingTest, 
                gradient: "from-red-600 via-orange-600 to-red-700",
                icon: Shield,
                description: "Cybersecurity"
              },
              { 
                title: "Next.js", 
                handler: handleCreateNextJSTest, 
                gradient: "from-gray-800 via-gray-900 to-black",
                icon: Code2,
                description: "React Framework"
              },
              { 
                title: "Docker & K8s", 
                handler: handleCreateDockerKubernetesTest, 
                gradient: "from-blue-500 via-cyan-500 to-blue-600",
                icon: Container,
                description: "Containerization"
              },
              { 
                title: "OWASP Security", 
                handler: handleCreateOwaspTest, 
                gradient: "from-yellow-500 via-orange-600 to-red-600",
                icon: Lock,
                description: "Web Security"
              },
            ].map((test, idx) => {
              const Icon = test.icon;
              return (
                <button
                  key={idx}
                  onClick={test.handler}
                  disabled={testState.loading}
                  className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${test.gradient} backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${test.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 text-left">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {testState.loading && (
                        <Loader2 className="h-5 w-5 text-white/80 animate-spin" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                      {test.title}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">{test.description}</p>
                    <div className="flex items-center text-xs text-white/60">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>Test Paketi</span>
                    </div>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </button>
              );
            })}
          </div>
          
          {/* Success/Error Messages */}
          {testState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base mb-2">{testState.success}</div>
                  {testState.stats && (
                    <div className="flex flex-wrap gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>Testler: <strong>{testState.stats.testsCreated || 0}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {testState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{testState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear All Course Data Section */}
      <div className="rounded-3xl border border-red-200 bg-white shadow-lg dark:border-red-800 dark:bg-gray-950 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🗑️ Veri Temizleme
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tüm kurs, modül ve ders içeriklerini veritabanından siler. Bu işlem geri alınamaz!
        </p>
        <div className="max-w-md">
          <Button
            onClick={handleClearAllCourseData}
            disabled={clearState.loading}
            size="lg"
            variant="danger"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
          >
            {clearState.loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Temizleniyor...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-5 w-5" />
                Tüm Kurs Verilerini Temizle
              </>
            )}
          </Button>
          {clearState.success && (
            <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
              <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">{clearState.success}</div>
              </div>
            </div>
          )}
          {clearState.error && (
            <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">{clearState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
