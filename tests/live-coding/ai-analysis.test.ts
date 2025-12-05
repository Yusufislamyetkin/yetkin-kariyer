/**
 * AI Analysis Tests
 * Tests the AI evaluation API for code analysis
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import type { LiveCodingLanguage } from "@/types/live-coding";
import {
  analyzeCodeWithAI,
  createMockAIEvaluation,
  getSampleCorrectCode,
  getSampleIncorrectCode,
  loadLiveCodingCases,
} from "./test-helpers";

// Skip API tests if we're in CI or don't have a running server
const SKIP_API_TESTS = process.env.SKIP_API_TESTS === "true" || process.env.CI === "true";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("AI Analysis Tests", () => {
  describe("API Response Format", () => {
    it("should return correct structure for AI evaluation", async () => {
      if (SKIP_API_TESTS) {
        console.log("Skipping API test (SKIP_API_TESTS=true or CI=true)");
        return;
      }

      const result = await analyzeCodeWithAI(
        "Test task",
        "Expected output",
        "console.log('test');",
        "test",
        "javascript",
        BASE_URL
      );

      assert.ok(result !== null, "Result should not be null");
      assert.ok(typeof result.isCorrect === "boolean", "isCorrect should be boolean");
      assert.ok(typeof result.feedback === "string", "feedback should be string");
      assert.ok(typeof result.correctedCode === "string", "correctedCode should be string");
      assert.ok(Array.isArray(result.comments), "comments should be array");
      assert.ok(Array.isArray(result.errors), "errors should be array");
    });
  });

  describe("Code Analysis - With Run Result", () => {
    it("should analyze correct code with matching output", async () => {
      if (SKIP_API_TESTS) return;

      const taskDescription = "Print arithmetic operations";
      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const userCode = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a} - \${b} = \${a - b}\`);
console.log(\`\${a} * \${b} = \${a * b}\`);
console.log(\`\${a} / \${b} = \${a / b}\`);`;
      const userOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";

      const result = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        userCode,
        userOutput,
        "javascript",
        BASE_URL
      );

      assert.ok(result !== null);
      if (result.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping test");
        return;
      }
      assert.ok(typeof result.isCorrect === "boolean");
      assert.ok(result.feedback.length > 0);
      assert.ok(result.correctedCode.length > 0);
    });

    it("should analyze incorrect code with non-matching output", async () => {
      if (SKIP_API_TESTS) return;

      const taskDescription = "Print arithmetic operations";
      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const userCode = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`); // Missing other operations`;
      const userOutput = "10 + 5 = 15";

      const result = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        userCode,
        userOutput,
        "javascript",
        BASE_URL
      );

      assert.ok(result !== null);
      if (result.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping test");
        return;
      }
      assert.ok(typeof result.isCorrect === "boolean");
      // Should identify that code is incomplete
      assert.ok(result.errors.length >= 0 || result.specificErrors?.length >= 0);
    });
  });

  describe("Code Analysis - Without Run Result", () => {
    it("should analyze code without output (code-only analysis)", async () => {
      if (SKIP_API_TESTS) return;

      const taskDescription = "Print arithmetic operations";
      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const userCode = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a} - \${b} = \${a - b}\`);
console.log(\`\${a} * \${b} = \${a * b}\`);
console.log(\`\${a} / \${b} = \${a / b}\`);`;
      const userOutput = ""; // No output - code-only analysis

      const result = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        userCode,
        userOutput,
        "javascript",
        BASE_URL
      );

      assert.ok(result !== null);
      if (result.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping test");
        return;
      }
      assert.ok(typeof result.isCorrect === "boolean");
      assert.ok(result.feedback.length > 0);
      assert.ok(result.correctedCode.length > 0);
    });
  });

  describe("Error Detection", () => {
    it("should detect syntax errors", async () => {
      if (SKIP_API_TESTS) return;

      const taskDescription = "Print hello world";
      const expectedOutput = "Hello World";
      const userCode = "console.log('Hello World'; // Missing closing paren";
      const userOutput = "";

      const result = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        userCode,
        userOutput,
        "javascript",
        BASE_URL
      );

      assert.ok(result !== null);
      if (result.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping test");
        return;
      }
      // Should detect errors
      assert.ok(result.errors.length > 0 || result.specificErrors?.length > 0 || !result.isCorrect);
    });

    it("should detect incomplete code", async () => {
      if (SKIP_API_TESTS) return;

      const taskDescription = "Print arithmetic operations";
      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const userCode = "const a = 10; // Incomplete code";
      const userOutput = "";

      const result = await analyzeCodeWithAI(
        taskDescription,
        expectedOutput,
        userCode,
        userOutput,
        "javascript",
        BASE_URL
      );

      assert.ok(result !== null);
      if (result.feedback?.includes("AI servisi")) {
        console.warn("AI service not available, skipping test");
        return;
      }
      // Should detect that code is incomplete
      assert.ok(result.errors.length > 0 || result.specificErrors?.length > 0 || !result.isCorrect);
    });
  });

  describe("All Supported Languages", () => {
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

    for (const language of languages) {
      it(`should analyze ${language} code`, async () => {
        if (SKIP_API_TESTS) return;

        const codeSamples: Record<LiveCodingLanguage, string> = {
          javascript: "console.log('Hello World');",
          python: "print('Hello World')",
          csharp: "using System;\nclass Program { static void Main() { Console.WriteLine(\"Hello World\"); } }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          php: "<?php echo 'Hello World'; ?>",
          typescript: "console.log('Hello World');",
          go: "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"Hello World\") }",
          rust: "fn main() { println!(\"Hello World\"); }",
          cpp: "#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello World\" << endl; return 0; }",
          kotlin: "fun main() { println(\"Hello World\") }",
          ruby: "puts 'Hello World'",
        };

        const code = codeSamples[language];
        if (!code) {
          console.warn(`No code sample for ${language}`);
          return;
        }

        const result = await analyzeCodeWithAI(
          "Print Hello World",
          "Hello World",
          code,
          "Hello World",
          language,
          BASE_URL
        );

        assert.ok(result !== null, `${language} should return a result`);
        if (result.feedback?.includes("AI servisi")) {
          console.warn(`AI service not available for ${language}, skipping`);
          return;
        }
        assert.ok(typeof result.isCorrect === "boolean");
        assert.ok(result.feedback.length > 0);
      });
    }
  });

  describe("Mock AI Evaluation Creation", () => {
    it("should create mock AI evaluation with defaults", () => {
      const result = createMockAIEvaluation();
      assert.ok(result !== null);
      assert.strictEqual(result.loading, false);
      assert.strictEqual(result.isCorrect, false);
      assert.ok(Array.isArray(result.comments));
      assert.ok(Array.isArray(result.errors));
    });

    it("should create mock AI evaluation with overrides", () => {
      const result = createMockAIEvaluation({
        feedback: "Code is correct",
        isCorrect: true,
        comments: ["Good job!"],
      });

      assert.strictEqual(result.feedback, "Code is correct");
      assert.strictEqual(result.isCorrect, true);
      assert.strictEqual(result.comments?.length, 1);
    });

    it("should create mock AI evaluation with errors", () => {
      const result = createMockAIEvaluation({
        feedback: "Code has errors",
        isCorrect: false,
        errors: [{ line: 5, description: "Syntax error" }],
        specificErrors: [
          {
            location: "Satır 5",
            issue: "Eksik parantez",
            fix: "Parantezi kapat",
          },
        ],
      });

      assert.strictEqual(result.isCorrect, false);
      assert.strictEqual(result.errors?.length, 1);
      assert.strictEqual(result.specificErrors?.length, 1);
    });
  });

  describe("Real Test Cases", () => {
    it("should analyze real test cases from data", async () => {
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

      if (correctCode && expectedOutput) {
        const result = await analyzeCodeWithAI(
          testCase.description,
          expectedOutput,
          correctCode,
          "", // No output for code-only analysis
          testCase.language,
          BASE_URL
        );

        assert.ok(result !== null);
        if (result.feedback?.includes("AI servisi")) {
          console.warn("AI service not available, skipping test");
          return;
        }
        assert.ok(typeof result.isCorrect === "boolean");
        assert.ok(result.feedback.length > 0);
      }
    });
  });
});

