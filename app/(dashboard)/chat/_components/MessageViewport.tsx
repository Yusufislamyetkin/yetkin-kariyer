/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ForwardedRef, forwardRef, ReactNode, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Download, FileText, Play, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

type MessageViewportProps = {
  messages: ChatMessage[];
  currentUserId?: string;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  emptyState: {
    icon: ReactNode;
    title: string;
    description?: string;
  };
  endRef: ForwardedRef<HTMLDivElement>;
  className?: string;
};

function formatRelative(value: string) {
  try {
    return format(new Date(value), "HH:mm", { locale: tr });
  } catch {
    return value;
  }
}

export const MessageViewport = forwardRef<HTMLDivElement, MessageViewportProps>(function MessageViewportInternal(
  { messages, currentUserId, hasMore, loading, loadingMore, onLoadMore, emptyState, endRef, className },
  ref
) {
  // Önceki mesaj ID'lerini ve sayısını takip et
  const prevMessagesRef = useRef<{ ids: Set<string>; length: number }>({ ids: new Set(), length: 0 });
  const isInitialMount = useRef(true);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const id = message.id ?? "";
      const hasTempPrefix = typeof id === "string" && (id.startsWith("temp-") || id.startsWith("front-"));
      const { tempId } = message as ChatMessage & { tempId?: string | null };
      const hasExplicitTempId = typeof tempId === "string" && tempId.length > 0;
      // Filter out both temp- prefix IDs and explicit tempId
      return !hasTempPrefix && !hasExplicitTempId;
    });
  }, [messages]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      );
    }

    if (filteredMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-3 text-gray-500 dark:text-gray-400">
          <div className="text-blue-500">{emptyState.icon}</div>
          <p className="font-medium">{emptyState.title}</p>
          {emptyState.description ? <p className="text-sm">{emptyState.description}</p> : null}
        </div>
      );
    }

    return (
      <>
        {hasMore ? (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={loadingMore}
              className="border-blue-200/70 dark:border-blue-900/40 text-blue-600 dark:text-blue-300"
            >
              {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha eski mesajları yükle"}
            </Button>
          </div>
        ) : null}

        {filteredMessages.map((message) => {
          const isOwn = message.userId === currentUserId;
          const isSystem = message.type === "system";
          const isAI = message.sender.id === "assistant" || message.sender.name === "AI Asistan";
          const timestamp = formatRelative(message.createdAt);
          const senderName = message.sender.name ?? (isOwn ? "Siz" : "Bilinmeyen");
          const profileHref = `/profile/${message.sender.id}`;
          const senderInitials = (message.sender.name ?? message.sender.id)
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          // AI için özel avatar
          const aiAvatar = isAI ? (
            <div
              className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm transition-transform hover:scale-[1.03] order-1"
              aria-label="AI Asistan"
            >
              <Bot className="h-5 w-5" />
            </div>
          ) : null;

          const avatar =
            isSystem || !message.sender.id
              ? null
              : (
                  <Link
                    href={profileHref}
                    className={cn(
                      "relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold uppercase text-white shadow-sm transition-transform hover:scale-[1.03]",
                      isOwn ? "order-2" : "order-1"
                    )}
                    aria-label={`${senderName} profilini aç`}
                  >
                    {message.sender.profileImage ? (
                      <img src={message.sender.profileImage} alt={senderName} className="h-full w-full object-cover" />
                    ) : (
                      senderInitials || "?"
                    )}
                  </Link>
                );

          return (
            <div
              key={message.id}
              data-message-id={message.id}
              className={cn(
                "flex w-full items-end gap-1.5 relative",
                isSystem && !isAI ? "justify-center" : isOwn ? "justify-end" : "justify-start"
              )}
            >
              {isAI ? (
                <div className="absolute -bottom-0.5 -left-1 z-10">
                  {aiAvatar}
                </div>
              ) : !isSystem && !isOwn ? avatar : null}
              <div
                className={cn(
                  "max-w-full sm:max-w-[70%] md:max-w-[65%] rounded-3xl px-5 py-3 shadow-md backdrop-blur-md border",
                  isSystem && !isAI
                    ? "bg-gray-100/70 dark:bg-gray-800/70 border-gray-200/70 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 text-sm text-center"
                    : isOwn
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500/30"
                    : isAI
                    ? "bg-white/85 dark:bg-gray-900/75 border-gray-200/70 dark:border-gray-700/60 text-gray-900 dark:text-gray-100 ml-10"
                    : "bg-white/85 dark:bg-gray-900/75 border-gray-200/70 dark:border-gray-700/60 text-gray-900 dark:text-gray-100"
                )}
              >
                {!(isSystem && !isAI) ? (
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Link
                      href={profileHref}
                      className={cn(
                        "truncate text-sm font-semibold transition-colors",
                        isOwn
                          ? "text-white/90 hover:text-white"
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-50"
                      )}
                    >
                      {senderName}
                    </Link>
                    <span className="text-xs opacity-80">{timestamp}</span>
                  </div>
                ) : null}

                {message.content ? (
                  <p className={cn("whitespace-pre-wrap break-words leading-relaxed", isOwn ? "text-white/90 text-base" : isAI ? "text-gray-800 dark:text-gray-200 text-[1.05rem]" : "text-gray-800 dark:text-gray-200 text-base")}>
                    {message.content}
                  </p>
                ) : null}

                {message.attachments.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {message.attachments.map((attachment) => {
                      if (attachment.type === "image" || attachment.type === "gif") {
                        return (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block overflow-hidden rounded-2xl border border-white/60 dark:border-gray-800/60"
                          >
                            <img src={attachment.url} alt="Mesaj eki" className="w-full max-h-64 object-cover" />
                          </a>
                        );
                      }

                      if (attachment.type === "video") {
                        return (
                          <video
                            key={attachment.id}
                            controls
                            className="w-full max-h-96 rounded-2xl border border-white/60 dark:border-gray-800/60 object-contain"
                          >
                            <source src={attachment.url} />
                          </video>
                        );
                      }

                      if (attachment.type === "audio") {
                        return (
                          <div
                            key={attachment.id}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl px-4 py-3 border",
                              isOwn
                                ? "border-white/40 bg-white/10"
                                : "border-gray-200/60 dark:border-gray-700/60 bg-gray-100/60 dark:bg-gray-800/60"
                            )}
                          >
                            <Play className="h-5 w-5" />
                            <audio controls src={attachment.url} className="w-full">
                              Tarayıcınız ses etiketini desteklemiyor.
                            </audio>
                          </div>
                        );
                      }

                      return (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors",
                            isOwn
                              ? "border-white/40 bg-white/10 hover:bg-white/20"
                              : "border-gray-200/60 dark:border-gray-700/60 bg-gray-100/60 dark:bg-gray-800/60 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                          )}
                        >
                          <Download className="h-5 w-5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {String(
                                (attachment.metadata as Record<string, unknown>)?.["name"] ?? "Dosya eki"
                              )}
                            </p>
                            {attachment.size ? (
                              <p className="text-xs opacity-70">
                                {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            ) : null}
                          </div>
                          <FileText className="h-4 w-4 opacity-60 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                ) : null}

                {!(isSystem && !isAI) ? (
                  <div className="mt-2 flex items-center justify-end gap-2 text-[11px] opacity-70">
                    {message.updatedAt !== message.createdAt ? <span>Düzenlendi</span> : null}
                  </div>
                ) : null}
              </div>
              {!isSystem && isOwn ? avatar : null}
            </div>
          );
        })}
      </>
    );
  }, [currentUserId, hasMore, loading, loadingMore, filteredMessages, onLoadMore, emptyState]);

  // İlk yüklemede ve yeni mesaj eklendiğinde scroll-to-bottom
  useEffect(() => {
    if (!loading && filteredMessages.length > 0 && endRef && typeof endRef !== "function") {
      const currentIds = new Set(filteredMessages.map((m) => m.id));
      const prevIds = prevMessagesRef.current.ids;
      
      // Yeni mesaj var mı kontrol et (sadece ID'ler değiştiyse değil, yeni ID eklendiyse)
      const hasNewMessage = filteredMessages.length > prevMessagesRef.current.length || 
        (filteredMessages.length > 0 && !prevIds.has(filteredMessages[filteredMessages.length - 1]?.id));
      
      // İlk mount'ta veya yeni mesaj eklendiğinde scroll yap
      const shouldScroll = isInitialMount.current || hasNewMessage;
      
      if (shouldScroll) {
        // DOM'un hazır olmasını bekle
        const timeoutId = setTimeout(() => {
          if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "auto", block: "end" });
          }
        }, 100);
        
        // Ref'leri güncelle
        prevMessagesRef.current = { ids: currentIds, length: filteredMessages.length };
        isInitialMount.current = false;
        
        return () => clearTimeout(timeoutId);
      } else {
        // Sadece ref'leri güncelle, scroll yapma
        prevMessagesRef.current = { ids: currentIds, length: filteredMessages.length };
      }
    } else if (!loading && filteredMessages.length === 0) {
      // Mesajlar temizlendiğinde ref'i sıfırla
      prevMessagesRef.current = { ids: new Set(), length: 0 };
      isInitialMount.current = true;
    }
  }, [loading, filteredMessages, endRef]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden h-full max-h-full min-h-0 px-4 md:px-8 py-6 space-y-5 bg-gradient-to-br from-slate-50 via-white to-purple-50/60 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900",
        className
      )}
    >
      {content}
      <div ref={endRef} />
    </div>
  );
});

