import { Card, CardContent, CardHeader } from "@/app/components/ui/Card";

interface CourseSkeletonProps {
  animationDelay?: number;
}

export function CourseSkeleton({ animationDelay = 0 }: CourseSkeletonProps) {
  return (
    <Card
      variant="gradient"
      className="overflow-hidden animate-[fadeIn_0.6s_ease-out] rounded-3xl shadow-lg border border-slate-200/70 dark:border-slate-700/60"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


