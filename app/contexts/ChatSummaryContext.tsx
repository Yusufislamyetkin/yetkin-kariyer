"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { startSignalRConnection, getSignalRConnection } from "@/lib/realtime/signalr-client";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";

type SummarySection = {
  unreadCount: number;
  channelIds: string[];
};

type SummaryResponse = {
  direct: SummarySection;
  groups: SummarySection;
  community: SummarySection;
};

type ChatSummaryContextValue = {
  directUnread: number;
  groupsUnread: number;
  communityUnread: number;
  loading: boolean;
  refresh: () => Promise<void>;
  lastUpdatedAt: number | null;
};

const ChatSummaryContext = createContext<ChatSummaryContextValue | undefined>(undefined);

async function postPresence(endpoint: string, body: string, useBeacon: boolean, retryCount: number = 0): Promise<void> {
  const MAX_RETRIES = 2;
  
  if (useBeacon && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    const sent = navigator.sendBeacon(endpoint, blob);
    if (!sent && retryCount < MAX_RETRIES) {
      // If sendBeacon failed, retry with fetch
      return postPresence(endpoint, body, false, retryCount + 1);
    }
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: useBeacon,
    });
    
    if (!response.ok) {
      // Only retry on server errors (5xx), not client errors (4xx)
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return postPresence(endpoint, body, useBeacon, retryCount + 1);
      }
      throw new Error(`Presence update failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    // Only retry on network errors, not on other errors
    if (retryCount < MAX_RETRIES && error instanceof TypeError && error.message.includes("fetch")) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return postPresence(endpoint, body, useBeacon, retryCount + 1);
    }
    throw error;
  }
}

export function ChatSummaryProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const summaryRef = useRef<SummaryResponse | null>(null);
  const currentPathRef = useRef<string>("");
  const lastUpdatedAtRef = useRef<number | null>(null);
  const pendingFetchRef = useRef<Promise<void> | null>(null);
  const fetchQueueRef = useRef<Array<() => Promise<void>>>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // lastUpdatedAt state'i değiştiğinde ref'i güncelle
  useEffect(() => {
    lastUpdatedAtRef.current = lastUpdatedAt;
  }, [lastUpdatedAt]);

  const sendPresence = useCallback(
    async (status: "online" | "offline", { useBeacon = false } = {}) => {
      const current = summaryRef.current;
      if (!current) return;

      const payload = JSON.stringify({ status });

      for (const channelId of current.direct.channelIds) {
        try {
          await postPresence(`/api/chat/direct/${channelId}/presence`, payload, useBeacon);
        } catch (error) {
          console.warn("[CHAT_SUMMARY_PRESENCE_DIRECT] Failed for channel", channelId, error);
        }
      }

      const allGroupIds = [...current.groups.channelIds, ...current.community.channelIds];

      for (const groupId of allGroupIds) {
        try {
          await postPresence(`/api/chat/groups/${groupId}/presence`, payload, useBeacon);
        } catch (error) {
          console.warn("[CHAT_SUMMARY_PRESENCE_GROUP] Failed for group", groupId, error);
        }
      }
    },
    []
  );

  const fetchSummary = useCallback(async (force: boolean = false) => {
    // Debounce mechanism: If called multiple times quickly, only execute after a short delay
    if (debounceTimerRef.current && !force) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // If a fetch is already in progress and not forcing, queue this request
    if (pendingFetchRef.current && !force) {
      return new Promise<void>((resolve) => {
        fetchQueueRef.current.push(async () => {
          // Use force=true to bypass pending check
          await fetchSummary(true);
          resolve();
        });
      });
    }

    const executeFetch = async () => {
      // If already fetching and not forcing, skip
      if (pendingFetchRef.current && !force) {
        return;
      }

      const fetchPromise = (async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/chat/summary", {
            cache: "no-store",
          });
          
          if (!response.ok) {
            throw new Error(`Sohbet özeti alınamadı: ${response.status}`);
          }
          
          const data = (await response.json()) as SummaryResponse;
          
          // Batch state updates - use ref for immediate access
          summaryRef.current = data;
          const timestamp = Date.now();
          lastUpdatedAtRef.current = timestamp;
          
          // Update state synchronously
          setSummary(data);
          setLastUpdatedAt(timestamp);
          
          // Send presence after state update
          await sendPresence("online");
          
          console.log("[ChatSummaryContext] ✅ Summary fetched successfully");
        } catch (error) {
          console.error("[CHAT_SUMMARY_FETCH]", error);
          
          // On error, keep the previous summary but log the error
          // Don't update state on error to avoid showing incorrect data
          
          // Retry mechanism for network errors (exponential backoff)
          if (error instanceof Error && (
            error.message.includes("fetch") || 
            error.message.includes("network") ||
            error.message.includes("Failed to fetch")
          )) {
            const retryDelay = 2000; // 2 seconds
            setTimeout(() => {
              // Only retry if no fetch is in progress
              if (!pendingFetchRef.current) {
                // Create a new fetch call with force=true
                const retryFetch = async () => {
                  try {
                    setLoading(true);
                    const response = await fetch("/api/chat/summary", {
                      cache: "no-store",
                    });
                    
                    if (!response.ok) {
                      throw new Error(`Sohbet özeti alınamadı: ${response.status}`);
                    }
                    
                    const data = (await response.json()) as SummaryResponse;
                    
                    summaryRef.current = data;
                    const timestamp = Date.now();
                    lastUpdatedAtRef.current = timestamp;
                    
                    setSummary(data);
                    setLastUpdatedAt(timestamp);
                    
                    await sendPresence("online");
                    console.log("[ChatSummaryContext] ✅ Summary fetched successfully on retry");
                  } catch (retryError) {
                    console.error("[CHAT_SUMMARY_FETCH] Retry failed:", retryError);
                  } finally {
                    setLoading(false);
                  }
                };
                
                retryFetch().catch(() => {
                  // Ignore retry errors
                });
              }
            }, retryDelay);
          }
        } finally {
          setLoading(false);
          pendingFetchRef.current = null;
          
          // Process next item in queue
          const nextInQueue = fetchQueueRef.current.shift();
          if (nextInQueue) {
            setTimeout(() => nextInQueue(), 100); // Small delay between queue items
          }
        }
      })();

      pendingFetchRef.current = fetchPromise;
      await fetchPromise;
    };

    if (force) {
      await executeFetch();
    } else {
      // Debounce: wait 100ms before executing
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        executeFetch().catch(() => {
          // Ignore errors
        });
      }, 100);
    }
  }, [sendPresence]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Global SignalR listener - yeni mesaj geldiğinde summary'yi hemen refresh et
  useEffect(() => {
    if (!userId) {
      return;
    }

    let connection: signalR.HubConnection | null = null;
    let isMounted = true;

    // Pathname'i takip et
    if (typeof window !== "undefined") {
      currentPathRef.current = window.location.pathname;
    }

    const setupGlobalListener = async () => {
      try {
        connection = await startSignalRConnection(userId);
        if (!connection || !isMounted) return;

        // ReceiveMessage event'ini global olarak dinle
        connection.on("ReceiveMessage", (payload: any) => {
          try {
            if (!isMounted) return;
            
            // Presence update'lerini ignore et - bunlar PresenceUpdate event'i ile handle ediliyor
            if (payload && payload.type === "presence") {
              return;
            }
            
            // Payload validasyonu
            if (!payload || !payload.message) {
              console.warn("[ChatSummaryContext] Invalid ReceiveMessage payload:", payload);
              return;
            }
            
            // Eğer kullanıcı o mesajın thread'inde değilse, summary'yi refresh et
            // Kullanıcı o sayfada değilse, mesaj okunmamış olarak kalmalı
            const isOnDirectChatPage = currentPathRef.current.startsWith("/chat/direct");
            const isOnGroupChatPage = currentPathRef.current.startsWith("/chat/groups") || currentPathRef.current.startsWith("/chat");
            
            // Eğer kullanıcı o thread'de değilse, summary'yi refresh et
            const shouldRefresh = !isOnDirectChatPage && !isOnGroupChatPage;
            
            if (shouldRefresh) {
              // Yeni mesaj geldiğinde summary'yi hemen refresh et
              // Minimal delay to ensure backend has processed the message
              if (isMounted && document.visibilityState === "visible") {
                fetchSummary(false).catch(() => {
                  // Ignore errors
                });
              }
            }
          } catch (error) {
            console.error("[ChatSummaryContext] Error handling ReceiveMessage:", error);
            if (error instanceof Error) {
              console.error("[ChatSummaryContext] Error details:", error.message, error.stack);
            }
          }
        });

        // SignalR reconnection sonrası presence heartbeat'i yeniden başlat
        connection.onreconnected(() => {
          if (!isMounted) return;
          console.log(`[ChatSummaryContext] ✅ SignalR reconnected, restarting presence heartbeat for user ${userId}`);
          if (document.visibilityState === "visible") {
            sendPresence("online");
          }
        });

        console.log(`[ChatSummaryContext] ✅ SignalR listener setup completed for user ${userId}`);
      } catch (error) {
        console.error("[ChatSummaryContext] ❌ SignalR setup failed:", error);
        if (error instanceof Error) {
          console.error("[ChatSummaryContext] Error details:", error.message);
          console.error("[ChatSummaryContext] Real-time summary updates will not work. Falling back to polling.");
        }
      }
    };

    setupGlobalListener();

    // Pathname değişikliklerini dinle - Next.js router event'lerini kullan
    const updatePath = () => {
      if (typeof window !== "undefined") {
        currentPathRef.current = window.location.pathname;
      }
    };
    
    if (typeof window !== "undefined") {
      // İlk path'i set et
      updatePath();
      
      // Popstate event'i (geri/ileri butonları)
      window.addEventListener("popstate", updatePath);
      
      // Next.js router değişikliklerini dinlemek için pushState/replaceState'i override et
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      window.history.pushState = function(...args) {
        originalPushState.apply(window.history, args);
        updatePath();
      };
      
      window.history.replaceState = function(...args) {
        originalReplaceState.apply(window.history, args);
        updatePath();
      };
      
    return () => {
      isMounted = false;
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", updatePath);
      if (connection) {
        try {
          connection.off("ReceiveMessage");
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      // Clear queue
      fetchQueueRef.current = [];
    };
    }

    return () => {
      isMounted = false;
      if (connection) {
        try {
          connection.off("ReceiveMessage");
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [fetchSummary, userId]);

  useEffect(() => {
    // Summary refresh - her 60 saniyede bir (SignalR mesajları zaten real-time)
    // Sadece sayfa görünür olduğunda ve SignalR bağlantısı yoksa polling yap
    const summaryInterval = setInterval(() => {
      if (document.visibilityState === "visible" && userId) {
        const connection = getSignalRConnection(userId);
        // Eğer SignalR bağlı değilse, polling yap
        if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
          fetchSummary();
        }
      }
    }, 60_000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSummary();
        sendPresence("online");
      } else {
        // Sayfa gizlendiğinde offline yap (tab değişimi, minimize vb.)
        sendPresence("offline", { useBeacon: true }).catch(() => {});
      }
    };

    // pagehide en güvenilir event (mobile ve modern tarayıcılarda)
    const handlePageHide = () => {
      sendPresence("offline", { useBeacon: true }).catch(() => {});
    };

    // beforeunload bazı durumlarda çalışmayabilir ama yine de ekliyoruz
    const handleBeforeUnload = () => {
      sendPresence("offline", { useBeacon: true }).catch(() => {});
    };

    // unload event'i de ekliyoruz (daha eski tarayıcı desteği için)
    const handleUnload = () => {
      sendPresence("offline", { useBeacon: true }).catch(() => {});
    };

    // Event-based presence: track user activity instead of heartbeat
    let activityDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleUserActivity = () => {
      if (document.visibilityState !== "visible") return;
      
      // Debounce presence updates to avoid excessive API calls (max once per 2.5 seconds)
      if (activityDebounceTimer) {
        clearTimeout(activityDebounceTimer);
      }
      
      activityDebounceTimer = setTimeout(() => {
        if (document.visibilityState === "visible") {
          sendPresence("online").catch((error) => {
            console.warn("[ChatSummaryContext] Presence update failed, will retry on next activity:", error);
          });
        }
      }, 2500); // Update presence at most once every 2.5 seconds
    };

    // Add event listeners for user activity
    window.addEventListener("scroll", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });
    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, { passive: true });

    // pagehide en güvenilir event (mobile ve modern tarayıcılarda)
    window.addEventListener("pagehide", handlePageHide, { capture: true });
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(summaryInterval);
      if (activityDebounceTimer) {
        clearTimeout(activityDebounceTimer);
      }
      window.removeEventListener("pagehide", handlePageHide, { capture: true });
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      sendPresence("offline", { useBeacon: true }).catch(() => {});
      // Clear debounce timer on cleanup
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [fetchSummary, sendPresence]);

  useEffect(() => {
    if (summary) {
      summaryRef.current = summary;
      sendPresence("online");
    }
  }, [summary, sendPresence]);

  // Calculate badge counts with proper state synchronization
  const badgeCounts = useMemo(() => {
    // Use ref value for immediate updates, fallback to state if ref is null
    const currentSummary = summaryRef.current ?? summary;
    return {
      directUnread: currentSummary?.direct.unreadCount ?? 0,
      groupsUnread: currentSummary?.groups.unreadCount ?? 0,
      communityUnread: currentSummary?.community.unreadCount ?? 0,
    };
  }, [summary, lastUpdatedAt]); // Include lastUpdatedAt to trigger recalculation when summary updates

  const value = useMemo<ChatSummaryContextValue>(
    () => ({
      directUnread: badgeCounts.directUnread,
      groupsUnread: badgeCounts.groupsUnread,
      communityUnread: badgeCounts.communityUnread,
      loading,
      refresh: fetchSummary,
      lastUpdatedAt,
    }),
    [badgeCounts.directUnread, badgeCounts.groupsUnread, badgeCounts.communityUnread, fetchSummary, lastUpdatedAt, loading]
  );

  return <ChatSummaryContext.Provider value={value}>{children}</ChatSummaryContext.Provider>;
}

export function useChatSummary() {
  const context = useContext(ChatSummaryContext);
  if (!context) {
    throw new Error("useChatSummary must be used within a ChatSummaryProvider");
  }
  return context;
}

