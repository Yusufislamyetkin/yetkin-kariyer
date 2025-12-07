"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Search, ArrowLeft, User as UserIcon, Mail, Calendar, Shield, ChevronLeft, ChevronRight, Bot, Settings, Trash2, Play, Activity, CheckCircle2, XCircle, Clock, UserMinus, Trash, ChevronDown, Linkedin, Users, CheckSquare, Square, X, Wifi, WifiOff, Rocket } from "lucide-react";
import Image from "next/image";
import { BotConfigModal } from "./_components/BotConfigModal";
import { LinkedInPostGenerator } from "./_components/LinkedInPostGenerator";
import { AddToCommunitiesModal } from "./_components/AddToCommunitiesModal";
import { HackathonApplicationModal } from "./_components/HackathonApplicationModal";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface BotCharacter {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  expertise: string[];
}

interface BotConfiguration {
  id?: string;
  isActive: boolean;
  minPostsPerDay: number;
  maxPostsPerDay: number;
  minCommentsPerDay: number;
  maxCommentsPerDay: number;
  minLikesPerDay: number;
  maxLikesPerDay: number;
  minTestsPerWeek: number;
  maxTestsPerWeek: number;
  minLiveCodingPerWeek: number;
  maxLiveCodingPerWeek: number;
  minBugFixPerWeek: number;
  maxBugFixPerWeek: number;
  minLessonsPerWeek: number;
  maxLessonsPerWeek: number;
  minChatMessagesPerDay: number;
  maxChatMessagesPerDay: number;
  activityHours: number[];
  lastActivityAt?: string | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  profileImage: string | null;
  isBot: boolean;
  createdAt: string;
  updatedAt: string;
  botCharacter: BotCharacter | null;
  botConfiguration: BotConfiguration | null;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [botConfigModalOpen, setBotConfigModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [runningBots, setRunningBots] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [showInteractions, setShowInteractions] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [removingAllBots, setRemovingAllBots] = useState(false);
  const [clearingActivities, setClearingActivities] = useState(false);
  const [removeAllBotsConfirmOpen, setRemoveAllBotsConfirmOpen] = useState(false);
  const [clearActivitiesConfirmOpen, setClearActivitiesConfirmOpen] = useState(false);
  const [activityDropdownOpen, setActivityDropdownOpen] = useState<string | null>(null);
  const [executingActivity, setExecutingActivity] = useState<string | null>(null);
  const [linkedInPostGeneratorOpen, setLinkedInPostGeneratorOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [addToCommunitiesModalOpen, setAddToCommunitiesModalOpen] = useState(false);
  const [randomActivityModalOpen, setRandomActivityModalOpen] = useState(false);
  const [randomActivityCount, setRandomActivityCount] = useState<string>("");
  const [randomActivityRunning, setRandomActivityRunning] = useState(false);
  const [hackathonApplicationModalOpen, setHackathonApplicationModalOpen] = useState(false);
  const [keepOnlineModalOpen, setKeepOnlineModalOpen] = useState(false);
  const [keepOnlineDuration, setKeepOnlineDuration] = useState<string>("4");
  const [keepOnlineRunning, setKeepOnlineRunning] = useState(false);
  const [activeKeepOnlineJobs, setActiveKeepOnlineJobs] = useState<any[]>([]);
  const [keepOnlineJobsLoading, setKeepOnlineJobsLoading] = useState(false);

  const fetchUsers = async (page: number = 1, searchQuery: string = "", role: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (role) {
        if (role === "bot") {
          params.append("isBot", "true");
        } else {
          params.append("role", role);
        }
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Kullanıcılar alınırken bir hata oluştu");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search, roleFilter);
  }, [currentPage, search, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "candidate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "employer":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleBotAssign = (user: User) => {
    setSelectedUser(user);
    setBotConfigModalOpen(true);
  };

  const handleBotConfigUpdate = async () => {
    await fetchUsers(currentPage, search, roleFilter);
    setBotConfigModalOpen(false);
    setSelectedUser(null);
  };

  const handleBotRemove = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/bot`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bot ataması kaldırılırken bir hata oluştu");
      }

      await fetchUsers(currentPage, search, roleFilter);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteConfirm = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleRunBots = async () => {
    setRunningBots(true);
    setRunResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/bots/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipHourCheck: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Botlar çalıştırılırken bir hata oluştu");
      }

      setRunResult(data);
      
      // Refresh activities if interactions area is open
      if (showInteractions) {
        fetchActivities();
      }
      
      // Refresh users to show updated bot statuses
      fetchUsers(currentPage, search, roleFilter);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setRunningBots(false);
    }
  };

  const fetchActivities = async (page: number = 1) => {
    setActivitiesLoading(true);
    try {
      const limit = 50;
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/admin/bots/activities?limit=${limit}&offset=${offset}`);

      if (!response.ok) {
        throw new Error("Aktiviteler alınırken bir hata oluştu");
      }

      const data = await response.json();
      if (page === 1) {
        setActivities(data.activities || []);
      } else {
        setActivities((prev) => [...prev, ...(data.activities || [])]);
      }
      setActivitiesPage(page);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    if (showInteractions) {
      fetchActivities(1);
    }
  }, [showInteractions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".activity-dropdown-container")) {
        setActivityDropdownOpen(null);
      }
    };

    if (activityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activityDropdownOpen]);

  const handleRemoveAllBots = async () => {
    setRemovingAllBots(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bots/remove-all", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Botlar geri çekilirken bir hata oluştu");
      }

      // Refresh users list
      await fetchUsers(currentPage, search, roleFilter);
      
      // Show success message
      setRunResult({
        processed: data.removed,
        successful: data.removed,
        failed: 0,
        message: data.message,
      });

      setRemoveAllBotsConfirmOpen(false);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setRemovingAllBots(false);
    }
  };

  const handleClearActivities = async () => {
    setClearingActivities(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bots/activities/clear", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bot aktiviteleri temizlenirken bir hata oluştu");
      }

      // Refresh activities if interactions area is open
      if (showInteractions) {
        await fetchActivities(1);
      }

      // Show success message
      setRunResult({
        processed: 0,
        successful: 0,
        failed: 0,
        message: data.message,
      });

      setClearActivitiesConfirmOpen(false);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setClearingActivities(false);
    }
  };

  const handleExecuteActivity = async (botId: string, activityType: string) => {
    setExecutingActivity(`${botId}-${activityType}`);
    setActivityDropdownOpen(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bots/${botId}/execute-activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Aktivite çalıştırılırken bir hata oluştu");
      }

      // Show success message
      setRunResult({
        processed: 1,
        successful: data.success ? 1 : 0,
        failed: data.success ? 0 : 1,
        message: data.message || `${activityType} aktivitesi başarıyla çalıştırıldı`,
        botName: data.botName,
        activityType: data.activityType,
      });

      // Refresh activities if interactions area is open
      if (showInteractions) {
        await fetchActivities(1);
      }

      // Refresh users to show updated bot statuses
      await fetchUsers(currentPage, search, roleFilter);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setExecutingActivity(null);
    }
  };

  const handleBulkBotAssign = async () => {
    if (selectedUserIds.size === 0) {
      setError("Lütfen en az bir kullanıcı seçin");
      return;
    }

    setActionLoading("bulk-bot-assign");
    setError(null);

    try {
      const response = await fetch("/api/admin/users/bulk-assign-bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUserIds),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Toplu bot atama sırasında bir hata oluştu");
      }

      // Show success message
      setRunResult({
        processed: data.total || selectedUserIds.size,
        successful: data.successful || 0,
        failed: data.failed || 0,
        message: data.message || `${data.successful} kullanıcı bot olarak atandı`,
      });

      // Clear selection
      setSelectedUserIds(new Set());

      // Refresh users to show updated bot statuses
      await fetchUsers(currentPage, search, roleFilter);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRandomActivity = async () => {
    const count = parseInt(randomActivityCount);
    if (!count || count <= 0) {
      setError("Lütfen geçerli bir sayı girin");
      return;
    }

    setRandomActivityRunning(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bots/random-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rastgele aktivite başlatılırken bir hata oluştu");
      }

      // Show success message
      setRunResult({
        processed: data.total || count,
        successful: data.successful || 0,
        failed: data.failed || 0,
        message: data.message || `${data.successful} bot rastgele aktivite gerçekleştirdi`,
        results: data.results,
      });

      // Close modal and reset
      setRandomActivityModalOpen(false);
      setRandomActivityCount("");

      // Refresh activities if interactions area is open
      if (showInteractions) {
        await fetchActivities(1);
      }

      // Refresh users to show updated bot statuses
      await fetchUsers(currentPage, search, roleFilter);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setRandomActivityRunning(false);
    }
  };

  const fetchActiveKeepOnlineJobs = async () => {
    setKeepOnlineJobsLoading(true);
    try {
      const response = await fetch("/api/admin/bots/keep-online");

      if (!response.ok) {
        throw new Error("Aktif job'lar alınırken bir hata oluştu");
      }

      const data = await response.json();
      setActiveKeepOnlineJobs(data.jobs || []);
    } catch (err: any) {
      console.error("Error fetching active keep-online jobs:", err);
    } finally {
      setKeepOnlineJobsLoading(false);
    }
  };

  const handleKeepOnline = async () => {
    if (selectedUserIds.size === 0) {
      setError("Lütfen en az bir bot seçin");
      return;
    }

    const duration = parseFloat(keepOnlineDuration);
    if (!duration || duration < 1 || duration > 24) {
      setError("Lütfen 1-24 saat arasında bir süre girin");
      return;
    }

    setKeepOnlineRunning(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bots/keep-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUserIds),
          durationHours: duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bot'ları çevrimiçi tutma işlemi başlatılırken bir hata oluştu");
      }

      // Show success message
      setRunResult({
        processed: selectedUserIds.size,
        successful: selectedUserIds.size,
        failed: 0,
        message: data.message || `${selectedUserIds.size} bot ${duration} saat boyunca çevrimiçi tutulacak`,
        results: [],
      });

      // Close modal
      setKeepOnlineModalOpen(false);

      // Refresh active jobs
      await fetchActiveKeepOnlineJobs();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setKeepOnlineRunning(false);
    }
  };

  const handleStopKeepOnlineJob = async (jobId: string) => {
    try {
      const response = await fetch("/api/admin/bots/keep-online", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Job durdurulurken bir hata oluştu");
      }

      // Refresh active jobs
      await fetchActiveKeepOnlineJobs();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
  };

  const activityTypes = [
    { value: "POST", label: "Post Oluştur" },
    { value: "COMMENT", label: "Yorum Yap" },
    { value: "LIKE", label: "Beğen" },
    { value: "TEST", label: "Test Çöz" },
    { value: "LIVE_CODING", label: "Live Coding" },
    { value: "BUG_FIX", label: "Bug Fix" },
    { value: "LESSON", label: "Ders Tamamla" },
    { value: "CHAT", label: "Topluluğa Katıl" },
  ];


  return (
    <div className="space-y-6 animate-fade-in min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  👥 Tüm Kullanıcılar
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Sistemdeki tüm kullanıcı hesaplarını görüntüleyin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {pagination && (
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pagination.totalCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Toplam Kullanıcı
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={() => setLinkedInPostGeneratorOpen(true)}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn Post Oluştur
                </Button>
                <Button
                  onClick={() => setRandomActivityModalOpen(true)}
                  variant="outline"
                  className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Rastgele Aktivite
                </Button>
                {selectedUserIds.size > 0 && (
                  <Button
                    onClick={() => setKeepOnlineModalOpen(true)}
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/30"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Çevrimiçi Tut ({selectedUserIds.size})
                  </Button>
                )}
                <Button
                  onClick={handleRunBots}
                  disabled={runningBots}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {runningBots ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Çalıştırılıyor...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Botları Çalıştır
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setRemoveAllBotsConfirmOpen(true)}
                  disabled={removingAllBots || runningBots}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  {removingAllBots ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Geri Çekiliyor...
                    </>
                  ) : (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Tüm Botları Geri Çek
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setClearActivitiesConfirmOpen(true)}
                  disabled={clearingActivities || runningBots}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
                >
                  {clearingActivities ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Temizleniyor...
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4 mr-2" />
                      Aktiviteleri Temizle
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="İsim veya email ile ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" size="lg" className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Ara
            </Button>
          </form>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleRoleFilter("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => handleRoleFilter("admin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "admin"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleFilter("candidate")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "candidate"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => handleRoleFilter("employer")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "employer"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Employer
            </button>
            <button
              onClick={() => {
                const currentIsBot = roleFilter === "bot";
                handleRoleFilter(currentIsBot ? "" : "bot");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "bot"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Botlar
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Run Result */}
        {runResult && (
          <div className={`${
            runResult.successful > 0 && runResult.failed === 0
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
              : runResult.failed > 0
              ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
              : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
          } border rounded-lg p-4 mb-6`}>
            <div className="flex items-start gap-3">
              {runResult.successful > 0 && runResult.failed === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  runResult.successful > 0 && runResult.failed === 0
                    ? "text-green-900 dark:text-green-100"
                    : "text-yellow-900 dark:text-yellow-100"
                }`}>
                  {runResult.botName && runResult.activityType
                    ? `${runResult.botName} - ${runResult.activityType} Aktivitesi`
                    : "Botlar Başarıyla Çalıştırıldı"}
                </h3>
                <p className={`text-sm ${
                  runResult.successful > 0 && runResult.failed === 0
                    ? "text-green-700 dark:text-green-300"
                    : "text-yellow-700 dark:text-yellow-300"
                }`}>
                  {runResult.message || (
                    <>
                      {runResult.processed} bot işlendi • {runResult.successful} başarılı • {runResult.failed} başarısız
                      {runResult.skipped > 0 && ` • ${runResult.skipped} atlandı`}
                    </>
                  )}
                </p>
                {runResult.results && runResult.results.length > 0 && (
                  <div className={`mt-2 text-xs ${
                    runResult.successful > 0 && runResult.failed === 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}>
                    Toplam aktivite: {runResult.results.reduce((sum: number, r: any) => sum + (r.totalActivities || 0), 0)}
                  </div>
                )}
              </div>
              <button
                onClick={() => setRunResult(null)}
                className={`${
                  runResult.successful > 0 && runResult.failed === 0
                    ? "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    : "text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
                }`}
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* User Selection Controls */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowInteractions(!showInteractions)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Activity className="h-4 w-4 mr-2" />
              {showInteractions ? "Etkileşim Alanını Gizle" : "🤖 Bot Etkileşimleri"}
            </Button>
            {selectedUserIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUserIds.size} kullanıcı seçili
                </span>
                <Button
                  onClick={() => setSelectedUserIds(new Set())}
                  variant="outline"
                  size="sm"
                >
                  Temizle
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (selectedUserIds.size === users.length) {
                  setSelectedUserIds(new Set());
                } else {
                  setSelectedUserIds(new Set(users.map(u => u.id)));
                }
              }}
              variant="outline"
              size="sm"
            >
              {selectedUserIds.size === users.length ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Tümünü Kaldır
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tümünü Seç
                </>
              )}
            </Button>
            <Button
              onClick={() => setAddToCommunitiesModalOpen(true)}
              disabled={selectedUserIds.size === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Topluluklara Ekle ({selectedUserIds.size})
            </Button>
            <Button
              onClick={() => setHackathonApplicationModalOpen(true)}
              disabled={selectedUserIds.size === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Hackathon&apos;a Başvur ({selectedUserIds.size})
            </Button>
            <Button
              onClick={handleBulkBotAssign}
              disabled={selectedUserIds.size === 0 || actionLoading !== null}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {actionLoading === "bulk-bot-assign" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atanıyor...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Bot Olarak Ata ({selectedUserIds.size})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Interactions Area */}
        {showInteractions && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  🤖 Bot Etkileşimleri
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Bot aktivitelerinin gerçek zamanlı listesi
                </p>
              </div>
              <Button
                onClick={() => fetchActivities(1)}
                variant="outline"
                size="sm"
                disabled={activitiesLoading}
              >
                {activitiesLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Yenile"
                )}
              </Button>
            </div>

            {activitiesLoading && activities.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Henüz bot aktivitesi bulunmuyor
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {activity.botProfileImage ? (
                        <Image
                          src={activity.botProfileImage}
                          alt={activity.botName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {activity.botName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            activity.success
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {activity.activityType}
                        </span>
                        {activity.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      {activity.targetTitle && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                          {activity.targetTitle}
                        </p>
                      )}
                      {activity.errorMessage && (
                        <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                          Hata: {activity.errorMessage}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(activity.executedAt).toLocaleString("tr-TR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activities.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => fetchActivities(activitiesPage + 1)}
                  variant="outline"
                  disabled={activitiesLoading}
                >
                  {activitiesLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    "Daha Fazla Yükle"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Users List */}
        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-12 text-center">
                <UserIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Kullanıcı bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Arama kriterlerinize uygun kullanıcı bulunmuyor.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible group relative"
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 right-3 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newSelected = new Set(selectedUserIds);
                            if (newSelected.has(user.id)) {
                              newSelected.delete(user.id);
                            } else {
                              newSelected.add(user.id);
                            }
                            setSelectedUserIds(newSelected);
                          }}
                          className={`p-1.5 rounded-lg shadow-md hover:shadow-lg transition-all ${
                            selectedUserIds.has(user.id)
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                          }`}
                          title={selectedUserIds.has(user.id) ? "Seçimi Kaldır" : "Seç"}
                        >
                          {selectedUserIds.has(user.id) ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Bot Badge */}
                      {user.isBot && (
                        <div className="absolute top-3 right-12 z-10">
                          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg">
                            <Bot className="h-3 w-3" />
                            <span>Bot</span>
                          </div>
                        </div>
                      )}

                      {/* Bot Actions */}
                      {user.isBot && (
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBotAssign(user);
                            }}
                            className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
                            title="Bot Yapılandırması"
                          >
                            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteConfirm(user.id);
                            }}
                            className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
                            title="Bot Atamasını Kaldır"
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 text-gray-600 dark:text-gray-300 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </button>
                        </div>
                      )}

                      <div
                        onClick={() => router.push(`/profile/${user.id}`)}
                        className="cursor-pointer overflow-visible"
                      >
                    {/* Profile Image Section */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center p-6">
                      <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* User Info Section */}
                    <div className="p-5">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {user.name || "İsimsiz Kullanıcı"}
                      </h3>

                      {/* Email */}
                      <div className="flex items-start gap-2 mb-3">
                        <Mail className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all line-clamp-2">
                          {user.email}
                        </p>
                      </div>

                      {/* Role Badge */}
                      <div className="mb-3 flex gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <Shield className="h-3.5 w-3.5" />
                          {user.role === "admin" ? "Admin" : user.role === "candidate" ? "Aday" : "İşveren"}
                        </span>
                      </div>

                      {/* Bot Assignment Button */}
                      {!user.isBot && (
                        <div className="mb-3">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBotAssign(user);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Bot className="h-4 w-4 mr-2" />
                            Bot Olarak Ata
                          </Button>
                        </div>
                      )}

                      {/* Bot Status */}
                      {user.isBot && user.botConfiguration && (
                        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                            <span
                              className={`font-semibold ${
                                user.botConfiguration.isActive
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {user.botConfiguration.isActive ? "Aktif" : "Pasif"}
                            </span>
                          </div>
                          {user.botConfiguration.lastActivityAt && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Son aktivite: {formatDate(user.botConfiguration.lastActivityAt)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bot Activity Runner */}
                      {user.isBot && user.botConfiguration?.isActive && (
                        <div className="mb-3 relative activity-dropdown-container overflow-visible">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivityDropdownOpen(
                                activityDropdownOpen === user.id ? null : user.id
                              );
                            }}
                            disabled={executingActivity?.startsWith(user.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="flex items-center gap-2">
                              {executingActivity?.startsWith(user.id) ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Çalıştırılıyor...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  <span>Aktivite Çalıştır</span>
                                </>
                              )}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                activityDropdownOpen === user.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {activityDropdownOpen === user.id && (
                            <div className="absolute z-[100] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                              {activityTypes.map((activity) => (
                                <button
                                  key={activity.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExecuteActivity(user.id, activity.value);
                                  }}
                                  disabled={executingActivity?.startsWith(user.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {activity.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Calendar className="h-4 w-4" />
                        <span className="line-clamp-1">{formatDate(user.createdAt)}</span>
                      </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-4 mt-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sayfa {pagination.page} / {pagination.totalPages} ({pagination.totalCount} kullanıcı)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Önceki
                  </Button>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNext}
                    variant="outline"
                    size="sm"
                  >
                    Sonraki
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bot Config Modal */}
      {selectedUser && (
        <BotConfigModal
          isOpen={botConfigModalOpen}
          onClose={() => {
            setBotConfigModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id}
          userName={selectedUser.name}
          existingConfig={
            selectedUser.isBot
              ? {
                  botCharacter: selectedUser.botCharacter,
                  botConfiguration: selectedUser.botConfiguration,
                }
              : undefined
          }
          onSuccess={handleBotConfigUpdate}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Bot Atamasını Kaldır"
        message="Bu kullanıcının bot atamasını kaldırmak istediğinizden emin misiniz? Bot yapılandırması pasif hale getirilecek."
        confirmText="Kaldır"
        cancelText="İptal"
        confirmVariant="danger"
        onConfirm={() => {
          if (userToDelete) {
            handleBotRemove(userToDelete);
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
      />

      {/* Remove All Bots Confirm Dialog */}
      <ConfirmDialog
        isOpen={removeAllBotsConfirmOpen}
        title="Tüm Botları Geri Çek"
        message="Tüm botları geri çekmek istediğinizden emin misiniz? Bu işlem tüm bot atamalarını kaldıracak ve bot yapılandırmalarını pasif hale getirecektir. Bu işlem geri alınamaz."
        confirmText="Evet, Tümünü Geri Çek"
        cancelText="İptal"
        confirmVariant="danger"
        onConfirm={handleRemoveAllBots}
        onCancel={() => {
          setRemoveAllBotsConfirmOpen(false);
        }}
      />

      {/* Clear Activities Confirm Dialog */}
      <ConfirmDialog
        isOpen={clearActivitiesConfirmOpen}
        title="Tüm Bot Aktivitelerini Temizle"
        message="Tüm bot aktivitelerini temizlemek istediğinizden emin misiniz? Bu işlem tüm bot aktivite kayıtlarını kalıcı olarak silecektir. Bu işlem geri alınamaz."
        confirmText="Evet, Temizle"
        cancelText="İptal"
        confirmVariant="danger"
        onConfirm={handleClearActivities}
        onCancel={() => {
          setClearActivitiesConfirmOpen(false);
        }}
      />

      {/* LinkedIn Post Generator Modal */}
      <LinkedInPostGenerator
        isOpen={linkedInPostGeneratorOpen}
        onClose={() => setLinkedInPostGeneratorOpen(false)}
        users={users}
      />

      {/* Add to Communities Modal */}
      <AddToCommunitiesModal
        isOpen={addToCommunitiesModalOpen}
        onClose={() => {
          setAddToCommunitiesModalOpen(false);
          setSelectedUserIds(new Set());
        }}
        userIds={Array.from(selectedUserIds)}
        onSuccess={() => {
          // Refresh users list after successful addition
          fetchUsers(currentPage, search, roleFilter);
          setSelectedUserIds(new Set());
        }}
      />

      {/* Hackathon Application Modal */}
      <HackathonApplicationModal
        isOpen={hackathonApplicationModalOpen}
        onClose={() => {
          setHackathonApplicationModalOpen(false);
        }}
        userIds={Array.from(selectedUserIds)}
        onSuccess={() => {
          // Refresh users list after successful application
          fetchUsers(currentPage, search, roleFilter);
        }}
      />

      {/* Keep Online Modal */}
      {keepOnlineModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setKeepOnlineModalOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
                  <Wifi className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Botları Çevrimiçi Tut
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seçili bot&apos;ları belirli süre boyunca çevrimiçi göster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setKeepOnlineModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={keepOnlineRunning}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* New Job Form */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Yeni Çevrimiçi Tutma İşlemi
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Süre (Saat) *
                  </label>
                  <input
                    type="number"
                    value={keepOnlineDuration}
                    onChange={(e) => setKeepOnlineDuration(e.target.value)}
                    placeholder="4"
                    min="1"
                    max="24"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    disabled={keepOnlineRunning}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Bot&apos;lar kaç saat boyunca çevrimiçi tutulacak? (1-24 saat)
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Seçili Bot Sayısı:</strong> {selectedUserIds.size}
                    <br />
                    <strong>Nasıl çalışır?</strong> Seçili bot&apos;lar belirtilen süre boyunca çevrimiçi görünecek. 
                    Mevcut chat presence heartbeat sistemi kullanılarak otomatik güncellenir.
                  </p>
                </div>
                <Button
                  onClick={handleKeepOnline}
                  disabled={keepOnlineRunning || selectedUserIds.size === 0 || !keepOnlineDuration || parseFloat(keepOnlineDuration) < 1}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {keepOnlineRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Başlatılıyor...
                    </>
                  ) : (
                    <>
                      <Wifi className="h-4 w-4 mr-2" />
                      Başlat
                    </>
                  )}
                </Button>
              </div>

              {/* Active Jobs List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Aktif İşlemler
                  </h3>
                  <Button
                    onClick={fetchActiveKeepOnlineJobs}
                    variant="outline"
                    size="sm"
                    disabled={keepOnlineJobsLoading}
                  >
                    {keepOnlineJobsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Yenile"
                    )}
                  </Button>
                </div>

                {activeKeepOnlineJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <WifiOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz aktif işlem yok</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeKeepOnlineJobs.map((job) => (
                      <div
                        key={job.jobId}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Wifi className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {job.userIds.length} Bot
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <p>
                                <strong>Başlangıç:</strong>{" "}
                                {new Date(job.startTime).toLocaleString("tr-TR")}
                              </p>
                              <p>
                                <strong>Bitiş:</strong>{" "}
                                {new Date(job.endTime).toLocaleString("tr-TR")}
                              </p>
                              <p className="text-green-600 dark:text-green-400">
                                <strong>Kalan Süre:</strong>{" "}
                                {job.remainingHours.toFixed(1)} saat
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleStopKeepOnlineJob(job.jobId)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                          >
                            <WifiOff className="h-4 w-4 mr-2" />
                            Durdur
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={() => {
                  setKeepOnlineModalOpen(false);
                  setKeepOnlineDuration("4");
                }}
                disabled={keepOnlineRunning}
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Random Activity Modal */}
      {randomActivityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRandomActivityModalOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Rastgele Bot Aktivitesi
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rastgele botlara rastgele aktivite yaptır
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRandomActivityModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={randomActivityRunning}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bot Sayısı *
                </label>
                <input
                  type="number"
                  value={randomActivityCount}
                  onChange={(e) => setRandomActivityCount(e.target.value)}
                  placeholder="Örn: 36"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={randomActivityRunning}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Kaç bot rastgele aktivite gerçekleştirecek?
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Nasıl çalışır?</strong>
                  <br />
                  Aktif botlardan belirtilen sayıda rastgele seçilir ve her birine rastgele bir aktivite atanır (Post, Yorum, Beğeni, Test, vb.).
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={() => {
                  setRandomActivityModalOpen(false);
                  setRandomActivityCount("");
                }}
                disabled={randomActivityRunning}
              >
                İptal
              </Button>
              <Button
                onClick={handleRandomActivity}
                disabled={randomActivityRunning || !randomActivityCount || parseInt(randomActivityCount) <= 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {randomActivityRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Çalıştırılıyor...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Başlat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

