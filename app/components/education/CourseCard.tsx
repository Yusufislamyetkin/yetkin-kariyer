import Link from "next/link";
import { BookOpen, Layers, Sparkles, Clock, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

export interface CourseSummary {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  field: string | null;
  subCategory: string | null;
  difficulty: string;
  quizzes: { id: string; title: string; topic: string | null }[];
  topic?: string | null;
  topicContent?: string | null;
}

const difficultyStyles: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

interface CourseCardProps {
  course: CourseSummary;
  animationDelay?: number;
}

export function CourseCard({ course, animationDelay = 0 }: CourseCardProps) {
  const { id, title, description, category, field, subCategory, difficulty, quizzes } = course;

  const topics = Array.from(
    new Set(quizzes.map((quiz) => quiz.topic).filter((topic): topic is string => Boolean(topic)))
  ).slice(0, 3);

  return (
    <Link href={`/education/courses/${id}`} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-blue-500 rounded-3xl">
      <Card
        variant="gradient"
        hover
        className="relative overflow-hidden backdrop-blur-xl shadow-lg border border-slate-200/70 dark:border-slate-700/60 transition-transform duration-300 group-hover:translate-y-[-4px] group-hover:shadow-2xl"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">
                  {category && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1">
                      <Layers className="h-3.5 w-3.5" />
                      {category}
                    </span>
                  )}
                  {field && (
                    <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200 px-3 py-1">
                      {field}
                    </span>
                  )}
                  {subCategory && (
                    <span className="rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200 px-3 py-1">
                      {subCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${difficultyStyles[difficulty.toLowerCase()] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"}`}
            >
              {difficulty}
            </span>
          </div>
          {description && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="relative z-10 space-y-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Esnek öğrenme planı</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Award className="h-4 w-4 text-amber-500" />
              <span>{quizzes.length} değerlendirme</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Güncel içerik</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Modüler öğrenme yolu</span>
            </div>
          </div>
          {topics.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Öne çıkan konular
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 text-xs font-medium px-3 py-1"
                  >
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}


