"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Newspaper, Mail, FileText } from "lucide-react";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Newspaper className="w-8 h-8" />
              Basın
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basın Kiti
              </h2>
              <p className="leading-relaxed mb-4">
                Yetkin Academy hakkında medya ve basın için hazırlanmış materyaller.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Logo ve Görseller</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yetkin Academy logosu ve marka görselleri
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Basın Bültenleri</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Son haberler ve duyurular
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basın İletişimi
              </h2>
              <p className="leading-relaxed mb-4">
                Basın sorularınız ve medya talepleriniz için:
              </p>
              <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Mail className="w-5 h-5 text-blue-500" />
                <a href="mailto:basin@yetkinacademy.com" className="text-blue-500 hover:underline">
                  basin@yetkinacademy.com
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Hakkımızda
              </h2>
              <p className="leading-relaxed">
                Yetkin Academy, yazılım geliştiricileri için kapsamlı bir öğrenme ve kariyer platformudur. 
                Platformumuz, binlerce geliştiriciye eğitim içerikleri, gerçek dünya projeleri ve 
                kariyer fırsatları sunmaktadır.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

