"use client";

import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

import type { FriendOption } from "./types";

type AddMembersDialogProps = {
  open: boolean;
  friends: FriendOption[];
  selectedIds: string[];
  loading?: boolean;
  error?: string | null;
  onToggle: (userId: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function AddMembersDialog({
  open,
  friends,
  selectedIds,
  loading,
  error,
  onToggle,
  onSubmit,
  onClose,
}: AddMembersDialogProps) {
  const hasSelection = selectedIds.length > 0;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/60 shadow-2xl p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Üye Davet Et</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Arkadaş listenizden yeni üyeler ekleyin. Seçtikleriniz anında gruba dahil olur.
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/40">
          {friends.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              Ekleyebileceğiniz uygun bir arkadaş bulunamadı.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
              {friends.map((friend) => {
                const isSelected = selectedIds.includes(friend.id);
                const initials =
                  friend.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "?";

                return (
                  <li key={friend.id}>
                    <label className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/60">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={isSelected}
                          onChange={() => onToggle(friend.id)}
                          disabled={loading}
                        />
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold flex items-center justify-center">
                          {initials}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          {friend.name ?? "İsimsiz Kullanıcı"}
                        </span>
                      </div>
                    </label>
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
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedIds.length} kişi seçildi
          </span>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Vazgeç
            </Button>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              onClick={onSubmit}
              isLoading={loading}
              disabled={loading || !hasSelection}
            >
              Davet Gönder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


