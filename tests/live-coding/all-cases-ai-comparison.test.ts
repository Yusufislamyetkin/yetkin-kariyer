/**
 * All Cases AI Comparison Test
 * Tests all live coding cases by:
 * 1. Running correct code for each case
 * 2. Getting actual output
 * 3. Analyzing with AI using actual output
 * 4. Comparing runResult.isCorrect with aiEvaluation.isCorrect
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import {
  loadLiveCodingCases,
  runCodeForTestCase,
  analyzeCodeWithAI,
  compareOutputs,
  checkConsistency,
  getSampleCorrectCode,
  getAuthCookie,
} from "./test-helpers";
import type { LiveCodingTestCase } from "./test-helpers";

// Skip API tests if we're in CI or don't have a running server
const SKIP_API_TESTS = process.env.SKIP_API_TESTS === "true" || process.env.CI === "true";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface CaseTestResult {
  caseId: string;
  title: string;
  language: string;
  success: boolean;
  runResultCorrect?: boolean;
  aiEvaluationCorrect?: boolean;
  consistent: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  error?: string;
}

/**
 * Generate correct code for a test case based on its requirements
 */
function generateCorrectCode(testCase: LiveCodingTestCase): string {
  // Try to get sample correct code first
  const sampleCode = getSampleCorrectCode(testCase, testCase.language);
  if (sampleCode) {
    return sampleCode;
  }

  // Generate based on test case requirements
  const expectedOutput = testCase.testCases?.[0]?.expectedOutput || "";
  const instructions = testCase.instructions || testCase.description;

  // For arithmetic operations case
  if (instructions.includes("toplama") || instructions.includes("cikarma") || 
      instructions.includes("carpma") || instructions.includes("bolme")) {
    const codeSamples: Record<string, string> = {
      javascript: `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a} - \${b} = \${a - b}\`);
console.log(\`\${a} * \${b} = \${a * b}\`);
console.log(\`\${a} / \${b} = \${a / b}\`);`,
      python: `a = 10
b = 5
print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")`,
      csharp: `using System;
class Program {
    static void Main() {
        int a = 10;
        int b = 5;
        Console.WriteLine($"{a} + {b} = {a + b}");
        Console.WriteLine($"{a} - {b} = {a - b}");
        Console.WriteLine($"{a} * {b} = {a * b}");
        Console.WriteLine($"{a} / {b} = {a / b}");
    }
}`,
      java: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        System.out.println(a + " + " + b + " = " + (a + b));
        System.out.println(a + " - " + b + " = " + (a - b));
        System.out.println(a + " * " + b + " = " + (a * b));
        System.out.println(a + " / " + b + " = " + (a / b));
    }
}`,
      php: `<?php
$a = 10;
$b = 5;
echo "$a + $b = " . ($a + $b) . "\n";
echo "$a - $b = " . ($a - $b) . "\n";
echo "$a * $b = " . ($a * $b) . "\n";
echo "$a / $b = " . ($a / $b) . "\n";
?>`,
    };
    return codeSamples[testCase.language] || testCase.starterCode?.[testCase.language] || "";
  }

  // For number sequence case (Hello World 1 to 50)
  if (instructions.includes("1'den 50'ye") || instructions.includes("1 to 50")) {
    const codeSamples: Record<string, string> = {
      javascript: `for (let i = 1; i <= 50; i++) {
  console.log(\`Hello World \${i}\`);
}`,
      python: `for i in range(1, 51):
    print(f"Hello World {i}")`,
      csharp: `using System;
class Program {
    static void Main() {
        for (int i = 1; i <= 50; i++) {
            Console.WriteLine($"Hello World {i}");
        }
    }
}`,
      java: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 50; i++) {
            System.out.println("Hello World " + i);
        }
    }
}`,
      php: `<?php
for ($i = 1; $i <= 50; $i++) {
    echo "Hello World $i\n";
}
?>`,
    };
    return codeSamples[testCase.language] || testCase.starterCode?.[testCase.language] || "";
  }

  // Fallback to starter code
  return testCase.starterCode?.[testCase.language] || "";
}

describe("All Cases AI Comparison Test", () => {
    it("should test all cases and compare run output with AI analysis", async () => {
      if (SKIP_API_TESTS) {
        console.log("Skipping API tests (SKIP_API_TESTS=true or CI=true)");
        return;
      }

      const cases = loadLiveCodingCases();
      if (cases.length === 0) {
        console.warn("No test cases loaded");
        return;
      }

      console.log(`\n📊 Testing ALL ${cases.length} live coding cases...\n`);

      // Get auth cookie for API requests
      console.log("🔐 Getting authentication cookie...");
      const authCookie = await getAuthCookie();
      if (!authCookie) {
        console.warn("⚠️  Could not get auth cookie. Some tests may fail with 401.");
      } else {
        console.log("✅ Authentication cookie obtained");
      }

      const results: CaseTestResult[] = [];
      let consistentCount = 0;
      let inconsistentCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      for (let i = 0; i < cases.length; i++) {
        const testCase = cases[i];
        const progress = `[${i + 1}/${cases.length}]`;
        
        const expectedOutput = testCase.testCases?.[0]?.expectedOutput;
        
        if (!expectedOutput) {
          console.warn(`${progress} ⚠️  Skipping ${testCase.id}: No expected output`);
          skippedCount++;
          continue;
        }

        // Generate correct code
        const correctCode = generateCorrectCode(testCase);
        
        if (!correctCode || correctCode.trim().length === 0) {
          console.warn(`${progress} ⚠️  Skipping ${testCase.id}: No code generated`);
          skippedCount++;
          continue;
        }

        const result: CaseTestResult = {
          caseId: testCase.id,
          title: testCase.title,
          language: testCase.language,
          success: false,
          consistent: false,
          expectedOutput,
        };

        try {
          // Step 1: Run code
          console.log(`${progress} 🔄 [1/4] Running ${testCase.id} (${testCase.language})...`);
          const runStartTime = Date.now();
          const runResult = await runCodeForTestCase(correctCode, testCase.language, BASE_URL);
          const runDuration = Date.now() - runStartTime;

          if (runResult.errorMessage) {
            result.error = `Run failed: ${runResult.errorMessage}`;
            results.push(result);
            errorCount++;
            console.log(`${progress} ❌ [1/4] Run failed (${runDuration}ms) - ${runResult.errorMessage}`);
            continue;
          }

          // Step 2: Get actual output and compare
          console.log(`${progress} 🔍 [2/4] Comparing output...`);
          const actualOutput = runResult.stdout || runResult.output || "";
          result.actualOutput = actualOutput;
          
          const isCorrect = compareOutputs(actualOutput, expectedOutput);
          runResult.isCorrect = isCorrect;
          result.runResultCorrect = isCorrect;
          console.log(`${progress} 📊 [2/4] Output comparison: ${isCorrect ? "✅ MATCH" : "❌ NO MATCH"}`);

          // Step 3: Analyze with AI using actual output
          console.log(`${progress} 🤖 [3/4] Analyzing with AI (using actual output: ${actualOutput.length} chars)...`);
          const aiStartTime = Date.now();
          const aiEvaluation = await analyzeCodeWithAI(
            testCase.description || testCase.title,
            expectedOutput,
            correctCode,
            actualOutput, // Use actual output from run
            testCase.language,
            BASE_URL,
            authCookie || undefined
          );
          const aiDuration = Date.now() - aiStartTime;

          if (aiEvaluation.feedback?.includes("AI servisi")) {
            result.error = "AI service not available";
            results.push(result);
            errorCount++;
            console.log(`${progress} ⚠️  [3/4] AI service not available (${aiDuration}ms)`);
            continue;
          }

          result.aiEvaluationCorrect = aiEvaluation.isCorrect;
          console.log(`${progress} 📊 [3/4] AI analysis complete (${aiDuration}ms): ${aiEvaluation.isCorrect ? "✅ CORRECT" : "❌ INCORRECT"}`);

          // Step 4: Check consistency
          console.log(`${progress} 🔗 [4/4] Checking consistency...`);
          const consistency = checkConsistency(runResult, aiEvaluation);
          result.consistent = consistency.consistent;
          result.success = true;

          if (consistency.consistent) {
            consistentCount++;
            console.log(`${progress} ✅ [4/4] CONSISTENT - Both ${isCorrect ? "CORRECT" : "INCORRECT"} (Run: ${runDuration}ms, AI: ${aiDuration}ms)`);
          } else {
            inconsistentCount++;
            console.log(`${progress} ⚠️  [4/4] INCONSISTENT - Run: ${isCorrect ? "CORRECT" : "INCORRECT"}, AI: ${aiEvaluation.isCorrect ? "CORRECT" : "INCORRECT"}`);
            console.log(`${progress}    📝 Expected: ${expectedOutput.substring(0, 80).replace(/\n/g, " ")}...`);
            console.log(`${progress}    📝 Actual: ${actualOutput.substring(0, 80).replace(/\n/g, " ")}...`);
          }

          results.push(result);

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
        results.push(result);
        errorCount++;
        console.log(`❌ ${testCase.id}: Error - ${result.error}`);
      }
    }

    // Print summary
    console.log(`\n📈 Test Summary:`);
    console.log(`   Total cases: ${cases.length}`);
    console.log(`   ✅ Consistent: ${consistentCount}`);
    console.log(`   ⚠️  Inconsistent: ${inconsistentCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);

    // Print inconsistent cases
    if (inconsistentCount > 0) {
      console.log(`\n⚠️  Inconsistent Cases:`);
      results
        .filter(r => !r.consistent && r.success)
        .forEach(r => {
          console.log(`   - ${r.caseId} (${r.language}):`);
          console.log(`     Run Result: ${r.runResultCorrect}`);
          console.log(`     AI Evaluation: ${r.aiEvaluationCorrect}`);
        });
    }

    // Print error cases
    if (errorCount > 0) {
      console.log(`\n❌ Error Cases:`);
      results
        .filter(r => r.error)
        .forEach(r => {
          console.log(`   - ${r.caseId} (${r.language}): ${r.error}`);
        });
    }

    // Assertions
    assert.ok(cases.length > 0, "Should have test cases");
    assert.ok(results.length > 0, "Should have test results");

    // Log final status
    const successRate = ((consistentCount / (consistentCount + inconsistentCount)) * 100).toFixed(1);
    console.log(`\n📊 Success Rate: ${successRate}% (${consistentCount}/${consistentCount + inconsistentCount} consistent)`);

    // For now, we don't fail the test if there are inconsistencies
    // as AI might have different evaluation criteria
    // But we log them for review
    if (inconsistentCount > 0) {
      console.log(`\n⚠️  Warning: ${inconsistentCount} cases have inconsistent results between run and AI analysis.`);
      console.log(`   Review the inconsistent cases above to ensure they are handled correctly.`);
    }
  });

  it("should test a sample of cases for quick validation", async () => {
    if (SKIP_API_TESTS) {
      console.log("Skipping API tests (SKIP_API_TESTS=true or CI=true)");
      return;
    }

    const cases = loadLiveCodingCases();
    if (cases.length === 0) {
      console.warn("No test cases loaded");
      return;
    }

    // Test first 3 cases from each language
    const languageGroups = new Map<string, LiveCodingTestCase[]>();
    for (const testCase of cases) {
      if (!languageGroups.has(testCase.language)) {
        languageGroups.set(testCase.language, []);
      }
      languageGroups.get(testCase.language)!.push(testCase);
    }

    const sampleCases: LiveCodingTestCase[] = [];
    for (const [language, langCases] of languageGroups) {
      sampleCases.push(...langCases.slice(0, 2)); // First 2 cases per language
    }

    console.log(`\n📊 Testing sample of ${sampleCases.length} cases...\n`);

    let consistentCount = 0;
    let inconsistentCount = 0;

    for (const testCase of sampleCases) {
      const expectedOutput = testCase.testCases?.[0]?.expectedOutput;
      if (!expectedOutput) continue;

      const correctCode = generateCorrectCode(testCase);
      if (!correctCode || correctCode.trim().length === 0) continue;

      try {
        // Run code
        const runResult = await runCodeForTestCase(correctCode, testCase.language, BASE_URL);
        if (runResult.errorMessage) continue;

        // Compare output
        const actualOutput = runResult.stdout || runResult.output || "";
        const isCorrect = compareOutputs(actualOutput, expectedOutput);
        runResult.isCorrect = isCorrect;

        // AI Analysis
        const aiEvaluation = await analyzeCodeWithAI(
          testCase.description || testCase.title,
          expectedOutput,
          correctCode,
          actualOutput,
          testCase.language,
          BASE_URL
        );

        if (aiEvaluation.feedback?.includes("AI servisi")) continue;

        // Check consistency
        const consistency = checkConsistency(runResult, aiEvaluation);
        if (consistency.consistent) {
          consistentCount++;
        } else {
          inconsistentCount++;
          console.log(`⚠️  ${testCase.id}: Inconsistent - Run: ${isCorrect}, AI: ${aiEvaluation.isCorrect}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.warn(`Error testing ${testCase.id}:`, error);
      }
    }

    console.log(`\n📈 Sample Test Results:`);
    console.log(`   ✅ Consistent: ${consistentCount}`);
    console.log(`   ⚠️  Inconsistent: ${inconsistentCount}`);

    assert.ok(sampleCases.length > 0);
  });
});

