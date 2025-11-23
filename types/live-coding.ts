export type LiveCodingLanguage = "csharp" | "python" | "javascript" | "java";

export interface ProgrammingLanguage {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
}

export interface TestCase {
  input?: string;
  expectedOutput: string;
}

export interface LiveCodingTask {
  id: string;
  title: string;
  description: string;
  languages: LiveCodingLanguage[];
  timeLimitMinutes: number;
  acceptanceCriteria?: string[];
  initialCode?: Partial<Record<LiveCodingLanguage, string>>;
  starterFiles?: Array<{
    path: string;
    content: string;
    language: LiveCodingLanguage;
  }>;
  testCases?: TestCase[];
  hints?: string[];
}

export interface LiveCodingConfig {
  tasks: LiveCodingTask[];
  instructions?: string;
  maxConcurrentTasks?: number;
}

export interface LiveCodingQuizPayload {
  tasks?: LiveCodingTask[];
  instructions?: string;
  /**
   * @deprecated Legacy field kept for backward compatibility.
   */
  description?: string;
  /**
   * @deprecated Legacy field kept for backward compatibility.
   */
  prompt?: string;
}

export interface LiveCodingQuizSummary {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  questions?: unknown; // Optional for backward compatibility
  liveCoding?: {
    tasks: LiveCodingTask[];
    instructions?: string;
  };
  course: {
    id: string;
    title: string;
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
    difficulty: string;
  };
}


