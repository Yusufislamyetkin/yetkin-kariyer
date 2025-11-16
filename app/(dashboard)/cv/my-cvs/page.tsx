"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Edit, Trash2, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface CV {
  id: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    name: string;
  };
}

export default function MyCVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await fetch("/api/cv");
      const data = await response.json();
      setCvs(data.cvs || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("CV'yi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCVs();
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            CV&apos;lerim
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm CV&apos;lerinizi yönetin ve düzenleyin
          </p>
        </div>
        <Link href="/cv/templates">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni CV Oluştur
          </Button>
        </Link>
      </div>

      {cvs.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="!pt-12 pb-16 px-6">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Henüz CV&apos;niz yok
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                İlk CV&apos;nizi oluşturarak başlayın
              </p>
              <Link href="/cv/templates">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk CV&apos;nizi Oluşturun
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv, index) => (
            <Card
              key={cv.id}
              variant="elevated"
              hover
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl">
                  {cv.data?.personalInfo?.name || "CV"}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Şablon: {cv.template.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(cv.updatedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/cv/view/${cv.id}`} className="flex-1">
                    <Button variant="primary" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Görüntüle
                    </Button>
                  </Link>
                  <Link href={`/cv/edit/${cv.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(cv.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
