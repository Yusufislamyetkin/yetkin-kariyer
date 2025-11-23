"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { UserPlus, Users, Loader2, Check, X, Search, MessageSquare, User, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import { startSignalRConnection } from "@/lib/realtime/signalr-client";
import { useFriendRequest } from "@/app/contexts/FriendRequestContext";

type FriendshipStatus = "pending" | "accepted" | "declined" | "blocked";

interface FriendshipEntry {
  id: string;
  status: FriendshipStatus;
  requestedAt: string;
  respondedAt: string | null;
  cancelledAt: string | null;
  counterpart: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  direction: "incoming" | "outgoing";
}

export default function FriendsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { refresh: refreshFriendRequests, lastUpdatedAt } = useFriendRequest();
  const [friendships, setFriendships] = useState<FriendshipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error" | null>(null);
  const [startingMessage, setStartingMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [friendsListSearchQuery, setFriendsListSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    friendshipStatus: string | null;
    isRequester: boolean;
  }>>([]);

  // Memoized unique search results - remove duplicates by both ID and email
  const uniqueSearchResults = useMemo(() => {
    const seenIds = new Set<string>();
    const seenEmails = new Set<string>();
    return searchResults.filter((user) => {
      // Check for duplicate ID
      if (seenIds.has(user.id)) {
        return false;
      }
      // Check for duplicate email (normalized to lowercase)
      const normalizedEmail = user.email.toLowerCase().trim();
      if (seenEmails.has(normalizedEmail)) {
        return false;
      }
      // If unique, add to both sets
      seenIds.add(user.id);
      seenEmails.add(normalizedEmail);
      return true;
    });
  }, [searchResults]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // Ref to store refreshFriends function for SignalR callbacks
  const refreshFriendsRef = useRef<() => Promise<void>>();
  const lastRefreshTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousLastUpdatedAtRef = useRef<number | null>(null);

  const refreshFriends = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/friends", {
        cache: "no-store",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Bağlantı listesi alınamadı.");
      }
      const data = await response.json();
      setFriendships(data.friendships ?? []);
      lastRefreshTimeRef.current = Date.now();
    } catch (err) {
      console.error("Error fetching friendships:", err);
      setError((err as Error).message || "Bağlantı listesi yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Store refreshFriends in ref for SignalR callbacks
  useEffect(() => {
    refreshFriendsRef.current = refreshFriends;
  }, [refreshFriends]);

  // Initial load
  useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  // Listen to FriendRequestContext updates with aggressive debounce and change detection
  useEffect(() => {
    if (!lastUpdatedAt) return;
    
    if (previousLastUpdatedAtRef.current === lastUpdatedAt) return;
    
    const timeSinceLastRefresh = Date.now() - lastRefreshTimeRef.current;
    const minDebounceTime = 2000;
    
    if (timeSinceLastRefresh < minDebounceTime) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      const remainingTime = minDebounceTime - timeSinceLastRefresh;
      debounceTimeoutRef.current = setTimeout(() => {
        if (previousLastUpdatedAtRef.current !== lastUpdatedAt) {
          previousLastUpdatedAtRef.current = lastUpdatedAt;
          lastRefreshTimeRef.current = Date.now();
          refreshFriends();
        }
      }, remainingTime);
      return;
    }
    
    previousLastUpdatedAtRef.current = lastUpdatedAt;
    lastRefreshTimeRef.current = Date.now();
    refreshFriends();
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [lastUpdatedAt, refreshFriends]);

  // SignalR listener for real-time updates
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id;
    let isMounted = true;
    let connection: signalR.HubConnection | null = null;

    const setupSignalRListener = async () => {
      try {
        connection = await startSignalRConnection(userId);
        if (!connection || !isMounted) {
          console.warn("[FriendsPage] SignalR connection not available");
          return;
        }

        connection.on("FriendRequestReceived", (payload: {
          type: "friend_request";
          requesterId: string;
          requester: {
            id: string;
            name: string | null;
            profileImage: string | null;
          };
        }) => {
          if (!isMounted) return;
          if (refreshFriendsRef.current) {
            refreshFriendsRef.current();
          }
        });

        connection.on("FriendRequestAccepted", (payload: {
          type: "friend_request_accepted";
          accepterId: string;
          accepter: {
            id: string;
            name: string | null;
            profileImage: string | null;
          };
        }) => {
          if (!isMounted) return;
          if (refreshFriendsRef.current) {
            refreshFriendsRef.current();
          }
        });

        connection.on("FriendRequestDeclined", () => {
          if (!isMounted) return;
          if (refreshFriendsRef.current) {
            refreshFriendsRef.current();
          }
        });
      } catch (error) {
        console.error("[FriendsPage] ❌ SignalR setup failed:", error);
      }
    };

    setupSignalRListener();

    return () => {
      isMounted = false;
      if (connection) {
        connection.off("FriendRequestReceived");
        connection.off("FriendRequestAccepted");
        connection.off("FriendRequestDeclined");
      }
    };
  }, [session?.user?.id]);

  const showActionMessage = (message: string, type: "success" | "error") => {
    setActionMessage(message);
    setActionType(type);
    window.setTimeout(() => {
      setActionMessage(null);
      setActionType(null);
    }, 3000);
  };

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Kullanıcı arama başarısız oldu.");
      }
      // Remove duplicates by id
      const users = data.users ?? [];
      const uniqueUsers = Array.from(
        new Map(users.map((user: { id: string; name: string | null; email: string; profileImage: string | null; friendshipStatus: string | null; isRequester: boolean }) => [user.id, user])).values()
      ) as Array<{
        id: string;
        name: string | null;
        email: string;
        profileImage: string | null;
        friendshipStatus: string | null;
        isRequester: boolean;
      }>;
      setSearchResults(uniqueUsers);
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchError((err as Error).message || "Kullanıcı arama sırasında bir hata oluştu.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers(searchQuery.trim());
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const handleSendRequest = async (targetUserId: string) => {
    const currentQuery = searchQuery.trim();
    setSendingRequest(true);
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Bağlantı isteği gönderilemedi.");
      }
      showActionMessage(data?.message || "Bağlantı isteği gönderildi.", "success");
      await refreshFriends();
      if (currentQuery.length >= 2) {
        await searchUsers(currentQuery);
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
      showActionMessage(
        (err as Error).message || "Bağlantı isteği gönderilirken bir hata oluştu.",
        "error"
      );
    } finally {
      setSendingRequest(false);
    }
  };

  const handleRespond = async (friendshipId: string, action: "accept" | "decline" | "cancel" | "remove") => {
    setRespondingId(friendshipId);
    try {
      const response = await fetch("/api/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendshipId, action }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "İşlem tamamlanamadı.");
      }
      showActionMessage(data?.message || "İşlem başarıyla tamamlandı.", "success");
      await refreshFriends();
      await refreshFriendRequests();
    } catch (err) {
      console.error("Error responding to friend request:", err);
      showActionMessage(
        (err as Error).message || "İşlem sırasında bir hata oluştu.",
        "error"
      );
    } finally {
      setRespondingId(null);
    }
  };

  const incomingRequests = useMemo(() => {
    const incoming = friendships.filter(
      (friendship) => friendship.direction === "incoming" && friendship.status === "pending"
    );
    // Remove duplicates by counterpart.id
    const seen = new Set<string>();
    return incoming.filter((friendship) => {
      if (seen.has(friendship.counterpart.id)) {
        return false;
      }
      seen.add(friendship.counterpart.id);
      return true;
    });
  }, [friendships]);

  const outgoingRequests = useMemo(() => {
    const outgoing = friendships.filter(
      (friendship) => friendship.direction === "outgoing" && friendship.status === "pending"
    );
    // Remove duplicates by counterpart.id
    const seen = new Set<string>();
    return outgoing.filter((friendship) => {
      if (seen.has(friendship.counterpart.id)) {
        return false;
      }
      seen.add(friendship.counterpart.id);
      return true;
    });
  }, [friendships]);

  const acceptedFriends = useMemo(() => {
    const accepted = friendships.filter((friendship) => friendship.status === "accepted");
    // Remove duplicates by counterpart.id
    const seen = new Set<string>();
    return accepted.filter((friendship) => {
      if (seen.has(friendship.counterpart.id)) {
        return false;
      }
      seen.add(friendship.counterpart.id);
      return true;
    });
  }, [friendships]);

  const filteredAcceptedFriends = useMemo(() => {
    if (!friendsListSearchQuery.trim()) {
      return acceptedFriends;
    }
    const query = friendsListSearchQuery.toLowerCase().trim();
    return acceptedFriends.filter((friendship) => {
      const name = friendship.counterpart.name?.toLowerCase() || "";
      return name.includes(query);
    });
  }, [acceptedFriends, friendsListSearchQuery]);

  const handleStartMessage = async (targetUserId: string) => {
    try {
      setStartingMessage(targetUserId);
      setError(null);
      const response = await fetch("/api/chat/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: targetUserId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Direkt mesaj başlatılamadı");
      }

      const data = await response.json();
      router.push(`/chat/direct?thread=${data.thread.id}`);
    } catch (err) {
      console.error("Error starting direct message:", err);
      showActionMessage(
        (err as Error).message || "Mesajlaşma başlatılırken bir hata oluştu.",
        "error"
      );
    } finally {
      setStartingMessage(null);
    }
  };

  const handleVisitProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bağlantılarım
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Ekip kurmak için bağlantılarınızı yönetin, gelen istekleri yanıtlayın ve yeni bağlantılar kurun.
          </p>
        </div>

        {/* Action Message */}
        {actionMessage && actionType && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-base ${
              actionType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            }`}
          >
            {actionType === "success" ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bağlantı Ekle
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Takım arkadaşlarınızla iletişime geçmek için isim veya email ile kullanıcıları arayabilir ve bağlantı isteği gönderebilirsiniz.
          </p>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="İsim veya email ile ara..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095f6] focus:border-transparent transition-all"
            />
          </div>
          {searching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-[#0095f6]" />
              <span className="ml-3 text-base text-gray-600 dark:text-gray-400">Aranıyor...</span>
            </div>
          )}
          {searchError && (
            <div className="rounded-xl border-2 border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {searchError}
            </div>
          )}
          {!searching && !searchError && uniqueSearchResults.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {uniqueSearchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {user.profileImage ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                        <Image
                          src={user.profileImage}
                          alt={user.name || user.email}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                        {(user.name || user.email)
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                        {user.name || "İsimsiz Kullanıcı"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    {user.friendshipStatus === "accepted" ? (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                        Bağlantı
                      </span>
                    ) : user.friendshipStatus === "pending" ? (
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        {user.isRequester ? "İstek gönderildi" : "İstek bekliyor"}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendingRequest}
                        className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sendingRequest ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Bağlantı Kur
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!searching && !searchError && searchQuery.trim().length >= 2 && uniqueSearchResults.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-base text-gray-600 dark:text-gray-400">
              Kullanıcı bulunamadı.
            </div>
          )}
          {!searching && !searchError && searchQuery.trim().length < 2 && searchQuery.length > 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-base text-gray-600 dark:text-gray-400">
              Arama için en az 2 karakter girin.
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg">
            <Loader2 className="h-10 w-10 animate-spin text-[#0095f6]" />
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-lg">
            <p className="text-base text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Incoming Requests */}
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Gelen İstekler
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Gelen bağlantı isteklerine buradan yanıt verin.
              </p>
              <div className="space-y-3">
                {incomingRequests.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Şu anda bekleyen bağlantı isteği yok.
                  </div>
                ) : (
                  incomingRequests.map((friendship) => (
                    <div
                      key={friendship.id}
                      className="flex items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {friendship.counterpart.profileImage ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                            <Image
                              src={friendship.counterpart.profileImage}
                              alt={friendship.counterpart.name || "User"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                            {(friendship.counterpart.name || "U")[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                            {friendship.counterpart.name ?? "İsimsiz Kullanıcı"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(friendship.requestedAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleRespond(friendship.id, "accept")}
                          disabled={respondingId === friendship.id}
                          className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Kabul Et
                        </button>
                        <button
                          onClick={() => handleRespond(friendship.id, "decline")}
                          disabled={respondingId === friendship.id}
                          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Reddet
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Outgoing Requests */}
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Gönderilen İstekler
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Gönderdiğiniz bağlantı istekleri.
              </p>
              <div className="space-y-3">
                {outgoingRequests.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Bekleyen giden bağlantı isteğiniz yok.
                  </div>
                ) : (
                  outgoingRequests.map((friendship) => (
                    <div
                      key={friendship.id}
                      className="flex items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {friendship.counterpart.profileImage ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                            <Image
                              src={friendship.counterpart.profileImage}
                              alt={friendship.counterpart.name || "User"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                            {(friendship.counterpart.name || "U")[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                            {friendship.counterpart.name ?? "İsimsiz Kullanıcı"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(friendship.requestedAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRespond(friendship.id, "cancel")}
                        disabled={respondingId === friendship.id}
                        className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ml-4"
                      >
                        İptal Et
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Connections List */}
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Tüm Bağlantılarım
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Takım kurarken buradaki kullanıcılara davet gönderebilirsiniz.
              </p>
              {acceptedFriends.length > 0 && (
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Bağlantılarınızı ara..."
                    value={friendsListSearchQuery}
                    onChange={(event) => setFriendsListSearchQuery(event.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095f6] focus:border-transparent transition-all"
                  />
                </div>
              )}
              {acceptedFriends.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-base text-gray-600 dark:text-gray-400">
                  Henüz bağlantı eklemediniz. Yukarıdaki arama kutusunu kullanarak kullanıcıları arayabilir ve bağlantı isteği gönderebilirsiniz.
                </div>
              ) : filteredAcceptedFriends.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-base text-gray-600 dark:text-gray-400">
                  Arama kriterinize uygun bağlantı bulunamadı.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAcceptedFriends.map((friendship) => (
                    <div
                      key={friendship.id}
                      className="flex items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {friendship.counterpart.profileImage ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                            <Image
                              src={friendship.counterpart.profileImage}
                              alt={friendship.counterpart.name || "User"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                            {(friendship.counterpart.name || "U")[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                            {friendship.counterpart.name ?? "İsimsiz Kullanıcı"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleStartMessage(friendship.counterpart.id)}
                          disabled={startingMessage === friendship.counterpart.id}
                          className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                          {startingMessage === friendship.counterpart.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <MessageSquare className="h-4 w-4" />
                              Mesajlaş
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleVisitProfile(friendship.counterpart.id)}
                          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                        >
                          <User className="h-4 w-4" />
                          Profil
                        </button>
                        <button
                          onClick={() => handleRespond(friendship.id, "remove")}
                          disabled={respondingId === friendship.id}
                          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
