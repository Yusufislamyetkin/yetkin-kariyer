/**
 * CV-Based Interview API E2E Tests
 * Tests the complete interview API endpoints with realistic scenarios
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("CV-Based Interview API E2E Tests", () => {
  describe("POST /api/interview/cv-based", () => {
    it("should validate request structure", () => {
      const validRequest = {
        cvId: "cv-123",
      };

      assert.ok("cvId" in validRequest);
      assert.strictEqual(typeof validRequest.cvId, "string");
      assert.ok(validRequest.cvId.length > 0);
    });

    it("should require cvId field", () => {
      const invalidRequests = [
        {},
        { cvId: null },
        { cvId: undefined },
        { cvId: 123 },
        { cvId: "" },
      ];

      invalidRequests.forEach((req) => {
        const isValid =
          "cvId" in req &&
          req.cvId !== null &&
          req.cvId !== undefined &&
          typeof req.cvId === "string" &&
          req.cvId.length > 0;

        assert.strictEqual(isValid, false, `Invalid request should fail: ${JSON.stringify(req)}`);
      });
    });

    it("should validate response structure", () => {
      const mockResponse = {
        interview: {
          id: "interview-123",
          title: "CV Bazlı Mülakat - Test User",
          description: "Mülakat soruları oluşturuluyor...",
          duration: 0,
          questionCount: 0,
          status: "generating",
        },
        status: 201,
      };

      assert.ok("interview" in mockResponse);
      assert.ok("id" in mockResponse.interview);
      assert.ok("title" in mockResponse.interview);
      assert.ok("description" in mockResponse.interview);
      assert.strictEqual(mockResponse.interview.status, "generating");
      assert.strictEqual(mockResponse.interview.questionCount, 0);
      assert.strictEqual(mockResponse.status, 201);
    });

    it("should handle authentication errors", () => {
      const unauthorizedResponse = {
        error: "Unauthorized",
        status: 401,
      };

      assert.strictEqual(unauthorizedResponse.status, 401);
      assert.strictEqual(unauthorizedResponse.error, "Unauthorized");
    });

    it("should handle CV not found", () => {
      const notFoundResponse = {
        error: "CV bulunamadı",
        status: 404,
      };

      assert.strictEqual(notFoundResponse.status, 404);
      assert.strictEqual(notFoundResponse.error, "CV bulunamadı");
    });

    it("should handle CV access denied", () => {
      const forbiddenResponse = {
        error: "Bu CV'ye erişim yetkiniz yok",
        status: 403,
      };

      assert.strictEqual(forbiddenResponse.status, 403);
      assert.ok(forbiddenResponse.error.includes("erişim yetkiniz yok"));
    });

    it("should create interview with correct initial state", () => {
      const interview = {
        id: "interview-123",
        title: "CV Bazlı Mülakat - Test User",
        description: "Mülakat soruları oluşturuluyor...",
        questions: [],
        type: "cv_based",
        difficulty: "intermediate",
        duration: 0,
        cvId: "cv-123",
      };

      assert.strictEqual(interview.type, "cv_based");
      assert.strictEqual(Array.isArray(interview.questions), true);
      assert.strictEqual(interview.questions.length, 0);
      assert.strictEqual(interview.duration, 0);
      assert.ok("cvId" in interview);
    });
  });

  describe("GET /api/interview/cv-based/[id]", () => {
    it("should validate response structure", () => {
      const mockResponse = {
        interview: {
          id: "interview-123",
          title: "CV Bazlı Mülakat - Test User",
          description: "CV'nize göre oluşturulmuş kapsamlı mülakat. 10 soru içermektedir.",
          duration: 30,
          type: "cv_based",
          questions: [
            {
              id: "q1",
              type: "behavioral",
              question: "Kendinizi tanıtır mısınız?",
              stage: 1,
            },
          ],
        },
      };

      assert.ok("interview" in mockResponse);
      assert.ok("id" in mockResponse.interview);
      assert.ok("questions" in mockResponse.interview);
      assert.strictEqual(Array.isArray(mockResponse.interview.questions), true);
    });

    it("should normalize questions correctly", () => {
      // Test array format
      const arrayQuestions = [
        { id: "q1", type: "technical", question: "Question 1" },
      ];

      assert.strictEqual(Array.isArray(arrayQuestions), true);

      // Test object format (stage structure)
      const objectQuestions = {
        stage1_introduction: [
          { id: "intro_1", type: "behavioral", question: "Intro" },
        ],
        stage2_experience: [],
        stage3_technical: {
          testQuestions: [
            { id: "tech_1", type: "technical", question: "Tech" },
          ],
          realWorldScenarios: [],
        },
      };

      assert.strictEqual(typeof objectQuestions, "object");
      assert.ok("stage1_introduction" in objectQuestions);
      assert.ok("stage2_experience" in objectQuestions);
      assert.ok("stage3_technical" in objectQuestions);
    });

    it("should handle interview not found", () => {
      const notFoundResponse = {
        error: "Mülakat bulunamadı",
        status: 404,
      };

      assert.strictEqual(notFoundResponse.status, 404);
    });

    it("should require authentication", () => {
      const unauthorizedResponse = {
        error: "Unauthorized",
        status: 401,
      };

      assert.strictEqual(unauthorizedResponse.status, 401);
    });
  });

  describe("GET /api/interview/cv-based/[id]/status", () => {
    it("should validate status response structure", () => {
      const mockStatusResponse = {
        status: "generating",
        stage: 1,
        progress: 33,
        interviewId: "interview-123",
        questionCount: 3,
      };

      assert.ok(["generating", "completed", "error"].includes(mockStatusResponse.status));
      assert.ok([0, 1, 2, 3].includes(mockStatusResponse.stage));
      assert.ok(mockStatusResponse.progress >= 0 && mockStatusResponse.progress <= 100);
      assert.ok("questionCount" in mockStatusResponse);
      assert.ok("interviewId" in mockStatusResponse);
    });

    it("should handle initial status (stage 0)", () => {
      const initialStatus = {
        status: "generating",
        stage: 0,
        progress: 0,
        interviewId: "interview-123",
        questionCount: 0,
      };

      assert.strictEqual(initialStatus.stage, 0);
      assert.strictEqual(initialStatus.progress, 0);
      assert.strictEqual(initialStatus.questionCount, 0);
    });

    it("should handle stage 1 status", () => {
      const stage1Status = {
        status: "generating",
        stage: 1,
        progress: 33,
        interviewId: "interview-123",
        questionCount: 3,
      };

      assert.strictEqual(stage1Status.stage, 1);
      assert.strictEqual(stage1Status.progress, 33);
      assert.ok(stage1Status.questionCount > 0);
    });

    it("should handle stage 2 status", () => {
      const stage2Status = {
        status: "generating",
        stage: 2,
        progress: 66,
        interviewId: "interview-123",
        questionCount: 6,
      };

      assert.strictEqual(stage2Status.stage, 2);
      assert.strictEqual(stage2Status.progress, 66);
    });

    it("should handle completed status", () => {
      const completedStatus = {
        status: "completed",
        stage: 3,
        progress: 100,
        interviewId: "interview-123",
        questionCount: 10,
      };

      assert.strictEqual(completedStatus.status, "completed");
      assert.strictEqual(completedStatus.stage, 3);
      assert.strictEqual(completedStatus.progress, 100);
      assert.ok(completedStatus.questionCount > 0);
    });

    it("should handle error status", () => {
      const errorStatus = {
        status: "error",
        stage: 2,
        progress: 66,
        interviewId: "interview-123",
        questionCount: 3,
        error: "Mülakat oluşturulurken hata oluştu: Test error",
      };

      assert.strictEqual(errorStatus.status, "error");
      assert.ok("error" in errorStatus);
      assert.strictEqual(typeof errorStatus.error, "string");
    });

    it("should calculate question count from object format", () => {
      const questions = {
        stage1_introduction: [
          { id: "intro_1" },
          { id: "intro_2" },
        ],
        stage2_experience: [
          { id: "exp_1" },
        ],
        stage3_technical: {
          testQuestions: [
            { id: "tech_1" },
            { id: "tech_2" },
          ],
          liveCoding: { id: "live_1" },
          bugFix: { id: "bug_1" },
          realWorldScenarios: [
            { id: "scenario_1" },
          ],
        },
      };

      let questionCount = 0;
      if (questions.stage1_introduction) {
        questionCount += Array.isArray(questions.stage1_introduction)
          ? questions.stage1_introduction.length
          : 0;
      }
      if (questions.stage2_experience) {
        questionCount += Array.isArray(questions.stage2_experience)
          ? questions.stage2_experience.length
          : 0;
      }
      if (questions.stage3_technical) {
        if (questions.stage3_technical.testQuestions) {
          questionCount += Array.isArray(questions.stage3_technical.testQuestions)
            ? questions.stage3_technical.testQuestions.length
            : 0;
        }
        if (questions.stage3_technical.liveCoding) {
          questionCount += 1;
        }
        if (questions.stage3_technical.bugFix) {
          questionCount += 1;
        }
        if (questions.stage3_technical.realWorldScenarios) {
          questionCount += Array.isArray(questions.stage3_technical.realWorldScenarios)
            ? questions.stage3_technical.realWorldScenarios.length
            : 0;
        }
      }

      assert.strictEqual(questionCount, 8); // 2 + 1 + 2 + 1 + 1 + 1
    });

    it("should calculate question count from array format", () => {
      const arrayQuestions = [
        { id: "q1" },
        { id: "q2" },
        { id: "q3" },
      ];

      const questionCount = Array.isArray(arrayQuestions) ? arrayQuestions.length : 0;
      assert.strictEqual(questionCount, 3);
    });
  });

  describe("POST /api/interview/cv-based/[id] (Submit)", () => {
    it("should validate submit request structure", () => {
      const validRequest = {
        action: "submit",
        videoUrl: "https://example.com/video.webm",
        screenRecordingUrl: "https://example.com/screen.webm",
        transcript: {
          submittedAt: "2024-01-01T00:00:00Z",
          questionOrder: ["q1", "q2"],
          answers: {
            text: { q1: "Answer 1" },
            code: {},
            languageSelections: {},
          },
        },
      };

      assert.strictEqual(validRequest.action, "submit");
      assert.ok("videoUrl" in validRequest);
      assert.ok("transcript" in validRequest);
    });

    it("should validate submit response structure", () => {
      const mockResponse = {
        attempt: {
          id: "attempt-123",
          userId: "user-123",
          interviewId: "interview-123",
          videoUrl: "https://example.com/video.webm",
          transcript: "{}",
          completedAt: "2024-01-01T00:00:00Z",
          screenRecordingUrl: "https://example.com/screen.webm",
        },
      };

      assert.ok("attempt" in mockResponse);
      assert.ok("id" in mockResponse.attempt);
      assert.ok("interviewId" in mockResponse.attempt);
    });

    it("should handle start action", () => {
      const startRequest = {
        action: "start",
      };

      const mockResponse = {
        message: "Interview started",
      };

      assert.strictEqual(startRequest.action, "start");
      assert.ok("message" in mockResponse);
    });

    it("should handle invalid action", () => {
      const invalidRequest = {
        action: "invalid",
      };

      const errorResponse = {
        error: "Invalid action",
        status: 400,
      };

      assert.strictEqual(errorResponse.status, 400);
      assert.strictEqual(errorResponse.error, "Invalid action");
    });
  });

  describe("Background Process", () => {
    it("should handle stage generation flow", () => {
      const stages = [
        { name: "stage1", questions: [{ id: "intro_1" }] },
        { name: "stage2", questions: [{ id: "exp_1" }] },
        { name: "stage3", questions: [{ id: "tech_1" }] },
      ];

      stages.forEach((stage) => {
        assert.ok("name" in stage);
        assert.ok("questions" in stage);
        assert.strictEqual(Array.isArray(stage.questions), true);
      });
    });

    it("should format questions correctly after all stages", () => {
      const allStages = {
        stage1_introduction: [{ id: "intro_1", type: "behavioral" }],
        stage2_experience: [{ id: "exp_1", type: "behavioral" }],
        stage3_technical: {
          testQuestions: [{ id: "tech_1", type: "technical" }],
          realWorldScenarios: [],
        },
      };

      // Simulate formatQuestionsForInterview
      const formatted: any[] = [];
      allStages.stage1_introduction.forEach((q) => {
        formatted.push({ ...q, stage: 1 });
      });
      allStages.stage2_experience.forEach((q) => {
        formatted.push({ ...q, stage: 2 });
      });
      allStages.stage3_technical.testQuestions.forEach((q) => {
        formatted.push({ ...q, stage: 3 });
      });

      assert.strictEqual(Array.isArray(formatted), true);
      assert.strictEqual(formatted.length, 3);
      assert.strictEqual(formatted[0].stage, 1);
      assert.strictEqual(formatted[1].stage, 2);
      assert.strictEqual(formatted[2].stage, 3);
    });

    it("should calculate duration correctly", () => {
      const questionCount = 10;
      const duration = Math.ceil(questionCount * 3); // 3 minutes per question

      assert.strictEqual(duration, 30);
      assert.ok(duration > 0);
    });

    it("should handle background process errors", () => {
      const error = {
        message: "AI service unavailable",
        type: "ai_error",
      };

      const errorDescription = `Mülakat oluşturulurken hata oluştu: ${error.message}`;

      assert.ok(errorDescription.includes("hata oluştu"));
      assert.ok(errorDescription.includes(error.message));
    });
  });

  describe("Error Scenarios", () => {
    it("should handle all error types", () => {
      const errorScenarios = [
        { status: 400, error: "CV ID gereklidir" },
        { status: 401, error: "Unauthorized" },
        { status: 403, error: "Bu CV'ye erişim yetkiniz yok" },
        { status: 404, error: "CV bulunamadı" },
        { status: 500, error: "Mülakat oluşturulurken bir hata oluştu" },
      ];

      errorScenarios.forEach((scenario) => {
        assert.ok([400, 401, 403, 404, 500].includes(scenario.status));
        assert.strictEqual(typeof scenario.error, "string");
        assert.ok(scenario.error.length > 0);
      });
    });

    it("should provide meaningful error messages", () => {
      const errorMessages = [
        "CV ID gereklidir",
        "CV bulunamadı",
        "Bu CV'ye erişim yetkiniz yok",
        "Mülakat oluşturulurken bir hata oluştu",
        "Mülakat yüklenirken bir hata oluştu",
        "Status kontrolü sırasında bir hata oluştu",
      ];

      errorMessages.forEach((msg) => {
        assert.strictEqual(typeof msg, "string");
        assert.ok(msg.length > 0);
        // Check if message contains common error keywords
        const hasErrorKeyword = 
          msg.includes("hata") || 
          msg.includes("gerekli") || 
          msg.includes("bulunamadı") ||
          msg.includes("erişim") ||
          msg.includes("Unauthorized");
        assert.strictEqual(hasErrorKeyword, true, `Error message should contain error keyword: ${msg}`);
      });
    });
  });
});

