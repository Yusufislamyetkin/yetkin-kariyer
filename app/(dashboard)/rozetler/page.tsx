"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Medal, Info, Trophy, Lightbulb, Crown, Award, Star } from "lucide-react";
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

  const categories = useMemo(
    () => [
      {
        id: "daily_activities",
        name: "Günlük Aktiviteler",
        icon: "📅",
        description: "Günlük test, kurs, canlı kod ve bugfix aktiviteleriniz için rozetler",
        gradient: "from-blue-500 to-cyan-500",
        badgeCategories: ["daily_activities"],
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
        badgeCategories: ["social_interaction"],
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
    ],
    []
  );

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
  }, [allBadges, earnedBadgeIds, categories]);

  const filteredBadges = useMemo(() => {
    if (!selectedCategory) return allBadges;
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return allBadges;
    return allBadges.filter((badge) =>
      category.badgeCategories.includes(badge.category)
    );
  }, [selectedCategory, allBadges, categories]);

  // Calculate tier statistics for selected category
  const tierStats = useMemo(() => {
    if (!selectedCategory) return null;
    const categoryBadges = filteredBadges;
    const tiers = ["bronze", "silver", "gold", "platinum"];
    const tierNames = {
      bronze: "Başlangıç Seviye",
      silver: "Orta Seviye",
      gold: "İleri Seviye",
      platinum: "Efsanevi",
    };
    
    return tiers.map((tier) => {
      const tierBadges = categoryBadges.filter((b: Badge) => (b as any).tier === tier);
      const earnedInTier = tierBadges.filter((b: Badge) => earnedBadgeIds.has(b.id)).length;
      return {
        tier,
        name: tierNames[tier as keyof typeof tierNames],
        total: tierBadges.length,
        earned: earnedInTier,
      };
    });
  }, [selectedCategory, filteredBadges, earnedBadgeIds]);

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

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-8">
      {/* Top Section - Header, Stats, and Info */}
      <Card variant="elevated" className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 border border-purple-200/50 dark:border-purple-800/50">
        <CardContent className="p-8 md:p-12">
          {/* Header with Trophy Icon */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Rozetler
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                Başarılarınızı rozetlerle taçlandırın ve ödüller kazanın!
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card variant="elevated" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Medal className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kazandığınız Rozetler</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {earnedCount} / {totalBadges}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Puan</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {totalPoints}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Rozetler nedir?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Platformdaki aktivitelerinizi tamamlayarak rozetler kazanabilirsiniz. Her rozet size puan kazandırır ve bu puanlar aylık sıralamada yer almanızı sağlar. Rozetlerinizi kazanmak için test çözün, kurslar tamamlayın, sosyal paylaşımlar yapın ve düzenli olarak aktif olun!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Reward System */}
      <Card variant="elevated" className="border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10">
        <CardHeader className="flex flex-col space-y-1.5 p-6 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Aylık Ödül Sistemi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Aylık sıralamada rozetlerden kazandığınız puanlarla ilk 3&apos;e girenlere para ödülü verilir!
          </p>
          <div className="space-y-3">
            <div className="reward-card-shine flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 border border-purple-300 dark:border-purple-700">
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-sm text-white/90">1. Sıra</p>
                <p className="text-xl font-bold text-white">10.000 TL</p>
              </div>
            </div>
            <div className="reward-card-shine flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 border border-blue-300 dark:border-blue-700">
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-sm text-white/90">2. Sıra</p>
                <p className="text-xl font-bold text-white">7.500 TL</p>
              </div>
            </div>
            <div className="reward-card-shine flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border border-purple-300 dark:border-purple-700">
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-sm text-white/90">3. Sıra</p>
                <p className="text-xl font-bold text-white">5.000 TL</p>
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
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name || "Tüm Rozetler"
                  : "Tüm Rozetler"}
              </h2>
            </div>
            {selectedCategory && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {categories.find((c) => c.id === selectedCategory)?.description}
                </p>
                {tierStats && (
                  <div className="flex flex-wrap gap-2">
                    {tierStats.map((tier) => (
                      <span
                        key={tier.tier}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {tier.name} ({tier.earned} / {tier.total})
                      </span>
                    ))}
                  </div>
                )}
              </>
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

