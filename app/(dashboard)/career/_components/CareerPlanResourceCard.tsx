import { BookOpen, ExternalLink, FileText, Video, Code } from "lucide-react";
import Link from "next/link";

interface Resource {
  title: string;
  type?: string;
  description?: string;
  link?: string;
}

interface CareerPlanResourceCardProps {
  resource: Resource;
}

export function CareerPlanResourceCard({ resource }: CareerPlanResourceCardProps) {
  const getIcon = () => {
    switch (resource.type?.toLowerCase()) {
      case "kurs":
      case "course":
        return <BookOpen className="w-5 h-5" />;
      case "modül":
      case "module":
        return <FileText className="w-5 h-5" />;
      case "ders":
      case "lesson":
        return <Video className="w-5 h-5" />;
      case "pratik":
      case "practice":
        return <Code className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const content = (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {resource.title}
            </h4>
            {resource.link && (
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400" />
            )}
          </div>
          {resource.type && (
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {resource.type}
            </span>
          )}
          {resource.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {resource.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (resource.link) {
    return (
      <Link href={resource.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

