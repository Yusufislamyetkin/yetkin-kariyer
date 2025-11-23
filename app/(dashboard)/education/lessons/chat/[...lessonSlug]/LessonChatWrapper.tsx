"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LessonChat } from "../../_components/LessonChat";
import { RoadmapDisplay } from "../../_components/RoadmapDisplay";

type LessonChatWrapperProps = {
  lessonSlug: string;
  lessonTitle: string;
  lessonDescription?: string | null;
  backHref: string;
  courseTitle: string;
  moduleTitle: string;
};

export function LessonChatWrapper({
  lessonSlug,
  lessonTitle,
  lessonDescription,
  backHref,
  courseTitle,
  moduleTitle,
}: LessonChatWrapperProps) {
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ step: number; status: "pending" | "in_progress" | "completed" } | null>(null);

  const handleRoadmapChange = (
    newRoadmap: string | null,
    newProgress: { step: number; status: "pending" | "in_progress" | "completed" } | null
  ) => {
    setRoadmap(newRoadmap);
    setProgress(newProgress);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content - Chat (Centered between main navbar and right sidebar) */}
      <div className="flex-1 overflow-hidden min-w-0">
        <LessonChat
          lessonSlug={lessonSlug}
          lessonTitle={lessonTitle}
          lessonDescription={lessonDescription}
          onRoadmapChange={handleRoadmapChange}
        />
      </div>
      
      {/* Right Sidebar - Lesson Info & Roadmap */}
      <div className="hidden lg:flex lg:flex-col w-72 border-l border-gray-200 dark:border-gray-800 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-800/50 shrink-0">
          <div className="flex flex-col gap-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Geri Dön</span>
            </Link>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="truncate">{courseTitle}</span>
                <span className="text-gray-400">/</span>
                <span className="truncate">{moduleTitle}</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {lessonTitle}
              </h1>
              {lessonDescription && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                  {lessonDescription}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Roadmap Section - Scrollable */}
        {roadmap ? (
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-6 py-5">
              <RoadmapDisplay roadmap={roadmap} progress={progress || undefined} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center px-6 py-5 min-h-0">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ders Aşamaları
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                AI öğretmen ders aşamalarını hazırlıyor...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

