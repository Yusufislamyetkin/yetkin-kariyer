import { db } from "@/lib/db";

export interface GoalCheckResult {
  updated: boolean;
  updatedGoals: any[];
  completedGoals: any[];
}

interface GoalCheckParams {
  userId: string;
  date?: Date; // Optional date, defaults to today
}

export async function checkGoalsForToday({
  userId,
  date,
}: GoalCheckParams): Promise<GoalCheckResult> {
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  // Get all goals for the date (including completed ones to update currentValue)
  const goals = await db.dailyGoal.findMany({
    where: {
      userId,
      date: targetDate,
    },
  });

  if (goals.length === 0) {
    return { updated: false, updatedGoals: [], completedGoals: [] };
  }

  const dateStart = new Date(targetDate);
  const dateEnd = new Date(targetDate);
  dateEnd.setDate(dateEnd.getDate() + 1);

  const dateAttempts = await db.quizAttempt.findMany({
    where: {
      userId,
      completedAt: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  const updatedGoals: any[] = [];
  const completedGoals: any[] = [];

  for (const goal of goals) {
    let newCurrentValue = goal.currentValue;
    let completed = goal.completed;

    switch (goal.goalType) {
      case "test_count":
        newCurrentValue = dateAttempts.length;
        if (newCurrentValue >= goal.targetValue && !completed) {
          completed = true;
        }
        break;
      case "score_target":
        if (dateAttempts.length > 0) {
          const avgScore =
            dateAttempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0) /
            dateAttempts.length;
          newCurrentValue = Math.round(avgScore);
          if (newCurrentValue >= goal.targetValue && !completed) {
            completed = true;
          }
        }
        break;
      case "topic_complete":
        const dateTopics = new Set(
          dateAttempts
            .map((a: { topic: string | null | undefined }) => a.topic)
            .filter(
              (topic: string | null | undefined): topic is string =>
                topic !== null && topic !== undefined
            )
        );
        newCurrentValue = dateTopics.size;
        if (newCurrentValue >= goal.targetValue && !completed) {
          completed = true;
        }
        break;
      case "streak_maintain":
        const streak = await db.userStreak.findUnique({
          where: { userId },
        });
        if (streak && streak.currentStreak >= goal.targetValue && !completed) {
          newCurrentValue = streak.currentStreak;
          completed = true;
        }
        break;
    }

    if (newCurrentValue !== goal.currentValue || completed !== goal.completed) {
      const updated = await db.dailyGoal.update({
        where: { id: goal.id },
        data: {
          currentValue: newCurrentValue,
          completed,
          completedAt: completed ? new Date() : undefined,
        },
      });

      updatedGoals.push(updated);
      if (completed) {
        completedGoals.push(updated);
      }
    }
  }

  return {
    updated: updatedGoals.length > 0,
    updatedGoals,
    completedGoals,
  };
}

