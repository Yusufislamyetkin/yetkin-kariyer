"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, Sparkles, Award, Share2, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useNotification } from "@/app/contexts/NotificationContext";

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
  progress?: {
    current: number;
    target: number;
    percentage: number;
    isCompleted: boolean;
  };
}

interface BadgeNotificationModalProps {
  badge: Badge | null;
  onNext: () => void;
  onDismiss: () => void;
  currentIndex: number;
  totalCount: number;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600",
};

const rarityBorders = {
  common: "border-gray-300 dark:border-gray-700",
  rare: "border-blue-300 dark:border-blue-700",
  epic: "border-purple-300 dark:border-purple-700",
  legendary: "border-yellow-300 dark:border-orange-700",
};

const tierNames = {
  bronze: "Başlangıç Seviye",
  silver: "Orta Seviye",
  gold: "İleri Seviye",
  platinum: "Efsanevi",
};

const tierColors = {
  bronze: "from-amber-600 to-orange-600",
  silver: "from-gray-400 to-gray-600",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-purple-400 to-pink-500",
};

export function BadgeNotificationModal({
  badge,
  onNext,
  onDismiss,
  currentIndex,
  totalCount,
}: BadgeNotificationModalProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const currentIndexRef = useRef(currentIndex);
  const totalCountRef = useRef(totalCount);

  // Keep refs in sync with props
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    totalCountRef.current = totalCount;
  }, [currentIndex, totalCount]);

  const handleNext = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      // Use refs to get current values, not closure values
      if (currentIndexRef.current < totalCountRef.current - 1) {
        onNext();
      } else {
        onDismiss();
      }
    }, 300);
  }, [onNext, onDismiss]);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [badge]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const handleShareAsPost = async () => {
    if (!badge?.id) return;

    setSharing(true);
    setShareError(null);

    try {
      const response = await fetch("/api/posts/share-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeId: badge.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rozet paylaşılırken bir hata oluştu");
      }

      // Show success notification
      showNotification(
        "success",
        "Başarılı!",
        "Rozet başarıyla post olarak paylaşıldı!",
        {
          duration: 5000,
        }
      );

      // Refresh page to show new post
      router.refresh();
      
      // Close modal after successful share
      handleDismiss();
    } catch (err: any) {
      setShareError(err.message || "Bir hata oluştu");
    } finally {
      setSharing(false);
    }
  };

  if (!badge || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      aria-live="assertive"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-modal-title"
    >
      {/* Backdrop - optimized for performance */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        style={{
          willChange: 'opacity',
          transform: 'translateZ(0)', // GPU acceleration
        }}
        onClick={handleDismiss}
      />

      {/* Modal - optimized for GPU acceleration */}
      <div
        className={`relative w-full max-w-md mx-4 pointer-events-auto transform transition-all duration-300 ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)', // GPU acceleration
        }}
      >
        <div
          className={`relative overflow-hidden rounded-3xl border shadow-2xl bg-gradient-to-br ${rarityColors[badge.rarity]} ${rarityBorders[badge.rarity]}`}
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)', // GPU acceleration
          }}
        >
          {/* Glow effect - optimized */}
          <div 
            className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.5),_transparent_70%)]"
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
          />
          
          {/* Animated sparkles - reduced for better performance */}
          {isAnimating && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping" 
                style={{ 
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              />
              <div 
                className="absolute top-20 right-16 w-1.5 h-1.5 bg-white rounded-full animate-ping" 
                style={{ 
                  animationDelay: "0.5s",
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }} 
              />
            </div>
          )}

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 space-y-6">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 shrink-0 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors p-2 z-10"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Yeni Rozet Kazandın!
                </p>
              </div>
              {totalCount > 1 && (
                <p className="text-xs text-white/80">
                  {currentIndex + 1} / {totalCount}
                </p>
              )}
            </div>

            {/* Badge Display */}
            <div className="flex flex-col items-center space-y-4">
              <div
                className={`relative transform transition-all duration-500 ${
                  isAnimating ? "scale-100 rotate-0" : "scale-0 rotate-180"
                }`}
                style={{ 
                  transitionDelay: "200ms",
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Glow ring - optimized */}
                <div
                  className={`absolute -inset-4 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-50 blur-xl ${
                    isAnimating ? 'animate-pulse' : ''
                  }`}
                  style={{
                    willChange: 'opacity',
                    transform: 'translateZ(0)',
                  }}
                />
                
                {/* Badge container - optimized */}
                <div 
                  className="relative w-40 h-40 rounded-3xl border-4 border-white/40 dark:border-white/20 bg-white/20 shadow-2xl overflow-hidden"
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${badge.color}dd, ${badge.color}88)`,
                      willChange: 'opacity',
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-80 mix-blend-screen"
                    style={{
                      willChange: 'opacity',
                    }}
                  />
                  
                  {/* Badge icon */}
                  <div className="relative h-full flex items-center justify-center">
                    <span 
                      className="text-7xl drop-shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                      }}
                    >
                      {badge.icon || "🏅"}
                    </span>
                  </div>
                  
                  {/* Shine effect - only when animating */}
                  {isAnimating && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine"
                      style={{
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                      }}
                    />
                  )}
                </div>

                {/* Rarity badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide bg-white/90 dark:bg-white/10 text-gray-900 dark:text-gray-50 shadow-lg border border-white/40 dark:border-white/10">
                    <Award className="h-3 w-3" />
                    {badge.rarity === "common" && "Klasik"}
                    {badge.rarity === "rare" && "Nadir"}
                    {badge.rarity === "epic" && "Efsanevi"}
                    {badge.rarity === "legendary" && "Mitik"}
                  </span>
                </div>
              </div>

              {/* Badge Info - optimized */}
              <div
                className={`text-center space-y-2 transform transition-all duration-500 ${
                  isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ 
                  transitionDelay: "400ms",
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              >
                <h3
                  id="badge-modal-title"
                  className="text-2xl font-bold text-white drop-shadow-lg"
                >
                  {badge.name}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed px-4">
                  {badge.description}
                </p>
                
                {/* Progress Information */}
                {badge.progress && badge.progress.target > 0 && !badge.progress.isCompleted && (
                  <div className="mt-3 space-y-2 px-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/80 font-medium">İlerleme</span>
                      <span className="text-white font-semibold">
                        {badge.progress.current} / {badge.progress.target}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full transition-all duration-300"
                        style={{ width: `${badge.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Points and Tier */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                    <Sparkles className="h-3 w-3" />
                    {badge.points} puan
                  </span>
                  {badge.tier && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-gradient-to-r ${tierColors[badge.tier]} text-white shadow-md`}
                    >
                      {tierNames[badge.tier]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share Error */}
            {shareError && (
              <div className="text-center">
                <p className="text-sm text-red-300">{shareError}</p>
              </div>
            )}

            {/* Action Buttons - optimized */}
            <div
              className={`flex items-center justify-center gap-3 pt-4 transform transition-all duration-500 ${
                isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ 
                transitionDelay: "600ms",
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            >
              <Button
                onClick={handleShareAsPost}
                disabled={sharing}
                variant="gradient"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                {sharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Paylaşılıyor...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Post Olarak Paylaş
                  </>
                )}
              </Button>
              {currentIndex < totalCount - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="gradient"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  Sıradaki Rozet ({currentIndex + 2}/{totalCount})
                </Button>
              ) : (
                <Button
                  onClick={handleDismiss}
                  variant="gradient"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  Harika!
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateZ(0);
          }
          100% {
            transform: translateX(100%) translateZ(0);
          }
        }
        .animate-shine {
          animation: shine 3s infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

