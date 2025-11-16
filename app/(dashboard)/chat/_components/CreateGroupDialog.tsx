"use client";

import { FormEvent } from "react";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { cn } from "@/lib/utils";

import type { CreateGroupFormValues, FriendOption } from "./types";

type CreateGroupDialogProps = {
  open: boolean;
  values: CreateGroupFormValues;
  friends: FriendOption[];
  loading?: boolean;
  loadingFriends?: boolean;
  friendsError?: string | null;
  error?: string | null;
  onChange: (changes: Partial<CreateGroupFormValues>) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function CreateGroupDialog({
  open,
  values,
  friends,
  loading,
  loadingFriends,
  friendsError,
  error,
  onChange,
  onSubmit,
  onClose,
}: CreateGroupDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/60 shadow-2xl p-6">
        <div className="space-y-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Yeni Grup Oluştur
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ekibinizle iletişim kurmak için yeni bir sohbet grubu başlatın.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Grup Adı"
            placeholder="Örn. Ürün Takımı"
            value={values.name}
            onChange={(event) => onChange({ name: event.target.value })}
            disabled={loading}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Açıklama
              <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">(isteğe bağlı)</span>
            </label>
            <textarea
              className="w-full min-h-[96px] resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:focus:shadow-glow md:focus:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Grubun amacı ve paylaşılacak konular hakkında bilgi verin."
              value={values.description}
              onChange={(event) => onChange({ description: event.target.value })}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Maksimum 240 karakter.
            </p>
          </div>
          <Input
            label="Uzmanlık Etiketi"
            placeholder="Örn. frontend, devops"
            helperText="Etiket ekleyerek grubu daha kolay bulabilirsiniz. (isteğe bağlı)"
            value={values.expertise}
            onChange={(event) => onChange({ expertise: event.target.value })}
            disabled={loading}
          />
          <div className="space-y-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Gizlilik</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Grubunuzun kimler tarafından bulunabileceğini seçin.
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm transition",
                  values.visibility === "public"
                    ? "border-blue-500/60 bg-blue-50 text-blue-700 dark:border-blue-400/50 dark:bg-blue-900/30 dark:text-blue-200"
                    : "border-gray-200/70 text-gray-600 hover:border-blue-200 dark:border-gray-800/60 dark:text-gray-300 dark:hover:border-blue-800/60"
                )}
                onClick={() => onChange({ visibility: "public", allowLinkJoin: false })}
                disabled={loading}
              >
                <div className="font-semibold">Public</div>
                <p className="mt-1 text-xs">
                  Tüm üyeler arama ve listeden grubu bulup katılabilir.
                </p>
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm transition",
                  values.visibility === "private"
                    ? "border-purple-500/60 bg-purple-50 text-purple-700 dark:border-purple-400/50 dark:bg-purple-900/30 dark:text-purple-200"
                    : "border-gray-200/70 text-gray-600 hover:border-purple-200 dark:border-gray-800/60 dark:text-gray-300 dark:hover:border-purple-800/60"
                )}
                onClick={() => onChange({ visibility: "private" })}
                disabled={loading}
              >
                <div className="font-semibold">Private</div>
                <p className="mt-1 text-xs">
                  Sadece ekledikleriniz veya davet linkine sahip olanlar katılabilir.
                </p>
              </button>
            </div>
            {values.visibility === "private" ? (
              <div className="flex items-start gap-3 rounded-xl border border-purple-200/60 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-900/20 px-4 py-3">
                <input
                  id="allow-link-join"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  checked={values.allowLinkJoin}
                  onChange={(event) => onChange({ allowLinkJoin: event.target.checked })}
                  disabled={loading}
                />
                <label htmlFor="allow-link-join" className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-medium">Davet linki ile katılıma izin ver</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Linki paylaşarak arkadaşlarınızın davet kodu ile katılmasını sağlayabilirsiniz.
                  </span>
                </label>
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Arkadaşlarını Ekleyin
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {values.memberIds.length} kişi seçildi
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/40">
              {loadingFriends ? (
                <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Arkadaşlarınız yükleniyor...
                </div>
              ) : friendsError ? (
                <div className="px-4 py-6 text-sm text-red-600 dark:text-red-300 text-center">
                  {friendsError}
                </div>
              ) : friends.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Henüz onaylanmış bir arkadaşınız yok. Katılımcıları daha sonra da ekleyebilirsiniz.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
                  {friends.map((friend) => {
                    const isSelected = values.memberIds.includes(friend.id);
                    const initials =
                      friend.name
                        ?.split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ?? "?";

                    return (
                      <li key={friend.id}>
                        <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/60">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isSelected}
                            onChange={() => {
                              const nextMemberIds = isSelected
                                ? values.memberIds.filter((id) => id !== friend.id)
                                : [...values.memberIds, friend.id];
                              onChange({ memberIds: nextMemberIds });
                            }}
                            disabled={loading}
                          />
                          <div className="flex items-center gap-3">
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kaydettikten sonra da yeni üyeler davet edebilirsiniz.
            </p>
          </div>
          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-300">
              {error}
            </div>
          ) : null}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={loading}
              disabled={loading}
            >
              Grubu Oluştur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


