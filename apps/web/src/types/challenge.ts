export interface Challenge {
  _id: string;
  title: string;
  description?: string;
  heroImage?: {
    url: string;
    publicId?: string;
  };
  type: 'streak' | 'daily' | 'task';
  startDate: string;
  endDate: string;
  tasks?: Array<{
    day: number;
    task: string;
  }>;
  tags: string[];
  isActive: boolean;
  totalParticipants: number;
  averageCompletion: number;
  cachedLeaderboard: Array<{
    userGymId: string;
    userName: string;
    percentComplete: number;
    completedCount: number;
    longestStreak: number;
    currentStreak: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Participation {
  _id: string;
  challengeId: string;
  userGymId: string;
  userName: string;
  progress: Array<{
    day: number;
    completed: boolean;
    updatedAt: string;
  }>;
  completedCount: number;
  currentStreak: number;
  longestStreak: number;
  percentComplete: number;
  metadata: Record<string, any>;
  joinedAt: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  userGymId: string;
  userName: string;
  percentComplete: number;
  completedCount: number;
  longestStreak: number;
  currentStreak: number;
  metadata: Record<string, any>;
  rank: number;
}

export interface LeaderboardResponse {
  challengeId: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  userRank?: number;
}

export interface ChallengeFilters {
  active?: boolean;
  type?: string;
  upcoming?: boolean;
  limit?: number;
  cursor?: string;
}

export interface ChallengeListResponse {
  challenges: Challenge[];
  hasMore: boolean;
  nextCursor?: string;
}
