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
 * Creates a bug fix attempt activity for a bot
 */
export async function createBugFixActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Find a bug fix challenge
    let quizId = options.quizId || options.targetId;

    if (!quizId) {
      const availableQuizzes = await db.quiz.findMany({
        where: {
          type: "BUG_FIX",
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
          error: "No bug fix challenges found",
        };
      }

      const selectedQuiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
      quizId = selectedQuiz.id;
    }

    // Get bot character for realistic metrics
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        botCharacter: true,
      },
    });

    const traits = bot?.botCharacter?.traits as any;
    const technicalLevel = traits?.technicalLevel || "intermediate";

    // Generate realistic metrics
    const fixRates = {
      beginner: 0.6,
      intermediate: 0.75,
      advanced: 0.9,
      expert: 0.95,
    };

    const fixRate = fixRates[technicalLevel as keyof typeof fixRates] || 0.75;
    const bugsFixed = Math.floor(Math.random() * 3) + 1; // 1-3 bugs
    const timeTaken = Math.floor(Math.random() * 25) + 5; // 5-30 minutes

    // Create bug fix attempt
    const attempt = await db.bugFixAttempt.create({
      data: {
        userId,
        quizId,
        metrics: {
          bugsFixed,
          timeTaken,
          codeQuality: Math.floor(fixRate * 100),
          allFixed: Math.random() < fixRate,
        },
        fixedCode: `// Bot-fixed code\nfunction fixedSolution() {\n  // Fixed implementation\n}`,
      },
    });

    return {
      success: true,
      activityId: attempt.id,
    };
  } catch (error: any) {
    console.error(`[BOT_BUGFIX_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create bug fix attempt",
    };
  }
}

