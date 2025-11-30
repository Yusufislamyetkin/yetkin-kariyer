/**
 * Kotlin Code Generation Tests
 * Tests AI code generation for Kotlin to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("Kotlin Code Generation Tests", () => {
  const language = "kotlin" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing main function", () => {
      const incompleteCode = `val a = 10
val b = 5
val toplam = a + b
println("$a + $b = $toplam")`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("fun main")));
    });

    it("should validate complete code with main function", () => {
      const completeCode = `fun main() {
    // İki sayı tanımla
    val a = 10
    val b = 5
    
    // Toplama işlemi
    val toplam = a + b
    println("$a + $b = $toplam")
    
    // Çıkarma işlemi
    val fark = a - b
    println("$a - $b = $fark")
    
    // Çarpma işlemi
    val carpma = a * b
    println("$a * $b = $carpma")
    
    // Bölme işlemi
    val bolme = a / b
    println("$a / $b = $bolme")
}`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.isComplete, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `fun main() {
    val a = 10 // İlk sayı
    val b = 5  // İkinci sayı
    
    // Toplama işlemi
    val toplam = a + b
    println("$a + $b = $toplam")
    
    // Çıkarma işlemi
    val fark = a - b
    println("$a - $b = $fark")
    
    // Çarpma işlemi
    val carpma = a * b
    println("$a * $b = $carpma")
    
    // Bölme işlemi
    val bolme = a / b
    println("$a / $b = $bolme")
}`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

