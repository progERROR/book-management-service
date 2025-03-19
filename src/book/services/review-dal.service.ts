import { Injectable } from '@nestjs/common';
import { InjectModel, Item, Model } from 'nestjs-dynamoose';
import { Review, ReviewKey } from '../../dynamodb/schemas/review.schema';

@Injectable()
export class ReviewDalService {
  constructor(
    @InjectModel('Review')
    private reviewModel: Model<Review, ReviewKey>,
  ) {}

  public async createReview(review: Review): Promise<Item<Review>> {
    return this.reviewModel.create(review);
  }

  public async getReviewsByBookId(bookId: string): Promise<Item<Review>[]> {
    return this.reviewModel.scan('bookId').eq(bookId).exec();
  }
}
