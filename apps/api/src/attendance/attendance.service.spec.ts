import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './schemas/attendance.schema';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let mockAttendanceModel: any;

  beforeEach(async () => {
    mockAttendanceModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      sort: jest.fn(),
      exec: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getModelToken(Attendance.name),
          useValue: mockAttendanceModel,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkIn', () => {
    it('should create a new attendance record when user has not checked in today', async () => {
      const userId = 'GYM001';
      const checkInDto = {};

      mockAttendanceModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const mockAttendance = {
        userId,
        date: new Date(),
        checkInTime: new Date(),
        isManual: false,
        save: jest.fn().mockResolvedValue({
          _id: 'attendance123',
          userId,
          date: new Date(),
          checkInTime: new Date(),
          isManual: false,
        }),
      };

      mockAttendanceModel.create.mockReturnValue(mockAttendance);

      await service.checkIn(userId, checkInDto);

      expect(mockAttendanceModel.findOne).toHaveBeenCalledWith({
        userId,
        date: expect.any(Object),
      });
      expect(mockAttendanceModel.create).toHaveBeenCalled();
      expect(mockAttendance.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when user already checked in today', async () => {
      const userId = 'GYM001';
      const checkInDto = {};

      mockAttendanceModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'existing123',
          userId,
          date: new Date(),
        }),
      });

      await expect(service.checkIn(userId, checkInDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('getAttendanceStats', () => {
    it('should return correct attendance stats', async () => {
      const userId = 'GYM001';
      const mockAttendances = [
        {
          _id: 'att1',
          userId,
          date: new Date('2025-10-01'),
          checkInTime: new Date(),
        },
        {
          _id: 'att2',
          userId,
          date: new Date('2025-10-02'),
          checkInTime: new Date(),
        },
        {
          _id: 'att3',
          userId,
          date: new Date('2025-10-03'),
          checkInTime: new Date(),
        },
      ];

      mockAttendanceModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockAttendances),
        }),
      });

      const result = await service.getAttendanceStats(userId);

      expect(result.checkedInDates).toHaveLength(3);
      expect(result.monthlyCount).toBe(3);
      expect(result.currentStreak).toBeGreaterThanOrEqual(0);
      expect(result.longestStreak).toBeGreaterThanOrEqual(0);
    });
  });
});
