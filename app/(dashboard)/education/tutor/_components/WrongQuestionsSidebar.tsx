"use client";

import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WrongQuestion {
  id: string;
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
  status: "not_reviewed" | "reviewed" | "understood";
  notes: string | null;
  createdAt: string;
  quizAttempt: {
    quiz: {
      title: string;
      topic: string | null;
      course: {
        field: string | null;
        subCategory: string | null;
      } | null;
    };
  };
}

interface WrongQuestionsSidebarProps {
  wrongQuestions: WrongQuestion[];
  currentQuestionIndex: number | null;
  onQuestionSelect: (index: number) => void;
  loading: boolean;
}

export function WrongQuestionsSidebar({
  wrongQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  loading,
}: WrongQuestionsSidebarProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full px-6 py-5">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (wrongQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full px-6 py-5">
        <div className="text-center space-y-2">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tüm Sorular Anlaşıldı!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Harika iş çıkardın! 🎉
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 space-y-4">
      <div className="space-y-3">
        {wrongQuestions.map((question, index) => {
          const isActive = currentQuestionIndex === index;
          const isReviewed = question.status === "reviewed";
          const isUnderstood = question.status === "understood";
          const isNotReviewed = question.status === "not_reviewed";

          return (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md"
                  : isUnderstood
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600",
                "hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Step Number */}
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : isUnderstood
                      ? "bg-green-500 text-white"
                      : isReviewed
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  )}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Status Icon */}
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : isUnderstood ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : isReviewed ? (
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isActive
                          ? "text-blue-700 dark:text-blue-300"
                          : isUnderstood
                          ? "text-green-700 dark:text-green-300"
                          : isReviewed
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      )}
                    >
                      {isActive
                        ? "Aktif"
                        : isUnderstood
                        ? "Anlaşıldı"
                        : isReviewed
                        ? "Gözden Geçirildi"
                        : "Gözden Geçirilmemiş"}
                    </span>
                  </div>

                  {/* Question Preview */}
                  <p
                    className={cn(
                      "text-sm font-medium line-clamp-2",
                      isActive
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {question.questionText.length > 60
                      ? `${question.questionText.substring(0, 60)}...`
                      : question.questionText}
                  </p>

                  {/* Topic Info */}
                  {question.quizAttempt.quiz.topic && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {question.quizAttempt.quiz.topic}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">İlerleme</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {wrongQuestions.filter((q) => q.status === "understood").length} / {wrongQuestions.length} anlaşıldı
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${wrongQuestions.length > 0 ? (wrongQuestions.filter((q) => q.status === "understood").length / wrongQuestions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

