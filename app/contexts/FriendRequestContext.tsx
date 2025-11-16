"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import { startSignalRConnection } from "@/lib/realtime/signalr-client";

type FriendshipEntry = {
  id: string;
  status: "pending" | "accepted" | "declined" | "blocked";
  direction: "incoming" | "outgoing";
  counterpart?: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
};

type FriendRequestContextValue = {
  friendRequestCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  lastUpdatedAt: number | null;
};

const FriendRequestContext = createContext<FriendRequestContextValue | undefined>(undefined);

export function FriendRequestProvider({ children }: { children: React.ReactNode }) {
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();
  const { data: session } = useSession();
  
  // Refs to avoid infinite loops in useCallback dependencies
  const lastUpdatedAtRef = useRef<number | null>(null);
  const previousCountRef = useRef<number>(0);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const fetchFriendRequestsRef = useRef<() => Promise<void>>();

  // lastUpdatedAt state'i değiştiğinde ref'i güncelle
  useEffect(() => {
    lastUpdatedAtRef.current = lastUpdatedAt;
  }, [lastUpdatedAt]);

  const fetchFriendRequests = useCallback(async () => {
    // Rate limiting: Eğer son 5 saniye içinde fetch yapıldıysa, skip et
    const now = Date.now();
    const lastFetch = lastUpdatedAtRef.current;
    if (lastFetch && now - lastFetch < 5000) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/friends", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Arkadaş istekleri alınamadı");
      }
      const data = await response.json();
      const friendships: FriendshipEntry[] = data.friendships ?? [];
      
      // Gelen ve bekleyen istekleri say
      const incomingPendingCount = friendships.filter(
        (friendship) => friendship.direction === "incoming" && friendship.status === "pending"
      ).length;
      
      // Yeni bir talep geldiğinde bildirim göster
      if (incomingPendingCount > previousCountRef.current && previousCountRef.current > 0) {
        const newRequests = friendships.filter(
          (friendship) => 
            friendship.direction === "incoming" && 
            friendship.status === "pending" &&
            friendship.counterpart
        );
        
        // En son gelen talebi göster
        const latestRequest = newRequests[newRequests.length - 1];
        if (latestRequest?.counterpart) {
          showNotification(
            "friend_request",
            "Yeni Arkadaşlık Talebi",
            `${latestRequest.counterpart.name || "Birisi"} size arkadaşlık talebi gönderdi.`,
            {
              duration: 7000,
              profileImage: latestRequest.counterpart.profileImage,
              actorName: latestRequest.counterpart.name || "Birisi",
              onClick: () => {
                router.push("/dashboard/friends");
              },
            }
          );
        }
      }
      
      setFriendRequestCount(incomingPendingCount);
      previousCountRef.current = incomingPendingCount;
      const timestamp = Date.now();
      lastUpdatedAtRef.current = timestamp;
      setLastUpdatedAt(timestamp);
    } catch (error) {
      console.error("[FRIEND_REQUEST_FETCH]", error);
      // Error durumunda mevcut count'u koru, sıfırlama
    } finally {
      setLoading(false);
    }
  }, [showNotification, router]);

  // Update ref when fetchFriendRequests changes
  useEffect(() => {
    fetchFriendRequestsRef.current = fetchFriendRequests;
  }, [fetchFriendRequests]);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  // SignalR listener for real-time friend request notifications
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id;
    let isMounted = true;
    let connection: signalR.HubConnection | null = null;

    const setupSignalRListener = async () => {
      try {
        // Pass userId to SignalR connection for backend authentication
        connection = await startSignalRConnection(userId);
        if (!connection || !isMounted) {
          console.warn("[FriendRequestContext] SignalR connection not available, falling back to polling only");
          return;
        }

        connectionRef.current = connection;

        // Listen for friend request notifications
        connection.on("FriendRequestReceived", (payload: {
          type: "friend_request";
          requesterId: string;
          requester: {
            id: string;
            name: string | null;
            profileImage: string | null;
          };
        }) => {
          if (!isMounted || !session?.user?.id) return;
          
          // Don't show if user sent request to themselves
          if (payload.requesterId === userId) return;

          // Show notification immediately
          showNotification(
            "friend_request",
            "Yeni Arkadaşlık İsteği",
            `${payload.requester.name || "Birisi"} size arkadaşlık isteği gönderdi`,
            {
              duration: 7000,
              onClick: () => {
                router.push("/dashboard/friends");
              },
            }
          );

          // Immediately refresh friend requests to update badge
          if (fetchFriendRequestsRef.current) {
            fetchFriendRequestsRef.current();
          }
        });

        // Listen for friend request accepted notifications
        connection.on("FriendRequestAccepted", (payload: {
          type: "friend_request_accepted";
          accepterId: string;
          accepter: {
            id: string;
            name: string | null;
            profileImage: string | null;
          };
        }) => {
          if (!isMounted || !session?.user?.id) return;
          
          // Show notification immediately
          showNotification(
            "success",
            "Arkadaşlık İsteği Kabul Edildi",
            `${payload.accepter.name || "Birisi"} gönderdiğiniz arkadaşlık isteğini kabul etti`,
            {
              duration: 7000,
              onClick: () => {
                router.push("/dashboard/friends");
              },
            }
          );

          // Immediately refresh friend requests to update badge
          if (fetchFriendRequestsRef.current) {
            fetchFriendRequestsRef.current();
          }
        });

        // Listen for connection errors
        connection.onclose((error) => {
          if (isMounted && error) {
            console.error("[FriendRequestContext] ❌ SignalR connection closed with error:", error);
            console.warn("[FriendRequestContext] ⚠️ Real-time friend request notifications disabled. Falling back to polling.");
          }
        });

        console.log(`[FriendRequestContext] ✅ SignalR setup completed for user ${userId}`);
      } catch (error) {
        console.error("[FriendRequestContext] ❌ SignalR setup failed:", error);
        if (error instanceof Error) {
          console.error("[FriendRequestContext] Error details:", error.message);
        }
        // SignalR bağlantısı başarısız olsa bile polling devam edecek
        // Bu sayede kullanıcı bildirimleri almaya devam edebilir (sadece real-time değil)
        console.log("[FriendRequestContext] ℹ️ Continuing with polling-based notifications");
      }
    };

    setupSignalRListener();

    return () => {
      isMounted = false;
      if (connection) {
        connection.off("FriendRequestReceived");
        connection.off("FriendRequestAccepted");
      }
    };
  }, [session?.user?.id, showNotification, router]);

  useEffect(() => {
    // SignalR bağlantısı başarısız olursa, polling devreye girer
    // Her 5 saniyede bir güncelle (daha hızlı bildirim için)
    // Not: SignalR çalışıyorsa anlık bildirim gelir, polling sadece yedek mekanizma
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchFriendRequests();
      }
    }, 5_000); // 5 saniye - SignalR başarısız olsa bile kabul edilebilir gecikme

    // Sayfa görünür olduğunda güncelle (debounce ile)
    let visibilityTimeout: NodeJS.Timeout | null = null;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Debounce: Eğer son 5 saniye içinde fetch yapıldıysa, bekle
        if (visibilityTimeout) {
          clearTimeout(visibilityTimeout);
        }
        visibilityTimeout = setTimeout(() => {
          fetchFriendRequests();
        }, 2000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchFriendRequests]);

  const value = useMemo<FriendRequestContextValue>(
    () => ({
      friendRequestCount,
      loading,
      refresh: fetchFriendRequests,
      lastUpdatedAt,
    }),
    [fetchFriendRequests, friendRequestCount, lastUpdatedAt, loading]
  );

  return <FriendRequestContext.Provider value={value}>{children}</FriendRequestContext.Provider>;
}

export function useFriendRequest() {
  const context = useContext(FriendRequestContext);
  if (!context) {
    throw new Error("useFriendRequest must be used within a FriendRequestProvider");
  }
  return context;
}

