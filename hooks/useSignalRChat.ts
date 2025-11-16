import { useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { startSignalRConnection, getSignalRConnection, ensureConnected, waitForConnection } from "@/lib/realtime/signalr-client";
import { useSession } from "next-auth/react";

type ChatAttachmentType = "image" | "audio" | "video" | "file" | "gif";

type ChatMessagePayload = {
  message: {
    id: string;
    groupId: string;
    userId: string;
    type: "text" | ChatAttachmentType | "system";
    content: string | null;
    mentionIds: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    attachments: Array<{
      id: string;
      messageId: string;
      url: string;
      type: ChatAttachmentType;
      metadata: Record<string, unknown> | null;
      size: number | null;
      width: number | null;
      height: number | null;
      duration: number | null;
      createdAt: string;
    }>;
    readByUserIds: string[];
  };
  sender: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
};

type UseSignalRChatOptions = {
  groupId: string | null;
  onMessage?: (payload: ChatMessagePayload) => void;
  onUserTyping?: (userId: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onPresenceUpdate?: (data: { userId: string; status: "online" | "offline"; lastSeenAt: string }) => void;
  enabled?: boolean;
  userId?: string; // Optional: if not provided, will use session
};

// Global event listener'lar - sadece bir kez eklenir
let globalListenersSetup = false;
const activeGroupHandlers = new Map<string, UseSignalRChatOptions>();

/**
 * SignalR ile chat mesajlarını dinlemek için React hook
 */
export function useSignalRChat({
  groupId,
  onMessage,
  onUserTyping,
  onUserJoined,
  onUserLeft,
  onPresenceUpdate,
  enabled = true,
  userId: providedUserId,
}: UseSignalRChatOptions) {
  const { data: session } = useSession();
  const userId = providedUserId || session?.user?.id;
  
  const handlersRef = useRef({
    onMessage,
    onUserTyping,
    onUserJoined,
    onUserLeft,
    onPresenceUpdate,
    groupId,
  });

  // Handler'ları güncelle
  useEffect(() => {
    handlersRef.current = {
      onMessage,
      onUserTyping,
      onUserJoined,
      onUserLeft,
      onPresenceUpdate,
      groupId: groupId || null,
    };
  }, [onMessage, onUserTyping, onUserJoined, onUserLeft, onPresenceUpdate, groupId]);

  // Global event listener'ları bir kez kur (userId bazlı)
  useEffect(() => {
    if (!userId) {
      return;
    }

    if (globalListenersSetup) {
      return;
    }

    globalListenersSetup = true;

    const setupGlobalListeners = async () => {
      try {
        const connection = await startSignalRConnection(userId);
        if (!connection) {
          console.error(`[SignalR] Failed to establish connection for user ${userId}`);
          globalListenersSetup = false;
          return;
        }

        // Ensure connection is fully connected before adding event listeners
        try {
          await ensureConnected(connection);
        } catch (error) {
          console.error(`[SignalR] Failed to ensure connection for user ${userId}:`, error);
          globalListenersSetup = false;
          return;
        }

        // Only add event listeners after connection is confirmed connected
        if (connection.state !== signalR.HubConnectionState.Connected) {
          console.warn(`[SignalR] Connection not connected (state: ${connection.state}), skipping listener setup`);
          globalListenersSetup = false;
          return;
        }

        // ReceiveMessage event'ini dinle - tüm gruplar için
        connection.on("ReceiveMessage", (payload: ChatMessagePayload | { type: "presence"; userId: string; status: string; LastSeenAt?: string; lastSeenAt?: string }) => {
          try {
            // Presence update'lerini ignore et - bunlar PresenceUpdate event'i ile handle ediliyor
            if (payload && "type" in payload && payload.type === "presence") {
              return;
            }

            // Payload ve message validasyonu
            if (!payload || !("message" in payload) || !payload.message) {
              console.warn("[SignalR] Invalid ReceiveMessage payload:", payload);
              return;
            }

            const targetGroupId = payload.message.groupId;
            if (!targetGroupId) {
              console.warn("[SignalR] ReceiveMessage payload missing groupId:", payload);
              return;
            }

            const handlers = activeGroupHandlers.get(targetGroupId);
            if (handlers?.onMessage) {
              console.log(`[SignalR] Received message for group ${targetGroupId}`);
              handlers.onMessage(payload);
            } else {
              console.warn(`[SignalR] No handler found for group ${targetGroupId}`);
            }
          } catch (error) {
            console.error("[SignalR] Error handling ReceiveMessage:", error);
            if (error instanceof Error) {
              console.error("[SignalR] Error details:", error.message, error.stack);
            }
          }
        });

        // UserTyping event'ini dinle
        connection.on("UserTyping", (data: { userId: string; groupId: string }) => {
          try {
            if (!data || !data.groupId) {
              console.warn("[SignalR] Invalid UserTyping data:", data);
              return;
            }
            const handlers = activeGroupHandlers.get(data.groupId);
            if (handlers?.onUserTyping) {
              handlers.onUserTyping(data.userId);
            }
          } catch (error) {
            console.error("[SignalR] Error handling UserTyping:", error);
          }
        });

        // UserJoined event'ini dinle
        connection.on("UserJoined", (data: { userId: string; groupId: string }) => {
          try {
            if (!data || !data.groupId) {
              console.warn("[SignalR] Invalid UserJoined data:", data);
              return;
            }
            const handlers = activeGroupHandlers.get(data.groupId);
            if (handlers?.onUserJoined) {
              handlers.onUserJoined(data.userId);
            }
          } catch (error) {
            console.error("[SignalR] Error handling UserJoined:", error);
          }
        });

        // UserLeft event'ini dinle (hem UserLeft hem de userleft destekle - backend uyumsuzluğu için)
        const handleUserLeft = (data: { userId: string; groupId: string }) => {
          try {
            if (!data || !data.groupId) {
              console.warn("[SignalR] Invalid UserLeft data:", data);
              return;
            }
            const handlers = activeGroupHandlers.get(data.groupId);
            if (handlers?.onUserLeft) {
              handlers.onUserLeft(data.userId);
            }
          } catch (error) {
            console.error("[SignalR] Error handling UserLeft:", error);
          }
        };
        connection.on("UserLeft", handleUserLeft);
        // Backend'den küçük harf ile gelebilir
        connection.on("userleft", handleUserLeft);

        // PresenceUpdate event'ini dinle - tüm gruplar için
        connection.on("PresenceUpdate", (data: { userId: string; groupId: string; status: "online" | "offline"; lastSeenAt: string }) => {
          try {
            if (!data || !data.groupId) {
              console.warn("[SignalR] Invalid PresenceUpdate data:", data);
              return;
            }
            const handlers = activeGroupHandlers.get(data.groupId);
            if (handlers?.onPresenceUpdate) {
              handlers.onPresenceUpdate({
                userId: data.userId,
                status: data.status,
                lastSeenAt: data.lastSeenAt,
              });
            }
          } catch (error) {
            console.error("[SignalR] Error handling PresenceUpdate:", error);
          }
        });

        // Bağlantı durumunu logla
        connection.onreconnecting((error) => {
          console.log("[SignalR] Reconnecting...", error);
        });

        connection.onreconnected(async (connectionId) => {
          console.log(`[SignalR] Reconnected for user ${userId}. Connection ID:`, connectionId);
          
          // Wait a bit for the connection to stabilize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Yeniden bağlandığında aktif gruplara tekrar katıl
          const currentConnection = getSignalRConnection(userId);
          if (currentConnection) {
            try {
              await ensureConnected(currentConnection);
              
              // Rejoin all active groups
              const rejoinPromises = Array.from(activeGroupHandlers.keys()).map(async (activeGroupId) => {
                const maxRetries = 3;
                let attempt = 0;
                
                while (attempt < maxRetries) {
                  try {
                    if (currentConnection.state === signalR.HubConnectionState.Connected) {
                      await currentConnection.invoke("JoinGroup", activeGroupId);
                      console.log(`[SignalR] ✅ Rejoined group: ${activeGroupId}`);
                      return;
                    } else {
                      await waitForConnection(currentConnection, 2000);
                      attempt++;
                    }
                  } catch (err) {
                    attempt++;
                    if (attempt < maxRetries) {
                      console.warn(`[SignalR] Failed to rejoin group ${activeGroupId} (attempt ${attempt}/${maxRetries}), retrying...`);
                      await new Promise(resolve => setTimeout(resolve, 500 * attempt));
                    } else {
                      console.error(`[SignalR] Failed to rejoin group ${activeGroupId} after ${maxRetries} attempts:`, err);
                    }
                  }
                }
              });
              
              await Promise.all(rejoinPromises);
            } catch (error) {
              console.error(`[SignalR] Failed to ensure connection after reconnection:`, error);
            }
          }
        });

        connection.onclose((error) => {
          console.error("[SignalR] Connection closed", error);
          globalListenersSetup = false;
        });
      } catch (error) {
        console.error("[SignalR] Global listeners setup failed:", error);
        globalListenersSetup = false;
      }
    };

    setupGlobalListeners();
  }, [userId]);

  // Handler'ları güncelle (groupId değişmeden handler'lar değişebilir)
  useEffect(() => {
    if (!groupId || !enabled) {
      return;
    }

    // Handler'ları güncelle
    if (activeGroupHandlers.has(groupId)) {
      activeGroupHandlers.set(groupId, {
        groupId,
        onMessage: handlersRef.current.onMessage,
        onUserTyping: handlersRef.current.onUserTyping,
        onUserJoined: handlersRef.current.onUserJoined,
        onUserLeft: handlersRef.current.onUserLeft,
        onPresenceUpdate: handlersRef.current.onPresenceUpdate,
        enabled,
      });
    }
  }, [onMessage, onUserTyping, onUserJoined, onUserLeft, onPresenceUpdate, groupId, enabled]);

  // Gruba katılma/ayrılma
  useEffect(() => {
    if (!groupId || !enabled || !userId) {
      return;
    }

    let isMounted = true;
    let currentGroupId = groupId;

    const joinGroup = async () => {
      try {
        const connection = await startSignalRConnection(userId);
        if (!connection || !isMounted || currentGroupId !== groupId) {
          return;
        }

        // Ensure connection is connected before joining group
        try {
          await ensureConnected(connection);
        } catch (error) {
          console.error(`[SignalR] Connection failed to establish for group ${groupId}:`, error);
          return;
        }

        // Handler'ları kaydet
        activeGroupHandlers.set(groupId, {
          groupId,
          onMessage: handlersRef.current.onMessage,
          onUserTyping: handlersRef.current.onUserTyping,
          onUserJoined: handlersRef.current.onUserJoined,
          onUserLeft: handlersRef.current.onUserLeft,
          onPresenceUpdate: handlersRef.current.onPresenceUpdate,
          enabled,
        });

        // Gruba katıl - bağlantı durumunu tekrar kontrol et
        if (connection.state === signalR.HubConnectionState.Connected) {
          await connection.invoke("JoinGroup", groupId);
          console.log(`[SignalR] Joined group: ${groupId}`);
        } else {
          console.warn(`[SignalR] Connection lost before joining group ${groupId}`);
        }
      } catch (error) {
        console.error(`[SignalR] Failed to join group ${groupId}:`, error);
        // Hata mesajını daha detaylı logla
        if (error instanceof Error) {
          if (error.message.includes("no connection with that id")) {
            console.error(`[SignalR] Connection ID mismatch - connection may have been closed. Will retry on next mount.`);
          }
        }
      }
    };

    joinGroup();

    return () => {
      isMounted = false;
      currentGroupId = "";

      // Handler'ları kaldır
      activeGroupHandlers.delete(groupId);

      // Gruptan ayrıl
      if (userId) {
        const connection = getSignalRConnection(userId);
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
          connection.invoke("LeaveGroup", groupId).catch((error) => {
            // "no connection with that id" hatası normal olabilir (bağlantı zaten kesilmiş)
            if (error instanceof Error && error.message.includes("no connection with that id")) {
              console.log(`[SignalR] Connection already closed, skipping LeaveGroup for ${groupId}`);
            } else {
              console.error(`[SignalR] Error leaving group ${groupId}:`, error);
            }
          });
        }
      }
    };
  }, [groupId, enabled, userId]);

  // Typing indicator göndermek için fonksiyon
  const sendTyping = useCallback(
    async (typingUserId: string) => {
      if (!groupId || !userId) return;

      const connection = getSignalRConnection(userId);
      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.invoke("Typing", groupId, typingUserId);
        } catch (error) {
          // "no connection with that id" hatası normal olabilir
          if (error instanceof Error && error.message.includes("no connection with that id")) {
            // Sessizce yok say
            return;
          }
          console.error("[SignalR] Error sending typing indicator:", error);
        }
      }
    },
    [groupId, userId]
  );

  return {
    sendTyping,
  };
}

