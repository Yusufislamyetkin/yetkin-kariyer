"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useCelebration } from "@/app/contexts/CelebrationContext";
import { useBadgeNotification } from "@/app/contexts/BadgeNotificationContext";

/**
 * Hook to check if daily strike was completed and show celebration notification
 * Uses LocalStorage to prevent showing notification multiple times per day
 * Queues strike notification if badge notification is active
 */
export function useStrikeCompletionCheck() {
  const { data: session } = useSession();
  const { celebrate } = useCelebration();
  const { currentBadge } = useBadgeNotification();
  const [pendingStrike, setPendingStrike] = useState<{
    title: string;
    message: string;
    variant: "success";
    durationMs: number;
  } | null>(null);
  const hasShownStrikeRef = useRef(false);

  // Check if there's an active badge notification
  const hasActiveBadge = currentBadge !== null;

  // Show pending strike notification when badge is dismissed
  useEffect(() => {
    if (!hasActiveBadge && pendingStrike && !hasShownStrikeRef.current) {
      // Small delay to ensure badge modal is fully closed
      const timer = setTimeout(() => {
        celebrate(pendingStrike);
        hasShownStrikeRef.current = true;
        setPendingStrike(null);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [hasActiveBadge, pendingStrike, celebrate]);

  const checkStrikeCompletion = useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id as string;
    const today = new Date();
    const todayDateStr = today.toISOString().split("T")[0];
    const storageKey = `strike_notification_${userId}_${todayDateStr}`;

    // Check if notification was already shown today
    if (typeof window !== "undefined") {
      const alreadyShown = localStorage.getItem(storageKey);
      if (alreadyShown === "true") {
        return; // Already shown today
      }
    }

    try {
      const response = await fetch("/api/strike");
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      
      // Check if strike was newly completed
      if (data.isNewlyCompleted === true) {
        const strikeNotification = {
          title: "🎉 Günlük Strike Tamamlandı!",
          message: "Tüm görevleri tamamlayarak 100+ puan kazandınız!",
          variant: "success" as const,
          durationMs: 6000,
        };

        // If there's an active badge, queue the strike notification
        if (hasActiveBadge) {
          setPendingStrike(strikeNotification);
        } else {
          // No active badge, show strike notification immediately
          celebrate(strikeNotification);
          hasShownStrikeRef.current = true;

          // Mark as shown in LocalStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, "true");
          }
        }
      }
    } catch (error) {
      console.error("Error checking strike completion:", error);
    }
  }, [session?.user?.id, celebrate, hasActiveBadge]);

  // Mark strike as shown in localStorage when it's displayed
  useEffect(() => {
    if (hasShownStrikeRef.current && session?.user?.id) {
      const userId = session.user.id as string;
      const today = new Date();
      const todayDateStr = today.toISOString().split("T")[0];
      const storageKey = `strike_notification_${userId}_${todayDateStr}`;
      
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, "true");
      }
    }
  }, [hasShownStrikeRef.current, session?.user?.id]);

  return { checkStrikeCompletion };
}

