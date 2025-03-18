import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
  ) {}

  public async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value, 'EX', 24 * 3600);
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
