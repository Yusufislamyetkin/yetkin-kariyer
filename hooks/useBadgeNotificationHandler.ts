"use client";

import { useBadgeNotification } from "@/app/contexts/BadgeNotificationContext";

interface BadgeCheckResult {
  newlyEarnedBadges?: any[];
  totalEarned?: number;
}

/**
 * Utility hook to handle badge notifications from API responses
 * Use this hook in components that make API calls that return badgeResults
 */
export function useBadgeNotificationHandler() {
  const { showBadges } = useBadgeNotification();

  const handleBadgeResults = (badgeResults?: BadgeCheckResult) => {
    if (badgeResults?.newlyEarnedBadges && badgeResults.newlyEarnedBadges.length > 0) {
      showBadges(badgeResults.newlyEarnedBadges);
    }
  };

  return { handleBadgeResults };
}

