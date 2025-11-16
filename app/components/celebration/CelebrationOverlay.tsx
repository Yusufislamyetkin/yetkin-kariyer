"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { CelebrationPayload } from "@/app/contexts/CelebrationContext";

interface CelebrationOverlayProps {
  celebration: (CelebrationPayload & { id: number }) | null;
  onDismiss: () => void;
}

const variantStyles: Record<string, string> = {
  success: "from-emerald-500/90 to-teal-500/90 border-emerald-300/60",
  goal: "from-blue-500/90 to-indigo-500/90 border-blue-300/60",
  badge: "from-amber-500/90 to-orange-500/90 border-amber-300/60",
};

export function CelebrationOverlay({ celebration, onDismiss }: CelebrationOverlayProps) {
  useEffect(() => {
    if (!celebration) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [celebration, onDismiss]);

  if (!celebration) {
    return null;
  }

  const style =
    variantStyles[celebration.variant ?? "success"] ?? variantStyles.success;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pointer-events-none"
      aria-live="assertive"
      role="status"
    >
      <div className="mt-24 w-full max-w-xl px-4 sm:px-6 pointer-events-auto animate-fade-in">
        <div
          className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl shadow-2xl text-white transition-all duration-300 ${style}`}
        >
          <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
          <div className="relative px-6 py-5 sm:px-8 sm:py-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg sm:text-xl font-display font-semibold tracking-wide">
                  {celebration.title}
                </p>
                <p className="text-sm sm:text-base text-white/90 mt-1 leading-relaxed">
                  {celebration.message}
                </p>
              </div>
              <button
                onClick={onDismiss}
                className="shrink-0 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors p-2"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

