/**
 * Career Roadmap Steps Service
 * Defines the step-by-step roadmap structure for different career paths
 */

export type RoadmapStepType =
  | "course" // Kurs öğren
  | "test" // Test çöz
  | "live_coding" // Canlı kodlama
  | "badge" // Rozet tamamla
  | "cv" // CV oluştur
  | "freelancer" // Freelancer proje
  | "hackathon" // Hackathon katılımı
  | "job_application"; // İş başvurusu

export interface BaseRoadmapStep {
  id: string;
  type: RoadmapStepType;
  title: string;
  description?: string;
  order: number;
  dependsOn?: string[]; // IDs of steps that must be completed first
  link?: string; // URL to navigate to
  metadata?: Record<string, any>; // Additional data for step completion checking
}

export interface CourseStep extends BaseRoadmapStep {
  type: "course";
  metadata: {
    courseTitle?: string; // Course title to search for
    courseId?: string; // Direct course ID if known
    topic?: string; // Course topic
    expertise?: string; // Course expertise
  };
}

export interface TestStep extends BaseRoadmapStep {
  type: "test";
  metadata: {
    technology?: string; // Technology name (e.g., "dotnet-core", "docker", "sql")
    topic?: string; // Test topic
    module?: string; // Module identifier
  };
}

export interface LiveCodingStep extends BaseRoadmapStep {
  type: "live_coding";
  metadata: {
    language?: string; // Programming language (e.g., "csharp", "javascript")
    technology?: string; // Technology name
  };
}

export interface BadgeStep extends BaseRoadmapStep {
  type: "badge";
  metadata: {
    badgeKey?: string; // Badge key to check
    badgeCategory?: string; // Badge category
    monthlyReward?: boolean; // Whether this is for monthly reward
  };
}

export interface CVStep extends BaseRoadmapStep {
  type: "cv";
  metadata: Record<string, any>;
}

export interface FreelancerStep extends BaseRoadmapStep {
  type: "freelancer";
  metadata: {
    minProjects?: number; // Minimum number of projects
  };
}

export interface HackathonStep extends BaseRoadmapStep {
  type: "hackathon";
  metadata: {
    minParticipations?: number; // Minimum number of participations
  };
}

export interface JobApplicationStep extends BaseRoadmapStep {
  type: "job_application";
  metadata: {
    minApplications?: number; // Minimum number of applications
  };
}

export type RoadmapStep =
  | CourseStep
  | TestStep
  | LiveCodingStep
  | BadgeStep
  | CVStep
  | FreelancerStep
  | HackathonStep
  | JobApplicationStep;

export interface CareerPathRoadmap {
  path: string; // Career path identifier (e.g., "backend", "frontend")
  name: string; // Display name
  steps: RoadmapStep[];
}

/**
 * Backend career path roadmap
 * Example: .NET Core, Docker, SQL, etc.
 */
export function getBackendRoadmap(): CareerPathRoadmap {
  return {
    path: "backend",
    name: "Backend Geliştirici",
    steps: [
      {
        id: "backend-1",
        type: "course",
        title: ".NET CORE KURSU ÖĞREN",
        description: ".NET Core kursunu tamamlayın",
        order: 1,
        link: "/education/courses",
        metadata: {
          courseTitle: ".NET Core",
          topic: ".NET Core",
          expertise: "BACKEND",
        },
      },
      {
        id: "backend-2",
        type: "course",
        title: "DOCKER ÖĞREN",
        description: "Docker kursunu tamamlayın",
        order: 2,
        link: "/education/courses",
        metadata: {
          courseTitle: "Docker",
          topic: "Docker",
        },
      },
      {
        id: "backend-3",
        type: "course",
        title: "SQL KURSU ÖĞREN",
        description: "SQL kursunu tamamlayın",
        order: 3,
        link: "/education/courses",
        metadata: {
          courseTitle: "SQL",
          topic: "SQL",
        },
      },
      {
        id: "backend-4",
        type: "test",
        title: ".NET CORE TESTLERİ ÇÖZ",
        description: ".NET Core testlerini çözün",
        order: 4,
        dependsOn: ["backend-1"],
        link: "/education/tests",
        metadata: {
          technology: "dotnet-core",
          topic: ".NET Core",
        },
      },
      {
        id: "backend-5",
        type: "test",
        title: "DOCKER TESTLERİ ÇÖZ",
        description: "Docker testlerini çözün",
        order: 5,
        dependsOn: ["backend-2"],
        link: "/education/tests",
        metadata: {
          technology: "docker",
          topic: "Docker",
        },
      },
      {
        id: "backend-6",
        type: "test",
        title: "SQL TESTLERİ ÇÖZ",
        description: "SQL testlerini çözün",
        order: 6,
        dependsOn: ["backend-3"],
        link: "/education/tests",
        metadata: {
          technology: "sql",
          topic: "SQL",
        },
      },
      {
        id: "backend-7",
        type: "live_coding",
        title: "C# CANLI KODLAMA CASELERİ TAMAMLA",
        description: "C# canlı kodlama case'lerini tamamlayın",
        order: 7,
        dependsOn: ["backend-4"],
        link: "/education/live-coding",
        metadata: {
          language: "csharp",
          technology: ".NET Core",
        },
      },
      {
        id: "backend-8",
        type: "badge",
        title: "ROZETLERİ TAMAMLA AYLIK ÖDÜL AL",
        description: "Rozetleri tamamlayın ve aylık ödül alın",
        order: 8,
        link: "/profile",
        metadata: {
          monthlyReward: true,
        },
      },
      {
        id: "backend-9",
        type: "cv",
        title: "CV OLUŞTUR",
        description: "CV'nizi oluşturun",
        order: 9,
        link: "/cv",
        metadata: {},
      },
      {
        id: "backend-10",
        type: "freelancer",
        title: "FREELANCER PROJELER ÜRET",
        description: "Freelancer projeler üretin",
        order: 10,
        dependsOn: ["backend-9"],
        link: "/freelancer",
        metadata: {
          minProjects: 1,
        },
      },
      {
        id: "backend-11",
        type: "hackathon",
        title: "HACKATONLARA KATIL",
        description: "Hackathonlara katılın",
        order: 11,
        link: "/hackathons",
        metadata: {
          minParticipations: 1,
        },
      },
      {
        id: "backend-12",
        type: "job_application",
        title: "ANLAŞMALI İŞ İLANLARINA BAŞVUR",
        description: "Anlaşmalı iş ilanlarına başvurun",
        order: 12,
        dependsOn: ["backend-9"],
        link: "/jobs",
        metadata: {
          minApplications: 1,
        },
      },
    ],
  };
}

/**
 * Frontend career path roadmap
 */
export function getFrontendRoadmap(): CareerPathRoadmap {
  return {
    path: "frontend",
    name: "Frontend Geliştirici",
    steps: [
      {
        id: "frontend-1",
        type: "course",
        title: "REACT KURSU ÖĞREN",
        description: "React kursunu tamamlayın",
        order: 1,
        link: "/education/courses",
        metadata: {
          courseTitle: "React",
          topic: "React",
          expertise: "FRONTEND",
        },
      },
      {
        id: "frontend-2",
        type: "course",
        title: "TYPESCRIPT ÖĞREN",
        description: "TypeScript kursunu tamamlayın",
        order: 2,
        link: "/education/courses",
        metadata: {
          courseTitle: "TypeScript",
          topic: "TypeScript",
        },
      },
      {
        id: "frontend-3",
        type: "test",
        title: "REACT TESTLERİ ÇÖZ",
        description: "React testlerini çözün",
        order: 3,
        dependsOn: ["frontend-1"],
        link: "/education/tests",
        metadata: {
          technology: "react",
          topic: "React",
        },
      },
      {
        id: "frontend-4",
        type: "test",
        title: "TYPESCRIPT TESTLERİ ÇÖZ",
        description: "TypeScript testlerini çözün",
        order: 4,
        dependsOn: ["frontend-2"],
        link: "/education/tests",
        metadata: {
          technology: "typescript",
          topic: "TypeScript",
        },
      },
      {
        id: "frontend-5",
        type: "live_coding",
        title: "JAVASCRIPT CANLI KODLAMA CASELERİ TAMAMLA",
        description: "JavaScript canlı kodlama case'lerini tamamlayın",
        order: 5,
        dependsOn: ["frontend-3"],
        link: "/education/live-coding",
        metadata: {
          language: "javascript",
          technology: "React",
        },
      },
      {
        id: "frontend-6",
        type: "badge",
        title: "ROZETLERİ TAMAMLA AYLIK ÖDÜL AL",
        description: "Rozetleri tamamlayın ve aylık ödül alın",
        order: 6,
        link: "/profile",
        metadata: {
          monthlyReward: true,
        },
      },
      {
        id: "frontend-7",
        type: "cv",
        title: "CV OLUŞTUR",
        description: "CV'nizi oluşturun",
        order: 7,
        link: "/cv",
        metadata: {},
      },
      {
        id: "frontend-8",
        type: "freelancer",
        title: "FREELANCER PROJELER ÜRET",
        description: "Freelancer projeler üretin",
        order: 8,
        dependsOn: ["frontend-7"],
        link: "/freelancer",
        metadata: {
          minProjects: 1,
        },
      },
      {
        id: "frontend-9",
        type: "hackathon",
        title: "HACKATONLARA KATIL",
        description: "Hackathonlara katılın",
        order: 9,
        link: "/hackathons",
        metadata: {
          minParticipations: 1,
        },
      },
      {
        id: "frontend-10",
        type: "job_application",
        title: "ANLAŞMALI İŞ İLANLARINA BAŞVUR",
        description: "Anlaşmalı iş ilanlarına başvurun",
        order: 10,
        dependsOn: ["frontend-7"],
        link: "/jobs",
        metadata: {
          minApplications: 1,
        },
      },
    ],
  };
}

/**
 * Full-stack career path roadmap
 */
export function getFullStackRoadmap(): CareerPathRoadmap {
  return {
    path: "fullstack",
    name: "Full-Stack Geliştirici",
    steps: [
      {
        id: "fullstack-1",
        type: "course",
        title: "REACT KURSU ÖĞREN",
        description: "React kursunu tamamlayın",
        order: 1,
        link: "/education/courses",
        metadata: {
          courseTitle: "React",
          topic: "React",
          expertise: "FRONTEND",
        },
      },
      {
        id: "fullstack-2",
        type: "course",
        title: "NODE.JS KURSU ÖĞREN",
        description: "Node.js kursunu tamamlayın",
        order: 2,
        link: "/education/courses",
        metadata: {
          courseTitle: "Node.js",
          topic: "Node.js",
          expertise: "BACKEND",
        },
      },
      {
        id: "fullstack-3",
        type: "course",
        title: "DATABASE KURSU ÖĞREN",
        description: "Database kursunu tamamlayın",
        order: 3,
        link: "/education/courses",
        metadata: {
          courseTitle: "SQL",
          topic: "SQL",
        },
      },
      {
        id: "fullstack-4",
        type: "test",
        title: "REACT TESTLERİ ÇÖZ",
        description: "React testlerini çözün",
        order: 4,
        dependsOn: ["fullstack-1"],
        link: "/education/tests",
        metadata: {
          technology: "react",
          topic: "React",
        },
      },
      {
        id: "fullstack-5",
        type: "test",
        title: "NODE.JS TESTLERİ ÇÖZ",
        description: "Node.js testlerini çözün",
        order: 5,
        dependsOn: ["fullstack-2"],
        link: "/education/tests",
        metadata: {
          technology: "nodejs",
          topic: "Node.js",
        },
      },
      {
        id: "fullstack-6",
        type: "badge",
        title: "ROZETLERİ TAMAMLA AYLIK ÖDÜL AL",
        description: "Rozetleri tamamlayın ve aylık ödül alın",
        order: 6,
        link: "/profile",
        metadata: {
          monthlyReward: true,
        },
      },
      {
        id: "fullstack-7",
        type: "cv",
        title: "CV OLUŞTUR",
        description: "CV'nizi oluşturun",
        order: 7,
        link: "/cv",
        metadata: {},
      },
      {
        id: "fullstack-8",
        type: "freelancer",
        title: "FREELANCER PROJELER ÜRET",
        description: "Freelancer projeler üretin",
        order: 8,
        dependsOn: ["fullstack-7"],
        link: "/freelancer",
        metadata: {
          minProjects: 1,
        },
      },
      {
        id: "fullstack-9",
        type: "hackathon",
        title: "HACKATONLARA KATIL",
        description: "Hackathonlara katılın",
        order: 9,
        link: "/hackathons",
        metadata: {
          minParticipations: 1,
        },
      },
      {
        id: "fullstack-10",
        type: "job_application",
        title: "ANLAŞMALI İŞ İLANLARINA BAŞVUR",
        description: "Anlaşmalı iş ilanlarına başvurun",
        order: 10,
        dependsOn: ["fullstack-7"],
        link: "/jobs",
        metadata: {
          minApplications: 1,
        },
      },
    ],
  };
}

/**
 * Get roadmap for a specific career path
 */
export function getRoadmapForPath(path: string): CareerPathRoadmap | null {
  const roadmaps: Record<string, () => CareerPathRoadmap> = {
    backend: getBackendRoadmap,
    frontend: getFrontendRoadmap,
    fullstack: getFullStackRoadmap,
    "full-stack": getFullStackRoadmap,
  };

  const getRoadmap = roadmaps[path.toLowerCase()];
  return getRoadmap ? getRoadmap() : null;
}

/**
 * Get all available career paths
 */
export function getAllCareerPaths(): CareerPathRoadmap[] {
  return [
    getBackendRoadmap(),
    getFrontendRoadmap(),
    getFullStackRoadmap(),
  ];
}

/**
 * Get step by ID from a roadmap
 */
export function getStepById(
  roadmap: CareerPathRoadmap,
  stepId: string
): RoadmapStep | null {
  return roadmap.steps.find((step) => step.id === stepId) || null;
}

/**
 * Get steps that depend on a specific step
 */
export function getDependentSteps(
  roadmap: CareerPathRoadmap,
  stepId: string
): RoadmapStep[] {
  return roadmap.steps.filter(
    (step) => step.dependsOn && step.dependsOn.includes(stepId)
  );
}

/**
 * Check if a step can be started (all dependencies completed)
 */
export function canStartStep(
  step: RoadmapStep,
  completedStepIds: Set<string>
): boolean {
  if (!step.dependsOn || step.dependsOn.length === 0) {
    return true;
  }
  return step.dependsOn.every((depId) => completedStepIds.has(depId));
}

