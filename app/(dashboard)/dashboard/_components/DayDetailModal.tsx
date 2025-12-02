"use client";

import { X, Calendar, Target, BookOpen, MessageCircle, Users, Check, XCircle, CheckCircle2 } from "lucide-react";

interface DayTaskStatus {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
  tasks: {
    login: boolean;
    testSolved: boolean;
    topicCompleted: boolean;
    socialInteraction: boolean;
    communityContribution: boolean;
  };
  allTasksCompleted: boolean;
  taskDetails?: {
    login?: { completedAt: string | null };
    testSolved?: { completedAt: string | null; count: number };
    topicCompleted?: { completedAt: string | null; count: number };
    socialInteraction?: { completedAt: string | null; count: number };
    communityContribution?: { completedAt: string | null; count: number };
  };
}

interface DayDetailModalProps {
  day: DayTaskStatus;
  onClose: () => void;
}

export function DayDetailModal({ day, onClose }: DayDetailModalProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Tamamlanmadı";
    const date = new Date(dateStr);
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tasks = [
    {
      key: "login",
      name: "Giriş",
      icon: Calendar,
      completed: day.tasks.login,
      details: day.taskDetails?.login,
    },
    {
      key: "testSolved",
      name: "Test Çözme",
      icon: Target,
      completed: day.tasks.testSolved,
      details: day.taskDetails?.testSolved,
    },
    {
      key: "topicCompleted",
      name: "Konu Tamamlama",
      icon: BookOpen,
      completed: day.tasks.topicCompleted,
      details: day.taskDetails?.topicCompleted,
    },
    {
      key: "socialInteraction",
      name: "Sosyal Etkileşim",
      icon: MessageCircle,
      completed: day.tasks.socialInteraction,
      details: day.taskDetails?.socialInteraction,
    },
    {
      key: "communityContribution",
      name: "Topluluğa Katkı",
      icon: Users,
      completed: day.tasks.communityContribution,
      details: day.taskDetails?.communityContribution,
    },
  ];

  // Calculate how many tasks are completed
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasksCount = tasks.length;
  const hasSomeTasksCompleted = completedTasksCount > 0;
  const hasNoTasksCompleted = completedTasksCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1d1d1d] rounded-lg w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {day.isToday ? "Bugün" : `${day.dayName} ${day.dayNumber}`} - Görev Detayları
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Overall Status */}
          <div
            className={`p-4 rounded-lg border-2 ${
              day.allTasksCompleted
                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                : hasSomeTasksCompleted && !day.isToday && !day.isFuture
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {day.allTasksCompleted ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : hasSomeTasksCompleted && !day.isToday && !day.isFuture ? (
                <CheckCircle2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
              <span
                className={`font-semibold ${
                  day.allTasksCompleted
                    ? "text-green-700 dark:text-green-300"
                    : hasSomeTasksCompleted && !day.isToday && !day.isFuture
                    ? "text-yellow-700 dark:text-yellow-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {day.allTasksCompleted
                  ? "Tüm görevler tamamlandı! ✓"
                  : hasSomeTasksCompleted && !day.isToday && !day.isFuture
                  ? `Kısmen tamamlandı (${completedTasksCount}/${totalTasksCount})`
                  : hasNoTasksCompleted && !day.isToday && !day.isFuture
                  ? "Tüm görevler başarısız"
                  : "Tüm görevler henüz tamamlanmadı"}
              </span>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Görevler:</h3>
            {tasks.map((task) => {
              const Icon = task.icon;
              const details = task.details as any;
              const count = details?.count || 0;

              return (
                <div
                  key={task.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
                    task.completed
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      task.completed
                        ? "bg-green-100 dark:bg-green-900/40"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        task.completed
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          task.completed
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {task.name}
                      </span>
                      {task.completed ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    {task.completed && details?.completedAt && (
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <p>Tamamlanma: {formatDate(details.completedAt)}</p>
                        {count > 0 && (
                          <p className="mt-0.5">
                            {task.key === "testSolved" && `${count} test çözüldü`}
                            {task.key === "topicCompleted" && `${count} konu tamamlandı`}
                            {task.key === "socialInteraction" && `${count} sosyal etkileşim yapıldı`}
                            {task.key === "communityContribution" && `${count} topluluk mesajı gönderildi`}
                          </p>
                        )}
                      </div>
                    )}
                    {!task.completed && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {!day.isToday && !day.isFuture
                          ? "Görev Başarısız"
                          : "Bu görev henüz tamamlanmadı"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

