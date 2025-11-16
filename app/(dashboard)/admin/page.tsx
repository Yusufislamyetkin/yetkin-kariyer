"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Database, Loader2, CheckCircle2, XCircle, AlertCircle, Trash2, Rocket, Code, X, Plus, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleStatus {
  moduleId: string;
  title: string;
  status: "pending" | "loading" | "success" | "error";
  error?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<ModuleStatus[]>([]);
  const [overallStatus, setOverallStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [topicsProcessed, setTopicsProcessed] = useState<number | null>(null);
  const [lessonsProcessed, setLessonsProcessed] = useState<number | null>(null);
  const [lessonsFilled, setLessonsFilled] = useState<number | null>(null);
  const [lessonsLimited, setLessonsLimited] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState<string | null>(null);
  const [clearError, setClearError] = useState<string | null>(null);
  const [clearingTopics, setClearingTopics] = useState(false);
  const [clearTopicsSuccess, setClearTopicsSuccess] = useState<string | null>(null);
  const [clearTopicsError, setClearTopicsError] = useState<string | null>(null);
  const [creatingRoadmap, setCreatingRoadmap] = useState(false);
  const [roadmapSuccess, setRoadmapSuccess] = useState<string | null>(null);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const [importingLessons, setImportingLessons] = useState(false);
  const [importLessonsSuccess, setImportLessonsSuccess] = useState<string | null>(null);
  const [importLessonsError, setImportLessonsError] = useState<string | null>(null);
  const [settingUpRoadmap, setSettingUpRoadmap] = useState(false);
  const [setupRoadmapSuccess, setSetupRoadmapSuccess] = useState<string | null>(null);
  const [setupRoadmapError, setSetupRoadmapError] = useState<string | null>(null);
  const [creatingContentBatch, setCreatingContentBatch] = useState(false);
  const [contentBatchSuccess, setContentBatchSuccess] = useState<string | null>(null);
  const [contentBatchError, setContentBatchError] = useState<string | null>(null);
  const [contentBatchCreated, setContentBatchCreated] = useState<{ liveCoding: number; bugfix: number } | null>(null);
  const [creatingHackathons, setCreatingHackathons] = useState(false);
  const [hackathonsSuccess, setHackathonsSuccess] = useState<string | null>(null);
  const [hackathonsError, setHackathonsError] = useState<string | null>(null);
  const [hackathonsCreated, setHackathonsCreated] = useState<number | null>(null);
  const [creatingFreelancerRequests, setCreatingFreelancerRequests] = useState(false);
  const [freelancerRequestsSuccess, setFreelancerRequestsSuccess] = useState<string | null>(null);
  const [freelancerRequestsError, setFreelancerRequestsError] = useState<string | null>(null);
  const [freelancerRequestsCreated, setFreelancerRequestsCreated] = useState<number | null>(null);
  const [showLiveCodingForm, setShowLiveCodingForm] = useState(false);
  const [creatingSingleLiveCoding, setCreatingSingleLiveCoding] = useState(false);
  const [singleLiveCodingSuccess, setSingleLiveCodingSuccess] = useState<string | null>(null);
  const [singleLiveCodingError, setSingleLiveCodingError] = useState<string | null>(null);
  const [importingLiveCoding, setImportingLiveCoding] = useState(false);
  const [importLiveCodingSuccess, setImportLiveCodingSuccess] = useState<string | null>(null);
  const [importLiveCodingError, setImportLiveCodingError] = useState<string | null>(null);
  const [importLiveCodingCount, setImportLiveCodingCount] = useState<number | null>(null);
  const [creatingJobs, setCreatingJobs] = useState(false);
  const [jobsSuccess, setJobsSuccess] = useState<string | null>(null);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [jobsCreated, setJobsCreated] = useState<number | null>(null);
  const [creatingLeaderboardEntries, setCreatingLeaderboardEntries] = useState(false);
  const [leaderboardEntriesSuccess, setLeaderboardEntriesSuccess] = useState<string | null>(null);
  const [leaderboardEntriesError, setLeaderboardEntriesError] = useState<string | null>(null);
  const [leaderboardEntriesCreated, setLeaderboardEntriesCreated] = useState<{ daily: number; monthly: number } | null>(null);
  const [creatingTests, setCreatingTests] = useState(false);
  const [testsSuccess, setTestsSuccess] = useState<string | null>(null);
  const [testsError, setTestsError] = useState<string | null>(null);
  const [testsCreated, setTestsCreated] = useState<number | null>(null);
  const [liveCodingFormData, setLiveCodingFormData] = useState({
    title: "",
    description: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    taskDescription: "",
    languages: [] as string[],
    timeLimitMinutes: 30,
    acceptanceCriteria: [] as string[],
    initialCode: {} as Record<string, string>,
    expertise: "",
    topic: "",
    topicContent: "",
  });

  // Load available modules
  useEffect(() => {
    async function loadModules() {
      try {
        const response = await fetch("/api/admin/seed/modules");
        if (response.ok) {
          const data = await response.json();
          setModules(
            data.modules.map((m: any) => ({
              moduleId: m.id,
              title: m.title || m.id,
              status: "pending" as const,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading modules:", err);
      }
    }
    loadModules();
  }, []);

  const handleSeedData = async () => {
    setLoading(true);
    setError(null);
    setOverallStatus("loading");
    
    // Reset all modules to loading
    setModules((prev) =>
      prev.map((m) => ({ ...m, status: "loading" as const, error: undefined }))
    );

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Seed data yükleme başarısız oldu");
      }

      // Update module statuses
      if (data.results) {
        setModules((prev) =>
          prev.map((m) => {
            const result = data.results.find((r: any) => r.moduleId === m.moduleId);
            if (result) {
              return {
                ...m,
                status: result.success ? "success" : "error",
                error: result.error,
              };
            }
            return m;
          })
        );
      }

      // Update topics processed count
      if (data.topicsProcessed !== undefined) {
        setTopicsProcessed(data.topicsProcessed);
      }

      // Update lessons processed count
      if (data.lessonsProcessed !== undefined) {
        setLessonsProcessed(data.lessonsProcessed);
      }

      // Update lessons filled count
      if (data.lessonsFilled !== undefined) {
        setLessonsFilled(data.lessonsFilled);
      }

      // Update lessons limited count
      if (data.lessonsLimited !== undefined) {
        setLessonsLimited(data.lessonsLimited);
      }

      // Show topic errors if any
      if (data.topicErrors && data.topicErrors.length > 0) {
        console.warn("Topic import errors:", data.topicErrors);
      }

      // Show lesson errors if any
      if (data.lessonErrors && data.lessonErrors.length > 0) {
        console.warn("Lesson import errors:", data.lessonErrors);
      }

      // Show fill errors if any
      if (data.fillErrors && data.fillErrors.length > 0) {
        console.warn("Fill errors:", data.fillErrors);
      }

      setOverallStatus("success");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
      setOverallStatus("error");
      setModules((prev) =>
        prev.map((m) => ({ ...m, status: "error" as const, error: err.message }))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearCourses = async () => {
    if (!confirm("Tüm kursları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
      return;
    }

    setClearing(true);
    setClearError(null);
    setClearSuccess(null);

    try {
      const response = await fetch("/api/admin/clear-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurslar temizlenirken bir hata oluştu");
      }

      setClearSuccess(data.message || `${data.deletedCount} kurs başarıyla silindi.`);
    } catch (err: any) {
      setClearError(err.message || "Bir hata oluştu");
    } finally {
      setClearing(false);
    }
  };

  const handleClearTopics = async () => {
    if (!confirm("Tüm konu verilerini silmek istediğinizden emin misiniz? Bu işlem course-dotnet-roadmap dahil tüm konuları temizleyecek ve geri alınamaz!")) {
      return;
    }

    setClearingTopics(true);
    setClearTopicsError(null);
    setClearTopicsSuccess(null);

    try {
      const response = await fetch("/api/admin/clear-topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Konular temizlenirken bir hata oluştu");
      }

      setClearTopicsSuccess(data.message || `${data.deletedLessonsCount} ders kaydı silindi ve ${data.deletedModulesCount} modül silindi.`);
    } catch (err: any) {
      setClearTopicsError(err.message || "Bir hata oluştu");
    } finally {
      setClearingTopics(false);
    }
  };

  const handleCreateRoadmap = async () => {
    if (!confirm("Net Core Roadmap yapısını oluşturmak istediğinizden emin misiniz? Bu işlem önce tüm mevcut verileri temizleyecek, sonra yeni yapıyı oluşturacak. Geri alınamaz!")) {
      return;
    }

    setCreatingRoadmap(true);
    setRoadmapError(null);
    setRoadmapSuccess(null);

    try {
      // First, clear all topics
      const clearResponse = await fetch("/api/admin/clear-topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const clearData = await clearResponse.json();

      if (!clearResponse.ok) {
        throw new Error(clearData.error || "Veriler temizlenirken bir hata oluştu");
      }

      // Then, create the new roadmap structure
      const createResponse = await fetch("/api/admin/create-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error || "Roadmap yapısı oluşturulurken bir hata oluştu");
      }

      setRoadmapSuccess(createData.message || `${createData.modulesCreated} modül başarıyla oluşturuldu.`);
    } catch (err: any) {
      setRoadmapError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingRoadmap(false);
    }
  };

  const handleImportLessonContents = async () => {
    if (!confirm("Ders içeriklerini import etmek istediğinizden emin misiniz? Bu işlem mevcut ders içeriklerini güncelleyebilir.")) {
      return;
    }

    setImportingLessons(true);
    setImportLessonsError(null);
    setImportLessonsSuccess(null);

    try {
      const response = await fetch("/api/admin/import-lesson-contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ders içerikleri import edilirken bir hata oluştu");
      }

      setImportLessonsSuccess(data.message || `${data.lessonsProcessed} ders içeriği başarıyla import edildi.`);
      setLessonsProcessed(data.lessonsProcessed || 0);
    } catch (err: any) {
      setImportLessonsError(err.message || "Bir hata oluştu");
    } finally {
      setImportingLessons(false);
    }
  };

  const handleSetupRoadmap = async () => {
    if (!confirm("Net Core Roadmap'i kurmak istediğinizden emin misiniz? Bu işlem:\n1. Tüm mevcut konuları temizleyecek\n2. Roadmap yapısını oluşturacak (15 modül)\n3. Ders içeriklerini import edecek\n\nBu işlem geri alınamaz!")) {
      return;
    }

    setSettingUpRoadmap(true);
    setSetupRoadmapError(null);
    setSetupRoadmapSuccess(null);

    try {
      const response = await fetch("/api/admin/setup-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Roadmap kurulumu sırasında bir hata oluştu");
      }

      if (data.success) {
        setSetupRoadmapSuccess(data.message || "Net Core Roadmap başarıyla kuruldu!");
      } else {
        // Partial success
        const errorDetails = [];
        if (data.results?.clearTopics?.error) {
          errorDetails.push(`Temizleme: ${data.results.clearTopics.error}`);
        }
        if (data.results?.createRoadmap?.error) {
          errorDetails.push(`Roadmap: ${data.results.createRoadmap.error}`);
        }
        if (data.results?.importLessons?.error) {
          errorDetails.push(`Import: ${data.results.importLessons.error}`);
        }
        setSetupRoadmapSuccess(data.message || "Kurulum tamamlandı ancak bazı hatalar oluştu.");
        if (errorDetails.length > 0) {
          setSetupRoadmapError(errorDetails.join(" | "));
        }
      }
    } catch (err: any) {
      setSetupRoadmapError(err.message || "Bir hata oluştu");
    } finally {
      setSettingUpRoadmap(false);
    }
  };


  const handleCreateSingleLiveCoding = async () => {
    if (!liveCodingFormData.title || !liveCodingFormData.description || !liveCodingFormData.taskDescription) {
      setSingleLiveCodingError("Başlık, açıklama ve görev açıklaması zorunludur");
      return;
    }

    if (liveCodingFormData.languages.length === 0) {
      setSingleLiveCodingError("En az bir dil seçilmelidir");
      return;
    }

    setCreatingSingleLiveCoding(true);
    setSingleLiveCodingError(null);
    setSingleLiveCodingSuccess(null);

    try {
      const response = await fetch("/api/admin/create-live-coding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(liveCodingFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Canlı kodlama içeriği oluşturulurken bir hata oluştu");
      }

      setSingleLiveCodingSuccess(data.message || "Canlı kodlama içeriği başarıyla oluşturuldu.");
      
      // Reset form
      setLiveCodingFormData({
        title: "",
        description: "",
        level: "beginner",
        taskDescription: "",
        languages: [],
        timeLimitMinutes: 30,
        acceptanceCriteria: [],
        initialCode: {},
        expertise: "",
        topic: "",
        topicContent: "",
      });

      setTimeout(() => {
        setShowLiveCodingForm(false);
        setSingleLiveCodingSuccess(null);
      }, 2000);
    } catch (err: any) {
      setSingleLiveCodingError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingSingleLiveCoding(false);
    }
  };

  const toggleLanguage = (language: string) => {
    setLiveCodingFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const addAcceptanceCriteria = () => {
    setLiveCodingFormData((prev) => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, ""],
    }));
  };

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setLiveCodingFormData((prev) => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeAcceptanceCriteria = (index: number) => {
    setLiveCodingFormData((prev) => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index),
    }));
  };

  const handleImportLiveCoding = async () => {
    if (!confirm("JSON dosyasından C# canlı kodlama içeriklerini import etmek istediğinizden emin misiniz?")) {
      return;
    }

    setImportingLiveCoding(true);
    setImportLiveCodingError(null);
    setImportLiveCodingSuccess(null);
    setImportLiveCodingCount(null);

    try {
      const response = await fetch("/api/admin/import-live-coding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Canlı kodlama içerikleri import edilirken bir hata oluştu");
      }

      setImportLiveCodingSuccess(data.message || `${data.imported} adet canlı kodlama içeriği başarıyla import edildi.`);
      setImportLiveCodingCount(data.imported || 0);
    } catch (err: any) {
      setImportLiveCodingError(err.message || "Bir hata oluştu");
    } finally {
      setImportingLiveCoding(false);
    }
  };

  const handleCreateContentBatch = async () => {
    if (creatingContentBatch) {
      return;
    }

    if (!confirm("10 adet canlı kodlama ve 10 adet bugfix içeriği oluşturmak istediğinizden emin misiniz? Bu işlem mevcut içerikleri güncelleyebilir veya yeni içerikler ekleyebilir.")) {
      return;
    }

    setCreatingContentBatch(true);
    setContentBatchError(null);
    setContentBatchSuccess(null);
    setContentBatchCreated(null);

    try {
      const response = await fetch("/api/admin/create-content-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "İçerik oluşturulurken bir hata oluştu");
      }

      setContentBatchSuccess(data.message || `${data.liveCodingCreated} adet canlı kodlama ve ${data.bugfixCreated} adet bugfix içeriği başarıyla oluşturuldu.`);
      setContentBatchCreated({
        liveCoding: data.liveCodingCreated || 0,
        bugfix: data.bugfixCreated || 0,
      });
    } catch (err: any) {
      setContentBatchError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingContentBatch(false);
    }
  };

  const handleCreateHackathons = async () => {
    if (!confirm("Yakın tarihte geçmiş, gelecek ve devam eden hackathonlar oluşturmak istediğinizden emin misiniz? Bu işlem 9 adet hackathon oluşturacak.")) {
      return;
    }

    setCreatingHackathons(true);
    setHackathonsError(null);
    setHackathonsSuccess(null);
    setHackathonsCreated(null);

    try {
      const response = await fetch("/api/admin/seed-hackathons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hackathonlar oluşturulurken bir hata oluştu");
      }

      setHackathonsSuccess(data.message || `${data.created} adet hackathon başarıyla oluşturuldu.`);
      setHackathonsCreated(data.created || 0);
    } catch (err: any) {
      setHackathonsError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingHackathons(false);
    }
  };

  const handleCreateFreelancerRequests = async () => {
    if (!confirm("Freelancer projeleri oluşturmak istediğinizden emin misiniz? Bu işlem farklı durumlarda (açık, devam eden, tamamlanmış, iptal edilmiş) projeler oluşturacak.")) {
      return;
    }

    setCreatingFreelancerRequests(true);
    setFreelancerRequestsError(null);
    setFreelancerRequestsSuccess(null);
    setFreelancerRequestsCreated(null);

    try {
      const response = await fetch("/api/admin/seed-freelancer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Freelancer projeleri oluşturulurken bir hata oluştu");
      }

      setFreelancerRequestsSuccess(data.message || `${data.created} adet freelancer projesi başarıyla oluşturuldu.`);
      setFreelancerRequestsCreated(data.created || 0);
    } catch (err: any) {
      setFreelancerRequestsError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingFreelancerRequests(false);
    }
  };

  const handleCreateJobs = async () => {
    if (!confirm("Yakın tarihte paylaşılmış 10 detaylı iş ilanı oluşturmak istediğinizden emin misiniz? Bu işlem son 1-7 gün içinde paylaşılmış iş ilanları oluşturacak.")) {
      return;
    }

    setCreatingJobs(true);
    setJobsError(null);
    setJobsSuccess(null);
    setJobsCreated(null);

    try {
      const response = await fetch("/api/admin/seed-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "İş ilanları oluşturulurken bir hata oluştu");
      }

      setJobsSuccess(data.message || `${data.created} adet iş ilanı başarıyla oluşturuldu.`);
      setJobsCreated(data.created || 0);
    } catch (err: any) {
      setJobsError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingJobs(false);
    }
  };

  const handleCreateLeaderboardEntries = async () => {
    if (!confirm("10 günlük ve 10 aylık derece kazancı verisi oluşturmak istediğinizden emin misiniz? Bu işlem mevcut verileri güncelleyebilir veya yeni veriler ekleyebilir.")) {
      return;
    }

    setCreatingLeaderboardEntries(true);
    setLeaderboardEntriesError(null);
    setLeaderboardEntriesSuccess(null);
    setLeaderboardEntriesCreated(null);

    try {
      const response = await fetch("/api/admin/seed-leaderboard-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Derece kazancı verileri oluşturulurken bir hata oluştu");
      }

      setLeaderboardEntriesSuccess(data.message || `${data.dailyCreated} günlük ve ${data.monthlyCreated} aylık derece kazancı verisi başarıyla oluşturuldu.`);
      setLeaderboardEntriesCreated({ daily: data.dailyCreated || 0, monthly: data.monthlyCreated || 0 });
    } catch (err: any) {
      setLeaderboardEntriesError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingLeaderboardEntries(false);
    }
  };

  const handleCreateTests = async () => {
    if (!confirm("10 adet C# testi oluşturmak istediğinizden emin misiniz? Bu işlem mevcut testleri güncelleyebilir veya yeni testler ekleyebilir.")) {
      return;
    }

    setCreatingTests(true);
    setTestsError(null);
    setTestsSuccess(null);
    setTestsCreated(null);

    try {
      const response = await fetch("/api/admin/create-csharp-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Testler oluşturulurken bir hata oluştu");
      }

      setTestsSuccess(data.message || `${data.created} adet C# testi başarıyla oluşturuldu.`);
      setTestsCreated(data.created || 0);
    } catch (err: any) {
      setTestsError(err.message || "Bir hata oluştu");
    } finally {
      setCreatingTests(false);
    }
  };

  const successCount = modules.filter((m) => m.status === "success").length;
  const errorCount = modules.filter((m) => m.status === "error").length;
  const pendingCount = modules.filter((m) => m.status === "pending").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Admin Paneli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Seed data yönetimi ve sistem ayarları
          </p>
        </div>
      </div>

      {/* Seed Data Section */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Seed Data Yönetimi
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tüm modül içeriklerini, quizleri, konu anlatımlarını ve ders içeriklerini veritabanına yüklemek için aşağıdaki butona tıklayın.
          Bu işlem mevcut verileri güncelleyebilir veya yeni veriler ekleyebilir. Konu anlatımları ve ders içerikleri otomatik olarak ilgili modüllere eklenir.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {overallStatus === "success" && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Seed data başarıyla yüklendi! {successCount} modül işlendi.
                {topicsProcessed !== null && topicsProcessed > 0 && (
                  <span className="ml-2"> {topicsProcessed} konu anlatımı eklendi.</span>
                )}
                {lessonsProcessed !== null && lessonsProcessed > 0 && (
                  <span className="ml-2"> {lessonsProcessed} ders içeriği eklendi.</span>
                )}
                {lessonsFilled !== null && lessonsFilled > 0 && (
                  <span className="ml-2"> {lessonsFilled} ders içeriği dolduruldu.</span>
                )}
                {lessonsLimited !== null && lessonsLimited > 0 && (
                  <span className="ml-2"> {lessonsLimited} modülde ders sayısı 10&apos;a indirildi.</span>
                )}
              </span>
            </div>
          </div>
        )}

          <div className="flex gap-4 mb-6 flex-wrap">
            <Button
              onClick={handleSetupRoadmap}
              disabled={settingUpRoadmap}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold"
            >
              {settingUpRoadmap ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Kuruluyor...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  .NET Core Altyapı Kur
                </>
              )}
            </Button>
            <Button
              onClick={handleCreateContentBatch}
              disabled={creatingContentBatch}
              size="lg"
              id="BTNSeedCodingAndBugfix"
              data-testid="BTNSeedCodingAndBugfix"
              aria-label="10 adet canlı kodlama ve 10 adet bugfix içeriği oluştur"
              title="10 adet canlı kodlama ve 10 adet bugfix içeriği oluştur"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {creatingContentBatch ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-5 w-5" />
                  BTNSeedCodingAndBugfix
                </>
              )}
            </Button>
          <Button
            onClick={handleCreateHackathons}
            disabled={creatingHackathons}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {creatingHackathons ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-5 w-5" />
                Hackathon Seed Data Oluştur
              </>
            )}
          </Button>
          <Button
            onClick={handleCreateFreelancerRequests}
            disabled={creatingFreelancerRequests}
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
          >
            {creatingFreelancerRequests ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Freelancer Projeleri Oluştur
              </>
            )}
          </Button>
          <Button
            onClick={handleCreateJobs}
            disabled={creatingJobs}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            {creatingJobs ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Briefcase className="mr-2 h-5 w-5" />
                İş İlanları Ekle (10 Adet)
              </>
            )}
          </Button>
          <Button
            onClick={handleImportLiveCoding}
            disabled={importingLiveCoding}
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            {importingLiveCoding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Import Ediliyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                JSON&apos;dan Canlı Kodlama İçeriği İmport Et
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowLiveCodingForm(true)}
            disabled={showLiveCodingForm}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
          >
            <Plus className="mr-2 h-5 w-5" />
            Manuel Canlı Kodlama Ekle
          </Button>
          <Button
            onClick={handleCreateLeaderboardEntries}
            disabled={creatingLeaderboardEntries}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            {creatingLeaderboardEntries ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Derece Kazancı Verileri Ekle (10 Günlük + 10 Aylık)
              </>
            )}
          </Button>
          <Button
            onClick={handleCreateTests}
            disabled={creatingTests}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {creatingTests ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Code className="mr-2 h-5 w-5" />
                10 Test Oluştur
              </>
            )}
          </Button>
        </div>

        {clearSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{clearSuccess}</span>
            </div>
          </div>
        )}

        {clearError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{clearError}</span>
            </div>
          </div>
        )}

        {clearTopicsSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{clearTopicsSuccess}</span>
            </div>
          </div>
        )}

        {clearTopicsError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{clearTopicsError}</span>
            </div>
          </div>
        )}

        {roadmapSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{roadmapSuccess}</span>
            </div>
          </div>
        )}

        {roadmapError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{roadmapError}</span>
            </div>
          </div>
        )}

        {importLessonsSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{importLessonsSuccess}</span>
            </div>
          </div>
        )}

        {importLessonsError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{importLessonsError}</span>
            </div>
          </div>
        )}

        {setupRoadmapSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{setupRoadmapSuccess}</span>
            </div>
          </div>
        )}

        {setupRoadmapError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{setupRoadmapError}</span>
            </div>
          </div>
        )}

        {contentBatchSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {contentBatchSuccess}
                {contentBatchCreated && (
                  <span className="ml-2">
                    ({contentBatchCreated.liveCoding} canlı kodlama, {contentBatchCreated.bugfix} bugfix)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {contentBatchError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{contentBatchError}</span>
            </div>
          </div>
        )}

        {hackathonsSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {hackathonsSuccess}
                {hackathonsCreated !== null && hackathonsCreated > 0 && (
                  <span className="ml-2"> {hackathonsCreated} adet hackathon oluşturuldu.</span>
                )}
              </span>
            </div>
          </div>
        )}

        {hackathonsError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{hackathonsError}</span>
            </div>
          </div>
        )}

        {freelancerRequestsSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {freelancerRequestsSuccess}
                {freelancerRequestsCreated !== null && freelancerRequestsCreated > 0 && (
                  <span className="ml-2"> {freelancerRequestsCreated} adet proje oluşturuldu.</span>
                )}
              </span>
            </div>
          </div>
        )}

        {freelancerRequestsError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{freelancerRequestsError}</span>
            </div>
          </div>
        )}

        {jobsSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {jobsSuccess}
                {jobsCreated !== null && jobsCreated > 0 && (
                  <span className="ml-2"> {jobsCreated} adet iş ilanı oluşturuldu.</span>
                )}
              </span>
            </div>
          </div>
        )}

        {jobsError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{jobsError}</span>
            </div>
          </div>
        )}

        {leaderboardEntriesSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {leaderboardEntriesSuccess}
                {leaderboardEntriesCreated !== null && (
                  <span className="ml-2"> ({leaderboardEntriesCreated.daily} günlük, {leaderboardEntriesCreated.monthly} aylık veri oluşturuldu)</span>
                )}
              </span>
            </div>
          </div>
        )}

        {leaderboardEntriesError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{leaderboardEntriesError}</span>
            </div>
          </div>
        )}

        {testsSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {testsSuccess}
                {testsCreated !== null && testsCreated > 0 && (
                  <span className="ml-2"> {testsCreated} adet test oluşturuldu.</span>
                )}
              </span>
            </div>
          </div>
        )}

        {testsError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{testsError}</span>
            </div>
          </div>
        )}

        {/* Statistics */}
        {(successCount > 0 || errorCount > 0 || pendingCount > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Modül</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {modules.length}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">Başarılı</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {successCount}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
              <div className="text-sm text-red-600 dark:text-red-400 mb-1">Hatalı</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {errorCount}
              </div>
            </div>
          </div>
        )}

        {/* Module List */}
        {modules.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Modül Durumları
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {modules.map((module) => (
                <div
                  key={module.moduleId}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    {module.status === "loading" && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                    {module.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {module.status === "error" && (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    {module.status === "pending" && (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {module.title}
                    </span>
                  </div>
                  {module.error && (
                    <span className="text-xs text-red-600 dark:text-red-400">
                      {module.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {singleLiveCodingSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{singleLiveCodingSuccess}</span>
            </div>
          </div>
        )}

        {singleLiveCodingError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{singleLiveCodingError}</span>
            </div>
          </div>
        )}

        {importLiveCodingSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {importLiveCodingSuccess}
                {importLiveCodingCount !== null && importLiveCodingCount > 0 && (
                  <span className="ml-2"> {importLiveCodingCount} adet içerik import edildi.</span>
                )}
              </span>
            </div>
          </div>
        )}

        {importLiveCodingError && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{importLiveCodingError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Live Coding Form Modal */}
      {showLiveCodingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Yeni Canlı Kodlama İçeriği Ekle
              </h2>
              <button
                onClick={() => {
                  setShowLiveCodingForm(false);
                  setSingleLiveCodingError(null);
                  setSingleLiveCodingSuccess(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Başlık *"
                  placeholder="Örn: C# Array İşlemleri"
                  value={liveCodingFormData.title}
                  onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, title: e.target.value }))}
                  disabled={creatingSingleLiveCoding}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seviye *
                  </label>
                  <select
                    value={liveCodingFormData.level}
                    onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, level: e.target.value as any }))}
                    disabled={creatingSingleLiveCoding}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Başlangıç</option>
                    <option value="intermediate">Orta</option>
                    <option value="advanced">İleri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={liveCodingFormData.description}
                  onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, description: e.target.value }))}
                  disabled={creatingSingleLiveCoding}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Canlı kodlama içeriğinin genel açıklaması"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Görev Açıklaması *
                </label>
                <textarea
                  value={liveCodingFormData.taskDescription}
                  onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, taskDescription: e.target.value }))}
                  disabled={creatingSingleLiveCoding}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Öğrencinin yapması gereken görevin detaylı açıklaması"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Desteklenen Diller *
                </label>
                <div className="flex flex-wrap gap-2">
                  {["csharp", "python", "javascript", "java"].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      disabled={creatingSingleLiveCoding}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        liveCodingFormData.languages.includes(lang)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {lang === "csharp" ? "C#" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Zaman Limiti (dakika)"
                  type="number"
                  value={liveCodingFormData.timeLimitMinutes}
                  onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, timeLimitMinutes: parseInt(e.target.value) || 30 }))}
                  disabled={creatingSingleLiveCoding}
                />
                <Input
                  label="Uzmanlık"
                  placeholder="Örn: Backend"
                  value={liveCodingFormData.expertise}
                  onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, expertise: e.target.value }))}
                  disabled={creatingSingleLiveCoding}
                />
                <Input
                  label="Konu"
                  placeholder="Örn: .NET Core"
                  value={liveCodingFormData.topic}
                  onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, topic: e.target.value }))}
                  disabled={creatingSingleLiveCoding}
                />
              </div>

              <Input
                label="Konu İçeriği"
                placeholder="Örn: Collections"
                value={liveCodingFormData.topicContent}
                onChange={(e) => setLiveCodingFormData((prev) => ({ ...prev, topicContent: e.target.value }))}
                disabled={creatingSingleLiveCoding}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kabul Kriterleri
                  </label>
                  <Button
                    type="button"
                    onClick={addAcceptanceCriteria}
                    disabled={creatingSingleLiveCoding}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ekle
                  </Button>
                </div>
                <div className="space-y-2">
                  {liveCodingFormData.acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={criteria}
                        onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                        disabled={creatingSingleLiveCoding}
                        placeholder="Kabul kriteri"
                      />
                      <Button
                        type="button"
                        onClick={() => removeAcceptanceCriteria(index)}
                        disabled={creatingSingleLiveCoding}
                        variant="danger"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {liveCodingFormData.acceptanceCriteria.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Varsayılan kriterler kullanılacak. Özel kriter eklemek için yukarıdaki butona tıklayın.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3">
              <Button
                onClick={handleCreateSingleLiveCoding}
                disabled={creatingSingleLiveCoding}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                {creatingSingleLiveCoding ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Oluştur
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowLiveCodingForm(false);
                  setSingleLiveCodingError(null);
                  setSingleLiveCodingSuccess(null);
                }}
                disabled={creatingSingleLiveCoding}
                variant="outline"
              >
                İptal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

