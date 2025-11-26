"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Medal, Trophy, Crown, Star, Calendar, MessageCircle, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { BadgeDisplay } from "@/app/components/badges/BadgeDisplay";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  earnedAt?: string;
  isDisplayed?: boolean;
  criteria?: any;
  key?: string;
}

// Unique isimler için utility fonksiyonu
function generateUniqueBadgeName(badge: Badge, allBadges: Badge[]): string {
  const activityType = badge.criteria?.activity_type || "";
  const tier = badge.tier || "";
  const count = badge.criteria?.count || 0;
  
  // Eğer isim zaten unique görünüyorsa (sayı içermiyorsa veya özel bir isimse), olduğu gibi bırak
  if (!badge.name.match(/^\d+\s/) && !badge.name.includes("Uzmanı") && !badge.name.includes("Ustası") && !badge.name.includes("Efsanesi")) {
    return badge.name;
  }

  // Activity type'a göre unique isimler oluştur
  const nameVariations: Record<string, Record<string, string[]>> = {
    bugfix: {
      bronze: ["Bugfix Başlangıcı", "İlk Hata Düzeltme", "Bugfix Acemisi"],
      silver: ["Bugfix Ustası", "Hata Avcısı", "Sorun Çözücü"],
      gold: ["BugFix Splinter", "Bugfix Avcısı", "Hata Ayıklayıcı", "Sorun Bulucu", "Problem Çözme Uzmanı"],
      platinum: ["Muhteşem Sorun Çözücü", "Bugfix Efsanesi", "Hata Düzeltme Ustası"],
    },
    "hata düzeltme": {
      bronze: ["Hata Düzeltme Başlangıcı", "İlk Hata Düzeltme", "Hata Düzeltme Acemisi"],
      silver: ["Hata Düzeltme Ustası", "Hata Avcısı", "Sorun Çözücü"],
      gold: ["Hata Ayıklayıcı", "Sorun Bulucu", "Problem Çözme Uzmanı", "Hata Düzeltme Uzmanı"],
      platinum: ["Muhteşem Sorun Çözücü", "Hata Düzeltme Efsanesi", "Hata Düzeltme Ustası"],
    },
    test: {
      bronze: ["Test Başlangıcı", "İlk Test", "Test Acemisi"],
      silver: ["Test Ustası", "Test Sever", "Test Tutkunu"],
      gold: ["Test Uzmanı", "Test Master", "Test Champion"],
      platinum: ["Test Efsanesi", "Test Kralı", "Test Şampiyonu"],
    },
    kurs: {
      bronze: ["Kurs Başlangıcı", "İlk Kurs", "Kurs Acemisi"],
      silver: ["Kurs Ustası", "Kurs Sever", "Kurs Tutkunu"],
      gold: ["Kurs Uzmanı", "Kurs Master", "Kurs Champion"],
      platinum: ["Kurs Efsanesi", "Kurs Kralı", "Kurs Şampiyonu"],
    },
    "canlı kod": {
      bronze: ["Canlı Kod Başlangıcı", "İlk Canlı Kod", "Canlı Kod Acemisi"],
      silver: ["Canlı Kod Ustası", "Canlı Kod Sever", "Canlı Kod Tutkunu"],
      gold: ["Canlı Kod Uzmanı", "Canlı Kod Master", "Canlı Kod Champion"],
      platinum: ["Canlı Kod Efsanesi", "Canlı Kod Kralı", "Canlı Kod Şampiyonu"],
    },
    "canlı kodlama": {
      bronze: ["Canlı Kodlama Başlangıcı", "İlk Canlı Kodlama", "Canlı Kodlama Acemisi"],
      silver: ["Canlı Kodlama Ustası", "Canlı Kodlama Sever", "Canlı Kodlama Tutkunu"],
      gold: ["Canlı Kodlama Uzmanı", "Canlı Kodlama Master", "Canlı Kodlama Champion"],
      platinum: ["Canlı Kodlama Efsanesi", "Canlı Kodlama Kralı", "Canlı Kodlama Şampiyonu"],
    },
    ders: {
      bronze: ["Ders Başlangıcı", "İlk Ders", "Ders Acemisi"],
      silver: ["Ders Ustası", "Ders Sever", "Ders Tutkunu"],
      gold: ["Ders Uzmanı", "Ders Master", "Ders Champion"],
      platinum: ["Ders Efsanesi", "Ders Kralı", "Ders Şampiyonu"],
    },
    quiz: {
      bronze: ["Quiz Başlangıcı", "İlk Quiz", "Quiz Acemisi"],
      silver: ["Quiz Ustası", "Quiz Sever", "Quiz Tutkunu"],
      gold: ["Quiz Uzmanı", "Quiz Master", "Quiz Champion"],
      platinum: ["Quiz Efsanesi", "Quiz Kralı", "Quiz Şampiyonu"],
    },
    eğitim: {
      bronze: ["Eğitim Başlangıcı", "İlk Eğitim", "Eğitim Acemisi"],
      silver: ["Eğitim Ustası", "Eğitim Sever", "Eğitim Tutkunu"],
      gold: ["Eğitim Uzmanı", "Eğitim Master", "Eğitim Champion"],
      platinum: ["Eğitim Efsanesi", "Eğitim Kralı", "Eğitim Şampiyonu"],
    },
    pratik: {
      bronze: ["Pratik Başlangıcı", "İlk Pratik", "Pratik Acemisi"],
      silver: ["Pratik Ustası", "Pratik Sever", "Pratik Tutkunu"],
      gold: ["Pratik Uzmanı", "Pratik Master", "Pratik Champion"],
      platinum: ["Pratik Efsanesi", "Pratik Kralı", "Pratik Şampiyonu"],
    },
  };

  const normalizedActivityType = activityType.toLowerCase();
  const variations = nameVariations[normalizedActivityType]?.[tier] || [];
  
  if (variations.length === 0) {
    // Fallback: activity type ve tier'e göre genel isim
    const tierNames: Record<string, string> = {
      bronze: "Başlangıç",
      silver: "Usta",
      gold: "Uzman",
      platinum: "Efsane",
    };
    return `${activityType} ${tierNames[tier] || ""}`.trim();
  }

  // Aynı activity type ve tier'deki rozetleri bul
  const sameTypeTierBadges = allBadges.filter(
    (b) =>
      b.criteria?.activity_type?.toLowerCase() === normalizedActivityType &&
      b.tier === tier &&
      b.id !== badge.id
  );

  // Kullanılmış isimleri topla
  const usedNames = new Set(sameTypeTierBadges.map((b) => b.name));

  // Kullanılmamış bir isim bul
  for (const variation of variations) {
    if (!usedNames.has(variation)) {
      return variation;
    }
  }

  // Tüm isimler kullanılmışsa, count'a göre unique isim oluştur
  const fallbackTierNames: Record<string, string> = {
    bronze: "Başlangıç",
    silver: "Usta",
    gold: "Uzman",
    platinum: "Efsane",
  };
  return `${activityType} ${fallbackTierNames[tier] || ""} ${count}`.trim();
}

export default function RozetlerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
  const [totalBadgesCount, setTotalBadgesCount] = useState(93);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("daily_activities");

  const categories = useMemo(
    () => [
      {
        id: "daily_activities",
        name: "Günlük Aktiviteler",
        icon: Calendar,
        description: "Günlük test, kurs, canlı kod ve bugfix aktiviteleriniz için rozetler",
        gradient: "from-blue-500 to-cyan-500",
        badgeCategories: ["daily_activities"],
      },
      {
        id: "total_achievements",
        name: "Toplam Başarılar",
        icon: Trophy,
        description: "Toplam başarılarınız için rozetler",
        gradient: "from-purple-500 to-pink-500",
        badgeCategories: ["score"],
      },
      {
        id: "social_interaction",
        name: "Sosyal Etkileşim",
        icon: MessageCircle,
        description: "Sosyal aktiviteleriniz için rozetler",
        gradient: "from-green-500 to-emerald-500",
        badgeCategories: ["social_interaction"],
      },
      {
        id: "consistency",
        name: "Süreklilik ve Disiplin",
        icon: Flame,
        description: "Süreklilik ve disiplin rozetleri",
        gradient: "from-orange-500 to-red-500",
        badgeCategories: ["streak"],
      },
      {
        id: "special",
        name: "Özel Başarılar",
        icon: Star,
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

  // Rozetleri unique isimlerle güncelle
  const badgesWithUniqueNames = useMemo(() => {
    return allBadges.map((badge) => ({
      ...badge,
      name: generateUniqueBadgeName(badge, allBadges),
    }));
  }, [allBadges]);

  const filteredBadges = useMemo(() => {
    if (!selectedCategory) return badgesWithUniqueNames;
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return badgesWithUniqueNames;
    return badgesWithUniqueNames.filter((badge) =>
      category.badgeCategories.includes(badge.category)
    );
  }, [selectedCategory, badgesWithUniqueNames, categories]);

  // Rozetleri seviyelere göre grupla
  const badgesByTier = useMemo(() => {
    const tiers = ["bronze", "silver", "gold", "platinum"] as const;
    const grouped: Record<string, Badge[]> = {};
    
    tiers.forEach((tier) => {
      grouped[tier] = filteredBadges.filter((badge) => badge.tier === tier);
    });
    
    // Tier olmayan rozetleri "other" kategorisine ekle
    grouped.other = filteredBadges.filter((badge) => !badge.tier);
    
    return grouped;
  }, [filteredBadges]);

  const tierNames = {
    bronze: "Başlangıç Seviye",
    silver: "Orta Seviye",
    gold: "İleri Seviye",
    platinum: "Efsanevi",
    other: "Diğer",
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Her iki API çağrısını koordine et ve loading state'i yönet
      Promise.all([fetchBadges(), fetchUserBadges()])
        .finally(() => {
          setLoading(false);
        });
      // Tüm rozetleri kontrol et (eksik olanları tespit et)
      checkAllBadges();
    }
  }, [status, router]);

  const fetchBadges = async () => {
    try {
      const response = await fetch("/api/badges");
      const data = await response.json();

      if (response.ok && data.badges) {
        setAllBadges(data.badges || []);
        setTotalBadgesCount(data.badges?.length || 93);
        return;
      }
      
      // Fallback: try to load from JSON file
      const jsonResponse = await fetch("/data/badges.json");
      if (jsonResponse.ok) {
        const jsonData = await jsonResponse.json();
        setAllBadges(jsonData.badges || []);
        setTotalBadgesCount(jsonData.totalBadges || 93);
      } else {
        console.error("Failed to load badges from API and JSON fallback");
        setAllBadges([]);
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
        } else {
          setAllBadges([]);
        }
      } catch (jsonError) {
        console.error("Error loading badges JSON:", jsonError);
        setAllBadges([]);
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
      } else {
        console.error("Failed to fetch user badges:", data.error);
        setUserBadges([]);
        setEarnedBadgeIds(new Set());
      }
    } catch (error) {
      console.error("Error fetching user badges:", error);
      setUserBadges([]);
      setEarnedBadgeIds(new Set());
    }
  };

  const checkAllBadges = async () => {
    try {
      const response = await fetch("/api/badges/check/all", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok && data.totalEarned > 0) {
        // Yeni rozetler kazanıldı, kullanıcı rozetlerini yeniden yükle
        await fetchUserBadges();
      }
    } catch (error) {
      // Sessizce hata yok say (kullanıcı deneyimini bozmamak için)
      console.error("Error checking all badges:", error);
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
      <Card variant="elevated" className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 border border-purple-200/50 dark:border-purple-800/50">
        <CardContent className="p-8 md:p-12">
          {/* Header with Trophy Icon */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-300/30 dark:bg-purple-400/30 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-8 w-8 text-purple-200 dark:text-purple-300" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-2">
                Rozetler
              </h1>
              <p className="text-purple-100 dark:text-purple-200 text-lg font-medium">
                Başarılarınızı rozetlerle taçlandırın ve ödüller kazanın!
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card variant="elevated" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 rounded-xl">
              <CardContent className="p-4 pt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-300/20 dark:bg-purple-400/20 flex items-center justify-center flex-shrink-0">
                  <Medal className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kazandığınız Rozetler</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {earnedCount} / {totalBadges}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 rounded-xl">
              <CardContent className="p-4 pt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-300/20 dark:bg-purple-400/20 flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-purple-500 dark:text-purple-400" />
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
            <h3 className="text-lg font-semibold text-purple-100 dark:text-purple-200 mb-2">
              Rozetler nedir?
            </h3>
            <p className="text-purple-100/90 dark:text-purple-200/90">
              Platformdaki aktivitelerinizi tamamlayarak rozetler kazanabilirsiniz. Her rozet size puan kazandırır ve bu puanlar aylık sıralamada yer almanızı sağlar. Rozetlerinizi kazanmak için test çözün, kurslar tamamlayın, sosyal paylaşımlar yapın ve düzenli olarak aktif olun!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Reward System */}
      <Card variant="elevated" className="border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40">
        <CardHeader className="flex flex-col space-y-1.5 p-6 border-b border-purple-200/50 dark:border-purple-800/50">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            <Crown className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            Aylık Ödül Sistemi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Aylık sıralamada rozetlerden kazandığınız puanlarla ilk 3&apos;e girenlere para ödülü verilir!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="lux-glow reward-card-shine flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 border-transparent shadow-[0_22px_48px_-28px_rgba(79,70,229,0.9)] ring-2 ring-blue-400/60 min-h-[140px]">
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-sm text-white/90 mb-1">1. Sıra</p>
                <p className="text-2xl font-bold text-white">10.000 TL</p>
              </div>
            </div>
            <div className="lux-glow reward-card-shine flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 border-transparent shadow-[0_22px_48px_-28px_rgba(217,119,6,0.9)] ring-2 ring-amber-400/60 min-h-[140px]">
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Medal className="h-6 w-6 text-white" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-sm text-white/90 mb-1">2. Sıra</p>
                <p className="text-2xl font-bold text-white">7.500 TL</p>
              </div>
            </div>
            <div className="lux-glow reward-card-shine flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 border-transparent shadow-[0_22px_48px_-28px_rgba(251,146,60,0.9)] ring-2 ring-orange-400/60 min-h-[140px]">
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-sm text-white/90 mb-1">3. Sıra</p>
                <p className="text-2xl font-bold text-white">5.000 TL</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Badges Collection */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            {selectedCategory ? (
              <Card variant="elevated" className={`bg-gradient-to-r ${categories.find((c) => c.id === selectedCategory)?.gradient || "from-gray-500 to-gray-600"} border-0 shadow-md`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2 pt-4">
                    {(() => {
                      const category = categories.find((c) => c.id === selectedCategory);
                      const IconComponent = category?.icon || Medal;
                      return (
                        <IconComponent className="h-6 w-6 text-white flex-shrink-0" />
                      );
                    })()}
                    <h2 className="text-2xl font-bold text-white">
                      {categories.find((c) => c.id === selectedCategory)?.name || "Tüm Rozetler"}
                    </h2>
                  </div>
                  <p className="text-sm text-white/90">
                    {categories.find((c) => c.id === selectedCategory)?.description}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Tüm Rozetler
                  </h2>
                </div>
              </div>
            )}
          </div>
          {filteredBadges.length > 0 ? (
            <div className="space-y-8">
              {(["bronze", "silver", "gold", "platinum", "other"] as const).map((tier) => {
                const tierBadges = badgesByTier[tier] || [];
                if (tierBadges.length === 0) return null;

                const earnedInTier = tierBadges.filter((b) => earnedBadgeIds.has(b.id)).length;

                return (
                  <div key={tier} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {tierNames[tier]}
                      </h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {earnedInTier} / {tierBadges.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {tierBadges.map((badge) => (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          earned={earnedBadgeIds.has(badge.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card variant="elevated">
              <CardContent className="py-12 text-center">
                <Medal className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                  {loading ? "Rozetler yükleniyor..." : "Henüz rozet bulunamadı"}
                </p>
                {!loading && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {selectedCategory
                      ? "Bu kategoride henüz rozet bulunmuyor."
                      : "Sistemde henüz rozet tanımlanmamış."}
                  </p>
                )}
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
                {categoryStats.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="flex flex-col space-y-1.5">
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.gradient} text-white shadow-md`
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className={`h-5 w-5 flex-shrink-0 ${
                              selectedCategory === category.id
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }`} />
                            <span className="font-medium text-base">
                              {category.name}
                            </span>
                          </div>
                          <span className={`text-sm font-medium ${
                            selectedCategory === category.id
                              ? "text-white/90"
                              : "text-gray-600 dark:text-gray-400"
                          }`}>
                            {category.earned} / {category.total}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

