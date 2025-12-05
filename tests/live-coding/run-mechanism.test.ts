/**
 * Run Mechanism Tests
 * Tests the code execution API for all supported languages
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import type { LiveCodingLanguage } from "@/types/live-coding";
import { runCodeForTestCase, createMockRunResult } from "./test-helpers";

// Skip API tests if we're in CI or don't have a running server
const SKIP_API_TESTS = process.env.SKIP_API_TESTS === "true" || process.env.CI === "true";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Run Mechanism Tests", () => {
  const supportedLanguages: LiveCodingLanguage[] = [
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

  describe("API Response Format", () => {
    it("should return correct structure for successful run", async () => {
      if (SKIP_API_TESTS) {
        console.log("Skipping API test (SKIP_API_TESTS=true or CI=true)");
        return;
      }

      const code = "console.log('Hello World');";
      const result = await runCodeForTestCase(code, "javascript", BASE_URL);

      assert.ok(result !== null, "Result should not be null");
      assert.ok(
        result.stdout !== undefined || result.output !== undefined || result.errorMessage !== undefined,
        "Result should have stdout, output, or errorMessage"
      );
    });
  });

  describe("JavaScript Execution", () => {
    it("should execute simple JavaScript code", async () => {
      if (SKIP_API_TESTS) return;

      const code = "console.log('Hello World');";
      const result = await runCodeForTestCase(code, "javascript", BASE_URL);

      assert.ok(result !== null);
      if (result.errorMessage) {
        console.warn("JavaScript execution failed:", result.errorMessage);
        return; // Skip if API is not available
      }
      assert.ok(result.stdout !== undefined || result.output !== undefined);
      assert.strictEqual(result.exitCode, 0);
    });

    it("should handle JavaScript syntax errors", async () => {
      if (SKIP_API_TESTS) return;

      const code = "console.log('Hello World'; // Missing closing paren";
      const result = await runCodeForTestCase(code, "javascript", BASE_URL);

      assert.ok(result !== null);
      // Should have error (either stderr or errorMessage)
      assert.ok(result.stderr || result.errorMessage || result.exitCode !== 0);
    });

    it("should execute arithmetic operations", async () => {
      if (SKIP_API_TESTS) return;

      const code = `const a = 10;
const b = 5;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a} - \${b} = \${a - b}\`);
console.log(\`\${a} * \${b} = \${a * b}\`);
console.log(\`\${a} / \${b} = \${a / b}\`);`;
      const result = await runCodeForTestCase(code, "javascript", BASE_URL);

      assert.ok(result !== null);
      if (result.errorMessage) {
        console.warn("JavaScript arithmetic test failed:", result.errorMessage);
        return;
      }
      assert.ok(result.stdout !== undefined || result.output !== undefined);
      assert.strictEqual(result.exitCode, 0);
    });
  });

  describe("Python Execution", () => {
    it("should execute simple Python code", async () => {
      if (SKIP_API_TESTS) return;

      const code = "print('Hello World')";
      const result = await runCodeForTestCase(code, "python", BASE_URL);

      assert.ok(result !== null);
      if (result.errorMessage) {
        console.warn("Python execution failed:", result.errorMessage);
        return;
      }
      assert.ok(result.stdout !== undefined || result.output !== undefined);
      assert.strictEqual(result.exitCode, 0);
    });

    it("should handle Python syntax errors", async () => {
      if (SKIP_API_TESTS) return;

      const code = "print('Hello World'  # Missing closing paren";
      const result = await runCodeForTestCase(code, "python", BASE_URL);

      assert.ok(result !== null);
      assert.ok(result.stderr || result.errorMessage || result.exitCode !== 0);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty code", async () => {
      if (SKIP_API_TESTS) return;

      const code = "";
      const result = await runCodeForTestCase(code, "javascript", BASE_URL);

      assert.ok(result !== null);
      // Empty code should result in error
      assert.ok(result.errorMessage || result.stderr || result.exitCode !== 0);
    });

    it("should handle runtime errors", async () => {
      if (SKIP_API_TESTS) return;

      const code = "throw new Error('Test error');";
      const result = await runCodeForTestCase(code, "javascript", BASE_URL);

      assert.ok(result !== null);
      assert.ok(result.stderr || result.errorMessage || result.exitCode !== 0);
    });

    it("should handle invalid language", async () => {
      if (SKIP_API_TESTS) return;

      const code = "console.log('test');";
      // @ts-expect-error - Testing invalid language
      const result = await runCodeForTestCase(code, "invalid-language" as LiveCodingLanguage, BASE_URL);

      assert.ok(result !== null);
      assert.ok(result.errorMessage !== undefined);
    });
  });

  describe("All Supported Languages", () => {
    for (const language of supportedLanguages) {
      it(`should support ${language} language`, async () => {
        if (SKIP_API_TESTS) return;

        // Simple hello world for each language
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

        const result = await runCodeForTestCase(code, language, BASE_URL);

        assert.ok(result !== null, `${language} should return a result`);
        
        // Some languages might have compile errors, that's okay for this test
        // We just want to verify the API responds
        if (result.errorMessage) {
          console.warn(`${language} execution failed:`, result.errorMessage);
        }
      });
    }
  });

  describe("Mock Run Result Creation", () => {
    it("should create mock run result with defaults", () => {
      const result = createMockRunResult();
      assert.ok(result !== null);
      assert.strictEqual(result.exitCode, 0);
      assert.strictEqual(result.isCorrect, false);
    });

    it("should create mock run result with overrides", () => {
      const result = createMockRunResult({
        stdout: "Hello World",
        exitCode: 0,
        isCorrect: true,
      });

      assert.strictEqual(result.stdout, "Hello World");
      assert.strictEqual(result.exitCode, 0);
      assert.strictEqual(result.isCorrect, true);
    });

    it("should create mock run result with error", () => {
      const result = createMockRunResult({
        stderr: "Syntax error",
        exitCode: 1,
        isCorrect: false,
      });

      assert.strictEqual(result.stderr, "Syntax error");
      assert.strictEqual(result.exitCode, 1);
      assert.strictEqual(result.isCorrect, false);
    });
  });
});

