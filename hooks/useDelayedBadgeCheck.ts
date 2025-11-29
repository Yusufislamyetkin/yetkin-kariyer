"use client";

import { useEffect, useRef } from "react";
import { useBadgeNotification } from "@/app/contexts/BadgeNotificationContext";

type ActivityType = "test" | "quiz" | "lesson" | "live-coding" | "bugfix" | "social";

interface UseDelayedBadgeCheckOptions {
  activityType: ActivityType;
  activityId?: string;
  completionTime: Date | string | null;
  enabled?: boolean;
  delayMs?: number;
}

/**
 * Hook to check for newly earned badges after an activity is completed
 * Waits for a delay (default 2.5s) then checks the database for badges earned around completion time
 */
export function useDelayedBadgeCheck({
  activityType,
  activityId,
  completionTime,
  enabled = true,
  delayMs = 2500,
}: UseDelayedBadgeCheckOptions) {
  const { showBadges } = useBadgeNotification();
  const processedBadgeIds = useRef<Set<string>>(new Set());
  const checkDoneRef = useRef(false);

  useEffect(() => {
    // Reset check done flag when activity changes
    if (activityId) {
      checkDoneRef.current = false;
    }
  }, [activityId]);

  useEffect(() => {
    if (!enabled || !completionTime || checkDoneRef.current) {
      return;
    }

    const completionDate = typeof completionTime === "string" 
      ? new Date(completionTime) 
      : completionTime;

    if (isNaN(completionDate.getTime())) {
      console.warn("[useDelayedBadgeCheck] Invalid completionTime:", completionTime);
      return;
    }

    const checkBadges = async () => {
      try {
        console.log("[useDelayedBadgeCheck] Checking for newly earned badges...", {
          activityType,
          activityId,
          completionTime: completionDate.toISOString(),
        });

        const response = await fetch("/api/badges/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityType,
            activityId,
            completionTime: completionDate.toISOString(),
          }),
        });

        if (!response.ok) {
          console.warn("[useDelayedBadgeCheck] Badge check failed:", response.status);
          return;
        }

        const data = await response.json();
        console.log("[useDelayedBadgeCheck] Badge check result:", {
          newlyEarnedCount: data.newlyEarnedBadges?.length || 0,
          badges: data.newlyEarnedBadges,
        });

        const newBadges = data.newlyEarnedBadges || [];
        if (newBadges.length > 0) {
          // Filter out already processed badges
          const unprocessedBadges = newBadges.filter(
            (badge: any) => badge && badge.id && !processedBadgeIds.current.has(badge.id)
          );

          if (unprocessedBadges.length > 0) {
            console.log("[useDelayedBadgeCheck] Showing newly earned badges:", unprocessedBadges);
            // Mark badges as processed
            unprocessedBadges.forEach((badge: any) => {
              if (badge?.id) {
                processedBadgeIds.current.add(badge.id);
              }
            });

            // Show badges in notification modal
            showBadges(unprocessedBadges);
          } else {
            console.log("[useDelayedBadgeCheck] All badges already processed");
          }
        } else {
          console.log("[useDelayedBadgeCheck] No newly earned badges found");
        }
      } catch (error) {
        console.error("[useDelayedBadgeCheck] Error checking badges:", error);
        // Silently fail - this is a background check
      } finally {
        checkDoneRef.current = true;
      }
    };

    // Wait for the specified delay
    const timer = setTimeout(() => {
      checkBadges();
    }, delayMs);

    return () => clearTimeout(timer);
  }, [activityType, activityId, completionTime, enabled, delayMs, showBadges]);
}

