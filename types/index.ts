export type UserRole = "candidate" | "employer" | "admin";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: "technical" | "behavioral" | "case";
  timeLimit?: number;
}

export interface AnalysisFocusArea {
  topic: string;
  accuracy: number;
  impact: "critical" | "major" | "moderate" | "minor";
  description: string;
  actions: string[];
}

export interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  score: number;
  feedback: string;
  summary?: string;
  detailedReport?: string;
  focusAreas?: AnalysisFocusArea[];
  nextSteps?: string[];
}

export type ChatMessageType =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "file"
  | "gif"
  | "system";

export type ChatAttachmentType = "image" | "audio" | "video" | "file" | "gif";

export interface ChatAttachment {
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
}

export interface ChatMessage {
  id: string;
  groupId: string;
  userId: string;
  type: ChatMessageType;
  content?: string | null;
  mentionIds: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  attachments: ChatAttachment[];
  readByUserIds?: string[];
}

export interface ChatMessageEventPayload {
  message: ChatMessage;
  sender: {
    id: string;
    name: string | null;
    profileImage?: string | null;
  };
}

export interface MentorRecommendation {
  title: string;
  summary: string;
  actionSteps: string[];
  timeframe: string;
  ctaLabel: string;
  ctaHref: string;
  category?: string;
  relatedGoalId?: string;
  metric?: string;
}

export interface MentorRecommendationsResponse {
  source?: string;
  recommendations: MentorRecommendation[];
}

