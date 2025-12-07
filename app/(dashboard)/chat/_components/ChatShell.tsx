import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChatShellProps = {
  sidebar: ReactNode;
  conversationHeader?: ReactNode;
  children: ReactNode;
  composer?: ReactNode;
  overlay?: ReactNode;
  mobileHeaderActions?: ReactNode;
  className?: string;
  hasSelectedConversation?: boolean;
  onBackToSidebar?: () => void;
};

export function ChatShell({
  sidebar,
  conversationHeader,
  children,
  composer,
  overlay,
  mobileHeaderActions,
  className,
  hasSelectedConversation = false,
  onBackToSidebar,
}: ChatShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] min-h-0 bg-background/80 dark:bg-background/70 rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl overflow-hidden",
        "supports-backdrop-blur:bg-white/75 supports-backdrop-blur:dark:bg-gray-900/75 backdrop-blur-lg",
        className
      )}
    >
      <div className="flex flex-1 flex-col lg:flex-row relative min-h-0 overflow-hidden">
        {/* Desktop: Always show sidebar, Mobile: Show only when no conversation selected */}
        <aside
          className={cn(
            "w-full lg:w-[22rem] xl:w-[24rem] border-b lg:border-b-0 lg:border-r border-gray-200/60 dark:border-gray-700/60 bg-white/85 dark:bg-gray-900/75 backdrop-blur-md min-h-0 overflow-hidden",
            // Desktop: always visible, Mobile: only when no conversation selected
            hasSelectedConversation ? "hidden lg:block" : "block"
          )}
        >
          {sidebar}
        </aside>

        {/* Desktop: Always show conversation, Mobile: Show only when conversation selected */}
        <div
          className={cn(
            "flex-1 flex flex-col bg-white/70 dark:bg-gray-950/60 relative min-h-0 overflow-hidden",
            // Desktop: always visible, Mobile: only when conversation selected
            hasSelectedConversation ? "block" : "hidden lg:flex"
          )}
        >
          {mobileHeaderActions && (
            <div className="lg:hidden absolute top-4 right-4 z-20">
              {mobileHeaderActions}
            </div>
          )}

          {conversationHeader}

          <main className="flex-1 flex flex-col overflow-hidden min-h-0">{children}</main>

          {composer}
        </div>
      </div>

      {overlay}
    </div>
  );
}

