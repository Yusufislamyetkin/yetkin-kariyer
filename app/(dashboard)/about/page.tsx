"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Hakkımızda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Yetkin Academy Nedir?
              </h2>
              <p className="leading-relaxed">
                Yetkin Academy, yazılım geliştiricileri için kapsamlı bir öğrenme ve kariyer platformudur. 
                Amacımız, yazılım geliştiricilerinin teknik becerilerini geliştirmelerine, gerçek dünya 
                projelerinde deneyim kazanmalarına ve kariyerlerinde ilerlemelerine yardımcı olmaktır.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Misyonumuz
              </h2>
              <p className="leading-relaxed">
                Türkiye&apos;deki yazılım geliştiricilerine en kaliteli eğitim içeriklerini sunmak, 
                onları gerçek dünya projeleriyle buluşturmak ve kariyer gelişimlerini desteklemektir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Vizyonumuz
              </h2>
              <p className="leading-relaxed">
                Türkiye&apos;nin en büyük yazılım geliştirici topluluğunu oluşturmak ve her seviyeden 
                geliştiricinin potansiyelini ortaya çıkarmaktır.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Ne Sunuyoruz?
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kapsamlı yazılım geliştirme kursları</li>
                <li>Gerçek dünya projeleri ve hackathon&apos;lar</li>
                <li>Kodlama pratikleri ve bug fix challenge&apos;ları</li>
                <li>Kariyer danışmanlığı ve iş fırsatları</li>
                <li>Sosyal öğrenme platformu</li>
                <li>Rozet ve gamification sistemi</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

