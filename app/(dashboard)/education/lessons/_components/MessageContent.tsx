"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTypingEffect } from "./useTypingEffect";

interface MessageContentProps {
  content: string;
  isAI?: boolean;
  className?: string;
  enableTypingEffect?: boolean;
}

export function MessageContent({ content, isAI = false, className, enableTypingEffect = true }: MessageContentProps) {
  // Use typing effect for AI messages (must be called before any early returns)
  const { displayedText, isTyping } = useTypingEffect({
    text: content || "",
    speed: isAI ? 3 : 999, // Only animate AI messages, user messages show instantly
    interval: 30, // Faster typing speed for better user experience
    enabled: isAI && enableTypingEffect && !!content,
  });

  if (!content) return null;

  // Use displayed text for rendering
  const textToRender = isAI && enableTypingEffect ? displayedText : content;

  // Clean content: Remove roadmap patterns that might be rendered as lists
  // Pattern: "1. Step 2. Step 3. Step" or similar numbered sequences
  let cleanedContent = textToRender.replace(/(\d+\.\s+[^\n]+(?:\s+\d+\.\s+[^\n]+){2,})/g, (match) => {
    // If it looks like a roadmap (3+ numbered items in sequence), remove it
    // Roadmap is already displayed in header, so we don't need it in message
    return '';
  }).trim();

  // Convert numbered lists to bullet points
  // Pattern: Lines starting with "1. ", "2. ", etc. (but not in code blocks)
  // We'll handle this in the ol component instead to preserve markdown structure

  // Format test questions: "Soru? A) Option B) Option C) Option D) Option"
  // Convert to structured HTML format
  cleanedContent = cleanedContent.replace(
    /([^:]+?)\s+([A-D]\)\s+[^A-D]+?)(?:\s+([A-D]\)\s+[^A-D]+?))(?:\s+([A-D]\)\s+[^A-D]+?))(?:\s+([A-D]\)\s+[^A-D]+?))?/g,
    (match, question, optionA, optionB, optionC, optionD) => {
      // If we have a question with options, format it nicely
      if (optionA && optionB && optionC && optionD) {
        return `**${question.trim()}**\n\n${optionA.trim()}\n${optionB.trim()}\n${optionC.trim()}\n${optionD.trim()}`;
      }
      return match;
    }
  );

  // Format answer feedback: "Doğru cevap: B) Option" or "Senin cevabın: A) Option"
  cleanedContent = cleanedContent.replace(
    /(Doğru cevap|Senin cevabın):\s*([A-D]\)\s+[^\n]+)/gi,
    (match, label, answer) => {
      const isCorrect = label.toLowerCase().includes('doğru');
      return `\n\n**${label.trim()}:** ${answer.trim()}`;
    }
  );

  return (
    <div className={cn("prose prose-sm sm:prose-sm max-w-none", className)}>
      <ReactMarkdown
        components={{
          // Paragraph styling
          p: ({ children }) => (
            <p className="mb-2 sm:mb-3 last:mb-0 leading-relaxed text-sm sm:text-base text-gray-800 dark:text-gray-200">
              {children}
            </p>
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 mt-3 sm:mt-4 first:mt-0 text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-semibold mb-2 mt-2 sm:mt-3 first:mt-0 text-gray-900 dark:text-gray-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 mt-2 sm:mt-3 first:mt-0 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          // Lists - improved to prevent roadmap rendering
          ul: ({ children }) => {
            // Check if this list contains roadmap-like items
            const childrenStr = String(children);
            if (/\d+\.\s+[^\n]+/.test(childrenStr) && childrenStr.split(/\d+\./).length > 3) {
              // Likely a roadmap, render as plain text
              return (
                <div className="mb-3 text-gray-800 dark:text-gray-200">
                  {children}
                </div>
              );
            }
            return (
              <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-0.5 sm:space-y-1 text-sm sm:text-base text-gray-800 dark:text-gray-200">
                {children}
              </ul>
            );
          },
          ol: ({ children }) => {
            // Convert all numbered lists to bullet point lists
            // This ensures consistency with the prompt requirement to avoid numbered lists
            return (
              <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-0.5 sm:space-y-1 text-sm sm:text-base text-gray-800 dark:text-gray-200">
                {children}
              </ul>
            );
          },
          li: ({ children }) => {
            // Remove any leading numbers from list items (e.g., "1. Text" -> "Text")
            const childrenStr = String(children);
            // Check if it starts with a number pattern like "1. " or "1) "
            const numberPattern = /^(\d+)[\.\)]\s*/;
            if (numberPattern.test(childrenStr)) {
              // Remove the number prefix
              const textWithoutNumber = childrenStr.replace(numberPattern, '').trim();
              return (
                <li className="ml-2 leading-relaxed text-sm sm:text-base">{textWithoutNumber}</li>
              );
            }
            return (
              <li className="ml-2 leading-relaxed text-sm sm:text-base">{children}</li>
            );
          },
          // Code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm font-mono text-gray-900 dark:text-gray-100">
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-2 sm:mb-3 rounded-lg bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 overflow-x-auto text-xs sm:text-sm">
              {children}
            </pre>
          ),
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          // Links
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-3 sm:pl-4 my-2 sm:my-3 italic text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-4 border-gray-300 dark:border-gray-700" />
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
      {isAI && isTyping && (
        <span 
          className="inline-block w-0.5 h-4 sm:h-5 bg-blue-500 dark:bg-blue-400 ml-1 animate-pulse"
        />
      )}
    </div>
  );
}


