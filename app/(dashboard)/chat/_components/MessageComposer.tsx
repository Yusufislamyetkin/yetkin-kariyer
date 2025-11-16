import { ChangeEvent, FormEvent, RefObject } from "react";
import { Paperclip, Play, Send, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";
import type { LocalAttachment } from "./types";

interface MessageComposerProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  onSendShortcut?: () => void;
  disabled?: boolean;
  isSending?: boolean;
  isUploading?: boolean;
  attachments: LocalAttachment[];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRequestFilePicker: () => void;
  onRemoveAttachment: (id: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  placeholder?: string;
}

export function MessageComposer({
  message,
  onMessageChange,
  onSubmit,
  onSendShortcut,
  disabled,
  isSending,
  isUploading,
  attachments,
  onFileChange,
  onRequestFilePicker,
  onRemoveAttachment,
  textareaRef,
  fileInputRef,
  placeholder = "Mesajınızı yazın…",
}: MessageComposerProps) {
  const isBusy = disabled || isSending || isUploading;
  const canSend = message.trim().length > 0 || attachments.length > 0;

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-gray-200 bg-white/95 px-4 py-4 shadow-[0_-1px_0_rgba(15,23,42,0.04)] dark:border-gray-800 dark:bg-gray-950/95 md:px-6"
    >
      <div className="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
        {attachments.length > 0 && (
          <div className="mb-3 flex gap-3 overflow-x-auto pb-1">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {attachment.type === "image" || attachment.type === "gif" ? (
                  attachment.preview ? (
                    <Image src={attachment.preview} alt="Ek önizleme" fill className="object-cover" />
                  ) : null
                ) : (
                  <div className="flex flex-col items-center gap-2 px-2 text-center">
                    {attachment.type === "audio" ? <Play className="h-5 w-5" /> : <Paperclip className="h-5 w-5" />}
                    <span className="line-clamp-2 text-xs">{attachment.file.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                  aria-label="Ek dosyasını kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex flex-shrink-0 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.zip,.doc,.docx"
              multiple
              hidden
              onChange={onFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onRequestFilePicker}
              disabled={isBusy}
              aria-label="Dosya ekle"
              className="h-10 w-10"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSendShortcut?.();
                }
              }}
              placeholder={placeholder}
              rows={1}
              className="w-full resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
              disabled={isBusy}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="icon"
            disabled={isBusy || !canSend}
            isLoading={isSending || isUploading}
            className={cn("h-11 w-11 rounded-full", !canSend && "opacity-50")}
            aria-label="Mesaj gönder"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}

MessageComposer.displayName = "MessageComposer";

