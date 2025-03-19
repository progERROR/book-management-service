import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { BookService } from './services/book.service';
import { BookDalService } from './services/book-dal.service';
import { ReviewDalService } from './services/review-dal.service';
import User from '../db/entities/user.entity';
import Book from '../db/entities/book.entity';
import { UtilsModule } from '../utils/utils.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ReviewSchema } from '../dynamodb/schemas/review.schema';
import { BookResolver } from './book.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book]),
    ConfigModule,
    RedisModule,
    UtilsModule,
    DynamooseModule.forFeature([{
      name: 'Review',
      schema: ReviewSchema,
      options: {
        tableName: 'review',
      },
    }]),],
  providers: [BookService, BookDalService, ReviewDalService, BookResolver],
})
export class BookModule {}
