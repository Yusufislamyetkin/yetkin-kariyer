"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type * as MonacoEditorType from "@monaco-editor/react";
import type { editor as MonacoEditor, IDisposable } from "monaco-editor";
import { Play, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

const Monaco = dynamic<MonacoEditorType.EditorProps>(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-900/70 text-gray-200 text-sm rounded-md border border-gray-800">
      Kod editörü yükleniyor...
    </div>
  ),
});

const LANGUAGE_LABELS: Record<string, string> = {
  csharp: "C#",
  c: "C",
  cpp: "C++",
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  java: "Java",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
};

const MONACO_LANGUAGE_IDS: Record<string, string> = {
  csharp: "csharp",
  c: "c",
  cpp: "cpp",
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
};

interface LessonCodeEditorProps {
  id: string;
  language: string;
  code: string;
  editable?: boolean;
  runnable?: boolean;
  readonly?: boolean;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  className?: string;
  lessonSlug?: string;
}

export function LessonCodeEditor({
  id,
  language,
  code: initialCode,
  editable = false,
  runnable = false,
  readonly = true,
  onCodeChange,
  onRun,
  className,
  lessonSlug,
}: LessonCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const disposablesRef = useRef<IDisposable[]>([]);

  const displayLanguage = LANGUAGE_LABELS[language.toLowerCase()] || language.toUpperCase();
  const monacoLanguage = MONACO_LANGUAGE_IDS[language.toLowerCase()] || language.toLowerCase();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    return () => {
      disposablesRef.current.forEach((disposable) => {
        try {
          disposable.dispose();
        } catch {
          // no-op
        }
      });
      disposablesRef.current = [];
    };
  }, []);

  const handleMount: MonacoEditorType.EditorProps["onMount"] = (editor) => {
    editorRef.current = editor;
    editor.updateOptions({
      readOnly: readonly || !editable,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      scrollBeyondLastLine: true,
      automaticLayout: true,
      renderLineHighlight: "line",
      wordWrap: "on",
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? "";
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleRun = async () => {
    if (!runnable || !onRun) return;
    
    setIsRunning(true);
    try {
      await onRun(code);
    } finally {
      setIsRunning(false);
    }
  };

  const isReadOnly = readonly || !editable;

  return (
    <div className={cn("bg-gray-950/80 border border-gray-800 rounded-lg shadow-inner overflow-hidden relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
            {displayLanguage}
          </span>
          {editable && !readonly && (
            <span className="text-xs text-gray-400">Düzenlenebilir</span>
          )}
          {readonly && (
            <span className="text-xs text-gray-400">Salt okunur</span>
          )}
        </div>
        {runnable && onRun && (
          <Button
            onClick={handleRun}
            disabled={isRunning}
            size="sm"
            variant="gradient"
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Çalıştırılıyor...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Çalıştır
              </>
            )}
          </Button>
        )}
      </div>

      {/* Editor */}
      <div className="relative" style={{ minWidth: 0, width: "100%" }}>
        <Monaco
          key={`${id}-${monacoLanguage}`}
          theme="vs-dark"
          language={monacoLanguage}
          value={code}
          onChange={handleCodeChange}
          onMount={handleMount}
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: true,
            renderLineHighlight: "line",
            occurrencesHighlight: "off",
            selectionHighlight: false,
            wordWrap: "on",
            automaticLayout: true,
          }}
          height={300}
        />
        {lessonSlug && (
          <Link
            href={`/education/lessons/chat${lessonSlug.replace(/^\/education\/lessons/, "")}`}
            className="absolute bottom-4 left-4 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group"
            title="AI Öğretmen ile konuş"
          >
            <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}

