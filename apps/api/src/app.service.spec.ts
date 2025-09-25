import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return welcome message', () => {
    expect(service.getHello()).toBe("Welcome to Atelier's Fitness API! 💪");
  });

  it('should return health status', () => {
    const health = service.getHealth();
    expect(health).toHaveProperty('status', 'healthy');
    expect(health).toHaveProperty('timestamp');
    expect(new Date(health.timestamp)).toBeInstanceOf(Date);
  });
});
