import { Module } from '@nestjs/common';
import Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { DbModule } from './db/db.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        DYNAMO_ACCESS_KEY_ID: Joi.string().required(),
        DYNAMO_SECRET_ACCESS_KEY: Joi.string().required(),
        DYNAMO_REGION: Joi.string().required(),
      }),
    }),
    RedisModule,
    DbModule,
    DynamodbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
