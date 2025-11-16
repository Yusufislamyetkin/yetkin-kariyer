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
    let url: string | null = null;
    try {
      setDownloading(true);
      setError(null);
      
      if (!params.id) {
        throw new Error("CV ID bulunamadı");
      }
      
      const response = await fetch(`/api/cv/${params.id}/pdf`, {
        method: "GET",
        headers: {
          "Accept": "application/pdf",
        },
      });
      
      // Check content type first
      const contentType = response.headers.get("content-type") || "";
      
      if (!response.ok) {
        // Try to get error message from JSON response
        let errorMessage = "PDF oluşturulamadı";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If not JSON, use status text
          errorMessage = response.statusText || errorMessage;
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
        } catch {
          throw new Error("PDF oluşturulamadı: Geçersiz dosya formatı");
        }
      }
      
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
      setError(err.message || "PDF indirilirken bir hata oluştu");
      if (url) {
        URL.revokeObjectURL(url);
      }
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
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <Button onClick={loadCV}>
                Tekrar Dene
              </Button>
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
            <span className="hidden sm:inline">{downloading ? "PDF Oluşturuluyor..." : "PDF İndir"}</span>
            <span className="sm:hidden">{downloading ? "Oluşturuluyor..." : "PDF"}</span>
          </Button>
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

