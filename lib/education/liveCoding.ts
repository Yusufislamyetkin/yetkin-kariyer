import { LiveCodingLanguage, LiveCodingTask } from "@/types/live-coding";

export const SUPPORTED_LANGUAGES: LiveCodingLanguage[] = ["csharp", "python", "javascript", "java"];
const DEFAULT_TIME_LIMIT = 45;
const MAX_TASK_COUNT = 5;

const DEFAULT_CSHARP_TEMPLATE = `using System;

namespace LiveCoding
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            // Çözümünüzü buraya yazın
        }
    }
}
`;

type LegacyLiveCodingTask =
  | {
      id: string;
      title?: string;
      prompt?: string;
      description?: string;
      acceptanceCriteria?: string[];
      languages?: LiveCodingLanguage[];
      timeLimitMinutes?: number;
      initialCode?: Partial<Record<LiveCodingLanguage, string>>;
      starterFiles?: Array<{
        path: string;
        content: string;
        language: LiveCodingLanguage;
      }>;
      evaluation?: {
        complexity?: string;
        timeLimit?: number;
        languages?: LiveCodingLanguage[];
      };
    }
  | undefined;

interface RawLiveCodingPayload {
  tasks?: LegacyLiveCodingTask[] | LegacyLiveCodingTask;
  instructions?: string;
  description?: string;
  prompt?: string;
  [key: string]: unknown;
}

const toSupportedLanguages = (languages?: LiveCodingLanguage[] | string[]): LiveCodingLanguage[] => {
  if (!languages) {
    return SUPPORTED_LANGUAGES;
  }

  return languages
    .map((lang) => lang.toLowerCase() as LiveCodingLanguage)
    .filter((lang): lang is LiveCodingLanguage => SUPPORTED_LANGUAGES.includes(lang));
};

const normalizeSingleTask = (rawTask: LegacyLiveCodingTask, index: number): LiveCodingTask | null => {
  if (!rawTask) {
    return null;
  }

  const id = rawTask.id || `task-${index + 1}`;
  const title =
    rawTask.title ||
    rawTask.prompt?.split(".")[0]?.trim() ||
    rawTask.description?.split("\n")[0]?.trim() ||
    `Görev ${index + 1}`;

  const description = rawTask.description || rawTask.prompt || "";
  const acceptanceCriteria = rawTask.acceptanceCriteria?.filter((item): item is string => Boolean(item));
  const languages = toSupportedLanguages(rawTask.languages || rawTask.evaluation?.languages);
  const timeLimitMinutes =
    rawTask.timeLimitMinutes ??
    rawTask.evaluation?.timeLimit ??
    DEFAULT_TIME_LIMIT;

  const languagesToUse = languages.length > 0 ? languages : SUPPORTED_LANGUAGES;

  const resolvedInitialCode: Partial<Record<LiveCodingLanguage, string>> = {};
  languagesToUse.forEach((language) => {
    const providedCode = rawTask.initialCode?.[language];
    if (typeof providedCode === "string" && providedCode.trim().length > 0) {
      resolvedInitialCode[language] = providedCode;
      return;
    }

    if (language === "csharp") {
      resolvedInitialCode[language] = DEFAULT_CSHARP_TEMPLATE;
    }
  });

  return {
    id,
    title,
    description,
    languages: languagesToUse,
    timeLimitMinutes:
      typeof timeLimitMinutes === "number" && timeLimitMinutes > 0 ? timeLimitMinutes : DEFAULT_TIME_LIMIT,
    acceptanceCriteria,
    initialCode: Object.keys(resolvedInitialCode).length > 0 ? resolvedInitialCode : rawTask.initialCode,
    starterFiles: rawTask.starterFiles,
  };
};

export const normalizeLiveCodingPayload = (questions: unknown): {
  tasks: LiveCodingTask[];
  instructions?: string;
} => {
  let rawPayload: RawLiveCodingPayload = {};

  if (Array.isArray(questions)) {
    rawPayload.tasks = questions as LegacyLiveCodingTask[];
  } else if (questions && typeof questions === "object") {
    rawPayload = questions as RawLiveCodingPayload;
  } else if (typeof questions === "string") {
    try {
      const parsed = JSON.parse(questions) as RawLiveCodingPayload;
      rawPayload = parsed;
    } catch {
      rawPayload = {
        description: questions,
      };
    }
  }

  const rawTasks = Array.isArray(rawPayload.tasks)
    ? rawPayload.tasks
    : rawPayload.tasks
    ? [rawPayload.tasks]
    : [];

  const normalizedTasks = rawTasks
    .slice(0, MAX_TASK_COUNT)
    .map(normalizeSingleTask)
    .filter((task): task is LiveCodingTask => task !== null);

  if (normalizedTasks.length === 0) {
    normalizedTasks.push({
      id: "default-task",
      title: "Genel Kodlama Görevi",
      description:
        rawPayload.description ||
        rawPayload.prompt ||
        "Görev açıklaması bulunamadı. Lütfen yöneticinizle iletişime geçin.",
      languages: SUPPORTED_LANGUAGES,
      timeLimitMinutes: DEFAULT_TIME_LIMIT,
    });
  }

  return {
    tasks: normalizedTasks,
    instructions: rawPayload.instructions ?? rawPayload.description ?? rawPayload.prompt,
  };
};

export const getSupportedLiveCodingLanguages = (): LiveCodingLanguage[] => SUPPORTED_LANGUAGES;
export const getMaxLiveCodingTaskCount = (): number => MAX_TASK_COUNT;

export const resolveLiveCodingLanguage = (
  value: string | null | undefined
): LiveCodingLanguage | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return SUPPORTED_LANGUAGES.includes(normalized as LiveCodingLanguage)
    ? (normalized as LiveCodingLanguage)
    : null;
};


