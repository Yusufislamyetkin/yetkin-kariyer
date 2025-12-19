"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import dynamic from "next/dynamic";
import { useTheme } from "@/app/contexts/ThemeContext";

const ThemeToggleIcon = dynamic(
  () => import("@/app/components/ThemeToggle").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: false }
);

function ThemeSwitchButton() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Temayı değiştir"
      className="rounded-lg bg-gray-100 p-2 transition hover:ring-2 hover:ring-blue-200 dark:bg-gray-800 dark:hover:ring-blue-500/40"
    >
      <ThemeToggleIcon />
    </button>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <span className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer group-hover:scale-105 transition-transform duration-300">
              YTK Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <Link 
              href="/hakkimizda" 
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
            >
              Hakkımızda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/fiyatlandirma" 
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
            >
              Fiyatlandırma
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <a 
              href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20hakkında%20bilgi%20almak%20istiyorum" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
            >
              İletişim
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Menü"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <ThemeSwitchButton />
            
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-medium"
                >
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="gradient" 
                  size="sm"
                  className="font-semibold shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  Kayıt Ol
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/60 dark:border-gray-700/60 py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link 
                href="/hakkimizda" 
                className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link 
                href="/fiyatlandirma" 
                className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fiyatlandırma
              </Link>
              <a 
                href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20hakkında%20bilgi%20almak%20istiyorum" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </a>
              <div className="flex flex-col gap-2 px-4 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 mt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" size="sm" className="w-full justify-start font-semibold">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
