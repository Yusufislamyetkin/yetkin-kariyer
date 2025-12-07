import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkCourseCompletion } from "@/lib/certificates/certificate-service";
import {
  getRoadmapForPath,
  type RoadmapStep,
  type RoadmapStepType,
} from "@/lib/services/career/roadmap-steps";
import {
  findCourseByMetadata,
  findTestsByMetadata,
  findLiveCodingByMetadata,
} from "@/lib/services/career/career-path-mapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface StepProgress {
  stepId: string;
  completed: boolean;
  progress?: number; // 0-100
  details?: any;
}

interface ProgressResponse {
  path: string;
  steps: StepProgress[];
  overallProgress: number; // 0-100
}

/**
 * Check course step completion
 */
async function checkCourseStep(
  userId: string,
  step: RoadmapStep & { type: "course" }
): Promise<StepProgress> {
  const { metadata } = step;

  // Find course
  const courseMatch = await findCourseByMetadata({
    courseTitle: metadata.courseTitle,
    topic: metadata.topic,
    expertise: metadata.expertise,
  });

  if (!courseMatch || !courseMatch.found) {
    return {
      stepId: step.id,
      completed: false,
      progress: 0,
      details: { error: "Course not found" },
    };
  }

  // Check completion
  const completion = await checkCourseCompletion(userId, courseMatch.courseId);

  return {
    stepId: step.id,
    completed: completion.completed,
    progress:
      completion.totalLessons > 0
        ? Math.round(
            (completion.completedLessons / completion.totalLessons) * 100
          )
        : 0,
    details: {
      courseId: courseMatch.courseId,
      courseTitle: courseMatch.title,
      completedLessons: completion.completedLessons,
      totalLessons: completion.totalLessons,
    },
  };
}

/**
 * Check test step completion
 */
async function checkTestStep(
  userId: string,
  step: RoadmapStep & { type: "test" }
): Promise<StepProgress> {
  const { metadata } = step;

  // Find tests
  const testMatch = await findTestsByMetadata({
    technology: metadata.technology,
    topic: metadata.topic,
  });

  if (!testMatch || !testMatch.found || testMatch.quizIds.length === 0) {
    return {
      stepId: step.id,
      completed: false,
      progress: 0,
      details: { error: "Tests not found" },
    };
  }

  // Check if user has completed any of these tests with passing score
  const attempts = await db.quizAttempt.findMany({
    where: {
      userId,
      quizId: { in: testMatch.quizIds },
      score: { gte: 60 }, // Passing score
    },
    select: {
      quizId: true,
      score: true,
    },
    distinct: ["quizId"],
  });

  const completedCount = attempts.length;
  const totalTests = testMatch.quizIds.length;
  const progress =
    totalTests > 0 ? Math.round((completedCount / totalTests) * 100) : 0;

  return {
    stepId: step.id,
    completed: completedCount > 0, // At least one test passed
    progress,
    details: {
      completedTests: completedCount,
      totalTests,
      quizIds: testMatch.quizIds,
    },
  };
}

/**
 * Check live coding step completion
 */
async function checkLiveCodingStep(
  userId: string,
  step: RoadmapStep & { type: "live_coding" }
): Promise<StepProgress> {
  const { metadata } = step;

  // Find live coding quizzes
  const liveCodingMatch = await findLiveCodingByMetadata({
    language: metadata.language,
    technology: metadata.technology,
  });

  if (!liveCodingMatch || !liveCodingMatch.found || liveCodingMatch.quizIds.length === 0) {
    return {
      stepId: step.id,
      completed: false,
      progress: 0,
      details: { error: "Live coding cases not found" },
    };
  }

  // Check if user has completed any of these live coding cases
  const attempts = await db.liveCodingAttempt.findMany({
    where: {
      userId,
      quizId: { in: liveCodingMatch.quizIds },
      completedAt: { not: null },
    },
    select: {
      quizId: true,
      completedAt: true,
    },
    distinct: ["quizId"],
  });

  const completedCount = attempts.length;
  const totalCases = liveCodingMatch.quizIds.length;
  const progress =
    totalCases > 0 ? Math.round((completedCount / totalCases) * 100) : 0;

  return {
    stepId: step.id,
    completed: completedCount > 0, // At least one case completed
    progress,
    details: {
      completedCases: completedCount,
      totalCases,
      quizIds: liveCodingMatch.quizIds,
    },
  };
}

/**
 * Check badge step completion
 */
async function checkBadgeStep(
  userId: string,
  step: RoadmapStep & { type: "badge" }
): Promise<StepProgress> {
  const { metadata } = step;

  if (metadata.monthlyReward) {
    // Check if user has earned monthly badges
    // This is a simplified check - you might want to add more specific logic
    const userBadges = await db.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const badgeCount = userBadges.length;
    // Consider completed if user has at least 5 badges (adjust threshold as needed)
    const completed = badgeCount >= 5;

    return {
      stepId: step.id,
      completed,
      progress: Math.min(badgeCount * 20, 100), // 5 badges = 100%
      details: {
        badgeCount,
        monthlyReward: true,
      },
    };
  }

  // Check specific badge if badgeKey is provided
  if (metadata.badgeKey) {
    const badge = await db.badge.findUnique({
      where: { key: metadata.badgeKey },
      select: { id: true },
    });

    if (badge) {
      const userBadge = await db.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },
      });

      return {
        stepId: step.id,
        completed: !!userBadge,
        progress: userBadge ? 100 : 0,
        details: {
          badgeKey: metadata.badgeKey,
          earned: !!userBadge,
        },
      };
    }
  }

  return {
    stepId: step.id,
    completed: false,
    progress: 0,
    details: { error: "Badge criteria not specified" },
  };
}

/**
 * Check CV step completion
 */
async function checkCVStep(
  userId: string,
  step: RoadmapStep & { type: "cv" }
): Promise<StepProgress> {
  const cvs = await db.cV.findMany({
    where: { userId },
    select: { id: true },
  });

  return {
    stepId: step.id,
    completed: cvs.length > 0,
    progress: cvs.length > 0 ? 100 : 0,
    details: {
      cvCount: cvs.length,
    },
  };
}

/**
 * Check freelancer step completion
 */
async function checkFreelancerStep(
  userId: string,
  step: RoadmapStep & { type: "freelancer" }
): Promise<StepProgress> {
  const { metadata } = step;
  const minProjects = metadata.minProjects || 1;

  // Check accepted bids (projects user has been accepted for)
  const acceptedBids = await db.freelancerBid.findMany({
    where: {
      userId,
      status: "accepted",
    },
    select: {
      id: true,
      projectId: true,
    },
    distinct: ["projectId"],
  });

  const projectCount = acceptedBids.length;
  const completed = projectCount >= minProjects;
  const progress = minProjects > 0
    ? Math.min(Math.round((projectCount / minProjects) * 100), 100)
    : projectCount > 0 ? 100 : 0;

  return {
    stepId: step.id,
    completed,
    progress,
    details: {
      projectCount,
      minProjects,
    },
  };
}

/**
 * Check hackathon step completion
 */
async function checkHackathonStep(
  userId: string,
  step: RoadmapStep & { type: "hackathon" }
): Promise<StepProgress> {
  const { metadata } = step;
  const minParticipations = metadata.minParticipations || 1;

  // Check approved hackathon applications
  const applications = await db.hackathonApplication.findMany({
    where: {
      userId,
      status: {
        in: ["approved", "auto_accepted"],
      },
    },
    select: {
      id: true,
      hackathonId: true,
    },
    distinct: ["hackathonId"],
  });

  const participationCount = applications.length;
  const completed = participationCount >= minParticipations;
  const progress = minParticipations > 0
    ? Math.min(Math.round((participationCount / minParticipations) * 100), 100)
    : participationCount > 0 ? 100 : 0;

  return {
    stepId: step.id,
    completed,
    progress,
    details: {
      participationCount,
      minParticipations,
    },
  };
}

/**
 * Check job application step completion
 */
async function checkJobApplicationStep(
  userId: string,
  step: RoadmapStep & { type: "job_application" }
): Promise<StepProgress> {
  const { metadata } = step;
  const minApplications = metadata.minApplications || 1;

  const applications = await db.jobApplication.findMany({
    where: { userId },
    select: { id: true },
  });

  const applicationCount = applications.length;
  const completed = applicationCount >= minApplications;
  const progress = minApplications > 0
    ? Math.min(Math.round((applicationCount / minApplications) * 100), 100)
    : applicationCount > 0 ? 100 : 0;

  return {
    stepId: step.id,
    completed,
    progress,
    details: {
      applicationCount,
      minApplications,
    },
  };
}

/**
 * Check step completion based on type
 */
async function checkStepProgress(
  userId: string,
  step: RoadmapStep
): Promise<StepProgress> {
  switch (step.type) {
    case "course":
      return checkCourseStep(userId, step as RoadmapStep & { type: "course" });
    case "test":
      return checkTestStep(userId, step as RoadmapStep & { type: "test" });
    case "live_coding":
      return checkLiveCodingStep(
        userId,
        step as RoadmapStep & { type: "live_coding" }
      );
    case "badge":
      return checkBadgeStep(userId, step as RoadmapStep & { type: "badge" });
    case "cv":
      return checkCVStep(userId, step as RoadmapStep & { type: "cv" });
    case "freelancer":
      return checkFreelancerStep(
        userId,
        step as RoadmapStep & { type: "freelancer" }
      );
    case "hackathon":
      return checkHackathonStep(
        userId,
        step as RoadmapStep & { type: "hackathon" }
      );
    case "job_application":
      return checkJobApplicationStep(
        userId,
        step as RoadmapStep & { type: "job_application" }
      );
    default:
      return {
        stepId: (step as RoadmapStep).id,
        completed: false,
        progress: 0,
        details: { error: "Unknown step type" },
      };
  }
}

/**
 * GET /api/career/roadmap/progress
 * Get progress for all steps in a career path roadmap
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 }
      );
    }

    const roadmap = getRoadmapForPath(path);
    if (!roadmap) {
      return NextResponse.json(
        { error: `Roadmap not found for path: ${path}` },
        { status: 404 }
      );
    }

    const userId = session.user.id as string;

    // Check progress for all steps
    const stepProgresses = await Promise.all(
      roadmap.steps.map((step) => checkStepProgress(userId, step))
    );

    // Calculate overall progress
    const totalSteps = roadmap.steps.length;
    const completedSteps = stepProgresses.filter((sp) => sp.completed).length;
    const overallProgress =
      totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : 0;

    const response: ProgressResponse = {
      path: roadmap.path,
      steps: stepProgresses,
      overallProgress,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[ROADMAP_PROGRESS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

