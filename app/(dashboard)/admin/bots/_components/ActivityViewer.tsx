"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, CheckCircle2, XCircle, Clock, Filter, RefreshCw } from "lucide-react";
import Image from "next/image";

interface Activity {
  id: string;
  userId: string;
  botName: string;
  botEmail: string;
  botProfileImage: string | null;
  activityType: string;
  targetId: string | null;
  targetTitle: string | null;
  success: boolean;
  errorMessage: string | null;
  executedAt: string;
  details: any;
}

const ACTIVITY_CATEGORIES = {
  all: "Tümü",
  linkedin: "LinkedIn",
  application: "Başvurular",
  education: "Eğitim",
  other: "Diğer",
};

export function ActivityViewer() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActivityType, setSelectedActivityType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchActivities(1);
  }, [selectedCategory, selectedActivityType]);

  const fetchActivities = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        offset: ((pageNum - 1) * 50).toString(),
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (selectedActivityType !== "all") {
        params.append("activityType", selectedActivityType);
      }

      const response = await fetch(`/api/admin/bots/activities?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Aktiviteler alınırken bir hata oluştu");
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setActivities(data.activities || []);
      } else {
        setActivities((prev) => [...prev, ...(data.activities || [])]);
      }
      
      setHasMore(data.hasMore || false);
      setPage(pageNum);
    } catch (err: any) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      POST: "📝",
      LIKE: "👍",
      COMMENT: "💬",
      HACKATHON_APPLICATION: "🚀",
      FREELANCER_BID: "💼",
      JOB_APPLICATION: "📋",
      TEST: "📊",
      LIVE_CODING: "💻",
      LESSON: "📚",
    };
    return icons[type] || "🔹";
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      POST: "LinkedIn Post",
      LIKE: "Beğeni",
      COMMENT: "Yorum",
      HACKATHON_APPLICATION: "Hackathon Başvurusu",
      FREELANCER_BID: "Freelancer Başvurusu",
      JOB_APPLICATION: "İş İlanı Başvurusu",
      TEST: "Test Çözme",
      LIVE_CODING: "Canlı Kodlama",
      LESSON: "Ders Tamamlama",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Bot Aktiviteleri
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerçekleşen ve planlanan bot aktivitelerini görüntüleyin
          </p>
        </div>
        <Button
          onClick={() => fetchActivities(1)}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori:</span>
          </div>
          {Object.entries(ACTIVITY_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      {loading && activities.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory !== "all" ? "Bu kategoride aktivite bulunmuyor" : "Henüz aktivite bulunmuyor"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                {activity.botProfileImage ? (
                  <Image
                    src={activity.botProfileImage}
                    alt={activity.botName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {activity.botName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getActivityIcon(activity.activityType)}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {activity.botName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.success
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {getActivityLabel(activity.activityType)}
                  </span>
                  {activity.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                {activity.targetTitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                    {activity.targetTitle}
                  </p>
                )}
                {activity.errorMessage && (
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                    Hata: {activity.errorMessage}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(activity.executedAt).toLocaleString("tr-TR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchActivities(page + 1)}
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              "Daha Fazla Yükle"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
