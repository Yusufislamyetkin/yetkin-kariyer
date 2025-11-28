/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import CVRenderer from "@/app/components/cv/CVRenderer";
import { generatePDFFromElement } from "@/lib/cv/pdf-generator";

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

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      
      if (!params.id) {
        throw new Error("CV ID bulunamadı");
      }

      if (!cv) {
        throw new Error("CV yüklenmedi. Lütfen bekleyin ve tekrar deneyin.");
      }

      // Wait a bit to ensure DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate PDF from the CV content element
      await generatePDFFromElement("cv-preview-content", {
        filename: `cv-${params.id}.pdf`,
        format: "a4",
        orientation: "portrait",
        quality: 0.98,
        scale: 2,
      });

      setRetryCount(0);
    } catch (err: any) {
      console.error("Error generating PDF:", err);
      
      // Handle specific error types
      let errorMessage = err.message || "PDF oluşturulurken bir hata oluştu";
      
      if (err.message && err.message.includes("not found")) {
        errorMessage = "CV içeriği bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.";
      } else if (err.message && err.message.includes("network")) {
        errorMessage = "Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin.";
      }
      
      setError(errorMessage);
      setRetryCount(0);
    } finally {
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
                  <Button variant="primary" onClick={handleDownload}>
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
            onClick={handleDownload} 
            disabled={downloading || !cv}
            className="flex-1 sm:flex-initial"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {downloading ? "PDF Oluşturuluyor..." : "PDF İndir"}
            </span>
            <span className="sm:hidden">
              {downloading ? "Oluşturuluyor..." : "PDF"}
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
              <div 
                id="cv-preview-content"
                className="bg-white shadow-lg mx-auto w-full max-w-[210mm] scale-[0.75] sm:scale-[0.9] md:scale-100 origin-top transition-transform" 
                style={{ width: "210mm" }}
              >
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


