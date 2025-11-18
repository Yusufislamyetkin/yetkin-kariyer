/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Edit,
  Camera,
  Award,
  Calendar,
  Settings,
  Lock,
  Bell,
  Palette,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Target,
  Briefcase,
  GraduationCap,
  FileText,
  Clock,
  BarChart3,
  Trophy,
  Star,
  MessageSquare,
  Flame,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { BadgeDisplay, BadgeCollection } from "@/app/components/badges/BadgeDisplay";
import { BadgeOverlay } from "@/app/components/badges/BadgeOverlay";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [displayedBadges, setDisplayedBadges] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"badges" | "comments" | "stats">("badges");
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [gamiSummary, setGamiSummary] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status, router]);

  const fetchProfileData = async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    try {
      setError(null);
      if (!silent) {
        setLoading(true);
      }
      const userId = (session?.user as any)?.id as string | undefined;

      // Validate userId before making API calls
      if (!userId || typeof userId !== 'string') {
        console.error("User ID is not available");
        setError("Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      // Fetch user profile details
      try {
        const profileResponse = await fetch(`/api/profile/${userId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileUser(profileData.user || null);
        } else {
          console.warn("Failed to fetch profile:", profileResponse.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }

      // Fetch badges
      try {
        const badgesResponse = await fetch("/api/badges/user");
        if (badgesResponse.ok) {
          const badgesData = await badgesResponse.json();
          setBadges(badgesData.badges || []);
          setDisplayedBadges(badgesData.displayedBadges || []);
        } else {
          console.warn("Failed to fetch badges:", badgesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
      }

      // Fetch all badges
      try {
        const allBadgesResponse = await fetch("/api/badges");
        if (allBadgesResponse.ok) {
          const allBadgesData = await allBadgesResponse.json();
          setAllBadges(allBadgesData.badges || []);
        } else {
          console.warn("Failed to fetch all badges:", allBadgesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching all badges:", error);
      }

      // Fetch user rank
      try {
        const rankResponse = await fetch("/api/competition/leaderboard?period=daily&type=quiz_count");
        if (rankResponse.ok) {
          const rankData = await rankResponse.json();
          if (rankData.userRank) {
            setUserRank(rankData.userRank);
          }
        } else {
          console.warn("Failed to fetch user rank:", rankResponse.status);
        }
      } catch (error) {
        console.error("Error fetching user rank:", error);
      }

      // Fetch daily goals
      try {
        const goalsResponse = await fetch("/api/goals/daily");
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          setDailyGoals(goalsData.goals || []);
        } else {
          console.warn("Failed to fetch daily goals:", goalsResponse.status);
        }
      } catch (error) {
        console.error("Error fetching daily goals:", error);
      }

      // Fetch comments - only if userId is available
      try {
        const commentsResponse = await fetch(`/api/profile/${userId}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        } else {
          console.warn("Failed to fetch comments:", commentsResponse.status);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }

      // Fetch recent activities
      try {
        const activitiesResponse = await fetch("/api/profile/activity?limit=10");
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData.activities || []);
        } else {
          console.warn("Failed to fetch activities:", activitiesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }

      // Fetch performance stats
      try {
        const statsResponse = await fetch("/api/dashboard/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.stats) {
            // Calculate performance metrics
            const quizAttempts = statsData.stats.quizAttempts || 0;
            const interviewAttempts = statsData.stats.interviewAttempts || 0;
            const avgQuizScore = statsData.stats.averageQuizScore || 0;
            const avgInterviewScore = statsData.stats.averageInterviewScore || 0;
            
            // General success rate (weighted average)
            const generalSuccess = quizAttempts + interviewAttempts > 0
              ? Math.round((avgQuizScore * quizAttempts + avgInterviewScore * interviewAttempts) / (quizAttempts + interviewAttempts))
              : 0;
            
            // Completion rate (based on attempts vs goals)
            const completionRate = Math.min(100, Math.round((quizAttempts + interviewAttempts) / 10 * 100));
            
            // Activity score (based on recent activity - last 30 days)
            const activityScore = Math.min(100, Math.round((quizAttempts + interviewAttempts) / 5 * 100));
            
            setPerformanceStats({
              generalSuccess,
              completionRate,
              activityScore,
            });
          }
        } else {
          console.warn("Failed to fetch stats:", statsResponse.status);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }

      // Fetch gamification summary
      try {
        const gamiResp = await fetch("/api/gamification/me/summary");
        if (gamiResp.ok) {
          const gami = await gamiResp.json();
          setGamiSummary(gami);
        }
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Profil verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchProfileData();
            }}
            variant="gradient"
          >
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const sessionUser = session?.user as any;
  const displayUser = {
    id: profileUser?.id ?? sessionUser?.id ?? "",
    name: profileUser?.name ?? sessionUser?.name ?? "",
    email: profileUser?.email ?? sessionUser?.email ?? "",
    profileImage: profileUser?.profileImage ?? sessionUser?.profileImage ?? null,
    role: profileUser?.role ?? sessionUser?.role ?? "Aday",
  };

  if (!user && !profileUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400">Kullanıcı bilgileri yüklenemedi.</p>
        </div>
      </div>
    );
  }
  const userRole = displayUser.role || "Aday";

  // Initialize edit form when modal opens
  const handleEditClick = () => {
    setEditName(displayUser.name || "");
    setEditEmail(displayUser.email || "");
    setShowEditModal(true);
  };

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir resim dosyası seçin");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Resim yüklenemedi");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url;

      // Update profile with new image
      const updateResponse = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      if (!updateResponse.ok) {
        throw new Error("Profil güncellenemedi");
      }

      // Refresh profile data to reflect new image
      await fetchProfileData({ silent: true });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Resim yüklenirken bir hata oluştu");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updateData: any = {};
      if (editName !== displayUser.name) updateData.name = editName;
      if (editEmail !== displayUser.email) updateData.email = editEmail;

      if (Object.keys(updateData).length === 0) {
        setShowEditModal(false);
        return;
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Profil güncellenemedi");
      }

      // Refresh profile data to reflect updates
      await fetchProfileData({ silent: true });
      setShowEditModal(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Profil güncellenirken bir hata oluştu");
    }
  };

  // Get initials for avatar
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const earnedBadgeIds = new Set(badges.filter((b) => b?.id).map((b) => b.id));

  const badgeMetadataMap = badges.reduce<Map<string, any>>((map, badge) => {
    if (badge?.id) {
      map.set(badge.id, badge);
    }
    return map;
  }, new Map());

  const badgeCollectionData = allBadges.map((badge) => {
    const earnedBadge = badgeMetadataMap.get(badge.id);
    return earnedBadge
      ? {
          ...badge,
          earnedAt: earnedBadge.earnedAt,
          isDisplayed: earnedBadge.isDisplayed,
        }
      : badge;
  });
  const totalPoints = (badges || []).reduce((sum, b) => sum + ((b?.points && typeof b.points === 'number') ? b.points : 0), 0);
  const completedGoals = (dailyGoals || []).filter((g) => g?.completed === true).length;
  const activeGoals = (dailyGoals || []).filter((g) => !g?.completed).length;

  const profileStats = [
    {
      label: "Seviye",
      value: gamiSummary?.level ?? 1,
      icon: Target,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      borderColor: "border-indigo-200 dark:border-indigo-800/50",
    },
    {
      label: "Puan",
      value: (gamiSummary?.points ?? 0).toString(),
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800/50",
    },
    {
      label: "XP",
      value: (gamiSummary?.xp ?? 0).toString(),
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800/50",
    },
    {
      label: "Günlük Streak",
      value: (gamiSummary?.streak?.current ?? 0).toString(),
      icon: Flame,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-800/50",
    },
  ];

  const accountSettings = [
    {
      title: "Şifre Değiştir",
      description: "Hesap güvenliğiniz için şifrenizi güncelleyin",
      icon: Lock,
      color: "from-blue-500 to-cyan-500",
      href: "#",
    },
    {
      title: "Bildirimler",
      description: "Bildirim tercihlerinizi yönetin",
      icon: Bell,
      color: "from-green-500 to-emerald-500",
      href: "#",
    },
    {
      title: "Tema Ayarları",
      description: "Görünüm tercihlerinizi değiştirin",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      href: "#",
    },
    {
      title: "Ödeme Bilgileri",
      description: "Abonelik ve ödeme yöntemleriniz",
      icon: CreditCard,
      color: "from-orange-500 to-red-500",
      href: "#",
    },
  ];

  const getActivityIcon = (type: string, icon: string) => {
    switch (type) {
      case "quiz":
        return CheckCircle;
      case "interview":
        return Video;
      case "cv":
        return FileText;
      case "application":
        return Briefcase;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "text-green-500 dark:text-green-400";
      case "interview":
        return "text-blue-500 dark:text-blue-400";
      case "cv":
        return "text-purple-500 dark:text-purple-400";
      case "application":
        return "text-orange-500 dark:text-orange-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-8">
      {/* Profile Header - Dark Mode Optimized */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        {/* Gradient Background - Dark Mode Adjusted */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent"></div>
        
        {/* Decorative Elements - Dark Mode Adjusted */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 dark:bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="relative p-6 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/20 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-sm border-4 border-white/30 dark:border-white/20 flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-2xl relative overflow-hidden">
                {displayUser.profileImage ? (
                  <img
                    src={displayUser.profileImage}
                    alt={displayUser.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700"></div>
                    <span className="relative z-10">{getInitials(displayUser.name)}</span>
                  </>
                )}
              </div>
              <label className="absolute bottom-0 right-0 md:bottom-2 md:right-2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white dark:border-white/80 z-10 cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-20">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 drop-shadow-lg">
                {displayUser.name || "Kullanıcı"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 dark:border-white/20">
                  <Mail className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-medium">{displayUser.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 dark:border-white/20">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-medium">{userRole}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/90 dark:text-white/80">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Üyelik: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long" })}</span>
              </div>
              {displayedBadges.length > 0 && (
                <div className="mt-4 flex justify-center md:justify-start">
                  <BadgeOverlay badges={displayedBadges} placement="inline" />
                </div>
              )}
            </div>

            {/* Edit Button */}
            <Button 
              variant="gradient" 
              size="lg" 
              className="shadow-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20"
              onClick={handleEditClick}
            >
              <Edit className="h-5 w-5 mr-2" />
              Profili Düzenle
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Stats - Enhanced with Dark Mode */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {profileStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              variant="elevated"
              hover
              className={`overflow-hidden group animate-fade-in relative border ${stat.borderColor} ${stat.bgColor}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full -mr-12 -mt-12 blur-2xl opacity-20 dark:opacity-10`} />
              <CardContent className="p-5 md:p-6 relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Personal Information & Account Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information - Enhanced */}
        <Card variant="elevated" hover className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span>Kişisel Bilgiler</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                    İsim
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {displayUser.name || "Belirtilmemiş"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-all">
                    {displayUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                    Rol
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {userRole}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings - Enhanced */}
        <Card variant="elevated" hover className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span>Hesap Ayarları</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              {accountSettings.map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <button
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all duration-200 group border border-gray-200 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700 text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${setting.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {setting.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {setting.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Performance - New Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card variant="elevated" hover className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span>Son Aktiviteler</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type, activity.icon);
                  const color = getActivityColor(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.title}
                          {activity.score !== undefined && activity.score !== null && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              (%{activity.score})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {activity.timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                  Henüz aktivite yok
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Test çözerek veya kurs alarak başlayın
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card variant="elevated" hover className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span>Performans Özeti</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {performanceStats ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Genel Başarı</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {performanceStats.generalSuccess}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                      style={{ width: `${performanceStats.generalSuccess}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tamamlanma Oranı</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {performanceStats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                      style={{ width: `${performanceStats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktiflik Skoru</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {performanceStats.activityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                      style={{ width: `${performanceStats.activityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium text-sm">
                  Performans verisi yükleniyor
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Badges, Comments, Stats */}
      <Card variant="elevated" className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span>Başarılar ve Rozetler</span>
            </CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("badges")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === "badges"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                Rozetler
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === "comments"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                Yorumlar ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === "stats"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                İstatistikler
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === "badges" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Rozet Koleksiyonunuz ({badges.length} / {allBadges.length})
                </h3>
                {allBadges.length > 0 ? (
                  <BadgeCollection badges={badgeCollectionData} earnedBadgeIds={earnedBadgeIds} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">Rozetler yükleniyor...</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                İşveren Yorumları
              </h3>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, index) => {
                    // Safe access to employer data
                    const employer = comment?.employer || {};
                    const employerName = employer?.name || employer?.email || "Bilinmeyen İşveren";
                    const employerInitial = employerName?.[0]?.toUpperCase() || "?";

                    return (
                      <div
                        key={comment?.id || `comment-${index}`}
                        className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {employerInitial}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {employerName}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < ((comment?.rating && typeof comment.rating === 'number') ? comment.rating : 0)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment?.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString("tr-TR")
                              : "Tarih bilinmiyor"}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment?.comment || "Yorum içeriği bulunamadı"}</p>
                        {comment?.badge && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>{comment.badge?.icon || "🏆"}</span>
                            <span>{comment.badge?.name || "Rozet"} rozeti hakkında</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  Henüz yorum yok
                </p>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Competition Stats */}
              {userRank && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Rekabet İstatistikleri
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Günlük Sıralama</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        #{userRank?.rank != null ? userRank.rank : "N/A"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Test</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {userRank?.quizCount != null && typeof userRank.quizCount === 'number' ? userRank.quizCount : 0}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ortalama Skor</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        %{userRank?.averageScore != null && typeof userRank.averageScore === 'number' 
                          ? userRank.averageScore.toFixed(1) 
                          : "0"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Goals Summary */}
              {dailyGoals.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Günlük Hedefler Özeti
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tamamlanan</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {completedGoals}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aktif</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {activeGoals}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Profili Düzenle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="İsim"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="İsminizi girin"
              />
              <Input
                label="Email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email adresinizi girin"
              />
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleProfileUpdate}
                  className="flex-1"
                >
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

