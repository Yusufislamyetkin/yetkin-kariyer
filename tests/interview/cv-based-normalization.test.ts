/**
 * CV-Based Interview Normalization Tests
 * Tests question normalization functions for CV-based interviews
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { formatQuestionsForInterview } from "@/lib/ai/interview-generator";

describe("CV-Based Interview Normalization Tests", () => {
  describe("formatQuestionsForInterview", () => {
    it("should format questions from stage structure to array", () => {
      const mockQuestions = {
        stage1_introduction: [
          {
            id: "intro_1",
            type: "behavioral",
            question: "Kendinizi tanıtır mısınız?",
          },
          {
            id: "intro_2",
            type: "behavioral",
            question: "Neden bu pozisyonu istiyorsunuz?",
          },
        ],
        stage2_experience: [
          {
            id: "exp_1",
            type: "behavioral",
            question: "En önemli projeniz hangisiydi?",
          },
        ],
        stage3_technical: {
          testQuestions: [
            {
              id: "tech_1",
              type: "technical",
              question: "JavaScript'te closure nedir?",
            },
            {
              id: "tech_2",
              type: "technical",
              question: "React'te state ve props arasındaki fark nedir?",
            },
          ],
          liveCoding: {
            id: "live_1",
            type: "live_coding",
            question: "Bir array'i tersine çeviren fonksiyon yazın",
            languages: ["javascript"],
          },
          bugFix: {
            id: "bug_1",
            type: "bug_fix",
            question: "Bu kodda hatayı bulun",
            languages: ["javascript"],
            buggyCode: "function add(a, b) { return a - b; }",
          },
          realWorldScenarios: [
            {
              id: "scenario_1",
              type: "case",
              question: "Yüksek trafikli bir web sitesi için nasıl optimize edersiniz?",
            },
          ],
        },
      };

      const result = formatQuestionsForInterview(mockQuestions);

      assert.strictEqual(Array.isArray(result), true);
      assert.strictEqual(result.length, 8); // 2 intro + 1 exp + 2 tech + 1 live + 1 bug + 1 scenario

      // Check stage 1 questions
      const stage1Questions = result.filter((q) => q.stage === 1);
      assert.strictEqual(stage1Questions.length, 2);
      assert.strictEqual(stage1Questions[0].id, "intro_1");
      assert.strictEqual(stage1Questions[1].id, "intro_2");

      // Check stage 2 questions
      const stage2Questions = result.filter((q) => q.stage === 2);
      assert.strictEqual(stage2Questions.length, 1);
      assert.strictEqual(stage2Questions[0].id, "exp_1");

      // Check stage 3 questions
      const stage3Questions = result.filter((q) => q.stage === 3);
      assert.strictEqual(stage3Questions.length, 5); // 2 tech + 1 live + 1 bug + 1 scenario

      // Check live coding question
      const liveCoding = result.find((q) => q.type === "live_coding");
      assert.ok(liveCoding);
      assert.strictEqual(liveCoding.id, "live_1");

      // Check bug fix question
      const bugFix = result.find((q) => q.type === "bug_fix");
      assert.ok(bugFix);
      assert.strictEqual(bugFix.id, "bug_1");
    });

    it("should handle missing optional fields", () => {
      const mockQuestions = {
        stage1_introduction: [
          {
            id: "intro_1",
            type: "behavioral",
            question: "Test question",
          },
        ],
        stage2_experience: [],
        stage3_technical: {
          testQuestions: [
            {
              id: "tech_1",
              type: "technical",
              question: "Test technical question",
            },
          ],
          realWorldScenarios: [],
        },
      };

      const result = formatQuestionsForInterview(mockQuestions);

      assert.strictEqual(Array.isArray(result), true);
      assert.strictEqual(result.length, 2); // 1 intro + 1 tech question

      // liveCoding and bugFix should be optional
      const hasLiveCoding = result.some((q) => q.type === "live_coding");
      const hasBugFix = result.some((q) => q.type === "bug_fix");
      assert.strictEqual(hasLiveCoding, false);
      assert.strictEqual(hasBugFix, false);
    });

    it("should generate IDs for questions without IDs", () => {
      const mockQuestions = {
        stage1_introduction: [
          {
            type: "behavioral",
            question: "Question without ID",
          },
        ],
        stage2_experience: [],
        stage3_technical: {
          testQuestions: [
            {
              type: "technical",
              question: "Technical question without ID",
            },
          ],
          realWorldScenarios: [],
        },
      };

      const result = formatQuestionsForInterview(mockQuestions);

      assert.strictEqual(result.length, 2);
      assert.ok(result[0].id);
      assert.ok(result[0].id.startsWith("intro_"));
      assert.ok(result[1].id);
      assert.ok(result[1].id.startsWith("technical_test_"));
    });
  });

  describe("normalizeQuestions (API route logic)", () => {
    // Test the normalization logic used in API routes
    it("should handle array format", () => {
      const arrayQuestions = [
        { id: "q1", type: "technical", question: "Question 1" },
        { id: "q2", type: "behavioral", question: "Question 2" },
      ];

      // Simulate the normalizeQuestions logic
      const normalize = (raw: unknown) => {
        if (Array.isArray(raw)) {
          return raw;
        }
        return [];
      };

      const result = normalize(arrayQuestions);
      assert.strictEqual(Array.isArray(result), true);
      assert.strictEqual(result.length, 2);
    });

    it("should handle string format (JSON)", () => {
      const arrayQuestions = [
        { id: "q1", type: "technical", question: "Question 1" },
      ];
      const stringQuestions = JSON.stringify(arrayQuestions);

      // Simulate the normalizeQuestions logic
      const normalize = (raw: unknown) => {
        if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (error) {
            return [];
          }
        }
        return [];
      };

      const result = normalize(stringQuestions);
      assert.strictEqual(Array.isArray(result), true);
      assert.strictEqual(result.length, 1);
    });

    it("should handle object format (stage structure)", () => {
      const objectQuestions = {
        stage1_introduction: [
          { id: "intro_1", type: "behavioral", question: "Intro question" },
        ],
        stage2_experience: [
          { id: "exp_1", type: "behavioral", question: "Exp question" },
        ],
        stage3_technical: {
          testQuestions: [
            { id: "tech_1", type: "technical", question: "Tech question" },
          ],
          realWorldScenarios: [],
        },
      };

      // Simulate the normalizeQuestions logic with formatQuestionsForInterview
      const normalize = (raw: unknown) => {
        if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
          const obj = raw as any;
          if (obj.stage1_introduction && obj.stage2_experience && obj.stage3_technical) {
            return formatQuestionsForInterview(obj);
          }
        }
        return [];
      };

      const result = normalize(objectQuestions);
      assert.strictEqual(Array.isArray(result), true);
      assert.strictEqual(result.length, 3); // 1 intro + 1 exp + 1 tech
      assert.strictEqual(result[0].stage, 1);
      assert.strictEqual(result[1].stage, 2);
      assert.strictEqual(result[2].stage, 3);
    });

    it("should return empty array for invalid formats", () => {
      const normalize = (raw: unknown) => {
        if (Array.isArray(raw)) {
          return raw;
        }
        if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch {
            return [];
          }
        }
        if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
          const obj = raw as any;
          if (obj.stage1_introduction && obj.stage2_experience && obj.stage3_technical) {
            return formatQuestionsForInterview(obj);
          }
        }
        return [];
      };

      assert.strictEqual(normalize(null).length, 0);
      assert.strictEqual(normalize(undefined).length, 0);
      assert.strictEqual(normalize(123).length, 0);
      assert.strictEqual(normalize("invalid json").length, 0);
      assert.strictEqual(normalize({ invalid: "structure" }).length, 0);
    });
  });
});

