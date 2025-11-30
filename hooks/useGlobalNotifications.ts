"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import { startSignalRConnection, waitForConnection, ensureConnected } from "@/lib/realtime/signalr-client";
import { useNotification } from "@/app/contexts/NotificationContext";

type ChatMessagePayload = {
  message: {
    id: string;
    groupId: string;
    userId: string;
    type: string;
    content: string | null;
    createdAt: string;
  };
  sender: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
};

type SocialNotificationPayload = {
  type: "post_like" | "post_comment" | "post_share";
  postId: string;
  postOwnerId: string;
  actor: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  content?: string;
};

type FriendRequestNotificationPayload = {
  type: "friend_request";
  requesterId: string;
  requester: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
};

/**
 * Global SignalR listener for notifications
 * Listens for new messages (friend requests are handled by FriendRequestContext via polling)
 */
export function useGlobalNotifications() {
  const { showNotification } = useNotification();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const currentThreadIdRef = useRef<string | null>(null);
  const currentGroupIdRef = useRef<string | null>(null);
  const joinedGroupsRef = useRef<Set<string>>(new Set());
  const joiningGroupsRef = useRef<Set<string>>(new Set());

  // Track current thread/group ID from pathname and query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we're on direct chat page
      if (pathname === "/chat/direct") {
        // Extract thread ID from query params
        const urlParams = new URLSearchParams(window.location.search);
        const threadId = urlParams.get("thread");
        if (threadId) {
          currentThreadIdRef.current = threadId;
          currentGroupIdRef.current = null;
        } else {
          currentThreadIdRef.current = null;
        }
      } else {
        currentThreadIdRef.current = null;
      }

      // Check if we're on group chat page
      if (pathname === "/chat/groups") {
        // Extract group ID from query params
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get("group");
        if (groupId) {
          currentGroupIdRef.current = groupId;
        } else {
          currentGroupIdRef.current = null;
        }
      } else {
        currentGroupIdRef.current = null;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id;
    let isMounted = true;
    let connection: signalR.HubConnection | null = null;

    // Join all user's chat groups and threads to receive notifications
    // This is necessary because backend only sends messages to group members
    const joinAllChatGroups = async (conn: signalR.HubConnection, retryCount: number = 0): Promise<void> => {
      const MAX_RETRIES = 3;
      
      try {
        // Ensure connection is connected before joining groups
        try {
          await ensureConnected(conn);
        } catch (error) {
          if (retryCount < MAX_RETRIES) {
            console.warn(`[GlobalNotifications] Connection not ready, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
            return joinAllChatGroups(conn, retryCount + 1);
          }
          throw error;
        }

        // Fetch all user's chat memberships (both direct threads and groups)
        let directData: any = null;
        let summaryData: any = null;
        
        try {
          const [directResponse, groupsResponse] = await Promise.all([
            fetch("/api/chat/direct"),
            fetch("/api/chat/summary"),
          ]);

          if (!directResponse.ok) {
            console.warn(`[GlobalNotifications] Failed to fetch direct threads: ${directResponse.status}`);
          } else {
            directData = await directResponse.json();
          }

          if (!groupsResponse.ok) {
            console.warn(`[GlobalNotifications] Failed to fetch groups summary: ${groupsResponse.status}`);
          } else {
            summaryData = await groupsResponse.json();
          }

          if (!directData && !summaryData) {
            console.warn("[GlobalNotifications] Failed to fetch any chat memberships, will retry later");
            if (retryCount < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
              return joinAllChatGroups(conn, retryCount + 1);
            }
            return;
          }
        } catch (error) {
          console.error("[GlobalNotifications] Error fetching chat memberships:", error);
          if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
            return joinAllChatGroups(conn, retryCount + 1);
          }
          return;
        }

        const groupIds = new Set<string>();

        // Add direct thread IDs
        if (directData?.threads && Array.isArray(directData.threads)) {
          directData.threads.forEach((thread: { id: string }) => {
            if (thread.id) {
              groupIds.add(thread.id);
            }
          });
        }

        // Add group IDs from summary (both user groups and community groups)
        if (summaryData?.userGroups && Array.isArray(summaryData.userGroups)) {
          summaryData.userGroups.forEach((group: { groupId: string }) => {
            if (group.groupId) {
              groupIds.add(group.groupId);
            }
          });
        }

        if (summaryData?.communityGroups && Array.isArray(summaryData.communityGroups)) {
          summaryData.communityGroups.forEach((group: { groupId: string }) => {
            if (group.groupId) {
              groupIds.add(group.groupId);
            }
          });
        }

        if (groupIds.size === 0) {
          console.log("[GlobalNotifications] No groups to join");
          return;
        }

        // Track groups we're about to join
        groupIds.forEach((groupId) => {
          if (connectionRef.current === conn) {
            joiningGroupsRef.current.add(groupId);
          }
        });

        // Join all groups via SignalR with retry mechanism
        const joinPromises = Array.from(groupIds).map(async (groupId) => {
          const maxJoinRetries = 3;
          let attempt = 0;
          
          while (attempt < maxJoinRetries) {
            try {
              // Check connection state before each attempt
              if (conn.state !== signalR.HubConnectionState.Connected) {
                if (attempt < maxJoinRetries - 1) {
                  await waitForConnection(conn, 2000);
                  attempt++;
                  continue;
                } else {
                  console.warn(`[GlobalNotifications] Connection not connected after ${maxJoinRetries} attempts, skipping group ${groupId}`);
                  joiningGroupsRef.current.delete(groupId);
                  return;
                }
              }
              
              await conn.invoke("JoinGroup", groupId);
              console.log(`[GlobalNotifications] ✅ Joined group ${groupId} for notifications`);
              // Track joined groups
              if (connectionRef.current === conn) {
                joinedGroupsRef.current.add(groupId);
              }
              joiningGroupsRef.current.delete(groupId);
              return; // Success, exit retry loop
            } catch (error) {
              attempt++;
              
              // "no connection with that id" hatası normal olabilir
              if (error instanceof Error && error.message.includes("no connection with that id")) {
                console.log(`[GlobalNotifications] Connection closed, skipping group ${groupId}`);
                joiningGroupsRef.current.delete(groupId);
                return;
              }
              
              // Connection state errors - don't retry if connection is closed/disconnected
              if (error instanceof Error && (
                error.message.includes("Connection is not in the 'Connected' state") ||
                conn.state === signalR.HubConnectionState.Disconnected ||
                conn.state === signalR.HubConnectionState.Disconnecting
              )) {
                console.warn(`[GlobalNotifications] Connection not ready for group ${groupId}, will retry on reconnection`);
                joiningGroupsRef.current.delete(groupId);
                return;
              }
              
              if (attempt < maxJoinRetries) {
                const delay = 500 * Math.pow(2, attempt - 1); // Exponential backoff: 500ms, 1s, 2s
                console.warn(`[GlobalNotifications] ⚠️ Failed to join group ${groupId} (attempt ${attempt}/${maxJoinRetries}), retrying in ${delay}ms...`, error instanceof Error ? error.message : error);
                await new Promise(resolve => setTimeout(resolve, delay));
              } else {
                console.error(`[GlobalNotifications] ❌ Failed to join group ${groupId} after ${maxJoinRetries} attempts:`, error);
                joiningGroupsRef.current.delete(groupId);
                // Don't return - let it fail so we can track which groups failed
              }
            }
          }
        });

        await Promise.all(joinPromises);
        console.log(`[GlobalNotifications] ✅ Joined ${joinedGroupsRef.current.size}/${groupIds.size} chat groups for notifications`);
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          console.warn(`[GlobalNotifications] Error joining chat groups, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return joinAllChatGroups(conn, retryCount + 1);
        }
        console.error("[GlobalNotifications] ❌ Error joining chat groups after retries:", error);
      }
    };

    const setupConnection = async () => {
      try {
        // Pass userId to SignalR connection for backend authentication
        connection = await startSignalRConnection(userId);
        if (!connection || !isMounted) {
          return;
        }

        // Ensure connection is fully connected before proceeding
        try {
          await ensureConnected(connection);
        } catch (error) {
          console.error("[GlobalNotifications] Failed to ensure connection:", error);
          return;
        }

        connectionRef.current = connection;

        // Only add event listeners after connection is confirmed connected
        if (connection.state !== signalR.HubConnectionState.Connected) {
          console.warn("[GlobalNotifications] Connection not connected, skipping event listener setup");
          return;
        }

        // Start joining all groups in the background (non-blocking)
        // Don't await - let it run in parallel so event listeners are set up immediately
        joinAllChatGroups(connection).catch((error) => {
          console.error("[GlobalNotifications] Background group join failed:", error);
        });

        // Listen for new messages (only if not in the current thread/group)
        connection.on("ReceiveMessage", (payload: ChatMessagePayload | { type: "presence"; userId: string; status: string; lastSeenAt: string }) => {
          try {
            if (!isMounted || !session?.user?.id) return;
            
            // Ignore presence updates - they are handled by PresenceUpdate event
            if (payload && "type" in payload && payload.type === "presence") {
              return;
            }
            
            // Validate payload structure for messages
            if (!payload || !("message" in payload) || !payload.message) {
              console.warn("[GlobalNotifications] Invalid ReceiveMessage payload:", payload);
              return;
            }

            const message = payload.message;
            const sender = payload.sender;

            // Validate required fields
            if (!message || !message.groupId || !message.userId) {
              console.warn("[GlobalNotifications] Missing required fields in message:", message);
              return;
            }

            // Validate sender (optional but should be checked)
            if (!sender) {
              console.warn("[GlobalNotifications] Missing sender in payload:", payload);
              // Sender yoksa devam et ama default değerlerle
            }
            
            // Don't show notification if:
            // 1. Message is from current user
            // 2. User is currently viewing this thread or group
            if (
              message.userId === userId ||
              message.groupId === currentThreadIdRef.current ||
              message.groupId === currentGroupIdRef.current
            ) {
              return;
            }

            // Lazy join: If we haven't joined this group yet, try to join now
            // This handles cases where joinAllChatGroups failed or is still in progress
            const groupId = message.groupId;
            if (groupId && connectionRef.current) {
              const isAlreadyJoined = joinedGroupsRef.current.has(groupId);
              const isJoining = joiningGroupsRef.current.has(groupId);
              
              if (!isAlreadyJoined && !isJoining && connectionRef.current.state === signalR.HubConnectionState.Connected) {
                joiningGroupsRef.current.add(groupId);
                // Try to join the group asynchronously (don't block notification)
                ensureConnected(connectionRef.current)
                  .then(() => {
                    if (!connectionRef.current) {
                      throw new Error("Connection ref is null");
                    }
                    if (connectionRef.current.state !== signalR.HubConnectionState.Connected) {
                      throw new Error(`Connection not connected: ${connectionRef.current.state}`);
                    }
                    return connectionRef.current.invoke("JoinGroup", groupId);
                  })
                  .then(() => {
                    console.log(`[GlobalNotifications] ✅ Lazy joined group ${groupId} after receiving message`);
                    if (connectionRef.current) {
                      joinedGroupsRef.current.add(groupId);
                    }
                  })
                  .catch((error) => {
                    console.warn(`[GlobalNotifications] ⚠️ Failed to lazy join group ${groupId}:`, error instanceof Error ? error.message : error);
                    // Retry once after a delay if it's a transient error
                    if (error instanceof Error && !error.message.includes("no connection") && connectionRef.current) {
                      setTimeout(() => {
                        if (connectionRef.current && 
                            connectionRef.current.state === signalR.HubConnectionState.Connected &&
                            !joinedGroupsRef.current.has(groupId) &&
                            !joiningGroupsRef.current.has(groupId)) {
                          joiningGroupsRef.current.add(groupId);
                          connectionRef.current.invoke("JoinGroup", groupId)
                            .then(() => {
                              console.log(`[GlobalNotifications] ✅ Retry lazy join succeeded for group ${groupId}`);
                              if (connectionRef.current) {
                                joinedGroupsRef.current.add(groupId);
                              }
                            })
                            .catch((retryError) => {
                              console.warn(`[GlobalNotifications] ⚠️ Retry lazy join failed for group ${groupId}:`, retryError);
                            })
                            .finally(() => {
                              joiningGroupsRef.current.delete(groupId);
                            });
                        }
                      }, 2000);
                    }
                  })
                  .finally(() => {
                    joiningGroupsRef.current.delete(groupId);
                  });
              }
            }

            // Show notification
            const messagePreview = message.content
              ? message.content.length > 50
                ? message.content.substring(0, 50) + "..."
                : message.content
              : "Mesaj gönderdi";
            
            // Determine if it's a group or direct message based on groupId format
            // Direct thread IDs start with "dm_" prefix
            const isDirectThread = message.groupId?.startsWith("dm_") ?? false;
            
            showNotification(
              "message",
              "Yeni Mesaj",
              `${sender?.name || "Birisi"}: ${messagePreview}`,
              {
                duration: 6000,
                profileImage: sender?.profileImage,
                actorName: sender?.name || "Birisi",
                onClick: () => {
                  if (isDirectThread) {
                    router.push(`/chat/direct?thread=${message.groupId}`);
                  } else if (message.groupId) {
                    router.push(`/chat/groups?group=${message.groupId}`);
                  } else {
                    router.push("/chat/direct");
                  }
                },
              }
            );
          } catch (error) {
            console.error("[GlobalNotifications] Error handling ReceiveMessage:", error);
            if (error instanceof Error) {
              console.error("[GlobalNotifications] Error details:", error.message, error.stack);
            }
          }
        });

        // Listen for post liked notifications
        connection.on("PostLiked", (payload: SocialNotificationPayload) => {
          try {
            if (!isMounted || !session?.user?.id) return;
            
            // Validate payload
            if (!payload || !payload.postOwnerId || !payload.actor) {
              console.warn("[GlobalNotifications] Invalid PostLiked payload:", payload);
              return;
            }
            
            // Only show if the notification is for the current user
            if (payload.postOwnerId !== userId) return;

            // Don't show if user liked their own post
            if (payload.actor.id === userId) return;

            showNotification(
              "post_like",
              "Gönderi Beğenildi",
              `${payload.actor.name || "Birisi"} gönderinizi beğendi`,
              {
                duration: 5000,
                profileImage: payload.actor.profileImage,
                actorName: payload.actor.name || "Birisi",
                onClick: () => {
                  if (payload.postId) {
                    router.push(`/social/posts/${payload.postId}`);
                  }
                },
              }
            );
          } catch (error) {
            console.error("[GlobalNotifications] Error handling PostLiked:", error);
            if (error instanceof Error) {
              console.error("[GlobalNotifications] Error details:", error.message, error.stack);
            }
          }
        });

        // Listen for post commented notifications
        connection.on("PostCommented", (payload: SocialNotificationPayload) => {
          try {
            if (!isMounted || !session?.user?.id) return;
            
            // Validate payload
            if (!payload || !payload.postOwnerId || !payload.actor) {
              console.warn("[GlobalNotifications] Invalid PostCommented payload:", payload);
              return;
            }
            
            // Only show if the notification is for the current user
            if (payload.postOwnerId !== userId) return;
            
            // Don't show if user commented on their own post
            if (payload.actor.id === userId) return;

            const commentPreview = payload.content
              ? payload.content.length > 50
                ? payload.content.substring(0, 50) + "..."
                : payload.content
              : "";

            showNotification(
              "post_comment",
              "Yeni Yorum",
              `${payload.actor.name || "Birisi"} gönderinize yorum yaptı${commentPreview ? `: ${commentPreview}` : ""}`,
              {
                duration: 6000,
                profileImage: payload.actor.profileImage,
                actorName: payload.actor.name || "Birisi",
                onClick: () => {
                  if (payload.postId) {
                    router.push(`/social/posts/${payload.postId}`);
                  }
                },
              }
            );
          } catch (error) {
            console.error("[GlobalNotifications] Error handling PostCommented:", error);
            if (error instanceof Error) {
              console.error("[GlobalNotifications] Error details:", error.message, error.stack);
            }
          }
        });

        // Listen for post shared notifications
        connection.on("PostShared", (payload: SocialNotificationPayload) => {
          try {
            if (!isMounted || !session?.user?.id) return;
            
            // Validate payload
            if (!payload || !payload.postOwnerId || !payload.actor) {
              console.warn("[GlobalNotifications] Invalid PostShared payload:", payload);
              return;
            }
            
            // Only show if the notification is for the current user
            if (payload.postOwnerId !== userId) return;
            
            // Don't show if user shared their own post
            if (payload.actor.id === userId) return;

            showNotification(
              "post_share",
              "Gönderi Paylaşıldı",
              `${payload.actor.name || "Birisi"} gönderinizi paylaştı`,
              {
                duration: 5000,
                profileImage: payload.actor.profileImage,
                actorName: payload.actor.name || "Birisi",
                onClick: () => {
                  if (payload.postId) {
                    router.push(`/social/posts/${payload.postId}`);
                  }
                },
              }
            );
          } catch (error) {
            console.error("[GlobalNotifications] Error handling PostShared:", error);
            if (error instanceof Error) {
              console.error("[GlobalNotifications] Error details:", error.message, error.stack);
            }
          }
        });

        // Friend request notifications are now handled by FriendRequestContext
        // to ensure both notification and badge update happen together

        // Rejoin all groups when connection is reconnected
        connection.onreconnected(async (connectionId) => {
          if (!isMounted || !connection) {
            return;
          }
          
          console.log(`[GlobalNotifications] 🔄 Reconnected (connectionId: ${connectionId}), rejoining chat groups...`);
          
          // Wait a bit for the connection to stabilize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Ensure connection is ready
          try {
            await ensureConnected(connection);
            // Clear joined groups tracking before rejoining
            joinedGroupsRef.current.clear();
            joiningGroupsRef.current.clear();
            await joinAllChatGroups(connection);
            console.log(`[GlobalNotifications] ✅ Successfully rejoined all chat groups after reconnection`);
          } catch (error) {
            console.error("[GlobalNotifications] ❌ Failed to rejoin groups after reconnection:", error);
            // Retry once more after a delay
            setTimeout(async () => {
              if (isMounted && connection && connection.state === signalR.HubConnectionState.Connected) {
                try {
                  // Clear joined groups tracking before rejoining
                  joinedGroupsRef.current.clear();
                  joiningGroupsRef.current.clear();
                  await joinAllChatGroups(connection);
                  console.log(`[GlobalNotifications] ✅ Successfully rejoined all chat groups on retry`);
                } catch (retryError) {
                  console.error("[GlobalNotifications] ❌ Failed to rejoin groups on retry:", retryError);
                }
              }
            }, 2000);
          }
        });

        // Listen for connection errors
        connection.onclose((error) => {
          if (isMounted && error) {
            console.error("[GlobalNotifications] ❌ Connection closed with error:", error);
            console.error("[GlobalNotifications] Notifications will not work until connection is restored");
          }
        });

        console.log(`[GlobalNotifications] ✅ Setup completed for user ${userId}`);
      } catch (error) {
        console.error("[GlobalNotifications] ❌ Setup failed:", error);
        if (error instanceof Error) {
          console.error("[GlobalNotifications] Error details:", error.message);
          console.error("[GlobalNotifications] Stack:", error.stack);
        }
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      if (connection) {
        try {
          connection.off("ReceiveMessage");
          connection.off("PostLiked");
          connection.off("PostCommented");
          connection.off("PostShared");
        } catch (error) {
          // Ignore cleanup errors
          console.warn("[GlobalNotifications] Error during cleanup:", error);
        }
        
        // Clear tracking refs
        joinedGroupsRef.current.clear();
        joiningGroupsRef.current.clear();
      }
    };
  }, [session?.user?.id, showNotification, router]);
}

