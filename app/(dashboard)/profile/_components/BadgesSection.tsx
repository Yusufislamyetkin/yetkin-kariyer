"use client";

import { useState } from "react";
import { BadgeDisplay, BadgeCollection } from "@/app/components/badges/BadgeDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Trophy, Filter } from "lucide-react";

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
}

interface BadgesSectionProps {
  badges: Badge[];
  displayedBadges: Badge[];
}

export function BadgesSection({ badges, displayedBadges }: BadgesSectionProps) {
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  const earnedBadgeIds = new Set(
    badges.filter((b) => b.earnedAt).map((b) => b.id)
  );

  const filteredBadges =
    filter === "all"
      ? badges
      : filter === "earned"
      ? badges.filter((b) => b.earnedAt)
      : badges.filter((b) => !b.earnedAt);

  return (
    <div className="space-y-6">
      {/* Featured Badges */}
      {displayedBadges.length > 0 && (
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Öne Çıkan Rozetler
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  En son kazandığınız rozetler
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {displayedBadges.slice(0, 3).map((badge) => (
                <div key={badge.id} className="flex justify-center">
                  <BadgeDisplay badge={badge} earned={!!badge.earnedAt} size="lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Badges */}
      <Card variant="glass" className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Tüm Rozetler
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {badges.length} rozet
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Tümü
                </Button>
                <Button
                  variant={filter === "earned" ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setFilter("earned")}
                >
                  Kazanılan
                </Button>
                <Button
                  variant={filter === "locked" ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setFilter("locked")}
                >
                  Kilitli
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBadges.length > 0 ? (
            <BadgeCollection
              badges={filteredBadges}
              earnedBadgeIds={earnedBadgeIds}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {filter === "earned"
                  ? "Henüz rozet kazanmadınız"
                  : filter === "locked"
                  ? "Kilitli rozet bulunmuyor"
                  : "Rozet bulunamadı"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

