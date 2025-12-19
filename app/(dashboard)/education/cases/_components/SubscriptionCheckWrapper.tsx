"use client";

import { useEffect } from "react";
import { checkSubscriptionAndRedirect } from "@/lib/utils/subscription-check";

export function SubscriptionCheckWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Abonelik kontrolü
    checkSubscriptionAndRedirect();
  }, []);

  return <>{children}</>;
}
