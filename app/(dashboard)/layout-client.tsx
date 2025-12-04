"use client";

import Link from "next/link";
import Image from "next/image";
import { signOutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  Briefcase,
  Building2,
  User,
  Menu,
  X,
  LogOut,
  BarChart3,
  GraduationCap,
  Trophy,
  Target,
  Code,
  Bug,
  MessageCircle,
  PenSquare,
  Users,
  LifeBuoy,
  Handshake,
  Medal,
  TrendingUp,
  History,
  UserPlus,
  DollarSign,
  Home,
  Compass,
  Plus,
  ChevronDown,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, type ComponentType, type SVGProps } from "react";
import { usePathname } from "next/navigation";
import { CelebrationProvider } from "@/app/contexts/CelebrationContext";
import { BadgeNotificationProvider } from "@/app/contexts/BadgeNotificationContext";
import { ChatSummaryProvider, useChatSummary } from "@/app/contexts/ChatSummaryContext";
import { FriendRequestProvider, useFriendRequest } from "@/app/contexts/FriendRequestContext";
import { NotificationProvider, useNotification } from "@/app/contexts/NotificationContext";
import { NotificationContainer } from "@/app/components/notifications/NotificationToast";
import { useGlobalNotifications } from "@/hooks/useGlobalNotifications";

export function DashboardLayoutClient({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NotificationProvider>
      <ChatSummaryProvider>
        <FriendRequestProvider>
          <DashboardLayoutContent session={session}>{children}</DashboardLayoutContent>
        </FriendRequestProvider>
      </ChatSummaryProvider>
    </NotificationProvider>
  );
}

function DashboardLayoutContent({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const { directUnread, groupsUnread, communityUnread } = useChatSummary();
  const { friendRequestCount } = useFriendRequest();
  const { notifications, dismissNotification } = useNotification();
  
  // Setup global notifications listener
  useGlobalNotifications();

  // Check and generate missing CV interviews on login
  useEffect(() => {
    // Only run once when component mounts (user logs in)
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_CV_INTERVIEW_CHECK === "true") {
      fetch("/api/interview/cv-based/check-and-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch((error) => {
        // Silently fail - this is a background operation
        console.error("[CV_INTERVIEW_LAYOUT] Failed to check and generate interviews:", error);
      });
    }
  }, []); // Empty dependency array - only run once on mount

  // Throttle function for resize listener
  const throttle = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    return () => {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func();
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func();
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Memoized checkMobile function with throttle
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    // On desktop, keep sidebar state; on mobile, close it
    if (mobile) {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    // Initialize based on screen size
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    }

    const throttledCheckMobile = throttle(checkMobile, 150);
    window.addEventListener("resize", throttledCheckMobile);
    return () => window.removeEventListener("resize", throttledCheckMobile);
  }, [checkMobile, throttle]);

  type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

  type NavigationItem = {
    name: string;
    href: string;
    icon: IconComponent;
  };

  type NavigationGroup = {
    title: string;
    items: NavigationItem[];
  };

  const unreadByHref = useMemo<Record<string, number>>(
    () => ({
      "/chat/direct": directUnread,
      "/chat/groups": groupsUnread,
      "/chat": communityUnread,
      "/dashboard/friends": friendRequestCount,
    }),
    [communityUnread, directUnread, groupsUnread, friendRequestCount]
  );

  const navigationGroups: NavigationGroup[] = useMemo(() => {
    const groups: NavigationGroup[] = [
      {
        title: "Anasayfa",
        items: [
          {
            name: "Anasayfa",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        title: "İlerişim",
        items: [
          {
            name: "Sohbetler",
            href: "/chat/direct",
            icon: MessageCircle,
          },
          {
            name: "Gruplar",
            href: "/chat/groups",
            icon: Users,
          },
          {
            name: "Yardımlaşma Toplulukları",
            href: "/chat",
            icon: LifeBuoy,
          },
        ],
      },
      {
        title: "Sosyal",
        items: [
          {
            name: "Haber Akışı",
            href: "/social/feed",
            icon: Home,
          },
          {
            name: "Keşfet",
            href: "/social/explore",
            icon: Compass,
          },
          {
            name: "Oluştur",
            href: "/social/create",
            icon: Plus,
          },
          {
            name: "Bağlantılarım",
            href: "/dashboard/friends",
            icon: UserPlus,
          },
        ],
      },
      {
        title: "Eğitim",
        items: [
          {
            name: "Kurslar",
            href: "/education/courses",
            icon: BookOpen,
          },
          {
            name: "Testler",
            href: "/education/tests",
            icon: PenSquare,
          },
          {
            name: "Canlı Kodlama",
            href: "/education/cases",
            icon: Code,
          },
          {
            name: "Rozetler",
            href: "/rozetler",
            icon: Medal,
          },
          {
            name: "Gelişim ve Analiz",
            href: "/education/analytics",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "Kazanç",
        items: [
          {
            name: "Hackaton",
            href: "/education/hackaton",
            icon: Trophy,
          },
          {
            name: "Freelancer Partner",
            href: "/freelancer/projects",
            icon: Handshake,
          },
          {
            name: "Derece Sıralaması",
            href: "/competition",
            icon: Medal,
          },
          {
            name: "Kazanç Analizi",
            href: "/earnings",
            icon: TrendingUp,
          },
          {
            name: "En Çok Kazananlar",
            href: "/earnings/leaderboard",
            icon: DollarSign,
          },
        ],
      },
      {
        title: "Kariyer",
        items: [
          {
            name: "CV",
            href: "/cv/my-cvs",
            icon: FileText,
          },
          {
            name: "İş İlanları",
            href: "/jobs/browse",
            icon: Briefcase,
          },
          {
            name: "Kariyer Planım",
            href: "/career/roadmap",
            icon: Target,
          },
          {
            name: "Mülakat",
            href: "/interview/cv-based",
            icon: MessageSquare,
          },
        ],
      },
    ];

    if ((session.user as any)?.role === "employer") {
      groups.push({
        title: "İşveren",
        items: [
          {
            name: "İşveren Paneli",
            href: "/employer/jobs",
            icon: Building2,
          },
        ],
      });
    }

    if ((session.user as any)?.role === "admin") {
      groups.push({
        title: "Yönetim",
        items: [
          {
            name: "Admin Paneli",
            href: "/admin",
            icon: LifeBuoy,
          },
          {
            name: "Bugfix",
            href: "/education/bugfix-cases",
            icon: Bug,
          },
        ],
      });
    }

    return groups;
  }, [session.user]);

  const isActiveLink = useCallback((href: string) => {
    if (!pathname) {
      return false;
    }

    if (pathname === href) {
      return true;
    }

    if (href === "/dashboard" || href === "/") {
      return false;
    }

    const hasExactMatch = navigationGroups.some((group) =>
      group.items.some((item) => item.href !== href && pathname === item.href),
    );

    if (hasExactMatch) {
      return false;
    }

    return pathname.startsWith(`${href}/`);
  }, [pathname, navigationGroups]);

  // Find which group contains the active link
  const activeGroup = useMemo(() => {
    if (!pathname) return null;
    
    for (const group of navigationGroups) {
      const hasActiveItem = group.items.some((item) => isActiveLink(item.href));
      if (hasActiveItem) {
        return group.title;
      }
    }
    return null;
  }, [pathname, navigationGroups]);

  // Initialize expanded groups based on active pathname
  useEffect(() => {
    if (activeGroup) {
      setExpandedGroups((prev) => {
        const newSet = new Set(prev);
        newSet.add(activeGroup);
        return newSet;
      });
    }
  }, [activeGroup]);

  const toggleGroup = useCallback((groupTitle: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  }, []);

  return (
    <CelebrationProvider>
      <BadgeNotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Sidebar overlay - optimized with opacity/pointer-events instead of conditional rendering */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isMobile ? "backdrop-blur-sm" : ""
        }`}
        style={{
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      {/* Sidebar - optimized with GPU acceleration and reduced backdrop blur */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 border-r border-gray-200/50 dark:border-gray-700/50 transition-transform duration-300 ease-in-out bg-white/85 dark:bg-gray-900/85 backdrop-blur-md ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          willChange: "transform",
          transform: sidebarOpen ? "translateX(0) translateZ(0)" : "translateX(-100%) translateZ(0)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50 min-w-0">
            <Link
              href="/dashboard"
              className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-purple-600 md:to-pink-600 md:bg-[length:200%_auto] md:animate-text-shimmer flex-shrink-0 min-w-0"
            >
              YTK Academy
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0 min-w-[24px]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.title);
              const hasActiveItem = group.items.some((item) => isActiveLink(item.href));
              
              return (
                <div key={group.title} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      hasActiveItem
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                        : "text-gray-400/80 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <span>{group.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="space-y-1 pl-2">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActiveLink(item.href);
                        const badgeCount = unreadByHref[item.href] ?? 0;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition-all duration-200 dark:text-gray-300 group min-w-0 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:from-blue-500/20 dark:to-purple-500/20 dark:text-blue-400 font-semibold md:shadow-md md:shadow-blue-500/20"
                                : "hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                            }`}
                            onClick={() => isMobile && setSidebarOpen(false)}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-500 md:shadow-glow md:shadow-blue-500/50" />
                            )}
                            <Icon
                              className={`h-5 w-5 flex-shrink-0 min-w-[20px] transition-all duration-200 ${
                                isActive
                                  ? "text-blue-600 dark:text-blue-400 md:scale-110"
                                  : "group-hover:text-blue-600 dark:group-hover:text-blue-400 md:group-hover:scale-110"
                              }`}
                            />
                            <span className="flex-1 font-medium truncate min-w-0">{item.name}</span>
                            {badgeCount > 0 ? (
                              <span className="ml-2 inline-flex min-w-[1.5rem] justify-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white md:text-xs">
                                {badgeCount > 99 ? "99+" : badgeCount}
                              </span>
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
            <Link
              href="/profile"
              className="flex items-center gap-3 mb-3 px-2 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg md:shadow-neon-blue/50">
                {session.user?.profileImage ? (
                  <Image
                    src={session.user.profileImage}
                    alt={session.user?.name || "Profil"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {session.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>
            </Link>
            <div className="mb-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <ThemeToggle />
                <span className="text-sm font-medium">Tema</span>
              </button>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Çıkış Yap</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={sidebarOpen ? "lg:pl-64" : ""}>
        {/* Header with menu button */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 min-w-0 pt-4">
          <div className="flex items-center justify-between h-14 px-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0 min-w-[24px]"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              href="/dashboard"
              className="text-xl font-display font-normal bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent flex-shrink-0 min-w-0 truncate"
            >
              YTK Academy
            </Link>
            <div className="w-6 flex-shrink-0" />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      
      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />
        </div>
      </BadgeNotificationProvider>
    </CelebrationProvider>
  );
}

