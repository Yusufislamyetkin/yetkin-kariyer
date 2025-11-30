import { BookOpen, ExternalLink, FileText, Video, Code } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Resource {
  title: string;
  type?: string;
  description?: string;
  link?: string;
}

interface CareerPlanResourceCardProps {
  resource: Resource;
}

/**
 * Checks if a link is a placeholder text that should be ignored
 */
function isPlaceholderLink(link: string | undefined): boolean {
  if (!link) return false;
  
  const normalized = link.toLowerCase().trim();
  const placeholderTexts = [
    "platform içi link",
    "platform içi link (varsa)",
    "link yoksa",
    "varsa",
    "platform içi",
    "link (varsa)",
    "varsa link",
  ];

  return placeholderTexts.some(
    (placeholder) => normalized.includes(placeholder.toLowerCase())
  );
}

/**
 * Normalizes and validates resource links to ensure they point to correct routes
 */
function normalizeResourceLink(link: string | undefined, resource: Resource): string | null {
  // Check if link is a placeholder - treat as no link
  if (isPlaceholderLink(link)) {
    const resourceType = resource.type?.toLowerCase();
    if (resourceType === "kurs" || resourceType === "course") {
      // Return null to trigger course search
      return null;
    }
    return null;
  }

  if (!link) {
    // If no link but it's a course type, redirect to search page
    const resourceType = resource.type?.toLowerCase();
    if (resourceType === "kurs" || resourceType === "course") {
      return `/education/courses?search=${encodeURIComponent(resource.title)}`;
    }
    return null;
  }

  // Remove leading/trailing whitespace
  let normalizedLink = link.trim();

  // If it's already a full URL (http/https), return as is
  if (normalizedLink.startsWith("http://") || normalizedLink.startsWith("https://")) {
    return normalizedLink;
  }

  // Remove leading slash if present for easier parsing
  if (normalizedLink.startsWith("/")) {
    normalizedLink = normalizedLink.substring(1);
  }

  // Handle different link formats
  const resourceType = resource.type?.toLowerCase();

  // If link starts with "courses" or "dashboard/courses", normalize to education/courses
  if (normalizedLink.startsWith("courses/") || normalizedLink.startsWith("dashboard/courses/")) {
    const courseId = normalizedLink.split("/").pop();
    if (courseId) {
      return `/education/courses/${courseId}`;
    }
  }

  // If link starts with "education/courses", ensure it has the leading slash
  if (normalizedLink.startsWith("education/courses")) {
    return `/${normalizedLink}`;
  }

  // If link is just an ID (alphanumeric, possibly with hyphens), treat as course ID
  if (/^[a-zA-Z0-9_-]+$/.test(normalizedLink) && (resourceType === "kurs" || resourceType === "course")) {
    return `/education/courses/${normalizedLink}`;
  }

  // If link contains "modules" or "lessons", try to normalize
  if (normalizedLink.includes("modules") || normalizedLink.includes("lessons")) {
    // Extract course ID and module ID if possible
    const parts = normalizedLink.split("/");
    const courseIndex = parts.findIndex(p => p === "courses" || p === "course");
    if (courseIndex >= 0 && parts[courseIndex + 1]) {
      const courseId = parts[courseIndex + 1];
      const moduleIndex = parts.findIndex(p => p === "modules" || p === "module");
      if (moduleIndex >= 0 && parts[moduleIndex + 1]) {
        const moduleId = parts[moduleIndex + 1];
        return `/education/courses/${courseId}/modules/${moduleId}`;
      }
      return `/education/courses/${courseId}`;
    }
  }

  // If it looks like a valid path but doesn't start with /, add it
  if (normalizedLink && !normalizedLink.startsWith("/")) {
    normalizedLink = `/${normalizedLink}`;
  }

  // If still no valid pattern, redirect to search page for course types
  if (resourceType === "kurs" || resourceType === "course") {
    return `/education/courses?search=${encodeURIComponent(resource.title)}`;
  }

  // For other types, try to use the link as is (with leading slash)
  return normalizedLink.startsWith("/") ? normalizedLink : `/${normalizedLink}`;
}

export function CareerPlanResourceCard({ resource }: CareerPlanResourceCardProps) {
  const [resolvedLink, setResolvedLink] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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

  // Check if we need to search for a course
  useEffect(() => {
    const normalizedLink = normalizeResourceLink(resource.link, resource);
    
    // If we already have a valid link, use it
    if (normalizedLink) {
      setResolvedLink(normalizedLink);
      return;
    }

    // If no link or placeholder, and it's a course type, try to find the course
    const resourceType = resource.type?.toLowerCase();
    if ((resourceType === "kurs" || resourceType === "course") && resource.title) {
      setIsSearching(true);
      
      // Search for course by title
      fetch(`/api/career/find-course?title=${encodeURIComponent(resource.title)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.found && data.courseId) {
            setResolvedLink(`/education/courses/${data.courseId}`);
          } else {
            // Fallback to search page
            setResolvedLink(`/education/courses?search=${encodeURIComponent(resource.title)}`);
          }
        })
        .catch((error) => {
          console.error("Error finding course:", error);
          // Fallback to search page
          setResolvedLink(`/education/courses?search=${encodeURIComponent(resource.title)}`);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setResolvedLink(normalizedLink);
    }
  }, [resource.link, resource.title, resource.type]);

  const normalizedLink = resolvedLink;
  const hasLink = !!normalizedLink;

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
            {hasLink && (
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

  if (hasLink) {
    // For external links, use regular anchor tag
    if (normalizedLink.startsWith("http://") || normalizedLink.startsWith("https://")) {
      return (
        <a href={normalizedLink} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      );
    }
    
    // For internal links, use Next.js Link
    return (
      <Link href={normalizedLink} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

