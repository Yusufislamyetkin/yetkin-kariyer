import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConversationSidebarItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  preview?: string;
  meta?: string;
  unreadCount?: number;
  initials?: string;
  accent?: "blue" | "purple" | "emerald" | "gray";
  presenceIndicator?: string;
  presenceColor?: string;
  badge?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}

type EmptyState =
  | ReactNode
  | {
      icon?: ReactNode;
      title: string;
      description?: string;
    };

interface ConversationSidebarProps {
  title: string;
  subtitle?: string;
  countLabel?: string;
  action?: ReactNode;
  items: ConversationSidebarItem[];
  loading?: boolean;
  activeId?: string | null;
  onSelect?: (id: string) => void;
  emptyState?: EmptyState;
  onCloseMobile?: () => void;
  className?: string;
}

export function ConversationSidebar({
  title,
  subtitle,
  countLabel,
  action,
  items,
  loading,
  activeId,
  onSelect,
  emptyState,
  onCloseMobile,
  className,
}: ConversationSidebarProps) {
  const renderEmptyState = () => {
    if (!emptyState) {
      return <div className="text-sm text-gray-500 dark:text-gray-400">Hiç konuşma bulunamadı.</div>;
    }

    if (typeof emptyState === "object" && "title" in emptyState) {
      return (
        <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500 dark:text-gray-400">
          {emptyState.icon ? <div className="text-blue-500">{emptyState.icon}</div> : null}
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-200">{emptyState.title}</p>
            {emptyState.description ? (
              <p className="text-xs opacity-80">{emptyState.description}</p>
            ) : null}
          </div>
        </div>
      );
    }

    return <div className="text-sm text-gray-500 dark:text-gray-400">{emptyState}</div>;
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {subtitle ? <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {countLabel ? (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{countLabel}</span>
          ) : null}
          {action}
          {onCloseMobile ? (
            <button
              type="button"
              className="lg:hidden rounded-full border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={onCloseMobile}
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden min-h-0 px-4 py-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full items-center justify-center">{renderEmptyState()}</div>
        ) : (
          items.map((item) => {
            const handleClick = () => {
              item.onClick?.();
              onSelect?.(item.id);
            };

            return (
              <button
                key={item.id}
                type="button"
                onClick={handleClick}
                className={cn(
                  "w-full flex items-start gap-3 rounded-2xl border border-transparent px-4 py-3 transition-all duration-200 text-left shadow-sm",
                  "bg-white/75 dark:bg-gray-900/70 hover:shadow-md hover:border-blue-200/70 dark:hover:border-blue-900/40",
                  activeId === item.id &&
                    "bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border-blue-400/60 dark:border-blue-900/50 shadow-lg"
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm",
                      item.accent === "purple" && "bg-gradient-to-br from-purple-500 to-indigo-500",
                      item.accent === "emerald" && "bg-gradient-to-br from-emerald-500 to-teal-500",
                      item.accent === "gray" && "bg-gradient-to-br from-gray-500 to-gray-700",
                      (!item.accent || item.accent === "blue") && "bg-gradient-to-br from-blue-500 to-sky-500"
                    )}
                  >
                    {item.initials ?? "?"}
                  </div>
                  {item.presenceIndicator && item.presenceIndicator !== "none" ? (
                    <span
                      className={cn(
                        "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900",
                        item.presenceIndicator === "online"
                          ? item.presenceColor ?? "bg-emerald-400"
                          : "bg-gray-400"
                      )}
                    />
                  ) : null}
                  {item.badge ? <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">{item.badge}</span> : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                    {typeof item.unreadCount === "number" && item.unreadCount > 0 ? (
                      <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                        {item.unreadCount}
                      </span>
                    ) : null}
                  </div>

                  {item.subtitle ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</p>
                  ) : null}

                  {item.preview ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{item.preview}</p>
                  ) : null}

                  {item.meta ? (
                    <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{item.meta}</p>
                  ) : null}
                </div>

                {item.trailing}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

