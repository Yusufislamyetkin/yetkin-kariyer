import { Hackathon, HackathonPhase } from "@prisma/client";

import { db } from "@/lib/db";

export interface PhaseMetadata {
  derivedPhase: HackathonPhase;
  isApplicationWindowOpen: boolean;
  isSubmissionWindowOpen: boolean;
  isJudgingWindowOpen: boolean;
}

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
};

export const computeHackathonPhase = (
  hackathon: Pick<
    Hackathon,
    | "applicationOpensAt"
    | "applicationClosesAt"
    | "submissionOpensAt"
    | "submissionClosesAt"
    | "judgingOpensAt"
    | "judgingClosesAt"
    | "archivedAt"
  >
): PhaseMetadata => {
  const now = new Date();
  const applicationOpensAt = toDate(hackathon.applicationOpensAt)!;
  const applicationClosesAt = toDate(hackathon.applicationClosesAt)!;
  const submissionOpensAt = toDate(hackathon.submissionOpensAt)!;
  const submissionClosesAt = toDate(hackathon.submissionClosesAt)!;
  const judgingOpensAt = toDate(hackathon.judgingOpensAt);
  const judgingClosesAt = toDate(hackathon.judgingClosesAt);
  const archivedAt = toDate(hackathon.archivedAt);

  let derivedPhase: HackathonPhase = HackathonPhase.draft;

  if (archivedAt) {
    derivedPhase = HackathonPhase.archived;
  } else if (now < applicationOpensAt) {
    derivedPhase = HackathonPhase.upcoming;
  } else if (now >= applicationOpensAt && now < applicationClosesAt) {
    derivedPhase = HackathonPhase.applications;
  } else if (now >= submissionOpensAt && now < submissionClosesAt) {
    derivedPhase = HackathonPhase.submission;
  } else if (
    judgingOpensAt &&
    now >= judgingOpensAt &&
    (!judgingClosesAt || now < judgingClosesAt)
  ) {
    derivedPhase = HackathonPhase.judging;
  } else if (now >= submissionClosesAt) {
    derivedPhase = HackathonPhase.completed;
  }

  const isApplicationWindowOpen =
    derivedPhase === HackathonPhase.applications &&
    now >= applicationOpensAt &&
    now <= applicationClosesAt;

  const isSubmissionWindowOpen =
    derivedPhase === HackathonPhase.submission &&
    now >= submissionOpensAt &&
    now <= submissionClosesAt;

  const isJudgingWindowOpen =
    derivedPhase === HackathonPhase.judging &&
    judgingOpensAt !== null &&
    now >= judgingOpensAt &&
    (judgingClosesAt === null || now <= judgingClosesAt);

  return {
    derivedPhase,
    isApplicationWindowOpen,
    isSubmissionWindowOpen,
    isJudgingWindowOpen,
  };
};

export const synchronizeHackathonPhase = async (
  hackathonId: string,
  currentPhase: HackathonPhase,
  derivedPhase: HackathonPhase
) => {
  if (currentPhase === derivedPhase) {
    return;
  }

  try {
    await db.hackathon.update({
      where: { id: hackathonId },
      data: { phase: derivedPhase },
    });
  } catch (error) {
    console.error("Failed to sync hackathon phase:", hackathonId, error);
  }
};

