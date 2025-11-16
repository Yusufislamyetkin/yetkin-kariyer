"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, MessageSquare, ThumbsUp, MessageCircle, Share2, Bell } from "lucide-react";

export type NotificationType = "friend_request" | "message" | "info" | "success" | "error" | "post_like" | "post_comment" | "post_share";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClick?: () => void;
  profileImage?: string | null;
  actorName?: string;
}

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(fadeInTimer);
  }, []);

  useEffect(() => {
    // Minimum 5 saniye (5000ms) garanti et
    const duration = Math.max(5000, notification.duration ?? 5000);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(notification.id), 300); // Wait for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onDismiss]);

  const getIcon = () => {
    const iconClass = "h-6 w-6";
    switch (notification.type) {
      case "friend_request":
        return <UserPlus className={iconClass} />;
      case "message":
        return <MessageSquare className={iconClass} />;
      case "post_like":
        return <ThumbsUp className={iconClass} />;
      case "post_comment":
        return <MessageCircle className={iconClass} />;
      case "post_share":
        return <Share2 className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case "friend_request":
        return {
          bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30",
          border: "border-blue-300 dark:border-blue-700",
          text: "text-blue-900 dark:text-blue-100",
          iconBg: "bg-blue-500 dark:bg-blue-600",
          shadow: "shadow-blue-200/50 dark:shadow-blue-900/30"
        };
      case "message":
        return {
          bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-900/30",
          border: "border-green-300 dark:border-green-700",
          text: "text-green-900 dark:text-green-100",
          iconBg: "bg-green-500 dark:bg-green-600",
          shadow: "shadow-green-200/50 dark:shadow-green-900/30"
        };
      case "post_like":
        return {
          bg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-900/30",
          border: "border-pink-300 dark:border-pink-700",
          text: "text-pink-900 dark:text-pink-100",
          iconBg: "bg-pink-500 dark:bg-pink-600",
          shadow: "shadow-pink-200/50 dark:shadow-pink-900/30"
        };
      case "post_comment":
        return {
          bg: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-900/30",
          border: "border-blue-300 dark:border-blue-700",
          text: "text-blue-900 dark:text-blue-100",
          iconBg: "bg-blue-500 dark:bg-blue-600",
          shadow: "shadow-blue-200/50 dark:shadow-blue-900/30"
        };
      case "post_share":
        return {
          bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-900/30",
          border: "border-purple-300 dark:border-purple-700",
          text: "text-purple-900 dark:text-purple-100",
          iconBg: "bg-purple-500 dark:bg-purple-600",
          shadow: "shadow-purple-200/50 dark:shadow-purple-900/30"
        };
      case "success":
        return {
          bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-900/30",
          border: "border-green-300 dark:border-green-700",
          text: "text-green-900 dark:text-green-100",
          iconBg: "bg-green-500 dark:bg-green-600",
          shadow: "shadow-green-200/50 dark:shadow-green-900/30"
        };
      case "error":
        return {
          bg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-900/30",
          border: "border-red-300 dark:border-red-700",
          text: "text-red-900 dark:text-red-100",
          iconBg: "bg-red-500 dark:bg-red-600",
          shadow: "shadow-red-200/50 dark:shadow-red-900/30"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
          border: "border-gray-200 dark:border-gray-800",
          text: "text-gray-900 dark:text-gray-100",
          iconBg: "bg-gray-500 dark:bg-gray-600",
          shadow: "shadow-gray-200/50 dark:shadow-gray-900/30"
        };
    }
  };

  const colors = getColors();

  const handleClick = () => {
    if (notification.onClick) {
      notification.onClick();
    }
  };

  // Profil fotoğrafı varsa ve hata yoksa onu göster, yoksa ikonu göster
  const hasProfileImage = notification.profileImage && !imageError;

  return (
    <div
      className={`relative flex items-start gap-2 sm:gap-3 rounded-xl border-2 ${colors.border} ${colors.bg} p-3 sm:p-4 ${colors.shadow} shadow-xl backdrop-blur-md transition-all duration-500 ease-out ${
        notification.onClick ? "cursor-pointer hover:scale-[1.02] hover:shadow-2xl" : ""
      } ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
      style={{ 
        minWidth: "280px", 
        maxWidth: "calc(100vw - 2rem)",
        width: "100%"
      }}
      onClick={handleClick}
    >
      {/* Profil fotoğrafı ve ikon */}
      <div className="relative shrink-0 flex items-center gap-2">
        {/* Profil fotoğrafı varsa göster */}
        {notification.profileImage && !imageError && (
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/50 dark:border-gray-700/50 shadow-lg">
            <img
              src={notification.profileImage || undefined}
              alt={notification.actorName || "Kullanıcı"}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {/* Tip ikonu - her zaman göster */}
        <div className={`relative ${colors.iconBg} rounded-xl p-2 sm:p-2.5 shadow-lg transition-transform duration-300 hover:scale-110`}>
          {isVisible && (
            <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: '1s', animationIterationCount: 2 }}></div>
          )}
          <div className="relative text-white drop-shadow-sm">
            {getIcon()}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-sm sm:text-base mb-1 sm:mb-1.5 ${colors.text}`}>
          {notification.title}
        </h4>
        <p className={`text-xs sm:text-sm ${colors.text} opacity-90 line-clamp-2 leading-relaxed`}>
          {notification.message}
        </p>
      </div>
      
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
          setTimeout(() => onDismiss(notification.id), 300);
        }}
        className={`shrink-0 rounded-full p-1.5 ${colors.text} opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:rotate-90`}
        aria-label="Kapat"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-2 sm:right-4 z-50 flex flex-col gap-2 sm:gap-3 pointer-events-none max-w-[calc(100vw-1rem)] sm:max-w-md">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <NotificationToast
            notification={notification}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
}

