"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-purple-600 md:to-pink-600 md:bg-[length:200%_auto] md:animate-text-shimmer"
            >
              YTK Academy
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/login"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/register"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Kayıt Ol
              </Link>
              <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

