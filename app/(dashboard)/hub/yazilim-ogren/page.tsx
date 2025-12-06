"use client";

import Link from "next/link";
import { BookOpen, PenSquare, Code, Medal, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

const hubItems = [
  {
    title: "Kurslar",
    description: "Yeni beceriler öğrenin ve kendinizi geliştirin",
    href: "/education/courses",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Testler",
    description: "Bilginizi test edin ve pratik yapın",
    href: "/education/tests",
    icon: PenSquare,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Canlı Kodlama",
    description: "Gerçek zamanlı kodlama görevlerini tamamlayın",
    href: "/education/cases",
    icon: Code,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Rozetler",
    description: "Başarılarınızı rozetlerle gösterin",
    href: "/rozetler",
    icon: Medal,
    color: "from-amber-500 to-yellow-500",
  },
  {
    title: "Gelişim ve Analiz",
    description: "İlerlemenizi takip edin ve analiz edin",
    href: "/education/analytics",
    icon: BarChart3,
    color: "from-indigo-500 to-blue-500",
  },
];

export default function YazilimOgrenHubPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Yazılım Öğren
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Yazılım becerilerinizi geliştirin, test edin ve ilerlemenizi takip edin
          </p>
        </div>
      </div>

      {/* Hub Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hubItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={index} href={item.href}>
              <Card variant="elevated" hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                        <span>Keşfet</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

