import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReviewModel {
  @Field(() => ID)
  id: string;

  @Field()
  bookId: string;

  @Field()
  userName: string;

  @Field()
  content: string;
}