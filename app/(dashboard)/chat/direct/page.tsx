"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";
import { User, Users, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";
import { useSignalRChat } from "@/hooks/useSignalRChat";
import {
  cleanupPresenceState,
  derivePresenceStatus,
  hasPresenceStateChanged,
  mergePresenceState,
  revalidatePresenceState,
} from "@/lib/chat/presence";
import { useChatSummary } from "@/app/contexts/ChatSummaryContext";

import {
  ChatShell,
  ConversationSidebar,
  MessageViewport,
  Composer,
  ChatMessage,
  LocalAttachment,
  PresenceEntry,
  PresenceState,
  StartDirectMessageDialog,
  FriendOption,
} from "../_components";

type DirectThread = {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  membership: {
    role: string;
    isMuted: boolean;
    lastSeenAt: string | null;
  } | null;
  participant: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    lastSeenAt: string | null;
  } | null;
  lastMessage: (Omit<ChatMessage, "groupId"> & { groupId?: string }) | null;
  unreadCount: number;
};


function formatRelativeDate(value: string, timeNow?: number) {
  try {
    // ISO string'i parse et - Date otomatik olarak UTC'ye çevirir
    const date = new Date(value);
    
    // Geçersiz tarih kontrolü
    if (isNaN(date.getTime())) {
      return value;
    }
    
    // Use timeNow if provided, otherwise use current time
    const now = timeNow ? new Date(timeNow) : new Date();
    
    // Gelecek zaman kontrolü: eğer tarih gelecekteyse, "şimdi" göster
    if (date.getTime() > now.getTime()) {
      return "şimdi";
    }
    
    // formatDistance otomatik olarak zaman farkını hesaplar
    // Timezone dönüşümüne gerek yok, çünkü sadece zaman farkını gösteriyoruz
    return formatDistance(date, now, { 
      addSuffix: true, 
      locale: tr
    });
  } catch {
    return value;
  }
}

function getAttachmentType(file: File): LocalAttachment["type"] {
  if (file.type === "image/gif") return "gif";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export default function DirectChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { refresh: refreshChatSummary } = useChatSummary();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUserId = useMemo(() => session?.user && (session.user as any).id, [session?.user]) as string | undefined;

  const [threads, setThreads] = useState<DirectThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const [showStartDialog, setShowStartDialog] = useState(false);
  const [friends, setFriends] = useState<FriendOption[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [startingMessage, setStartingMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const postPresenceRef = useRef<((status: "online" | "offline", options?: { useBeacon?: boolean }) => Promise<void>) | null>(null);
  const [messagesLoadingMore, setMessagesLoadingMore] = useState(false);
  const [messagesNextCursor, setMessagesNextCursor] = useState<string | null>(null);
  const recentlySentMessageIdsRef = useRef<Set<string>>(new Set());

  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  const presenceStateRef = useRef<PresenceState>({});
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => {
      const aDate = a.lastMessage?.createdAt ?? a.updatedAt;
      const bDate = b.lastMessage?.createdAt ?? b.updatedAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [threads]);

  const presenceSubscriptionKey = useMemo(() => {
    if (!threads.length) return "";
    return threads
      .map((thread) => thread.id)
      .sort()
      .join("|");
  }, [threads]);

  // UI'ı dinamik olarak güncellemek için zaman state'i (her 30 saniyede bir)
  const [timeNow, setTimeNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 30_000); // Her 30 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);


  // Read thread ID from URL query params on mount and when searchParams change
  useEffect(() => {
    const threadId = searchParams.get("thread");
    if (threadId && threadId !== selectedThreadId) {
      // Only set if thread exists in threads list
      const threadExists = threads.some((thread) => thread.id === threadId);
      if (threadExists) {
        setSelectedThreadId(threadId);
      }
    } else if (!threadId && selectedThreadId) {
      // Clear selection if thread param is removed
      setSelectedThreadId(null);
    }
  }, [searchParams, threads, selectedThreadId]);

  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return threads.find((thread) => thread.id === selectedThreadId) ?? null;
  }, [selectedThreadId, threads]);

  const participantPresence = useMemo(() => {
    if (!selectedThread?.participant) {
      return { status: "offline" as const, lastSeenAt: null as string | null };
    }
    const entry = presenceState[selectedThread.participant.id];
    const lastSeenAt = entry?.lastSeenAt ?? selectedThread.participant.lastSeenAt ?? null;
    return {
      status: derivePresenceStatus(lastSeenAt, timeNow),
      lastSeenAt,
    };
  }, [presenceState, selectedThread, timeNow]);

  const scheduleSummaryRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      refreshChatSummary().catch(() => {});
      refreshTimeoutRef.current = null;
    }, 300);
  }, [refreshChatSummary]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    // DOM'un hazır olmasını bekle
    const attemptScroll = () => {
      if (messagesEndRef.current && messagesContainerRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "end" });
        return true;
      }
      return false;
    };

    // İlk deneme
    if (attemptScroll()) return;

    // Eğer başarısız olursa, bir sonraki frame'de tekrar dene
    requestAnimationFrame(() => {
      if (!attemptScroll()) {
        // Hala başarısız olursa, biraz daha bekle
        setTimeout(() => attemptScroll(), 50);
      }
    });
  }, []);

  const upsertThread = useCallback((incoming: DirectThread) => {
    setThreads((prev) => {
      const exists = prev.find((thread) => thread.id === incoming.id);
      if (!exists) {
        return [...prev, incoming];
      }
      return prev.map((thread) => (thread.id === incoming.id ? { ...thread, ...incoming } : thread));
    });
  }, []);

  const updateThreadMeta = useCallback((threadId: string, updater: (current: DirectThread) => DirectThread) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;
        return updater(thread);
      })
    );
  }, []);

  const upsertMessage = useCallback(
    (incoming: ChatMessage, { scroll }: { scroll?: boolean } = {}) => {
      setMessages((prev) => {
        // Daha güvenli duplicate kontrolü: ID'ye göre Map kullan
        const messageMap = new Map<string, ChatMessage>();
        
        // Mevcut mesajları Map'e ekle
        prev.forEach((msg) => {
          messageMap.set(msg.id, msg);
        });
        
        // Yeni mesajı ekle veya güncelle
        const existing = messageMap.get(incoming.id);
        if (existing) {
          // Mevcut mesajı güncelle (yeni verilerle merge et)
          console.log(`[DirectChat] [upsertMessage] Mesaj güncelleniyor (ID: ${incoming.id}):`, {
            mevcut: existing.content?.substring(0, 50),
            yeni: incoming.content?.substring(0, 50),
            kaynak: incoming.userId === currentUserId ? "kendi mesajımız" : "başkasının mesajı"
          });
          messageMap.set(incoming.id, { ...existing, ...incoming });
        } else {
          // Yeni mesaj ekle
          console.log(`[DirectChat] [upsertMessage] Yeni mesaj ekleniyor (ID: ${incoming.id}):`, {
            içerik: incoming.content?.substring(0, 50),
            gönderen: incoming.sender.name || incoming.userId,
            mevcutMesajSayısı: prev.length,
            kaynak: incoming.userId === currentUserId ? "kendi mesajımız" : "başkasının mesajı"
          });
          messageMap.set(incoming.id, incoming);
        }
        
        // Map'ten array'e çevir ve sırala
        const updated = Array.from(messageMap.values());
        updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        console.log(`[DirectChat] [upsertMessage] Mesaj listesi güncellendi: ${prev.length} -> ${updated.length} mesaj`);
        
        return updated;
      });

      if (scroll) {
        // Double RAF ile DOM'un tamamen render olmasını bekle
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToBottom(true);
          });
        });
      }
    },
    [scrollToBottom]
  );

  const markMessagesAsRead = useCallback(
    async (threadId: string, messageIds: string[]) => {
      if (!messageIds.length) return;
      try {
        await fetch(`/api/chat/direct/${threadId}/read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageIds }),
        });

        setMessages((prev) =>
          prev.map((message) =>
            messageIds.includes(message.id)
              ? {
                  ...message,
                  readByUserIds: Array.from(new Set([...(message.readByUserIds ?? []), currentUserId].filter(Boolean))) as string[],
                }
              : message
          )
        );

        updateThreadMeta(threadId, (current) => ({
          ...current,
          unreadCount: 0,
          membership: current.membership
            ? {
                ...current.membership,
                lastSeenAt: new Date().toISOString(),
              }
            : current.membership,
        }));
        scheduleSummaryRefresh();
      } catch (err) {
        console.error("Failed to mark direct messages as read", err);
      }
    },
    [currentUserId, scheduleSummaryRefresh, updateThreadMeta]
  );

  const selectedThreadIdRef = useRef<string | null>(null);
  const prevThreadIdForScrollRef = useRef<string | null>(null);
  
  // selectedThreadId değiştiğinde ref'i güncelle
  useEffect(() => {
    selectedThreadIdRef.current = selectedThreadId;
  }, [selectedThreadId]);

  const fetchThreads = useCallback(async () => {
    try {
      setLoadingThreads(true);
      setError(null);
      
      // Mevcut selectedThreadId'yi ref'ten al (race condition'ı önlemek için)
      const currentSelectedId = selectedThreadIdRef.current;
      
      const response = await fetch("/api/chat/direct", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Direkt mesajlar alınamadı");
      }
      const data = await response.json();
      if (Array.isArray(data.threads)) {
        // Thread'leri güncelle - participant bilgisini korumak yerine API'den gelen verileri kullan
        // Ancak thread listesi değişirken flickering'i önlemek için batch update yap
        setThreads((prevThreads) => {
          // Önce mevcut seçili thread'in participant bilgisini kontrol et
          const selectedThread = currentSelectedId ? prevThreads.find((t) => t.id === currentSelectedId) : null;
          const currentParticipant = selectedThread?.participant;
          
          // Yeni thread listesini oluştur
          const newThreads = data.threads as DirectThread[];
          const threadMap = new Map<string, DirectThread>();
          
          newThreads.forEach((thread: DirectThread) => {
            threadMap.set(thread.id, thread);
          });
          
          // Seçili thread varsa ve participant bilgisi değiştiyse, flickering'i önlemek için
          // sadece aynı participant ID'sine sahipse güncellemeyi yap
          if (currentSelectedId && currentParticipant && threadMap.has(currentSelectedId)) {
            const incomingThread = threadMap.get(currentSelectedId)!;
            // Eğer participant ID aynıysa güncellemeyi yap, değilse mevcut bilgiyi koru
            if (incomingThread.participant?.id === currentParticipant.id) {
              // Participant bilgisini güncelle, ancak eğer name değişmişse ve geçerli görünmüyorsa koru
              threadMap.set(currentSelectedId, {
                ...incomingThread,
                participant: {
                  ...incomingThread.participant,
                  // Eğer gelen isim boşsa veya mevcut isimle çok farklıysa mevcut ismi koru
                  name: incomingThread.participant.name || currentParticipant.name,
                },
              });
            } else {
              // Participant ID farklıysa, bu yanlış thread olabilir, mevcut bilgiyi koru
              threadMap.set(currentSelectedId, {
                ...incomingThread,
                participant: currentParticipant,
              });
            }
          }
          
          return Array.from(threadMap.values());
        });

        const validUserIds = new Set<string>();
        if (currentUserId) validUserIds.add(currentUserId);
        const updates: Array<{ userId: string; lastSeenAt?: string | null }> = [];
        data.threads.forEach((thread: DirectThread) => {
          const participant = thread.participant;
          if (!participant) return;
          validUserIds.add(participant.id);
          const existing = presenceStateRef.current[participant.id];
          // Eğer presenceState'te daha yeni bir lastSeenAt varsa, onu koru
          let lastSeenAt = participant.lastSeenAt ?? null;
          if (existing?.lastSeenAt && participant.lastSeenAt) {
            const existingTime = new Date(existing.lastSeenAt).getTime();
            const dbTime = new Date(participant.lastSeenAt).getTime();
            if (existingTime > dbTime) {
              lastSeenAt = existing.lastSeenAt;
            }
          } else if (existing?.lastSeenAt) {
            lastSeenAt = existing.lastSeenAt;
          }
          updates.push({
            userId: participant.id,
            lastSeenAt,
          });
        });

        const cleaned = cleanupPresenceState(presenceStateRef.current, Array.from(validUserIds));
        const merged = mergePresenceState(cleaned, updates);
        presenceStateRef.current = revalidatePresenceState(merged);
        setPresenceState({ ...presenceStateRef.current });

        const requestedThread = searchParams?.get("thread");
        if (requestedThread && data.threads.some((thread: DirectThread) => thread.id === requestedThread)) {
          setSelectedThreadId(requestedThread);
        } else if (!currentSelectedId && data.threads.length > 0) {
          setSelectedThreadId(data.threads[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Direkt mesajlar yüklenirken hata oluştu");
    } finally {
      setLoadingThreads(false);
    }
  }, [currentUserId, searchParams]);

  const fetchFriends = useCallback(async () => {
    try {
      setLoadingFriends(true);
      setError(null);
      const response = await fetch("/api/friends", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Arkadaş listesi alınamadı");
      }
      const data = await response.json();
      const friendships: Array<{
        id: string;
        status: string;
        counterpart: { id: string; name: string | null; profileImage: string | null };
      }> = Array.isArray(data.friendships) ? data.friendships : [];
      const acceptedFriends: FriendOption[] = friendships
        .filter((friendship) => friendship.status === "accepted" && friendship.counterpart)
        .map((friendship) => ({
          id: friendship.counterpart.id,
          name: friendship.counterpart.name,
          profileImage: friendship.counterpart.profileImage ?? null,
        }));
      
      // Zaten sohbet başlatılmış arkadaşları filtrele (opsiyonel - tüm arkadaşları göstermek için kaldırabilirsiniz)
      const existingThreadParticipantIds = new Set(threads.map((thread) => thread.participant?.id).filter(Boolean));
      const availableFriends = acceptedFriends.filter((friend) => !existingThreadParticipantIds.has(friend.id));
      
      // Eğer tüm arkadaşları göstermek istiyorsanız, availableFriends yerine acceptedFriends kullanın
      setFriends(acceptedFriends);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Arkadaş listesi yüklenirken hata oluştu");
    } finally {
      setLoadingFriends(false);
    }
  }, [threads]);

  const startDirectMessage = useCallback(
    async (targetUserId: string) => {
      if (!targetUserId || targetUserId === currentUserId) return;
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
        setShowStartDialog(false);
        await fetchThreads();
        router.push(`/chat/direct?thread=${data.thread.id}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Direkt mesaj başlatılırken hata oluştu");
      } finally {
        setStartingMessage(null);
      }
    },
    [currentUserId, fetchThreads, router]
  );

  const handleOpenStartDialog = useCallback(() => {
    setShowStartDialog(true);
    setError(null);
    if (friends.length === 0) {
      fetchFriends();
    }
  }, [friends.length, fetchFriends]);

  const handleCloseStartDialog = useCallback(() => {
    setShowStartDialog(false);
    setError(null);
  }, []);

  const fetchMessages = useCallback(
    async (threadId: string, { cursor, prepend = false }: { cursor?: string | null; prepend?: boolean } = {}) => {
      if (!threadId) return;
      try {
        if (cursor) {
          setMessagesLoadingMore(true);
        } else {
          setMessagesLoading(true);
          setMessages([]);
        }

        const search = new URLSearchParams();
        if (cursor) search.set("cursor", cursor);

        const response = await fetch(`/api/chat/direct/${threadId}/messages${search.toString() ? `?${search}` : ""}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Mesajlar alınamadı");
        }

        const data = await response.json();
        const incoming: ChatMessage[] = Array.isArray(data.messages) ? data.messages : [];
        const nextCursor = data.nextCursor ?? null;

        setMessages((prev) => {
          // Map kullanarak duplicate kontrolü yap
          const messageMap = new Map<string, ChatMessage>();
          
          // Önce mevcut mesajları ekle
          prev.forEach((msg) => {
            messageMap.set(msg.id, msg);
          });
          
          let duplicateCount = 0;
          let newCount = 0;
          
          // Sonra yeni mesajları ekle (duplicate varsa güncelle)
          incoming.forEach((msg) => {
            const existing = messageMap.get(msg.id);
            if (existing) {
              // Mevcut mesajı yeni verilerle güncelle
              duplicateCount++;
              messageMap.set(msg.id, { ...existing, ...msg });
            } else {
              // Yeni mesaj ekle
              newCount++;
              messageMap.set(msg.id, msg);
            }
          });
          
          // Map'ten array'e çevir ve sırala
          const result = Array.from(messageMap.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
          console.log(`[DirectChat] [fetchMessages] Mesajlar yüklendi:`, {
            mevcut: prev.length,
            gelen: incoming.length,
            yeni: newCount,
            duplicate: duplicateCount,
            toplam: result.length,
            threadId
          });
          
          return result;
        });

        setMessagesNextCursor(nextCursor);

        const unreadIds = incoming
          .filter((message) => message.userId !== currentUserId && !(message.readByUserIds ?? []).includes(currentUserId ?? ""))
          .map((message) => message.id);

        if (!cursor && unreadIds.length > 0) {
          await markMessagesAsRead(threadId, unreadIds);
        } else if (!cursor && unreadIds.length === 0) {
          updateThreadMeta(threadId, (current) => ({
            ...current,
            unreadCount: 0,
          }));
        }

        if (!cursor) {
          // İlk yüklemede scroll için DOM'un hazır olmasını bekle
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                scrollToBottom(false);
              });
            });
          }, 150);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Mesajlar yüklenirken hata oluştu");
      } finally {
        setMessagesLoading(false);
        setMessagesLoadingMore(false);
      }
    },
    [currentUserId, markMessagesAsRead, scrollToBottom, updateThreadMeta]
  );

  const handleSelectThread = useCallback(
    (threadId: string) => {
      setSelectedThreadId(threadId);
      router.replace(`/chat/direct?thread=${threadId}`);
    },
    [router]
  );

  const handleBackToSidebar = useCallback(() => {
    setSelectedThreadId(null);
    router.replace("/chat/direct");
  }, [router]);

  const handleAttachmentsSelect = useCallback((files: FileList) => {
    const next: LocalAttachment[] = [];
    Array.from(files).forEach((file) => {
      const type = getAttachmentType(file);
      const id = crypto.randomUUID();
      const preview = URL.createObjectURL(file);
      next.push({ id, file, preview, type });
    });
    if (next.length > 0) {
      setAttachments((prev) => [...prev, ...next]);
    }
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        if (target.preview) {
          URL.revokeObjectURL(target.preview);
        }
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, [attachments]);

  const uploadAttachments = useCallback(async () => {
    if (attachments.length === 0) return [];
    const payload: Array<{
      url: string;
      type: LocalAttachment["type"];
      metadata?: Record<string, unknown>;
      size?: number;
    }> = [];
    try {
      setUploadingAttachments(true);
      for (const attachment of attachments) {
        const formData = new FormData();
        formData.append("file", attachment.file);

        const response = await fetch("/api/chat/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Dosya yüklenemedi");
        }

        const data = await response.json();
        payload.push({
          url: data.url,
          type: attachment.type,
          metadata: {
            name: attachment.file.name,
            mimeType: attachment.file.type,
          },
          size: data.size,
        });
      }
      return payload;
    } finally {
      setUploadingAttachments(false);
    }
  }, [attachments]);

  const handleSendMessage = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (!selectedThreadId || sendingMessage) return;

      const trimmed = messageInput.trim();
      const hasText = trimmed.length > 0;
      const hasAttachments = attachments.length > 0;

      if (!hasText && !hasAttachments) {
        return;
      }

      // Optimistic update için gerekli verileri hazırla
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const tempAttachments = [...attachments];
      const tempMessageInput = trimmed;

      try {
        setSendingMessage(true);
        
        // Önce attachment'ları yükle (varsa)
        const uploadedAttachments = await uploadAttachments();
        
        // Optimistic update: Mesajı hemen ekle
        const optimisticMessage: ChatMessage = {
          id: tempId,
          groupId: selectedThreadId,
          userId: currentUserId ?? "",
          type: hasText ? "text" : (uploadedAttachments[0]?.type ?? attachments[0]?.type ?? "text"),
          content: trimmed || null,
          mentionIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          attachments: uploadedAttachments.map((att, idx) => ({
            id: `temp-attachment-${idx}`,
            messageId: tempId,
            url: att.url,
            type: att.type,
            metadata: att.metadata || null,
            size: att.size,
            width: undefined,
            height: undefined,
            duration: undefined,
            createdAt: new Date().toISOString(),
          })),
          sender: {
            id: currentUserId ?? "",
            name: (session?.user as any)?.name || null,
            profileImage: (session?.user as any)?.profileImage || null,
          },
          readByUserIds: [currentUserId ?? ""].filter(Boolean),
        };

        // Mesajı hemen ekle
        upsertMessage(optimisticMessage, { scroll: true });
        
        // Temp ID'yi de takip et (SignalR'dan gelebilir)
        recentlySentMessageIdsRef.current.add(tempId);
        
        // Input ve attachment'ları hemen temizle
        setMessageInput("");
        setAttachments([]);
        
        // Textarea yüksekliğini hemen sıfırla
        requestAnimationFrame(() => {
          const textarea = messageInputRef.current;
          if (textarea) textarea.style.height = "auto";
        });

        const response = await fetch(`/api/chat/direct/${selectedThreadId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: hasText ? tempMessageInput : undefined,
            attachments: uploadedAttachments,
            type: hasText ? "text" : uploadedAttachments[0]?.type ?? "text",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Mesaj gönderilemedi");
        }

        const data = await response.json();
        const payload: ChatMessage = {
          ...data.message,
          groupId: selectedThreadId,
          sender: data.sender,
          readByUserIds: [currentUserId ?? ""].filter(Boolean),
        };

        // Bu mesaj ID'sini takip et - SignalR'dan gelen aynı mesajı yok sayacağız
        // ÖNCE ID'yi ekle, sonra mesajı güncelle (race condition'ı önlemek için)
        recentlySentMessageIdsRef.current.add(payload.id);
        // Temp ID'yi kaldır
        recentlySentMessageIdsRef.current.delete(tempId);
        // 5 saniye sonra listeden çıkar (SignalR gecikmeli gelebilir)
        setTimeout(() => {
          recentlySentMessageIdsRef.current.delete(payload.id);
        }, 5000);

        // Optimistic mesajı (tempId) kaldır ve gerçek mesajı ekle
        // upsertMessage kullanarak duplicate kontrolü yap
        setMessages((prev) => {
          // Önce tempId'li mesajı kaldır
          const filtered = prev.filter((msg) => msg.id !== tempId);
          
          console.log(`[DirectChat] [handleSendMessage] Optimistic mesaj kaldırılıyor:`, {
            tempId,
            optimisticMesajVar: prev.some(msg => msg.id === tempId),
            kaldırılmışSonrası: filtered.length
          });
          
          // Duplicate kontrolü: Map kullanarak daha güvenli
          const messageMap = new Map<string, ChatMessage>();
          filtered.forEach((msg) => {
            messageMap.set(msg.id, msg);
          });
          
          // Gerçek mesajı ekle veya güncelle
          const existing = messageMap.get(payload.id);
          if (existing) {
            console.log(`[DirectChat] [handleSendMessage] Gerçek mesaj zaten var (duplicate), güncelleniyor:`, {
              id: payload.id,
              içerik: payload.content?.substring(0, 50)
            });
            messageMap.set(payload.id, { ...existing, ...payload });
          } else {
            console.log(`[DirectChat] [handleSendMessage] Gerçek mesaj eklendi:`, {
              id: payload.id,
              içerik: payload.content?.substring(0, 50),
              öncekiSayı: filtered.length
            });
            messageMap.set(payload.id, payload);
          }
          
          // Map'ten array'e çevir ve sırala
          const updated = Array.from(messageMap.values());
          updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
          console.log(`[DirectChat] [handleSendMessage] Mesaj listesi güncellendi: ${prev.length} -> ${updated.length} mesaj`);
          
          return updated;
        });

        // Scroll yap
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToBottom(true);
          });
        });
        updateThreadMeta(selectedThreadId, (current) => ({
          ...current,
          lastMessage: payload,
          unreadCount: 0,
          updatedAt: payload.createdAt,
        }));

        // Attachment preview'ları temizle
        tempAttachments.forEach((item) => {
          if (item.preview) {
            URL.revokeObjectURL(item.preview);
          }
        });

        await markMessagesAsRead(selectedThreadId, [payload.id]);
      } catch (err: any) {
        console.error(err);
        // Hata olursa optimistic mesajı kaldır
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        // Input ve attachment'ları geri yükle (sadece henüz optimistic update yapılmadıysa)
        if (messageInput === "") {
          setMessageInput(tempMessageInput);
          setAttachments(tempAttachments);
        }
        setError(err.message ?? "Mesaj gönderilirken hata oluştu");
      } finally {
        setSendingMessage(false);
      }
    },
    [
      attachments,
      currentUserId,
      markMessagesAsRead,
      messageInput,
      selectedThreadId,
      sendingMessage,
      updateThreadMeta,
      uploadAttachments,
      upsertMessage,
      session?.user,
      scrollToBottom,
    ]
  );

  const loadOlderMessages = useCallback(async () => {
    if (!selectedThreadId || !messagesNextCursor || messagesLoadingMore) return;
    await fetchMessages(selectedThreadId, { cursor: messagesNextCursor, prepend: true });
  }, [fetchMessages, messagesLoadingMore, messagesNextCursor, selectedThreadId]);

  const adjustMessageInputHeight = useCallback(() => {
    const textarea = messageInputRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, []);

  const handleMessageChange = useCallback(
    (value: string) => {
      setMessageInput(value);
      requestAnimationFrame(adjustMessageInputHeight);
    },
    [adjustMessageInputHeight]
  );

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (threads.length === 0) {
      const retained: PresenceState = {};
      if (currentUserId && presenceStateRef.current[currentUserId]) {
        retained[currentUserId] = presenceStateRef.current[currentUserId];
      }
      presenceStateRef.current = retained;
      setPresenceState({ ...retained });
    }
  }, [currentUserId, threads.length]);

  useEffect(() => {
    if (!presenceSubscriptionKey) return;
    // Presence state'i periyodik olarak revalidate et (30 saniyede bir - timeNow ile senkronize)
    // Böylece "online" -> "offline" geçişi doğru zamanlanmış şekilde görünür
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const revalidated = revalidatePresenceState(presenceStateRef.current, currentTime);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...presenceStateRef.current });
      }
    }, 30_000); // 30 saniye - timeNow interval'i ile senkronize

    return () => clearInterval(interval);
  }, [presenceSubscriptionKey]);

  useEffect(() => {
    if (!selectedThreadId) return;
    fetchMessages(selectedThreadId);
  }, [fetchMessages, selectedThreadId]);

  // İlk yüklemede ve thread değiştiğinde scroll-to-bottom için
  useEffect(() => {
    // Thread değiştiğinde veya ilk yüklemede scroll yap
    const threadChanged = prevThreadIdForScrollRef.current !== selectedThreadId;
    if (!messagesLoading && messages.length > 0 && selectedThreadId && threadChanged) {
      // DOM'un hazır olmasını bekle
      const timeoutId = setTimeout(() => {
        scrollToBottom(false);
      }, 200);
      prevThreadIdForScrollRef.current = selectedThreadId;
      return () => clearTimeout(timeoutId);
    } else if (selectedThreadId !== prevThreadIdForScrollRef.current) {
      prevThreadIdForScrollRef.current = selectedThreadId;
    }
  }, [messagesLoading, selectedThreadId, scrollToBottom, messages.length]);

  useEffect(() => {
    adjustMessageInputHeight();
  }, [adjustMessageInputHeight, messageInput]);

  // SignalR hook for realtime direct chat
  useSignalRChat({
    groupId: selectedThreadId,
    enabled: !!selectedThreadId,
    onMessage: async (payload) => {
      console.log("[DirectChat] Received message via SignalR:", payload);
      const incoming = {
        ...payload.message,
        sender: payload.sender,
        readByUserIds: payload.message.readByUserIds ?? [],
      };

      if (incoming.groupId === selectedThreadId) {
        console.log(`[DirectChat] [SignalR] Mesaj alındı:`, {
          id: incoming.id,
          içerik: incoming.content?.substring(0, 50),
          gönderen: incoming.sender.name || incoming.userId,
          kendiMesajımız: incoming.userId === currentUserId,
          threadId: selectedThreadId,
          recentlySent: recentlySentMessageIdsRef.current.has(incoming.id)
        });
        
        // Eğer bu bizim gönderdiğimiz bir mesajsa ve zaten server response'dan eklediysek, SignalR mesajını yok say
        if (incoming.userId === currentUserId && recentlySentMessageIdsRef.current.has(incoming.id)) {
          // Bu mesajı zaten server response'dan ekledik, duplicate eklemeyi önle
          // Sadece güncelle (readByUserIds gibi alanlar güncellenmiş olabilir)
          setMessages((prev) => {
            const exists = prev.find((msg) => msg.id === incoming.id);
            if (exists) {
              // Sadece güncelle, yeni mesaj ekleme
              return prev.map((msg) => (msg.id === incoming.id ? { ...msg, ...incoming } : msg));
            }
            // Eğer mesaj listede yoksa, ekleme (zaten server response'dan eklendi veya eklenecek)
            return prev;
          });
          // SignalR mesajını yok say, çünkü zaten server response'dan eklendi
          return;
        }
        
        // Temp ID kontrolü - eğer optimistic mesaj varsa, SignalR mesajını bekle
        const isTempId = incoming.id.startsWith('temp-');
        if (isTempId && recentlySentMessageIdsRef.current.has(incoming.id)) {
          // Bu temp mesaj zaten optimistic olarak eklendi, SignalR mesajını yok say
          return;
        }
        
        // Başkasının mesajı veya henüz eklenmemiş bizim mesajımız
        // upsertMessage kullan (içinde zaten duplicate kontrolü var)
        upsertMessage(incoming, { scroll: true });

        if (incoming.userId !== currentUserId) {
          await markMessagesAsRead(selectedThreadId, [incoming.id]);
        }

        // Mesaj geldiğinde presence güncelle
        if (postPresenceRef.current) {
          postPresenceRef.current("online");
        }
      }

      updateThreadMeta(incoming.groupId, (current) => ({
        ...current,
        lastMessage: incoming,
        unreadCount:
          incoming.groupId === selectedThreadId && incoming.userId === currentUserId
            ? 0
            : incoming.groupId === selectedThreadId
            ? 0
            : current.unreadCount + (incoming.userId === currentUserId ? 0 : 1),
        updatedAt: incoming.createdAt,
      }));
    },
    onUserTyping: (userId) => {
      const merged = mergePresenceState(presenceStateRef.current, [
        {
          userId,
          status: "online" as const,
          lastSeenAt: new Date().toISOString(),
        },
      ]);
      const revalidated = revalidatePresenceState(merged);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    },
    onUserJoined: (userId) => {
      const merged = mergePresenceState(presenceStateRef.current, [
        {
          userId,
          status: "online" as const,
          lastSeenAt: new Date().toISOString(),
        },
      ]);
      const revalidated = revalidatePresenceState(merged);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    },
    onUserLeft: (userId) => {
      const merged = mergePresenceState(presenceStateRef.current, [
        {
          userId,
          status: "offline" as const,
          lastSeenAt: new Date().toISOString(),
        },
      ]);
      const revalidated = revalidatePresenceState(merged);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    },
    onPresenceUpdate: (data) => {
      // Participant'ın presence'ını güncelle
      const merged = mergePresenceState(presenceStateRef.current, [
        {
          userId: data.userId,
          status: data.status,
          lastSeenAt: data.lastSeenAt,
        },
      ]);
      const revalidated = revalidatePresenceState(merged);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    },
  });

  useEffect(() => {
    if (!selectedThreadId || !currentUserId) return;
    let active = true;

    const updateLocalPresence = (status: "online" | "offline") => {
      const timestamp = new Date().toISOString();
      presenceStateRef.current = {
        ...presenceStateRef.current,
        [currentUserId]: {
          status,
          lastSeenAt: timestamp,
        },
      };
      setPresenceState({ ...presenceStateRef.current });
    };

    const postPresence = async (status: "online" | "offline", { useBeacon = false } = {}, retryCount: number = 0) => {
      if (!active) return;
      updateLocalPresence(status);

      const MAX_RETRIES = 2;
      const payload = JSON.stringify({ status });
      
      if (useBeacon && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([payload], { type: "application/json" });
        const sent = navigator.sendBeacon(`/api/chat/direct/${selectedThreadId}/presence`, blob);
        if (!sent && retryCount < MAX_RETRIES) {
          // If sendBeacon failed, retry with fetch
          return postPresence(status, { useBeacon: false }, retryCount + 1);
        }
        return;
      }

      try {
        const response = await fetch(`/api/chat/direct/${selectedThreadId}/presence`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        });
        if (!response.ok) {
          // Only retry on server errors (5xx), not client errors (4xx)
          if (response.status >= 500 && retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return postPresence(status, { useBeacon }, retryCount + 1);
          }
          console.warn(`[DirectChat] Presence update returned ${response.status}, will retry on next activity`);
        }
      } catch (err) {
        // Only retry on network errors
        if (retryCount < MAX_RETRIES && err instanceof TypeError && err.message.includes("fetch")) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return postPresence(status, { useBeacon }, retryCount + 1);
        }
        console.error("[DirectChat] Presence update failed", err);
      }
    };

    postPresenceRef.current = postPresence;

    // Tarayıcı kapanma ve visibility değişikliği için event listener'lar
    // pagehide daha güvenilir, özellikle mobile tarayıcılarda
    const handlePageHide = () => {
      postPresence("offline", { useBeacon: true });
    };

    // beforeunload bazı durumlarda çalışmayabilir ama yine de ekliyoruz
    const handleBeforeUnload = () => {
      postPresence("offline", { useBeacon: true });
    };

    // unload event'i de ekliyoruz (daha eski tarayıcı desteği için)
    const handleUnload = () => {
      postPresence("offline", { useBeacon: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        postPresence("online");
      } else {
        // Sayfa gizlendiğinde offline yap (tab değişimi, minimize vb.)
        postPresence("offline", { useBeacon: true });
      }
    };

    // pagehide en güvenilir event (mobile ve modern tarayıcılarda)
    window.addEventListener("pagehide", handlePageHide, { capture: true });
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Event-based presence: track user activity instead of heartbeat
    let activityDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleUserActivity = () => {
      if (!active || document.visibilityState !== "visible") return;
      
      // Debounce presence updates to avoid excessive API calls (max once per 2.5 seconds)
      if (activityDebounceTimer) {
        clearTimeout(activityDebounceTimer);
      }
      
      activityDebounceTimer = setTimeout(() => {
        if (active && document.visibilityState === "visible") {
          postPresence("online").catch((error) => {
            console.warn("[DirectChat] Presence update failed, will retry on next activity:", error);
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

    // Initial presence update
    postPresence("online");

    return () => {
      active = false;
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
      postPresenceRef.current = null;
      postPresence("offline", { useBeacon: true });
    };
  }, [currentUserId, selectedThreadId]);

  // Presence state'i düzenli olarak revalidate et (her 30 saniyede bir - timeNow ile senkronize)
  useEffect(() => {
    if (!selectedThreadId) return;
    
    const revalidationInterval = setInterval(() => {
      const currentTime = Date.now();
      const revalidated = revalidatePresenceState(presenceStateRef.current, currentTime);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    }, 30_000);

    return () => {
      clearInterval(revalidationInterval);
    };
  }, [selectedThreadId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-message-id");
            if (!messageId || !selectedThreadId) return;

            const target = messages.find((message) => message.id === messageId);
            if (!target) return;

            const alreadyRead = (target.readByUserIds ?? []).includes(currentUserId ?? "");
            if (!alreadyRead && target.userId !== currentUserId) {
              markMessagesAsRead(selectedThreadId, [target.id]);
            }
          }
        });
      },
      {
        root: container,
        threshold: 1,
      }
    );

    container.querySelectorAll("[data-message-id]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [currentUserId, markMessagesAsRead, messages, selectedThreadId]);

  const sidebarItems = useMemo(() => {
    return sortedThreads.map((thread) => {
      const participant = thread.participant;
      const displayName = participant?.name ?? participant?.email ?? "Bilinmeyen kullanıcı";
      const initials = displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const presence = participant ? presenceState[participant.id] : undefined;
      
      // Presence status'u dinamik olarak hesapla (timeNow ile)
      const actualPresenceStatus = presence?.lastSeenAt 
        ? derivePresenceStatus(presence.lastSeenAt, timeNow)
        : presence?.status ?? "offline";

      const lastMessagePreview =
        thread.lastMessage?.content ??
        (thread.lastMessage?.attachments?.length ? `${thread.lastMessage.attachments.length} adet ek` : "Yeni mesaj yazın");

      // Eğer kullanıcı online ise, meta (son mesaj zamanı) göster
      // Eğer offline ise, meta göster (son mesaj zamanı)
      // Presence indicator zaten ayrı gösteriliyor
      return {
        id: thread.id,
        title: displayName,
        preview: lastMessagePreview,
        meta: thread.lastMessage?.createdAt ? formatRelativeDate(thread.lastMessage.createdAt, timeNow) : undefined,
        unreadCount: thread.unreadCount,
        initials,
        presenceIndicator: participant ? (actualPresenceStatus === "online" ? "online" : "offline") : "none",
      };
    });
  }, [presenceState, sortedThreads, timeNow]);

  const messageEmptyState = {
    icon: <Users className="h-10 w-10 text-blue-500" />,
    title: "Henüz mesaj yok.",
    description: "İlk mesajı siz gönderebilirsiniz.",
  };

  const conversationHeader = selectedThread ? (
    <header className="pl-14 sm:pl-4 sm:px-6 pr-4 py-4 sm:py-5 border-b border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Back button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToSidebar}
            className="lg:hidden h-10 w-10 rounded-full border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/60 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link
            href={selectedThread.participant?.id ? `/profile/${selectedThread.participant.id}` : "#"}
            className="relative transition-transform hover:scale-105 flex-shrink-0"
          >
            {selectedThread.participant?.profileImage ? (
              <img
                src={selectedThread.participant.profileImage}
                alt={selectedThread.participant.name ?? selectedThread.participant.email}
                className="h-12 w-12 rounded-full object-cover border border-white/70 dark:border-gray-900/70 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
                {(selectedThread.participant?.name ?? selectedThread.participant?.email ?? "?")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
                (() => {
                  const actualStatus = participantPresence.lastSeenAt 
                    ? derivePresenceStatus(participantPresence.lastSeenAt, timeNow)
                    : participantPresence.status ?? "offline";
                  return actualStatus === "online" ? "bg-emerald-400" : "bg-gray-400";
                })()
              }`}
            />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-display font-semibold text-gray-900 dark:text-gray-100 truncate">
              {selectedThread.participant?.name ?? selectedThread.participant?.email ?? "Bilinmeyen kullanıcı"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {(() => {
                // Gerçek zamanlı status kontrolü - lastSeenAt'a göre (timeNow ile dinamik güncelleme)
                const actualStatus = participantPresence.lastSeenAt 
                  ? derivePresenceStatus(participantPresence.lastSeenAt, timeNow)
                  : "offline";
                
                if (actualStatus === "online") {
                  return "Şu anda çevrimiçi";
                } else if (participantPresence.lastSeenAt) {
                  return `${formatRelativeDate(participantPresence.lastSeenAt, timeNow)} çevrimiçi oldu`;
                } else {
                  return "Çevrimdışı";
                }
              })()}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 dark:bg-blue-900/30 px-3 py-1 text-blue-700 dark:text-blue-200 text-xs sm:text-sm self-start sm:self-auto">
          <Users className="h-4 w-4" />
          {(() => {
            // Gerçek zamanlı status kontrolü (timeNow ile dinamik güncelleme)
            const actualStatus = participantPresence.lastSeenAt 
              ? derivePresenceStatus(participantPresence.lastSeenAt, timeNow)
              : "offline";
            return actualStatus === "online" ? "Çevrimiçi" : "Çevrimdışı";
          })()}
        </div>
      </div>
    </header>
  ) : null;

  const conversationBody = !selectedThread ? (
    <div className="hidden lg:flex flex-1 items-center justify-center text-center px-6">
      <div className="space-y-3 max-w-md">
        <User className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Bir sohbet seçin veya başlatın</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sol taraftaki listeden bir kişiyi seçerek konuşmayı görüntüleyin.
        </p>
      </div>
    </div>
  ) : (
    <MessageViewport
      ref={messagesContainerRef}
      messages={messages}
      currentUserId={currentUserId}
      hasMore={Boolean(messagesNextCursor)}
      loading={messagesLoading}
      loadingMore={messagesLoadingMore}
      onLoadMore={loadOlderMessages}
      emptyState={messageEmptyState}
      endRef={messagesEndRef}
    />
  );

  const composerDisabled = !messageInput.trim() && attachments.length === 0;

  const composerNode = selectedThread ? (
    <Composer
      message={messageInput}
      onMessageChange={handleMessageChange}
      onSubmit={handleSendMessage}
      onSendShortcut={() => handleSendMessage()}
      attachments={attachments}
      onAttachmentsSelect={handleAttachmentsSelect}
      onAttachmentRemove={removeAttachment}
      disabled={composerDisabled}
      sending={sendingMessage}
      uploading={uploadingAttachments}
      textareaRef={messageInputRef}
      fileInputRef={fileInputRef}
      placeholder="Mesajınızı yazın..."
    />
  ) : null;

  const overlayNode = error ? (
    <div className="fixed top-6 right-6 z-40 bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/40 px-4 py-2 rounded-xl backdrop-blur">
      {error}
    </div>
  ) : null;

  const mobileHeaderActions = (
    <div className="flex items-center gap-2">
      <Button variant="gradient" size="sm" onClick={handleOpenStartDialog} className="text-xs px-3 py-1.5 h-8">
        Yeni Mesaj
      </Button>
      <Button variant="outline" size="sm" href="/dashboard/friends" className="text-xs px-3 py-1.5 h-8">
        Arkadaş ekle
      </Button>
    </div>
  );

  return (
    <ChatShell
      sidebar={
        <ConversationSidebar
          title="Direkt Mesajlar"
          subtitle={`${threads.length} sohbet`}
          action={
            <div className="flex items-center gap-2">
              <Button variant="gradient" size="sm" onClick={handleOpenStartDialog}>
                Yeni Mesaj
              </Button>
              <Button variant="outline" size="sm" href="/dashboard/friends">
                Arkadaş ekle
              </Button>
            </div>
          }
          loading={loadingThreads}
          items={sidebarItems}
          activeId={selectedThreadId}
          onSelect={handleSelectThread}
          emptyState={{
            icon: <User className="h-10 w-10 text-blue-500" />,
            title: "Henüz direkt mesaj başlatmadınız.",
            description: "Arkadaş ekle sayfasından bağlantı kurup ardından sohbet başlatabilirsiniz.",
          }}
        />
      }
      conversationHeader={conversationHeader}
      composer={composerNode}
      overlay={overlayNode}
      hasSelectedConversation={!!selectedThreadId}
      onBackToSidebar={handleBackToSidebar}
      mobileHeaderActions={mobileHeaderActions}
    >
      {conversationBody}
      <StartDirectMessageDialog
        open={showStartDialog}
        friends={friends}
        loading={startingMessage !== null}
        loadingFriends={loadingFriends}
        error={error}
        onSelectFriend={startDirectMessage}
        onClose={handleCloseStartDialog}
      />
    </ChatShell>
  );
}

