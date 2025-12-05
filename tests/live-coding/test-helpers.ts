/**
 * Test Helper Functions for Live Coding Tests
 */

import type { LiveCodingLanguage } from "@/types/live-coding";
import { readFileSync } from "fs";
import { join } from "path";

export interface MockRunResult {
  stdout?: string;
  stderr?: string;
  output?: string;
  compileStdout?: string;
  compileStderr?: string;
  exitCode?: number;
  errorMessage?: string;
  isCorrect?: boolean;
}

export interface MockAIEvaluation {
  loading: boolean;
  feedback?: string;
  correctedCode?: string;
  comments?: string[];
  isCorrect?: boolean;
  errors?: Array<{ line: number; description: string }>;
  specificErrors?: Array<{ location: string; issue: string; fix: string }>;
}

export interface LiveCodingTestCase {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starterCode?: Record<string, string>;
  testCases?: Array<{
    input?: string;
    expectedOutput: string;
  }>;
  hints?: string[];
  language: LiveCodingLanguage;
}

/**
 * Normalize output for comparison (same logic as in page.tsx)
 */
export function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n") // Normalize multiple newlines
    .replace(/[ \t]+/g, " ") // Normalize spaces
    .replace(/[ \t]+\n/g, "\n") // Remove trailing spaces
    .replace(/\n[ \t]+/g, "\n") // Remove leading spaces
    .trim();
}

/**
 * Compare output with expected output (same logic as in page.tsx)
 */
export function compareOutputs(actual: string, expected: string): boolean {
  const normalizedActual = normalizeOutput(actual);
  const normalizedExpected = normalizeOutput(expected);
  
  // Exact match
  if (normalizedActual === normalizedExpected) {
    return true;
  }
  
  // Check if expected contains "..." (partial match indicator)
  if (normalizedExpected.includes("...")) {
    const parts = normalizedExpected.split("...");
    if (parts.length === 2) {
      const start = normalizeOutput(parts[0]);
      const end = normalizeOutput(parts[1]);
      return normalizedActual.startsWith(start) && normalizedActual.endsWith(end);
    }
  }
  
  return false;
}

/**
 * Create a mock run result
 */
export function createMockRunResult(overrides?: Partial<MockRunResult>): MockRunResult {
  return {
    stdout: "",
    stderr: undefined,
    output: "",
    compileStdout: undefined,
    compileStderr: undefined,
    exitCode: 0,
    errorMessage: undefined,
    isCorrect: false,
    ...overrides,
  };
}

/**
 * Create a mock AI evaluation
 */
export function createMockAIEvaluation(overrides?: Partial<MockAIEvaluation>): MockAIEvaluation {
  return {
    loading: false,
    feedback: "",
    correctedCode: "",
    comments: [],
    isCorrect: false,
    errors: [],
    specificErrors: [],
    ...overrides,
  };
}

/**
 * Load live coding cases from JSON files
 */
export function loadLiveCodingCases(): LiveCodingTestCase[] {
  const casesDir = join(process.cwd(), "data", "live-coding-cases");
  const languages: LiveCodingLanguage[] = [
    "javascript",
    "python",
    "csharp",
    "java",
    "php",
    "typescript",
    "go",
    "rust",
    "cpp",
    "kotlin",
    "ruby",
  ];

  const allCases: LiveCodingTestCase[] = [];

  for (const lang of languages) {
    try {
      const filePath = join(casesDir, `${lang}-cases.json`);
      const fileContent = readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);

      if (data.cases && Array.isArray(data.cases)) {
        for (const caseItem of data.cases) {
          allCases.push({
            id: caseItem.id,
            title: caseItem.title,
            description: caseItem.description,
            instructions: caseItem.instructions,
            starterCode: caseItem.starterCode,
            testCases: caseItem.testCases,
            hints: caseItem.hints,
            language: lang,
          });
        }
      }
    } catch (error) {
      // File might not exist for all languages, skip silently
      console.warn(`Could not load cases for ${lang}:`, error);
    }
  }

  return allCases;
}

/**
 * Get sample correct code for a test case
 */
export function getSampleCorrectCode(
  testCase: LiveCodingTestCase,
  language: LiveCodingLanguage
): string {
  const samples: Record<string, Record<string, string>> = {
    "javascript-case-2": {
      javascript: `const a = 10;
const b = 5;

// Toplama işlemi
const toplam = a + b;
console.log(\`\${a} + \${b} = \${toplam}\`);

// Çıkarma işlemi
const fark = a - b;
console.log(\`\${a} - \${b} = \${fark}\`);

// Çarpma işlemi
const carpma = a * b;
console.log(\`\${a} * \${b} = \${carpma}\`);

// Bölme işlemi
const bolme = a / b;
console.log(\`\${a} / \${b} = \${bolme}\`);`,
    },
    "javascript-case-1": {
      javascript: `for (let i = 1; i <= 50; i++) {
  console.log(\`Hello World \${i}\`);
}`,
    },
  };

  return samples[testCase.id]?.[language] || testCase.starterCode?.[language] || "";
}

/**
 * Get sample incorrect code (with errors)
 */
export function getSampleIncorrectCode(
  testCase: LiveCodingTestCase,
  language: LiveCodingLanguage
): string {
  const samples: Record<string, Record<string, string>> = {
    "javascript-case-2": {
      javascript: `const a = 10;
const b = 5;

// Missing operations - incomplete code
const toplam = a + b;
console.log(\`\${a} + \${b} = \${toplam}\`);`,
    },
  };

  return samples[testCase.id]?.[language] || "// Incomplete code";
}

/**
 * Run code via API (mock or real)
 */
export async function runCodeForTestCase(
  code: string,
  language: LiveCodingLanguage,
  baseUrl: string = "http://localhost:3000"
): Promise<MockRunResult> {
  try {
    const response = await fetch(`${baseUrl}/api/education/live-coding/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        code: code.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return createMockRunResult({
        errorMessage: data.error || "Kod çalıştırılırken bir hata oluştu",
        isCorrect: false,
      });
    }

    const actualOutput = data.run?.stdout || data.run?.output || "";
    const hasError = data.run?.code !== 0 || data.run?.stderr || data.compile?.stderr;

    return createMockRunResult({
      stdout: data.run?.stdout,
      stderr: data.run?.stderr,
      output: data.run?.output,
      compileStdout: data.compile?.stdout,
      compileStderr: data.compile?.stderr,
      exitCode: data.run?.code,
      isCorrect: !hasError, // Will be set properly by caller with expected output
    });
  } catch (error) {
    return createMockRunResult({
      errorMessage: "Kod çalıştırma servisine ulaşılamadı",
      isCorrect: false,
    });
  }
}

/**
 * Get authentication cookie for testing
 * Uses NextAuth v5 signIn API
 */
export async function getAuthCookie(
  email: string = "yusufislamyetkin@hotmail.com",
  password: string = "test123456",
  baseUrl: string = "http://localhost:3000"
): Promise<string | null> {
  try {
    // Get CSRF token first
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`, {
      method: "GET",
    });
    
    if (!csrfResponse.ok) {
      console.warn("Could not get CSRF token, status:", csrfResponse.status);
      return null;
    }

    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    if (!csrfToken) {
      console.warn("CSRF token not found in response");
      return null;
    }

    // Login using NextAuth callback endpoint
    const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        password,
        csrfToken,
        callbackUrl: `${baseUrl}/dashboard`,
        json: "true",
      }),
      redirect: "manual",
    });

    // Get all cookies from response
    const cookies: string[] = [];
    loginResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        cookies.push(value);
      }
    });

    if (cookies.length === 0) {
      // Try alternative: check if login was successful and get session
      const responseText = await loginResponse.text();
      if (loginResponse.ok || loginResponse.status === 200) {
        // Login successful, try to get session cookie from subsequent request
        const sessionResponse = await fetch(`${baseUrl}/api/auth/session`, {
          method: "GET",
        });
        
        sessionResponse.headers.forEach((value, key) => {
          if (key.toLowerCase() === "set-cookie") {
            cookies.push(value);
          }
        });
      }
      
      if (cookies.length === 0) {
        console.warn("No cookies received from login. Response status:", loginResponse.status);
        return null;
      }
    }

    // Find session token cookie
    let sessionCookie: string | null = null;
    for (const cookieHeader of cookies) {
      const cookieParts = cookieHeader.split(";").map(c => c.trim());
      for (const part of cookieParts) {
        if (part.includes("next-auth.session-token") || 
            part.includes("__Secure-next-auth.session-token") ||
            part.startsWith("next-auth.session-token=") ||
            part.startsWith("__Secure-next-auth.session-token=")) {
          sessionCookie = part.split(";")[0]; // Get just the key=value part
          break;
        }
      }
      if (sessionCookie) break;
    }
    
    if (!sessionCookie) {
      // If no session cookie found, try to construct it from available cookies
      // Sometimes cookies come in a different format
      const allCookies = cookies.join("; ");
      if (allCookies.includes("session-token")) {
        // Extract manually
        const match = allCookies.match(/(?:next-auth\.session-token|__Secure-next-auth\.session-token)=([^;]+)/);
        if (match) {
          sessionCookie = match[0];
        }
      }
    }

    if (!sessionCookie) {
      console.warn("No session cookie found in response. Available cookies:", cookies.length);
      // Return a placeholder - the API might work without explicit cookie if session is server-side
      return null;
    }

    return sessionCookie;
  } catch (error) {
    console.warn("Error getting auth cookie:", error);
    return null;
  }
}

/**
 * Analyze code with AI (mock or real)
 */
export async function analyzeCodeWithAI(
  taskDescription: string,
  expectedOutput: string,
  userCode: string,
  userOutput: string,
  language: string,
  baseUrl: string = "http://localhost:3000",
  authCookie?: string | null
): Promise<MockAIEvaluation> {
  try {
    const headers: Record<string, string> = { 
      "Content-Type": "application/json",
      "x-test-mode": "true", // Bypass auth for testing
    };
    
    // Add auth cookie if provided (for real testing scenarios)
    if (authCookie) {
      headers["Cookie"] = authCookie;
    }

    const response = await fetch(`${baseUrl}/api/education/live-coding/evaluate-output`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        taskDescription,
        expectedOutput,
        userCode: userCode.trim(),
        userOutput,
        language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createMockAIEvaluation({
        feedback: errorData.error || "AI değerlendirmesi alınamadı",
        correctedCode: userCode.trim(),
        isCorrect: false,
      });
    }

    const data = await response.json();

    return createMockAIEvaluation({
      feedback: data.feedback,
      correctedCode: data.correctedCode,
      comments: data.comments || [],
      isCorrect: data.isCorrect,
      errors: data.errors || [],
      specificErrors: data.specificErrors || [],
    });
  } catch (error) {
    return createMockAIEvaluation({
      feedback: "AI değerlendirmesi sırasında bir hata oluştu",
      correctedCode: userCode.trim(),
      isCorrect: false,
    });
  }
}

/**
 * Check if run result and AI evaluation are consistent
 */
export function checkConsistency(
  runResult: MockRunResult,
  aiEvaluation: MockAIEvaluation
): {
  consistent: boolean;
  runResultCorrect: boolean | undefined;
  aiEvaluationCorrect: boolean | undefined;
  message?: string;
} {
  const runResultCorrect = runResult.isCorrect;
  const aiEvaluationCorrect = aiEvaluation.isCorrect;

  // Both should be defined for consistency check
  if (runResultCorrect === undefined || aiEvaluationCorrect === undefined) {
    return {
      consistent: true, // Can't check if one is undefined
      runResultCorrect,
      aiEvaluationCorrect,
      message: "One or both values are undefined, skipping consistency check",
    };
  }

  const consistent = runResultCorrect === aiEvaluationCorrect;

  return {
    consistent,
    runResultCorrect,
    aiEvaluationCorrect,
    message: consistent
      ? "Results are consistent"
      : `Inconsistency detected: runResult.isCorrect=${runResultCorrect}, aiEvaluation.isCorrect=${aiEvaluationCorrect}`,
  };
}

