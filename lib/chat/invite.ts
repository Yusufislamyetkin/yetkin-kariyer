import { randomUUID } from "crypto";

import type { PrismaClient } from "@prisma/client";

import { db } from "@/lib/db";

const INVITE_CODE_LENGTH = 10;
const MAX_INVITE_CODE_ATTEMPTS = 32;

function buildInviteCodeCandidate() {
  return randomUUID().replace(/-/g, "").slice(0, INVITE_CODE_LENGTH).toUpperCase();
}

type ChatGroupClient = Pick<PrismaClient, "chatGroup">;

export async function generateUniqueGroupInviteCode(
  prisma: ChatGroupClient = db,
  maxAttempts: number = MAX_INVITE_CODE_ATTEMPTS
) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = buildInviteCodeCandidate();
    if (!candidate || candidate.length < INVITE_CODE_LENGTH) {
      continue;
    }

    const exists = await prisma.chatGroup.findFirst({
      where: { inviteCode: candidate },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }
  }

  throw new Error("Benzersiz davet kodu üretilemedi.");
}


