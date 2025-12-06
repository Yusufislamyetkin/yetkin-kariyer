"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Calendar, Users, TrendingUp, X, Clock, DollarSign as DollarSignIcon, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

interface FreelancerProject {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  deadline: string | null;
  status: string;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    role: string;
  };
  bids: Array<{
    id: string;
    status: string;
    user: {
      id: string;
      name: string | null;
    };
  }>;
}

export default function FreelancerProjectsPage() {
  const [projects, setProjects] = useState<FreelancerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [budgetRange, setBudgetRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== "all" 
        ? `/api/freelancer/projects?status=${statusFilter}`
        : "/api/freelancer/projects";
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      // Search filter
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      // Budget range filter
      let matchesBudget = true;
      if (budgetRange !== "all" && project.budget) {
        switch (budgetRange) {
          case "0-25000":
            matchesBudget = project.budget >= 0 && project.budget <= 25000;
            break;
          case "25000-50000":
            matchesBudget = project.budget > 25000 && project.budget <= 50000;
            break;
          case "50000-75000":
            matchesBudget = project.budget > 50000 && project.budget <= 75000;
            break;
          case "75000+":
            matchesBudget = project.budget > 75000;
            break;
        }
      } else if (budgetRange !== "all" && !project.budget) {
        matchesBudget = false;
      }

      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const projectDate = new Date(project.createdAt);
        const daysDiff = Math.floor((now.getTime() - projectDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            matchesDate = daysDiff === 0;
            break;
          case "week":
            matchesDate = daysDiff <= 7;
            break;
          case "month":
            matchesDate = daysDiff <= 30;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesBudget && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "budget-high":
          return (b.budget || 0) - (a.budget || 0);
        case "budget-low":
          return (a.budget || 0) - (b.budget || 0);
        case "deadline-soon":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "bids-high":
          return b.bids.length - a.bids.length;
        case "bids-low":
          return a.bids.length - b.bids.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, budgetRange, sortBy, dateFilter]);

  const hasActiveFilters =
    statusFilter !== "all" ||
    budgetRange !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest" ||
    searchTerm !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setBudgetRange("all");
    setDateFilter("all");
    setSortBy("newest");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Açık";
      case "in_progress":
        return "Devam Ediyor";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              Freelancer Projeleri
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">
              Proje taleplerini görüntüleyin ve teklif verin
            </p>
          </div>
          <Link href="/freelancer/applications" className="w-full sm:w-auto">
            <Button variant="gradient" size="md" className="w-full sm:w-auto">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden min-[400px]:inline">Başvurularım</span>
              <span className="min-[400px]:hidden">Başvurularım</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Proje ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base"
        />
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filtreler
              </h2>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Filtreleri Temizle</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-xs sm:text-sm px-2 sm:px-3"
              >
                {showFilters ? "Gizle" : "Göster"}
              </Button>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${
              showFilters ? "block" : "hidden md:grid"
            }`}
          >
            {/* Status Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                Durum
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="open">Açık</option>
                <option value="in_progress">Devam Ediyor</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>

            {/* Budget Range Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <DollarSignIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                Bütçe Aralığı
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Bütçeler</option>
                <option value="0-25000">0₺ - 25.000₺</option>
                <option value="25000-50000">25.000₺ - 50.000₺</option>
                <option value="50000-75000">50.000₺ - 75.000₺</option>
                <option value="75000+">75.000₺+</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                Tarih
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Tarihler</option>
                <option value="today">Bugün</option>
                <option value="week">Son 7 Gün</option>
                <option value="month">Son 30 Gün</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                Sıralama
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="budget-high">Bütçe (Yüksek → Düşük)</option>
                <option value="budget-low">Bütçe (Düşük → Yüksek)</option>
                <option value="deadline-soon">Yaklaşan Deadline</option>
                <option value="bids-high">Çok Teklif</option>
                <option value="bids-low">Az Teklif</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {filteredAndSortedProjects.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-8 sm:py-12 md:py-16 text-center px-4">
            <Users className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base sm:text-lg mb-2">
              {hasActiveFilters ? "Filtrelere uygun proje bulunamadı" : "Henüz proje yok"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-3 sm:mb-4">
              {hasActiveFilters ? "Filtreleri değiştirerek tekrar deneyin" : "İlk projeyi oluşturarak başlayın!"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} size="sm" className="text-xs sm:text-sm">
                <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filtreleri Temizle</span>
                <span className="sm:hidden">Temizle</span>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProjects.map((project) => (
            <Link key={project.id} href={`/freelancer/projects/${project.id}`}>
              <Card variant="elevated" hover className="h-full transition-all duration-300">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 flex-1 text-gray-900 dark:text-gray-100">
                      {project.title}
                    </CardTitle>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-5 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                    {project.budget && (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium">
                        <span>{project.budget.toLocaleString("tr-TR")} ₺</span>
                      </div>
                    )}
                    {project.deadline && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{new Date(project.deadline).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">{project.bids.length} teklif</span>
                    </div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 break-words">
                      <span className="font-medium">Oluşturan:</span> {project.creator.name || project.creator.email}
                    </p>
                    {(project.status === "in_progress" || project.status === "completed") && (
                      (() => {
                        const acceptedUsers = project.bids
                          .filter((b) => b.status === "accepted")
                          .map((b) => b.user.name || "İsimsiz Kullanıcı");
                        if (acceptedUsers.length === 0) return null;
                        return (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 break-words">
                            <span className="font-medium">Görev Alanlar:</span> {acceptedUsers.join(", ")}
                          </p>
                        );
                      })()
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

