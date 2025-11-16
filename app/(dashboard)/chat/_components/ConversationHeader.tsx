import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ConversationHeaderProps {
  leading: ReactNode;
  title: string;
  description?: string;
  badges?: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ConversationHeader({
  leading,
  title,
  description,
  badges,
  actions,
  onClick,
  className,
}: ConversationHeaderProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "flex flex-col gap-4 border-b border-gray-200 px-6 py-5 text-left transition-colors hover:bg-gray-50/60 focus:outline-none dark:border-gray-800 dark:hover:bg-gray-900/40 md:flex-row md:items-center md:justify-between",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-50">{title}</h1>
          {description && <p className="truncate text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          {badges && <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">{badges}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </Wrapper>
  );
}

ConversationHeader.displayName = "ConversationHeader";

