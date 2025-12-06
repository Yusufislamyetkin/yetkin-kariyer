"use client";

import Link from "next/link";
import { BookOpen, PenSquare, Code, Medal, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

const colorClasses = {
  blue: {
    overlay: "from-blue-50/50 to-transparent dark:from-blue-900/10",
    hover: "hover:shadow-blue-500/20 hover:border-blue-200 dark:hover:border-blue-700",
    iconShadow: "shadow-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    overlay: "from-purple-50/50 to-transparent dark:from-purple-900/10",
    hover: "hover:shadow-purple-500/20 hover:border-purple-200 dark:hover:border-purple-700",
    iconShadow: "shadow-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
  },
  green: {
    overlay: "from-green-50/50 to-transparent dark:from-green-900/10",
    hover: "hover:shadow-green-500/20 hover:border-green-200 dark:hover:border-green-700",
    iconShadow: "shadow-green-500/30",
    text: "text-green-600 dark:text-green-400",
  },
  amber: {
    overlay: "from-amber-50/50 to-transparent dark:from-amber-900/10",
    hover: "hover:shadow-amber-500/20 hover:border-amber-200 dark:hover:border-amber-700",
    iconShadow: "shadow-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  indigo: {
    overlay: "from-indigo-50/50 to-transparent dark:from-indigo-900/10",
    hover: "hover:shadow-indigo-500/20 hover:border-indigo-200 dark:hover:border-indigo-700",
    iconShadow: "shadow-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
  },
};

const hubItems = [
  {
    title: "Kurslar",
    description: "Yeni beceriler öğrenin ve kendinizi geliştirin",
    href: "/education/courses",
    icon: BookOpen,
    color: "from-blue-500 via-cyan-500 to-blue-600",
    colorKey: "blue" as keyof typeof colorClasses,
  },
  {
    title: "Testler",
    description: "Bilginizi test edin ve pratik yapın",
    href: "/education/tests",
    icon: PenSquare,
    color: "from-purple-500 via-pink-500 to-purple-600",
    colorKey: "purple" as keyof typeof colorClasses,
  },
  {
    title: "Canlı Kodlama",
    description: "Gerçek zamanlı kodlama görevlerini tamamlayın",
    href: "/education/cases",
    icon: Code,
    color: "from-green-500 via-emerald-500 to-green-600",
    colorKey: "green" as keyof typeof colorClasses,
  },
  {
    title: "Rozetler",
    description: "Başarılarınızı rozetlerle gösterin",
    href: "/rozetler",
    icon: Medal,
    color: "from-amber-500 via-yellow-500 to-amber-600",
    colorKey: "amber" as keyof typeof colorClasses,
  },
  {
    title: "Gelişim ve Analiz",
    description: "İlerlemenizi takip edin ve analiz edin",
    href: "/education/analytics",
    icon: BarChart3,
    color: "from-indigo-500 via-blue-500 to-indigo-600",
    colorKey: "indigo" as keyof typeof colorClasses,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {hubItems.map((item, index) => {
          const Icon = item.icon;
          const colorClass = colorClasses[item.colorKey];
          return (
            <Link key={index} href={item.href}>
              <Card 
                variant="elevated" 
                hover 
                className={`h-full relative overflow-hidden ${colorClass.hover} transition-all duration-300`}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass.overlay} pointer-events-none`} />
                
                <CardContent className="pt-10 px-8 pb-8 relative z-10">
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl ${colorClass.iconShadow} flex-shrink-0`}
                    >
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-5">
                        {item.description}
                      </p>
                      <div className={`flex items-center ${colorClass.text} font-medium text-base`}>
                        <span>Keşfet</span>
                        <ArrowRight className="h-5 w-5 ml-2" />
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

