"use client";

import { useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { LiveCodingLanguage } from "@/types/live-coding";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  php: "PHP",
  typescript: "TypeScript",
  go: "Go",
  rust: "Rust",
  cpp: "C++",
  kotlin: "Kotlin",
  ruby: "Ruby",
};

const MONACO_LANGUAGE_MAP: Record<LiveCodingLanguage, string> = {
  csharp: "csharp",
  python: "python",
  javascript: "javascript",
  java: "java",
  php: "php",
  typescript: "typescript",
  go: "go",
  rust: "rust",
  cpp: "cpp",
  kotlin: "kotlin",
  ruby: "ruby",
};

interface LiveCodingEditorProps {
  taskId: string;
  languages: LiveCodingLanguage[];
  activeLanguage: LiveCodingLanguage;
  value: string;
  onChange: (code: string) => void;
  onLanguageChange: (language: LiveCodingLanguage) => void;
  readOnly?: boolean;
  height?: number | string;
  timeRemainingSeconds?: number;
  className?: string;
}

const formatSeconds = (seconds?: number) => {
  if (seconds === undefined) {
    return null;
  }

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export function LiveCodingEditor({
  taskId,
  languages,
  activeLanguage,
  value,
  onChange,
  onLanguageChange,
  readOnly = false,
  height = 400,
  timeRemainingSeconds,
  className,
}: LiveCodingEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const displayLanguages = useMemo<LiveCodingLanguage[]>(() => {
    if (languages.length === 0) {
      return ["csharp", "python", "javascript", "java", "php", "typescript", "go", "rust", "cpp", "kotlin", "ruby"];
    }
    return languages;
  }, [languages]);

  const monacoLanguage = MONACO_LANGUAGE_MAP[activeLanguage] || "javascript";
  const heightValue = typeof height === "number" ? `${height}px` : height;

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <div className={cn("bg-gray-950/80 border border-gray-800 rounded-lg shadow-inner", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          {displayLanguages.map((language) => (
            <button
              key={`${taskId}-${language}`}
              type="button"
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeLanguage === language
                  ? "bg-emerald-500 text-emerald-50 shadow-lg shadow-emerald-500/30"
                  : "bg-gray-900/70 text-gray-300 hover:bg-gray-800/80 hover:text-gray-100"
              )}
              onClick={() => onLanguageChange(language)}
              disabled={readOnly}
            >
              {LANGUAGE_LABELS[language]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {timeRemainingSeconds !== undefined && (
            <span
              className={cn(
                "font-semibold tracking-wide",
                timeRemainingSeconds <= 60 ? "text-amber-400" : "text-emerald-400"
              )}
            >
              Süre: {formatSeconds(timeRemainingSeconds)}
            </span>
          )}
        </div>
      </div>
      <Editor
        height={heightValue}
        language={monacoLanguage}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          formatOnPaste: false,
          formatOnType: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
          quickSuggestions: false,
          contextmenu: true,
          copyWithSyntaxHighlighting: false,
          domReadOnly: true,
          unicodeHighlight: {
            ambiguousCharacters: false,
            invisibleCharacters: false,
          },
        }}
      />
    </div>
  );
}
