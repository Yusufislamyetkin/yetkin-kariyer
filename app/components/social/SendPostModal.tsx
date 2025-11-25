"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { X, Search, Loader2, User, Users, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { useNotification } from "@/app/contexts/NotificationContext";

interface SendPostModalProps {
  postId: string;
  postContent: string | null;
  postImageUrl: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Friend {
  id: string;
  name: string | null;
  profileImage: string | null;
}

interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  memberships: Array<{ role: string }>;
}

export function SendPostModal({
  postId,
  postContent,
  postImageUrl,
  onClose,
  onSuccess,
}: SendPostModalProps) {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"friends" | "groups" | "communities">("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [communities, setCommunities] = useState<Group[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch friends
      const friendsRes = await fetch("/api/friends");
      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        const friendsList = friendsData.friendships
          ?.filter((f: any) => f.status === "accepted")
          .map((f: any) => f.counterpart) || [];
        setFriends(friendsList);
      }

      // Fetch groups and communities
      const [groupsRes, communitiesRes] = await Promise.all([
        fetch("/api/chat/groups?category=user"),
        fetch("/api/chat/groups?category=community"),
      ]);

      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData.groups || []);
      }

      if (communitiesRes.ok) {
        const communitiesData = await communitiesRes.json();
        setCommunities(communitiesData.groups || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Veriler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSend = async () => {
    if (selectedRecipients.size === 0 || !session?.user?.id) return;

    setIsSending(true);
    setError(null);

    try {
      const recipients = Array.from(selectedRecipients);
      // Send post link instead of post content
      const postLink = typeof window !== 'undefined' 
        ? `${window.location.origin}/social/posts/${postId}`
        : `/social/posts/${postId}`;
      const messageContent = postLink;

      // Send to each recipient
      const sendPromises = recipients.map(async (recipientId) => {
        // Determine if it's a group or a friend
        const allGroups = [...groups, ...communities];
        const isGroup = allGroups.some((g) => g.id === recipientId);
        
        if (isGroup) {
          // Send to group
          const response = await fetch(`/api/chat/groups/${recipientId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: messageContent,
              type: "text",
            }),
          });
          if (!response.ok) throw new Error("Grup mesajı gönderilemedi");
        } else {
          // Send to friend (direct message)
          // First, get or create thread
          const threadRes = await fetch("/api/chat/direct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: recipientId }),
          });
          if (!threadRes.ok) throw new Error("Mesaj thread'i oluşturulamadı");
          const threadData = await threadRes.json();
          const threadId = threadData?.thread?.id ?? threadData?.threadId ?? threadData?.id;
          if (!threadId) {
            throw new Error("Mesaj thread bilgisi alınamadı");
          }

          const response = await fetch(`/api/chat/direct/${threadId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: messageContent,
              type: "text",
            }),
          });
          if (!response.ok) throw new Error("Mesaj gönderilemedi");
        }
      });

      await Promise.all(sendPromises);

      // Send notification to post owner that post was shared
      try {
        await fetch(`/api/posts/${postId}/notify-share`, {
          method: "POST",
        });
      } catch (err) {
        // Silently fail - notification is not critical
        console.error("Failed to send share notification:", err);
      }

      // Show success notification
      const recipientCount = recipients.length;
      showNotification(
        "success",
        "Gönderi başarıyla gönderildi",
        recipientCount === 1 
          ? "Gönderi mesaj olarak gönderildi."
          : `${recipientCount} kişiye gönderi mesaj olarak gönderildi.`,
        { duration: 5000 }
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gönderim sırasında bir hata oluştu");
    } finally {
      setIsSending(false);
    }
  };

  const filteredFriends = friends.filter((f) =>
    (f.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentItems =
    activeTab === "friends"
      ? filteredFriends
      : activeTab === "groups"
      ? filteredGroups
      : filteredCommunities;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#1d1d1d] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Gönder
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "friends"
                ? "text-[#0a66c2] dark:text-[#70b5f9] border-b-2 border-[#0a66c2] dark:border-[#70b5f9]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Arkadaşlar
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "groups"
                ? "text-[#0a66c2] dark:text-[#70b5f9] border-b-2 border-[#0a66c2] dark:border-[#70b5f9]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Gruplar
          </button>
          <button
            onClick={() => setActiveTab("communities")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "communities"
                ? "text-[#0a66c2] dark:text-[#70b5f9] border-b-2 border-[#0a66c2] dark:border-[#70b5f9]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Topluluklar
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#0a66c2] dark:focus:ring-[#70b5f9] focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#0a66c2]" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === "friends"
                  ? "Arkadaş bulunamadı"
                  : activeTab === "groups"
                  ? "Grup bulunamadı"
                  : "Topluluk bulunamadı"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentItems.map((item) => {
                const isSelected = selectedRecipients.has(item.id);
                const displayName =
                  activeTab === "friends"
                    ? (item as Friend).name || "Kullanıcı"
                    : (item as Group).name;
                const displayImage =
                  activeTab === "friends"
                    ? (item as Friend).profileImage
                    : null;

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleRecipient(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-[#0a66c2]/10 dark:bg-[#70b5f9]/10 border-2 border-[#0a66c2] dark:border-[#70b5f9]"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      {displayImage ? (
                        <Image
                          src={displayImage}
                          alt={displayName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a66c2] to-[#0073b1] flex items-center justify-center text-white text-sm font-semibold">
                          {displayName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {displayName}
                      </p>
                      {activeTab !== "friends" && (item as Group).description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {(item as Group).description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#0a66c2] dark:bg-[#70b5f9] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedRecipients.size > 0
              ? `${selectedRecipients.size} seçili`
              : "Alıcı seçin"}
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="outline" disabled={isSending}>
              İptal
            </Button>
            <Button
              onClick={handleSend}
              variant="primary"
              disabled={selectedRecipients.size === 0 || isSending}
              className="bg-[#0a66c2] hover:bg-[#004182] text-white"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Gönder"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

