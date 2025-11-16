"use client";

import { useState } from "react";
import { Copy, Check, FileCode } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const languageLabel = language.toLowerCase();
  const displayLanguage =
    languageLabel === "csharp"
      ? "C#"
      : languageLabel === "javascript"
      ? "JavaScript"
      : languageLabel === "java"
      ? "Java"
      : languageLabel === "python"
      ? "Python"
      : language.toUpperCase();

  // Format code to preserve line breaks and handle \n characters
  const formattedCode = code.replace(/\\n/g, '\n').trim();

  // Count lines for better formatting
  const lines = formattedCode.split('\n');
  const lineCount = lines.length;

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileCode className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {title}
              </span>
            )}
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium flex-shrink-0">
              {displayLanguage}
            </span>
            {lineCount > 1 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {lineCount} satır
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Kopyala</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Content - Editor Style */}
      <div className="relative bg-gray-950 dark:bg-gray-950">
        {/* Line Numbers */}
        {lineCount > 1 && (
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-900/50 dark:bg-gray-900 border-r border-gray-800 dark:border-gray-800 text-right text-xs text-gray-500 dark:text-gray-600 font-mono select-none py-3">
            {lines.map((_, index) => (
              <div key={index} className="pr-2 leading-relaxed">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Code */}
        <pre
          className={cn(
            "overflow-x-auto p-4 text-gray-100 text-sm leading-relaxed font-mono",
            lineCount > 1 && "pl-14" // Add left padding when line numbers are shown
          )}
        >
          <code className="block whitespace-pre">{formattedCode}</code>
        </pre>
      </div>
    </div>
  );
}

