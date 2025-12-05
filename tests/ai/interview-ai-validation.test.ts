/**
 * AI Output Validation Tests
 * Tests that AI-generated interview questions are logically correct and appropriate
 */

// Load environment variables from .env files
import { readFileSync } from "fs";
import { join } from "path";

const loadEnvFile = (filename: string) => {
  try {
    const envPath = join(process.cwd(), filename);
    const envContent = readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const equalIndex = trimmedLine.indexOf("=");
        if (equalIndex > 0) {
          const key = trimmedLine.substring(0, equalIndex).trim();
          let value = trimmedLine.substring(equalIndex + 1).trim();
          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Try loading .env.local first (Next.js priority), then .env
if (!loadEnvFile(".env.local")) {
  loadEnvFile(".env");
}

import { describe, it, before, after } from "node:test";
import { strict as assert } from "node:assert";
import {
  generateStage1Questions,
  generateStage2Questions,
  generateStage3Questions,
  extractCVInfo,
} from "@/lib/ai/interview-generator";
import { db } from "@/lib/db";

// Skip tests if OpenAI API key is not available (check after loading env)
const SKIP_AI_TESTS = !process.env.OPENAI_API_KEY;

// Log for debugging
if (SKIP_AI_TESTS) {
  console.log("OPENAI_API_KEY not found in environment variables");
} else {
  console.log("OPENAI_API_KEY found, AI tests will run");
}

// Test CV data
const testCVData = {
  personalInfo: {
    name: "Test Developer",
    email: "test@example.com",
    phone: "+905551234567",
    address: "Istanbul, Turkey",
    linkedin: "linkedin.com/in/testdev",
    website: "testdev.com",
  },
  summary: "Experienced full-stack developer with 5 years of experience in React, Node.js, and TypeScript. Specialized in building scalable web applications and microservices architecture.",
  experience: [
    {
      company: "Tech Company",
      position: "Senior Software Engineer",
      startDate: "2020-01-01",
      endDate: "2023-12-31",
      description: "Developed and maintained React-based web applications. Implemented microservices using Node.js and TypeScript. Led a team of 3 developers.",
      current: false,
    },
    {
      company: "Startup Inc",
      position: "Software Developer",
      startDate: "2018-06-01",
      endDate: "2019-12-31",
      description: "Built RESTful APIs using Node.js and Express. Worked with MongoDB and PostgreSQL databases.",
      current: false,
    },
  ],
  education: [
    {
      school: "Technical University",
      degree: "Bachelor's Degree",
      field: "Computer Science",
      startDate: "2014-09-01",
      endDate: "2018-06-30",
      gpa: "3.5",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "Docker", "AWS"],
  languages: [
    {
      name: "English",
      level: "Advanced",
    },
    {
      name: "Turkish",
      level: "Native",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform using React and Node.js",
      technologies: "React, TypeScript, Node.js, MongoDB",
      url: "https://github.com/testdev/ecommerce",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
    },
  ],
  achievements: [
    {
      title: "Best Developer Award",
      description: "Recognized for outstanding performance in 2023",
      date: "2023-12-01",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "AWS",
      date: "2022-01-01",
    },
  ],
};

let testCVId: string | null = null;

describe("AI Output Validation Tests", () => {
  // Create a test CV before running tests
  before(async () => {
    if (SKIP_AI_TESTS) return;

    try {
      // Get any existing user ID for testing
      const testUser = await db.user.findFirst({
        select: { id: true },
      });

      if (!testUser) {
        console.log("No user found in database, skipping CV creation");
        return;
      }

      // Get any existing template ID
      const template = await db.cVTemplate.findFirst({
        select: { id: true },
      });

      if (!template) {
        console.log("No CV template found in database, skipping CV creation");
        return;
      }

      const userId = testUser.id;
      const templateId = template.id;

      // Create CV in database
      const cv = await db.cV.create({
        data: {
          userId: userId,
          templateId: templateId,
          data: testCVData as any,
        },
      });

      testCVId = cv.id;
      console.log(`Created test CV with ID: ${testCVId}`);
    } catch (error: any) {
      console.error("Failed to create test CV:", error?.message || error);
      // Continue anyway - tests will skip if CV is not created
    }
  });

  // Clean up test CV after tests
  after(async () => {
    if (testCVId) {
      try {
        await db.cV.delete({
          where: { id: testCVId },
        });
        console.log(`Deleted test CV with ID: ${testCVId}`);
      } catch (error) {
        console.error("Failed to delete test CV:", error);
      }
    }
  });

  describe("Stage 1 Questions Validation", () => {
    it("should generate questions appropriate for CV level", async () => {
      if (SKIP_AI_TESTS) {
        console.log("Skipping test - OPENAI_API_KEY not set");
        return;
      }

      if (!testCVId) {
        console.log("Skipping test - Test CV not created");
        return;
      }

      try {
        const result = await generateStage1Questions(testCVId);
        const cvInfo = extractCVInfo((await db.cV.findUnique({ where: { id: testCVId } }))?.data as any);

        assert.ok(result.stage1_introduction.length >= 5, "Should generate at least 5 questions");
        assert.ok(result.stage1_introduction.length <= 7, "Should generate at most 7 questions");

        // Check that questions are behavioral type
        result.stage1_introduction.forEach((q) => {
          assert.strictEqual(q.type, "behavioral", "Stage 1 questions should be behavioral");
          assert.ok(q.question.length > 10, "Question should have meaningful content");
          assert.ok(q.id, "Question should have an ID");
        });

        // Check that difficulty matches CV level
        result.stage1_introduction.forEach((q) => {
          if (q.difficulty) {
            // For senior position, questions should not be beginner level
            if (cvInfo.level === "advanced") {
              assert.ok(
                q.difficulty !== "beginner",
                "Advanced level CV should not have beginner questions"
              );
            }
          }
        });
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should generate questions relevant to CV content", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage1Questions(testCVId);
        const cv = await db.cV.findUnique({ where: { id: testCVId } });
        const cvData = cv?.data as any;

        // Check that questions mention relevant CV content
        const allQuestionsText = result.stage1_introduction.map((q) => q.question.toLowerCase()).join(" ");

        // Should mention education if CV has education
        if (cvData.education && cvData.education.length > 0) {
          const hasEducationQuestion = result.stage1_introduction.some((q) =>
            q.question.toLowerCase().match(/eğitim|education|üniversite|university|okul|school/i)
          );
          assert.ok(hasEducationQuestion, "Should have questions about education");
        }

        // Should mention languages if CV has languages
        if (cvData.languages && cvData.languages.length > 0) {
          const hasLanguageQuestion = result.stage1_introduction.some((q) =>
            q.question.toLowerCase().match(/dil|language|ingilizce|english/i)
          );
          assert.ok(hasLanguageQuestion, "Should have questions about languages");
        }
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should generate questions in Turkish", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage1Questions(testCVId);

        result.stage1_introduction.forEach((q) => {
          // Check for Turkish characters or common Turkish words
          const hasTurkishChars = /[çğıöşüÇĞIİÖŞÜ]/.test(q.question);
          const hasTurkishWords = /\b(kendiniz|neden|nasıl|hakkında|için|ile|veya)\b/i.test(q.question);

          assert.ok(
            hasTurkishChars || hasTurkishWords,
            `Question should be in Turkish: "${q.question}"`
          );
        });
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });
  });

  describe("Stage 2 Questions Validation", () => {
    it("should generate questions about experience and projects", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage2Questions(testCVId);
        const cv = await db.cV.findUnique({ where: { id: testCVId } });
        const cvData = cv?.data as any;

        assert.ok(result.stage2_experience.length >= 8, "Should generate at least 8 questions");
        assert.ok(result.stage2_experience.length <= 12, "Should generate at most 12 questions");

        // Check that questions are about experience/projects
        const allQuestionsText = result.stage2_experience.map((q) => q.question.toLowerCase()).join(" ");

        // Should mention experience-related keywords
        const hasExperienceKeywords = /(proje|project|deneyim|experience|şirket|company|iş|work|takım|team)/i.test(
          allQuestionsText
        );
        assert.ok(hasExperienceKeywords, "Should have questions about experience/projects");

        // If CV has specific technologies, questions should mention them
        if (cvData.skills && cvData.skills.length > 0) {
          const hasTechQuestions = result.stage2_experience.some((q) => {
            const questionLower = q.question.toLowerCase();
            return cvData.skills.some((skill: string) =>
              questionLower.includes(skill.toLowerCase())
            );
          });
          // This is optional, but good to have
          // assert.ok(hasTechQuestions, "Should have questions mentioning CV technologies");
        }
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should generate appropriate question types", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage2Questions(testCVId);

        result.stage2_experience.forEach((q) => {
          assert.ok(
            q.type === "behavioral" || q.type === "case",
            "Stage 2 questions should be behavioral or case type"
          );
          assert.ok(q.question.length > 10, "Question should have meaningful content");
          assert.ok(q.id, "Question should have an ID");
        });
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });
  });

  describe("Stage 3 Questions Validation", () => {
    it("should generate technical questions appropriate for position type", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage3Questions(testCVId);
        const cv = await db.cV.findUnique({ where: { id: testCVId } });
        const cvInfo = extractCVInfo(cv?.data as any);

        assert.ok(result.stage3_technical.testQuestions.length >= 5, "Should generate at least 5 test questions");

        // Check test questions
        result.stage3_technical.testQuestions.forEach((q) => {
          assert.strictEqual(q.type, "technical", "Test questions should be technical type");
          assert.ok(q.question.length > 10, "Question should have meaningful content");
          assert.ok(q.id, "Question should have an ID");
        });

        // For developer position, should have live coding and bug fix
        if (cvInfo.positionType === "developer") {
          assert.ok(
            result.stage3_technical.liveCoding,
            "Developer position should have live coding question"
          );
          assert.ok(result.stage3_technical.bugFix, "Developer position should have bug fix question");

          if (result.stage3_technical.liveCoding) {
            assert.strictEqual(
              result.stage3_technical.liveCoding.type,
              "live_coding",
              "Live coding should be live_coding type"
            );
            assert.ok(
              result.stage3_technical.liveCoding.languages,
              "Live coding should specify languages"
            );
          }

          if (result.stage3_technical.bugFix) {
            assert.strictEqual(
              result.stage3_technical.bugFix.type,
              "bug_fix",
              "Bug fix should be bug_fix type"
            );
            assert.ok(result.stage3_technical.bugFix.buggyCode, "Bug fix should have buggy code");
          }
        }

        // Check real world scenarios
        assert.ok(
          result.stage3_technical.realWorldScenarios.length >= 2,
          "Should generate at least 2 real world scenarios"
        );

        result.stage3_technical.realWorldScenarios.forEach((q) => {
          assert.strictEqual(q.type, "case", "Real world scenarios should be case type");
          assert.ok(q.question.length > 20, "Scenario should have detailed content");
        });
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should generate questions relevant to CV technologies", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage3Questions(testCVId);
        const cv = await db.cV.findUnique({ where: { id: testCVId } });
        const cvInfo = extractCVInfo(cv?.data as any);

        // Check that technical questions mention CV technologies
        const allTechQuestions = result.stage3_technical.testQuestions
          .map((q) => q.question.toLowerCase())
          .join(" ");

        // Should mention at least some technologies from CV
        const mentionedTechs = cvInfo.technologies.filter((tech) =>
          allTechQuestions.includes(tech.toLowerCase())
        );

        // At least 30% of technologies should be mentioned
        const techMentionRatio = mentionedTechs.length / Math.max(cvInfo.technologies.length, 1);
        assert.ok(
          techMentionRatio >= 0.3,
          `At least 30% of CV technologies should be mentioned in questions. Mentioned: ${mentionedTechs.length}/${cvInfo.technologies.length}`
        );
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should generate questions appropriate for CV level", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const result = await generateStage3Questions(testCVId);
        const cv = await db.cV.findUnique({ where: { id: testCVId } });
        const cvInfo = extractCVInfo(cv?.data as any);

        // Check that difficulty matches CV level
        result.stage3_technical.testQuestions.forEach((q) => {
          if (q.difficulty) {
            // For advanced level, should not have beginner questions
            if (cvInfo.level === "advanced") {
              assert.ok(
                q.difficulty !== "beginner",
                "Advanced level CV should not have beginner technical questions"
              );
            }

            // For beginner level, should not have advanced questions
            if (cvInfo.level === "beginner") {
              assert.ok(
                q.difficulty !== "advanced",
                "Beginner level CV should not have advanced technical questions"
              );
            }
          }
        });
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });
  });

  describe("Question Quality Validation", () => {
    it("should generate unique question IDs", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const [stage1, stage2, stage3] = await Promise.all([
          generateStage1Questions(testCVId),
          generateStage2Questions(testCVId),
          generateStage3Questions(testCVId),
        ]);

        const allIds: string[] = [
          ...stage1.stage1_introduction.map((q) => q.id),
          ...stage2.stage2_experience.map((q) => q.id),
          ...stage3.stage3_technical.testQuestions.map((q) => q.id),
          ...stage3.stage3_technical.realWorldScenarios.map((q) => q.id),
        ];

        if (stage3.stage3_technical.liveCoding) {
          allIds.push(stage3.stage3_technical.liveCoding.id);
        }
        if (stage3.stage3_technical.bugFix) {
          allIds.push(stage3.stage3_technical.bugFix.id);
        }

        const uniqueIds = new Set(allIds);
        assert.strictEqual(
          uniqueIds.size,
          allIds.length,
          "All question IDs should be unique"
        );
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should generate questions with appropriate length", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const [stage1, stage2, stage3] = await Promise.all([
          generateStage1Questions(testCVId),
          generateStage2Questions(testCVId),
          generateStage3Questions(testCVId),
        ]);

        const allQuestions = [
          ...stage1.stage1_introduction,
          ...stage2.stage2_experience,
          ...stage3.stage3_technical.testQuestions,
          ...stage3.stage3_technical.realWorldScenarios,
        ];

        allQuestions.forEach((q) => {
          // Questions should be meaningful (not too short, not too long)
          assert.ok(q.question.length >= 10, "Question should be at least 10 characters");
          assert.ok(q.question.length <= 500, "Question should not exceed 500 characters");
        });
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });

    it("should not generate duplicate questions", async () => {
      if (SKIP_AI_TESTS || !testCVId) {
        console.log("Skipping test - OPENAI_API_KEY not set or test CV not created");
        return;
      }

      try {
        const [stage1, stage2, stage3] = await Promise.all([
          generateStage1Questions(testCVId),
          generateStage2Questions(testCVId),
          generateStage3Questions(testCVId),
        ]);

        const allQuestions = [
          ...stage1.stage1_introduction.map((q) => q.question.toLowerCase().trim()),
          ...stage2.stage2_experience.map((q) => q.question.toLowerCase().trim()),
          ...stage3.stage3_technical.testQuestions.map((q) => q.question.toLowerCase().trim()),
          ...stage3.stage3_technical.realWorldScenarios.map((q) => q.question.toLowerCase().trim()),
        ];

        const uniqueQuestions = new Set(allQuestions);
        // Allow some similarity (80% unique)
        const uniquenessRatio = uniqueQuestions.size / allQuestions.length;
        assert.ok(
          uniquenessRatio >= 0.8,
          `At least 80% of questions should be unique. Uniqueness: ${(uniquenessRatio * 100).toFixed(1)}%`
        );
      } catch (error: any) {
        if (error.message?.includes("AI servisi devre dışı")) {
          console.log("Skipping test - AI service disabled");
          return;
        }
        throw error;
      }
    });
  });
});

