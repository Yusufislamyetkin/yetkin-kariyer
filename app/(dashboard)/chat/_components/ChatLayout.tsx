import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  sidebar: ReactNode;
  header?: ReactNode;
  messages: ReactNode;
  composer?: ReactNode;
  overlays?: ReactNode;
  error?: string | null;
  className?: string;
  hasSelectedConversation?: boolean;
}

export function ChatLayout({
  sidebar,
  header,
  messages,
  composer,
  overlays,
  error,
  className,
  hasSelectedConversation = false,
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Desktop: Always show sidebar, Mobile: Show only when no conversation selected */}
        <aside
          className={cn(
            "w-full lg:w-[22rem] xl:w-[24rem] border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 min-h-0 overflow-hidden",
            // Desktop: always visible, Mobile: only when no conversation selected
            hasSelectedConversation ? "hidden lg:block" : "block"
          )}
        >
          {sidebar}
        </aside>

        {/* Desktop: Always show conversation, Mobile: Show only when conversation selected */}
        <div
          className={cn(
            "relative flex flex-1 flex-col bg-white dark:bg-gray-950 min-h-0 overflow-hidden",
            // Desktop: always visible, Mobile: only when conversation selected
            hasSelectedConversation ? "block" : "hidden lg:flex"
          )}
        >
          {error && (
            <div className="absolute right-4 top-4 z-20 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 shadow-sm dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
              {error}
            </div>
          )}

          {header}

          <div className="flex flex-1 flex-col overflow-hidden min-h-0">
            {messages}
            {composer}
          </div>
        </div>
      </div>

      {overlays}
    </div>
  );
}

ChatLayout.displayName = "ChatLayout";

