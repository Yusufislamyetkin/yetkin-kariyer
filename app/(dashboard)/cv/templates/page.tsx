"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CVTemplate {
  id: string;
  name: string;
  preview: string | null;
  structure: any;
}

export default function CVTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/cv/templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/cv/create?template=${templateId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CV Şablonları</h1>
      <p className="text-gray-600 mb-8">
        Bir şablon seçerek CV&apos;nizi oluşturmaya başlayın. Tüm şablonlar ATS
        uyumludur.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => handleSelectTemplate(template.id)}
          >
            {template.preview && (
              <div className="bg-gray-100 h-48 mb-4 rounded flex items-center justify-center">
                <p className="text-gray-500">Önizleme</p>
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              ATS Uyumlu • Profesyonel
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Bu Şablonu Seç
            </button>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Şablon bulunamadı</p>
        </div>
      )}
    </div>
  );
}

