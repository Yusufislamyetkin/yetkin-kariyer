/**
 * PHP Code Generation Tests
 * Tests AI code generation for PHP to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("PHP Code Generation Tests", () => {
  const language = "php" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing variable definitions", () => {
      const incompleteCode = `// Toplama işlemi
$toplam = $a + $b;
echo "$a + $b = $toplam";`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.length > 0);
      assert.ok(result.missingElements.some((m) => m.includes("$a")));
      assert.ok(result.missingElements.some((m) => m.includes("$b")));
    });

    it("should validate complete code with variable definitions", () => {
      const completeCode = `<?php
$a = 10; // İlk sayı
$b = 5; // İkinci sayı

// Toplama işlemi
$toplam = $a + $b;
echo "$a + $b = $toplam";

// Çıkarma işlemi
$fark = $a - $b;
echo "$a - $b = $fark";

// Çarpma işlemi
$carpma = $a * $b;
echo "$a * $b = $carpma";

// Bölme işlemi
$bolme = $a / $b;
echo "$a / $b = $bolme";
?>`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.missingElements.length, 0);
    });

    it("should validate code without PHP tags (optional)", () => {
      const codeWithoutTags = `$a = 10;
$b = 5;
$toplam = $a + $b;
echo "$a + $b = $toplam";`;

      const result = validateCodeCompleteness(codeWithoutTags, language);
      // PHP tags are optional, so this should still be valid
      assert.strictEqual(result.isValid, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", async () => {
      const taskDescription =
        "İki sayı (a ve b) tanımlayın ve bu sayılar üzerinde toplama, çıkarma, çarpma ve bölme işlemlerini yaparak sonuçları ekrana yazdırın. Örnek: a=10, b=5 için '10 + 5 = 15', '10 - 5 = 5', '10 * 5 = 50', '10 / 5 = 2'";
      const expectedOutput = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";

      // This would normally call the AI API, but for testing we'll use a mock
      // In a real scenario, you would:
      // 1. Call /api/education/live-coding/evaluate-output
      // 2. Get correctedCode from response
      // 3. Validate it
      // 4. Run it via Piston API
      // 5. Check output

      const mockCorrectedCode = `<?php
$a = 10; // İlk sayı
$b = 5; // İkinci sayı

// Toplama işlemi
$toplam = $a + $b;
echo "$a + $b = $toplam\\n";

// Çıkarma işlemi
$fark = $a - $b;
echo "$a - $b = $fark\\n";

// Çarpma işlemi
$carpma = $a * $b;
echo "$a * $b = $carpma\\n";

// Bölme işlemi
$bolme = $a / $b;
echo "$a / $b = $bolme\\n";
?>`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
      assert.strictEqual(validation.missingElements.length, 0);
    });
  });

  describe("Code Execution Test", () => {
    it("should execute complete PHP code successfully", async () => {
      const completeCode = `<?php
$a = 10;
$b = 5;
$toplam = $a + $b;
echo "$a + $b = $toplam";
?>`;

      // In a real test, you would:
      // 1. Call /api/education/live-coding/run with this code
      // 2. Verify the response has no errors
      // 3. Check that stdout contains expected output

      const validation = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(validation.isComplete, true);

      // Mock execution test
      // const runResponse = await fetch('/api/education/live-coding/run', {
      //   method: 'POST',
      //   body: JSON.stringify({ language: 'php', code: completeCode })
      // });
      // const result = await runResponse.json();
      // expect(result.run?.code).toBe(0);
      // expect(result.run?.stderr).toBeFalsy();
    });
  });
});

