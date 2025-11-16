/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Paperclip, Send, Play, FileText } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";
import type { LocalAttachment } from "./types";

type ComposerProps = {
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSendShortcut?: () => void;
  attachments: LocalAttachment[];
  onAttachmentsSelect: (files: FileList) => void;
  onAttachmentRemove: (id: string) => void;
  disabled?: boolean;
  sending?: boolean;
  uploading?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  accept?: string;
  placeholder?: string;
};

export function Composer({
  message,
  onMessageChange,
  onSubmit,
  onSendShortcut,
  attachments,
  onAttachmentsSelect,
  onAttachmentRemove,
  disabled,
  sending,
  uploading,
  textareaRef,
  fileInputRef,
  accept = "image/*,video/*,audio/*,.pdf,.zip,.doc,.docx",
  placeholder = "Mesajınızı yazın...",
}: ComposerProps) {
  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (!list || list.length === 0) return;
    onAttachmentsSelect(list);
    event.target.value = "";
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendShortcut?.();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-gray-200/70 dark:border-gray-800/60 px-4 md:px-6 py-4 bg-white/90 dark:bg-gray-950/80 backdrop-blur-md"
    >
      <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/70 shadow-sm px-3 py-2 sm:px-4 sm:py-3 space-y-3">
        {attachments.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 min-w-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-gray-200/70 dark:border-gray-700/50 overflow-hidden flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/70 shrink-0 flex-shrink-0"
              >
                {attachment.type === "image" || attachment.type === "gif" ? (
                  <img src={attachment.preview} alt="Önizleme" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-xs text-gray-600 dark:text-gray-300 px-2 text-center">
                    {attachment.type === "audio" ? <Play className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    <span className="line-clamp-2">{attachment.file.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onAttachmentRemove(attachment.id)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Ek dosyasını kaldır"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-end gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept={accept} multiple hidden onChange={handleFileInput} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 dark:text-blue-300 rounded-full h-11 w-11"
              title="Dosya ekle"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent px-2 sm:px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 overflow-hidden",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500"
              )}
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            size="md"
            disabled={disabled || sending || uploading}
            isLoading={sending || uploading}
            className="min-w-[44px] min-h-[44px] rounded-full p-0 flex items-center justify-center"
            aria-label="Mesaj gönder"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}

