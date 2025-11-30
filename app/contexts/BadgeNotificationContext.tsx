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
            spread: 70,
            ticks: 100, // Reduced from 150 for shorter animation
            gravity: 1.0, // Slightly increased for faster fall
            startVelocity: 35, // Slightly reduced
            scalar: 1.0, // Reduced from 1.2 for smaller particles
            zIndex: 1200,
            useWorker: true, // Use web worker if available
          };

          // Optimized confetti with fewer particles and bursts for better performance
          // Use requestIdleCallback for better performance when available
          const scheduleConfetti = (callback: () => void) => {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(callback, { timeout: 100 });
            } else {
              requestAnimationFrame(callback);
            }
          };

          scheduleConfetti(() => {
            // Main burst from center - reduced particles for better performance
            instance({
              ...defaults,
              particleCount: 50, // Reduced from 100
              origin: { x: 0.5, y: 0.5 },
              spread: 60,
              ticks: 100, // Reduced from 150 for shorter animation
              colors: ["#FFD700", "#FFA500", "#FF6347"],
            });
            
            // Side bursts (delayed for effect but fewer particles)
            setTimeout(() => {
              instance({
                ...defaults,
                particleCount: 40, // Reduced from 80
                origin: { x: 0.3, y: 0.7 },
                angle: 45,
                spread: 50,
                ticks: 100, // Reduced from 150
                colors: ["#FFD700", "#FFA500"],
              });
              instance({
                ...defaults,
                particleCount: 40, // Reduced from 80
                origin: { x: 0.7, y: 0.7 },
                angle: 135,
                spread: 50,
                ticks: 100, // Reduced from 150
                colors: ["#FFD700", "#FFA500"],
              });
            }, 100); // Reduced delay from 150ms
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

    // Remove duplicates by id (keep first occurrence)
    const seenIds = new Set<string>();
    const uniqueBadges = validBadges.filter((badge) => {
      if (seenIds.has(badge.id)) {
        console.warn(`[BadgeNotificationContext] Duplicate badge detected, skipping: ${badge.id} - ${badge.name}`);
        return false;
      }
      seenIds.add(badge.id);
      return true;
    });

    if (uniqueBadges.length === 0) {
      console.warn("[BadgeNotificationContext] No unique badges to show after deduplication");
      return;
    }

    console.log("[BadgeNotificationContext] Showing unique badges:", uniqueBadges);

    // Reset confetti tracking for new badges
    confettiTriggeredRef.current.clear();

    // Add badges to queue
    setBadgeQueue(uniqueBadges);
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
    setCurrentIndex((prev) => {
      if (prev < badgeQueue.length - 1) {
        return prev + 1;
      } else {
        // All badges shown, dismiss
        dismiss();
        return prev;
      }
    });
  }, [badgeQueue.length, dismiss]);

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

