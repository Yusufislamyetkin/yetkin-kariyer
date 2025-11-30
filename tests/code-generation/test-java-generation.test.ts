/**
 * Java Code Generation Tests
 * Tests AI code generation for Java to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("Java Code Generation Tests", () => {
  const language = "java" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing class structure", () => {
      const incompleteCode = `int a = 10;
int b = 5;
int toplam = a + b;
System.out.println(a + " + " + b + " = " + toplam);`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("class")));
      assert.ok(result.missingElements.some((m) => m.includes("main")));
    });

    it("should validate complete code with class and main method", () => {
      const completeCode = `public class Main {
    public static void main(String[] args) {
        // İki sayı tanımla
        int a = 10;
        int b = 5;
        
        // Toplama işlemi
        int toplam = a + b;
        System.out.println(a + " + " + b + " = " + toplam);
        
        // Çıkarma işlemi
        int fark = a - b;
        System.out.println(a + " - " + b + " = " + fark);
        
        // Çarpma işlemi
        int carpma = a * b;
        System.out.println(a + " * " + b + " = " + carpma);
        
        // Bölme işlemi
        int bolme = a / b;
        System.out.println(a + " / " + b + " = " + bolme);
    }
}`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.isComplete, true);
      assert.strictEqual(result.missingElements.length, 0);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `public class Main {
    public static void main(String[] args) {
        int a = 10; // İlk sayı
        int b = 5;  // İkinci sayı
        
        // Toplama işlemi
        int toplam = a + b;
        System.out.println(a + " + " + b + " = " + toplam);
        
        // Çıkarma işlemi
        int fark = a - b;
        System.out.println(a + " - " + b + " = " + fark);
        
        // Çarpma işlemi
        int carpma = a * b;
        System.out.println(a + " * " + b + " = " + carpma);
        
        // Bölme işlemi
        int bolme = a / b;
        System.out.println(a + " / " + b + " = " + bolme);
    }
}`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

