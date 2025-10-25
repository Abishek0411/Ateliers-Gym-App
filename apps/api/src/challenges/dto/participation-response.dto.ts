export class ParticipationResponseDto {
  _id: string;
  challengeId: string;
  userGymId: string;
  userName: string;
  progress: { day: number; completed: boolean; updatedAt: Date }[];
  completedCount: number;
  currentStreak: number;
  longestStreak: number;
  percentComplete: number;
  metadata: Record<string, any>;
  joinedAt: Date;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
