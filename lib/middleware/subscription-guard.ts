import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUserSubscription } from "@/lib/services/subscription-service";

/**
 * API route handler'larında abonelik kontrolü yapan wrapper fonksiyon
 * @param handler API route handler fonksiyonu
 * @returns Wrapped handler
 */
export function requireSubscription<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized", redirectTo: "/login" },
          { status: 401 }
        );
      }

      const userId = session.user.id as string;
      const subscription = await checkUserSubscription(userId);

      if (!subscription || !subscription.isActive) {
        return NextResponse.json(
          {
            error: "Abone değilsiniz. Lütfen bir abonelik planı seçin.",
            redirectTo: "/fiyatlandirma",
            requiresSubscription: true,
          },
          { status: 403 }
        );
      }

      // Abonelik varsa, handler'ı çalıştır
      return handler(...args);
    } catch (error) {
      console.error("[SUBSCRIPTION_GUARD] Error:", error);
      return NextResponse.json(
        { error: "Abonelik kontrolü yapılırken bir hata oluştu" },
        { status: 500 }
      );
    }
  };
}

/**
 * Abonelik kontrolü yapar ve boolean döner (redirect yapmaz)
 * @param userId Kullanıcı ID'si
 * @returns Abonelik aktifse true, değilse false
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await checkUserSubscription(userId);
    return subscription !== null && subscription.isActive;
  } catch (error) {
    console.error("[SUBSCRIPTION_GUARD] Error checking subscription:", error);
    return false;
  }
}
