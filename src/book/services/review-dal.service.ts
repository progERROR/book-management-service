import { Injectable } from '@nestjs/common';
import { InjectModel, Item, Model } from 'nestjs-dynamoose';
import { Review, ReviewKey } from '../../dynamodb/schemas/review.schema';
import { CreateReviewParams } from '../types/review.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReviewDalService {
  constructor(
    @InjectModel('Review')
    private reviewModel: Model<Review, ReviewKey>,
  ) {}

  public async createReview(review: CreateReviewParams): Promise<Item<Review>> {
    return this.reviewModel.create({
      ...review,
      id: uuidv4(),
    });
  }

  public async getReviewsByBookId(bookId: string): Promise<Item<Review>[]> {
    return this.reviewModel.scan('bookId').eq(bookId).exec();
  }
}
