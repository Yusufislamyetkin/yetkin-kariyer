/**
 * Code Validator - Validates and ensures code completeness for all supported languages
 */

export type LiveCodingLanguage =
  | "php"
  | "python"
  | "javascript"
  | "java"
  | "csharp"
  | "typescript"
  | "go"
  | "rust"
  | "cpp"
  | "kotlin"
  | "ruby";

export interface CodeValidationResult {
  isValid: boolean;
  isComplete: boolean;
  missingElements: string[];
  suggestions: string[];
  errors: Array<{ line?: number; description: string }>;
}

/**
 * Validates code completeness for a specific language
 */
export function validateCodeCompleteness(
  code: string,
  language: LiveCodingLanguage
): CodeValidationResult {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return {
      isValid: false,
      isComplete: false,
      missingElements: ["Kod boş"],
      suggestions: ["Kod içeriği eklenmeli"],
      errors: [{ description: "Kod boş" }],
    };
  }

  switch (language) {
    case "php":
      return validatePHP(trimmedCode);
    case "python":
      return validatePython(trimmedCode);
    case "javascript":
      return validateJavaScript(trimmedCode);
    case "java":
      return validateJava(trimmedCode);
    case "csharp":
      return validateCSharp(trimmedCode);
    case "typescript":
      return validateTypeScript(trimmedCode);
    case "go":
      return validateGo(trimmedCode);
    case "rust":
      return validateRust(trimmedCode);
    case "cpp":
      return validateCpp(trimmedCode);
    case "kotlin":
      return validateKotlin(trimmedCode);
    case "ruby":
      return validateRuby(trimmedCode);
    default:
      return {
        isValid: true,
        isComplete: true,
        missingElements: [],
        suggestions: [],
        errors: [],
      };
  }
}

/**
 * Validates PHP code completeness
 */
function validatePHP(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Check for PHP tags (optional but recommended)
  const hasPhpTags = code.includes("<?php") || code.startsWith("<?");
  if (!hasPhpTags && code.length > 0) {
    // PHP tags are optional in modern PHP, so this is just a suggestion
    suggestions.push("PHP etiketleri (<?php ... ?>) eklenebilir");
  }

  // Clean code: remove comments and strings before analysis
  const cleanedCode = cleanPHPCode(code);
  const lines = cleanedCode.split('\n');
  
  // First, extract all defined variables (on the left side of =)
  const definedVars = new Set<string>();
  
  lines.forEach((line) => {
    // Match variable definitions: $var = ... (but not inside strings - already cleaned)
    const defMatch = line.match(/^\s*\$([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (defMatch) {
      definedVars.add('$' + defMatch[1]);
    }
  });
  
  // Then, extract all used variables (excluding definitions) from cleaned code
  const variableUsagePattern = /\$[a-zA-Z_][a-zA-Z0-9_]*/g;
  const usedVars = new Set<string>();
  variableUsagePattern.lastIndex = 0;
  let match;
  
  while ((match = variableUsagePattern.exec(cleanedCode)) !== null) {
    const varName = match[0];
    // Check if this is a definition (on left side of =)
    const matchIndex = match.index;
    const lineStart = cleanedCode.lastIndexOf('\n', matchIndex) + 1;
    const lineEnd = cleanedCode.indexOf('\n', matchIndex);
    const line = cleanedCode.substring(lineStart, lineEnd === -1 ? cleanedCode.length : lineEnd);
    const beforeVar = line.substring(0, matchIndex - lineStart);
    
    // If variable is on the left side of =, it's a definition, not a usage
    const isDefinition = /^\s*\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/.test(beforeVar + varName);
    
    if (!isDefinition) {
      usedVars.add(varName);
    }
  }

  // Check for undefined variables (excluding superglobals and common PHP variables)
  const superglobals = new Set([
    "$_GET",
    "$_POST",
    "$_SESSION",
    "$_COOKIE",
    "$_SERVER",
    "$_ENV",
    "$GLOBALS",
    "$_FILES",
    "$_REQUEST",
  ]);

  usedVars.forEach((varName) => {
    if (!superglobals.has(varName) && !definedVars.has(varName)) {
      const varNameClean = varName.replace("$", "");
      missing.push(`Değişken tanımı eksik: ${varName}`);
      errors.push({
        description: `${varName} değişkeni kullanılmadan önce tanımlanmalı (örn: ${varName} = ...;)`,
      });
    }
  });

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates Python code completeness
 */
function validatePython(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Clean code: remove comments and strings before analysis
  const cleanedCode = cleanPythonCode(code);
  const lines = cleanedCode.split("\n");
  const originalLines = code.split("\n");
  
  const definedVars = new Set<string>();
  const importedModules = new Set<string>();
  const usedVars = new Set<string>();

  // First pass: collect defined variables and imports
  lines.forEach((line, index) => {
    // Check for imports
    const importMatch = line.match(/^(import|from)\s+(\w+)/);
    if (importMatch) {
      importedModules.add(importMatch[2]);
    }

    // Check for variable assignments (var = ...)
    const assignMatch = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (assignMatch) {
      definedVars.add(assignMatch[2]);
    }
  });

  // Second pass: identify variable usages (more conservative approach)
  lines.forEach((line, index) => {
    // Skip lines that are definitions, imports, or function/class declarations
    if (
      line.includes("=") ||
      line.includes("def ") ||
      line.includes("class ") ||
      line.includes("import ") ||
      line.includes("from ") ||
      line.trim().length === 0
    ) {
      return;
    }

    // Look for variable usages in expressions (more specific patterns)
    // Match identifiers that appear in contexts like: var_name, var_name(, var_name[, etc.
    const usagePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    let match;
    
    while ((match = usagePattern.exec(line)) !== null) {
      const varName = match[1];
      const lowerVar = varName.toLowerCase();
      
      // Skip if it's a keyword, built-in, defined variable, or imported module
      if (
        isPythonKeyword(lowerVar) ||
        isPythonBuiltin(lowerVar) ||
        definedVars.has(varName) ||
        importedModules.has(varName)
      ) {
        continue;
      }
      
      // Only add if it looks like a real variable usage (not part of a method call chain)
      // Check if it's followed by common operators or punctuation that suggests usage
      const afterMatch = line.substring(match.index + varName.length);
      const isLikelyUsage = /^\s*[=+\-*/(\[,;:}]/.test(afterMatch) || afterMatch.trim().length === 0;
      
      if (isLikelyUsage && varName.length > 1) { // Ignore single character variables
        usedVars.add(varName);
      }
    }
  });

  // Only suggest for variables that are used but not defined
  // Be very conservative - Python is dynamic, so we can't be sure
  usedVars.forEach((varName) => {
    if (!definedVars.has(varName) && !importedModules.has(varName)) {
      // Only add suggestion if it's a reasonable variable name (not too short, not all caps)
      if (varName.length >= 2 && varName !== varName.toUpperCase()) {
        suggestions.push(`${varName} değişkeninin tanımlı olduğundan emin olun`);
      }
    }
  });

  return {
    isValid: true, // Python is dynamic, so we can't be strict
    isComplete: true,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates JavaScript code completeness
 */
function validateJavaScript(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Check for variable declarations (let, const, var)
  const hasDeclarations = /(let|const|var)\s+\w+/.test(code);
  
  // Check for common undefined variable patterns
  const variablePattern = /(?:^|[^a-zA-Z0-9_])([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;,\)]/g;
  const declaredPattern = /(let|const|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  
  const declaredVars = new Set(
    Array.from(code.matchAll(declaredPattern)).map((m) => m[2])
  );

  // Check for console.log or other output statements
  const hasOutput = /console\.(log|error|warn|info)|alert\(|document\.write\(/.test(code);
  if (!hasOutput && code.trim().length > 30) {
    suggestions.push("Çıktı için console.log() veya benzeri bir yöntem eklenebilir");
  }

  return {
    isValid: true, // JavaScript is dynamic
    isComplete: hasDeclarations || code.length < 50,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates Java code completeness
 */
function validateJava(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Must have class definition
  if (!/public\s+class\s+\w+/.test(code)) {
    missing.push("public class Main yapısı eksik");
    errors.push({
      description: "Java kodu public class Main { ... } yapısında olmalı",
    });
  }

  // Must have main method
  if (!/public\s+static\s+void\s+main\s*\(/.test(code)) {
    missing.push("public static void main(String[] args) metodu eksik");
    errors.push({
      description: "Java kodu main metodu içermeli: public static void main(String[] args) { ... }",
    });
  }

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates C# code completeness
 */
function validateCSharp(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Must have class definition
  if (!/class\s+\w+/.test(code)) {
    missing.push("class yapısı eksik");
    errors.push({
      description: "C# kodu class Program { ... } yapısında olmalı",
    });
  }

  // Must have Main method
  if (!/static\s+void\s+Main\s*\(/.test(code)) {
    missing.push("static void Main(string[] args) metodu eksik");
    errors.push({
      description: "C# kodu Main metodu içermeli: static void Main(string[] args) { ... }",
    });
  }

  // Should have using statements for common operations
  if (code.includes("Console.WriteLine") && !code.includes("using System")) {
    suggestions.push("using System; eklenebilir");
  }

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates TypeScript code completeness
 */
function validateTypeScript(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Similar to JavaScript but with type annotations
  const hasTypeAnnotations = /:\s*(number|string|boolean|any)/.test(code);
  if (!hasTypeAnnotations && code.length > 50) {
    suggestions.push("TypeScript için tip tanımlamaları eklenebilir (örn: const a: number = 10;)");
  }

  return {
    isValid: true,
    isComplete: true,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates Go code completeness
 */
function validateGo(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Must have package main
  if (!/^package\s+main/.test(code)) {
    missing.push("package main eksik");
    errors.push({
      description: "Go kodu 'package main' ile başlamalı",
    });
  }

  // Must have main function
  if (!/func\s+main\s*\(/.test(code)) {
    missing.push("func main() fonksiyonu eksik");
    errors.push({
      description: "Go kodu func main() { ... } fonksiyonu içermeli",
    });
  }

  // Check for fmt import if using fmt functions
  if (code.includes("fmt.") && !code.includes('import "fmt"') && !code.includes('import (')) {
    missing.push('import "fmt" eksik');
    errors.push({
      description: 'fmt paketi kullanılıyorsa import "fmt" eklenmeli',
    });
  }

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates Rust code completeness
 */
function validateRust(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Must have main function
  if (!/fn\s+main\s*\(/.test(code)) {
    missing.push("fn main() fonksiyonu eksik");
    errors.push({
      description: "Rust kodu fn main() { ... } fonksiyonu içermeli",
    });
  }

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates C++ code completeness
 */
function validateCpp(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Must have main function
  if (!/int\s+main\s*\(/.test(code)) {
    missing.push("int main() fonksiyonu eksik");
    errors.push({
      description: "C++ kodu int main() { ... } fonksiyonu içermeli",
    });
  }

  // Should have iostream include if using cout
  if (code.includes("cout") && !code.includes("#include <iostream>")) {
    missing.push("#include <iostream> eksik");
    errors.push({
      description: "cout kullanılıyorsa #include <iostream> eklenmeli",
    });
  }

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates Kotlin code completeness
 */
function validateKotlin(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Must have main function
  if (!/fun\s+main\s*\(/.test(code)) {
    missing.push("fun main() fonksiyonu eksik");
    errors.push({
      description: "Kotlin kodu fun main() { ... } fonksiyonu içermeli",
    });
  }

  return {
    isValid: missing.length === 0,
    isComplete: missing.length === 0,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Validates Ruby code completeness
 */
function validateRuby(code: string): CodeValidationResult {
  const missing: string[] = [];
  const suggestions: string[] = [];
  const errors: Array<{ line?: number; description: string }> = [];

  // Ruby is very flexible, just check for basic structure
  // Check for variable assignments
  const hasAssignments = /^\s*\w+\s*=/.test(code);
  if (!hasAssignments && code.length > 50) {
    suggestions.push("Değişken tanımlamaları eklenebilir");
  }

  return {
    isValid: true,
    isComplete: true,
    missingElements: missing,
    suggestions,
    errors,
  };
}

/**
 * Helper: Remove comments and strings from Python code
 */
function cleanPythonCode(code: string): string {
  let cleaned = code;
  
  // Remove single-line comments (# ...)
  cleaned = cleaned.replace(/#.*$/gm, '');
  
  // Remove multi-line comments (""" ... """ or ''' ... ''')
  cleaned = cleaned.replace(/""".*?"""/gs, '');
  cleaned = cleaned.replace(/'''.*?'''/gs, '');
  
  // Remove string literals (both single and double quotes)
  // Handle triple quotes first (already done above)
  // Then handle single-line strings
  // We need to be careful with escaped quotes
  const stringPatterns = [
    /"[^"\\]*(\\.[^"\\]*)*"/g,  // Double-quoted strings
    /'[^'\\]*(\\.[^'\\]*)*'/g,  // Single-quoted strings
  ];
  
  stringPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned;
}

/**
 * Helper: Remove comments and strings from PHP code
 */
function cleanPHPCode(code: string): string {
  let cleaned = code;
  
  // Remove single-line comments (// ...)
  cleaned = cleaned.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments (/* ... */)
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove string literals (both single and double quotes)
  // Handle heredoc/nowdoc later if needed, but for now focus on simple strings
  const stringPatterns = [
    /"[^"\\]*(\\.[^"\\]*)*"/g,  // Double-quoted strings
    /'[^'\\]*(\\.[^'\\]*)*'/g,  // Single-quoted strings
  ];
  
  stringPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned;
}

/**
 * Helper: Check if a string is a Python keyword
 */
function isPythonKeyword(word: string): boolean {
  const keywords = new Set([
    "and",
    "as",
    "assert",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
  ]);
  return keywords.has(word.toLowerCase());
}

/**
 * Helper: Check if a string is a Python built-in
 */
function isPythonBuiltin(word: string): boolean {
  const builtins = new Set([
    "abs",
    "all",
    "any",
    "ascii",
    "bin",
    "bool",
    "bytearray",
    "bytes",
    "chr",
    "classmethod",
    "compile",
    "complex",
    "delattr",
    "dict",
    "dir",
    "divmod",
    "enumerate",
    "eval",
    "exec",
    "filter",
    "float",
    "format",
    "frozenset",
    "getattr",
    "globals",
    "hasattr",
    "hash",
    "help",
    "hex",
    "id",
    "input",
    "int",
    "isinstance",
    "issubclass",
    "iter",
    "len",
    "list",
    "locals",
    "map",
    "max",
    "memoryview",
    "min",
    "next",
    "object",
    "oct",
    "open",
    "ord",
    "pow",
    "print",
    "property",
    "range",
    "repr",
    "reversed",
    "round",
    "set",
    "setattr",
    "slice",
    "sorted",
    "staticmethod",
    "str",
    "sum",
    "super",
    "tuple",
    "type",
    "vars",
    "zip",
  ]);
  return builtins.has(word.toLowerCase());
}

