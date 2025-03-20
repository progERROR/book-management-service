import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { BookService } from './services/book.service';
import { ReviewModel } from './types/review.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateReviewDto } from './types/review.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRole } from '../db/entities/user.entity';

@Resolver(() => ReviewModel)
export class ReviewResolver {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Role(UserRole.REVIEWER)
  @Mutation(() => ReviewModel)
  public async addReview(
    @Args('createReviewDto') createReviewDto: CreateReviewDto,
    @Context() context
  ) {
    const userName = context.req.user.username;
    return this.bookService.addReview({
      ...createReviewDto,
      userName,
    })
  }
}