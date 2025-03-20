import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewDto {
  @Field()
  bookId: string;

  @Field()
  content: string;
}


export interface CreateReviewParams {
  bookId: string;
  content: string;
  userName: string;
}