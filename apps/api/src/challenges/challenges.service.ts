import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';
import {
  Participation,
  ParticipationDocument,
} from './schemas/participation.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { MarkProgressDto } from './dto/mark-progress.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ChallengeResponseDto } from './dto/challenge-response.dto';
import { ParticipationResponseDto } from './dto/participation-response.dto';
import {
  LeaderboardResponseDto,
  LeaderboardEntryDto,
} from './dto/leaderboard-response.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Participation.name)
    private participationModel: Model<ParticipationDocument>
  ) {
    // Start scheduled job for leaderboard updates
    this.startScheduledUpdates();
  }

  // CRUD Operations
  async createChallenge(
    createChallengeDto: CreateChallengeDto
  ): Promise<ChallengeResponseDto> {
    const challenge = new this.challengeModel(createChallengeDto);
    const savedChallenge = await challenge.save();
    return this.toChallengeResponseDto(savedChallenge);
  }

  async getChallenges(query: PaginationQueryDto): Promise<{
    challenges: ChallengeResponseDto[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { limit = 20, cursor, active, type, upcoming } = query;

    const filter: any = {};

    if (active !== undefined) {
      filter.isActive = active;
    }

    if (type) {
      filter.type = type;
    }

    if (upcoming === 'true') {
      filter.startDate = { $gt: new Date() };
    }

    let queryBuilder = this.challengeModel.find(filter).sort({ createdAt: -1 });

    if (cursor) {
      queryBuilder = queryBuilder.where('_id').lt(cursor as any);
    }

    const challenges = await queryBuilder.limit(limit + 1).exec();

    const hasMore = challenges.length > limit;
    const result = hasMore ? challenges.slice(0, -1) : challenges;

    return {
      challenges: result.map(challenge =>
        this.toChallengeResponseDto(challenge)
      ),
      hasMore,
      nextCursor: hasMore
        ? result[result.length - 1]._id.toString()
        : undefined,
    };
  }

  async getChallengeById(id: string): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    return this.toChallengeResponseDto(challenge);
  }

  async updateChallenge(
    id: string,
    updateChallengeDto: UpdateChallengeDto
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel
      .findByIdAndUpdate(id, updateChallengeDto, { new: true })
      .exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    return this.toChallengeResponseDto(challenge);
  }

  async deleteChallenge(id: string): Promise<void> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    // TODO: Remove heroImage from Cloudinary if publicId exists
    if (challenge.heroImage?.publicId) {
      // await cloudinary.uploader.destroy(challenge.heroImage.publicId);
    }

    // Delete all participations for this challenge
    await this.participationModel.deleteMany({ challengeId: id }).exec();

    await this.challengeModel.findByIdAndDelete(id).exec();
  }

  // Participation Operations
  async joinChallenge(
    challengeId: string,
    userGymId: string,
    userName: string,
    joinDto: JoinChallengeDto
  ): Promise<ParticipationResponseDto> {
    const challenge = await this.challengeModel.findById(challengeId).exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.isActive) {
      throw new BadRequestException('Challenge is not active');
    }

    if (challenge.endDate && new Date() > challenge.endDate) {
      throw new BadRequestException('Challenge has ended');
    }

    // Check if user is already participating
    const existingParticipation = await this.participationModel
      .findOne({
        challengeId,
        userGymId,
      })
      .exec();

    if (existingParticipation) {
      throw new ConflictException(
        'User is already participating in this challenge'
      );
    }

    // Initialize progress array based on challenge type and duration
    const progress = this.initializeProgress(challenge, joinDto.startAt);

    const participation = new this.participationModel({
      challengeId,
      userGymId,
      userName,
      progress,
      joinedAt: new Date(),
      lastActivityAt: new Date(),
    });

    const savedParticipation = await participation.save();

    // Update challenge participant count
    await this.updateChallengeStats(challengeId);

    return this.toParticipationResponseDto(savedParticipation);
  }

  async getParticipation(
    challengeId: string,
    userGymId: string
  ): Promise<ParticipationResponseDto> {
    const participation = await this.participationModel
      .findOne({
        challengeId,
        userGymId,
      })
      .exec();

    if (!participation) {
      throw new NotFoundException('Participation not found');
    }

    return this.toParticipationResponseDto(participation);
  }

  async markProgress(
    challengeId: string,
    userGymId: string,
    markProgressDto: MarkProgressDto
  ): Promise<ParticipationResponseDto> {
    const challenge = await this.challengeModel.findById(challengeId).exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const participation = await this.participationModel
      .findOne({
        challengeId,
        userGymId,
      })
      .exec();

    if (!participation) {
      throw new NotFoundException(
        'User is not participating in this challenge'
      );
    }

    // Validate day is within challenge range
    const totalDays = this.getTotalDays(challenge);
    if (markProgressDto.day < 1 || markProgressDto.day > totalDays) {
      throw new BadRequestException(`Day must be between 1 and ${totalDays}`);
    }

    // Update or create progress entry
    const progressIndex = participation.progress.findIndex(
      p => p.day === markProgressDto.day
    );
    const progressEntry = {
      day: markProgressDto.day,
      completed: markProgressDto.completed,
      updatedAt: new Date(),
    };

    if (progressIndex >= 0) {
      participation.progress[progressIndex] = progressEntry;
    } else {
      participation.progress.push(progressEntry);
    }

    // Recalculate stats
    this.recalculateParticipationStats(participation);
    participation.lastActivityAt = new Date();

    const savedParticipation = await participation.save();

    // Update challenge stats
    await this.updateChallengeStats(challengeId);

    return this.toParticipationResponseDto(savedParticipation);
  }

  async getLeaderboard(
    challengeId: string,
    limit: number = 10
  ): Promise<LeaderboardResponseDto> {
    const challenge = await this.challengeModel.findById(challengeId).exec();
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const participations = await this.participationModel
      .find({ challengeId })
      .sort({
        percentComplete: -1,
        completedCount: -1,
        longestStreak: -1,
        lastActivityAt: -1,
      })
      .limit(limit)
      .exec();

    const entries: LeaderboardEntryDto[] = participations.map(
      (participation, index) => ({
        userGymId: participation.userGymId,
        userName: participation.userName,
        percentComplete: participation.percentComplete,
        completedCount: participation.completedCount,
        longestStreak: participation.longestStreak,
        currentStreak: participation.currentStreak,
        metadata: participation.metadata,
        rank: index + 1,
      })
    );

    const totalParticipants = await this.participationModel
      .countDocuments({ challengeId })
      .exec();

    return {
      challengeId,
      entries,
      totalParticipants,
    };
  }

  async getUserChallenges(userGymId: string): Promise<ChallengeResponseDto[]> {
    const participations = await this.participationModel
      .find({ userGymId })
      .populate('challengeId')
      .exec();

    return participations.map(participation =>
      this.toChallengeResponseDto(participation.challengeId as any)
    );
  }

  async leaveChallenge(challengeId: string, userGymId: string): Promise<void> {
    const participation = await this.participationModel
      .findOneAndDelete({
        challengeId,
        userGymId,
      })
      .exec();

    if (!participation) {
      throw new NotFoundException('Participation not found');
    }

    // Update challenge stats
    await this.updateChallengeStats(challengeId);
  }

  // Helper Methods
  private initializeProgress(
    challenge: ChallengeDocument,
    startAt?: string
  ): { day: number; completed: boolean; updatedAt: Date }[] {
    const startDate = startAt ? new Date(startAt) : new Date();
    const totalDays = this.getTotalDays(challenge);

    const progress = [];
    for (let day = 1; day <= totalDays; day++) {
      progress.push({
        day,
        completed: false,
        updatedAt: startDate,
      });
    }

    return progress;
  }

  private getTotalDays(challenge: ChallengeDocument): number {
    if (challenge.tasks && challenge.tasks.length > 0) {
      return Math.max(...challenge.tasks.map(task => task.day));
    }

    if (challenge.startDate && challenge.endDate) {
      const diffTime =
        challenge.endDate.getTime() - challenge.startDate.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return 30; // Default 30 days
  }

  private recalculateParticipationStats(
    participation: ParticipationDocument
  ): void {
    const completedEntries = participation.progress.filter(p => p.completed);
    participation.completedCount = completedEntries.length;

    const totalDays = participation.progress.length;
    participation.percentComplete =
      totalDays > 0
        ? Math.round((participation.completedCount / totalDays) * 100)
        : 0;

    // Calculate streaks
    const sortedProgress = participation.progress
      .filter(p => p.completed)
      .sort((a, b) => b.day - a.day);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedProgress.length; i++) {
      if (i === 0 || sortedProgress[i].day === sortedProgress[i - 1].day - 1) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    participation.longestStreak = longestStreak;
    participation.currentStreak = currentStreak;
  }

  private async updateChallengeStats(challengeId: string): Promise<void> {
    const participations = await this.participationModel
      .find({ challengeId })
      .exec();
    const totalParticipants = participations.length;

    const averageCompletion =
      totalParticipants > 0
        ? Math.round(
            participations.reduce((sum, p) => sum + p.percentComplete, 0) /
              totalParticipants
          )
        : 0;

    // Get top 10 for cached leaderboard
    const topParticipants = participations
      .sort((a, b) => {
        if (b.percentComplete !== a.percentComplete)
          return b.percentComplete - a.percentComplete;
        if (b.completedCount !== a.completedCount)
          return b.completedCount - a.completedCount;
        if (b.longestStreak !== a.longestStreak)
          return b.longestStreak - a.longestStreak;
        return a.lastActivityAt.getTime() - b.lastActivityAt.getTime();
      })
      .slice(0, 10)
      .map(p => ({
        userGymId: p.userGymId,
        userName: p.userName,
        percentComplete: p.percentComplete,
        completedCount: p.completedCount,
        longestStreak: p.longestStreak,
        currentStreak: p.currentStreak,
      }));

    await this.challengeModel
      .findByIdAndUpdate(challengeId, {
        totalParticipants,
        averageCompletion,
        cachedLeaderboard: topParticipants,
      })
      .exec();
  }

  private startScheduledUpdates(): void {
    // TODO: Replace with BullMQ/Redis for production scale
    setInterval(
      async () => {
        try {
          const activeChallenges = await this.challengeModel
            .find({ isActive: true })
            .exec();

          for (const challenge of activeChallenges) {
            await this.updateChallengeStats(challenge._id.toString());
          }
        } catch (error) {
          console.error('Error updating challenge stats:', error);
        }
      },
      10 * 60 * 1000
    ); // Every 10 minutes
  }

  // Response DTOs
  private toChallengeResponseDto(
    challenge: ChallengeDocument
  ): ChallengeResponseDto {
    return {
      _id: challenge._id.toString(),
      title: challenge.title,
      description: challenge.description,
      heroImage: challenge.heroImage,
      type: challenge.type,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      tasks: challenge.tasks,
      tags: challenge.tags,
      isActive: challenge.isActive,
      totalParticipants: challenge.totalParticipants,
      averageCompletion: challenge.averageCompletion,
      cachedLeaderboard: challenge.cachedLeaderboard,
      createdAt: (challenge as any).createdAt,
      updatedAt: (challenge as any).updatedAt,
    };
  }

  private toParticipationResponseDto(
    participation: ParticipationDocument
  ): ParticipationResponseDto {
    return {
      _id: participation._id.toString(),
      challengeId: participation.challengeId,
      userGymId: participation.userGymId,
      userName: participation.userName,
      progress: participation.progress,
      completedCount: participation.completedCount,
      currentStreak: participation.currentStreak,
      longestStreak: participation.longestStreak,
      percentComplete: participation.percentComplete,
      metadata: participation.metadata,
      joinedAt: participation.joinedAt,
      lastActivityAt: participation.lastActivityAt,
      createdAt: (participation as any).createdAt,
      updatedAt: (participation as any).updatedAt,
    };
  }
}
