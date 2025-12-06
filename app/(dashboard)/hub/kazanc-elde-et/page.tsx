"use client";

import Link from "next/link";
import { Trophy, Handshake, Medal, TrendingUp, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

const hubItems = [
  {
    title: "Hackaton",
    description: "Hackathon'lara katılın ve ödüller kazanın",
    href: "/education/hackaton",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Freelancer Partner",
    description: "Freelance projelerde çalışın ve kazanç elde edin",
    href: "/freelancer/projects",
    icon: Handshake,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Derece Sıralaması",
    description: "Sıralamalarda yer alın ve ödüller kazanın",
    href: "/competition",
    icon: Medal,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Kazanç Analizi",
    description: "Kazançlarınızı analiz edin ve takip edin",
    href: "/earnings",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "En Çok Kazananlar",
    description: "Kazanç sıralamasını görüntüleyin",
    href: "/earnings/leaderboard",
    icon: DollarSign,
    color: "from-amber-500 to-yellow-500",
  },
];

export default function KazancEldeEtHubPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Kazanç Elde Et
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Hackathon&apos;lara katılın, freelance projelerde çalışın ve kazanç elde edin
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
                      <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium text-sm">
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

