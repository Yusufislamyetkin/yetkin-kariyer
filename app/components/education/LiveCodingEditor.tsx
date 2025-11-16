"use client";

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type * as MonacoEditorType from "@monaco-editor/react";
import type { editor as MonacoEditor, IDisposable } from "monaco-editor";
import { LiveCodingLanguage } from "@/types/live-coding";
import { cn } from "@/lib/utils";

const Monaco = dynamic<MonacoEditorType.EditorProps>(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-900/70 text-gray-200 text-sm rounded-md border border-gray-800">
      Kod editörü yükleniyor...
    </div>
  ),
});

const LANGUAGE_LABELS: Record<LiveCodingLanguage, string> = {
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
};

const MONACO_LANGUAGE_IDS: Record<LiveCodingLanguage, string> = {
  csharp: "csharp",
  python: "python",
  javascript: "javascript",
  java: "java",
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
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const disposablesRef = useRef<IDisposable[]>([]);

  const displayLanguages = useMemo<LiveCodingLanguage[]>(() => {
    if (languages.length === 0) {
      return ["csharp", "python", "javascript", "java"];
    }

    return languages;
  }, [languages]);

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

  const handleMount: MonacoEditorType.EditorProps["onMount"] = (editor, monaco) => {
    editorRef.current = editor;

    editor.updateOptions({
      readOnly,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: "line",
      contextmenu: false,
      quickSuggestions: false,
    });

    disposablesRef.current.push(
      editor.onKeyDown((event) => {
        if ((event.ctrlKey || event.metaKey) && ["KeyC", "KeyV", "KeyX", "KeyA"].includes(event.code)) {
          event.preventDefault();
        }

        if (event.shiftKey && event.code === "Insert") {
          event.preventDefault();
        }
      })
    );

    const domNode = editor.getDomNode();
    if (domNode) {
      const preventClipboardEvent = (event: ClipboardEvent) => {
        event.preventDefault();
      };

      const preventContextMenu = (event: MouseEvent) => {
        event.preventDefault();
      };

      domNode.addEventListener("copy", preventClipboardEvent, true);
      domNode.addEventListener("cut", preventClipboardEvent, true);
      domNode.addEventListener("paste", preventClipboardEvent, true);
      domNode.addEventListener("contextmenu", preventContextMenu, true);

      disposablesRef.current.push({
        dispose: () => {
          domNode.removeEventListener("copy", preventClipboardEvent, true);
          domNode.removeEventListener("cut", preventClipboardEvent, true);
          domNode.removeEventListener("paste", preventClipboardEvent, true);
          domNode.removeEventListener("contextmenu", preventContextMenu, true);
        },
      });
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

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
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            Kopyalama / yapıştırma devre dışı
          </span>
        </div>
      </div>
      <Monaco
        key={`${taskId}-${activeLanguage}`}
        theme="vs-dark"
        language={MONACO_LANGUAGE_IDS[activeLanguage]}
        value={value}
        onChange={(val) => onChange(val ?? "")}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          renderLineHighlight: "line",
          occurrencesHighlight: "off",
          selectionHighlight: false,
        }}
        height={height}
      />
    </div>
  );
}


