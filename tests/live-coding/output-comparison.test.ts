/**
 * Output Comparison Tests
 * Tests the normalizeOutput and compareOutputs functions
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { normalizeOutput, compareOutputs } from "./test-helpers";

describe("Output Comparison Tests", () => {
  describe("normalizeOutput", () => {
    it("should trim whitespace", () => {
      const input = "  hello world  ";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "hello world");
    });

    it("should normalize line endings (CRLF to LF)", () => {
      const input = "line1\r\nline2\r\nline3";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "line1\nline2\nline3");
    });

    it("should normalize line endings (CR to LF)", () => {
      const input = "line1\rline2\rline3";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "line1\nline2\nline3");
    });

    it("should normalize multiple newlines", () => {
      const input = "line1\n\n\n\nline2";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "line1\n\nline2");
    });

    it("should normalize spaces and tabs", () => {
      const input = "hello    world\t\t\there";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "hello world here");
    });

    it("should remove trailing spaces from lines", () => {
      const input = "line1   \nline2   \nline3";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "line1\nline2\nline3");
    });

    it("should remove leading spaces from lines", () => {
      const input = "line1\n   line2\n   line3";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "line1\nline2\nline3");
    });

    it("should handle empty string", () => {
      const input = "";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "");
    });

    it("should handle string with only whitespace", () => {
      const input = "   \n\t  \n  ";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "");
    });

    it("should preserve content structure", () => {
      const input = "Hello World 1\nHello World 2\nHello World 3";
      const result = normalizeOutput(input);
      assert.strictEqual(result, "Hello World 1\nHello World 2\nHello World 3");
    });
  });

  describe("compareOutputs - Exact Match", () => {
    it("should match identical outputs", () => {
      const actual = "Hello World";
      const expected = "Hello World";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should match outputs with normalized whitespace", () => {
      const actual = "Hello   World";
      const expected = "Hello World";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should match outputs with different line endings", () => {
      const actual = "line1\r\nline2";
      const expected = "line1\nline2";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should not match different outputs", () => {
      const actual = "Hello World";
      const expected = "Goodbye World";
      assert.strictEqual(compareOutputs(actual, expected), false);
    });

    it("should match multi-line outputs", () => {
      const actual = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const expected = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });
  });

  describe("compareOutputs - Partial Match (with ...)", () => {
    it("should match partial output with ... at start", () => {
      const actual = "Hello World 1\nHello World 2\nHello World 3\nHello World 50";
      const expected = "...\nHello World 50";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should match partial output with ... at end", () => {
      const actual = "Hello World 1\nHello World 2\nHello World 3\nHello World 50";
      const expected = "Hello World 1\n...";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should match partial output with ... in middle", () => {
      const actual = "Hello World 1\nHello World 2\nHello World 3\nHello World 50";
      const expected = "Hello World 1\n...\nHello World 50";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should not match if start doesn't match", () => {
      const actual = "Goodbye World 1\nHello World 2";
      const expected = "Hello World 1\n...";
      assert.strictEqual(compareOutputs(actual, expected), false);
    });

    it("should not match if end doesn't match", () => {
      const actual = "Hello World 1\nGoodbye World 2";
      const expected = "...\nHello World 50";
      assert.strictEqual(compareOutputs(actual, expected), false);
    });

    it("should handle real case from test data", () => {
      const actual = "Hello World 1\nHello World 2\nHello World 3\nHello World 4\nHello World 5\n...\nHello World 50";
      const expected = "Hello World 1\nHello World 2\nHello World 3\n...\nHello World 50";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });
  });

  describe("compareOutputs - Edge Cases", () => {
    it("should handle empty strings", () => {
      assert.strictEqual(compareOutputs("", ""), true);
    });

    it("should handle empty actual with non-empty expected", () => {
      assert.strictEqual(compareOutputs("", "Hello"), false);
    });

    it("should handle non-empty actual with empty expected", () => {
      assert.strictEqual(compareOutputs("Hello", ""), false);
    });

    it("should handle outputs with extra trailing newlines", () => {
      const actual = "Hello World\n\n\n";
      const expected = "Hello World";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should handle outputs with extra leading newlines", () => {
      const actual = "\n\n\nHello World";
      const expected = "Hello World";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should handle outputs with mixed whitespace", () => {
      const actual = "  Hello   World  \n  Test  ";
      const expected = "Hello World\nTest";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });
  });

  describe("compareOutputs - Real Test Cases", () => {
    it("should match arithmetic operations output", () => {
      const actual = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      const expected = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should match arithmetic operations with whitespace differences", () => {
      const actual = "10 + 5 = 15  \n  10 - 5 = 5  \n  10 * 5 = 50  \n  10 / 5 = 2  ";
      const expected = "10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });

    it("should match number sequence with partial match", () => {
      const actual = "Hello World 1\nHello World 2\nHello World 3\nHello World 4\nHello World 5\nHello World 6\nHello World 7\nHello World 8\nHello World 9\nHello World 10\n...\nHello World 50";
      const expected = "Hello World 1\nHello World 2\nHello World 3\n...\nHello World 50";
      assert.strictEqual(compareOutputs(actual, expected), true);
    });
  });
});

