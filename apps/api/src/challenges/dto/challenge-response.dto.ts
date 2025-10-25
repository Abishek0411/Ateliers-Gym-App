export class ChallengeResponseDto {
  _id: string;
  title: string;
  description?: string;
  heroImage?: { url: string; publicId?: string };
  type: 'streak' | 'daily' | 'task';
  startDate: Date;
  endDate: Date;
  tasks?: { day: number; task: string }[];
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
  createdAt: Date;
  updatedAt: Date;
}
