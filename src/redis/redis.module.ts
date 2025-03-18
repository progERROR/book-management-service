import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';
import { redisProvider } from './redis.provider';

@Module({
  imports: [ConfigModule],
  providers: [redisProvider, RedisService],
  exports: [RedisService]
})
export class RedisModule {}
