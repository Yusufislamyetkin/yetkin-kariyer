"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Search, ArrowLeft, User as UserIcon, Mail, Calendar, Shield, ChevronLeft, ChevronRight, Bot, Check } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  profileImage: string | null;
  isBot: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [converting, setConverting] = useState(false);

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
        params.append("role", role);
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

  const handleUserSelect = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    }
  };

  const handleConvertToBots = async () => {
    console.log("[BOT_CONVERT] Button clicked, selectedUsers:", selectedUsers.size);
    
    if (selectedUsers.size === 0) {
      alert("Lütfen en az bir kullanıcı seçin");
      return;
    }

    if (!confirm(`${selectedUsers.size} kullanıcıyı bot'a dönüştürmek istediğinizden emin misiniz?`)) {
      console.log("[BOT_CONVERT] User cancelled the operation");
      return;
    }

    setConverting(true);
    const userIds = Array.from(selectedUsers);
    console.log("[BOT_CONVERT] Starting conversion for users:", userIds);
    
    try {
      const response = await fetch("/api/admin/bots/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds,
          autoGenerateCharacter: true,
        }),
      });

      console.log("[BOT_CONVERT] Response status:", response.status);
      
      let data;
      try {
        data = await response.json();
        console.log("[BOT_CONVERT] Response data:", data);
      } catch (jsonError: any) {
        console.error("[BOT_CONVERT] Failed to parse JSON response:", jsonError);
        const text = await response.text();
        console.error("[BOT_CONVERT] Response text:", text);
        throw new Error("Sunucudan geçersiz yanıt alındı");
      }

      if (!response.ok) {
        const errorMessage = data?.error || `HTTP ${response.status}: Bot'a dönüştürme başarısız`;
        console.error("[BOT_CONVERT] API error:", errorMessage);
        throw new Error(errorMessage);
      }

      if (!data || !data.summary) {
        console.error("[BOT_CONVERT] Invalid response format:", data);
        throw new Error("Sunucudan beklenmeyen yanıt formatı alındı");
      }

      // Build detailed success message
      let successMessage = "";
      if (data.summary.successful > 0) {
        successMessage = `✅ ${data.summary.successful} kullanıcı başarıyla bot'a dönüştürüldü.`;
      }
      
      if (data.summary.failed > 0) {
        const failedMessage = `\n⚠️ ${data.summary.failed} kullanıcı için hata oluştu.`;
        successMessage += failedMessage;
        
        // Show detailed error information if available
        if (data.results && Array.isArray(data.results)) {
          const failedResults = data.results.filter((r: any) => !r.success);
          if (failedResults.length > 0) {
            const errorDetails = failedResults
              .map((r: any) => `\n  - ${r.userName || r.userId}: ${r.error || "Bilinmeyen hata"}`)
              .join("");
            successMessage += `\n\nHata detayları:${errorDetails}`;
          }
        }
      }

      if (data.summary.successful === 0 && data.summary.failed > 0) {
        // All failed
        throw new Error(successMessage.replace("✅", "").replace("⚠️", "❌"));
      }

      console.log("[BOT_CONVERT] Success:", successMessage);
      
      alert(successMessage);
      setSelectedUsers(new Set());
      
      // Refresh the user list to show updated bot status
      await fetchUsers(currentPage, search, roleFilter);
    } catch (error: any) {
      console.error("[BOT_CONVERT] Error occurred:", error);
      
      let errorMessage = "Bilinmeyen bir hata oluştu";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      // Provide more helpful error messages
      if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        errorMessage = "Ağ hatası: Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.";
      } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorMessage = "Yetkilendirme hatası: Bu işlem için admin yetkisi gereklidir.";
      } else if (errorMessage.includes("400")) {
        errorMessage = `Geçersiz istek: ${errorMessage}`;
      } else if (errorMessage.includes("500")) {
        errorMessage = "Sunucu hatası: Lütfen daha sonra tekrar deneyin veya sistem yöneticisine başvurun.";
      }
      
      alert(`❌ Hata: ${errorMessage}`);
    } finally {
      setConverting(false);
      console.log("[BOT_CONVERT] Conversion process completed");
    }
  };

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
                {/* Selection Actions */}
                {selectedUsers.size > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {selectedUsers.size} kullanıcı seçildi
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedUsers(new Set())}
                        variant="outline"
                        size="sm"
                      >
                        Seçimi Temizle
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("[BOT_CONVERT] Button clicked, selectedUsers:", selectedUsers.size, "converting:", converting);
                          if (!converting && selectedUsers.size > 0) {
                            handleConvertToBots();
                          }
                        }}
                        disabled={converting || selectedUsers.size === 0}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                      >
                        {converting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Dönüştürülüyor...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4 mr-2" />
                            Bot&apos;a Dönüştür
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Select All Button */}
                <div className="mb-4">
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    size="sm"
                  >
                    {selectedUsers.size === users.length ? "Tümünü Kaldır" : "Tümünü Seç"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`bg-white dark:bg-gray-900 rounded-xl border ${
                        selectedUsers.has(user.id)
                          ? "border-blue-500 ring-2 ring-blue-500"
                          : "border-gray-200 dark:border-gray-800"
                      } shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative`}
                    >
                      {/* Checkbox */}
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => handleUserSelect(user.id, e)}
                      >
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                            selectedUsers.has(user.id)
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selectedUsers.has(user.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>

                      <div
                        onClick={() => router.push(`/profile/${user.id}`)}
                        className="cursor-pointer"
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
                        {user.isBot && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            <Bot className="h-3.5 w-3.5" />
                            Bot
                          </span>
                        )}
                      </div>

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
    </div>
  );
}

