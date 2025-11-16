import type { PresenceEntry } from "@/app/(dashboard)/chat/_components/types";

// Heartbeat 30 saniyede bir gönderiliyor, threshold bunun 4 katı olmalı (120 saniye)
// Böylece 3 heartbeat'in kaçmasına izin verir ve kullanıcı hala online görünür
const PRESENCE_RECENCY_THRESHOLD_MS = 120 * 1000; // 120 saniye

export function derivePresenceStatus(lastSeenAt: string | null | undefined, now?: number): PresenceEntry["status"] {
  if (!lastSeenAt) return "offline";
  const timestamp = new Date(lastSeenAt).getTime();
  if (Number.isNaN(timestamp)) return "offline";
  // Kullanıcının yerel saatini kullan (presence için göreceli zaman önemli, mutlak zaman değil)
  const currentTime = now ?? Date.now();
  return currentTime - timestamp <= PRESENCE_RECENCY_THRESHOLD_MS ? "online" : "offline";
}

export function mergePresenceState(
  current: Record<string, PresenceEntry>,
  updates: Array<{ userId: string; status?: PresenceEntry["status"]; lastSeenAt?: string | null }>
): Record<string, PresenceEntry> {
  const next: Record<string, PresenceEntry> = { ...current };
  updates.forEach((update) => {
    const existing = next[update.userId];
    const lastSeenAt = update.lastSeenAt ?? existing?.lastSeenAt ?? null;
    const status = update.status ?? derivePresenceStatus(lastSeenAt);
    if (!existing || existing.status !== status || existing.lastSeenAt !== lastSeenAt) {
      next[update.userId] = { status, lastSeenAt };
    }
  });
  return next;
}

export function cleanupPresenceState(
  current: Record<string, PresenceEntry>,
  validUserIds: string[]
): Record<string, PresenceEntry> {
  const set = new Set(validUserIds);
  const next: Record<string, PresenceEntry> = {};
  Object.entries(current).forEach(([userId, entry]) => {
    if (set.has(userId)) {
      next[userId] = entry;
    }
  });
  return next;
}

export function revalidatePresenceState(
  current: Record<string, PresenceEntry>,
  now?: number
): Record<string, PresenceEntry> {
  // Kullanıcının yerel saatini kullan
  const currentTime = now ?? Date.now();
  const next: Record<string, PresenceEntry> = {};
  Object.entries(current).forEach(([userId, entry]) => {
    const status = derivePresenceStatus(entry.lastSeenAt ?? null, currentTime);
    if (entry.status !== status) {
      next[userId] = { ...entry, status };
    } else {
      next[userId] = entry;
    }
  });
  return next;
}

export function hasPresenceStateChanged(
  previous: Record<string, PresenceEntry>,
  next: Record<string, PresenceEntry>
): boolean {
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);
  if (previousKeys.length !== nextKeys.length) return true;
  for (const key of nextKeys) {
    const prevEntry = previous[key];
    const nextEntry = next[key];
    if (!prevEntry) return true;
    if (prevEntry.status !== nextEntry.status || prevEntry.lastSeenAt !== nextEntry.lastSeenAt) {
      return true;
    }
  }
  return false;
}

