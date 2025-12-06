"use client";

import Link from "next/link";
import { Home, Compass, Plus, UserPlus, MessageCircle, Users, LifeBuoy, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";

const hubItems = [
  {
    title: "Haber Akışı",
    description: "Topluluk içeriklerini görüntüleyin ve takip edin",
    href: "/social/feed",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Keşfet",
    description: "Yeni içerikleri ve kullanıcıları keşfedin",
    href: "/social/explore",
    icon: Compass,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Oluştur",
    description: "İçerik oluşturun ve paylaşın",
    href: "/social/create",
    icon: Plus,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Bağlantılarım",
    description: "Arkadaşlarınızı ve bağlantılarınızı yönetin",
    href: "/dashboard/friends",
    icon: UserPlus,
    color: "from-amber-500 to-yellow-500",
  },
  {
    title: "Sohbetler",
    description: "Bireysel sohbetlerinizi görüntüleyin",
    href: "/chat/direct",
    icon: MessageCircle,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Gruplar",
    description: "Grup sohbetlerine katılın",
    href: "/chat/groups",
    icon: Users,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Yardımlaşma Toplulukları",
    description: "Topluluk sohbetlerine katılın ve yardımlaşın",
    href: "/chat",
    icon: LifeBuoy,
    color: "from-teal-500 to-cyan-500",
  },
];

export default function SosyalHubPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Sosyal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Toplulukla bağlantı kurun, içerik paylaşın ve sohbet edin
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
                      <div className="flex items-center text-pink-600 dark:text-pink-400 font-medium text-sm">
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

