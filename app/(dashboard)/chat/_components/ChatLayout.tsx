import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  sidebar: ReactNode;
  header?: ReactNode;
  messages: ReactNode;
  composer?: ReactNode;
  overlays?: ReactNode;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  error?: string | null;
  className?: string;
}

export function ChatLayout({
  sidebar,
  header,
  messages,
  composer,
  overlays,
  showSidebar,
  onToggleSidebar,
  error,
  className,
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-30 w-full max-w-[22rem] border-b border-gray-200 bg-gray-50/95 backdrop-blur-sm transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900/95 lg:static lg:border-b-0 lg:border-r min-h-0 overflow-hidden",
            showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          {sidebar}
        </aside>

        <div className="relative flex flex-1 flex-col bg-white dark:bg-gray-950 min-h-0 overflow-hidden">
          <div className="absolute left-4 top-4 z-20 lg:hidden">
            <Button variant="outline" size="icon" onClick={onToggleSidebar} aria-label="Konuşma listesini aç">
              {showSidebar ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>

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

      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          showSidebar ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onToggleSidebar}
      />

      {overlays}
    </div>
  );
}

ChatLayout.displayName = "ChatLayout";

