import { db } from "@/lib/db";
import { SubscriptionPlanType, SubscriptionStatus } from "@prisma/client";

export interface SubscriptionInfo {
  id: string;
  planType: SubscriptionPlanType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

/**
 * Kullanıcının aktif aboneliğini kontrol eder
 * @param userId Kullanıcı ID'si
 * @returns Aktif abonelik varsa SubscriptionInfo, yoksa null
 */
export async function checkUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: "active",
        endDate: {
          gte: new Date(), // Bitiş tarihi gelecekte olmalı
        },
      },
      orderBy: {
        endDate: "desc", // En son bitiş tarihine sahip olanı al
      },
    });

    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      planType: subscription.planType,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      isActive: isSubscriptionActive(subscription),
    };
  } catch (error) {
    console.error("[SUBSCRIPTION_SERVICE] Error checking subscription:", error);
    return null;
  }
}

/**
 * Kullanıcının abonelik bilgilerini döner (aktif veya pasif)
 * @param userId Kullanıcı ID'si
 * @returns Abonelik bilgisi veya null
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc", // En son oluşturulanı al
      },
    });

    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      planType: subscription.planType,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      isActive: isSubscriptionActive(subscription),
    };
  } catch (error) {
    console.error("[SUBSCRIPTION_SERVICE] Error getting subscription:", error);
    return null;
  }
}

/**
 * Aboneliğin aktif olup olmadığını kontrol eder
 * @param subscription Abonelik objesi
 * @returns Abonelik aktifse true, değilse false
 */
export function isSubscriptionActive(subscription: {
  status: SubscriptionStatus;
  endDate: Date;
}): boolean {
  if (subscription.status !== "active") {
    return false;
  }

  const now = new Date();
  return subscription.endDate >= now;
}

/**
 * Yeni abonelik oluşturur
 * @param userId Kullanıcı ID'si
 * @param planType Plan türü (TEMEL, PRO, VIP)
 * @param durationMonths Abonelik süresi (ay cinsinden, varsayılan 12)
 * @returns Oluşturulan abonelik
 */
export async function createSubscription(
  userId: string,
  planType: SubscriptionPlanType,
  durationMonths: number = 12
) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);

  // Eğer kullanıcının aktif bir aboneliği varsa, yeni abonelik mevcut aboneliğin bitiş tarihinden başlar
  const existingSubscription = await checkUserSubscription(userId);
  if (existingSubscription && existingSubscription.isActive) {
    startDate.setTime(existingSubscription.endDate.getTime());
    endDate.setTime(existingSubscription.endDate.getTime());
    endDate.setMonth(endDate.getMonth() + durationMonths);
  }

  const subscription = await db.subscription.create({
    data: {
      userId,
      planType,
      status: "active",
      startDate,
      endDate,
    },
  });

  return subscription;
}

/**
 * Aboneliği iptal eder
 * @param subscriptionId Abonelik ID'si
 */
export async function cancelSubscription(subscriptionId: string) {
  await db.subscription.update({
    where: { id: subscriptionId },
    data: { status: "cancelled" },
  });
}

/**
 * Süresi dolmuş abonelikleri expired olarak işaretler
 */
export async function expireOldSubscriptions() {
  const now = new Date();
  const result = await db.subscription.updateMany({
    where: {
      status: "active",
      endDate: {
        lt: now,
      },
    },
    data: {
      status: "expired",
    },
  });

  return result.count;
}
