import { db } from "@/lib/db";

interface ActivityResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

interface ActivityOptions {
  targetId?: string;
  quizId?: string;
}

/**
 * Creates a live coding attempt activity for a bot
 */
export async function createLiveCodingActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Find a live coding challenge
    let quizId = options.quizId || options.targetId;

    if (!quizId) {
      const availableQuizzes = await db.quiz.findMany({
        where: {
          type: "LIVE_CODING",
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
        },
      });

      if (availableQuizzes.length === 0) {
        return {
          success: false,
          error: "No live coding challenges found",
        };
      }

      const selectedQuiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
      quizId = selectedQuiz.id;
    }

    // Get bot character for realistic metrics
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        character: true,
      },
    });

    const traits = bot?.character?.traits as any;
    const technicalLevel = traits?.technicalLevel || "intermediate";

    // Generate realistic metrics based on technical level
    const qualityScores = {
      beginner: { min: 40, max: 70 },
      intermediate: { min: 60, max: 85 },
      advanced: { min: 75, max: 95 },
      expert: { min: 85, max: 100 },
    };

    const scoreRange = qualityScores[technicalLevel as keyof typeof qualityScores] || qualityScores.intermediate;
    const codeQuality = Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min;
    const completionTime = Math.floor(Math.random() * 30) + 10; // 10-40 minutes

    // Create live coding attempt
    const attempt = await db.liveCodingAttempt.create({
      data: {
        userId,
        quizId,
        metrics: {
          codeQuality,
          completionTime,
          testResults: {
            passed: codeQuality > 60,
            testCases: Math.floor(Math.random() * 5) + 1,
          },
        },
        code: `// Bot-generated code\nfunction solution() {\n  // Implementation\n}`,
      },
    });

    return {
      success: true,
      activityId: attempt.id,
    };
  } catch (error: any) {
    console.error(`[BOT_LIVE_CODING_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create live coding attempt",
    };
  }
}

