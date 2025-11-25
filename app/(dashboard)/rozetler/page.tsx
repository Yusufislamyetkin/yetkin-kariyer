"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Medal, Info, Trophy, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { BadgeCollection } from "@/app/components/badges/BadgeDisplay";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  earnedAt?: string;
  isDisplayed?: boolean;
}

export default function RozetlerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
  const [totalBadgesCount, setTotalBadgesCount] = useState(93);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchBadges();
      fetchUserBadges();
    }
  }, [status, router]);

  const fetchBadges = async () => {
    try {
      const response = await fetch("/api/badges");
      const data = await response.json();

      if (response.ok) {
        setAllBadges(data.badges || []);
        setTotalBadgesCount(data.badges?.length || 93);
      } else {
        // Fallback: try to load from JSON file
        try {
          const jsonResponse = await fetch("/data/badges.json");
          if (jsonResponse.ok) {
            const jsonData = await jsonResponse.json();
            setAllBadges(jsonData.badges || []);
            setTotalBadgesCount(jsonData.totalBadges || 93);
          }
        } catch (jsonError) {
          console.error("Error loading badges JSON:", jsonError);
        }
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
      // Fallback: try to load from JSON file
      try {
        const jsonResponse = await fetch("/data/badges.json");
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          setAllBadges(jsonData.badges || []);
          setTotalBadgesCount(jsonData.totalBadges || 93);
        }
      } catch (jsonError) {
        console.error("Error loading badges JSON:", jsonError);
      }
    }
  };

  const fetchUserBadges = async () => {
    try {
      const response = await fetch("/api/badges/user");
      const data = await response.json();

      if (response.ok) {
        setUserBadges(data.badges || []);
        const earnedIds = new Set<string>((data.badges || []).map((b: Badge) => b.id));
        setEarnedBadgeIds(earnedIds);
      }
    } catch (error) {
      console.error("Error fetching user badges:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const earnedCount = userBadges.length;
  const totalBadges = totalBadgesCount || allBadges.length || 93;
  const totalPoints = userBadges.reduce((sum, badge) => sum + (badge.points || 0), 0);

  // Category definitions
  const categories = [
    {
      id: "daily_activities",
      name: "Günlük Aktiviteler",
      icon: "📅",
      description: "Günlük test, kurs, canlı kod ve bugfix aktiviteleriniz için rozetler",
      gradient: "from-blue-500 to-cyan-500",
      badgeCategories: ["test_count", "topic"],
    },
    {
      id: "total_achievements",
      name: "Toplam Başarılar",
      icon: "🏆",
      description: "Toplam başarılarınız için rozetler",
      gradient: "from-purple-500 to-pink-500",
      badgeCategories: ["score"],
    },
    {
      id: "social_interaction",
      name: "Sosyal Etkileşim",
      icon: "💬",
      description: "Sosyal aktiviteleriniz için rozetler",
      gradient: "from-green-500 to-emerald-500",
      badgeCategories: [],
    },
    {
      id: "consistency",
      name: "Süreklilik ve Disiplin",
      icon: "🔥",
      description: "Süreklilik ve disiplin rozetleri",
      gradient: "from-orange-500 to-red-500",
      badgeCategories: ["streak"],
    },
    {
      id: "special",
      name: "Özel Başarılar",
      icon: "⭐",
      description: "Özel başarılarınız için rozetler",
      gradient: "from-yellow-500 to-amber-500",
      badgeCategories: ["special"],
    },
  ];

  // Calculate category stats
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const categoryBadges = allBadges.filter((badge) =>
        cat.badgeCategories.includes(badge.category)
      );
      const earnedInCategory = categoryBadges.filter((badge) =>
        earnedBadgeIds.has(badge.id)
      ).length;
      return {
        ...cat,
        total: categoryBadges.length,
        earned: earnedInCategory,
      };
    });
  }, [allBadges, earnedBadgeIds]);

  // Filter badges by selected category
  const filteredBadges = useMemo(() => {
    if (!selectedCategory) return allBadges;
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return allBadges;
    return allBadges.filter((badge) =>
      category.badgeCategories.includes(badge.category)
    );
  }, [selectedCategory, allBadges]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-8">
      {/* Top Section - Header, Stats, and Info */}
      <div className="relative p-8 md:p-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Rozetler
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Başarılarınızı rozetlerle taçlandırın ve ödüller kazanın!
          </p>
        </div>

        {/* Statistics - Inline */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Kazandığınız Rozetler</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {earnedCount} / {totalBadges}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Puan</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {totalPoints}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Rozetler nedir?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Platformdaki aktivitelerinizi tamamlayarak rozetler kazanabilirsiniz.
          </p>
        </div>
      </div>

      {/* Monthly Reward System */}
      <Card variant="elevated" className="border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10">
        <CardHeader className="border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Aylık Ödül Sistemi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Aylık sıralamada rozetlerden kazandığınız puanlarla ilk 3'e girenlere para ödülü verilir!
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">1. Sıra</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">10.000 TL</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-slate-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">2. Sıra</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">7.500 TL</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">3. Sıra</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">5.000 TL</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">💡 İpucu:</span> Daha fazla rozet kazanarak puanlarınızı artırın ve aylık ödüllerde yer alın!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Badges Collection */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || "Tüm Rozetler"
                : "Tüm Rozetler"}
            </h2>
            {selectedCategory && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {categories.find((c) => c.id === selectedCategory)?.description}
              </p>
            )}
          </div>
          {filteredBadges.length > 0 ? (
            <BadgeCollection
              badges={filteredBadges}
              earnedBadgeIds={earnedBadgeIds}
            />
          ) : (
            <Card variant="elevated">
              <CardContent className="py-12 text-center">
                <Medal className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                  Henüz rozet bulunamadı
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Rozetler yükleniyor...
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Categories */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-6">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Kategoriler
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col space-y-1.5 p-6 pt-0">
                {categoryStats.map((category) => (
                  <div key={category.id} className="flex flex-col space-y-1.5">
                    <button
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )
                      }
                      className={`w-full text-left p-0 transition-all duration-200 ${
                        selectedCategory === category.id
                          ? ""
                          : "hover:opacity-80"
                      }`}
                    >
                      <div className="flex items-center justify-between text-base">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {category.icon} {category.name}
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {category.earned} / {category.total}
                        </span>
                      </div>
                    </button>
                    {selectedCategory === category.id && (
                      <div
                        className={`flex flex-col space-y-1.5 p-6 bg-gradient-to-r ${category.gradient} border-b border-gray-200 dark:border-gray-800 text-white rounded-lg mt-1`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-semibold">
                            {category.icon} {category.name}
                          </span>
                          <span className="text-sm font-medium text-white/90">
                            {category.earned} / {category.total}
                          </span>
                        </div>
                        <p className="text-sm text-white/90">
                          {category.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

