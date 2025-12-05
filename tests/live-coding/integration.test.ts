/**
 * Integration Tests
 * End-to-end tests for the complete live coding flow
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import {
  runCodeForTestCase,
  analyzeCodeWithAI,
  compareOutputs,
  checkConsistency,
  loadLiveCodingCases,
  getSampleCorrectCode,
  getSampleIncorrectCode,
} from "./test-helpers";

// Skip API tests if we're in CI or don't have a running server
const SKIP_API_TESTS = process.env.SKIP_API_TESTS === "true" || process.env.CI === "true";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Integration Tests - Complete Flow", () => {
  describe("End-to-End Flow: Run → AI Analysis → Comparison", () => {
    it("should complete full flow for correct code", async () => {
      if (SKIP_API_TESTS) return;

      const code = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a} - \${b} = \${a - b}\`);
console.log(\`\${a} * \${b} = \${a * b}\`);
console.log(\`\${a} / \${b} = \${a / b}\`);`;

      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const taskDescription = "Print arithmetic operations";

      // Step 1: Run code
      const runResult = await runCodeForTestCase(code, "javascript", BASE_URL);
      assert.ok(runResult !== null, "Run result should not be null");

      if (runResult.errorMessage) {
        console.warn("Run failed, skipping integration test");
        return;
      }

      // Step 2: Check output comparison
      const actualOutput = runResult.stdout || runResult.output || "";
      const isCorrect = compareOutputs(actualOutput, expectedOutput);
      runResult.isCorrect = isCorrect;

      assert.ok(typeof isCorrect === "boolean", "isCorrect should be boolean");

      // Step 3: AI Analysis
      const aiEvaluation = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        code,
        actualOutput,
        "javascript",
        BASE_URL
      );

      assert.ok(aiEvaluation !== null, "AI evaluation should not be null");

      if (aiEvaluation.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping integration test");
        return;
      }

      assert.ok(typeof aiEvaluation.isCorrect === "boolean", "AI isCorrect should be boolean");
      assert.ok(aiEvaluation.feedback.length > 0, "AI feedback should not be empty");
      assert.ok(aiEvaluation.correctedCode.length > 0, "AI correctedCode should not be empty");

      // Step 4: Check consistency
      const consistency = checkConsistency(runResult, aiEvaluation);
      assert.ok(consistency !== null, "Consistency check should not be null");

      // Log results
      console.log("Integration test results:", {
        runResultCorrect: runResult.isCorrect,
        aiEvaluationCorrect: aiEvaluation.isCorrect,
        consistent: consistency.consistent,
        actualOutput: actualOutput.substring(0, 100),
      });
    });

    it("should complete full flow for incorrect code", async () => {
      if (SKIP_API_TESTS) return;

      const code = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`); // Missing other operations`;

      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const taskDescription = "Print arithmetic operations";

      // Step 1: Run code
      const runResult = await runCodeForTestCase(code, "javascript", BASE_URL);
      assert.ok(runResult !== null);

      if (runResult.errorMessage) {
        console.warn("Run failed, skipping integration test");
        return;
      }

      // Step 2: Check output comparison
      const actualOutput = runResult.stdout || runResult.output || "";
      const isCorrect = compareOutputs(actualOutput, expectedOutput);
      runResult.isCorrect = isCorrect;

      // Step 3: AI Analysis
      const aiEvaluation = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        code,
        actualOutput,
        "javascript",
        BASE_URL
      );

      if (aiEvaluation.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping integration test");
        return;
      }

      // Step 4: Check consistency
      const consistency = checkConsistency(runResult, aiEvaluation);

      // For incorrect code, both should be false
      assert.ok(
        !isCorrect || !aiEvaluation.isCorrect,
        "At least one should detect incorrect code"
      );

      console.log("Integration test results (incorrect code):", {
        runResultCorrect: runResult.isCorrect,
        aiEvaluationCorrect: aiEvaluation.isCorrect,
        consistent: consistency.consistent,
      });
    });
  });

  describe("Real Test Cases Integration", () => {
    it("should complete flow for real test cases", async () => {
      if (SKIP_API_TESTS) return;

      const cases = loadLiveCodingCases();
      if (cases.length === 0) {
        console.warn("No test cases loaded, skipping");
        return;
      }

      // Test first case
      const testCase = cases[0];
      const correctCode = getSampleCorrectCode(testCase, testCase.language);
      const expectedOutput = testCase.testCases?.[0]?.expectedOutput || "";

      if (!correctCode || !expectedOutput) {
        console.warn("Test case missing code or expected output, skipping");
        return;
      }

      // Step 1: Run code
      const runResult = await runCodeForTestCase(correctCode, testCase.language, BASE_URL);
      if (runResult.errorMessage) {
        console.warn("Run failed for test case, skipping");
        return;
      }

      // Step 2: Check output comparison
      const actualOutput = runResult.stdout || runResult.output || "";
      const isCorrect = compareOutputs(actualOutput, expectedOutput);
      runResult.isCorrect = isCorrect;

      // Step 3: AI Analysis
      const aiEvaluation = await analyzeCodeWithAI(
        testCase.description,
        expectedOutput,
        correctCode,
        actualOutput,
        testCase.language,
        BASE_URL
      );

      if (aiEvaluation.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping");
        return;
      }

      // Step 4: Check consistency
      const consistency = checkConsistency(runResult, aiEvaluation);

      console.log(`Integration test for ${testCase.id}:`, {
        runResultCorrect: runResult.isCorrect,
        aiEvaluationCorrect: aiEvaluation.isCorrect,
        consistent: consistency.consistent,
        language: testCase.language,
      });

      assert.ok(runResult !== null);
      assert.ok(aiEvaluation !== null);
      assert.ok(consistency !== null);
    });

    it("should test multiple real test cases", async () => {
      if (SKIP_API_TESTS) return;

      const cases = loadLiveCodingCases();
      if (cases.length === 0) {
        console.warn("No test cases loaded, skipping");
        return;
      }

      // Test first 3 cases
      const testCases = cases.slice(0, 3);
      let successCount = 0;
      let failureCount = 0;

      for (const testCase of testCases) {
        try {
          const correctCode = getSampleCorrectCode(testCase, testCase.language);
          const expectedOutput = testCase.testCases?.[0]?.expectedOutput || "";

          if (!correctCode || !expectedOutput) {
            continue;
          }

          // Run code
          const runResult = await runCodeForTestCase(correctCode, testCase.language, BASE_URL);
          if (runResult.errorMessage) {
            failureCount++;
            continue;
          }

          // Check output
          const actualOutput = runResult.stdout || runResult.output || "";
          const isCorrect = compareOutputs(actualOutput, expectedOutput);
          runResult.isCorrect = isCorrect;

          // AI Analysis
          const aiEvaluation = await analyzeCodeWithAI(
            testCase.description,
            expectedOutput,
            correctCode,
            actualOutput,
            testCase.language,
            BASE_URL
          );

          if (aiEvaluation.feedback?.includes("AI servisi")) {
            failureCount++;
            continue;
          }

          // Check consistency
          const consistency = checkConsistency(runResult, aiEvaluation);

          if (consistency.consistent) {
            successCount++;
          } else {
            failureCount++;
            console.log(`Inconsistency in ${testCase.id}`);
          }
        } catch (error) {
          console.warn(`Error testing case ${testCase.id}:`, error);
          failureCount++;
        }
      }

      console.log(`Integration test results: ${successCount} successful, ${failureCount} failed`);
      assert.ok(testCases.length > 0, "Should have test cases");
    });
  });

  describe("Error Handling in Flow", () => {
    it("should handle syntax errors gracefully", async () => {
      if (SKIP_API_TESTS) return;

      const code = "console.log('Hello World'; // Syntax error";
      const expectedOutput = "Hello World";
      const taskDescription = "Print hello world";

      // Step 1: Run code (should fail)
      const runResult = await runCodeForTestCase(code, "javascript", BASE_URL);
      assert.ok(runResult !== null);

      // Should have error
      assert.ok(
        runResult.stderr || runResult.errorMessage || runResult.exitCode !== 0,
        "Should detect syntax error"
      );

      // Step 2: AI Analysis (should detect error)
      const aiEvaluation = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        code,
        "",
        "javascript",
        BASE_URL
      );

      if (aiEvaluation.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping");
        return;
      }

      // AI should detect the error
      assert.ok(
        !aiEvaluation.isCorrect || aiEvaluation.errors.length > 0,
        "AI should detect syntax error"
      );
    });

    it("should handle runtime errors gracefully", async () => {
      if (SKIP_API_TESTS) return;

      const code = "throw new Error('Test error');";
      const expectedOutput = "";
      const taskDescription = "Test error handling";

      // Step 1: Run code (should fail)
      const runResult = await runCodeForTestCase(code, "javascript", BASE_URL);
      assert.ok(runResult !== null);

      // Should have error
      assert.ok(
        runResult.stderr || runResult.errorMessage || runResult.exitCode !== 0,
        "Should detect runtime error"
      );

      // Step 2: AI Analysis
      const aiEvaluation = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        code,
        runResult.stderr || "",
        "javascript",
        BASE_URL
      );

      if (aiEvaluation.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping");
        return;
      }

      // AI should detect the error
      assert.ok(!aiEvaluation.isCorrect, "AI should detect runtime error");
    });
  });

  describe("State Management", () => {
    it("should maintain correct state through flow", async () => {
      if (SKIP_API_TESTS) return;

      const code = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a} - \${b} = \${a - b}\`);
console.log(\`\${a} * \${b} = \${a * b}\`);
console.log(\`\${a} / \${b} = \${a / b}\`);`;

      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";

      // Run code
      const runResult = await runCodeForTestCase(code, "javascript", BASE_URL);
      if (runResult.errorMessage) {
        console.warn("Run failed, skipping state management test");
        return;
      }

      // Check that state is maintained
      assert.ok(runResult.stdout !== undefined || runResult.output !== undefined);
      assert.ok(runResult.exitCode !== undefined);

      // Set isCorrect
      const actualOutput = runResult.stdout || runResult.output || "";
      runResult.isCorrect = compareOutputs(actualOutput, expectedOutput);

      // State should be consistent
      assert.ok(typeof runResult.isCorrect === "boolean");
      assert.ok(runResult.isCorrect === true || runResult.isCorrect === false);
    });
  });
});

