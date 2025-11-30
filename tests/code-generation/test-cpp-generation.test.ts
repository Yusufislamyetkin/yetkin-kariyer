/**
 * C++ Code Generation Tests
 * Tests AI code generation for C++ to ensure complete, runnable code
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validateCodeCompleteness } from "@/lib/ai/code-validator";

describe("C++ Code Generation Tests", () => {
  const language = "cpp" as const;

  describe("Code Completeness Validation", () => {
    it("should detect missing main function", () => {
      const incompleteCode = `int a = 10;
int b = 5;
int toplam = a + b;
cout << a << " + " << b << " = " << toplam << endl;`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("int main")));
    });

    it("should detect missing iostream include when using cout", () => {
      const incompleteCode = `int main() {
    int a = 10;
    int b = 5;
    cout << a << " + " << b << " = " << (a + b) << endl;
    return 0;
}`;

      const result = validateCodeCompleteness(incompleteCode, language);
      assert.strictEqual(result.isComplete, false);
      assert.ok(result.missingElements.some((m) => m.includes("iostream")));
    });

    it("should validate complete code with includes and main function", () => {
      const completeCode = `#include <iostream>
using namespace std;

int main() {
    // İki sayı tanımla
    int a = 10;
    int b = 5;
    
    // Toplama işlemi
    int toplam = a + b;
    cout << a << " + " << b << " = " << toplam << endl;
    
    // Çıkarma işlemi
    int fark = a - b;
    cout << a << " - " << b << " = " << fark << endl;
    
    // Çarpma işlemi
    int carpma = a * b;
    cout << a << " * " << b << " = " << carpma << endl;
    
    // Bölme işlemi
    int bolme = a / b;
    cout << a << " / " << b << " = " << bolme << endl;
    
    return 0;
}`;

      const result = validateCodeCompleteness(completeCode, language);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.isComplete, true);
    });
  });

  describe("Arithmetic Operations Test Case", () => {
    it("should generate complete code for arithmetic operations", () => {
      const mockCorrectedCode = `#include <iostream>
using namespace std;

int main() {
    int a = 10; // İlk sayı
    int b = 5;  // İkinci sayı
    
    // Toplama işlemi
    int toplam = a + b;
    cout << a << " + " << b << " = " << toplam << endl;
    
    // Çıkarma işlemi
    int fark = a - b;
    cout << a << " - " << b << " = " << fark << endl;
    
    // Çarpma işlemi
    int carpma = a * b;
    cout << a << " * " << b << " = " << carpma << endl;
    
    // Bölme işlemi
    int bolme = a / b;
    cout << a << " / " << b << " = " << bolme << endl;
    
    return 0;
}`;

      const validation = validateCodeCompleteness(mockCorrectedCode, language);
      assert.strictEqual(validation.isComplete, true);
      assert.strictEqual(validation.isValid, true);
    });
  });
});

