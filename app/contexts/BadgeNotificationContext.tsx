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
import { useCelebration } from "@/app/contexts/CelebrationContext";

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
  const { celebrate } = useCelebration();
  const confettiTriggeredRef = useRef<Set<string>>(new Set());

  const currentBadge = useMemo(() => {
    return badgeQueue.length > 0 && currentIndex < badgeQueue.length
      ? badgeQueue[currentIndex]
      : null;
  }, [badgeQueue, currentIndex]);

  const totalCount = badgeQueue.length;

  // Trigger confetti when a new badge is shown
  useEffect(() => {
    if (currentBadge && isVisible) {
      const badgeId = currentBadge.id;
      
      // Only trigger confetti once per badge
      if (!confettiTriggeredRef.current.has(badgeId)) {
        confettiTriggeredRef.current.add(badgeId);
        
        // Trigger confetti celebration
        celebrate({
          title: "Rozet Kazandın!",
          message: `${currentBadge.icon} ${currentBadge.name}`,
          variant: "badge",
          durationMs: 3000,
        });
      }
    }
  }, [currentBadge, isVisible, celebrate]);

  const showBadges = useCallback((badges: Badge[]) => {
    if (!badges || badges.length === 0) {
      return;
    }

    // Reset confetti tracking for new badges
    confettiTriggeredRef.current.clear();

    // Add badges to queue
    setBadgeQueue(badges);
    setCurrentIndex(0);
    setIsVisible(true);
  }, []);

  const nextBadge = useCallback(() => {
    if (currentIndex < badgeQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All badges shown, dismiss
      dismiss();
    }
  }, [currentIndex, badgeQueue.length]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    // Clear queue after animation
    setTimeout(() => {
      setBadgeQueue([]);
      setCurrentIndex(0);
      confettiTriggeredRef.current.clear();
    }, 300);
  }, []);

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

