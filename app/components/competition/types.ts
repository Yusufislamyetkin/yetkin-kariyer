export interface LeaderboardUser {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
}

export interface LeaderboardMetrics {
  topicCompletion: number;
  test: number;
  liveCoding: number;
  bugFix: number;
  hackaton: number;
}

export interface LeaderboardAttempts {
  quiz?: number;
  test?: number;
  liveCoding?: number;
  bugFix?: number;
  hackaton?: number;
}

export interface LeaderboardScores {
  quiz?: number;
  test?: number;
  liveCoding?: number;
  bugFix?: number;
  hackaton?: number;
}

export interface LeaderboardBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface LeaderboardEntry {
  userId: string;
  user: LeaderboardUser;
  rank: number;
  compositeScore: number;
  metrics: LeaderboardMetrics;
  attempts?: LeaderboardAttempts;
  highestScores?: LeaderboardScores;
  displayedBadges?: LeaderboardBadge[];
}

