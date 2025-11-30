/**
 * TypeScript Code Generation Tests
 * Tests AI code generation for TypeScript to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("TypeScript Code Generation Tests", () => {
  const language = "typescript" as const;

  describe("Code Completeness Validation", () => {
    it("should validate complete code with type annotations", () => {
      const completeCode = `// İki sayı tanımla
const a: number = 10;
const b: number = 5;

// Toplama işlemi
const toplam: number = a + b;
console.log(\`\${a} + \${b} = \${toplam}\`);

// Çıkarma işlemi
const fark: number = a - b;
console.log(\`\${a} - \${b} = \${fark}\`);

// Çarpma işlemi
const carpma: number = a * b;
console.log(\`\${a} * \${b} = \${carpma}\`);

// Bölme işlemi
const bolme: number = a / b;
console.log(\`\${a} / \${b} = \${bolme}\`);`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `const a: number = 10; // İlk sayı
const b: number = 5;  // İkinci sayı

// Toplama işlemi
const toplam: number = a + b;
console.log(\`\${a} + \${b} = \${toplam}\`);

// Çıkarma işlemi
const fark: number = a - b;
console.log(\`\${a} - \${b} = \${fark}\`);

// Çarpma işlemi
const carpma: number = a * b;
console.log(\`\${a} * \${b} = \${carpma}\`);

// Bölme işlemi
const bolme: number = a / b;
console.log(\`\${a} / \${b} = \${bolme}\`);`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

