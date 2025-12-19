"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CreditCard, CheckCircle, XCircle, Calendar, Crown, Zap, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { SubscriptionPlanType, SubscriptionStatus } from "@prisma/client";

interface SubscriptionInfoProps {
  userId: string;
}

export function SubscriptionInfo({ userId }: SubscriptionInfoProps) {
  const [subscription, setSubscription] = useState<{
    id: string;
    planType: SubscriptionPlanType;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, [userId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription/me");
      const data = await response.json();

      if (response.ok && data.subscription) {
        setSubscription(data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("[SubscriptionInfo] Error:", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (planType: SubscriptionPlanType) => {
    const planMap: Record<SubscriptionPlanType, string> = {
      TEMEL: "Temel",
      PRO: "Pro",
      VIP: "VIP",
    };
    return planMap[planType] || planType;
  };

  const getPlanIcon = (planType: SubscriptionPlanType) => {
    switch (planType) {
      case "VIP":
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case "PRO":
        return <Zap className="h-5 w-5 text-purple-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPlanColor = (planType: SubscriptionPlanType) => {
    switch (planType) {
      case "VIP":
        return "from-yellow-500 to-orange-500";
      case "PRO":
        return "from-purple-500 to-pink-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  if (loading) {
    return (
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Abonelik Bilgisi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription && subscription.isActive ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(subscription.planType)} flex items-center justify-center text-white shadow-lg`}>
                  {getPlanIcon(subscription.planType)}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {getPlanName(subscription.planType)} Plan
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Başlangıç Tarihi:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {format(new Date(subscription.startDate), "d MMMM yyyy", { locale: tr })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Bitiş Tarihi:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {format(new Date(subscription.endDate), "d MMMM yyyy", { locale: tr })}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Abonelik Yok
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aktif bir aboneliğiniz bulunmuyor
              </p>
            </div>
            <Link href="/fiyatlandirma">
              <Button variant="gradient" size="sm" className="w-full">
                Abonelik Planlarını Görüntüle
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
