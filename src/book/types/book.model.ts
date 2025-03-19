import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReviewModel } from './review.model';

@ObjectType()
export class BookModel {
  @Field(() => ID)
  id: string;

  @Field()
  author: string;

  @Field()
  title: string;

  @Field()
  contentReference: string;
}

@ObjectType()
export class FullBookModel extends BookModel{
  @Field()
  content: string;

  @Field(() => [ReviewModel])
  reviews: ReviewModel[];
}