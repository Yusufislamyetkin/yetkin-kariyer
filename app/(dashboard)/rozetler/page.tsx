"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Medal, Info } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";
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

  // Use API badges or empty array
  const displayBadges = allBadges;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Rozetler
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Başarılarınızı rozetlerle taçlandırın ve ödüller kazanın!
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card variant="elevated" className="border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Medal className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Kazandığınız Rozetler
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {earnedCount} / {totalBadges}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Medal className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Toplam Puan
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {totalPoints}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card variant="elevated" className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Rozetler nedir?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Platformdaki aktivitelerinizi tamamlayarak rozetler kazanabilirsiniz. Her rozet farklı bir başarıyı temsil eder ve size puan kazandırır. Rozetlerinizi toplayarak ilerlemenizi takip edin ve yeni hedefler belirleyin!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Tüm Rozetler
        </h2>
        {displayBadges.length > 0 ? (
          <BadgeCollection
            badges={displayBadges}
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
    </div>
  );
}

