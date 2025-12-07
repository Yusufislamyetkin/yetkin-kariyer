/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, DollarSign, Filter, X, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { getCompanyInfoForJob } from "@/lib/utils/job-company-helper";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  salary: string | null;
  createdAt: string;
  employer: {
    id: string;
    name: string | null;
  };
}

const TURKISH_CITIES = [
  "Tümü",
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Gaziantep",
  "Konya",
  "Kayseri",
  "Mersin",
  "Eskişehir",
  "Diyarbakır",
  "Samsun",
  "Denizli",
  "Şanlıurfa",
  "Malatya",
  "Kahramanmaraş",
  "Erzurum",
  "Van",
  "Batman",
  "Elazığ",
  "Uzaktan",
  "Hibrit",
];

const JOB_TYPES = [
  "Tümü",
  "Tam Zamanlı",
  "Yarı Zamanlı",
  "Uzaktan",
  "Hibrit",
  "Sözleşmeli",
  "Stajyer",
];

const EXPERIENCE_LEVELS = [
  "Tümü",
  "Stajyer",
  "Junior",
  "Mid Level",
  "Senior",
  "Lead",
  "Manager",
];

const SALARY_RANGES = [
  "Tümü",
  "0 - 10.000 TL",
  "10.000 - 20.000 TL",
  "20.000 - 30.000 TL",
  "30.000 - 50.000 TL",
  "50.000 - 75.000 TL",
  "75.000+ TL",
];

const CATEGORIES = [
  "Tümü",
  "Yazılım Geliştirme",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "Veri Bilimi",
  "Yapay Zeka",
  "Siber Güvenlik",
  "Tasarım",
  "Pazarlama",
  "Satış",
  "İnsan Kaynakları",
  "Finans",
  "Diğer",
];

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Tümü");
  const [jobType, setJobType] = useState("Tümü");
  const [experienceLevel, setExperienceLevel] = useState("Tümü");
  const [salaryRange, setSalaryRange] = useState("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [location, search, jobType, experienceLevel, salaryRange, category]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location && location !== "Tümü") params.append("location", location);
      if (jobType && jobType !== "Tümü") params.append("jobType", jobType);
      if (experienceLevel && experienceLevel !== "Tümü")
        params.append("experienceLevel", experienceLevel);
      if (salaryRange && salaryRange !== "Tümü")
        params.append("salaryRange", salaryRange);
      if (category && category !== "Tümü") params.append("category", category);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("Tümü");
    setJobType("Tümü");
    setExperienceLevel("Tümü");
    setSalaryRange("Tümü");
    setCategory("Tümü");
  };

  const hasActiveFilters =
    location !== "Tümü" ||
    jobType !== "Tümü" ||
    experienceLevel !== "Tümü" ||
    salaryRange !== "Tümü" ||
    category !== "Tümü" ||
    search !== "";

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full max-w-full">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            İş İlanları
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Size uygun iş fırsatlarını keşfedin
          </p>
        </div>
        <Link href="/jobs/applications">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ClipboardList className="h-5 w-5" />
            <span>Başvurularım</span>
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="İş ilanı, şirket veya pozisyon ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filtreler
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Filtreleri Temizle
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                {showFilters ? "Gizle" : "Göster"}
              </Button>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${
              showFilters ? "block" : "hidden md:grid"
            }`}
          >
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Lokasyon
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {TURKISH_CITIES.map((city) => (
                  <option key={city} value={city === "Tümü" ? "" : city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="h-4 w-4 inline mr-1" />
                İş Türü
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type === "Tümü" ? "" : type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deneyim Seviyesi
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level === "Tümü" ? "" : level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Maaş Aralığı
              </label>
              <select
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SALARY_RANGES.map((range) => (
                  <option key={range} value={range === "Tümü" ? "" : range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat === "Tümü" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {jobs.length}
          </span>{" "}
          ilan bulundu
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block"
          >
            <Card variant="elevated" hover className="transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
              <CardContent className="p-6 pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div className="flex-1 space-y-3">
                    {/* Header: Employer + New badge + Posted time */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <img 
                          src="/Photos/YtkCareerLogo/ytkncareer.jpeg" 
                          alt="YTK Career Logo" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Anlaşmalı İş İlanı : YTK Career
                        </span>
                        {/* Badges */}
                        {(() => {
                          const created = new Date(job.createdAt);
                          const now = new Date();
                          const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                          const isNew = diffDays <= 7;
                          return (
                            <>
                              {isNew && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                  Yeni
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {diffDays === 0 ? "Bugün" : `${diffDays} gün önce`}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight">
                      {job.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 pt-1">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{job.location}</span>
                        </span>
                      )}
                      {job.salary && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span>{job.salary}</span>
                        </span>
                      )}
                      {(() => {
                        const companyInfo = getCompanyInfoForJob(job.title);
                        return (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                            <span>{companyInfo.name}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right column: CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:min-w-[180px]">
                    <div className="hidden md:flex flex-col items-end text-right">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        İlan tarihi
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(job.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold inline-flex items-center gap-1">
                      Detayları Gör
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 12a.75.75 0 0 1 .75-.75h12.19l-3.72-3.72a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06-1.06l3.72-3.72H5.25A.75.75 0 0 1 4.5 12Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <Card variant="elevated">
          <CardContent className="!pt-12 pb-12 px-6 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              İlan bulunamadı
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Filtrelerinizi değiştirerek tekrar deneyin
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

