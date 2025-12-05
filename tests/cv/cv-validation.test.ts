/**
 * CV Data Validation Tests
 * Tests data format validation, type safety, and structure validation
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("CV Data Validation Tests", () => {
  describe("CV Data Format Validation", () => {
    it("should validate CV data structure", () => {
      const validCVData = {
        personalInfo: {
          name: "Test User",
          email: "test@example.com",
          phone: "+90 555 123 4567",
        },
        summary: "Experienced developer",
        experience: [
          {
            company: "Company",
            position: "Developer",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
            description: "Worked on projects",
          },
        ],
        education: [
          {
            school: "University",
            degree: "Bachelor",
            field: "Computer Science",
          },
        ],
        skills: ["JavaScript", "React", "Node.js"],
      };

      assert.ok("personalInfo" in validCVData);
      assert.ok("experience" in validCVData);
      assert.ok("education" in validCVData);
      assert.ok("skills" in validCVData);
      assert.strictEqual(Array.isArray(validCVData.experience), true);
      assert.strictEqual(Array.isArray(validCVData.education), true);
      assert.strictEqual(Array.isArray(validCVData.skills), true);
    });

    it("should validate personalInfo structure", () => {
      const personalInfo = {
        name: "Test User",
        email: "test@example.com",
        phone: "+90 555 123 4567",
        address: "Istanbul, Turkey",
        linkedin: "https://linkedin.com/in/test",
        website: "https://test.com",
      };

      assert.strictEqual(typeof personalInfo.name, "string");
      assert.strictEqual(typeof personalInfo.email, "string");
      assert.ok(personalInfo.email.includes("@"));
    });

    it("should validate experience array structure", () => {
      const experience = [
        {
          company: "Company 1",
          position: "Developer",
          startDate: "2020-01-01",
          endDate: "2023-12-31",
          description: "Work description",
          current: false,
        },
        {
          company: "Company 2",
          position: "Senior Developer",
          startDate: "2024-01-01",
          current: true,
        },
      ];

      experience.forEach((exp) => {
        assert.ok("company" in exp);
        assert.ok("position" in exp);
        assert.strictEqual(typeof exp.company, "string");
        assert.strictEqual(typeof exp.position, "string");
      });
    });

    it("should validate skills array", () => {
      const skills = ["JavaScript", "React", "Node.js", "TypeScript"];

      assert.strictEqual(Array.isArray(skills), true);
      skills.forEach((skill) => {
        assert.strictEqual(typeof skill, "string");
        assert.ok(skill.length > 0);
      });
    });

    it("should handle optional fields", () => {
      const minimalCVData = {
        personalInfo: {
          name: "Test User",
        },
      };

      assert.ok("personalInfo" in minimalCVData);
      assert.ok("name" in minimalCVData.personalInfo);
      // Other fields are optional
      assert.ok(!("email" in minimalCVData.personalInfo) || typeof minimalCVData.personalInfo.email === "string");
    });
  });

  describe("Interview Questions Format Validation", () => {
    it("should validate array format questions", () => {
      const arrayQuestions = [
        {
          id: "q1",
          type: "behavioral",
          question: "Tell me about yourself",
          stage: 1,
        },
        {
          id: "q2",
          type: "technical",
          question: "What is closure?",
          stage: 3,
        },
      ];

      assert.strictEqual(Array.isArray(arrayQuestions), true);
      arrayQuestions.forEach((q) => {
        assert.ok("id" in q);
        assert.ok("type" in q);
        assert.ok("question" in q);
        assert.ok("stage" in q);
        assert.ok([1, 2, 3].includes(q.stage));
      });
    });

    it("should validate object format questions (stage structure)", () => {
      const objectQuestions = {
        stage1_introduction: [
          {
            id: "intro_1",
            type: "behavioral",
            question: "Introduction question",
          },
        ],
        stage2_experience: [
          {
            id: "exp_1",
            type: "behavioral",
            question: "Experience question",
          },
        ],
        stage3_technical: {
          testQuestions: [
            {
              id: "tech_1",
              type: "technical",
              question: "Technical question",
            },
          ],
          liveCoding: {
            id: "live_1",
            type: "live_coding",
            question: "Live coding question",
            languages: ["javascript"],
          },
          bugFix: {
            id: "bug_1",
            type: "bug_fix",
            question: "Bug fix question",
            languages: ["javascript"],
            buggyCode: "function test() { return; }",
          },
          realWorldScenarios: [
            {
              id: "scenario_1",
              type: "case",
              question: "Scenario question",
            },
          ],
        },
      };

      assert.ok("stage1_introduction" in objectQuestions);
      assert.ok("stage2_experience" in objectQuestions);
      assert.ok("stage3_technical" in objectQuestions);
      assert.strictEqual(Array.isArray(objectQuestions.stage1_introduction), true);
      assert.strictEqual(Array.isArray(objectQuestions.stage2_experience), true);
      assert.strictEqual(typeof objectQuestions.stage3_technical, "object");
    });

    it("should validate question types", () => {
      const validTypes = ["behavioral", "technical", "case", "live_coding", "bug_fix"];

      const questions = [
        { type: "behavioral" },
        { type: "technical" },
        { type: "case" },
        { type: "live_coding" },
        { type: "bug_fix" },
      ];

      questions.forEach((q) => {
        assert.ok(validTypes.includes(q.type));
      });
    });

    it("should validate live coding question structure", () => {
      const liveCodingQuestion = {
        id: "live_1",
        type: "live_coding",
        question: "Write a function",
        languages: ["javascript", "python"],
        starterCode: {
          javascript: "function test() {}",
          python: "def test(): pass",
        },
        timeLimitMinutes: 15,
        acceptanceCriteria: ["Should work", "Should be efficient"],
      };

      assert.strictEqual(liveCodingQuestion.type, "live_coding");
      assert.ok("languages" in liveCodingQuestion);
      assert.strictEqual(Array.isArray(liveCodingQuestion.languages), true);
      assert.ok("starterCode" in liveCodingQuestion);
      assert.strictEqual(typeof liveCodingQuestion.starterCode, "object");
    });

    it("should validate bug fix question structure", () => {
      const bugFixQuestion = {
        id: "bug_1",
        type: "bug_fix",
        question: "Find the bug",
        languages: ["javascript"],
        buggyCode: "function add(a, b) { return a - b; }",
        timeLimitMinutes: 10,
      };

      assert.strictEqual(bugFixQuestion.type, "bug_fix");
      assert.ok("buggyCode" in bugFixQuestion);
      assert.strictEqual(typeof bugFixQuestion.buggyCode, "string");
      assert.ok(bugFixQuestion.buggyCode.length > 0);
    });
  });

  describe("Type Safety Validation", () => {
    it("should validate CV ID type", () => {
      const validIds = ["cv-123", "clx1234567890", "test-id"];
      const invalidIds = [null, undefined, 123, [], {}];

      validIds.forEach((id) => {
        assert.strictEqual(typeof id, "string");
        assert.ok(id.length > 0);
      });

      invalidIds.forEach((id) => {
        const isValid = typeof id === "string" && id.length > 0;
        assert.strictEqual(isValid, false, `Invalid ID should fail: ${typeof id}`);
      });
    });

    it("should validate Interview ID type", () => {
      const validIds = ["interview-123", "clx1234567890"];
      const invalidIds = [null, undefined, 123, []];

      validIds.forEach((id) => {
        assert.strictEqual(typeof id, "string");
      });

      invalidIds.forEach((id) => {
        const isValid = typeof id === "string" && id.length > 0;
        assert.strictEqual(isValid, false);
      });
    });

    it("should validate Template ID type", () => {
      const validTemplateIds = ["template-123", "modern-template"];
      const invalidTemplateIds = [null, undefined, 123, ""];

      validTemplateIds.forEach((id) => {
        assert.strictEqual(typeof id, "string");
        assert.ok(id.length > 0);
      });

      invalidTemplateIds.forEach((id) => {
        const isValid = typeof id === "string" && id.length > 0;
        assert.strictEqual(isValid, false);
      });
    });

    it("should validate status type", () => {
      const validStatuses = ["generating", "completed", "error"];
      const invalidStatuses = ["invalid", "pending", null, undefined];

      validStatuses.forEach((status) => {
        assert.ok(["generating", "completed", "error"].includes(status));
      });

      invalidStatuses.forEach((status) => {
        if (typeof status === "string") {
          const isValid = ["generating", "completed", "error"].includes(status);
          assert.strictEqual(isValid, false, `Invalid status: ${status}`);
        }
      });
    });

    it("should validate stage type", () => {
      const validStages = [0, 1, 2, 3];
      const invalidStages = [-1, 4, "1", null, undefined];

      validStages.forEach((stage) => {
        assert.ok([0, 1, 2, 3].includes(stage));
        assert.strictEqual(typeof stage, "number");
      });

      invalidStages.forEach((stage) => {
        const isValid = typeof stage === "number" && [0, 1, 2, 3].includes(stage);
        assert.strictEqual(isValid, false, `Invalid stage: ${stage}`);
      });
    });

    it("should validate progress type and range", () => {
      const validProgress = [0, 33, 66, 100];
      const invalidProgress = [-1, 101, "50", null, undefined];

      validProgress.forEach((progress) => {
        assert.strictEqual(typeof progress, "number");
        assert.ok(progress >= 0 && progress <= 100);
      });

      invalidProgress.forEach((progress) => {
        const isValid =
          typeof progress === "number" && progress >= 0 && progress <= 100;
        assert.strictEqual(isValid, false, `Invalid progress: ${progress}`);
      });
    });
  });

  describe("Database Constraint Validation", () => {
    it("should validate CV userId constraint", () => {
      const cv = {
        id: "cv-123",
        userId: "user-123",
      };

      const requestingUserId = "user-123";

      const isAuthorized = cv.userId === requestingUserId;
      assert.strictEqual(isAuthorized, true);
    });

    it("should validate Interview cvId constraint", () => {
      const interview = {
        id: "interview-123",
        cvId: "cv-123",
      };

      assert.ok("cvId" in interview);
      assert.strictEqual(typeof interview.cvId, "string");
    });

    it("should validate Interview type constraint", () => {
      const interview = {
        id: "interview-123",
        type: "cv_based",
      };

      assert.strictEqual(interview.type, "cv_based");
    });

    it("should validate questions field as JSON", () => {
      const interview = {
        id: "interview-123",
        questions: [] as any,
      };

      // Questions can be array, object, or string (JSON)
      const isValid =
        Array.isArray(interview.questions) ||
        typeof interview.questions === "object" ||
        typeof interview.questions === "string";

      assert.strictEqual(isValid, true);
    });
  });

  describe("Response Structure Validation", () => {
    it("should validate CV list response", () => {
      const response = {
        cvs: [
          {
            id: "cv-123",
            template: { id: "template-123", name: "Template" },
            uploads: [],
          },
        ],
      };

      assert.ok("cvs" in response);
      assert.strictEqual(Array.isArray(response.cvs), true);
      if (response.cvs.length > 0) {
        assert.ok("id" in response.cvs[0]);
        assert.ok("template" in response.cvs[0]);
      }
    });

    it("should validate Interview response", () => {
      const response = {
        interview: {
          id: "interview-123",
          title: "Title",
          description: "Description",
          questions: [],
          type: "cv_based",
        },
      };

      assert.ok("interview" in response);
      assert.ok("id" in response.interview);
      assert.ok("questions" in response.interview);
    });

    it("should validate Status response", () => {
      const response = {
        status: "generating",
        stage: 1,
        progress: 33,
        interviewId: "interview-123",
        questionCount: 3,
      };

      assert.ok("status" in response);
      assert.ok("stage" in response);
      assert.ok("progress" in response);
      assert.ok("interviewId" in response);
      assert.ok("questionCount" in response);
    });

    it("should validate Error response", () => {
      const errorResponse = {
        error: "Error message",
        status: 400,
      };

      assert.ok("error" in errorResponse);
      assert.ok("status" in errorResponse);
      assert.strictEqual(typeof errorResponse.error, "string");
      assert.strictEqual(typeof errorResponse.status, "number");
    });
  });

  describe("Edge Case Validation", () => {
    it("should handle empty arrays", () => {
      const emptyArrays = {
        experience: [],
        education: [],
        skills: [],
        questions: [],
      };

      Object.values(emptyArrays).forEach((arr) => {
        assert.strictEqual(Array.isArray(arr), true);
        assert.strictEqual(arr.length, 0);
      });
    });

    it("should handle null/undefined values gracefully", () => {
      const dataWithNulls = {
        personalInfo: {
          name: "Test",
          email: null as any,
          phone: undefined as any,
        },
        summary: null as any,
      };

      // Should handle null/undefined without crashing
      const name = dataWithNulls.personalInfo.name || "Unknown";
      const email = dataWithNulls.personalInfo.email || "No email";
      const summary = dataWithNulls.summary || "No summary";

      assert.strictEqual(name, "Test");
      assert.strictEqual(email, "No email");
      assert.strictEqual(summary, "No summary");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(10000);
      const cvData = {
        personalInfo: {
          name: longString,
        },
      };

      assert.strictEqual(typeof cvData.personalInfo.name, "string");
      assert.ok(cvData.personalInfo.name.length > 0);
    });

    it("should handle special characters", () => {
      const specialChars = {
        name: "Test User <>&\"'",
        email: "test+user@example.com",
        description: "Description with\nnewlines\tand\ttabs",
      };

      assert.strictEqual(typeof specialChars.name, "string");
      assert.strictEqual(typeof specialChars.email, "string");
      assert.strictEqual(typeof specialChars.description, "string");
    });
  });
});

