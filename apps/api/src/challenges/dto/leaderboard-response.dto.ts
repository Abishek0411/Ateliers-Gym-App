export class LeaderboardEntryDto {
  userGymId: string;
  userName: string;
  percentComplete: number;
  completedCount: number;
  longestStreak: number;
  currentStreak: number;
  metadata: Record<string, any>;
  rank: number;
}

export class LeaderboardResponseDto {
  challengeId: string;
  entries: LeaderboardEntryDto[];
  totalParticipants: number;
  userRank?: number; // Current user's rank if they're participating
}
