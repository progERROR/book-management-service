import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): RedisClient => {
    return new Redis({
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    });
  },
  provide: 'REDIS_CLIENT',
};
