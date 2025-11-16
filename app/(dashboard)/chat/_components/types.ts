export type ChatAttachmentType = "image" | "audio" | "video" | "file" | "gif";

export type ChatAttachment = {
  id: string;
  messageId: string;
  url: string;
  type: ChatAttachmentType;
  metadata?: Record<string, unknown> | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  createdAt: string;
};

export type ChatSender = {
  id: string;
  name: string | null;
  profileImage?: string | null;
};

export type ChatMessage = {
  id: string;
  groupId: string;
  userId: string;
  type: "text" | ChatAttachmentType | "system";
  content?: string | null;
  mentionIds: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  attachments: ChatAttachment[];
  sender: ChatSender;
  readByUserIds?: string[];
};

export type PresenceEntry = {
  status: "online" | "offline";
  lastSeenAt?: string | null;
};

export type PresenceState = Record<string, PresenceEntry>;

export type GroupMember = {
  id: string;
  role: string;
  isMuted: boolean;
  lastSeenAt: string | null;
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  presence: PresenceEntry;
};

export type LocalAttachment = {
  id: string;
  file: File;
  preview?: string;
  type: ChatAttachmentType;
};

export type FriendOption = {
  id: string;
  name: string | null;
  email?: string | null;
  profileImage: string | null;
};

export type CreateGroupFormValues = {
  name: string;
  description: string;
  expertise: string;
  visibility: "public" | "private";
  allowLinkJoin: boolean;
  memberIds: string[];
};

