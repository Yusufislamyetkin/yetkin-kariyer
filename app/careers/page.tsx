"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Briefcase, MapPin, Clock, ArrowRight, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Teknoloji",
      location: "İstanbul / Remote",
      type: "Tam Zamanlı",
      description: "React, Node.js ve modern web teknolojileri ile çalışacak deneyimli geliştirici arıyoruz.",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Ürün",
      location: "Ankara",
      type: "Tam Zamanlı",
      description: "Eğitim teknolojileri ürünlerini yönetecek, deneyimli product manager arıyoruz.",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Tasarım",
      location: "İzmir / Remote",
      type: "Tam Zamanlı",
      description: "Kullanıcı deneyimi odaklı, yaratıcı tasarımcı ekibimize katılacak.",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Teknoloji",
      location: "Remote",
      type: "Tam Zamanlı",
      description: "AWS, Docker, Kubernetes ile çalışacak DevOps mühendisi arıyoruz.",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Takım Çalışması",
      description: "Yetenekli ve destekleyici bir ekiple çalışın",
    },
    {
      icon: TrendingUp,
      title: "Kariyer Gelişimi",
      description: "Sürekli öğrenme ve gelişim fırsatları",
    },
    {
      icon: Clock,
      title: "Esnek Çalışma",
      description: "Remote ve esnek çalışma saatleri",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
            <Briefcase className="w-10 h-10" />
            Kariyer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Yetkin Academy ekibine katılın ve eğitim teknolojilerinin geleceğini şekillendirin
          </p>
        </div>

        <div className="mb-12">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Neden Yetkin Academy?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Türkiye&apos;nin önde gelen eğitim teknolojileri platformunda çalışın. 
              Yenilikçi projeler, öğrenme fırsatları ve harika bir ekip sizi bekliyor.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Açık Pozisyonlar
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {openPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {position.department}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {position.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{position.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {position.description}
                  </p>
                  <Link
                    href={`/jobs/${position.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                  >
                    Detayları Gör
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Açık Pozisyon Yok mu?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Yetenekli ve tutkulu insanlar her zaman aradığımız kişiler. 
            Özgeçmişinizi gönderin, uygun bir pozisyon açıldığında sizinle iletişime geçelim.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Özgeçmiş Gönder
          </Link>
        </Card>
      </div>
    </div>
  );
}

