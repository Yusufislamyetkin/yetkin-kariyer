"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import {
  Loader2,
  ArrowLeft,
  Activity,
  Heart,
  MessageSquare,
  Bookmark,
  FileText,
  Code,
  Bug,
  GraduationCap,
  Bot,
  Filter,
  X,
} from "lucide-react";
import Image from "next/image";

type ActivityType =
  | "POST"
  | "LIKE"
  | "COMMENT"
  | "SAVE"
  | "TEST"
  | "LIVE_CODING"
  | "BUG_FIX"
  | "QUIZ"
  | "LESSON"
  | "BOT_ACTIVITY";

interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  userIsBot: boolean;
  timestamp: string;
  details: {
    postId?: string;
    postContent?: string;
    commentId?: string;
    commentContent?: string;
    quizId?: string;
    quizTitle?: string;
    testScore?: number;
    lessonSlug?: string;
    activityType?: string;
    targetId?: string;
    success?: boolean;
    errorMessage?: string;
    [key: string]: any;
  };
}

const ACTIVITY_TYPES: { value: ActivityType | ""; label: string; icon: any; color: string }[] = [
  { value: "", label: "Tümü", icon: Activity, color: "bg-gray-500" },
  { value: "POST", label: "Paylaşım", icon: FileText, color: "bg-blue-500" },
  { value: "LIKE", label: "Beğeni", icon: Heart, color: "bg-red-500" },
  { value: "COMMENT", label: "Yorum", icon: MessageSquare, color: "bg-green-500" },
  { value: "SAVE", label: "Kaydetme", icon: Bookmark, color: "bg-yellow-500" },
  { value: "TEST", label: "Test", icon: FileText, color: "bg-purple-500" },
  { value: "LIVE_CODING", label: "Live Coding", icon: Code, color: "bg-indigo-500" },
  { value: "BUG_FIX", label: "Bug Fix", icon: Bug, color: "bg-orange-500" },
  { value: "QUIZ", label: "Quiz", icon: FileText, color: "bg-pink-500" },
  { value: "LESSON", label: "Ders", icon: GraduationCap, color: "bg-cyan-500" },
  { value: "BOT_ACTIVITY", label: "Bot Aktivitesi", icon: Bot, color: "bg-violet-500" },
];

export default function AdminActivityFeedPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ActivityType | "">("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchActivities = useCallback(
    async (cursor: string | null = null, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          limit: "50",
        });

        if (cursor) {
          params.append("cursor", cursor);
        }

        if (selectedType) {
          params.append("activityType", selectedType);
        }

        const response = await fetch(`/api/admin/activity-feed?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Etkileşimler alınırken bir hata oluştu");
        }

        const data = await response.json();

        if (append) {
          setActivities((prev) => [...prev, ...data.activities]);
        } else {
          setActivities(data.activities);
        }

        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedType]
  );

  useEffect(() => {
    fetchActivities();
  }, [selectedType]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchActivities(nextCursor, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, nextCursor, fetchActivities]);

  const getActivityIcon = (type: ActivityType) => {
    const activity = ACTIVITY_TYPES.find((a) => a.value === type);
    return activity ? activity.icon : Activity;
  };

  const getActivityColor = (type: ActivityType) => {
    const activity = ACTIVITY_TYPES.find((a) => a.value === type);
    return activity ? activity.color : "bg-gray-500";
  };

  const getActivityLabel = (activity: ActivityItem) => {
    switch (activity.type) {
      case "POST":
        return "bir paylaşım yaptı";
      case "LIKE":
        return "bir paylaşımı beğendi";
      case "COMMENT":
        return "bir paylaşımda yorum yaptı";
      case "SAVE":
        return "bir paylaşımı kaydetti";
      case "TEST":
        return `bir test çözdü${activity.details.testScore !== undefined ? ` (${activity.details.testScore} puan)` : ""}`;
      case "LIVE_CODING":
        return `bir live coding çözdü${activity.details.testScore !== undefined ? ` (${activity.details.testScore} puan)` : ""}`;
      case "BUG_FIX":
        return `bir bug fix çözdü${activity.details.testScore !== undefined ? ` (${activity.details.testScore} puan)` : ""}`;
      case "QUIZ":
        return `bir quiz çözdü${activity.details.testScore !== undefined ? ` (${activity.details.testScore} puan)` : ""}`;
      case "LESSON":
        return `bir dersi tamamladı${activity.details.lessonSlug ? ` (${activity.details.lessonSlug})` : ""}`;
      case "BOT_ACTIVITY":
        return `bot aktivitesi gerçekleştirdi (${activity.details.activityType || "Bilinmeyen"})`;
      default:
        return "bir aktivite gerçekleştirdi";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;

    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin/users")}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  📊 Etkileşim Akışı
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Sistemdeki tüm kullanıcı etkileşimlerini görüntüleyin
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activities.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Toplam Etkileşim
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Aktivite Tipi Filtresi
            </h3>
            {selectedType && (
              <Button
                onClick={() => setSelectedType("")}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Filtreyi Temizle
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value as ActivityType | "")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? `${type.color} text-white`
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Activities Timeline */}
        {!loading && !error && (
          <>
            {activities.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-12 text-center">
                <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Etkileşim bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedType
                    ? "Seçilen filtreye uygun etkileşim bulunmuyor."
                    : "Henüz sistemde etkileşim yok."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);

                  return (
                    <div
                      key={activity.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md shrink-0">
                          {activity.userImage ? (
                            <Image
                              src={activity.userImage}
                              alt={activity.userName || "User"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                              {activity.userName?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {activity.userName || "İsimsiz Kullanıcı"}
                                </span>
                                {activity.userIsBot && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                    <Bot className="h-3 w-3" />
                                    Bot
                                  </span>
                                )}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {getActivityLabel(activity)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {activity.userEmail}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <div
                                className={`${colorClass} p-2 rounded-lg text-white`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                            </div>
                          </div>

                          {/* Activity Details */}
                          {activity.details.postContent && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                {activity.details.postContent}
                              </p>
                            </div>
                          )}

                          {activity.details.commentContent && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {activity.details.commentContent}
                              </p>
                            </div>
                          )}

                          {activity.details.quizTitle && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {activity.details.quizTitle}
                              </p>
                            </div>
                          )}

                          {activity.type === "BOT_ACTIVITY" && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    activity.details.success
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  {activity.details.success ? "Başarılı" : "Başarısız"}
                                </span>
                                {activity.details.errorMessage && (
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    {activity.details.errorMessage}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Infinite Scroll Trigger */}
                {hasMore && (
                  <div ref={observerTarget} className="flex items-center justify-center py-8">
                    {loadingMore && (
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    )}
                  </div>
                )}

                {!hasMore && activities.length > 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Tüm etkileşimler yüklendi
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

