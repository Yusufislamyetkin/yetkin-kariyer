"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  Code,
  Award,
  Briefcase,
  Users,
  Target,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import type { RoadmapStep } from "@/lib/services/career/roadmap-steps";

interface StepProgress {
  stepId: string;
  completed: boolean;
  progress?: number;
  details?: any;
}

interface RoadmapStepNodeProps {
  step: RoadmapStep;
  progress?: StepProgress;
  level?: number; // Tree level for indentation
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const stepIcons: Record<RoadmapStep["type"], typeof BookOpen> = {
  course: BookOpen,
  test: FileText,
  live_coding: Code,
  badge: Award,
  cv: Briefcase,
  freelancer: Users,
  hackathon: Target,
  job_application: Briefcase,
};

const stepColors: Record<RoadmapStep["type"], string> = {
  course: "text-blue-600 dark:text-blue-400",
  test: "text-purple-600 dark:text-purple-400",
  live_coding: "text-green-600 dark:text-green-400",
  badge: "text-yellow-600 dark:text-yellow-400",
  cv: "text-indigo-600 dark:text-indigo-400",
  freelancer: "text-pink-600 dark:text-pink-400",
  hackathon: "text-orange-600 dark:text-orange-400",
  job_application: "text-red-600 dark:text-red-400",
};

export function RoadmapStepNode({
  step,
  progress,
  level = 0,
  hasChildren = false,
  isExpanded = false,
  onToggle,
}: RoadmapStepNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = stepIcons[step.type];
  const colorClass = stepColors[step.type];
  const isCompleted = progress?.completed ?? false;
  const progressPercent = progress?.progress ?? 0;
  const isLocked = step.dependsOn && step.dependsOn.length > 0 && !isCompleted;

  // Calculate indentation based on level
  const indentClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : "";

  const handleClick = () => {
    if (hasChildren && onToggle) {
      onToggle();
    }
  };

  const content = (
    <Card
      variant="elevated"
      className={`relative overflow-hidden transition-all duration-200 ${
        isCompleted
          ? "border-green-500 bg-green-50/50 dark:bg-green-900/10"
          : isLocked
          ? "border-gray-300 bg-gray-50 dark:bg-gray-800/50 opacity-60"
          : "border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600"
      } ${hasChildren ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : isLocked ? (
              <Lock className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            ) : (
              <Circle className="h-6 w-6 text-blue-400 dark:text-blue-500" />
            )}
          </div>

          {/* Step Icon */}
          <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-sm sm:text-base ${
                    isCompleted
                      ? "text-green-800 dark:text-green-300 line-through"
                      : isLocked
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      isCompleted
                        ? "text-green-700 dark:text-green-400"
                        : isLocked
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                )}
              </div>

              {/* Expand/Collapse Icon */}
              {hasChildren && (
                <button
                  onClick={handleClick}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {!isCompleted && progressPercent > 0 && (
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    İlerleme
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    %{progressPercent}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step Details */}
            {progress?.details && !isCompleted && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {progress.details.completedLessons !== undefined &&
                  progress.details.totalLessons !== undefined && (
                    <span>
                      {progress.details.completedLessons} /{" "}
                      {progress.details.totalLessons} ders tamamlandı
                    </span>
                  )}
                {progress.details.completedTests !== undefined &&
                  progress.details.totalTests !== undefined && (
                    <span>
                      {progress.details.completedTests} /{" "}
                      {progress.details.totalTests} test tamamlandı
                    </span>
                  )}
                {progress.details.completedCases !== undefined &&
                  progress.details.totalCases !== undefined && (
                    <span>
                      {progress.details.completedCases} /{" "}
                      {progress.details.totalCases} case tamamlandı
                    </span>
                  )}
                {progress.details.badgeCount !== undefined && (
                  <span>{progress.details.badgeCount} rozet kazanıldı</span>
                )}
                {progress.details.cvCount !== undefined && (
                  <span>{progress.details.cvCount} CV oluşturuldu</span>
                )}
                {progress.details.projectCount !== undefined && (
                  <span>{progress.details.projectCount} proje</span>
                )}
                {progress.details.participationCount !== undefined && (
                  <span>{progress.details.participationCount} hackathon</span>
                )}
                {progress.details.applicationCount !== undefined && (
                  <span>{progress.details.applicationCount} başvuru</span>
                )}
              </div>
            )}

            {/* Action Link */}
            {step.link && !isLocked && (
              <div className="mt-3">
                <Link
                  href={step.link}
                  className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
                    isCompleted
                      ? "text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  }`}
                  onClick={(e) => {
                    // Don't trigger expand/collapse when clicking link
                    e.stopPropagation();
                  }}
                >
                  <span>
                    {step.type === "course"
                      ? "Kursa Git"
                      : step.type === "test"
                      ? "Testlere Git"
                      : step.type === "live_coding"
                      ? "Canlı Kodlamaya Git"
                      : step.type === "badge"
                      ? "Rozetlere Git"
                      : step.type === "cv"
                      ? "CV Oluştur"
                      : step.type === "freelancer"
                      ? "Projelere Git"
                      : step.type === "hackathon"
                      ? "Hackathonlara Git"
                      : "İş İlanlarına Git"}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Locked Message */}
            {isLocked && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                Önceki adımları tamamlamanız gerekiyor
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      {isHovered && !isCompleted && !isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
      )}
    </Card>
  );

  // If step has a link and is not locked, wrap in Link
  if (step.link && !isLocked && !hasChildren) {
    return (
      <div className={indentClass}>
        <Link href={step.link} className="block">
          {content}
        </Link>
      </div>
    );
  }

  return (
    <div className={indentClass} onClick={hasChildren ? handleClick : undefined}>
      {content}
    </div>
  );
}

