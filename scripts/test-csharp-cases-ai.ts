/**
 * C# Cases AI Test Script
 * 
 * Tests all C# cases by:
 * 1. Getting starter code for each case
 * 2. Sending starter code to AI for analysis
 * 3. Getting correctedCode from AI
 * 4. Running the correctedCode
 * 5. Comparing output with expectedOutput
 * 6. Reporting results
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface CSharpCase {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: string;
  starterCode: {
    csharp: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  hints: string[];
}

interface CSharpCasesData {
  id: string;
  name: string;
  cases: CSharpCase[];
}

interface TestResult {
  caseId: string;
  title: string;
  success: boolean;
  error?: string;
  aiAnalysisSuccess: boolean;
  codeExecutionSuccess: boolean;
  outputMatch: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  correctedCode?: string;
  aiFeedback?: string;
  duration: number;
}

interface TestReport {
  totalCases: number;
  successfulCases: number;
  failedCases: number;
  results: TestResult[];
  summary: {
    aiAnalysisSuccessRate: number;
    codeExecutionSuccessRate: number;
    outputMatchRate: number;
    averageDuration: number;
  };
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_FILE = "csharp-cases-ai-test-results.json";

/**
 * Check if server is accessible
 */
async function checkServerHealth(): Promise<boolean> {
  // Try multiple endpoints to check server health
  const endpoints = [
    "/api/auth/csrf",
    "/api/health",
    "/",
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        // Any response (even 404) means server is reachable
        if (response.status < 500) {
          return true;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // If it's a network error, continue to next endpoint
        if (fetchError instanceof Error && 
            (fetchError.message.includes("ECONNREFUSED") || 
             fetchError.message.includes("ENOTFOUND") ||
             fetchError.message.includes("fetch failed"))) {
          continue; // Try next endpoint
        }
        // Other errors might mean server is reachable but endpoint doesn't exist
        return true;
      }
    } catch {
      continue;
    }
  }
  
  return false;
}

/**
 * Load C# cases from JSON file
 */
function loadCSharpCases(): CSharpCase[] {
  try {
    const filePath = join(process.cwd(), "data", "live-coding-cases", "csharp-cases.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent) as CSharpCasesData;
    
    if (!data.cases || !Array.isArray(data.cases)) {
      throw new Error("Invalid C# cases file format");
    }
    
    return data.cases;
  } catch (error) {
    console.error("Error loading C# cases:", error);
    throw error;
  }
}

/**
 * Normalize output for comparison
 */
function normalizeOutput(output: string): string {
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
 * Compare actual output with expected output
 */
function compareOutputs(actual: string, expected: string): boolean {
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
 * Analyze code with AI
 */
async function analyzeCodeWithAI(
  taskDescription: string,
  expectedOutput: string,
  userCode: string,
  language: string = "csharp"
): Promise<{ correctedCode: string; feedback: string; error?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-test-mode": "true", // Bypass auth for testing
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(`${BASE_URL}/api/education/live-coding/evaluate-output`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          taskDescription,
          expectedOutput,
          userCode: userCode.trim(),
          userOutput: "", // Empty, code not run yet
          language,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (!data.correctedCode) {
        throw new Error("AI did not return correctedCode");
      }

      return {
        correctedCode: data.correctedCode,
        feedback: data.feedback || "",
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error("Request timeout (60s)");
      }
      throw fetchError;
    }
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for common fetch errors
      if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
        errorMessage = `Cannot connect to server at ${BASE_URL}. Make sure the server is running.`;
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = `Server not found at ${BASE_URL}. Check the BASE_URL environment variable.`;
      }
    }
    return {
      correctedCode: "",
      feedback: "",
      error: errorMessage,
    };
  }
}

/**
 * Run code
 */
async function runCode(
  code: string,
  language: string = "csharp"
): Promise<{ output: string; error?: string; stderr?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${BASE_URL}/api/education/live-coding/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code: code.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          output: "",
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const hasError = data.run?.code !== 0 || data.run?.stderr || data.compile?.stderr;
      const actualOutput = data.run?.stdout || data.run?.output || "";
      const stderr = data.run?.stderr || data.compile?.stderr || "";

      if (hasError && !actualOutput) {
        return {
          output: "",
          error: stderr || "Code execution failed",
          stderr,
        };
      }

      return {
        output: actualOutput,
        stderr: stderr || undefined,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error("Request timeout (30s)");
      }
      throw fetchError;
    }
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
        errorMessage = `Cannot connect to server at ${BASE_URL}. Make sure the server is running.`;
      }
    }
    return {
      output: "",
      error: errorMessage,
    };
  }
}

/**
 * Test a single case
 */
async function testCase(caseItem: CSharpCase, index: number, total: number): Promise<TestResult> {
  const startTime = Date.now();
  const progress = `[${index + 1}/${total}]`;
  
  const result: TestResult = {
    caseId: caseItem.id,
    title: caseItem.title,
    success: false,
    aiAnalysisSuccess: false,
    codeExecutionSuccess: false,
    outputMatch: false,
    duration: 0,
  };

  try {
    const starterCode = caseItem.starterCode?.csharp;
    if (!starterCode) {
      result.error = "No starter code found";
      result.duration = Date.now() - startTime;
      return result;
    }

    const expectedOutput = caseItem.testCases?.[0]?.expectedOutput || "";
    if (!expectedOutput) {
      result.error = "No expected output found";
      result.duration = Date.now() - startTime;
      return result;
    }

    result.expectedOutput = expectedOutput;

    // Step 1: AI Analysis
    console.log(`${progress} 🤖 [1/3] Analyzing ${caseItem.id} with AI...`);
    const taskDescription = caseItem.description || caseItem.title;
    const aiResult = await analyzeCodeWithAI(
      taskDescription,
      expectedOutput,
      starterCode,
      "csharp"
    );

    if (aiResult.error || !aiResult.correctedCode) {
      result.error = `AI analysis failed: ${aiResult.error || "No correctedCode returned"}`;
      result.duration = Date.now() - startTime;
      return result;
    }

    result.aiAnalysisSuccess = true;
    result.correctedCode = aiResult.correctedCode;
    result.aiFeedback = aiResult.feedback;
    console.log(`${progress} ✅ [1/3] AI analysis complete (${aiResult.correctedCode.length} chars)`);

    // Step 2: Run corrected code
    console.log(`${progress} 🚀 [2/3] Running corrected code...`);
    const runResult = await runCode(aiResult.correctedCode, "csharp");

    if (runResult.error) {
      result.error = `Code execution failed: ${runResult.error}`;
      result.duration = Date.now() - startTime;
      return result;
    }

    result.codeExecutionSuccess = true;
    result.actualOutput = runResult.output;
    console.log(`${progress} ✅ [2/3] Code execution complete (${runResult.output.length} chars output)`);

    // Step 3: Compare outputs
    console.log(`${progress} 🔍 [3/3] Comparing outputs...`);
    const match = compareOutputs(runResult.output, expectedOutput);
    result.outputMatch = match;
    result.success = match;

    if (match) {
      console.log(`${progress} ✅ [3/3] Outputs match!`);
    } else {
      console.log(`${progress} ❌ [3/3] Outputs do not match`);
      console.log(`${progress}    Expected length: ${expectedOutput.length}`);
      console.log(`${progress}    Actual length: ${runResult.output.length}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    result.duration = Date.now() - startTime;
    return result;
  }
}

/**
 * Generate test report
 */
function generateReport(results: TestResult[]): TestReport {
  const totalCases = results.length;
  const successfulCases = results.filter((r) => r.success).length;
  const failedCases = totalCases - successfulCases;

  const aiAnalysisSuccessCount = results.filter((r) => r.aiAnalysisSuccess).length;
  const codeExecutionSuccessCount = results.filter((r) => r.codeExecutionSuccess).length;
  const outputMatchCount = results.filter((r) => r.outputMatch).length;

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const averageDuration = totalCases > 0 ? totalDuration / totalCases : 0;

  return {
    totalCases,
    successfulCases,
    failedCases,
    results,
    summary: {
      aiAnalysisSuccessRate: totalCases > 0 ? (aiAnalysisSuccessCount / totalCases) * 100 : 0,
      codeExecutionSuccessRate: totalCases > 0 ? (codeExecutionSuccessCount / totalCases) * 100 : 0,
      outputMatchRate: totalCases > 0 ? (outputMatchCount / totalCases) * 100 : 0,
      averageDuration,
    },
  };
}

/**
 * Main function
 */
async function main() {
  console.log("=".repeat(60));
  console.log("C# Cases AI Test Script");
  console.log("=".repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log("");

  // Check server health
  console.log("🔍 Checking server health...");
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    console.log(`❌ Cannot connect to server at ${BASE_URL}`);
    console.log("");
    console.log("Please make sure:");
    console.log("  1. The server is running");
    console.log("  2. The BASE_URL is correct");
    console.log("  3. For production, set: BASE_URL=https://yetkinacademy.vercel.app");
    console.log("");
    process.exit(1);
  }
  console.log("✅ Server is accessible\n");

  try {
    // Load cases
    console.log("📂 Loading C# cases...");
    const cases = loadCSharpCases();
    console.log(`✅ Loaded ${cases.length} cases\n`);

    if (cases.length === 0) {
      console.log("❌ No cases found. Exiting.");
      process.exit(1);
    }

    // Test each case sequentially
    const results: TestResult[] = [];
    const startTime = Date.now();

    for (let i = 0; i < cases.length; i++) {
      const caseItem = cases[i];
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Testing: ${caseItem.id} - ${caseItem.title}`);
      console.log(`${"=".repeat(60)}`);

      const result = await testCase(caseItem, i, cases.length);
      results.push(result);

      // Small delay to avoid overwhelming the server
      if (i < cases.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Increased to 2 seconds
      }
    }

    const totalDuration = Date.now() - startTime;

    // Generate report
    console.log("\n" + "=".repeat(60));
    console.log("Generating Report...");
    console.log("=".repeat(60));

    const report = generateReport(results);

    // Print summary
    console.log("\n📊 SUMMARY");
    console.log("-".repeat(60));
    console.log(`Total Cases: ${report.totalCases}`);
    console.log(`Successful: ${report.successfulCases} (${((report.successfulCases / report.totalCases) * 100).toFixed(1)}%)`);
    console.log(`Failed: ${report.failedCases} (${((report.failedCases / report.totalCases) * 100).toFixed(1)}%)`);
    console.log("");
    console.log(`AI Analysis Success Rate: ${report.summary.aiAnalysisSuccessRate.toFixed(1)}%`);
    console.log(`Code Execution Success Rate: ${report.summary.codeExecutionSuccessRate.toFixed(1)}%`);
    console.log(`Output Match Rate: ${report.summary.outputMatchRate.toFixed(1)}%`);
    console.log(`Average Duration: ${report.summary.averageDuration.toFixed(0)}ms`);
    console.log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);

    // Print failed cases
    const failedResults = results.filter((r) => !r.success);
    if (failedResults.length > 0) {
      console.log("\n❌ FAILED CASES:");
      console.log("-".repeat(60));
      failedResults.forEach((result) => {
        console.log(`\n${result.caseId} - ${result.title}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
        if (!result.aiAnalysisSuccess) {
          console.log(`  AI Analysis: ❌ Failed`);
        }
        if (!result.codeExecutionSuccess) {
          console.log(`  Code Execution: ❌ Failed`);
        }
        if (!result.outputMatch) {
          console.log(`  Output Match: ❌ Failed`);
          if (result.actualOutput && result.expectedOutput) {
            console.log(`  Expected length: ${result.expectedOutput.length}`);
            console.log(`  Actual length: ${result.actualOutput.length}`);
            console.log(`  Expected preview: ${result.expectedOutput.substring(0, 100)}...`);
            console.log(`  Actual preview: ${result.actualOutput.substring(0, 100)}...`);
          }
        }
      });
    }

    // Save report to file
    const reportPath = join(process.cwd(), OUTPUT_FILE);
    writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`\n💾 Report saved to: ${reportPath}`);

    // Exit with appropriate code
    process.exit(report.failedCases > 0 ? 1 : 0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run main function
main();

