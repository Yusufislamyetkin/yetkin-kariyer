/**
 * Go Code Generation Tests
 * Tests AI code generation for Go to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("Go Code Generation Tests", () => {
  const language = "go" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing package main", () => {
      const incompleteCode = `a := 10
b := 5
toplam := a + b
fmt.Printf("%d + %d = %d\\n", a, b, toplam)`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("package")));
      assert.ok(result.missingElements.some((m) => m.includes("main")));
    });

    it("should detect missing main function", () => {
      const incompleteCode = `package main

import "fmt"

a := 10
b := 5`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("func main")));
    });

    it("should validate complete code with package and main function", () => {
      const completeCode = `package main

import "fmt"

func main() {
    // İki sayı tanımla
    a := 10
    b := 5
    
    // Toplama işlemi
    toplam := a + b
    fmt.Printf("%d + %d = %d\\n", a, b, toplam)
    
    // Çıkarma işlemi
    fark := a - b
    fmt.Printf("%d - %d = %d\\n", a, b, fark)
    
    // Çarpma işlemi
    carpma := a * b
    fmt.Printf("%d * %d = %d\\n", a, b, carpma)
    
    // Bölme işlemi
    bolme := a / b
    fmt.Printf("%d / %d = %d\\n", a, b, bolme)
}`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.isComplete, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `package main

import "fmt"

func main() {
    a := 10 // İlk sayı
    b := 5  // İkinci sayı
    
    // Toplama işlemi
    toplam := a + b
    fmt.Printf("%d + %d = %d\\n", a, b, toplam)
    
    // Çıkarma işlemi
    fark := a - b
    fmt.Printf("%d - %d = %d\\n", a, b, fark)
    
    // Çarpma işlemi
    carpma := a * b
    fmt.Printf("%d * %d = %d\\n", a, b, carpma)
    
    // Bölme işlemi
    bolme := a / b
    fmt.Printf("%d / %d = %d\\n", a, b, bolme)
}`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

