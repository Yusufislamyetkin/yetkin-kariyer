"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LayoutTemplate, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import CVRenderer from "@/app/components/cv/CVRenderer";

interface CVTemplate {
  id: string;
  name: string;
  preview: string | null;
  structure: any;
}

interface CV {
  id: string;
  data: any;
  templateId: string;
  template: {
    id: string;
    name: string;
  };
}

export default function ChangeTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const [cv, setCv] = useState<CV | null>(null);
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadData();
    }
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load CV and templates in parallel
      const [cvResponse, templatesResponse] = await Promise.all([
        fetch(`/api/cv/${params.id}`),
        fetch("/api/cv/templates"),
      ]);

      if (!cvResponse.ok) {
        throw new Error("CV yüklenemedi");
      }

      if (!templatesResponse.ok) {
        throw new Error("Şablonlar yüklenemedi");
      }

      const cvData = await cvResponse.json();
      const templatesData = await templatesResponse.json();

      setCv(cvData.cv);
      setTemplates(templatesData.templates || []);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message || "Veriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!cv || changing) return;

    // Don't change if it's the same template
    if (cv.templateId === templateId) {
      return;
    }

    try {
      setChanging(templateId);
      setError(null);

      const response = await fetch(`/api/cv/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Template değiştirilemedi");
      }

      // Success - redirect to CV list
      router.push("/cv/my-cvs");
    } catch (err: any) {
      console.error("Error changing template:", err);
      setError(err.message || "Template değiştirilirken bir hata oluştu");
    } finally {
      setChanging(null);
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

  if (error && !cv) {
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
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={loadData}>Tekrar Dene</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cv) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            CV Template Değiştir
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            CV&apos;nizi farklı şablonlarda önizleyin ve seçin
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/cv/my-cvs")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>

      {/* Current Template Info */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Mevcut Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {cv.template.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            CV ID: {cv.id.slice(0, 8)}...
          </p>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card variant="outlined" className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Tüm Template&apos;ler
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const isCurrent = cv.templateId === template.id;
            const isChanging = changing === template.id;

            return (
              <Card
                key={template.id}
                variant="elevated"
                className={`relative overflow-hidden transition-all ${
                  isCurrent
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:shadow-xl"
                }`}
              >
                {/* Current Template Badge */}
                {isCurrent && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      Mevcut Template
                    </span>
                  </div>
                )}

                {/* Preview Section - A4 Aspect Ratio */}
                <div
                  className="bg-gray-50 border-b border-gray-200 relative overflow-hidden"
                  style={{
                    aspectRatio: "210 / 297",
                    maxHeight: "400px",
                    width: "100%",
                    minHeight: "280px",
                  }}
                >
                  <div
                    className="absolute inset-0 overflow-auto"
                    style={{
                      transform: "scale(0.22)",
                      transformOrigin: "top left",
                      width: "454%",
                      height: "454%",
                    }}
                  >
                    <div style={{ pointerEvents: "none" }}>
                      <CVRenderer
                        data={cv.data}
                        templateId={template.id}
                        className="!w-[210mm] !min-h-[297mm]"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <CardHeader>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ATS Uyumlu • Profesyonel
                  </p>
                </CardHeader>

                <CardContent>
                  <Button
                    variant={isCurrent ? "outline" : "primary"}
                    className="w-full"
                    onClick={() => handleTemplateChange(template.id)}
                    disabled={isCurrent || isChanging}
                    isLoading={isChanging}
                  >
                    {isChanging ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Değiştiriliyor...
                      </>
                    ) : isCurrent ? (
                      "Mevcut Template"
                    ) : (
                      "Bu Template'i Seç"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {templates.length === 0 && (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Şablon bulunamadı</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

