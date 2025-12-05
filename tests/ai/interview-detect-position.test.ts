/**
 * Detect Position Type Tests
 * Tests the position type detection logic through extractCVInfo
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { extractCVInfo } from "@/lib/ai/interview-generator";

interface CVData {
  personalInfo?: {
    name?: string;
  };
  summary?: string;
  experience?: Array<{
    position?: string;
    description?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string;
  }>;
  skills?: string[];
}

describe("Detect Position Type Tests", () => {
  describe("Developer Position Type (Default)", () => {
    it("should default to developer when no specific keywords found", () => {
      const cvData: CVData = {
        summary: "Software developer with web development experience",
        skills: ["JavaScript", "HTML", "CSS"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "developer");
    });

    it("should default to developer for generic programming roles", () => {
      const cvData: CVData = {
        summary: "Full stack developer",
        skills: ["React", "Node.js", "PostgreSQL"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "developer");
    });
  });

  describe("DevOps Position Type", () => {
    it("should detect devops from summary keyword", () => {
      const cvData: CVData = {
        summary: "DevOps engineer with CI/CD experience",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from Docker keyword", () => {
      const cvData: CVData = {
        skills: ["Docker", "Kubernetes", "Linux"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from Kubernetes keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            description: "Managed Kubernetes clusters",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from CI/CD keyword", () => {
      const cvData: CVData = {
        summary: "Engineer with CI/CD pipeline experience",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from Terraform keyword", () => {
      const cvData: CVData = {
        skills: ["Terraform", "AWS"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from Ansible keyword", () => {
      const cvData: CVData = {
        skills: ["Ansible", "Linux"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from Jenkins keyword", () => {
      const cvData: CVData = {
        skills: ["Jenkins", "Docker"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from GitLab CI keyword", () => {
      const cvData: CVData = {
        projects: [
          {
            description: "Set up GitLab CI pipelines",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect devops from GitHub Actions keyword", () => {
      const cvData: CVData = {
        projects: [
          {
            description: "Configured GitHub Actions workflows",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });
  });

  describe("Test Engineer Position Type", () => {
    it("should detect test_engineer from position keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Test Engineer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from QA Engineer keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "QA Engineer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from Quality Assurance keyword", () => {
      const cvData: CVData = {
        summary: "Quality Assurance professional",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from Test Automation keyword", () => {
      const cvData: CVData = {
        skills: ["Test Automation", "Selenium"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from Selenium keyword", () => {
      const cvData: CVData = {
        skills: ["Selenium", "Java"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from Cypress keyword", () => {
      const cvData: CVData = {
        skills: ["Cypress", "JavaScript"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from JUnit keyword", () => {
      const cvData: CVData = {
        skills: ["JUnit", "Java"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should detect test_engineer from TestNG keyword", () => {
      const cvData: CVData = {
        skills: ["TestNG", "Selenium"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });
  });

  describe("Security Engineer Position Type", () => {
    it("should detect security_engineer from position keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Security Engineer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });

    it("should detect security_engineer from Cybersecurity keyword", () => {
      const cvData: CVData = {
        summary: "Cybersecurity specialist",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });

    it("should detect security_engineer from Penetration Testing keyword", () => {
      const cvData: CVData = {
        skills: ["Penetration Testing", "Kali Linux"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });

    it("should detect security_engineer from Vulnerability keyword", () => {
      const cvData: CVData = {
        projects: [
          {
            description: "Vulnerability assessment and management",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });

    it("should detect security_engineer from OWASP keyword", () => {
      const cvData: CVData = {
        skills: ["OWASP", "Security"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });

    it("should detect security_engineer from Security Audit keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            description: "Conducted security audit",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "security_engineer");
    });
  });

  describe("Data Engineer Position Type", () => {
    it("should detect data_engineer from position keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Data Engineer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect data_engineer from Data Scientist keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Data Scientist",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect data_engineer from ETL keyword", () => {
      const cvData: CVData = {
        skills: ["ETL", "Python"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect data_engineer from Data Pipeline keyword", () => {
      const cvData: CVData = {
        projects: [
          {
            description: "Built data pipeline for analytics",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect data_engineer from Spark keyword", () => {
      const cvData: CVData = {
        skills: ["Spark", "Scala"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect data_engineer from Hadoop keyword", () => {
      const cvData: CVData = {
        skills: ["Hadoop", "Hive"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });

    it("should detect data_engineer from Data Warehouse keyword", () => {
      const cvData: CVData = {
        summary: "Data warehouse design and implementation",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "data_engineer");
    });
  });

  describe("Cloud Engineer Position Type", () => {
    it("should detect cloud_engineer from position keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Cloud Engineer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });

    it("should detect cloud_engineer from Cloud Architect keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Cloud Architect",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });

    it("should detect cloud_engineer from AWS keyword", () => {
      const cvData: CVData = {
        skills: ["AWS", "EC2", "S3"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });

    it("should detect cloud_engineer from Azure keyword", () => {
      const cvData: CVData = {
        skills: ["Azure", "Azure Functions"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });

    it("should detect cloud_engineer from GCP keyword", () => {
      const cvData: CVData = {
        skills: ["GCP", "Google Cloud"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });

    it("should detect cloud_engineer from Google Cloud keyword", () => {
      const cvData: CVData = {
        summary: "Google Cloud Platform specialist",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "cloud_engineer");
    });
  });

  describe("System Admin Position Type", () => {
    it("should detect system_admin from System Administrator keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "System Administrator",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "system_admin");
    });

    it("should detect system_admin from Sysadmin keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Sysadmin",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "system_admin");
    });

    it("should detect system_admin from Network Administrator keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Network Administrator",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "system_admin");
    });

    it("should detect system_admin from IT Administrator keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "IT Administrator",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "system_admin");
    });

    it("should detect system_admin from Server Management keyword", () => {
      const cvData: CVData = {
        summary: "Server management and maintenance",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "system_admin");
    });
  });

  describe("Network Engineer Position Type", () => {
    it("should detect network_engineer from position keyword", () => {
      const cvData: CVData = {
        experience: [
          {
            position: "Network Engineer",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "network_engineer");
    });

    it("should detect network_engineer from CCNA keyword", () => {
      const cvData: CVData = {
        skills: ["CCNA", "Networking"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "network_engineer");
    });

    it("should detect network_engineer from CCNP keyword", () => {
      const cvData: CVData = {
        skills: ["CCNP", "Routing"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "network_engineer");
    });

    it("should detect network_engineer from Routing keyword", () => {
      const cvData: CVData = {
        summary: "Network routing and switching",
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "network_engineer");
    });

    it("should detect network_engineer from Switching keyword", () => {
      const cvData: CVData = {
        projects: [
          {
            description: "Switching configuration",
          },
        ],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "network_engineer");
    });
  });

  describe("Priority and Precedence", () => {
    it("should prioritize devops over developer when both keywords present", () => {
      const cvData: CVData = {
        summary: "Software developer with DevOps experience",
        skills: ["Docker", "Kubernetes", "React"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should prioritize test_engineer over developer when both keywords present", () => {
      const cvData: CVData = {
        summary: "Developer with test automation experience",
        skills: ["Selenium", "JavaScript"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "test_engineer");
    });

    it("should be case-insensitive", () => {
      const cvData: CVData = {
        summary: "DEVOPS ENGINEER",
        skills: ["DOCKER", "KUBERNETES"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });

    it("should detect from multiple sources (summary, experience, projects, skills)", () => {
      const cvData: CVData = {
        summary: "Software engineer",
        experience: [
          {
            description: "Worked with Docker and Kubernetes",
          },
        ],
        projects: [
          {
            description: "CI/CD pipeline setup",
          },
        ],
        skills: ["Terraform"],
      };

      const result = extractCVInfo(cvData);

      assert.strictEqual(result.positionType, "devops");
    });
  });
});

