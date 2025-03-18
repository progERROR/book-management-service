import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DynamooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        aws: {
          accessKeyId: configService.get<string>('DYNAMO_ACCESS_KEY_ID'),
          secretAccessKey: configService.get<string>('DYNAMO_SECRET_ACCESS_KEY'),
          region: configService.get<string>('DYNAMO_REGION'),
        }
      })
    }),
  ],
})
export class DynamodbModule {}
