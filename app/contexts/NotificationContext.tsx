"use client";

import { createContext, useCallback, useContext, useState, useMemo } from "react";
import { Notification, NotificationType } from "@/app/components/notifications/NotificationToast";

type NotificationContextValue = {
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      onClick?: () => void;
      profileImage?: string | null;
      actorName?: string;
    }
  ) => void;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      options?: {
        duration?: number;
        onClick?: () => void;
        profileImage?: string | null;
        actorName?: string;
      }
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration: options?.duration,
        onClick: options?.onClick,
        profileImage: options?.profileImage,
        actorName: options?.actorName,
      };

      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      showNotification,
      notifications,
      dismissNotification,
    }),
    [showNotification, notifications, dismissNotification]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

