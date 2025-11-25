import Link from "next/link";
import { ReactNode } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Download, FileText, Loader2, Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/Button";
import type { ChatAttachment, ChatMessage } from "./types";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  endRef: React.RefObject<HTMLDivElement>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  emptyState?: ReactNode;
  topInset?: ReactNode;
}

export function MessageList({
  messages,
  currentUserId,
  containerRef,
  endRef,
  hasMore,
  onLoadMore,
  isLoading,
  isLoadingMore,
  emptyState,
  topInset,
}: MessageListProps) {
  // Filter out temporary ID messages (starting with 'temp-')
  const filteredMessages = messages.filter((message) => !message.id.startsWith('temp-'));

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 dark:bg-gray-925 md:px-8"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {topInset}

        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="border-dashed border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha eski mesajları yükle"}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filteredMessages.length === 0 ? (
          emptyState ?? <EmptyState />
        ) : (
          filteredMessages.map((message) => (
            <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
          ))
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId?: string;
}

function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwn = message.userId === currentUserId;
  const isSystem = message.type === "system";
  const senderName = message.sender.name ?? (isOwn ? "Siz" : "Bilinmeyen");
  const profileHref = `/profile/${message.sender.id}`;
  const senderInitials = (message.sender.name ?? message.sender.id)
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bubbleClassName = cn(
    "w-fit max-w-full rounded-3xl border px-5 py-3 text-sm shadow-sm md:max-w-[70%]",
    isSystem
      ? "mx-auto border-gray-200 bg-white/90 text-gray-500 dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-400"
      : isOwn
      ? "ml-auto border-blue-600 bg-blue-600 text-white"
      : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100",
  );

  const avatar =
    isSystem || !message.sender.id
      ? null
      : (
          <Link
            href={profileHref}
            className={cn(
              "relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold uppercase text-white shadow-sm transition-transform hover:scale-[1.03]",
              isOwn ? "order-2" : "order-1",
            )}
            aria-label={`${senderName} profilini aç`}
          >
            {message.sender.profileImage ? (
              <Image
                src={message.sender.profileImage}
                alt={senderName}
                fill
                sizes="36px"
                className="object-cover"
                priority={false}
              />
            ) : (
              senderInitials || "?"
            )}
          </Link>
        );

  return (
    <div
      className={cn(
        "flex w-full items-end gap-1.5",
        isSystem ? "justify-center" : isOwn ? "justify-end" : "justify-start",
      )}
    >
      {!isSystem && !isOwn ? avatar : null}
      <div data-message-id={message.id} className={bubbleClassName}>
        {!isSystem && (
          <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-wide">
            <Link
              href={profileHref}
              className={cn(
                "truncate font-medium transition-colors",
                isOwn ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
              )}
            >
              {senderName}
            </Link>
            <span className={cn(isOwn ? "text-white/70" : "text-gray-400 dark:text-gray-500")}>
              {format(new Date(message.createdAt), "HH:mm", { locale: tr })}
            </span>
          </div>
        )}

        {message.content && (
          <p className={cn("whitespace-pre-wrap break-words text-sm leading-relaxed", isOwn ? "text-white/90" : "text-gray-800 dark:text-gray-100")}>
            {message.content}
          </p>
        )}

        {message.attachments.length > 0 && (
          <div className="mt-3 space-y-3">
            {message.attachments.map((attachment) => (
              <AttachmentPreview key={attachment.id} attachment={attachment} isOwn={isOwn} />
            ))}
          </div>
        )}

        {!isSystem && message.updatedAt !== message.createdAt && (
          <div className={cn("mt-2 flex items-center gap-2 text-[11px]", isOwn ? "text-white/70" : "text-gray-400 dark:text-gray-500")}>
            <span>Düzenlendi</span>
          </div>
        )}
      </div>
      {!isSystem && isOwn ? avatar : null}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: ChatAttachment;
  isOwn: boolean;
}

function AttachmentPreview({ attachment, isOwn }: AttachmentPreviewProps) {
  if (attachment.type === "image" || attachment.type === "gif") {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
      >
        <Image
          src={attachment.url}
          alt="Mesaj eki"
          width={attachment.width ?? 800}
          height={attachment.height ?? 600}
          className="h-auto max-h-64 w-full object-cover"
        />
      </a>
    );
  }

  if (attachment.type === "video") {
    return (
      <video
        controls
        className="w-full rounded-2xl border border-gray-200 bg-black/80 dark:border-gray-800"
      >
        <source src={attachment.url} />
      </video>
    );
  }

  if (attachment.type === "audio") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border px-4 py-3",
          isOwn
            ? "border-white/30 bg-white/10 text-white"
            : "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100",
        )}
      >
        <Play className="h-5 w-5" />
        <audio controls className="w-full" src={attachment.url}>
          Tarayıcınız ses etiketini desteklemiyor.
        </audio>
      </div>
    );
  }

  const sizeLabel =
    typeof attachment.size === "number" ? `${(attachment.size / (1024 * 1024)).toFixed(2)} MB` : undefined;

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
        isOwn
          ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
          : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-750",
      )}
    >
      <Download className="h-5 w-5" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {(attachment.metadata as { name?: string } | undefined)?.name ?? "Dosya eki"}
        </p>
        {sizeLabel && <p className="text-xs opacity-70">{sizeLabel}</p>}
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white/70 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
      <FileText className="h-10 w-10 text-blue-400" />
      <p className="text-sm font-medium">Henüz mesaj yok</p>
      <p className="text-xs">İlk mesajı göndererek iletişimi başlatın.</p>
    </div>
  );
}

