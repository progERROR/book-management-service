import { RedisService } from '../redis.service';
import Redis from 'ioredis-mock';
import { Test, TestingModule } from '@nestjs/testing';

describe('RedisService', () => {
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: new Redis(),
        },
      ],
    }).compile();

    redisService = module.get(RedisService);
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });
  describe('set Redis key/value cache', () => {
    it('key/value should be set', async () => {
      await expect(redisService.set('key', 'value')).resolves.not.toThrow();
    });
  });
  describe('get Redis cache value by key', () => {
    it('should return the value for a given key', async () => {
      await redisService.set('key', 'value');
      const value = await redisService.get('key');
      expect(value).toBe('value');
    });
  });
});
