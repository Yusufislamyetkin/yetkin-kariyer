"use client";

import { FileText, Download, Edit, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

interface CV {
  id: string;
  templateId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  atsOptimized: boolean;
}

interface CVSectionProps {
  cvs: CV[];
}

export function CVSection({ cvs }: CVSectionProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                CV&apos;lerim
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {cvs.length} CV
              </p>
            </div>
          </div>
          <Link href="/cv">
            <Button variant="gradient" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni CV
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {cvs.length > 0 ? (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        CV #{cv.id.slice(0, 8)}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span>Oluşturulma: {formatDate(cv.createdAt)}</span>
                        {cv.atsOptimized && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                            ATS Optimize
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/cv/${cv.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Düzenle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Henüz CV oluşturmadınız
            </p>
            <Link href="/cv">
              <Button variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                İlk CV&apos;nizi Oluşturun
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

