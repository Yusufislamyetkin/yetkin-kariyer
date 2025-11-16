import { ReactNode, useState, useEffect, useMemo } from "react";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GroupMember } from "./types";
import { derivePresenceStatus } from "@/lib/chat/presence";

type MemberPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  members: GroupMember[];
  title?: string;
  badge?: ReactNode;
  onStartDirectMessage: (userId: string) => void;
  busyUserId?: string | null;
  currentUserId?: string;
};

function formatPresence(status: GroupMember["presence"], fallback: string, timeNow: number) {
  // Revalidate presence status based on current time
  const actualStatus = status.lastSeenAt 
    ? derivePresenceStatus(status.lastSeenAt, timeNow)
    : "offline";
  
  if (actualStatus === "online") {
    return "Şu anda çevrimiçi";
  }

  if (!status.lastSeenAt) {
    return fallback;
  }

  try {
    // ISO string'i parse et - Date otomatik olarak UTC'ye çevirir
    const date = new Date(status.lastSeenAt);
    
    // Geçersiz tarih kontrolü
    if (isNaN(date.getTime())) {
      return fallback;
    }
    
    // Use timeNow instead of new Date() for dynamic updates
    const now = new Date(timeNow);
    
    // Gelecek zaman kontrolü: eğer tarih gelecekteyse, "şimdi" göster
    if (date.getTime() > now.getTime()) {
      return "şimdi çevrimiçi oldu";
    }
    
    // formatDistance otomatik olarak zaman farkını hesaplar
    // Timezone dönüşümüne gerek yok, çünkü sadece zaman farkını gösteriyoruz
    return `${formatDistance(date, now, { 
      addSuffix: true, 
      locale: tr
    })} çevrimiçi oldu`;
  } catch {
    return fallback;
  }
}

export function MemberPanel({
  isOpen,
  onClose,
  members,
  title = "Üyeler",
  badge,
  onStartDirectMessage,
  busyUserId,
  currentUserId,
}: MemberPanelProps) {
  // UI'ı dinamik olarak güncellemek için zaman state'i (her 30 saniyede bir)
  const [timeNow, setTimeNow] = useState(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 30_000); // Her 30 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  // Revalidate presence status for all members
  const membersWithValidatedPresence = useMemo(() => {
    return members.map((member) => {
      const actualStatus = member.presence.lastSeenAt 
        ? derivePresenceStatus(member.presence.lastSeenAt, timeNow)
        : "offline";
      
      return {
        ...member,
        presence: {
          ...member.presence,
          status: actualStatus,
        },
      };
    });
  }, [members, timeNow]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-opacity duration-300",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-200/70 dark:border-gray-800/60 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-200/70 dark:border-gray-800/60">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {badge ? <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{badge}</div> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-6 py-4 space-y-4">
          {members.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Bu grupta henüz hiç üye yok.</p>
          ) : (
            membersWithValidatedPresence.map((member) => {
              const name = member.user.name ?? member.user.email;
              const initials = name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 border border-gray-200/70 dark:border-gray-800/60 rounded-2xl px-4 py-3 bg-white/70 dark:bg-gray-900/70 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/profile/${member.user.id}`}
                      className="relative transition-transform hover:scale-105"
                    >
                      {member.user.profileImage ? (
                        <img
                          src={member.user.profileImage}
                          alt={name}
                          className="h-11 w-11 rounded-full object-cover border border-white/70 dark:border-gray-900/70 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {initials}
                        </div>
                      )}
                      <span
                        className={cn(
                          "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-950",
                          member.presence.status === "online" ? "bg-emerald-400" : "bg-gray-500"
                        )}
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {formatPresence(member.presence, "Çevrimdışı", timeNow)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 dark:text-blue-300 border-blue-200/70 dark:border-blue-900/40"
                    disabled={member.user.id === currentUserId || busyUserId === member.user.id}
                    isLoading={busyUserId === member.user.id}
                    onClick={() => onStartDirectMessage(member.user.id)}
                  >
                    Mesaj
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}

