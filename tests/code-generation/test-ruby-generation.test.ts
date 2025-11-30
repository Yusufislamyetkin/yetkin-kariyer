/**
 * Ruby Code Generation Tests
 * Tests AI code generation for Ruby to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("Ruby Code Generation Tests", () => {
  const language = "ruby" as const;

  describe("Code Completeness Validation", () => {
    it("should validate complete code with variable definitions", () => {
      const completeCode = `# İki sayı tanımla
a = 10
b = 5

# Toplama işlemi
toplam = a + b
puts "#{a} + #{b} = #{toplam}"

# Çıkarma işlemi
fark = a - b
puts "#{a} - #{b} = #{fark}"

# Çarpma işlemi
carpma = a * b
puts "#{a} * #{b} = #{carpma}"

# Bölme işlemi
bolme = a / b
puts "#{a} / #{b} = #{bolme}"`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `a = 10  # İlk sayı
b = 5   # İkinci sayı

# Toplama işlemi
toplam = a + b
puts "#{a} + #{b} = #{toplam}"

# Çıkarma işlemi
fark = a - b
puts "#{a} - #{b} = #{fark}"

# Çarpma işlemi
carpma = a * b
puts "#{a} * #{b} = #{carpma}"

# Bölme işlemi
bolme = a / b
puts "#{a} / #{b} = #{bolme}"`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

