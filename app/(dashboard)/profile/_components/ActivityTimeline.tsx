"use client";

import { FileText, Briefcase, User, MessageSquare, Clock, BookOpen, Code, Trophy, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import Image from "next/image";
import Link from "next/link";

interface Activity {
  id: string;
  type: "lesson" | "quiz" | "live-coding" | "hackathon" | "cv" | "application" | "badge" | "interview";
  title: string;
  score?: number;
  date: Date | string;
  icon: string;
  timeAgo: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string | null;
  } | null;
}

interface ActivityTimelineProps {
  activities: Activity[];
  title?: string;
  headerContent?: React.ReactNode;
  loadingMore?: boolean;
  hideHeaderIcon?: boolean;
}

const activityIcons = {
  lesson: BookOpen,
  quiz: FileText,
  "live-coding": Code,
  hackathon: Trophy,
  cv: User,
  application: Briefcase,
  badge: Award,
  interview: MessageSquare,
};

const activityColors = {
  lesson: "from-blue-500 to-indigo-500",
  quiz: "from-blue-500 to-cyan-500",
  "live-coding": "from-green-500 to-emerald-500",
  hackathon: "from-orange-500 to-red-500",
  cv: "from-green-500 to-emerald-500",
  application: "from-orange-500 to-red-500",
  badge: "from-yellow-500 to-amber-500",
  interview: "from-purple-500 to-pink-500",
};

export function ActivityTimeline({ activities, title = "Son Aktiviteler", headerContent, loadingMore = false, hideHeaderIcon = false }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            {!hideHeaderIcon && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-pink-500/30 flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Henüz aktivite bulunmuyor
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                İlk aktiviteniz burada görünecek
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="relative overflow-hidden tech-card-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!hideHeaderIcon && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Son {activities.length} aktivite
              </p>
            </div>
          </div>
          {headerContent && (
            <div className="flex items-center gap-2">
              {headerContent}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type] || "from-gray-500 to-gray-600";
              // Check if icon is an emoji (contains emoji characters)
              const isEmoji = activity.icon && /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(activity.icon);
              const profileUrl = activity.userId ? `/profile/${activity.userId}` : null;

              // Helper function to extract description from title when user exists
              const getActivityDescription = (title: string, userName: string | null): string => {
                if (!userName) return title;
                
                // Check if title starts with the username (for non-own activities)
                const trimmedTitle = title.trim();
                const trimmedUserName = userName.trim();
                
                if (trimmedTitle.startsWith(trimmedUserName)) {
                  // Remove username and any following space from the beginning
                  return trimmedTitle.substring(trimmedUserName.length).trim();
                }
                
                // If title doesn't start with username, return as is (for own activities)
                return title;
              };

              const activityDescription = activity.user 
                ? getActivityDescription(activity.title, activity.user.name)
                : activity.title;

              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline dot - Profile Image */}
                  <div className="relative z-10 flex-shrink-0">
                    {profileUrl ? (
                      <Link href={profileUrl} className="block">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all">
                          {activity.user?.profileImage ? (
                            <Image
                              src={activity.user.profileImage}
                              alt={activity.user.name || "User"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                              {(activity.user?.name || "U")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900`}
                      >
                        {isEmoji ? (
                          <span className="text-2xl">{activity.icon}</span>
                        ) : (
                          Icon && <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 pb-6">
                    {profileUrl ? (
                      <Link href={profileUrl} className="block">
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {activity.user ? (
                                  <>
                                    <span className="font-bold">{activity.user.name}</span>
                                    <span> : </span>
                                    <span>{activityDescription}</span>
                                  </>
                                ) : (
                                  activity.title
                                )}
                              </p>
                              {activity.score !== undefined && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Skor: {activity.score}%
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{activity.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {activity.user ? (
                                <>
                                  <span className="font-bold">{activity.user.name}</span>
                                  <span> : </span>
                                  <span>
                                    {activity.type === "badge" ? (
                                      activityDescription
                                    ) : (
                                      <>
                                        <span className="mr-2">{activity.icon}</span>
                                        {activityDescription}
                                      </>
                                    )}
                                  </span>
                                </>
                              ) : (
                                activity.type === "badge" ? (
                                  activity.title
                                ) : (
                                  <>
                                    <span className="mr-2">{activity.icon}</span>
                                    {activity.title}
                                  </>
                                )
                              )}
                            </p>
                            {activity.score !== undefined && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Skor: {activity.score}%
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{activity.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {loadingMore && (
              <div className="relative flex gap-4 items-center justify-center py-6">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Daha fazla yükleniyor...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

