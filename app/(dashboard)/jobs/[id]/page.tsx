/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clipboard,
  MapPin,
  Wallet,
  Building,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: any;
  location: string | null;
  salary: string | null;
  employer: {
    id: string;
    name: string | null;
  };
}

interface CV {
  id: string;
  data: any;
}

interface JobMatchAnalysis {
  matchScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  nextSteps: string[];
  keywords: Array<{ term: string; matched: boolean; note?: string }>;
  coverLetter: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedCV, setSelectedCV] = useState("");
  const [matchAnalysis, setMatchAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchJob();
      fetchCVs();
    }
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();
      setJob(data.job);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCVs = async () => {
    try {
      const response = await fetch("/api/cv");
      const data = await response.json();
      setCvs(data.cvs || []);
      if (data.cvs && data.cvs.length > 0) {
        setSelectedCV(data.cvs[0].id);
      }
    } catch (error) {
      console.error("Error fetching CVs:", error);
    }
  };

  const handleApply = async () => {
    if (!selectedCV) {
      alert("Lütfen bir CV seçin");
      return;
    }

    setApplying(true);
    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: params.id,
          cvId: selectedCV,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Başvurunuz başarıyla gönderildi!");
        router.push("/jobs/applications");
      } else {
        alert(data.error || "Başvuru yapılırken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error applying:", error);
      alert("Başvuru yapılırken bir hata oluştu");
    } finally {
      setApplying(false);
    }
  };

  const handleAnalyzeMatch = async () => {
    if (!selectedCV) {
      alert("Lütfen bir CV seçin");
      return;
    }

    setMatchLoading(true);
    setMatchError(null);
    setCopied(false);
    try {
      const response = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: params.id,
          cvId: selectedCV,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI iş uyumu analizi başarısız oldu");
      }

      setMatchAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing job match:", error);
      setMatchError(
        error instanceof Error ? error.message : "AI analizi gerçekleştirilemedi."
      );
    } finally {
      setMatchLoading(false);
    }
  };

  const handleCopyCoverLetter = async () => {
    if (!matchAnalysis?.coverLetter) return;
    try {
      await navigator.clipboard.writeText(matchAnalysis.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying cover letter:", error);
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[300px] items-center justify-center text-gray-600 dark:text-gray-300">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
            <span>İlan yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="elevated">
          <CardContent className="py-12 text-center text-gray-600 dark:text-gray-400">
            İlan bulunamadı.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {job.employer.name || "İşveren"}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            {job.location && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-200">
                <Wallet className="h-4 w-4" />
                {job.salary}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <Building className="h-4 w-4" />
              {job.employer.name || "İşveren"}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Açıklama
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Gereksinimler
            </h2>
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
              {typeof job.requirements === "string" ? (
                <p>{job.requirements}</p>
              ) : (
                <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(job.requirements, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Başvuru ve AI Uyum Analizi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cvs.length > 0 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kullanmak istediğiniz CV
                </label>
                <select
                  value={selectedCV}
                  onChange={(e) => setSelectedCV(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-100"
                >
                  {cvs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.data?.personalInfo?.name || "CV"} - {cv.id.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex items-center gap-2"
                >
                  {applying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Başvuru yapılıyor...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Başvur
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAnalyzeMatch}
                  disabled={matchLoading}
                  className="flex items-center gap-2"
                >
                  {matchLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI Uyum Analizi
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-5 text-sm text-yellow-800 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-200">
              Başvuru yapabilmek için önce bir CV oluşturmanız gerekiyor.
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/cv/templates")}
              >
                CV Oluştur
              </Button>
            </div>
          )}

          {matchError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {matchError}
            </div>
          )}

          {matchAnalysis && (
            <div className="space-y-6">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    Uyum Skoru
                  </div>
                  <div className="text-3xl font-display font-bold">
                    %{Math.round(matchAnalysis.matchScore)}
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-blue-200 dark:bg-blue-900/40">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                    style={{
                      width: `${Math.min(matchAnalysis.matchScore, 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-sm">
                  {matchAnalysis.summary ||
                    "AI değerlendirmesi özeti oluşturulamadı."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    Güçlü Yönler
                  </p>
                  {matchAnalysis.strengths.length > 0 ? (
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      {matchAnalysis.strengths.map((item, index) => (
                        <li key={`strength-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Henüz güçlü yön bulunamadı.
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/20">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    Gelişim Alanları
                  </p>
                  {matchAnalysis.gaps.length > 0 ? (
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      {matchAnalysis.gaps.map((item, index) => (
                        <li key={`gap-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Geliştirilmesi gereken kritik alan belirtilmedi.
                    </p>
                  )}
                </div>
              </div>

              {matchAnalysis.nextSteps.length > 0 && (
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-900/20">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                    <Target className="h-4 w-4" />
                    Önerilen Aksiyonlar
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {matchAnalysis.nextSteps.map((item, index) => (
                      <li key={`step-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {matchAnalysis.keywords.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Anahtar Kelime Eşleşmeleri
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {matchAnalysis.keywords.map((keyword, index) => (
                      <span
                        key={`keyword-${index}`}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          keyword.matched
                            ? "bg-green-500/90 text-white"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-200"
                        }`}
                        title={keyword.note || undefined}
                      >
                        {keyword.term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchAnalysis.coverLetter && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      AI Ön Yazı Taslağı
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleCopyCoverLetter}
                    >
                      <Clipboard className="h-4 w-4" />
                      {copied ? "Kopyalandı!" : "Kopyala"}
                    </Button>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
                    {matchAnalysis.coverLetter}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

