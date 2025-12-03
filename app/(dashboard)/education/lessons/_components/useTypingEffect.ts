"use client";

import { useState, useEffect } from "react";

interface UseTypingEffectOptions {
  text: string;
  speed?: number; // Characters per interval
  interval?: number; // Milliseconds between updates
  enabled?: boolean; // Whether typing effect is enabled
}

export function useTypingEffect({
  text,
  speed = 2,
  interval = 30,
  enabled = true,
}: UseTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        // Add characters in chunks for better performance
        const nextIndex = Math.min(currentIndex + speed, text.length);
        setDisplayedText(text.slice(0, nextIndex));
        currentIndex = nextIndex;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [text, speed, interval, enabled]);

  return { displayedText, isTyping };
}

