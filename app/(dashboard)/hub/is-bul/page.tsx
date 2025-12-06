"use client";

import Link from "next/link";
import { Briefcase, FileText, Target, MessageSquare, ClipboardList, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

const hubItems = [
  {
    title: "İş İlanları",
    description: "Size uygun iş ilanlarını keşfedin ve başvurun",
    href: "/jobs/browse",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Başvurularım",
    description: "Yaptığınız başvuruları görüntüleyin ve takip edin",
    href: "/jobs/applications",
    icon: ClipboardList,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "CV Oluştur",
    description: "Profesyonel CV'nizi oluşturun ve yönetin",
    href: "/cv/my-cvs",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Kariyer Planım",
    description: "Kariyer hedeflerinizi belirleyin ve planlayın",
    href: "/career/roadmap",
    icon: Target,
    color: "from-amber-500 to-yellow-500",
  },
  {
    title: "Mülakat",
    description: "Mülakat pratiği yapın ve kendinizi hazırlayın",
    href: "/interview/cv-based",
    icon: MessageSquare,
    color: "from-indigo-500 to-blue-500",
  },
];

export default function IsBulHubPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            İş Bul
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            İş fırsatlarını keşfedin, CV&apos;nizi oluşturun ve kariyerinizi planlayın
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
                      <div className="flex items-center text-green-600 dark:text-green-400 font-medium text-sm">
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

