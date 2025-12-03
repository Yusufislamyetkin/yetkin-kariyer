import { readFileSync } from "fs";
import { join } from "path";

export interface LiveCodingCase {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  instructions: string;
  starterCode?: Record<string, string>;
  testCases?: Array<{
    input?: string;
    expectedOutput: string;
  }>;
  hints?: string[];
}

export interface LiveCodingLanguageData {
  id: string;
  name: string;
  cases: LiveCodingCase[];
}

export interface LiveCodingCasesData {
  languages: LiveCodingLanguageData[];
}

/**
 * Read all language case files and combine them
 * This function loads all case files from data/live-coding-cases/ directory
 */
export function loadLiveCodingCases(): LiveCodingCasesData {
  const casesDir = join(process.cwd(), "data", "live-coding-cases");
  const languageFiles = [
    "csharp-cases.json",
    "java-cases.json",
    "python-cases.json",
    "javascript-cases.json",
    "typescript-cases.json",
    "php-cases.json",
    "go-cases.json",
    "rust-cases.json",
    "cpp-cases.json",
    "kotlin-cases.json",
    "ruby-cases.json",
  ];

  const languages: LiveCodingLanguageData[] = [];

  for (const file of languageFiles) {
    try {
      const filePath = join(casesDir, file);
      const fileContent = readFileSync(filePath, "utf-8");
      const languageData = JSON.parse(fileContent) as LiveCodingLanguageData;
      languages.push(languageData);
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  return { languages };
}

