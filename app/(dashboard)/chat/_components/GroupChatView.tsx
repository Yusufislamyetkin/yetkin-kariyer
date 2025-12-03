"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";

import { Button } from "@/app/components/ui/Button";
import { Users, Dot, FileText, Plus, Lock, Unlock, Copy, RefreshCw, Link2, UserPlus, Search, X, Loader2 } from "lucide-react";
import { useSignalRChat } from "@/hooks/useSignalRChat";
import {
  cleanupPresenceState,
  derivePresenceStatus,
  hasPresenceStateChanged,
  mergePresenceState,
  revalidatePresenceState,
} from "@/lib/chat/presence";
import { cn } from "@/lib/utils";
import { useChatSummary } from "@/app/contexts/ChatSummaryContext";
import { useStrikeCompletionCheck } from "@/hooks/useStrikeCompletionCheck";

import {
  ChatShell,
  ConversationSidebar,
  MessageViewport,
  Composer,
  MemberPanel,
  JoinDialog,
  CreateGroupDialog,
  AddMembersDialog,
  ChatMessage,
  LocalAttachment,
  PresenceEntry,
  GroupMember,
  PresenceState,
  FriendOption,
  CreateGroupFormValues,
} from ".";

type ChatGroupMembership = {
  role: string;
  lastSeenAt: string | null;
  isMuted: boolean;
};

type ChatGroup = {
  id: string;
  name: string;
  slug: string;
  visibility: "public" | "private";
  allowLinkJoin: boolean;
  inviteCode: string | null;
  createdById: string | null;
  expertise: string | null;
  description: string | null;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  membership: ChatGroupMembership | null;
  lastMessage: (Omit<ChatMessage, "groupId"> & { groupId?: string }) | null;
  unreadCount: number;
};

type GroupMemberResponse = Omit<GroupMember, "presence">;

type FriendshipResponse = {
  id: string;
  status: string;
  counterpart: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
};

type GroupChatCategory = "community" | "user";

type GroupChatViewProps = {
  category: GroupChatCategory;
};

const CREATE_GROUP_DEFAULTS: CreateGroupFormValues = {
  name: "",
  description: "",
  expertise: "",
  visibility: "public",
  allowLinkJoin: false,
  memberIds: [],
};

const CATEGORY_COPY: Record<
  GroupChatCategory,
  {
    sidebarTitle: string;
    sidebarSubtitle: (count: number) => string;
    sidebarEmptyTitle: string;
    sidebarEmptyDescription: string;
    selectPromptTitle: string;
    selectPromptDescription: string;
    messageEmptyDescription: string;
  }
> = {
  community: {
    sidebarTitle: "Yardımlaşma Toplulukları",
    sidebarSubtitle: (count) => `${count} topluluk`,
    sidebarEmptyTitle: "Henüz katıldığınız bir topluluk yok.",
    sidebarEmptyDescription: "Uzmanlık alanınıza göre topluluklar yakında eklenecek.",
    selectPromptTitle: "Bir topluluk seçin",
    selectPromptDescription: "Soldaki listeden bir yardımlaşma topluluğunu seçerek sohbeti görüntüleyebilirsiniz.",
    messageEmptyDescription: "İlk mesajı yazarak yardımlaşmayı başlatabilirsiniz.",
  },
  user: {
    sidebarTitle: "Gruplar",
    sidebarSubtitle: (count) => `${count} grup`,
    sidebarEmptyTitle: "Henüz katıldığınız bir grup yok.",
    sidebarEmptyDescription: "Yeni gruplar oluşturarak iletişimi başlatabilirsiniz.",
    selectPromptTitle: "Bir grup seçin",
    selectPromptDescription: "Soldaki listeden bir grubu seçerek sohbeti görüntüleyebilirsiniz.",
    messageEmptyDescription: "İlk mesajı yazarak sohbeti başlatabilirsiniz.",
  },
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

export function GroupChatView({ category }: GroupChatViewProps) {
  const copy = CATEGORY_COPY[category];
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh: refreshChatSummary } = useChatSummary();
  const { checkStrikeCompletion } = useStrikeCompletionCheck();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUserId = useMemo(() => session?.user && (session.user as any).id, [session?.user]) as
    | string
    | undefined;

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [createGroupForm, setCreateGroupForm] = useState<CreateGroupFormValues>({ ...CREATE_GROUP_DEFAULTS });
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendOption[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendError, setFriendError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesLoadingMore, setMessagesLoadingMore] = useState(false);
  const [messagesNextCursor, setMessagesNextCursor] = useState<string | null>(null);

  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  const [groupMembers, setGroupMembers] = useState<Record<string, GroupMemberResponse[]>>({});
  const presenceStateRef = useRef<PresenceState>({});
  const postPresenceRef = useRef<((status: "online" | "offline", options?: { useBeacon?: boolean }) => Promise<void>) | null>(null);
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const messagesRef = useRef<ChatMessage[]>([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [joinPromptGroupId, setJoinPromptGroupId] = useState<string | null>(null);
  const [joinInviteCode, setJoinInviteCode] = useState("");
  const [joinInviteError, setJoinInviteError] = useState<string | null>(null);
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [startingDirectMessageUserId, setStartingDirectMessageUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addMembersDialogOpen, setAddMembersDialogOpen] = useState(false);
  const [addMembersSelection, setAddMembersSelection] = useState<string[]>([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [addMembersError, setAddMembersError] = useState<string | null>(null);
  const [inviteLinkError, setInviteLinkError] = useState<string | null>(null);
  const [updatingInviteLink, setUpdatingInviteLink] = useState(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchNextCursor, setSearchNextCursor] = useState<string | null>(null);

  const canCreateGroup = category === "user";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const prevGroupIdForScrollRef = useRef<string | null>(null);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      if (Boolean(a.membership) !== Boolean(b.membership)) {
        return a.membership ? -1 : 1;
      }
      const aDate = a.lastMessage?.createdAt ?? a.updatedAt;
      const bDate = b.lastMessage?.createdAt ?? b.updatedAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [groups]);

  // Read group ID or slug from URL query params on mount and when searchParams change
  useEffect(() => {
    const groupParam = searchParams.get("group");
    if (groupParam && groupParam !== selectedGroupId) {
      // First try to find by ID
      let foundGroup = groups.find((group) => group.id === groupParam);
      
      // If not found by ID, try to find by slug
      if (!foundGroup) {
        foundGroup = groups.find((group) => group.slug === groupParam);
      }
      
      if (foundGroup && foundGroup.id !== selectedGroupId) {
        setSelectedGroupId(foundGroup.id);
      }
    } else if (!groupParam && selectedGroupId) {
      // Clear selection if group param is removed
      setSelectedGroupId(null);
    }
  }, [searchParams, groups, selectedGroupId]);

  const selectedGroup = selectedGroupId ? groups.find((group) => group.id === selectedGroupId) ?? null : null;
  const isJoinedToSelectedGroup = Boolean(selectedGroup?.membership);
  const scheduleSummaryRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      refreshChatSummary().catch(() => {});
      refreshTimeoutRef.current = null;
    }, 300);
  }, [refreshChatSummary]);

  // Keep messagesRef in sync with messages state for SignalR handler
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const canManageSelectedGroup = useMemo(() => {
    if (!selectedGroup) return false;
    if (selectedGroup.createdById && selectedGroup.createdById === currentUserId) {
      return true;
    }
    const role = selectedGroup.membership?.role;
    return role === "admin" || role === "moderator";
  }, [currentUserId, selectedGroup]);

  const availableFriendsForSelectedGroup = useMemo(() => {
    if (!selectedGroupId) return [] as FriendOption[];
    const members = groupMembers[selectedGroupId] ?? [];
    const memberIds = new Set(members.map((member) => member.user.id));
    return friends.filter((friend) => !memberIds.has(friend.id));
  }, [friends, groupMembers, selectedGroupId]);

  const promptGroup = joinPromptGroupId ? groups.find((group) => group.id === joinPromptGroupId) ?? null : null;
  const promptRequiresInviteCode =
    Boolean(promptGroup && promptGroup.visibility === "private" && promptGroup.allowLinkJoin);

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

  const updateGroupMeta = useCallback((groupId: string, updater: (current: ChatGroup) => ChatGroup) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return updater(group);
      })
    );
  }, []);

  const upsertMessage = useCallback(
    (incoming: ChatMessage, { scroll }: { scroll?: boolean } = {}) => {
      setMessages((prev) => {
        const exists = prev.find((message) => message.id === incoming.id);
        const updated = exists
          ? prev.map((message) => (message.id === incoming.id ? { ...message, ...incoming } : message))
          : [...prev, incoming];
        updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
    async (groupId: string, messageIds: string[]) => {
      if (!messageIds.length) return;
      try {
        await fetch(`/api/chat/groups/${groupId}/read`, {
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
                  readByUserIds: Array.from(
                    new Set([...(message.readByUserIds ?? []), currentUserId].filter(Boolean))
                  ) as string[],
                }
              : message
          )
        );

        updateGroupMeta(groupId, (current) => ({
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
        console.error("Failed to mark messages as read", err);
      }
    },
    [currentUserId, scheduleSummaryRefresh, updateGroupMeta]
  );

  const fetchGroups = useCallback(async (options?: { selectGroupId?: string }) => {
    try {
      setLoadingGroups(true);
      setError(null);
      const params = new URLSearchParams({ category });
      const response = await fetch(`/api/chat/groups?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Gruplar alınamadı");
      }
      const data = await response.json();
      if (Array.isArray(data.groups)) {
        setGroups(data.groups);
        setSelectedGroupId((prev) => {
          if (options?.selectGroupId) {
            return options.selectGroupId;
          }

          // Check URL for group parameter (could be ID or slug)
          const urlGroupParam = searchParams.get("group");
          if (urlGroupParam) {
            // First try to find by ID
            let foundGroup = data.groups.find((group: ChatGroup) => group.id === urlGroupParam);
            
            // If not found by ID, try to find by slug
            if (!foundGroup) {
              foundGroup = data.groups.find((group: ChatGroup) => group.slug === urlGroupParam);
            }
            
            if (foundGroup) {
              return foundGroup.id;
            }
          }

          if (prev && data.groups.some((group: ChatGroup) => group.id === prev)) {
            return prev;
          }

          const fallback = data.groups[0]?.id ?? null;
          return fallback;
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Gruplar yüklenirken hata oluştu");
    } finally {
      setLoadingGroups(false);
    }
  }, [category, searchParams]);

  const fetchMembers = useCallback(
    async (groupId: string) => {
      try {
        const response = await fetch(`/api/chat/groups/${groupId}/members`, { cache: "no-store" });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Üyeler alınamadı");
        }
        const data = await response.json();
        const membersList: GroupMemberResponse[] = Array.isArray(data.members) ? data.members : [];
        setGroupMembers((prev) => ({ ...prev, [groupId]: membersList }));

        if (groupId === selectedGroupId) {
          const validUserIds = membersList.map((member) => member.user.id);
          const updates = membersList.map((member) => {
            const existing = presenceStateRef.current[member.user.id];
            // Eğer presenceState'te daha yeni bir lastSeenAt varsa, onu koru
            let lastSeenAt = member.lastSeenAt;
            if (existing?.lastSeenAt && member.lastSeenAt) {
              const existingTime = new Date(existing.lastSeenAt).getTime();
              const dbTime = new Date(member.lastSeenAt).getTime();
              if (existingTime > dbTime) {
                lastSeenAt = existing.lastSeenAt;
              }
            } else if (existing?.lastSeenAt) {
              lastSeenAt = existing.lastSeenAt;
            }
            return {
              userId: member.user.id,
              lastSeenAt,
            };
          });
          const cleaned = cleanupPresenceState(presenceStateRef.current, validUserIds);
          const merged = mergePresenceState(cleaned, updates);
          const revalidated = revalidatePresenceState(merged);
          presenceStateRef.current = revalidated;
          setPresenceState({ ...revalidated });
        }
      } catch (err) {
        console.error("Failed to load members", err);
      }
    },
    [selectedGroupId]
  );

  const fetchMessages = useCallback(
    async (groupId: string, { cursor, prepend = false }: { cursor?: string | null; prepend?: boolean } = {}) => {
      if (!groupId) return;
      try {
        if (cursor) {
          setMessagesLoadingMore(true);
        } else {
          setMessagesLoading(true);
          setMessages([]);
        }

        const searchParams = new URLSearchParams();
        if (cursor) searchParams.set("cursor", cursor);

        const response = await fetch(
          `/api/chat/groups/${groupId}/messages${searchParams.toString() ? `?${searchParams}` : ""}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Mesajlar alınamadı");
        }

        const data = await response.json();
        const incoming: ChatMessage[] = Array.isArray(data.messages) ? data.messages : [];
        const nextCursor = data.nextCursor ?? null;

        setMessages((prev) => {
          const combined = prepend ? [...incoming, ...prev] : [...prev, ...incoming];
          const unique = new Map<string, ChatMessage>();
          combined.forEach((message) => {
            unique.set(message.id, message);
          });
          return Array.from(unique.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        setMessagesNextCursor(nextCursor);

        const unreadIds = incoming
          .filter(
            (message) => message.userId !== currentUserId && !(message.readByUserIds ?? []).includes(currentUserId ?? "")
          )
          .map((message) => message.id);

        if (!cursor && unreadIds.length > 0) {
          await markMessagesAsRead(groupId, unreadIds);
        } else if (!cursor && unreadIds.length === 0) {
          updateGroupMeta(groupId, (current) => ({
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
    [currentUserId, markMessagesAsRead, scrollToBottom, updateGroupMeta]
  );

  const searchMessages = useCallback(
    async (groupId: string, query: string, cursor?: string | null) => {
      if (!groupId || !query.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError(null);

        const searchParams = new URLSearchParams();
        searchParams.set("q", query.trim());
        if (cursor) searchParams.set("cursor", cursor);

        const response = await fetch(
          `/api/chat/groups/${groupId}/messages/search?${searchParams.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Arama yapılamadı");
        }

        const data = await response.json();
        const incoming: ChatMessage[] = Array.isArray(data.messages) ? data.messages : [];
        const nextCursor = data.nextCursor ?? null;

        setSearchResults((prev) => {
          if (cursor) {
            // Load more results
            const combined = [...prev, ...incoming];
            const unique = new Map<string, ChatMessage>();
            combined.forEach((message) => {
              unique.set(message.id, message);
            });
            return Array.from(unique.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else {
            // New search
            return incoming.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        });

        setSearchNextCursor(nextCursor);
        setShowSearchResults(true);
      } catch (err: any) {
        console.error(err);
        setSearchError(err.message ?? "Arama yapılırken hata oluştu");
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (!selectedGroupId || !isJoinedToSelectedGroup) return;
      setSearchQuery(query);
      if (query.trim()) {
        searchMessages(selectedGroupId, query);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    },
    [selectedGroupId, isJoinedToSelectedGroup, searchMessages]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchError(null);
    setSearchNextCursor(null);
  }, []);

  const handleSelectGroup = useCallback(
    (groupId: string) => {
      const target = groups.find((group) => group.id === groupId);
      const basePath = category === "community" ? "/chat" : "/chat/groups";
      if (target && !target.membership) {
        setSelectedGroupId(groupId);
        setJoinPromptGroupId(groupId);
        setJoinInviteCode("");
        setJoinInviteError(null);
        setShowSidebar(false);
        router.replace(`${basePath}?group=${groupId}`);
        return;
      }
      setSelectedGroupId(groupId);
      setShowSidebar(false);
      router.replace(`${basePath}?group=${groupId}`);
    },
    [category, groups, router]
  );

  const handleJoinGroup = useCallback(
    async (groupId: string, options?: { inviteCode?: string }) => {
      try {
        setJoiningGroup(true);
        setJoinInviteError(null);
        const inviteCode = options?.inviteCode?.trim();
        const response = await fetch(`/api/chat/groups/${groupId}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inviteCode ? { inviteCode } : {}),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error ?? "Gruba katılma işlemi başarısız oldu");
        }

        const membershipPayload = payload.membership;
        if (!membershipPayload) {
          throw new Error("Katılım bilgisi doğrulanamadı.");
        }

        const alreadyMember = Boolean(payload.alreadyMember);

        // Close dialog first
        setJoinPromptGroupId(null);
        setJoinInviteCode("");
        setJoinInviteError(null);

        // Update group meta with membership
        if (!alreadyMember) {
          updateGroupMeta(groupId, (current) => ({
            ...current,
            membership: {
              role: membershipPayload.role,
              lastSeenAt: membershipPayload.lastSeenAt,
              isMuted: membershipPayload.isMuted,
            },
            memberCount: current.memberCount + 1,
          }));
        }

        // Set selected group
        setSelectedGroupId(groupId);

        // Fetch groups and members, then fetch messages
        await Promise.all([
          fetchGroups({ selectGroupId: groupId }),
          fetchMembers(groupId),
        ]);

        // Ensure messages are loaded after joining
        await fetchMessages(groupId);
      } catch (err: any) {
        console.error(err);
        setJoinInviteError(err.message ?? "Gruba katılma sırasında hata oluştu");
        // Don't close dialog on error
        setJoinPromptGroupId(groupId);
      } finally {
        setJoiningGroup(false);
      }
    },
    [fetchGroups, fetchMembers, fetchMessages, updateGroupMeta]
  );

  const toggleAddMemberSelection = useCallback((userId: string) => {
    setAddMembersSelection((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  const openAddMembersDialog = useCallback(() => {
    setAddMembersError(null);
    setAddMembersSelection([]);
    setAddMembersDialogOpen(true);
  }, []);

  const closeAddMembersDialog = useCallback(() => {
    setAddMembersDialogOpen(false);
    setAddMembersSelection([]);
    setAddMembersError(null);
  }, []);

  const handleAddMembersSubmit = useCallback(async () => {
    if (!selectedGroupId || addMembersSelection.length === 0) {
      return;
    }
    try {
      setAddingMembers(true);
      setAddMembersError(null);
      const response = await fetch(`/api/chat/groups/${selectedGroupId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: addMembersSelection }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Üyeler eklenirken bir hata oluştu.");
      }

      const addedMembersRaw: unknown[] = Array.isArray(payload.addedMembers) ? payload.addedMembers : [];
      const addedMembers: GroupMemberResponse[] = addedMembersRaw
        .map((member: any) => {
          if (!member || !member.user) {
            return null;
          }
          return {
            id: member.id as string,
            role: member.role as string,
            isMuted: Boolean(member.isMuted),
            lastSeenAt: typeof member.lastSeenAt === "string" ? member.lastSeenAt : member.lastSeenAt ?? null,
            joinedAt: member.joinedAt as string,
            user: {
              id: member.user.id as string,
              name: member.user.name ?? null,
              email: member.user.email as string,
              profileImage: member.user.profileImage ?? null,
            },
          };
        })
        .filter((member): member is GroupMemberResponse => Boolean(member));

      if (addedMembers.length > 0) {
        setGroupMembers((prev) => {
          const existing = prev[selectedGroupId] ?? [];
          const existingIds = new Set(existing.map((member) => member.user.id));
          const merged = [...existing];
          addedMembers.forEach((member) => {
            if (!existingIds.has(member.user.id)) {
              merged.push(member);
            }
          });
          return { ...prev, [selectedGroupId]: merged };
        });

        updateGroupMeta(selectedGroupId, (current) => ({
          ...current,
          memberCount: current.memberCount + addedMembers.length,
        }));

        await fetchMembers(selectedGroupId);
      }

      setAddMembersSelection([]);
      setAddMembersDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setAddMembersError(err.message ?? "Üye ekleme işlemi başarısız oldu.");
    } finally {
      setAddingMembers(false);
    }
  }, [addMembersSelection, fetchMembers, selectedGroupId, updateGroupMeta]);

  const handleToggleInviteLink = useCallback(
    async (allow: boolean) => {
      if (!selectedGroupId) return;
      try {
        setUpdatingInviteLink(true);
        setInviteLinkError(null);
        const response = await fetch(`/api/chat/groups/${selectedGroupId}/invite-link`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ allowLinkJoin: allow }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error ?? "Davet linki güncellenemedi.");
        }
        updateGroupMeta(selectedGroupId, (current) => ({
          ...current,
          visibility: payload.visibility ?? current.visibility,
          allowLinkJoin: Boolean(payload.allowLinkJoin),
          inviteCode: payload.inviteCode ?? null,
        }));
      } catch (err: any) {
        console.error(err);
        setInviteLinkError(err.message ?? "Davet linki güncellenemedi.");
      } finally {
        setUpdatingInviteLink(false);
      }
    },
    [selectedGroupId, updateGroupMeta]
  );

  const handleRegenerateInviteCode = useCallback(async () => {
    if (!selectedGroupId) return;
    try {
      setUpdatingInviteLink(true);
      setInviteLinkError(null);
      const response = await fetch(`/api/chat/groups/${selectedGroupId}/invite-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allowLinkJoin: true, regenerate: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Davet kodu yenilenemedi.");
      }
      updateGroupMeta(selectedGroupId, (current) => ({
        ...current,
        visibility: payload.visibility ?? current.visibility,
        allowLinkJoin: Boolean(payload.allowLinkJoin),
        inviteCode: payload.inviteCode ?? null,
      }));
    } catch (err: any) {
      console.error(err);
      setInviteLinkError(err.message ?? "Davet kodu yenilenemedi.");
    } finally {
      setUpdatingInviteLink(false);
    }
  }, [selectedGroupId, updateGroupMeta]);

  const handleCopyInviteCode = useCallback(async (code: string | null | undefined) => {
    if (!code) return;
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("Kopyalama API'si desteklenmiyor.");
      }
      await navigator.clipboard.writeText(code);
      setInviteLinkError(null);
      setInviteCodeCopied(true);
      window.setTimeout(() => setInviteCodeCopied(false), 2000);
    } catch (err: any) {
      console.error(err);
      setInviteLinkError(err.message ?? "Davet kodu kopyalanamadı.");
    }
  }, []);

  const updateCreateGroupForm = useCallback((updates: Partial<CreateGroupFormValues>) => {
    setCreateGroupForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetCreateGroupForm = useCallback(() => {
    setCreateGroupForm({ ...CREATE_GROUP_DEFAULTS });
  }, []);

  const fetchFriends = useCallback(async () => {
    try {
      setLoadingFriends(true);
      setFriendError(null);
      const response = await fetch("/api/friends", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? "Arkadaş listesi alınamadı");
      }
      const friendships: FriendshipResponse[] = Array.isArray(data.friendships) ? data.friendships : [];
      const acceptedFriends: FriendOption[] = friendships
        .filter((friendship) => friendship.status === "accepted" && friendship.counterpart)
        .map((friendship) => ({
          id: friendship.counterpart.id,
          name: friendship.counterpart.name,
          profileImage: friendship.counterpart.profileImage ?? null,
        }));
      setFriends(acceptedFriends);
    } catch (err: any) {
      console.error("Failed to load friends", err);
      setFriendError(err.message ?? "Arkadaş listesi alınamadı");
    } finally {
      setLoadingFriends(false);
    }
  }, []);

  const openCreateGroupDialog = useCallback(() => {
    setCreateGroupError(null);
    setCreateGroupDialogOpen(true);
  }, []);

  const closeCreateGroupDialog = useCallback(() => {
    setCreateGroupDialogOpen(false);
    setCreateGroupError(null);
    resetCreateGroupForm();
  }, [resetCreateGroupForm]);

  const handleCreateGroupSubmit = useCallback(async () => {
    if (!canCreateGroup || creatingGroup) return;

    const name = createGroupForm.name.trim();
    const description = createGroupForm.description.trim();
    const expertise = createGroupForm.expertise.trim();
    const visibility = createGroupForm.visibility;
    const allowLinkJoin = visibility === "private" ? createGroupForm.allowLinkJoin : false;

    const friendIds = new Set(friends.map((friend) => friend.id));
    const memberIds = Array.from(
      new Set(createGroupForm.memberIds.filter((candidate) => friendIds.has(candidate)))
    );

    if (name.length < 3) {
      setCreateGroupError("Grup adı en az 3 karakter olmalıdır.");
      return;
    }

    if (description.length > 240) {
      setCreateGroupError("Açıklama 240 karakteri aşamaz.");
      return;
    }

    if (expertise.length > 40) {
      setCreateGroupError("Uzmanlık etiketi 40 karakteri aşamaz.");
      return;
    }

    try {
      setCreatingGroup(true);
      setCreateGroupError(null);

      const payloadBody: Record<string, unknown> = {
        name,
        visibility,
      };

      if (description.length) {
        payloadBody.description = description;
      }

      if (expertise.length) {
        payloadBody.expertise = expertise;
      }

      if (visibility === "private") {
        payloadBody.allowLinkJoin = allowLinkJoin;
      }

      if (memberIds.length > 0) {
        payloadBody.memberIds = memberIds;
      }

      const response = await fetch("/api/chat/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadBody),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Grup oluşturulamadı");
      }

      const payload = await response.json();
      const createdGroupId: string | null = payload.group?.id ?? null;

      if (createdGroupId) {
        setSelectedGroupId(createdGroupId);
        await fetchGroups({ selectGroupId: createdGroupId });
      } else {
        await fetchGroups();
      }

      setCreateGroupError(null);
      setCreateGroupDialogOpen(false);
      resetCreateGroupForm();
    } catch (err: any) {
      console.error(err);
      setCreateGroupError(err.message ?? "Grup oluşturulurken bir hata oluştu.");
    } finally {
      setCreatingGroup(false);
    }
  }, [canCreateGroup, createGroupForm, creatingGroup, fetchGroups, friends, resetCreateGroupForm]);

  const startDirectMessage = useCallback(
    async (targetUserId: string) => {
      if (!targetUserId || targetUserId === currentUserId) return;
      try {
        setStartingDirectMessageUserId(targetUserId);
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
        setShowMemberPanel(false);
        router.push(`/chat/direct?thread=${data.thread.id}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Direkt mesaj açılırken hata oluştu");
      } finally {
        setStartingDirectMessageUserId(null);
      }
    },
    [currentUserId, router]
  );

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
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  useEffect(() => {
    if (!canCreateGroup) return;
    if (friends.length > 0 || loadingFriends) return;
    fetchFriends();
  }, [canCreateGroup, fetchFriends, friends.length, loadingFriends]);

  useEffect(() => {
    if (!canCreateGroup) return;
    if (!createGroupDialogOpen && !addMembersDialogOpen) return;
    if (friends.length === 0 && !loadingFriends) {
      fetchFriends();
    }
  }, [
    addMembersDialogOpen,
    canCreateGroup,
    createGroupDialogOpen,
    fetchFriends,
    friends.length,
    loadingFriends,
  ]);

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
      if (!selectedGroupId || sendingMessage) return;

      const trimmed = messageInput.trim();
      const hasText = trimmed.length > 0;
      const hasAttachments = attachments.length > 0;

      if (!hasText && !hasAttachments) {
        return;
      }

      // Attachment'ları ve input'u sakla (hata durumunda geri yüklemek için)
      const tempAttachments = [...attachments];
      const tempMessageInput = trimmed;

      try {
        setSendingMessage(true);
        
        // Önce attachment'ları yükle (varsa)
        const uploadedAttachments = await uploadAttachments();

        const response = await fetch(`/api/chat/groups/${selectedGroupId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: hasText ? trimmed : undefined,
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
          groupId: selectedGroupId,
          sender: data.sender,
          readByUserIds: [currentUserId ?? ""].filter(Boolean),
        };

        // Mesajı ekle
        upsertMessage(payload, { scroll: true });
        
        // Input ve attachment'ları temizle
        setMessageInput("");
        setAttachments([]);
        
        // Textarea yüksekliğini sıfırla
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const textarea = messageInputRef.current;
            if (textarea) textarea.style.height = "auto";
          });
        });
        
        updateGroupMeta(selectedGroupId, (current) => ({
          ...current,
          lastMessage: payload,
          unreadCount: 0,
        }));

        // Attachment preview'ları temizle
        tempAttachments.forEach((item) => {
          if (item.preview) {
            URL.revokeObjectURL(item.preview);
          }
        });

        await markMessagesAsRead(selectedGroupId, [payload.id]);

        // Check if strike was completed after community message
        // Only check for community groups (not user groups)
        if (category === "community") {
          const selectedGroup = groups.find((g) => g.id === selectedGroupId);
          const COMMUNITY_SLUGS = [
            "dotnet-core-community",
            "java-community",
            "mssql-community",
            "react-community",
            "angular-community",
            "nodejs-community",
            "ai-community",
            "flutter-community",
            "ethical-hacking-community",
            "nextjs-community",
            "docker-kubernetes-community",
            "owasp-community",
          ];
          if (selectedGroup && COMMUNITY_SLUGS.includes(selectedGroup.slug)) {
            checkStrikeCompletion();
          }
        }
      } catch (err: any) {
        console.error(err);
        // Hata olursa input ve attachment'ları geri yükle
        setMessageInput(tempMessageInput);
        setAttachments(tempAttachments);
        setError(err.message ?? "Mesaj gönderilirken hata oluştu");
      } finally {
        setSendingMessage(false);
      }
    },
    [
      attachments,
      category,
      checkStrikeCompletion,
      currentUserId,
      groups,
      markMessagesAsRead,
      messageInput,
      selectedGroupId,
      sendingMessage,
      updateGroupMeta,
      uploadAttachments,
      upsertMessage,
      session?.user,
      scrollToBottom,
    ]
  );

  const loadOlderMessages = useCallback(async () => {
    if (!selectedGroupId || !messagesNextCursor || messagesLoadingMore) return;
    await fetchMessages(selectedGroupId, { cursor: messagesNextCursor, prepend: true });
  }, [fetchMessages, messagesLoadingMore, messagesNextCursor, selectedGroupId]);

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
    fetchGroups();
  }, [fetchGroups]);

  // Mobilde sidebar'ı otomatik aç
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setShowSidebar(true);
      }
    }
  }, []);

  useEffect(() => {
    adjustMessageInputHeight();
  }, [adjustMessageInputHeight, messageInput]);

  useEffect(() => {
    setShowMemberPanel(false);
  }, [selectedGroupId]);

  useEffect(() => {
    if (!canCreateGroup && createGroupDialogOpen) {
      setCreateGroupDialogOpen(false);
      setCreateGroupError(null);
      resetCreateGroupForm();
    }
  }, [canCreateGroup, createGroupDialogOpen, resetCreateGroupForm]);

  useEffect(() => {
    presenceStateRef.current = {};
    setPresenceState({});
  }, [selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId) return;
    const interval = setInterval(() => {
      const revalidated = revalidatePresenceState(presenceStateRef.current);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId) return;
    if (!isJoinedToSelectedGroup) {
      setMessages([]);
      setGroupMembers((prev) => ({ ...prev, [selectedGroupId]: [] }));
      return;
    }
    fetchMessages(selectedGroupId);
    fetchMembers(selectedGroupId);
  }, [fetchMembers, fetchMessages, isJoinedToSelectedGroup, selectedGroupId]);

  // İlk yüklemede ve group değiştiğinde scroll-to-bottom için
  useEffect(() => {
    // Group değiştiğinde veya ilk yüklemede scroll yap
    const groupChanged = prevGroupIdForScrollRef.current !== selectedGroupId;
    if (!messagesLoading && messages.length > 0 && selectedGroupId && isJoinedToSelectedGroup && groupChanged) {
      // DOM'un hazır olmasını bekle
      const timeoutId = setTimeout(() => {
        scrollToBottom(false);
      }, 200);
      prevGroupIdForScrollRef.current = selectedGroupId;
      return () => clearTimeout(timeoutId);
    } else if (selectedGroupId !== prevGroupIdForScrollRef.current) {
      prevGroupIdForScrollRef.current = selectedGroupId;
    }
  }, [messagesLoading, messages.length, selectedGroupId, isJoinedToSelectedGroup, scrollToBottom]);

  // SignalR hook for realtime chat
  useSignalRChat({
    groupId: isJoinedToSelectedGroup ? selectedGroupId : null,
    enabled: isJoinedToSelectedGroup && !!selectedGroupId,
    onMessage: async (payload) => {
      console.log("[GroupChat] Received message via SignalR:", payload);
      const incoming = {
        ...payload.message,
        sender: payload.sender,
        readByUserIds: payload.message.readByUserIds ?? [],
      };

      if (incoming.groupId === selectedGroupId) {
        // Tüm mesajlar için duplicate kontrolü - eğer mesaj zaten varsa tekrar ekleme
        // Bu, API response'dan sonra SignalR'ın aynı mesajı tekrar eklemesini önler
        const messageAlreadyExists = messagesRef.current.some((msg) => msg.id === incoming.id);
        
        if (messageAlreadyExists) {
          // Mesaj zaten mevcut, SignalR'dan gelen duplicate'i atla
          console.log("[GroupChat] Skipping duplicate message from SignalR:", incoming.id);
        } else {
          // Mesajı ekle ve scroll yap
          upsertMessage(incoming, { scroll: true });

          if (incoming.userId !== currentUserId) {
            await markMessagesAsRead(selectedGroupId, [incoming.id]);
          }

          // Mesaj geldiğinde presence güncelle
          if (postPresenceRef.current) {
            postPresenceRef.current("online");
          }
        }
      }

      updateGroupMeta(incoming.groupId, (current) => ({
        ...current,
        lastMessage: incoming,
        unreadCount:
          incoming.groupId === selectedGroupId
            ? 0
            : current.unreadCount + (incoming.userId === currentUserId ? 0 : 1),
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
  });


  useEffect(() => {
    if (!selectedGroupId || !currentUserId) return;
    const targetGroup = groups.find((group) => group.id === selectedGroupId);
    if (!targetGroup?.membership) return;
    let active = true;

    const updateLocalPresence = (status: "online" | "offline") => {
      const timestamp = new Date().toISOString();
      const merged = mergePresenceState(presenceStateRef.current, [
        { userId: currentUserId, status, lastSeenAt: timestamp },
      ]);
      const revalidated = revalidatePresenceState(merged);
      presenceStateRef.current = revalidated;
      setPresenceState({ ...revalidated });
    };

    const postPresence = async (status: "online" | "offline", { useBeacon = false } = {}, retryCount: number = 0) => {
      if (!active) return;
      updateLocalPresence(status);

      const MAX_RETRIES = 2;
      const payload = JSON.stringify({ status });
      
      if (useBeacon && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([payload], { type: "application/json" });
        const sent = navigator.sendBeacon(`/api/chat/groups/${selectedGroupId}/presence`, blob);
        if (!sent && retryCount < MAX_RETRIES) {
          // If sendBeacon failed, retry with fetch
          return postPresence(status, { useBeacon: false }, retryCount + 1);
        }
        return;
      }

      try {
        const response = await fetch(`/api/chat/groups/${selectedGroupId}/presence`, {
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
          console.warn(`[GroupChatView] Presence update returned ${response.status}, will retry on next activity`);
        }
      } catch (err) {
        // Only retry on network errors
        if (retryCount < MAX_RETRIES && err instanceof TypeError && err.message.includes("fetch")) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return postPresence(status, { useBeacon }, retryCount + 1);
        }
        console.error("[GroupChatView] Presence update failed", err);
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
            console.warn("[GroupChatView] Presence update failed, will retry on next activity:", error);
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
  }, [currentUserId, groups, selectedGroupId]);

  // Presence state'i düzenli olarak revalidate et (her 30 saniyede bir - timeNow ile senkronize)
  useEffect(() => {
    if (!selectedGroupId) return;
    
    const revalidationInterval = setInterval(() => {
      const currentTime = Date.now();
      const revalidated = revalidatePresenceState(presenceStateRef.current, currentTime);
      if (hasPresenceStateChanged(presenceStateRef.current, revalidated)) {
        presenceStateRef.current = revalidated;
        setPresenceState({ ...revalidated });
      }
    }, 30_000); // 30 saniye - timeNow interval'i ile senkronize

    return () => {
      clearInterval(revalidationInterval);
    };
  }, [selectedGroupId]);

  // UI'ı dinamik olarak güncellemek için zaman state'i (her 30 saniyede bir)
  const [timeNow, setTimeNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 30_000); // Her 30 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-message-id");
            if (!messageId || !selectedGroupId) return;

            const target = messages.find((message) => message.id === messageId);
            if (!target) return;

            const alreadyRead = (target.readByUserIds ?? []).includes(currentUserId ?? "");
            if (!alreadyRead && target.userId !== currentUserId) {
              markMessagesAsRead(selectedGroupId, [target.id]);
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
  }, [currentUserId, markMessagesAsRead, messages, selectedGroupId]);

  const activeMembers = useMemo(() => {
    if (!selectedGroupId) return [] as GroupMember[];
    const members = groupMembers[selectedGroupId] ?? [];
    return members.map<GroupMember>((member) => ({
      ...member,
      presence: (() => {
        const entry = presenceState[member.user.id];
        const lastSeenAt = entry?.lastSeenAt ?? member.lastSeenAt;
        return {
          status: derivePresenceStatus(lastSeenAt, timeNow),
          lastSeenAt,
        };
      })(),
    }));
  }, [groupMembers, presenceState, selectedGroupId, timeNow]);

  const onlineCount = useMemo(() => {
    return Object.values(presenceState).reduce(
      (count, entry) => count + (derivePresenceStatus(entry.lastSeenAt ?? null, timeNow) === "online" ? 1 : 0),
      0
    );
  }, [presenceState, timeNow]);

  const sidebarItems = useMemo(() => {
    return sortedGroups.map((group) => {
      const initials = group.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const lastMessagePreview =
        group.lastMessage?.content ??
        (group.lastMessage?.attachments?.length ? `${group.lastMessage.attachments.length} adet ek` : "Yeni mesaj yazın");

      return {
        id: group.id,
        title: group.name,
        subtitle: group.expertise ? `#${group.expertise}` : undefined,
        preview: lastMessagePreview,
        meta: group.lastMessage?.createdAt ? formatRelativeDate(group.lastMessage.createdAt, timeNow) : undefined,
        unreadCount: group.unreadCount,
        initials,
        presenceIndicator: "none" as const,
      };
    });
  }, [sortedGroups, timeNow]);

  const conversationHeader = selectedGroup ? (
    <header
      className={cn(
        "pl-14 md:pl-6 pr-6 py-4 border-b border-gray-200/70 dark:border-gray-800/60 flex flex-col gap-4",
        isJoinedToSelectedGroup ? "cursor-pointer" : "cursor-default"
      )}
      onClick={(e) => {
        // Arama input'una tıklama header'ın onClick'ini tetiklemesin
        if ((e.target as HTMLElement).closest('.search-container')) {
          return;
        }
        if (isJoinedToSelectedGroup) {
          setShowMemberPanel(true);
        }
      }}
    >
      {/* Search Bar - Mobil uyumlu */}
      {isJoinedToSelectedGroup && (
        <div className="search-container w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Mesajlarda ara..."
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/60 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSearch();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {isSearching && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Aranıyor...</span>
            </div>
          )}
          {searchError && (
            <div className="mt-2 text-xs text-red-500 dark:text-red-400">{searchError}</div>
          )}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {searchResults.length} sonuç bulundu
            </div>
          )}
          {showSearchResults && searchResults.length === 0 && !isSearching && searchQuery.trim() && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Sonuç bulunamadı
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
            {selectedGroup.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-gray-100 truncate">{selectedGroup.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {selectedGroup.description ?? "Bu grup için açıklama yakında."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
              selectedGroup.visibility === "private"
                ? "bg-rose-100/60 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                : "bg-emerald-100/60 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
            )}
          >
            {selectedGroup.visibility === "private" ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
            <span>{selectedGroup.visibility === "private" ? "Özel Grup" : "Public Grup"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/60 dark:bg-blue-900/30 px-3 py-1 text-blue-700 dark:text-blue-200">
            <Users className="h-4 w-4" />
            <span>
              {onlineCount} çevrimiçi
              {typeof selectedGroup.memberCount === "number" ? ` / ${selectedGroup.memberCount} üye` : ""}
            </span>
          </div>
          {selectedGroup.visibility === "private" && selectedGroup.allowLinkJoin ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/60 dark:bg-indigo-900/30 px-3 py-1 text-indigo-700 dark:text-indigo-200">
              <Link2 className="h-4 w-4" />
              <span>Davet linki aktif</span>
            </div>
          ) : null}
          {selectedGroup.expertise ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/60 dark:bg-purple-900/30 px-3 py-1 text-purple-700 dark:text-purple-200">
              <Dot className="h-4 w-4" />
              <span>#{selectedGroup.expertise}</span>
            </div>
          ) : null}
          {isJoinedToSelectedGroup ? (
            <span className="text-xs text-gray-400 dark:text-gray-500">Üyelere tıklayarak detaylara bakabilirsiniz.</span>
          ) : null}
        </div>
      </div>
      </div>
      <div className="flex flex-col items-end gap-3 min-w-0">
        {canManageSelectedGroup ? (
          <div className="flex flex-col items-end gap-2 min-w-0">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={openAddMembersDialog}
                disabled={!availableFriendsForSelectedGroup.length}
              >
                <UserPlus className="h-4 w-4" />
                Üye Ekle
              </Button>
              {selectedGroup.visibility === "private" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleToggleInviteLink(!selectedGroup.allowLinkJoin)}
                  disabled={updatingInviteLink}
                >
                  {selectedGroup.allowLinkJoin ? <Lock className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  {selectedGroup.allowLinkJoin ? "Linki Kapat" : "Linki Aç"}
                </Button>
              ) : null}
            </div>
            {selectedGroup.visibility === "private" && selectedGroup.allowLinkJoin ? (
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400">
                <code className="rounded-lg bg-gray-100 dark:bg-gray-900 px-2 py-1 font-mono text-sm text-gray-700 dark:text-gray-200">
                  {selectedGroup.inviteCode ?? "Kod oluşturuluyor..."}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyInviteCode(selectedGroup.inviteCode)}
                  disabled={updatingInviteLink || !selectedGroup.inviteCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRegenerateInviteCode}
                  disabled={updatingInviteLink}
                >
                  <RefreshCw className={cn("h-4 w-4", updatingInviteLink ? "animate-spin" : undefined)} />
                </Button>
                {inviteCodeCopied ? <span className="text-emerald-500 dark:text-emerald-300">Kopyalandı!</span> : null}
              </div>
            ) : null}
            {inviteLinkError ? (
              <span className="text-xs text-red-500 dark:text-red-300 text-right max-w-xs">{inviteLinkError}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  ) : null;

  const messageEmptyState = {
    icon: <FileText className="h-10 w-10 text-blue-500" />,
    title: "Henüz hiç mesaj yok.",
    description: copy.messageEmptyDescription,
  };

  const conversationBody = !selectedGroup ? (
    <div className="flex flex-1 items-center justify-center text-center px-6">
      <div className="space-y-3 max-w-md">
        <Users className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{copy.selectPromptTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{copy.selectPromptDescription}</p>
      </div>
    </div>
  ) : !isJoinedToSelectedGroup ? (
    <div className="flex flex-1 items-center justify-center text-center px-6">
      <div className="space-y-4 max-w-md">
        <Users className="mx-auto h-12 w-12 text-blue-500" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {selectedGroup.name} grubuna katılarak sohbete başlayın
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedGroup.visibility === "private" && !selectedGroup.allowLinkJoin
              ? "Bu özel gruba yalnızca yönetici tarafından davet edilen üyeler katılabilir."
              : selectedGroup.visibility === "private" && selectedGroup.allowLinkJoin
              ? "Katılım için grup yöneticinizden aldığınız davet kodunu kullanın."
              : "Mesajları görebilmek ve toplulukla iletişim kurabilmek için önce gruba katılmanız gerekir."}
          </p>
        </div>
        <div className="flex justify-center">
          {selectedGroup.visibility === "private" && !selectedGroup.allowLinkJoin ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Yönetici sizi eklediğinde gruba erişebilirsiniz.
            </span>
          ) : (
            <Button
              variant="gradient"
              size="md"
              onClick={() => {
                setJoinPromptGroupId(selectedGroup.id);
                setJoinInviteCode("");
                setJoinInviteError(null);
              }}
              disabled={joiningGroup}
              isLoading={joiningGroup && joinPromptGroupId === selectedGroup.id}
            >
              Gruba Katıl
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : showSearchResults ? (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 md:px-6 py-3 border-b border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              &quot;{searchQuery}&quot; için {searchResults.length} sonuç
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="text-xs"
          >
            Aramayı Kapat
          </Button>
        </div>
      </div>
      <MessageViewport
        ref={messagesContainerRef}
        messages={searchResults}
        currentUserId={currentUserId}
        hasMore={Boolean(searchNextCursor)}
        loading={isSearching}
        loadingMore={false}
        onLoadMore={() => {
          if (searchNextCursor && selectedGroupId) {
            searchMessages(selectedGroupId, searchQuery, searchNextCursor);
          }
        }}
        emptyState={{
          icon: <Search className="h-10 w-10 text-blue-500" />,
          title: "Sonuç bulunamadı",
          description: `"${searchQuery}" için mesaj bulunamadı.`,
        }}
        endRef={messagesEndRef}
      />
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

  const composerNode =
    selectedGroup && isJoinedToSelectedGroup ? (
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

  const overlayNode = (
    <>
      {error ? (
        <div className="fixed top-6 right-6 z-40 bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/40 px-4 py-2 rounded-xl backdrop-blur">
          {error}
        </div>
      ) : null}
      {selectedGroup && isJoinedToSelectedGroup ? (
        <MemberPanel
          isOpen={showMemberPanel}
          onClose={() => setShowMemberPanel(false)}
          members={activeMembers}
          title="Üyeler"
          badge={
            <span>
              {onlineCount} çevrimiçi{typeof selectedGroup.memberCount === "number" ? ` / ${selectedGroup.memberCount} üye` : ""}
            </span>
          }
          onStartDirectMessage={startDirectMessage}
          busyUserId={startingDirectMessageUserId}
          currentUserId={currentUserId}
        />
      ) : null}
      <JoinDialog
        open={Boolean(joinPromptGroupId)}
        title={
          promptGroup ? `${promptGroup.name} grubuna katıl` : "Gruba katılmak istiyor musunuz?"
        }
        description={
          promptGroup
            ? promptRequiresInviteCode
              ? "Davet kodunu girerek bu özel gruba katılabilirsiniz."
              : "Bu gruptaki mesajları görebilmek ve katkı sunabilmek için katılım onayınızı almamız gerekiyor."
            : "Bu gruptaki mesajları görebilmek ve katkı sunabilmek için katılım onayınızı almamız gerekiyor. Katıldıktan sonra istediğiniz zaman ayrılabilirsiniz."
        }
        icon={<Users className="h-8 w-8 text-blue-500" />}
        confirmLabel="Gruba Katıl"
        cancelLabel="Vazgeç"
        loading={joiningGroup}
        requiresInviteCode={promptRequiresInviteCode}
        inviteCodeValue={joinInviteCode}
        inviteCodeError={joinInviteError}
        onInviteCodeChange={setJoinInviteCode}
        onConfirm={() =>
          joinPromptGroupId &&
          handleJoinGroup(joinPromptGroupId, {
            inviteCode: promptRequiresInviteCode ? joinInviteCode : undefined,
          })
        }
        onCancel={() => {
          setJoinPromptGroupId(null);
          setJoinInviteCode("");
          setJoinInviteError(null);
        }}
      />
      <CreateGroupDialog
        open={createGroupDialogOpen}
        values={createGroupForm}
        friends={friends}
        loading={creatingGroup}
        loadingFriends={loadingFriends}
        friendsError={friendError}
        error={createGroupError}
        onChange={updateCreateGroupForm}
        onSubmit={handleCreateGroupSubmit}
        onClose={closeCreateGroupDialog}
      />
      <AddMembersDialog
        open={addMembersDialogOpen}
        friends={availableFriendsForSelectedGroup}
        selectedIds={addMembersSelection}
        loading={addingMembers}
        error={addMembersError}
        onToggle={toggleAddMemberSelection}
        onSubmit={handleAddMembersSubmit}
        onClose={closeAddMembersDialog}
      />
    </>
  );

  return (
    <ChatShell
      sidebar={
        <ConversationSidebar
          title={copy.sidebarTitle}
          subtitle={copy.sidebarSubtitle(groups.length)}
          action={
            canCreateGroup
              ? (
                  <Button
                    variant="gradient"
                    size="sm"
                    className="gap-2"
                    onClick={openCreateGroupDialog}
                    disabled={creatingGroup}
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Grup
                  </Button>
                )
              : undefined
          }
          loading={loadingGroups}
          items={sidebarItems}
          activeId={selectedGroupId}
          onSelect={handleSelectGroup}
          emptyState={{
            icon: <Users className="h-10 w-10 text-blue-500" />,
            title: copy.sidebarEmptyTitle,
            description: copy.sidebarEmptyDescription,
          }}
          onCloseMobile={() => setShowSidebar(false)}
        />
      }
      conversationHeader={conversationHeader}
      composer={composerNode}
      overlay={overlayNode}
      mobileSidebarOpen={showSidebar}
      onToggleMobileSidebar={setShowSidebar}
    >
      {conversationBody}
    </ChatShell>
  );
}


