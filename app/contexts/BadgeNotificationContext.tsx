"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BadgeNotificationModal } from "@/app/components/badges/BadgeNotificationModal";
import confetti from "canvas-confetti";

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
}

interface BadgeNotificationContextValue {
  showBadges: (badges: Badge[]) => void;
  currentBadge: Badge | null;
  currentIndex: number;
  totalCount: number;
  nextBadge: () => void;
  dismiss: () => void;
}

const BadgeNotificationContext = createContext<
  BadgeNotificationContextValue | undefined
>(undefined);

export function BadgeNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [badgeQueue, setBadgeQueue] = useState<Badge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const confettiTriggeredRef = useRef<Set<string>>(new Set());
  const confettiInstanceRef = useRef<any>(null);

  // Initialize confetti instance
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      confettiInstanceRef.current = confetti.create(undefined, {
        resize: true,
        useWorker: true,
      });
    } catch (error) {
      console.error("[BadgeNotificationContext] Confetti setup failed:", error);
      confettiInstanceRef.current = null;
    }

    return () => {
      try {
        confettiInstanceRef.current?.reset?.();
      } catch (error) {
        console.error("[BadgeNotificationContext] Confetti reset failed:", error);
      } finally {
        confettiInstanceRef.current = null;
      }
    };
  }, []);

  const currentBadge = useMemo(() => {
    return badgeQueue.length > 0 && currentIndex < badgeQueue.length
      ? badgeQueue[currentIndex]
      : null;
  }, [badgeQueue, currentIndex]);

  const totalCount = badgeQueue.length;

  // Trigger confetti when a new badge is shown
  // Note: We only trigger confetti directly, not the full celebration overlay
  // to avoid conflicts with existing celebrations (e.g., lesson completion)
  useEffect(() => {
    if (currentBadge && isVisible) {
      const badgeId = currentBadge.id;
      
      console.log("[BadgeNotificationContext] Current badge changed:", {
        badgeId,
        badgeName: currentBadge.name,
        isVisible,
        alreadyTriggered: confettiTriggeredRef.current.has(badgeId),
      });
      
      // Only trigger confetti once per badge
      if (!confettiTriggeredRef.current.has(badgeId)) {
        confettiTriggeredRef.current.add(badgeId);
        
        console.log("[BadgeNotificationContext] Triggering confetti for badge:", currentBadge.name);
        
        // Trigger confetti directly without celebration overlay
        // This avoids conflicts with existing celebrations
        const instance = confettiInstanceRef.current ?? confetti;
        
        if (typeof instance === "function") {
          const defaults = {
            disableForReducedMotion: true,
            spread: 90,
            ticks: 220,
            gravity: 0.85,
            startVelocity: 48,
            scalar: 1.4,
            zIndex: 1200,
          };

          // Badge-specific confetti with multiple bursts
          window.requestAnimationFrame(() => {
            // Multiple bursts from different positions for more celebration
            instance({
              ...defaults,
              particleCount: 300,
              origin: { x: 0.2, y: 0.8 },
              angle: 45,
              colors: ["#FFD700", "#FFA500", "#FF6347"],
            });
            instance({
              ...defaults,
              particleCount: 300,
              origin: { x: 0.8, y: 0.8 },
              angle: 135,
              colors: ["#FFD700", "#FFA500", "#FF6347"],
            });
            
            setTimeout(() => {
              instance({
                ...defaults,
                particleCount: 400,
                origin: { x: 0.5, y: 0.3 },
                spread: 150,
                startVelocity: 65,
                gravity: 0.6,
                colors: ["#FFD700", "#FFA500", "#FF6347", "#9370DB", "#00CED1"],
                scalar: 1.5,
              });
            }, 100);

            setTimeout(() => {
              instance({
                ...defaults,
                particleCount: 350,
                origin: { x: 0.3, y: 0.5 },
                spread: 120,
                startVelocity: 55,
                gravity: 0.7,
                colors: ["#FFD700", "#FFA500", "#FF6347"],
                scalar: 1.3,
              });
            }, 250);

            setTimeout(() => {
              instance({
                ...defaults,
                particleCount: 350,
                origin: { x: 0.7, y: 0.5 },
                spread: 120,
                startVelocity: 55,
                gravity: 0.7,
                colors: ["#FFD700", "#FFA500", "#FF6347"],
                scalar: 1.3,
              });
            }, 400);

            setTimeout(() => {
              instance({
                ...defaults,
                particleCount: 300,
                origin: { x: 0.5, y: 0.6 },
                spread: 140,
                startVelocity: 60,
                gravity: 0.65,
                colors: ["#FFD700", "#FFA500", "#FF6347", "#9370DB"],
                scalar: 1.4,
              });
            }, 550);
          });
        }
      } else {
        console.log("[BadgeNotificationContext] Confetti already triggered for badge:", badgeId);
      }
    }
  }, [currentBadge, isVisible]);

  const showBadges = useCallback((badges: Badge[]) => {
    console.log("[BadgeNotificationContext] showBadges called with:", badges);
    
    if (!badges || badges.length === 0) {
      console.log("[BadgeNotificationContext] No badges to show");
      return;
    }

    // Validate badges have required fields
    const validBadges = badges.filter((badge) => {
      const isValid = badge && badge.id && badge.name && badge.icon;
      if (!isValid) {
        console.warn("[BadgeNotificationContext] Invalid badge:", badge);
      }
      return isValid;
    });

    if (validBadges.length === 0) {
      console.warn("[BadgeNotificationContext] No valid badges to show");
      return;
    }

    console.log("[BadgeNotificationContext] Showing badges:", validBadges);

    // Reset confetti tracking for new badges
    confettiTriggeredRef.current.clear();

    // Add badges to queue
    setBadgeQueue(validBadges);
    setCurrentIndex(0);
    setIsVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    // Clear queue after animation
    setTimeout(() => {
      setBadgeQueue([]);
      setCurrentIndex(0);
      confettiTriggeredRef.current.clear();
    }, 300);
  }, []);

  const nextBadge = useCallback(() => {
    if (currentIndex < badgeQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All badges shown, dismiss
      dismiss();
    }
  }, [currentIndex, badgeQueue.length, dismiss]);

  const value = useMemo(
    () => ({
      showBadges,
      currentBadge,
      currentIndex,
      totalCount,
      nextBadge,
      dismiss,
    }),
    [showBadges, currentBadge, currentIndex, totalCount, nextBadge, dismiss]
  );

  return (
    <BadgeNotificationContext.Provider value={value}>
      {children}
      {isVisible && currentBadge && (
        <BadgeNotificationModal
          badge={currentBadge}
          onNext={nextBadge}
          onDismiss={dismiss}
          currentIndex={currentIndex}
          totalCount={totalCount}
        />
      )}
    </BadgeNotificationContext.Provider>
  );
}

export function useBadgeNotification() {
  const context = useContext(BadgeNotificationContext);
  if (!context) {
    throw new Error(
      "useBadgeNotification must be used within BadgeNotificationProvider"
    );
  }
  return context;
}

