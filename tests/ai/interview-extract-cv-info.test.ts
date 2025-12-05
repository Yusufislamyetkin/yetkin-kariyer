/**
 * Extract CV Info Tests
 * Tests the extractCVInfo function for extracting technologies, level, experience, etc.
 */

import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";
import { extractCVInfo } from "@/lib/ai/interview-generator";

interface CVData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    profilePhoto?: string;
  };
  summary?: string;
  experience?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    current?: boolean;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: string[];
  languages?: Array<{
    name?: string;
    level?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
  }>;
  references?: Array<{
    name?: string;
    position?: string;
    company?: string;
    email?: string;
    phone?: string;
  }>;
  hobbies?: string[];
}

describe("Extract CV Info Tests", () => {
  describe("Technology Extraction", () => {
    it("should extract technologies from skills array", () => {
      const cvData: CVData = {
        skills: ["React", "TypeScript", "Node.js", "MongoDB"],
      };

      const result = extractCVInfo(cvData);

      assert.ok(Array.isArray(result.technologies));
      assert.strictEqual(result.technologies.length, 4);
      assert.ok(result.technologies.includes("React"));
      assert.ok(result.technologies.includes("TypeScript"));
      assert.ok(result.technologies.includes("Node.js"));
      assert.ok(result.technologies.includes("MongoDB"));
    });

    it("should extract technologies from projects", () => {
      const cvData: CVData = {
        projects: [
          {
            name: "Project 1",
            technologies: "React, TypeScript, Node.js",
          },
          {
            name: "Project 2",
            technologies: "Vue.js; Python; Django",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.ok(result.technologies.length >= 5);
      assert.ok(result.technologies.includes("React"));
      assert.ok(result.technologies.includes("TypeScript"));
      assert.ok(result.technologies.includes("Node.js"));
      assert.ok(result.technologies.includes("Vue.js"));
      assert.ok(result.technologies.includes("Python"));
      assert.ok(result.technologies.includes("Django"));
    });

    it("should extract technologies from experience descriptions", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Developer",
            description: "Worked with React and Node.js to build microservices using Docker and Kubernetes",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.ok(result.technologies.length >= 4);
      assert.ok(result.technologies.includes("React"));
      assert.ok(result.technologies.includes("Node.js"));
      assert.ok(result.technologies.includes("Docker"));
      assert.ok(result.technologies.includes("Kubernetes"));
      assert.ok(result.technologies.includes("Microservices"));
    });

    it("should remove duplicate technologies", () => {
      const cvData: CVData = {
        skills: ["React", "TypeScript"],
        projects: [
          {
            name: "Project 1",
            technologies: "React, Node.js",
          },
        ],
        experience: [
          {
            description: "Used React and TypeScript in production",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      const reactCount = result.technologies.filter((t) => t === "React").length;
      const typescriptCount = result.technologies.filter((t) => t === "TypeScript").length;

      assert.strictEqual(reactCount, 1);
      assert.strictEqual(typescriptCount, 1);
    });

    it("should handle empty skills array", () => {
      const cvData: CVData = {
        skills: [],
      };

      const result = extractCVInfo(cvData);

      assert.ok(Array.isArray(result.technologies));
      assert.strictEqual(result.technologies.length, 0);
    });

    it("should handle missing skills field", () => {
      const cvData: CVData = {};

      const result = extractCVInfo(cvData);

      assert.ok(Array.isArray(result.technologies));
    });
  });

  describe("Level Detection", () => {
    it("should detect advanced level from senior position", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Senior Software Engineer",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "advanced");
    });

    it("should detect advanced level from lead position", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Lead Developer",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "advanced");
    });

    it("should detect advanced level from architect position", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Software Architect",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "advanced");
    });

    it("should detect beginner level from junior position", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Junior Developer",
            startDate: "2023-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "beginner");
    });

    it("should detect beginner level from intern position", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Software Intern",
            startDate: "2023-06-01",
            endDate: "2023-08-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "beginner");
    });

    it("should detect intermediate level by default", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Software Engineer",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "intermediate");
    });

    it("should upgrade to advanced level with 5+ years experience", () => {
      const now = new Date();
      const sixYearsAgo = new Date(now.getFullYear() - 6, now.getMonth(), 1);
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Software Engineer",
            startDate: sixYearsAgo.toISOString().split("T")[0],
            endDate: now.toISOString().split("T")[0],
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "advanced");
    });

    it("should downgrade to beginner level with less than 2 years experience", () => {
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Software Engineer",
            startDate: oneYearAgo.toISOString().split("T")[0],
            endDate: now.toISOString().split("T")[0],
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.level, "beginner");
    });
  });

  describe("Experience Years Calculation", () => {
    it("should calculate experience years correctly", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Developer",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.ok(result.yearsOfExperience >= 3.5);
      assert.ok(result.yearsOfExperience <= 4.5);
    });

    it("should handle current position", () => {
      const now = new Date();
      const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), 1);
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Developer",
            startDate: twoYearsAgo.toISOString().split("T")[0],
            current: true,
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.ok(result.yearsOfExperience >= 1.8);
      assert.ok(result.yearsOfExperience <= 2.2);
    });

    it("should sum multiple experiences", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Company A",
            position: "Developer",
            startDate: "2020-01-01",
            endDate: "2021-12-31",
          },
          {
            company: "Company B",
            position: "Developer",
            startDate: "2022-01-01",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.ok(result.yearsOfExperience >= 3.5);
      assert.ok(result.yearsOfExperience <= 4.5);
    });

    it("should handle missing start date", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Developer",
            endDate: "2023-12-31",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.yearsOfExperience, 0);
    });

    it("should handle empty experience array", () => {
      const cvData: CVData = {
        experience: [],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.yearsOfExperience, 0);
    });
  });

  describe("Position Extraction", () => {
    it("should extract position from first experience", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Senior Developer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.position, "Senior Developer");
    });

    it("should fallback to personalInfo name if no experience", () => {
      const cvData: CVData = {
        personalInfo: {
          name: "John Doe",
        },
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.position, "John Doe");
    });

    it("should default to Developer if no position or name", () => {
      const cvData: CVData = {};

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.position, "Developer");
    });
  });

  describe("English Level Extraction", () => {
    it("should extract English level from languages", () => {
      const cvData: CVData = {
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
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.englishLevel, "Advanced");
    });

    it("should handle case-insensitive English detection", () => {
      const cvData: CVData = {
        languages: [
          {
            name: "ENGLISH",
            level: "Intermediate",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.englishLevel, "Intermediate");
    });

    it("should default to 'Not specified' if no English found", () => {
      const cvData: CVData = {
        languages: [
          {
            name: "Turkish",
            level: "Native",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.englishLevel, "Not specified");
    });

    it("should default to 'Not specified' if no languages", () => {
      const cvData: CVData = {};

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.englishLevel, "Not specified");
    });
  });

  describe("Position Type Detection", () => {
    it("should detect developer position type by default", () => {
      const cvData: CVData = {
        summary: "Software developer with experience in web development",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "developer");
    });

    it("should detect devops position type", () => {
      const cvData: CVData = {
        summary: "DevOps engineer with Docker and Kubernetes experience",
        skills: ["Docker", "Kubernetes", "CI/CD"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect test_engineer position type", () => {
      const cvData: CVData = {
        summary: "QA Engineer with test automation experience",
        skills: ["Selenium", "Cypress", "Test Automation"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect security_engineer position type", () => {
      const cvData: CVData = {
        summary: "Security engineer with penetration testing experience",
        skills: ["Cybersecurity", "OWASP", "Vulnerability Assessment"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });

    it("should detect data_engineer position type", () => {
      const cvData: CVData = {
        summary: "Data engineer with ETL and data pipeline experience",
        skills: ["Spark", "Hadoop", "ETL"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect cloud_engineer position type", () => {
      const cvData: CVData = {
        summary: "Cloud engineer with AWS and Azure experience",
        skills: ["AWS", "Azure", "GCP"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });

    it("should detect system_admin position type", () => {
      const cvData: CVData = {
        summary: "System administrator with server management experience",
        skills: ["Linux", "Server Management"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "system_admin");
    });

    it("should detect network_engineer position type", () => {
      const cvData: CVData = {
        summary: "Network engineer with CCNA certification",
        skills: ["CCNA", "Routing", "Switching"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "network_engineer");
    });
  });

  describe("Edge Cases", () => {
    it("should handle completely empty CV data", () => {
      const cvData: CVData = {};

      const result = extractCVInfo(cvData);

      assert.ok(result);
      assert.ok(Array.isArray(result.technologies));
      // With 0 years of experience, level defaults to beginner
      assert.strictEqual(result.level, "beginner");
      assert.strictEqual(result.yearsOfExperience, 0);
      assert.strictEqual(result.position, "Developer");
      assert.strictEqual(result.englishLevel, "Not specified");
      assert.strictEqual(result.positionType, "developer");
    });

    it("should handle null/undefined values gracefully", () => {
      const cvData: CVData = {
        skills: [null as any, undefined as any, "React"],
        experience: [
          {
            company: undefined,
            position: null as any,
            description: undefined,
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.ok(result);
      assert.ok(result.technologies.includes("React"));
    });

    it("should handle invalid date formats", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Developer",
            startDate: "invalid-date",
            endDate: "also-invalid",
          },
        ],
      };

      // Should not throw, but may result in 0 years
      const result = extractCVInfo(cvData);

      assert.ok(result);
      assert.ok(typeof result.yearsOfExperience === "number");
    });

    it("should round years of experience to 1 decimal place", () => {
      const cvData: CVData = {
        experience: [
          {
            company: "Tech Corp",
            position: "Developer",
            startDate: "2020-01-01",
            endDate: "2023-06-15", // 3.5 years approximately
          },
        ],
      };

      const result = extractCVInfo(cvData);

      // Should be rounded to 1 decimal place
      const decimalPlaces = result.yearsOfExperience.toString().split(".")[1]?.length || 0;
      assert.ok(decimalPlaces <= 1);
    });
  });
});

