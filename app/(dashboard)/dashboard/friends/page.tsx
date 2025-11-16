"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { UserPlus, Users, Loader2, Check, X, MailQuestion, Search, MessageSquare, User } from "lucide-react";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import { startSignalRConnection } from "@/lib/realtime/signalr-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
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
        throw new Error(data?.error || "Arkadaş listesi alınamadı.");
      }
      const data = await response.json();
      setFriendships(data.friendships ?? []);
      lastRefreshTimeRef.current = Date.now();
    } catch (err) {
      console.error("Error fetching friendships:", err);
      setError((err as Error).message || "Arkadaş listesi yüklenemedi.");
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
    
    // Only refresh if lastUpdatedAt actually changed (not just a re-render)
    if (previousLastUpdatedAtRef.current === lastUpdatedAt) return;
    
    // Only refresh if enough time has passed since last refresh (minimum 2 seconds debounce)
    const timeSinceLastRefresh = Date.now() - lastRefreshTimeRef.current;
    const minDebounceTime = 2000; // 2 seconds minimum between refreshes
    
    if (timeSinceLastRefresh < minDebounceTime) {
      // Clear any existing timeout and set a new one
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      const remainingTime = minDebounceTime - timeSinceLastRefresh;
      debounceTimeoutRef.current = setTimeout(() => {
        // Double-check that lastUpdatedAt actually changed before refreshing
        if (previousLastUpdatedAtRef.current !== lastUpdatedAt) {
          previousLastUpdatedAtRef.current = lastUpdatedAt;
          lastRefreshTimeRef.current = Date.now();
          refreshFriends();
        }
      }, remainingTime);
      return;
    }
    
    // Update the ref and refresh only if enough time has passed
    previousLastUpdatedAtRef.current = lastUpdatedAt;
    lastRefreshTimeRef.current = Date.now();
    refreshFriends();
    
    // Cleanup timeout on unmount
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

        // Listen for friend request received
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
          console.log("[FriendsPage] FriendRequestReceived event:", payload);
          // Refresh friends list when a new request is received
          if (refreshFriendsRef.current) {
            refreshFriendsRef.current();
          }
        });

        // Listen for friend request accepted
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
          console.log("[FriendsPage] FriendRequestAccepted event:", payload);
          // Refresh friends list when a request is accepted
          if (refreshFriendsRef.current) {
            refreshFriendsRef.current();
          }
        });

        // Listen for friend request declined/cancelled
        connection.on("FriendRequestDeclined", () => {
          if (!isMounted) return;
          console.log("[FriendsPage] FriendRequestDeclined event");
          if (refreshFriendsRef.current) {
            refreshFriendsRef.current();
          }
        });

        console.log("[FriendsPage] ✅ SignalR listeners setup completed");
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

  // Removed visibilitychange listener - SignalR handles real-time updates
  // Manual refresh on visibility change causes unnecessary refreshes
  // SignalR listeners already handle all real-time friend request events

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
      setSearchResults(data.users ?? []);
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
        throw new Error(data?.error || "Arkadaşlık isteği gönderilemedi.");
      }
      showActionMessage(data?.message || "Arkadaşlık isteği gönderildi.", "success");
      await refreshFriends();
      // Refresh search results to update friendship status if search query exists
      if (currentQuery.length >= 2) {
        await searchUsers(currentQuery);
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
      showActionMessage(
        (err as Error).message || "Arkadaşlık isteği gönderilirken bir hata oluştu.",
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

  const incomingRequests = useMemo(
    () =>
      friendships.filter(
        (friendship) => friendship.direction === "incoming" && friendship.status === "pending"
      ),
    [friendships]
  );

  const outgoingRequests = useMemo(
    () =>
      friendships.filter(
        (friendship) => friendship.direction === "outgoing" && friendship.status === "pending"
      ),
    [friendships]
  );

  const acceptedFriends = useMemo(
    () => friendships.filter((friendship) => friendship.status === "accepted"),
    [friendships]
  );

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
    <div className="animate-fade-in space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">Arkadaşlarım</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Ekip kurmak için arkadaşlarını yönet, gelen istekleri yanıtla ve yeni bağlantılar kur.
        </p>
      </div>

      {actionMessage && actionType && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            actionType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
          }`}
        >
          {actionType === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span>{actionMessage}</span>
        </div>
      )}

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Arkadaş ekle</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Takım arkadaşlarınla iletişime geçmek için isim veya email ile kullanıcıları arayabilir ve arkadaşlık isteği gönderebilirsin.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="İsim veya email ile ara..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
            />
          </div>
          {searching && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Aranıyor...</span>
            </div>
          )}
          {searchError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {searchError}
            </div>
          )}
          {!searching && !searchError && searchResults.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name || user.email}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {(user.name || user.email)
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user.name || "İsimsiz Kullanıcı"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3">
                    {user.friendshipStatus === "accepted" ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Arkadaş
                      </span>
                    ) : user.friendshipStatus === "pending" ? (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {user.isRequester ? "İstek gönderildi" : "İstek bekliyor"}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendingRequest}
                      >
                        {sendingRequest ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Ekle
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!searching && !searchError && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 text-center">
              Kullanıcı bulunamadı.
            </div>
          )}
          {!searching && !searchError && searchQuery.trim().length < 2 && searchQuery.length > 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 text-center">
              Arama için en az 2 karakter girin.
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Card variant="elevated">
          <CardContent className="py-12 text-center text-sm text-gray-600 dark:text-gray-400">
            {error}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gelen istekler</CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Gelen arkadaşlık isteklerine buradan yanıt ver.
              </p>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {incomingRequests.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                  Şu anda bekleyen arkadaşlık isteği yok.
                </div>
              ) : (
                incomingRequests.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {friendship.counterpart.name ?? "İsimsiz Kullanıcı"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(friendship.requestedAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-3">
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => handleRespond(friendship.id, "accept")}
                        disabled={respondingId === friendship.id}
                        className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      >
                        Kabul et
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(friendship.id, "decline")}
                        disabled={respondingId === friendship.id}
                        className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      >
                        Reddet
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gönderilen istekler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {outgoingRequests.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                  Bekleyen giden arkadaşlık isteğiniz yok.
                </div>
              ) : (
                outgoingRequests.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {friendship.counterpart.name ?? "İsimsiz Kullanıcı"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(friendship.requestedAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRespond(friendship.id, "cancel")}
                      disabled={respondingId === friendship.id}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      İsteği iptal et
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Arkadaş listesi</CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Takım kurarken buradaki kullanıcılara davet gönderebilirsin.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Search input for friends list */}
              {acceptedFriends.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Arkadaşlarını ara..."
                    value={friendsListSearchQuery}
                    onChange={(event) => setFriendsListSearchQuery(event.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              )}
              {acceptedFriends.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                  Henüz arkadaş eklemediniz. Yukarıdaki arama kutusunu kullanarak kullanıcıları arayabilir ve arkadaşlık isteği gönderebilirsiniz.
                </div>
              ) : filteredAcceptedFriends.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 text-center">
                  Arama kriterinize uygun arkadaş bulunamadı.
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {filteredAcceptedFriends.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {friendship.counterpart.name ?? "İsimsiz Kullanıcı"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:ml-3">
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => handleStartMessage(friendship.counterpart.id)}
                        disabled={startingMessage === friendship.counterpart.id}
                        className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      >
                        {startingMessage === friendship.counterpart.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Mesajlaş</span>
                            <span className="sm:hidden">Mesaj</span>
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVisitProfile(friendship.counterpart.id)}
                        className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      >
                        <User className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Profil
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(friendship.id, "remove")}
                        disabled={respondingId === friendship.id}
                        className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Listeden çıkar</span>
                        <span className="sm:hidden">Çıkar</span>
                      </Button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

