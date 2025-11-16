"use client";

import { useState, useMemo } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { cn } from "@/lib/utils";
import { Loader2, MessageSquare, Search, X } from "lucide-react";

import type { FriendOption } from "./types";

type StartDirectMessageDialogProps = {
  open: boolean;
  friends: FriendOption[];
  loading?: boolean;
  loadingFriends?: boolean;
  error?: string | null;
  onSelectFriend: (userId: string) => void;
  onClose: () => void;
};

export function StartDirectMessageDialog({
  open,
  friends,
  loading,
  loadingFriends,
  error,
  onSelectFriend,
  onClose,
}: StartDirectMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrelenmiş arkadaş listesi
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) {
      return friends;
    }

    const query = searchQuery.toLowerCase().trim();
    return friends.filter((friend) => {
      const name = friend.name?.toLowerCase() ?? "";
      const email = friend.email?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query);
    });
  }, [friends, searchQuery]);

  const handleFriendClick = (userId: string) => {
    if (!loading) {
      onSelectFriend(userId);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/60 shadow-2xl p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Yeni Mesaj</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Arkadaşlarınızdan birini seçerek yeni bir sohbet başlatın.
          </p>
        </div>

        {/* Arama Çubuğu */}
        {!loadingFriends && friends.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
            <Input
              type="text"
              placeholder="Arkadaş ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="max-h-96 overflow-y-auto rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/40">
          {loadingFriends ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : friends.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              Henüz arkadaşınız yok. Arkadaş ekleyerek sohbet başlatabilirsiniz.
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              &quot;{searchQuery}&quot; için sonuç bulunamadı.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
              {filteredFriends.map((friend) => {
                const initials =
                  friend.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "?";

                return (
                  <li key={friend.id}>
                    <button
                      type="button"
                      onClick={() => handleFriendClick(friend.id)}
                      disabled={loading}
                      className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {friend.profileImage ? (
                        <img
                          src={friend.profileImage}
                          alt={friend.name ?? "Kullanıcı"}
                          className="h-10 w-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold flex items-center justify-center">
                          {initials}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 text-left">
                        {friend.name ?? "İsimsiz Kullanıcı"}
                      </span>
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        ) : null}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
            İptal
          </Button>
        </div>
      </div>
    </div>
  );
}

