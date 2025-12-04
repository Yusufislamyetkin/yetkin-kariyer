"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "./Button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "Başarılı!",
  message = "İşleminiz başarıyla tamamlandı.",
  buttonText = "Tamam",
  onButtonClick,
}: SuccessModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      document.body.style.overflow = "unset";
      setIsAnimating(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-gray-900 ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              {/* Outer ring animation */}
              <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>

          {/* Message */}
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {message}
          </p>

          {/* Button */}
          <Button
            onClick={handleButtonClick}
            className="w-full"
            variant="primary"
          >
            {buttonText}
          </Button>
        </div>

        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 opacity-20 -z-10" />
      </div>
    </div>
  );
}

