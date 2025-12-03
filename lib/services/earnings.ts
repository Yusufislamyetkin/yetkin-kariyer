import { db } from "@/lib/db";
import { EarningType, HackathonSubmissionStatus } from "@prisma/client";

interface RecordEarningParams {
  userId: string;
  type: EarningType;
  amount: number;
  referenceId?: string;
  metadata?: Record<string, any>;
}

/**
 * Records an earning for a user. Prevents duplicates by checking if an earning
 * with the same userId, type, and referenceId already exists.
 */
export async function recordEarning({
  userId,
  type,
  amount,
  referenceId,
  metadata,
}: RecordEarningParams): Promise<{ created: boolean; earning: any }> {
  // Check if earning already exists (prevent duplicates)
  if (referenceId) {
    const existing = await db.earning.findFirst({
      where: {
        userId,
        type,
        referenceId,
      },
    });

    if (existing) {
      return { created: false, earning: existing };
    }
  }

  // Create new earning
  const earning = await db.earning.create({
    data: {
      userId,
      type,
      amount,
      referenceId,
      metadata,
    },
  });

  return { created: true, earning };
}

/**
 * Records hackathon earnings for a user or team
 */
export async function recordHackathonEarning({
  userId,
  amount = 1000,
  submissionId,
  hackathonTitle,
  teamMemberIds = [],
}: {
  userId: string;
  amount?: number;
  submissionId: string;
  hackathonTitle?: string;
  teamMemberIds?: string[];
}): Promise<void> {
  const metadata = hackathonTitle ? { hackathonTitle } : undefined;

  // Record for the main user
  await recordEarning({
    userId,
    type: EarningType.HACKATHON,
    amount,
    referenceId: submissionId,
    metadata,
  });

  // Record for all team members
  for (const memberId of teamMemberIds) {
    if (memberId !== userId) {
      await recordEarning({
        userId: memberId,
        type: EarningType.HACKATHON,
        amount,
        referenceId: submissionId,
        metadata,
      });
    }
  }
}

/**
 * Records freelancer project earnings
 */
export async function recordFreelancerEarning({
  userId,
  amount,
  bidId,
  projectTitle,
}: {
  userId: string;
  amount: number;
  bidId: string;
  projectTitle?: string;
}): Promise<void> {
  const metadata = projectTitle ? { projectTitle } : undefined;

  await recordEarning({
    userId,
    type: EarningType.FREELANCER_PROJECT,
    amount,
    referenceId: bidId,
    metadata,
  });
}

/**
 * Records monthly leaderboard winner earnings
 */
export async function recordMonthlyWinnerEarning({
  userId,
  amount = 500,
  leaderboardEntryId,
  periodDate,
}: {
  userId: string;
  amount?: number;
  leaderboardEntryId: string;
  periodDate: string;
}): Promise<void> {
  // Check if earning already exists for this period to prevent duplicates
  const existing = await db.earning.findFirst({
    where: {
      userId,
      type: EarningType.MONTHLY_WINNER,
      metadata: {
        path: ["periodDate"],
        equals: periodDate,
      },
    },
  });

  if (existing) {
    return; // Already recorded for this period
  }

  await recordEarning({
    userId,
    type: EarningType.MONTHLY_WINNER,
    amount,
    referenceId: leaderboardEntryId,
    metadata: { periodDate },
  });
}

/**
 * Checks if a hackathon submission status changed to winner/finalist
 * and records earnings if needed. Call this after updating submission status.
 */
export async function checkAndRecordHackathonEarnings(
  submissionId: string,
  newStatus: HackathonSubmissionStatus,
  oldStatus?: HackathonSubmissionStatus
): Promise<void> {
  // Only record if status changed to winner or finalist
  if (newStatus !== "winner" && newStatus !== "finalist") {
    return;
  }

  // Skip if status didn't actually change
  if (oldStatus === newStatus) {
    return;
  }

  try {
    const submission = await db.hackathonSubmission.findUnique({
      where: { id: submissionId },
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
            prizesSummary: true,
          },
        },
        team: {
          include: {
            members: {
              where: {
                status: "active",
              },
              select: {
                userId: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!submission) {
      return;
    }

    // Calculate amount (default 1000, or from prizes if available)
    let amount = 1000;
    if (submission.hackathon.prizesSummary) {
      // Try to extract amount from prizesSummary if it's structured
      const prizes = submission.hackathon.prizesSummary as any;
      if (typeof prizes === "object" && prizes.amount) {
        amount = Number(prizes.amount) || 1000;
      }
    }

    const teamMemberIds = submission.team
      ? submission.team.members.map((m: { userId: string }) => m.userId)
      : [];
    const userId = submission.userId || (submission.team ? teamMemberIds[0] : null);

    if (!userId) {
      return;
    }

    await recordHackathonEarning({
      userId,
      amount,
      submissionId,
      hackathonTitle: submission.hackathon.title,
      teamMemberIds: submission.team ? teamMemberIds : [],
    });
  } catch (error) {
    console.error("Error recording hackathon earnings:", error);
    // Don't throw - earnings recording shouldn't break the main flow
  }
}

/**
 * Checks if a freelancer bid status changed to accepted
 * and records earnings if needed. Call this after updating bid status.
 */
export async function checkAndRecordFreelancerEarnings(
  bidId: string,
  newStatus: string,
  oldStatus?: string
): Promise<void> {
  // Only record if status changed to accepted
  if (newStatus !== "accepted") {
    return;
  }

  // Skip if status didn't actually change
  if (oldStatus === newStatus) {
    return;
  }

  try {
    const bid = await db.freelancerBid.findUnique({
      where: { id: bidId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!bid || !bid.user) {
      return;
    }

    await recordFreelancerEarning({
      userId: bid.user.id,
      amount: bid.amount,
      bidId,
      projectTitle: bid.project.title,
    });
  } catch (error) {
    console.error("Error recording freelancer earnings:", error);
    // Don't throw - earnings recording shouldn't break the main flow
  }
}

