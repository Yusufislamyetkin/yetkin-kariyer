"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type ChatCategory = {
  label: string;
  href: string;
  description: string;
};

const CATEGORIES: ChatCategory[] = [
  {
    label: "Sohbetler",
    href: "/chat/direct",
    description: "Özel sohbetler ve bire bir konuşmalar",
  },
  {
    label: "Gruplar",
    href: "/chat/groups",
    description: "Kullanıcıların oluşturduğu paylaşım alanları",
  },
  {
    label: "Yardımlaşma Toplulukları",
    href: "/chat",
    description: "Sistem tarafından oluşturulan topluluk sohbetleri",
  },
];

export function ChatCategoryNav() {
  const pathname = usePathname();

  const resolveIsActive = (href: string) => {
    if (href === "/chat") {
      return pathname === "/chat" || pathname === "/chat/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="rounded-3xl border border-gray-200/60 bg-white/85 p-4 shadow-md backdrop-blur-md dark:border-gray-800/70 dark:bg-gray-950/70">
      <div className="grid gap-3 sm:grid-cols-3">
        {CATEGORIES.map((category) => {
          const isActive = resolveIsActive(category.href);
          return (
            <Link
              key={category.href}
              href={category.href}
              className={cn(
                "group relative flex flex-col gap-1 rounded-2xl border px-4 py-3 transition-all duration-200",
                "border-transparent bg-white/80 text-gray-700 shadow-sm hover:border-blue-200/70 hover:shadow-lg dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-blue-900/50",
                isActive &&
                  "border-blue-400/60 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-gray-900 shadow-lg dark:text-white"
              )}
            >
              <span className="text-sm font-semibold tracking-wide">{category.label}</span>
              <span className="text-xs text-gray-500 transition-colors group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
                {category.description}
              </span>
              <span
                className={cn(
                  "absolute inset-x-4 bottom-[-6px] h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity",
                  isActive && "opacity-100"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


