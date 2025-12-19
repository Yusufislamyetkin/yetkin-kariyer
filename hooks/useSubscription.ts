import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriptionPlanType, SubscriptionStatus } from "@prisma/client";

export interface SubscriptionInfo {
  id: string;
  planType: SubscriptionPlanType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export function useSubscription(options?: { redirectIfNoSubscription?: boolean }) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const { redirectIfNoSubscription = false } = options || {};

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [sessionStatus, session?.user?.id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription/check");
      const data = await response.json();

      if (response.ok) {
        setHasActiveSubscription(data.hasActiveSubscription);
        setSubscription(data.subscription);
        
        // Eğer abonelik yoksa ve redirect isteniyorsa yönlendir
        if (redirectIfNoSubscription && !data.hasActiveSubscription) {
          router.push("/subscription-required");
        }
      } else {
        setHasActiveSubscription(false);
        setSubscription(null);
      }
    } catch (error) {
      console.error("[useSubscription] Error:", error);
      setHasActiveSubscription(false);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    hasActiveSubscription,
    loading,
    refetch: fetchSubscription,
  };
}
