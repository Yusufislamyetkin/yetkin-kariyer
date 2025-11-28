/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import CVRenderer from "@/app/components/cv/CVRenderer";

interface CV {
  id: string;
  data: any;
  templateId: string;
  template: {
    id: string;
    name: string;
  };
}

export default function ViewCVPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cv, setCv] = useState<CV | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastUploadUrl, setLastUploadUrl] = useState<string | null>(null);
  const [lastUploadName, setLastUploadName] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "CV yüklenemedi");
      }

      setLastUploadUrl(data.upload?.url || null);
      setLastUploadName(data.upload?.name || null);
    } catch (err: any) {
      console.error("Error uploading CV:", err);
      setError(err.message || "CV yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
      // reset input value to allow re-selecting the same file
      (e.target as HTMLInputElement).value = "";
    }
  };

  useEffect(() => {
    if (params.id) {
      loadCV();
    }
  }, [params.id]);

  const loadCV = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cv/${params.id}`);
      
      if (!response.ok) {
        throw new Error("CV yüklenemedi");
      }

      const data = await response.json();
      setCv(data.cv);
    } catch (err) {
      console.error("Error loading CV:", err);
      setError("CV yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (retryAttempt: number = 0) => {
    let url: string | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      setDownloading(true);
      setError(null);
      
      if (!params.id) {
        throw new Error("CV ID bulunamadı");
      }
      
      // Create abort controller for timeout
      const abortController = new AbortController();
      timeoutId = setTimeout(() => abortController.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`/api/cv/${params.id}/pdf?download=1`, {
        method: "GET",
        headers: {
          "Accept": "application/pdf",
        },
        signal: abortController.signal,
      });
      
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      // Check content type first
      const contentType = response.headers.get("content-type") || "";
      
      if (!response.ok) {
        // Try to get error message from JSON response
        let errorMessage = "PDF oluşturulamadı";
        let shouldRetry = false;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          
          // Determine if we should retry based on status code
          if (response.status === 500 || response.status === 503) {
            shouldRetry = true;
          } else if (response.status === 503 && errorMessage.includes("yapılandırılmadı")) {
            errorMessage = "PDF servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
          } else if (response.status === 401) {
            errorMessage = "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
          } else if (response.status === 404) {
            errorMessage = "CV bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.";
          }
        } catch {
          // If not JSON, use status text
          errorMessage = response.statusText || errorMessage;
          if (response.status === 500 || response.status === 503) {
            shouldRetry = true;
          }
        }
        
        // Retry if appropriate
        if (shouldRetry && retryAttempt < MAX_RETRIES) {
          console.log(`[PDF] Retry attempt ${retryAttempt + 1}/${MAX_RETRIES}`);
          setRetryCount(retryAttempt + 1);
          await new Promise((resolve) => setTimeout(resolve, 2000 * (retryAttempt + 1))); // Exponential backoff
          return handleDownload(retryAttempt + 1);
        }
        
        throw new Error(errorMessage);
      }

      // Read response as blob
      const blob = await response.blob();
      
      // Verify it's actually a PDF
      if (!blob.type.includes("pdf") && blob.type !== "application/octet-stream" && contentType.includes("application/pdf")) {
        // If content-type says PDF but blob type doesn't, it might still be a PDF
        // This can happen in some browsers
      } else if (!blob.type.includes("pdf") && blob.type !== "application/octet-stream" && !contentType.includes("application/pdf")) {
        // Might be an error JSON, try to read it
        try {
          const errorText = await blob.text();
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "PDF oluşturulamadı");
        } catch (parseError) {
          throw new Error("PDF oluşturulamadı: Geçersiz dosya formatı");
        }
      }
      
      // Verify blob size (should be at least 1KB for a valid PDF)
      if (blob.size < 1024) {
        // Might be an error message, try to read it
        try {
          const errorText = await blob.text();
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "PDF oluşturulamadı: Dosya çok küçük");
        } catch {
          throw new Error("PDF oluşturulamadı: Geçersiz dosya boyutu");
        }
      }
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Create download link
      url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cv-${params.id}.pdf`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        if (url) {
          URL.revokeObjectURL(url);
        }
      }, 100);
    } catch (err: any) {
      console.error("Error downloading PDF:", err);
      
      // Handle specific error types
      let errorMessage = err.message || "PDF indirilirken bir hata oluştu";
      
      if (err.name === "AbortError" || err.name === "TimeoutError") {
        errorMessage = "PDF oluşturma işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.";
      } else if (err.message && err.message.includes("network")) {
        errorMessage = "Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin.";
      } else if (err.message && err.message.includes("fetch")) {
        errorMessage = "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.";
      }
      
      setError(errorMessage);
      setRetryCount(0);
      
      if (url) {
        URL.revokeObjectURL(url);
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">PDF yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/cv/my-cvs")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </div>
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="h-16 w-16 text-red-400 dark:text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Hata
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">
                {error}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={loadCV}>
                  Sayfayı Yenile
                </Button>
                {error?.includes("PDF") && (
                  <Button variant="primary" onClick={() => handleDownload(0)}>
                    PDF İndirmeyi Tekrar Dene
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            CV Görüntüle
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ATS uyumlu PDF görünümü
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/cv/my-cvs")}
            className="flex-1 sm:flex-initial"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Geri Dön</span>
            <span className="sm:hidden">Geri</span>
          </Button>
          <Link href={`/cv/edit/${params.id}`} className="flex-1 sm:flex-initial">
            <Button variant="primary" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          </Link>
          <Button 
            onClick={() => handleDownload(0)} 
            disabled={downloading || !cv}
            className="flex-1 sm:flex-initial"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {downloading 
                ? (retryCount > 0 ? `Tekrar deneniyor (${retryCount}/${MAX_RETRIES})...` : "PDF Oluşturuluyor...") 
                : "PDF İndir"}
            </span>
            <span className="sm:hidden">
              {downloading 
                ? (retryCount > 0 ? `Tekrar (${retryCount})` : "Oluşturuluyor...") 
                : "PDF"}
            </span>
          </Button>
          <label className="flex-1 sm:flex-initial">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCvUpload}
              className="hidden"
            />
            <Button variant="outline" disabled={uploading} className="w-full">
              {uploading ? "Yükleniyor..." : "CV Yükle (PDF/DOC)"}
            </Button>
          </label>
        </div>
      </div>

      {/* CV Preview */}
      <Card variant="elevated" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CV Önizleme
            </div>
            {lastUploadUrl && (
              <span className="text-sm font-normal text-blue-600 sm:ml-2">
                <a href={lastUploadUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Yüklenen Dosya: {lastUploadName || "CV"}
                </a>
              </span>
            )}
            {cv && (
              <span className="text-sm font-normal text-gray-500 sm:ml-2">
                ({cv.template.name} Şablonu)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cv ? (
            <div className="bg-gray-100 p-2 sm:p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 300px)", minHeight: "400px" }}>
              <div className="bg-white shadow-lg mx-auto w-full max-w-[210mm] scale-[0.75] sm:scale-[0.9] md:scale-100 origin-top transition-transform" style={{ width: "210mm" }}>
                <CVRenderer data={cv.data} templateId={cv.templateId} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-600 dark:text-gray-400">CV yükleniyor...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


