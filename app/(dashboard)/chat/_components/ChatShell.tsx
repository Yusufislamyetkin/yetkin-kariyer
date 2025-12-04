import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ChatShellProps = {
  sidebar: ReactNode;
  conversationHeader?: ReactNode;
  children: ReactNode;
  composer?: ReactNode;
  overlay?: ReactNode;
  mobileSidebarOpen: boolean;
  onToggleMobileSidebar: (value: boolean) => void;
  mobileHeaderActions?: ReactNode;
  className?: string;
};

export function ChatShell({
  sidebar,
  conversationHeader,
  children,
  composer,
  overlay,
  mobileSidebarOpen,
  onToggleMobileSidebar,
  mobileHeaderActions,
  className,
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
        <aside
          className={cn(
            "w-full lg:w-[22rem] xl:w-[24rem] border-b lg:border-b-0 lg:border-r border-gray-200/60 dark:border-gray-700/60 bg-white/85 dark:bg-gray-900/75 backdrop-blur-md transition-transform duration-300 ease-in-out z-30",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "absolute lg:static inset-y-0 left-0 overflow-hidden min-h-0"
          )}
        >
          {sidebar}
        </aside>

        <div className="flex-1 flex flex-col bg-white/70 dark:bg-gray-950/60 relative min-h-0 overflow-hidden">
          <div className="lg:hidden absolute top-4 left-4 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleMobileSidebar(!mobileSidebarOpen)}
              className="h-10 w-10 rounded-full border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/60"
            >
              {mobileSidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>

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

      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-20 transition-opacity duration-300 lg:hidden",
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onToggleMobileSidebar(false)}
      />
    </div>
  );
}

