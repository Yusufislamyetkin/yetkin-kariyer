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
import confetti from "canvas-confetti";
import { CelebrationOverlay } from "@/app/components/celebration/CelebrationOverlay";

type CelebrationVariant = "success" | "goal" | "badge";

export interface CelebrationPayload {
  title?: string;
  message?: string;
  variant?: CelebrationVariant;
  durationMs?: number;
}

interface CelebrationState extends Required<CelebrationPayload> {
  id: number;
}

interface CelebrationContextValue {
  celebrate: (payload?: CelebrationPayload) => void;
  dismiss: () => void;
}

const defaultPayload: Required<CelebrationPayload> = {
  title: "Tebrikler!",
  message: "Harika bir başarı elde ettin.",
  variant: "success",
  durationMs: 5000,
};

const CelebrationContext = createContext<CelebrationContextValue | undefined>(undefined);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const idRef = useRef(0);
  const confettiInstanceRef = useRef<any>(null);
  const burstTimeoutsRef = useRef<number[]>([]);

  const clearBurstTimeouts = useCallback(() => {
    burstTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    burstTimeoutsRef.current = [];
  }, []);

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
      console.error("Confetti setup failed:", error);
      confettiInstanceRef.current = null;
    }

    return () => {
      try {
        confettiInstanceRef.current?.reset?.();
      } catch (error) {
        console.error("Confetti reset failed:", error);
      } finally {
        confettiInstanceRef.current = null;
      }
    };
  }, []);

  const triggerConfetti = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const instance = confettiInstanceRef.current ?? confetti;

    if (typeof instance !== "function") {
      return;
    }

    clearBurstTimeouts();

    const defaults = {
      disableForReducedMotion: true,
      spread: 90,
      ticks: 220,
      gravity: 0.85,
      startVelocity: 48,
      scalar: 1.4,
      zIndex: 1200,
    };

    const scheduleBurst = (callback: () => void, delay = 0) => {
      const timeoutId = window.setTimeout(() => {
        callback();
        burstTimeoutsRef.current = burstTimeoutsRef.current.filter((id) => id !== timeoutId);
      }, delay);

      burstTimeoutsRef.current.push(timeoutId);
    };

    const fire = (particleCount: number, options: Record<string, unknown>) => {
      try {
        instance({
          ...defaults,
          particleCount,
          ...options,
        });
      } catch (error) {
        console.error("Confetti trigger failed:", error);
      }
    };

    window.requestAnimationFrame(() => {
      fire(200, { origin: { x: 0.18, y: 0.82 }, angle: 60 });
      fire(200, { origin: { x: 0.82, y: 0.82 }, angle: 120 });

      scheduleBurst(() => {
        fire(260, {
          origin: { x: 0.5, y: 0.35 },
          spread: 130,
          startVelocity: 58,
          gravity: 0.7,
        });
      }, 160);

      scheduleBurst(() => {
        fire(180, {
          origin: { x: 0.5, y: 0.45 },
          spread: 110,
          startVelocity: 52,
          scalar: 1.2,
        });
      }, 320);
    });
  }, [clearBurstTimeouts]);

  const dismiss = useCallback(() => {
    clearBurstTimeouts();
    setCelebration(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [clearBurstTimeouts]);

  const celebrate = useCallback(
    (payload?: CelebrationPayload) => {
      const options = { ...defaultPayload, ...payload };
      idRef.current += 1;
      setCelebration({
        id: idRef.current,
        ...options,
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearBurstTimeouts();
      timeoutRef.current = window.setTimeout(() => {
        dismiss();
      }, options.durationMs);
    },
    [dismiss, clearBurstTimeouts]
  );

  useEffect(() => {
    if (!celebration) {
      return;
    }

    triggerConfetti();
  }, [celebration, triggerConfetti]);

  const value = useMemo(
    () => ({
      celebrate,
      dismiss,
    }),
    [celebrate, dismiss]
  );

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <CelebrationOverlay celebration={celebration} onDismiss={dismiss} />
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebration hook must be used within CelebrationProvider");
  }
  return context;
}

