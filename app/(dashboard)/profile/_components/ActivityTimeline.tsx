"use client";

import { FileText, Briefcase, User, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

interface Activity {
  id: string;
  type: "quiz" | "interview" | "cv" | "application";
  title: string;
  score?: number;
  date: Date | string;
  icon: string;
  timeAgo: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityIcons = {
  quiz: FileText,
  interview: MessageSquare,
  cv: User,
  application: Briefcase,
};

const activityColors = {
  quiz: "from-blue-500 to-cyan-500",
  interview: "from-purple-500 to-pink-500",
  cv: "from-green-500 to-emerald-500",
  application: "from-orange-500 to-red-500",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Henüz aktivite bulunmuyor
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Son Aktiviteler
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Son {activities.length} aktivite
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {activity.title}
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

