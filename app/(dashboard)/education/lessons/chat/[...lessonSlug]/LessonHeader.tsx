"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type LessonHeaderProps = {
  backHref: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonDescription?: string | null;
};

export function LessonHeader({
  backHref,
  courseTitle,
  moduleTitle,
  lessonTitle,
  lessonDescription,
}: LessonHeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 md:px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Geri</span>
        </Link>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="truncate">{courseTitle}</span>
          <span className="text-gray-400">/</span>
          <span className="truncate">{moduleTitle}</span>
        </div>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {lessonTitle}
          </h1>
          {lessonDescription && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
              {lessonDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

