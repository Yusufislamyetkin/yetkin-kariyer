/**
 * C# Code Generation Tests
 * Tests AI code generation for C# to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("C# Code Generation Tests", () => {
  const language = "csharp" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing class structure", () => {
      const incompleteCode = `int a = 10;
int b = 5;
int toplam = a + b;
Console.WriteLine($"{a} + {b} = {toplam}");`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("class")));
      assert.ok(result.missingElements.some((m) => m.includes("Main")));
    });

    it("should validate complete code with class and Main method", () => {
      const completeCode = `using System;

class Program {
    static void Main(string[] args) {
        // İki sayı tanımla
        int a = 10;
        int b = 5;
        
        // Toplama işlemi
        int toplam = a + b;
        Console.WriteLine($"{a} + {b} = {toplam}");
        
        // Çıkarma işlemi
        int fark = a - b;
        Console.WriteLine($"{a} - {b} = {fark}");
        
        // Çarpma işlemi
        int carpma = a * b;
        Console.WriteLine($"{a} * {b} = {carpma}");
        
        // Bölme işlemi
        int bolme = a / b;
        Console.WriteLine($"{a} / {b} = {bolme}");
    }
}`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.isComplete, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `using System;

class Program {
    static void Main(string[] args) {
        int a = 10; // İlk sayı
        int b = 5;  // İkinci sayı
        
        // Toplama işlemi
        int toplam = a + b;
        Console.WriteLine($"{a} + {b} = {toplam}");
        
        // Çıkarma işlemi
        int fark = a - b;
        Console.WriteLine($"{a} - {b} = {fark}");
        
        // Çarpma işlemi
        int carpma = a * b;
        Console.WriteLine($"{a} * {b} = {carpma}");
        
        // Bölme işlemi
        int bolme = a / b;
        Console.WriteLine($"{a} / {b} = {bolme}");
    }
}`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

