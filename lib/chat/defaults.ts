import { db } from "@/lib/db";
import type { Prisma, ChatGroupVisibility } from "@prisma/client";

type DefaultChatGroup = {
  id: string;
  name: string;
  slug: string;
  expertise?: string | null;
  description?: string | null;
  visibility?: ChatGroupVisibility;
  allowLinkJoin?: boolean;
  inviteCode?: string | null;
};

// Eski yardımlaşma toplulukları kaldırıldı - artık kurs bazlı topluluklar kullanılıyor
const DEFAULT_CHAT_GROUPS: DefaultChatGroup[] = [];

const groupSelect: Prisma.ChatGroupSelect = {
  id: true,
  name: true,
  slug: true,
  expertise: true,
  description: true,
  visibility: true,
  allowLinkJoin: true,
  inviteCode: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
};

export async function ensureDefaultChatGroups() {
  const groups = await Promise.all(
    DEFAULT_CHAT_GROUPS.map(async (group) => {
      const persisted = await db.chatGroup.upsert({
        where: { slug: group.slug },
        update: {
          name: group.name,
          expertise: group.expertise,
          description: group.description,
          visibility: group.visibility ?? "public",
          allowLinkJoin: group.allowLinkJoin ?? false,
          inviteCode: group.inviteCode ?? null,
        },
        create: {
          id: group.id,
          name: group.name,
          slug: group.slug,
          expertise: group.expertise,
          description: group.description,
          visibility: group.visibility ?? "public",
          allowLinkJoin: group.allowLinkJoin ?? false,
          inviteCode: group.inviteCode ?? null,
          createdById: null,
        },
        select: groupSelect,
      });

      return persisted;
    })
  );

  return groups;
}

export const DEFAULT_CHAT_GROUP_IDS = DEFAULT_CHAT_GROUPS.map((group) => group.id);
export const DEFAULT_CHAT_GROUP_SLUGS = DEFAULT_CHAT_GROUPS.map((group) => group.slug);


