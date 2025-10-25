import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChallengesService } from '../challenges.service';
import { Challenge, ChallengeDocument } from '../schemas/challenge.schema';
import {
  Participation,
  ParticipationDocument,
} from '../schemas/participation.schema';
import { Model } from 'mongoose';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let challengeModel: Model<ChallengeDocument>;
  let participationModel: Model<ParticipationDocument>;

  const mockChallenge = {
    _id: 'challenge-id',
    title: '30-Day Fitness Challenge',
    description: 'Complete daily workouts for 30 days',
    type: 'daily',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    tasks: [
      { day: 1, task: 'Do 20 push-ups' },
      { day: 2, task: 'Run for 15 minutes' },
    ],
    tags: ['fitness', '30-day'],
    isActive: true,
    totalParticipants: 0,
    averageCompletion: 0,
    cachedLeaderboard: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockParticipation = {
    _id: 'participation-id',
    challengeId: 'challenge-id',
    userGymId: 'GYM001',
    userName: 'John Doe',
    progress: [
      { day: 1, completed: true, updatedAt: new Date() },
      { day: 2, completed: false, updatedAt: new Date() },
    ],
    completedCount: 1,
    currentStreak: 1,
    longestStreak: 1,
    percentComplete: 50,
    metadata: {},
    joinedAt: new Date(),
    lastActivityAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: getModelToken(Challenge.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockChallenge),
            constructor: jest.fn().mockResolvedValue(mockChallenge),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            lt: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(Participation.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockParticipation),
            constructor: jest.fn().mockResolvedValue(mockParticipation),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndDelete: jest.fn(),
            deleteMany: jest.fn(),
            countDocuments: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    challengeModel = module.get<Model<ChallengeDocument>>(
      getModelToken(Challenge.name)
    );
    participationModel = module.get<Model<ParticipationDocument>>(
      getModelToken(Participation.name)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChallenge', () => {
    it('should create a new challenge', async () => {
      const createChallengeDto = {
        title: '30-Day Fitness Challenge',
        description: 'Complete daily workouts for 30 days',
        type: 'daily' as const,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        tasks: [
          { day: 1, task: 'Do 20 push-ups' },
          { day: 2, task: 'Run for 15 minutes' },
        ],
        tags: ['fitness', '30-day'],
      };

      const mockChallengeInstance = {
        save: jest.fn().mockResolvedValue(mockChallenge),
      };

      jest
        .spyOn(challengeModel, 'constructor' as any)
        .mockReturnValue(mockChallengeInstance);

      const result = await service.createChallenge(createChallengeDto);

      expect(result).toEqual(mockChallenge);
      expect(mockChallengeInstance.save).toHaveBeenCalled();
    });
  });

  describe('joinChallenge', () => {
    it('should join a challenge successfully', async () => {
      jest.spyOn(challengeModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      } as any);

      jest.spyOn(participationModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const mockParticipationInstance = {
        save: jest.fn().mockResolvedValue(mockParticipation),
      };

      jest
        .spyOn(participationModel, 'constructor' as any)
        .mockReturnValue(mockParticipationInstance);

      const result = await service.joinChallenge(
        'challenge-id',
        'GYM001',
        'John Doe',
        {}
      );

      expect(result).toEqual(mockParticipation);
      expect(mockParticipationInstance.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if user is already participating', async () => {
      jest.spyOn(challengeModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      } as any);

      jest.spyOn(participationModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockParticipation),
      } as any);

      await expect(
        service.joinChallenge('challenge-id', 'GYM001', 'John Doe', {})
      ).rejects.toThrow('User is already participating in this challenge');
    });
  });

  describe('markProgress', () => {
    it('should mark progress successfully', async () => {
      jest.spyOn(challengeModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      } as any);

      const mockParticipationInstance = {
        ...mockParticipation,
        save: jest.fn().mockResolvedValue(mockParticipation),
      };

      jest.spyOn(participationModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockParticipationInstance),
      } as any);

      const result = await service.markProgress('challenge-id', 'GYM001', {
        day: 1,
        completed: true,
      });

      expect(result).toEqual(mockParticipation);
      expect(mockParticipationInstance.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if participation not found', async () => {
      jest.spyOn(challengeModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      } as any);

      jest.spyOn(participationModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.markProgress('challenge-id', 'GYM001', {
          day: 1,
          completed: true,
        })
      ).rejects.toThrow('User is not participating in this challenge');
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard entries', async () => {
      const mockLeaderboardEntries = [
        {
          userGymId: 'GYM001',
          userName: 'John Doe',
          percentComplete: 100,
          completedCount: 2,
          longestStreak: 2,
          currentStreak: 2,
          metadata: {},
        },
      ];

      jest.spyOn(challengeModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      } as any);

      jest.spyOn(participationModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockLeaderboardEntries),
      } as any);

      jest.spyOn(participationModel, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as any);

      const result = await service.getLeaderboard('challenge-id', 10);

      expect(result.challengeId).toBe('challenge-id');
      expect(result.entries).toHaveLength(1);
      expect(result.totalParticipants).toBe(1);
    });
  });
});
