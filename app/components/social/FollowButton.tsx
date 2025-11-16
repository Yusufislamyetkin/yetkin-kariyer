"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollow: (userId: string) => Promise<{ following: boolean; followersCount: number }>;
  className?: string;
}

export function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  onFollow,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const previousFollowing = isFollowing;

    // Optimistic update
    setIsFollowing(!isFollowing);

    try {
      const result = await onFollow(userId);
      setIsFollowing(result.following);
    } catch (error) {
      // Revert on error
      setIsFollowing(previousFollowing);
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFollowing) {
    return (
      <Button
        onClick={handleFollow}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className={`border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10 dark:border-[#70b5f9] dark:text-[#70b5f9] dark:hover:bg-[#70b5f9]/10 ${className}`}
      >
        {isLoading ? "İşleniyor..." : "Bağlantıyı Kaldır"}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant="primary"
      size="sm"
      className={`bg-[#0a66c2] hover:bg-[#004182] text-white dark:bg-[#0a66c2] dark:hover:bg-[#004182] ${className}`}
    >
      {isLoading ? "İşleniyor..." : "Bağlantı Kur"}
    </Button>
  );
}

