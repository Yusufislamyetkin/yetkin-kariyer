"use client";

import { BookOpen, CheckCircle, Circle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

interface LearningPath {
  id: string;
  courses: any;
  progress: any;
  createdAt: Date | string;
}

interface LearningPathSectionProps {
  learningPath: LearningPath | null;
}

export function LearningPathSection({ learningPath }: LearningPathSectionProps) {
  if (!learningPath) {
    return (
      <Card variant="glass" className="relative overflow-hidden">
        <CardContent className="py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Henüz öğrenme yolunuz yok
          </p>
          <Link href="/education">
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Öğrenme Yolu Oluştur
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const courses = learningPath.courses || [];
  const progress = learningPath.progress || {};

  const calculateProgress = () => {
    if (!courses || courses.length === 0) return 0;
    const completed = Object.values(progress).filter((p: any) => p?.completed).length;
    return Math.round((completed / courses.length) * 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Öğrenme Yolu
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {courses.length} kurs
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              İlerleme
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              %{progressPercentage}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Courses List */}
        {courses.length > 0 ? (
          <div className="space-y-3">
            {courses.slice(0, 5).map((course: any, index: number) => {
              const courseProgress = progress[course.id] || {};
              const isCompleted = courseProgress.completed || false;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {course.title || course.name || `Kurs ${index + 1}`}
                    </p>
                    {courseProgress.progress && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        İlerleme: %{Math.round(courseProgress.progress)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {courses.length > 5 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                +{courses.length - 5} kurs daha
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Henüz kurs eklenmemiş
          </p>
        )}

        <div className="mt-6">
          <Link href="/education">
            <Button variant="outline" className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Öğrenme Yolunu Görüntüle
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

