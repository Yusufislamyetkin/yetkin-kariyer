import { db } from "@/lib/db";
import { createChatCompletion } from "@/lib/ai/client";

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
 * Creates a test attempt activity for a bot
 */
export async function createTestActivity(
  userId: string,
  options: ActivityOptions = {}
): Promise<ActivityResult> {
  try {
    // Get bot character
    const bot = await db.user.findUnique({
      where: { id: userId, isBot: true },
      include: {
        botCharacter: true,
      },
    });

    if (!bot || !bot.botCharacter) {
      return {
        success: false,
        error: "Bot character not found",
      };
    }

    // Find a test to take
    let quizId = options.quizId || options.targetId;

    if (!quizId) {
      // Find available tests
      const availableQuizzes = await db.quiz.findMany({
        where: {
          type: "TEST",
        },
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          level: true,
          questions: true,
          passingScore: true,
        },
      });

      if (availableQuizzes.length === 0) {
        return {
          success: false,
          error: "No tests found",
        };
      }

      // Pick a random test that matches bot's expertise
      const botExpertise = bot.botCharacter.expertise || [];
      const matchingQuizzes = availableQuizzes.filter((q: any) => {
        const titleLower = q.title?.toLowerCase() || "";
        return botExpertise.some((exp: any) => titleLower.includes(exp.toLowerCase()));
      });

      const quizzesToChoose = matchingQuizzes.length > 0 ? matchingQuizzes : availableQuizzes;
      const selectedQuiz = quizzesToChoose[Math.floor(Math.random() * quizzesToChoose.length)];
      quizId = selectedQuiz.id;
    }

    // Get the quiz
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        questions: true,
        passingScore: true,
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "Test not found",
      };
    }

    const questions = quiz.questions as any;
    const questionsArray = Array.isArray(questions) ? questions : (questions?.questions || []);

    if (questionsArray.length === 0) {
      return {
        success: false,
        error: "Test has no questions",
      };
    }

    // Generate answers based on bot's technical level
    const traits = bot.botCharacter.traits as any;
    const technicalLevel = traits?.technicalLevel || "intermediate";
    
    // Calculate success rate based on technical level
    const successRates = {
      beginner: 0.5,
      intermediate: 0.7,
      advanced: 0.85,
      expert: 0.95,
    };
    const successRate = successRates[technicalLevel as keyof typeof successRates] || 0.7;

    const answers: Record<string, any> = {};
    let correctCount = 0;

    for (const question of questionsArray) {
      const isCorrect = Math.random() < successRate;
      
      if (isCorrect && question.correctAnswer) {
        answers[question.id || question.questionId] = question.correctAnswer;
        correctCount++;
      } else {
        // Generate wrong answer
        const options = question.options || [];
        const wrongOptions = options.filter((opt: any) => opt !== question.correctAnswer);
        answers[question.id || question.questionId] = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || "A";
      }
    }

    const score = Math.round((correctCount / questionsArray.length) * 100);

    // Create test attempt
    const attempt = await db.testAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        metrics: {
          score,
          totalQuestions: questionsArray.length,
          correctCount,
          answers,
        },
      },
    });

    return {
      success: true,
      activityId: attempt.id,
    };
  } catch (error: any) {
    console.error(`[BOT_TEST_ACTIVITY] Error for user ${userId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to create test attempt",
    };
  }
}

