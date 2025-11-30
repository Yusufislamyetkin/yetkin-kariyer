/**
 * Rust Code Generation Tests
 * Tests AI code generation for Rust to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("Rust Code Generation Tests", () => {
  const language = "rust" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing main function", () => {
      const incompleteCode = `let a = 10;
let b = 5;
let toplam = a + b;
println!("{} + {} = {}", a, b, toplam);`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("fn main")));
    });

    it("should validate complete code with main function", () => {
      const completeCode = `fn main() {
    // İki sayı tanımla
    let a = 10;
    let b = 5;
    
    // Toplama işlemi
    let toplam = a + b;
    println!("{} + {} = {}", a, b, toplam);
    
    // Çıkarma işlemi
    let fark = a - b;
    println!("{} - {} = {}", a, b, fark);
    
    // Çarpma işlemi
    let carpma = a * b;
    println!("{} * {} = {}", a, b, carpma);
    
    // Bölme işlemi
    let bolme = a / b;
    println!("{} / {} = {}", a, b, bolme);
}`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.isComplete, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `fn main() {
    let a = 10; // İlk sayı
    let b = 5;  // İkinci sayı
    
    // Toplama işlemi
    let toplam = a + b;
    println!("{} + {} = {}", a, b, toplam);
    
    // Çıkarma işlemi
    let fark = a - b;
    println!("{} - {} = {}", a, b, fark);
    
    // Çarpma işlemi
    let carpma = a * b;
    println!("{} * {} = {}", a, b, carpma);
    
    // Bölme işlemi
    let bolme = a / b;
    println!("{} / {} = {}", a, b, bolme);
}`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

