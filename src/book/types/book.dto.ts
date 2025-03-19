import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateBookDto {
  @Field()
  author: string;

  @Field()
  title: string;

  @Field()
  content: string;
}

@InputType()
export class UpdateBookDto extends PartialType(CreateBookDto) {}

export interface CreateBookParams {
  author: string;
  title: string;
  contentReference: string;
}