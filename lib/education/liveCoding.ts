import { LiveCodingLanguage, LiveCodingTask, ProgrammingLanguage } from "@/types/live-coding";

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

/**
 * Programlama dilleri JSON dosyasını okuyarak dilleri döndürür
 * Not: fs modülü sadece server-side'da kullanılabilir, bu yüzden fallback kullanıyoruz
 */
export function getProgrammingLanguages(): ProgrammingLanguage[] {
  // fs modülü client-side'da kullanılamaz, bu yüzden fallback dilleri döndürüyoruz
  // Production'da bu veriler API route'dan veya database'den gelmelidir
  try {
    // Server-side'da fs kullanılabilir, ama build sırasında sorun çıkmaması için
    // conditional import kullanıyoruz
    if (typeof window === "undefined") {
      // Server-side
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(process.cwd(), "data", "live-coding", "programming-languages.json");
      const fileContents = fs.readFileSync(filePath, "utf8");
      const languages = JSON.parse(fileContents) as ProgrammingLanguage[];
      return languages.sort((a, b) => a.popularity - b.popularity);
    }
  } catch (error) {
    console.error("[getProgrammingLanguages] Error reading programming languages:", error);
  }
  
  // Fallback: temel dilleri döndür
  return [
    {
      id: "csharp",
      name: "C#",
      description: "Microsoft tarafından geliştirilen modern programlama dili",
      icon: "💻",
      color: "#239120",
      popularity: 1,
    },
    {
      id: "java",
      name: "Java",
      description: "Platform bağımsız programlama dili",
      icon: "☕",
      color: "#ED8B00",
      popularity: 2,
    },
    {
      id: "python",
      name: "Python",
      description: "Yüksek seviyeli programlama dili",
      icon: "🐍",
      color: "#3776AB",
      popularity: 3,
    },
    {
      id: "javascript",
      name: "JavaScript",
      description: "Web geliştirme için popüler programlama dili",
      icon: "📜",
      color: "#F7DF1E",
      popularity: 4,
    },
  ];
}

/**
 * Veritabanından her dil için mevcut quiz sayısını hesaplar
 * @param quizzes Veritabanından gelen quiz listesi
 * @returns Dil ID'sine göre quiz sayısı mapping'i
 */
export function getLanguageQuizCounts(
  quizzes: Array<{ questions: unknown }>
): Map<string, number> {
  const languageCountMap = new Map<string, number>();

  quizzes.forEach((quiz) => {
    try {
      const normalized = normalizeLiveCodingPayload(quiz.questions);
      const languagesInQuiz = new Set<LiveCodingLanguage>();

      normalized.tasks.forEach((task) => {
        (task.languages || []).forEach((language) => {
          languagesInQuiz.add(language);
        });
      });

      languagesInQuiz.forEach((language) => {
        languageCountMap.set(language, (languageCountMap.get(language) || 0) + 1);
      });
    } catch (error) {
      console.error("[getLanguageQuizCounts] Error processing quiz:", error);
    }
  });

  return languageCountMap;
}

/**
 * Bug fix quizlerinden her dil için mevcut quiz sayısını hesaplar
 * @param quizzes Bug fix quiz listesi
 * @returns Dil ID'sine göre quiz sayısı mapping'i
 */
export function getBugFixLanguageCounts(
  quizzes: Array<{ questions: unknown }>
): Map<string, number> {
  const languageCountMap = new Map<string, number>();

  quizzes.forEach((quiz) => {
    try {
      const raw = quiz.questions;
      const payload = Array.isArray(raw)
        ? raw
        : typeof raw === "object" && raw !== null && Array.isArray((raw as { tasks?: unknown }).tasks)
        ? (raw as { tasks: unknown[] }).tasks
        : typeof raw === "object" && raw !== null
        ? [raw]
        : [];

      const languagesInQuiz = new Set<string>();

      payload.forEach((item) => {
        if (!item || typeof item !== "object") return;
        const record = item as Record<string, unknown>;
        
        // Dil bilgisini çıkar
        const langInput = record.languages ?? record.language ?? record.languageOptions ?? record.allowedLanguages;
        if (Array.isArray(langInput)) {
          langInput.forEach((lang) => {
            if (typeof lang === "string") {
              const normalized = lang.toLowerCase().trim();
              if (SUPPORTED_LANGUAGES.includes(normalized as LiveCodingLanguage)) {
                languagesInQuiz.add(normalized);
              }
            }
          });
        } else if (typeof langInput === "string") {
          const normalized = langInput.toLowerCase().trim();
          if (SUPPORTED_LANGUAGES.includes(normalized as LiveCodingLanguage)) {
            languagesInQuiz.add(normalized);
          }
        }
      });

      languagesInQuiz.forEach((language) => {
        languageCountMap.set(language, (languageCountMap.get(language) || 0) + 1);
      });
    } catch (error) {
      console.error("[getBugFixLanguageCounts] Error processing quiz:", error);
    }
  });

  return languageCountMap;
}


