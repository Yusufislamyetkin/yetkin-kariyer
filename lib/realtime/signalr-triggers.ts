import type { ChatMessageEventPayload } from "@/types";

const SIGNALR_API_URL = process.env.SIGNALR_API_URL || "http://softwareinterview.tryasp.net";

/**
 * SignalR hub'a mesaj broadcast etmek için API endpoint'ine istek gönderir
 */
export async function broadcastChatMessage(groupId: string, payload: ChatMessageEventPayload) {
  try {
    const response = await fetch(`${SIGNALR_API_URL}/api/chat/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        payload,
      }),
    });

    if (!response.ok) {
      console.error("[SignalR] Broadcast failed:", response.statusText);
    }
  } catch (error) {
    console.error("[SignalR] Broadcast error:", error);
  }
}

/**
 * SignalR hub'a presence update broadcast etmek için API endpoint'ine istek gönderir
 */
export async function broadcastPresenceUpdate(
  groupId: string,
  payload: { userId: string; status: "online" | "offline"; lastSeenAt?: string }
) {
  try {
    const response = await fetch(`${SIGNALR_API_URL}/api/chat/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        payload: {
          type: "presence",
          ...payload,
        },
      }),
    });

    if (!response.ok) {
      console.error("[SignalR] Presence broadcast failed:", response.statusText);
    }
  } catch (error) {
    console.error("[SignalR] Presence broadcast error:", error);
  }
}

/**
 * Sosyal medya bildirimlerini belirli bir kullanıcıya göndermek için API endpoint'ine istek gönderir
 */
export async function broadcastSocialNotification(
  userId: string,
  eventName: string,
  payload: {
    type: "post_like" | "post_comment" | "post_share" | "post_save";
    postId: string;
    postOwnerId: string;
    actor: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
    content?: string;
  }
) {
  try {
    const response = await fetch(`${SIGNALR_API_URL}/api/chat/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventName,
        payload,
      }),
    });

    if (!response.ok) {
      console.error("[SignalR] Social notification failed:", response.statusText);
    }
  } catch (error) {
    console.error("[SignalR] Social notification error:", error);
  }
}

/**
 * Arkadaşlık isteği bildirimini belirli bir kullanıcıya göndermek için API endpoint'ine istek gönderir
 */
export async function broadcastFriendRequestNotification(
  targetUserId: string,
  payload: {
    type: "friend_request";
    requesterId: string;
    requester: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
  }
) {
  try {
    const response = await fetch(`${SIGNALR_API_URL}/api/chat/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: targetUserId,
        eventName: "FriendRequestReceived",
        payload,
      }),
    });

    if (!response.ok) {
      console.error("[SignalR] Friend request notification failed:", response.statusText);
    }
  } catch (error) {
    console.error("[SignalR] Friend request notification error:", error);
  }
}

