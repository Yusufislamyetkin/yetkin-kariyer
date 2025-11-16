import { db } from "@/lib/db";

const DIRECT_SLUG_PREFIX = "dm-";

function normalizeParticipantIds(userA: string, userB: string) {
  return [userA, userB].sort((left, right) => (left > right ? 1 : left < right ? -1 : 0));
}

export function buildDirectThreadIdentifiers(userA: string, userB: string) {
  const [first, second] = normalizeParticipantIds(userA, userB);
  return {
    id: `dm_${first}_${second}`,
    slug: `${DIRECT_SLUG_PREFIX}${first}-${second}`,
  };
}

export async function ensureDirectThread(userA: string, userB: string) {
  const { id, slug } = buildDirectThreadIdentifiers(userA, userB);

  const group = await db.chatGroup.upsert({
    where: { slug },
    update: {
      updatedAt: new Date(),
    },
    create: {
      id,
      name: "Direct Chat",
      slug,
      description: null,
      expertise: null,
    },
  });

  await Promise.all(
    normalizeParticipantIds(userA, userB).map((participantId) =>
      db.chatGroupMembership.upsert({
        where: {
          groupId_userId: {
            groupId: group.id,
            userId: participantId,
          },
        },
        update: {},
        create: {
          groupId: group.id,
          userId: participantId,
        },
      })
    )
  );

  return group;
}

export async function getDirectThreadWithParticipants(threadId: string) {
  return db.chatGroup.findUnique({
    where: { id: threadId },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
}

export function isDirectThreadSlug(slug: string) {
  return slug.startsWith(DIRECT_SLUG_PREFIX);
}


