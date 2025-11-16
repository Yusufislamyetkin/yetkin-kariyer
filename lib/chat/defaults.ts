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

const DEFAULT_CHAT_GROUPS: DefaultChatGroup[] = [
  {
    id: "chat_backend_dotnet",
    name: "Backend .NET Core Yardımlaşma Grubu",
    slug: "backend-dotnet",
    expertise: ".NET Core",
    description: "ASP.NET Core, Entity Framework ve modern backend pratikleri üzerine yardımlaşma alanı.",
    visibility: "public",
    allowLinkJoin: false,
  },
  {
    id: "chat_frontend_react",
    name: "Frontend React Yardımlaşma Grubu",
    slug: "frontend-react",
    expertise: "React",
    description: "React, Next.js ve UI/UX geliştirme üzerine topluluk sohbeti.",
    visibility: "public",
    allowLinkJoin: false,
  },
  {
    id: "chat_devops_cloud",
    name: "DevOps & Cloud Topluluğu",
    slug: "devops-cloud",
    expertise: "DevOps",
    description: "CI/CD, konteyner, Kubernetes ve bulut mimarileri için bilgi paylaşım grubu.",
    visibility: "public",
    allowLinkJoin: false,
  },
];

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


