import Link from "next/link";
import { ReactNode } from "react";

/**
 * Converts URLs in text content to clickable links
 * @param content - The text content that may contain URLs
 * @param linkClassName - Optional CSS class for the link elements
 * @returns ReactNode with URLs converted to clickable links
 */
export function renderContentWithLinks(
  content: string,
  linkClassName?: string
): ReactNode {
  // Regex to match URLs:
  // 1. Full URLs (http:// or https://)
  // 2. Relative URLs starting with / followed by path-like characters
  const urlRegex = /(https?:\/\/[^\s]+|\/[a-zA-Z0-9\/?=&_-][^\s]*)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = urlRegex.exec(content)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add the URL as a clickable link
    const url = match[0];
    const isExternal = url.startsWith("http://") || url.startsWith("https://");
    
    parts.push(
      <Link
        key={`link-${keyCounter++}`}
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={linkClassName || "text-blue-600 dark:text-blue-400 hover:underline"}
      >
        {url}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last URL
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : content;
}

