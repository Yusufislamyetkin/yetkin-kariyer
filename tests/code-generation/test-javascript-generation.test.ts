/**
 * JavaScript Code Generation Tests
 * Tests AI code generation for JavaScript to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("JavaScript Code Generation Tests", () => {
  const language = "javascript" as const;

  describe("Code Completeness Validation", () => {
    it("should validate complete code with variable declarations", () => {
      const completeCode = `// İki sayı tanımla
const a = 10;
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
console.log(\`\${a} / \${b} = \${bolme}\`);`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
    });

    it("should detect code without output statements", () => {
      const codeWithoutOutput = `const a = 10;
const b = 5;
const toplam = a + b;`;

      const result = validateCodeCompleteness(codeWithoutOutput, language);
      // Should suggest adding output
      assert.ok(result.suggestions.length > 0);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `const a = 10; // İlk sayı
const b = 5;  // İkinci sayı

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
console.log(\`\${a} / \${b} = \${bolme}\`);`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

